import {
  CHARACTERS,
  CHARACTER_MAP,
  FACTION_MAP,
  FACTIONS,
  RELATIONS,
  RELATION_META,
  RELATION_ORDER,
  type Character,
  type FactionId,
  type RelationType,
} from './data.js';
import {
  renderEmptyHTML,
  renderFactionHTML,
  renderProfileHTML,
} from './render.js';

/* ------------------------------------------------------------------ */
/* Tipos auxiliares                                                    */
/* ------------------------------------------------------------------ */

interface HtmxContext {
  target?: string | Element;
  select?: string;
  swap?: string;
  source?: Element;
}

interface HtmxApi {
  ajax: (verb: string, path: string, context?: HtmxContext | string) => void;
  process: (element: Element) => void;
}

declare global {
  interface Window {
    htmx?: HtmxApi;
  }
}

interface SimNode {
  char: Character;
  x: number;
  y: number;
  vx: number;
  vy: number;
  el: HTMLButtonElement;
  visible: boolean;
  pinned: boolean;
  degree: number;
}

interface SimEdge {
  relation: (typeof RELATIONS)[number];
  a: SimNode;
  b: SimNode;
  path: SVGPathElement;
  curve: number;
  visible: boolean;
}

interface EdgeDraft {
  relation: (typeof RELATIONS)[number];
  a: SimNode;
  b: SimNode;
}

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

const WORLD_W = 1400;
const WORLD_H = 1050;
const CENTER = { x: WORLD_W / 2, y: WORLD_H / 2 };

const FACTION_ANCHORS: Record<FactionId, { x: number; y: number }> = {
  ancients: { x: 700, y: 120 },
  heroes: { x: 420, y: 360 },
  villains: { x: 980, y: 360 },
  horde: { x: 205, y: 610 },
  snake: { x: 1195, y: 610 },
  rebellion: { x: 470, y: 875 },
  new: { x: 965, y: 885 },
};

const SPRING_LENGTH: Record<RelationType, number> = {
  family: 95,
  romance: 90,
  mentor: 120,
  ally: 135,
  serves: 120,
  rival: 150,
  enemy: 170,
  legacy: 150,
};

const SPRING_K = 0.0075;
const ANCHOR_K = 0.013;
const CENTER_K = 0.0015;
const REPULSION = 24000;
const COLLISION = 86;
const DAMPING = 0.84;
const MAX_SPEED = 11;

const MIN_ZOOM = 0.26;
const MAX_ZOOM = 2.4;

/* ------------------------------------------------------------------ */
/* DOM                                                                 */
/* ------------------------------------------------------------------ */

function qs<T extends Element>(selector: string): T {
  const found = document.querySelector<T>(selector);
  if (!found) throw new Error(`Elemento não encontrado: ${selector}`);
  return found;
}

const mapShell = qs<HTMLElement>('#map-shell');
const world = qs<HTMLElement>('#world');
const nodesHost = qs<HTMLElement>('#nodes');
const edgeSvg = qs<SVGSVGElement>('#edges');
const detailBody = qs<HTMLElement>('#detail-body');
const detailTitle = qs<HTMLElement>('#detail-title');
const detailClose = qs<HTMLButtonElement>('#detail-close');
const factionList = qs<HTMLElement>('#faction-list');
const legendList = qs<HTMLElement>('#legend-list');
const searchInput = qs<HTMLInputElement>('#search');
const searchStatus = qs<HTMLElement>('#search-status');
const zoomLabel = qs<HTMLElement>('#zoom-label');
const statusZoom = qs<HTMLElement>('#status-zoom');
const statusVisible = qs<HTMLElement>('#status-visible');
const statCharacters = qs<HTMLElement>('#stat-characters');
const statRelations = qs<HTMLElement>('#stat-relations');
const nodeTooltip = qs<HTMLElement>('#node-tooltip');
const loadingBar = qs<HTMLElement>('#loading-bar');
const tickerTrack = qs<HTMLElement>('#ticker-track');
const soundButton = qs<HTMLButtonElement>('#btn-sound');
const crtButton = qs<HTMLButtonElement>('#btn-crt');
const shuffleButton = qs<HTMLButtonElement>('#btn-shuffle');
const fitButton = qs<HTMLButtonElement>('#btn-fit');
const zoomInButton = qs<HTMLButtonElement>('#btn-zoom-in');
const zoomOutButton = qs<HTMLButtonElement>('#btn-zoom-out');

/* ------------------------------------------------------------------ */
/* Estado                                                              */
/* ------------------------------------------------------------------ */

const nodes: SimNode[] = [];
const nodeById = new Map<string, SimNode>();
const edges: SimEdge[] = [];
const neighbors = new Map<string, Set<string>>();

