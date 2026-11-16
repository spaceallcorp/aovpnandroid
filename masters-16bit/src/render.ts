import {
  CHARACTERS,
  CHARACTER_MAP,
  FACTION_MAP,
  RELATION_META,
  relationsOf,
  type Character,
  type Faction,
} from './data.js';

export interface RenderOptions {
  htmx: boolean;
}

const esc = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function characterAttrs(id: string, opts: RenderOptions): string {
  if (!opts.htmx) return '';
  return [
    `hx-get="fragments/characters.html"`,
    `hx-select="#char-${esc(id)}"`,
    `hx-target="#detail-body"`,
    `hx-swap="innerHTML"`,
    `hx-sync="#detail-body:replace"`,
  ].join(' ');
}

function avatarStyle(character: Character): string {
  const faction = FACTION_MAP.get(character.faction);
  return `--c1:${character.colors[0]};--c2:${character.colors[1]};--fc:${faction?.color ?? '#00f0ff'}`;
}

/* ------------------------------------------------------------------ */

export function renderProfileHTML(character: Character, opts: RenderOptions): string {
  const faction = FACTION_MAP.get(character.faction);
  const relations = relationsOf(character.id);

  const relationRows = relations
    .map(({ relation, other }) => {
      const meta = RELATION_META[relation.type];
      const otherFaction = FACTION_MAP.get(other.faction);
      return `
        <button class="rel-row" type="button" data-goto="${esc(other.id)}" ${characterAttrs(other.id, opts)}>
          <span class="rel-dot" style="--c:${meta.color}"></span>
          <span class="rel-main">
            <span class="rel-name">${esc(other.name)}</span>
            <span class="rel-sub">${esc(relation.label)}</span>
          </span>
          <span class="rel-type" style="--c:${meta.color}">${esc(meta.label.toUpperCase())}</span>
          <span class="rel-faction" style="--c:${otherFaction?.color ?? '#fff'}">${esc(otherFaction?.short ?? '')}</span>
        </button>`;
    })
    .join('');

  return `
    <article class="profile" id="char-${esc(character.id)}" data-id="${esc(character.id)}">
      <header class="profile-top">
        <div class="profile-avatar" style="${avatarStyle(character)}">
          <span>${esc(character.icon)}</span>
        </div>
        <div class="profile-id">
          <h2>${esc(character.name)}</h2>
          ${character.alias ? `<p class="profile-alias">${esc(character.alias)}</p>` : ''}
          <span class="faction-badge" style="--fc:${faction?.color ?? '#fff'}">${esc(faction?.name ?? '')}</span>
        </div>
      </header>

      <p class="profile-role">${esc(character.role)} <span>· ${esc(character.era)}</span></p>
      <p class="profile-bio">${esc(character.bio)}</p>

      <h3 class="profile-h">PODERES <em>${character.powers.length}</em></h3>
      <div class="power-list">
        ${character.powers.map((power) => `<span class="power">${esc(power)}</span>`).join('')}
      </div>

      <h3 class="profile-h">LAÇOS <em>${relations.length}</em></h3>
      <div class="rel-list">
        ${relationRows || '<p class="rel-empty">Nenhum laço registrado.</p>'}
      </div>

      ${
        character.quote
          ? `<blockquote class="profile-quote">“${esc(character.quote)}”</blockquote>`
          : ''
      }
    </article>`;
}

/* ------------------------------------------------------------------ */

export function renderFactionHTML(faction: Faction, opts: RenderOptions): string {
  const members = CHARACTERS.filter((character) => character.faction === faction.id).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const keyMembers = members
    .map((character) => {
      const count = relationsOf(character.id).length;
      return { character, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const memberButtons = members
    .map(
      (member) => `
        <button class="member" type="button" data-goto="${esc(member.id)}" ${characterAttrs(member.id, opts)}>
          <span class="member-icon" style="${avatarStyle(member)}">${esc(member.icon)}</span>
          <span class="member-info">
            <b>${esc(member.name)}</b>
            <small>${esc(member.role)}</small>
          </span>
        </button>`,
    )
    .join('');

  return `
    <article class="dossier" id="faction-${esc(faction.id)}" data-faction="${esc(faction.id)}">
      <header class="dossier-top" style="--fc:${faction.color}">
        <div class="dossier-icon">${esc(faction.icon)}</div>
        <div>
          <p class="dossier-kicker">DOSSIÊ DE FACÇÃO</p>
          <h2>${esc(faction.name)}</h2>
          <p class="dossier-motto">“${esc(faction.motto)}”</p>
        </div>
      </header>

      <p class="profile-bio">${esc(faction.blurb)}</p>
      <p class="dossier-text">${esc(faction.dossier)}</p>

      <h3 class="profile-h">NÚCLEO <em>${keyMembers.length}</em></h3>
      <div class="key-list">
        ${keyMembers
          .map(
            ({ character, count }) => `
              <button class="key-chip" type="button" data-goto="${esc(character.id)}" ${characterAttrs(character.id, opts)}>
                <span>${esc(character.icon)}</span> ${esc(character.name)}
                <em>${count}</em>
              </button>`,
          )
          .join('')}
      </div>

      <h3 class="profile-h">MEMBROS <em>${members.length}</em></h3>
      <div class="member-grid">${memberButtons}</div>
    </article>`;
}

/* ------------------------------------------------------------------ */

export function renderEmptyHTML(): string {
  return `
    <div class="empty-state">
      <div class="empty-glyph" aria-hidden="true">🕹️</div>
      <h2>ARQUIVO DE ETERNIA</h2>
      <p>Clique em um personagem no mapa para abrir a ficha e navegar pelos laços.</p>
      <ul class="empty-tips">
        <li><b>ARRASTE</b> o fundo para explorar</li>
        <li><b>SCROLL</b> para dar zoom</li>
        <li><b>CLIQUE</b> em um laço para saltar entre fichas</li>
      </ul>
    </div>`;
}

/* ------------------------------------------------------------------ */

export function renderAllProfiles(opts: RenderOptions = { htmx: true }): string {
  return CHARACTERS.map((character) => renderProfileHTML(character, opts)).join('\n<!-- - - - -->\n');
}

export function renderAllFactions(opts: RenderOptions = { htmx: true }): string {
  return [...FACTION_MAP.values()]
    .map((faction) => renderFactionHTML(faction, opts))
    .join('\n<!-- - - - -->\n');
}

export { CHARACTER_MAP };
