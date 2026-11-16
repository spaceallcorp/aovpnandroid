import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { renderAllFactions, renderAllProfiles } from '../dist/render.js';
import { CHARACTERS, FACTIONS, RELATIONS } from '../dist/data.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const outDir = new URL('../fragments/', import.meta.url);

const banner = `<!--
  Arquivo gerado por scripts/gen-fragments.mjs.
  Não edite à mão: altere src/data.ts / src/render.ts e rode "npm run build".
  ${CHARACTERS.length} personagens · ${FACTIONS.length} facções · ${RELATIONS.length} laços.
-->\n`;

await mkdir(outDir, { recursive: true });

const characters = `${banner}\n${renderAllProfiles({ htmx: true })}\n`;
const factions = `${banner}\n${renderAllFactions({ htmx: true })}\n`;

await writeFile(new URL('characters.html', outDir), characters, 'utf8');
await writeFile(new URL('factions.html', outDir), factions, 'utf8');

console.log(`[fragments] characters.html — ${(characters.length / 1024).toFixed(1)} KB`);
console.log(`[fragments] factions.html   — ${(factions.length / 1024).toFixed(1)} KB`);
console.log(`[fragments] destino: ${root}fragments/`);