const activeFactions = new Set<FactionId>(FACTIONS.map((faction) => faction.id));
const activeRelations = new Set<RelationType>(RELATION_ORDER);

let selectedId: string | null = null;
let hoveredId: string | null = null;
let searchQuery = '';
let alpha = 0;
let running = false;
let frozen = false;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let dragging:
  | {
      node: SimNode;
      grabX: number;
      grabY: number;
      startX: number;
      startY: number;
      moved: boolean;
    }
  | null = null;
let panning: {
  startX: number;
  startY: number;
  originX: number;
  originY: number;
} | null = null;
let suppressClickUntil = 0;
let pendingDetail: { kind: 'char' | 'faction'; id: string } | null = null;
let soundOn = false;
let audioContext: AudioContext | null = null;
let htmxRequestCount = 0;

const canUseHtmx = Boolean(window.htmx) && location.protocol !== 'file:';

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(0x1608);

function screenToWorld(clientX: number, clientY: number): { x: number; y: number } {
  const rect = mapShell.getBoundingClientRect();
  return {
    x: (clientX - rect.left - offsetX) / zoom,
    y: (clientY - rect.top - offsetY) / zoom,
  };
}

function getHtmx(): HtmxApi | null {
  return canUseHtmx && window.htmx ? window.htmx : null;
}

/* ------------------------------------------------------------------ */
/* Som 16-bit                                                          */
/* ------------------------------------------------------------------ */

function tone(frequency = 440, duration = 0.055, type: OscillatorType = 'square', volume = 0.035): void {
  if (!soundOn) return;
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === 'suspended') void audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch {
    /* sem áudio, sem drama */
  }
}

/* ------------------------------------------------------------------ */
/* Construção do grafo                                                 */
/* ------------------------------------------------------------------ */

function buildGraph(): void {
  CHARACTERS.forEach((character, index) => {
    const faction = FACTION_MAP.get(character.faction);
    if (!faction) return;

    const anchor = FACTION_ANCHORS[character.faction];
    const angle = random() * Math.PI * 2;
    const radius = 30 + random() * 135;

    const element = document.createElement('button');
    element.type = 'button';
    element.className = 'node';
    element.dataset.id = character.id;
    element.dataset.faction = character.faction;
    element.style.setProperty('--c1', character.colors[0]);
    element.style.setProperty('--c2', character.colors[1]);
    element.style.setProperty('--fc', faction.color);
    element.style.setProperty('--i', String(index));
    element.setAttribute('aria-label', `${character.name} — ${character.role}`);
    element.innerHTML = `
      <span class="node-avatar"><span class="node-glyph">${character.icon}</span></span>
      <span class="node-label">${escapeHtml(character.name)}</span>`;

    if (canUseHtmx) {
      element.setAttribute('hx-get', 'fragments/characters.html');
      element.setAttribute('hx-select', `#char-${character.id}`);
      element.setAttribute('hx-target', '#detail-body');
      element.setAttribute('hx-swap', 'innerHTML');
      element.setAttribute('hx-sync', '#detail-body:replace');
    }

    const simNode: SimNode = {
      char: character,
      x: anchor.x + Math.cos(angle) * radius,
      y: anchor.y + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      el: element,
      visible: true,
      pinned: false,
      degree: 0,
    };

    nodes.push(simNode);
    nodeById.set(character.id, simNode);
    nodesHost.appendChild(element);
  });

  const drafts: EdgeDraft[] = [];
  for (const relation of RELATIONS) {
    const a = nodeById.get(relation.from);
    const b = nodeById.get(relation.to);
    if (!a || !b) continue;
    a.degree += 1;
    b.degree += 1;
    drafts.push({ relation, a, b });
  }

  drafts.forEach((draft, index) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const meta = RELATION_META[draft.relation.type];
    path.setAttribute('class', `edge type-${draft.relation.type}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', meta.color);
    path.setAttribute('stroke-dasharray', meta.dash);
    path.setAttribute('stroke-linecap', 'round');
    path.dataset.a = draft.a.char.id;
    path.dataset.b = draft.b.char.id;
    path.dataset.type = draft.relation.type;

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${draft.a.char.name} ↔ ${draft.b.char.name} — ${draft.relation.label}`;
    path.appendChild(title);

    edgeSvg.appendChild(path);

    edges.push({
      relation: draft.relation,
      a: draft.a,
      b: draft.b,
      path,
      curve: ((index % 7) - 3) * 4.5,
      visible: true,
    });

    addNeighbor(draft.a.char.id, draft.b.char.id);
    addNeighbor(draft.b.char.id, draft.a.char.id);
  });

  // Elementos htmx criados depois do boot precisam ser registrados.
  window.htmx?.process(nodesHost);

  nodes.forEach((node) => {
    node.el.addEventListener('pointerenter', () => {
      hoveredId = node.char.id;
      applyEmphasis();
      showTooltip(node);
    });
    node.el.addEventListener('pointermove', (event) => {
      positionTooltip(event.clientX, event.clientY);
    });
    node.el.addEventListener('pointerleave', () => {
      if (hoveredId === node.char.id) {
        hoveredId = null;
        applyEmphasis();
      }
      hideTooltip();
    });
    node.el.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.stopPropagation();
      hideTooltip();
      const point = screenToWorld(event.clientX, event.clientY);
      dragging = {
        node,
        grabX: node.x - point.x,
        grabY: node.y - point.y,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      };
      node.pinned = true;
      node.el.classList.add('is-dragging');
      try {
        node.el.setPointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    });
  });
}

