# CLAUDE.md — Sito psicologo

Convenzioni e vincoli di progetto per Claude Code e per chiunque lavori su questo repo.

## Stack

- **HTML + CSS + JS vanilla** — nessun build step, nessun framework, nessun bundler.
- **ES modules nativi** (`type="module"` in index.html) — compatibile con tutti i browser moderni.
- **Google Fonts** via `<link>` — Fraunces (serif titoli) e Inter (corpo testo).
- Target di deploy: **GitHub Pages** (path relativi, sottocartella possibile).

## Struttura file

```
/
├── index.html          # Unica pagina
├── css/styles.css      # Tutto il CSS (custom properties, nessun colore hardcoded)
├── js/main.js          # Logica: nav, orbita, scroll reveal, popover
└── assets/
    └── img/            # Foto psicologo, og-image.jpg, favicon.svg
```

## Design tokens (CSS custom properties in :root)

Palette: **Terra & calore** (ocra + terracotta + crema)

| Token                  | Valore    | Uso |
|------------------------|-----------|-----|
| `--color-bg`           | #F5F0E8   | Sfondo pagina |
| `--color-surface`      | #FDFAF4   | Card, sezioni alternate |
| `--color-primary`      | #8B6914   | Ocra scura |
| `--color-primary-deep` | #5C4209   | Titoli, footer, CTA hover |
| `--color-accent`       | #C4613A   | Terracotta, link, CTA secondari |
| `--color-text`         | #2A2015   | Testo principale |
| `--color-text-muted`   | #7A6D58   | Testo secondario |
| `--color-border`       | #DDD5C4   | Bordi, separatori |

**Regola**: non scrivere mai colori hardcoded fuori da `:root`. Usa sempre i token.

## Tipografia

- **Titoli**: `font-family: var(--font-serif)` → Fraunces, Georgia, serif
- **Corpo**: `font-family: var(--font-sans)` → Inter, system-ui, sans-serif
- Scale fluide via `clamp()` — token da `--text-xs` a `--text-hero`

## Accessibilità — requisiti

- Un solo `<h1>` per pagina; gerarchia heading corretta.
- Tutti i pulsanti interattivi sono `<button>` reali (focus, Enter/Spazio).
- SVG decorativi marcati `aria-hidden="true"`.
- Skip link in cima al DOM.
- Focus visibile con `:focus-visible`.
- Contrasti WCAG AA verificati per tutte le combinazioni testo/sfondo.
- `lang="it"` sul documento.

## Animazioni — regole

- Animare **solo** `transform` e `opacity` (GPU-friendly, niente reflow).
- `@media (prefers-reduced-motion: reduce)`: tutte le animazioni devono disattivarsi o diventare statiche.
- L'orbita usa `requestAnimationFrame` e si ferma con `IntersectionObserver` quando la sezione non è visibile.

## Mobile (< 768px)

- Orbita assente: i pulsanti condizione diventano chip statici in flexbox wrap.
- SVG più piccolo, visibile in alto.
- Popover si apre come sheet dal basso (fixed).
- Menu nav come dropdown a tendina (hamburger).

## Placeholder da completare

Cerca `<!-- PLACEHOLDER` e `<!-- TODO` in index.html e `// PLACEHOLDER` in main.js.

Principali:
- `index.html`: nome psicologo, frase hero, foto, biografia, metodo, sedi, contatti, privacy.
- `js/main.js`: array `CONDITIONS` con label e description reali.
- `assets/img/`: `portrait.jpg`, `og-image.jpg`, `favicon.svg`.

## Divieti

- No React, Vue, Svelte, Astro, o qualsiasi framework.
- No Vite, Webpack, Parcel, ecc.
- No librerie npm (nemmeno lodash, axios, ecc.).
- No percorsi assoluti che rompono il deploy in sottocartella (`/assets/...` → `assets/...`).
