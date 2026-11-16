# Masters of the Universe // 16 Bit

Mapa interativo das relações entre **57 personagens** de Masters of the Universe (He-Man, She-Ra, Horda, Homens-Serpente, Preternia e New Adventures), com estética de fliperama 16-bit.

Feito com **HTML + CSS + TypeScript + htmx**. Sem framework de UI, sem bundle: o TypeScript compila direto para ESM e o htmx carrega as fichas a partir de fragmentos HTML estáticos.

## Como rodar

```bash
cd masters-16bit
npm install
npm run build
npm start
```

Abra **http://127.0.0.1:8080**.

Para desenvolvimento, `npm run dev` compila e sobe o servidor de uma vez.

> O htmx precisa de HTTP para buscar os fragmentos. Abrindo `index.html` direto via `file://`, o mapa e as fichas continuam funcionando pelo fallback local em TypeScript, mas o fluxo htmx fica desativado.

## O que tem na tela

- **Mapa de forças** com os 57 personagens agrupados por facção e **112 laços** coloridos por tipo: família, romance, mentoria, aliança, servidão, rivalidade, inimizade e legado.
- **Física interativa**: arraste nós, pan no fundo, zoom com scroll/botões, `FIT` para reenquadrar, `REORGANIZAR` para sortear posições e `F` para congelar.
- **Filtros de facção** e **filtros de tipo de laço** na barra lateral.
- **Busca** por nome, alias, facção, era ou poder (`/` foca o campo, `Enter` abre o primeiro resultado).
- **Ficha via htmx**: ao clicar em um nó, o painel busca `fragments/characters.html`, seleciona o artigo `#char-<id>` com `hx-select` e troca o conteúdo de `#detail-body`.
- **Navegação entre fichas**: cada laço listado na ficha é um botão htmx que salta para o personagem relacionado.
- **Dossiês de facção**: o botão `i` ao lado de cada facção carrega `fragments/factions.html`.
- **Extras**: tooltip, som chiptune opcional (WebAudio), scanlines CRT, ticker e HUD.

## Estrutura

```
masters-16bit/
├── index.html                 # shell da página
├── styles.css                 # UI 16-bit, CRT, layout responsivo
├── src/
│   ├── data.ts                # personagens, facções, laços
│   ├── render.ts              # HTML das fichas (compartilhado com o gerador)
│   └── app.ts                 # grafo, física, câmera, filtros, htmx
├── scripts/
│   ├── gen-fragments.mjs      # gera fragments/*.html a partir de data/render
│   └── serve.mjs              # servidor estático sem dependências
├── fragments/                 # gerado por npm run build
├── dist/                      # TS compilado
└── vendor/htmx.min.js         # htmx 2.0.4 vendorizado
```

## Editar o conteúdo

Tudo vem de `src/data.ts`:

- `CHARACTERS`: id, nome, alias, facção, papel, ícone, cores, era, bio, poderes e frase.
- `FACTIONS`: nome, cor, lema, resumo e texto do dossiê.
- `RELATIONS`: origem, destino, tipo e rótulo do laço.

Depois de editar:

```bash
npm run build
```

O build roda `tsc` e regenera `fragments/characters.html` e `fragments/factions.html`. A página lê os mesmos dados no cliente, então mapa e fichas ficam sempre sincronizados.

## Atalhos

| Tecla | Ação |
| --- | --- |
| `/` | focar busca |
| `Enter` (na busca) | abrir primeiro resultado |
| `Esc` | limpar busca / fechar ficha |
| `+` / `-` | zoom |
| `0` | encaixar mapa |
| `F` | congelar/retomar física |
| duplo clique no mapa | encaixar mapa |

## Créditos

Masters of the Universe e personagens pertencem à Mattel. Este é um projeto de fã, não oficial, sem fins comerciais. Fontes: Press Start 2P e VT323 (Google Fonts, OFL). htmx 2.0.4 (BSD 2-Clause).