function addNeighbor(a: string, b: string): void {
  let set = neighbors.get(a);
  if (!set) {
    set = new Set<string>();
    neighbors.set(a, set);
  }
  set.add(b);
}

/* ------------------------------------------------------------------ */
/* Física                                                              */
/* ------------------------------------------------------------------ */

function step(strength: number): void {
  const visible = nodes.filter((node) => node.visible);

  for (const node of visible) {
    if (node.pinned) continue;
    const anchor = FACTION_ANCHORS[node.char.faction];
    node.vx += (anchor.x - node.x) * ANCHOR_K * strength;
    node.vy += (anchor.y - node.y) * ANCHOR_K * strength;
    node.vx += (CENTER.x - node.x) * CENTER_K * strength;
    node.vy += (CENTER.y - node.y) * CENTER_K * strength;
  }

  for (let i = 0; i < visible.length; i += 1) {
    const a = visible[i];
    for (let j = i + 1; j < visible.length; j += 1) {
      const b = visible[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let distance = Math.hypot(dx, dy);
      if (distance < 0.001) {
        dx = (random() - 0.5) * 2;
        dy = (random() - 0.5) * 2;
        distance = 1;
      }
      const nx = dx / distance;
      const ny = dy / distance;

      let force = Math.min(4.6, REPULSION / (distance * distance));
      if (distance < COLLISION) {
        force += (COLLISION - distance) * 0.22;
      }
      force *= strength;

      if (!a.pinned) {
        a.vx -= nx * force;
        a.vy -= ny * force;
      }
      if (!b.pinned) {
        b.vx += nx * force;
        b.vy += ny * force;
      }
    }
  }

  for (const edge of edges) {
    if (!edge.visible || !edge.a.visible || !edge.b.visible) continue;
    const dx = edge.b.x - edge.a.x;
    const dy = edge.b.y - edge.a.y;
    const distance = Math.hypot(dx, dy) || 1;
    const desired = SPRING_LENGTH[edge.relation.type];
    const force = (distance - desired) * SPRING_K * strength;
    const nx = dx / distance;
    const ny = dy / distance;

    if (!edge.a.pinned) {
      edge.a.vx += nx * force;
      edge.a.vy += ny * force;
    }
    if (!edge.b.pinned) {
      edge.b.vx -= nx * force;
      edge.b.vy -= ny * force;
    }
  }

  for (const node of visible) {
    if (node.pinned) {
      node.vx = 0;
      node.vy = 0;
      node.x = clamp(node.x, 40, WORLD_W - 40);
      node.y = clamp(node.y, 50, WORLD_H - 40);
      continue;
    }
    node.vx *= DAMPING;
    node.vy *= DAMPING;
    const speed = Math.hypot(node.vx, node.vy);
    if (speed > MAX_SPEED) {
      node.vx = (node.vx / speed) * MAX_SPEED;
      node.vy = (node.vy / speed) * MAX_SPEED;
    }
    node.x = clamp(node.x + node.vx, 40, WORLD_W - 40);
    node.y = clamp(node.y + node.vy, 50, WORLD_H - 40);
  }
}

function settle(iterations: number): void {
  for (let i = 0; i < iterations; i += 1) {
    const strength = i > iterations * 0.7 ? 0.35 : 1;
    step(strength);
  }
  drawPositions();
}

function wake(strength = 0.9): void {
  alpha = Math.max(alpha, strength);
  if (document.hidden) {
    settle(90);
    alpha = 0;
    return;
  }
  if (!running) {
    running = true;
    lastFrame = 0;
    requestAnimationFrame(animate);
  }
}

let lastFrame = 0;

function animate(now = performance.now()): void {
  if (alpha <= 0.012 || frozen) {
    running = false;
    drawPositions();
    return;
  }
  const delta = lastFrame ? Math.min(120, (now - lastFrame) / 16.67) : 1;
  lastFrame = now;
  step(alpha);
  step(alpha * 0.8);
  drawPositions();
  alpha *= Math.pow(0.972, delta);
  requestAnimationFrame(animate);
}

function drawPositions(): void {
  for (const node of nodes) {
    node.el.style.transform = `translate3d(${node.x - 54}px, ${node.y - 28}px, 0)`;
  }

  for (const edge of edges) {
    if (!edge.visible) continue;
    const dx = edge.b.x - edge.a.x;
    const dy = edge.b.y - edge.a.y;
    const distance = Math.hypot(dx, dy) || 1;
    const midX = (edge.a.x + edge.b.x) / 2 + (-dy / distance) * edge.curve;
    const midY = (edge.a.y + edge.b.y) / 2 + (dx / distance) * edge.curve;
    edge.path.setAttribute(
      'd',
      `M ${edge.a.x.toFixed(1)} ${edge.a.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${edge.b.x.toFixed(1)} ${edge.b.y.toFixed(1)}`,
    );
  }
}

/* ------------------------------------------------------------------ */
/* Visibilidade e ênfase                                               */
/* ------------------------------------------------------------------ */

function computeVisibility(): void {
  for (const node of nodes) {
    node.visible = activeFactions.has(node.char.faction);
  }
  for (const edge of edges) {
    edge.visible =
      activeRelations.has(edge.relation.type) && edge.a.visible && edge.b.visible;
    edge.path.style.display = edge.visible ? '' : 'none';
    edge.path.classList.toggle('is-hidden', !edge.visible);
  }
  for (const node of nodes) {
    node.el.classList.toggle('is-hidden', !node.visible);
  }
}

function applyVisibility(wakeSim = true): void {
  computeVisibility();
  if (selectedId) {
    const selected = nodeById.get(selectedId);
    if (!selected || !selected.visible) {
      clearSelection();
    }
  }
  updateStats();
  applyEmphasis();
  if (wakeSim) wake(0.6);
}

function applyEmphasis(): void {
  const active = hoveredId ?? selectedId;
  const related = active ? neighbors.get(active) : null;
  const strong = Boolean(hoveredId);

  for (const node of nodes) {
    const isActive = node.char.id === active;
    const isRelated = related?.has(node.char.id) ?? false;
    node.el.classList.toggle('is-active', isActive);
    node.el.classList.toggle('is-related', isRelated);
    node.el.classList.toggle('is-dim', strong && !isActive && !isRelated);
  }

  for (const edge of edges) {
    const isHot = Boolean(
      active &&
        (edge.a.char.id === active || edge.b.char.id === active) &&
        edge.visible,
    );
    edge.path.classList.toggle('is-hot', isHot);
    edge.path.classList.toggle('is-faded', strong && !isHot);
  }
}

function updateStats(): void {
  const visibleNodes = nodes.filter((node) => node.visible).length;
  const visibleEdges = edges.filter((edge) => edge.visible).length;
  statusVisible.textContent = `${visibleNodes}/${nodes.length} PERSONAGENS · ${visibleEdges} LAÇOS`;
  statCharacters.textContent = String(nodes.length);
  statRelations.textContent = String(edges.length);
}

/* ------------------------------------------------------------------ */
/* Câmera                                                              */
/* ------------------------------------------------------------------ */

function applyTransform(): void {
  world.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${zoom})`;
  const percent = `${Math.round(zoom * 100)}%`;
  zoomLabel.textContent = percent;
  statusZoom.textContent = percent;
  world.classList.toggle('hide-labels', zoom < 0.62);
}

function zoomAt(screenX: number, screenY: number, factor: number): void {
  const next = clamp(zoom * factor, MIN_ZOOM, MAX_ZOOM);
  if (next === zoom) return;
  const worldX = (screenX - offsetX) / zoom;
  const worldY = (screenY - offsetY) / zoom;
  zoom = next;
  offsetX = screenX - worldX * zoom;
  offsetY = screenY - worldY * zoom;
  applyTransform();
}

function zoomCenter(factor: number): void {
  const rect = mapShell.getBoundingClientRect();
  zoomAt(rect.width / 2, rect.height / 2, factor);
}

function fitView(): void {
  const visible = nodes.filter((node) => node.visible);
  if (visible.length === 0) {
    zoom = 1;
    offsetX = mapShell.clientWidth / 2 - CENTER.x;
    offsetY = mapShell.clientHeight / 2 - CENTER.y;
    applyTransform();
    return;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of visible) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  }

  const rect = mapShell.getBoundingClientRect();
  const padding = Math.min(130, Math.max(44, Math.min(rect.width, rect.height) * 0.16));
  const width = Math.max(200, maxX - minX);
  const height = Math.max(200, maxY - minY);
  const next = Math.min(
    (rect.width - padding * 2) / width,
    (rect.height - padding * 2) / height,
    1.35,
  );

  zoom = clamp(next, MIN_ZOOM, MAX_ZOOM);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  offsetX = rect.width / 2 - centerX * zoom;
  offsetY = rect.height / 2 - centerY * zoom;
  applyTransform();
}

function centerOnNode(node: SimNode): void {
  const rect = mapShell.getBoundingClientRect();
  const screenX = node.x * zoom + offsetX;
  const screenY = node.y * zoom + offsetY;
  const margin = 90;
  if (
    screenX > margin &&
    screenX < rect.width - margin &&
    screenY > margin &&
    screenY < rect.height - margin
  ) {
    return;
  }
  offsetX += rect.width / 2 - screenX;
  offsetY += rect.height / 2 - screenY;
  applyTransform();
}

/* ------------------------------------------------------------------ */
/* Seleção e fichas                                                    */
/* ------------------------------------------------------------------ */

function selectCharacter(
  id: string,
  load: boolean,
  options: { center?: boolean } = {},
): void {
  const node = nodeById.get(id);
  if (!node) return;

  if (!activeFactions.has(node.char.faction)) {
    activeFactions.add(node.char.faction);
    renderFactionList();
    applyVisibility();
  }

  selectedId = id;
  pendingDetail = { kind: 'char', id };
  for (const candidate of nodes) {
    candidate.el.classList.toggle('selected', candidate.char.id === id);
  }
  detailTitle.textContent = 'FICHA DE PERSONAGEM';
  applyEmphasis();

  if (load) {
    loadCharacter(id);
  }

  if (options.center) {
    centerOnNode(node);
  }

  tone(520, 0.05);
}

function clearSelection(): void {
  selectedId = null;
  hoveredId = null;
  pendingDetail = null;
  for (const node of nodes) node.el.classList.remove('selected');
  applyEmphasis();
  detailTitle.textContent = 'ARQUIVO DE ETERNIA';
  detailBody.innerHTML = renderEmptyHTML();
  hideTooltip();
}

function loadCharacter(id: string): void {
  const htmx = getHtmx();
  if (htmx) {
    htmx.ajax('GET', 'fragments/characters.html', {
      target: '#detail-body',
      select: `#char-${id}`,
      swap: 'innerHTML',
    });
    return;
  }
  renderLocalCharacter(id);
}

function loadFaction(id: FactionId): void {
  const htmx = getHtmx();
  pendingDetail = { kind: 'faction', id };
  selectedId = null;
  for (const node of nodes) node.el.classList.remove('selected');
  applyEmphasis();
  detailTitle.textContent = 'DOSSIÊ DE FACÇÃO';
  tone(360, 0.07);

  if (htmx) {
    htmx.ajax('GET', 'fragments/factions.html', {
      target: '#detail-body',
      select: `#faction-${id}`,
      swap: 'innerHTML',
    });
    return;
  }
  renderLocalFaction(id);
}

function renderLocalCharacter(id: string): void {
  const character = CHARACTER_MAP.get(id);
  if (!character) return;
  detailBody.innerHTML = renderProfileHTML(character, { htmx: false });
  detailBody.scrollTop = 0;
}

function renderLocalFaction(id: FactionId): void {
  const faction = FACTION_MAP.get(id);
  if (!faction) return;
  detailBody.innerHTML = renderFactionHTML(faction, { htmx: false });
  detailBody.scrollTop = 0;
}

/* ------------------------------------------------------------------ */
/* Painéis laterais                                                    */
/* ------------------------------------------------------------------ */

function renderFactionList(): void {
  factionList.innerHTML = FACTIONS.map((faction) => {
    const count = CHARACTERS.filter((character) => character.faction === faction.id).length;
    const active = activeFactions.has(faction.id);
    return `
      <div class="faction-item ${active ? 'is-on' : ''}" style="--fc:${faction.color}">
        <button class="faction-toggle" type="button" data-faction="${faction.id}" aria-pressed="${active}" title="Mostrar/ocultar ${escapeHtml(faction.name)}">
          <span class="faction-icon">${faction.icon}</span>
          <span class="faction-name">${escapeHtml(faction.short)}</span>
          <span class="faction-count">${count}</span>
        </button>
        <button class="faction-info" type="button" data-dossier="${faction.id}" aria-label="Abrir dossiê de ${escapeHtml(faction.name)}" title="Dossiê: ${escapeHtml(faction.name)}">i</button>
      </div>`;
  }).join('');
}

function renderLegend(): void {
  legendList.innerHTML = RELATION_ORDER.map((type) => {
    const meta = RELATION_META[type];
    const count = RELATIONS.filter((relation) => relation.type === type).length;
    return `
      <button class="legend-row is-on" type="button" data-rel="${type}" style="--c:${meta.color}" aria-pressed="true">
        <span class="legend-line" style="--c:${meta.color}"></span>
        <span class="legend-name">${escapeHtml(meta.label)}</span>
        <span class="legend-count">${count}</span>
      </button>`;
  }).join('');
}

function updateSearch(): void {
  searchQuery = normalize(searchInput.value);
  let matches = 0;
  let first: SimNode | null = null;

  for (const node of nodes) {
    const character = node.char;
    const faction = FACTION_MAP.get(character.faction);
    const haystack = normalize(
      [
        character.name,
        character.alias ?? '',
        character.role,
        character.era,
        faction?.name ?? '',
        ...character.powers,
      ].join(' '),
    );
    const hit = searchQuery.length > 0 && haystack.includes(searchQuery);
    node.el.classList.toggle('search-hit', hit);
    node.el.classList.toggle('search-miss', searchQuery.length > 0 && !hit);
    if (hit) {
      matches += 1;
      if (!first) first = node;
    }
  }

  if (searchQuery.length === 0) {
    searchStatus.textContent = 'Busque por nome, facção, era ou poder.';
  } else if (matches === 0) {
    searchStatus.textContent = 'Nenhum registro encontrado.';
  } else {
    searchStatus.textContent = `${matches} registro${matches === 1 ? '' : 's'} encontrado${matches === 1 ? '' : 's'}. Enter abre o primeiro.`;
  }

  if (first) first.el.dataset.firstMatch = 'true';
  for (const node of nodes) {
    if (node !== first) delete node.el.dataset.firstMatch;
  }
}

function selectFirstMatch(): void {
  if (searchQuery.length === 0) return;
  const first = nodes.find((node) => node.el.classList.contains('search-hit'));
  if (!first) return;
  selectCharacter(first.char.id, true, { center: true });
  tone(700, 0.06);
}

/* ------------------------------------------------------------------ */
/* Tooltip                                                             */
/* ------------------------------------------------------------------ */

function showTooltip(node: SimNode): void {
  const faction = FACTION_MAP.get(node.char.faction);
  nodeTooltip.innerHTML = `
    <span class="tt-icon" style="--c1:${node.char.colors[0]};--c2:${node.char.colors[1]}">${node.char.icon}</span>
    <span class="tt-text">
      <b>${escapeHtml(node.char.name)}</b>
      <small>${escapeHtml(node.char.role)}</small>
      <em style="--fc:${faction?.color ?? '#fff'}">${escapeHtml(faction?.short ?? '')} · ${node.degree} LAÇOS</em>
    </span>`;
  nodeTooltip.classList.add('is-visible');
}

function positionTooltip(clientX: number, clientY: number): void {
  const rect = mapShell.getBoundingClientRect();
  const x = clientX - rect.left + 18;
  const y = clientY - rect.top + 18;
  const tooltipRect = nodeTooltip.getBoundingClientRect();
  const maxX = rect.width - tooltipRect.width - 12;
  const maxY = rect.height - tooltipRect.height - 12;
  nodeTooltip.style.left = `${clamp(x, 12, Math.max(12, maxX))}px`;
  nodeTooltip.style.top = `${clamp(y, 12, Math.max(12, maxY))}px`;
}

function hideTooltip(): void {
  nodeTooltip.classList.remove('is-visible');
}

/* ------------------------------------------------------------------ */
/* Htmx / fallback                                                     */
/* ------------------------------------------------------------------ */

function setupHtmx(): void {
  if (!canUseHtmx) return;

  document.body.addEventListener('htmx:beforeRequest', () => {
    htmxRequestCount += 1;
    loadingBar.classList.add('is-active');
  });

  document.body.addEventListener('htmx:afterRequest', () => {
    htmxRequestCount = Math.max(0, htmxRequestCount - 1);
    if (htmxRequestCount === 0) loadingBar.classList.remove('is-active');
  });

  document.body.addEventListener('htmx:afterSwap', (event) => {
    const target = event.target as HTMLElement;
    if (target.id !== 'detail-body') return;
    target.scrollTop = 0;
    const content = target.querySelector('.profile, .dossier');
    if (content) content.classList.add('swap-in');
  });

  const fallback = (): void => {
    if (!pendingDetail) return;
    if (pendingDetail.kind === 'char') renderLocalCharacter(pendingDetail.id);
    else renderLocalFaction(pendingDetail.id as FactionId);
  };

  document.body.addEventListener('htmx:sendError', fallback);
  document.body.addEventListener('htmx:responseError', fallback);
}

/* ------------------------------------------------------------------ */
/* Interações gerais                                                   */
/* ------------------------------------------------------------------ */

function setupInteractions(): void {
  // clique em nós (captura para poder cancelar depois de um arrasto)
  nodesHost.addEventListener(
    'click',
    (event) => {
      if (performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const target = event.target as Element;
      const nodeElement = target.closest<HTMLElement>('.node');
      if (!nodeElement) return;
      const id = nodeElement.dataset.id;
      if (!id) return;
      selectCharacter(id, !canUseHtmx, { center: false });
    },
    true,
  );

  // links de relação / membros / chips de facção dentro do painel
  document.addEventListener('click', (event) => {
    const target = event.target as Element;
    const goto = target.closest<HTMLElement>('[data-goto]');
    if (goto) {
      const id = goto.dataset.goto;
      if (!id) return;
      const htmxDriven = goto.hasAttribute('hx-get');
      selectCharacter(id, !htmxDriven, { center: true });
      tone(660, 0.05);
    }
  });

  // filtros de facção + dossiês
  factionList.addEventListener('click', (event) => {
    const target = event.target as Element;
    const dossierButton = target.closest<HTMLElement>('[data-dossier]');
    if (dossierButton) {
      const id = dossierButton.dataset.dossier as FactionId | undefined;
      if (id) loadFaction(id);
      return;
    }

    const toggle = target.closest<HTMLElement>('[data-faction]');
    if (!toggle) return;
    const id = toggle.dataset.faction as FactionId | undefined;
    if (!id) return;

    if (activeFactions.has(id)) {
      activeFactions.delete(id);
    } else {
      activeFactions.add(id);
    }
    toggle.closest('.faction-item')?.classList.toggle('is-on', activeFactions.has(id));
    toggle.setAttribute('aria-pressed', String(activeFactions.has(id)));
    applyVisibility();
    tone(activeFactions.has(id) ? 440 : 300, 0.05);
  });

  // filtros de tipo de laço
  legendList.addEventListener('click', (event) => {
    const target = event.target as Element;
    const toggle = target.closest<HTMLElement>('[data-rel]');
    if (!toggle) return;
    const type = toggle.dataset.rel as RelationType | undefined;
    if (!type) return;

    if (activeRelations.has(type)) activeRelations.delete(type);
    else activeRelations.add(type);
    toggle.classList.toggle('is-on', activeRelations.has(type));
    toggle.setAttribute('aria-pressed', String(activeRelations.has(type)));
    applyVisibility();
    tone(activeRelations.has(type) ? 480 : 260, 0.05);
  });

  // busca
  searchInput.addEventListener('input', updateSearch);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      selectFirstMatch();
    }
    if (event.key === 'Escape') {
      searchInput.value = '';
      updateSearch();
      searchInput.blur();
    }
  });

  // fechar ficha
  detailClose.addEventListener('click', () => {
    clearSelection();
    tone(240, 0.06);
  });

  // arrastar o fundo
  mapShell.addEventListener('pointerdown', (event) => {
    const target = event.target as Element;
    if (
      target.closest('.node') ||
      target.closest('.map-toolbar') ||
      target.closest('.map-badge')
    ) {
      return;
    }
    panning = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offsetX,
      originY: offsetY,
    };
    mapShell.classList.add('is-grabbing');
    try {
      mapShell.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    event.preventDefault();
  });

  // mover nó ou mapa
  window.addEventListener('pointermove', (event) => {
    if (dragging) {
      const point = screenToWorld(event.clientX, event.clientY);
      dragging.node.x = clamp(point.x + dragging.grabX, 40, WORLD_W - 40);
      dragging.node.y = clamp(point.y + dragging.grabY, 50, WORLD_H - 40);
      if (Math.hypot(event.clientX - dragging.startX, event.clientY - dragging.startY) > 4) {
        dragging.moved = true;
        suppressClickUntil = performance.now() + 220;
      }
      drawPositions();
      return;
    }

    if (panning) {
      offsetX = panning.originX + (event.clientX - panning.startX);
      offsetY = panning.originY + (event.clientY - panning.startY);
      applyTransform();
    }
  });

  window.addEventListener('pointerup', () => {
    if (dragging) {
      const node = dragging.node;
      node.pinned = false;
      node.el.classList.remove('is-dragging');
      if (dragging.moved) suppressClickUntil = performance.now() + 220;
      dragging = null;
      wake(0.55);
    }
    if (panning) {
      panning = null;
      mapShell.classList.remove('is-grabbing');
    }
  });

  window.addEventListener('pointercancel', () => {
    if (dragging) {
      dragging.node.pinned = false;
      dragging.node.el.classList.remove('is-dragging');
      dragging = null;
    }
    if (panning) {
      panning = null;
      mapShell.classList.remove('is-grabbing');
    }
  });

  // zoom
  mapShell.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const rect = mapShell.getBoundingClientRect();
      const factor = Math.exp(-event.deltaY * 0.0014);
      zoomAt(event.clientX - rect.left, event.clientY - rect.top, factor);
    },
    { passive: false },
  );

  mapShell.addEventListener('dblclick', (event) => {
    if ((event.target as Element).closest('.node')) return;
    fitView();
  });

  zoomInButton.addEventListener('click', () => zoomCenter(1.22));
  zoomOutButton.addEventListener('click', () => zoomCenter(1 / 1.22));
  fitButton.addEventListener('click', () => fitView());

  shuffleButton.addEventListener('click', () => {
    for (const node of nodes) {
      const anchor = FACTION_ANCHORS[node.char.faction];
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 165;
      node.x = anchor.x + Math.cos(angle) * radius;
      node.y = anchor.y + Math.sin(angle) * radius;
      node.vx = 0;
      node.vy = 0;
      node.pinned = false;
    }
    settle(280);
    fitView();
    tone(180, 0.09, 'sawtooth');
  });

  // som
  soundButton.addEventListener('click', () => {
    soundOn = !soundOn;
    soundButton.textContent = `SOM: ${soundOn ? 'ON' : 'OFF'}`;
    soundButton.classList.toggle('is-active', soundOn);
    soundButton.setAttribute('aria-pressed', String(soundOn));
    if (soundOn) tone(880, 0.08);
  });

  // CRT
  crtButton.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('crt');
    crtButton.textContent = `CRT: ${enabled ? 'ON' : 'OFF'}`;
    crtButton.classList.toggle('is-active', enabled);
    crtButton.setAttribute('aria-pressed', String(enabled));
    tone(enabled ? 120 : 80, 0.05, 'sawtooth');
  });

  // teclado
  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    if (event.key === '/' && !typing) {
      event.preventDefault();
      searchInput.focus();
      return;
    }
    if (event.key === 'Escape') {
      if (typing) {
        searchInput.value = '';
        updateSearch();
        searchInput.blur();
      } else {
        clearSelection();
      }
      return;
    }
    if (typing) return;
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      zoomCenter(1.2);
    }
    if (event.key === '-') {
      event.preventDefault();
      zoomCenter(1 / 1.2);
    }
    if (event.key === '0') {
      event.preventDefault();
      fitView();
    }
    if (event.key.toLowerCase() === 'f') {
      frozen = !frozen;
      if (frozen) alpha = 0;
      else wake(0.5);
      tone(frozen ? 200 : 400, 0.04);
    }
  });

  // redimensionamento
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => fitView(), 180);
  });
}

/* ------------------------------------------------------------------ */
/* Ticker                                                              */
/* ------------------------------------------------------------------ */

function setupTicker(): void {
  const items = [
    '⚡ 57 PERSONAGENS · 112 LAÇOS · UMA ETERNIA',
    '🛡️ HE-MAN × SKELETOR: A RIVALIDADE CENTRAL',
    '🐍 KING HISS QUER O TRONO DE GRAYSKULL',
    '⚔️ SHE-RA COMANDA A GRANDE REBELIÃO',
    '🦇 HORDA PRIME OBSERVA DE OUTRO PLANO',
    '💀 KELDOR É O IRMÃO PERDIDO DE RANDOR',
    '🦄 SWIFT WIND APROVA ESTA MENSAGEM',
    '🕹️ CLIQUE EM UM NÓ PARA ABRIR A FICHA',
  ];
  const line = items.join('   ◆   ');
  tickerTrack.textContent = `${line}   ◆   ${line}`;
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

function init(): void {
  renderFactionList();
  renderLegend();
  buildGraph();
  updateStats();
  settle(360);
  applyVisibility(false);
  drawPositions();

  detailBody.innerHTML = renderEmptyHTML();
  detailTitle.textContent = 'ARQUIVO DE ETERNIA';

  setupHtmx();
  setupInteractions();
  setupTicker();

  requestAnimationFrame(() => {
    fitView();
  });

  // Não dependemos só de requestAnimationFrame: em abas ocultas ele pode
  // ficar suspenso e a página abriria sem enquadramento nem ficha inicial.
  fitView();
  window.setTimeout(() => {
    fitView();
    if (zoom < 0.5) {
      const heman = nodeById.get('he-man');
      const rect = mapShell.getBoundingClientRect();
      zoom = 0.8;
      if (heman) {
        offsetX = rect.width / 2 - heman.x * zoom;
        offsetY = rect.height / 2 - heman.y * zoom;
      }
      applyTransform();
    }
    selectCharacter('he-man', true, { center: false });
  }, 420);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
