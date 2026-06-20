/**
 * main.js — Sito psicologo
 * Vanilla ES modules. Nessuna dipendenza esterna.
 *
 * Moduli:
 *   1. Navigazione (sticky scroll + hamburger + sezione attiva)
 *   2. Portrait fallback
 *   3. Scroll reveal (IntersectionObserver)
 *   4. Sezione mente/anima — orbita condizioni
 *   5. Anno footer
 */

/* ═══════════════════════════════════════════════════════════════════
   PLACEHOLDER DATI — sostituire con condizioni reali
   ─────────────────────────────────────────────────────────────────
   Ogni voce: { id, label, description }
   Il campo `description` supporta testo piano (max ~200 char).
   PLACEHOLDER: sostituisci con condizioni trattate reali + descrizioni
═══════════════════════════════════════════════════════════════════ */
const CONDITIONS = [
  {
    id: 'clinica',
    label: 'Psicologia clinica',
    description:
      'Percorsi individuali per ansia, depressione e difficoltà emotivo-relazionali. Un accompagnamento professionale per ritrovare equilibrio e benessere.',
  },
  {
    id: 'coppia-famiglia',
    label: 'Coppia e famiglia',
    description:
      'Consulenza per situazioni di crisi relazionale, difficoltà comunicative di coppia o dinamiche familiari complesse.',
  },
  {
    id: 'sport',
    label: 'Psicologia dello sport',
    description:
      'Supporto a società sportive, staff tecnico e atleti per migliorare la performance, gestire la pressione agonistica e affrontare infortuni o momenti di crisi.',
  },
  {
    id: 'mental-training',
    label: 'Mental Training',
    description:
      "Percorsi strutturati di allenamento mentale per atleti singoli e squadre: concentrazione, gestione dell'errore, visualizzazione e Human Performance.",
  },
  {
    id: 'caregiver',
    label: 'Caregiver e fragilità',
    description:
      'Supporto a chi si prende cura di persone fragili: famiglie, caregiver informali e operatori del sociale e della disabilità.',
  },
  {
    id: 'gruppi',
    label: 'Gruppi e organizzazioni',
    description:
      'Consulenza e supervisione per équipe di lavoro. Esperienza nelle dinamiche gruppali istituzionali e nella conduzione di gruppi terapeutici e formativi.',
  },
  {
    id: 'training-autogeno',
    label: 'Training Autogeno',
    description:
      "Tecnica di rilassamento profondo che insegna a gestire stress, tensione e ansia attraverso l'auto-ipnosi. Percorsi individuali e di gruppo.",
  },
  {
    id: 'crescita',
    label: 'Crescita personale',
    description:
      'Per chi vuole comprendersi meglio, rafforzare le proprie risorse e costruire una vita più consapevole, anche in assenza di un disagio conclamato.',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   1. NAVIGAZIONE
   ─────────────────────────────────────────────────────────────────
   - Header shadow su scroll
   - Hamburger toggle (mobile)
   - Active link via IntersectionObserver sulle sezioni
   - Chiude il menu mobile al click su un link
═══════════════════════════════════════════════════════════════════ */
function initNav() {
  const header   = document.querySelector('.site-header');
  const hamburger = document.querySelector('.nav-hamburger');
  const navMenu  = document.getElementById('nav-menu');
  const navLinks = navMenu?.querySelectorAll('a') ?? [];
  const sections = document.querySelectorAll('main section[id]');

  if (!header) return;

  // Shadow su scroll
  const scrollWatcher = new IntersectionObserver(
    ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
    { rootMargin: '-1px 0px 0px 0px', threshold: 0 }
  );
  // Osserva un sentinel invisibile in cima al body
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;pointer-events:none';
  document.body.prepend(sentinel);
  scrollWatcher.observe(sentinel);

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    navMenu?.classList.toggle('open', !isOpen);
  });

  // Chiudi menu su click link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.setAttribute('aria-expanded', 'false');
      navMenu?.classList.remove('open');
    });
  });

  // Active link in base alla sezione visibile
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => sectionObserver.observe(s));
}

/* ═══════════════════════════════════════════════════════════════════
   2. PORTRAIT FALLBACK
   ─────────────────────────────────────────────────────────────────
   Se la foto non si carica, mostra il placeholder testuale.
═══════════════════════════════════════════════════════════════════ */
function initPortraitFallback() {
  const img = document.querySelector('.hero-bg-img');
  const bg  = document.querySelector('.hero-bg');
  if (!img || !bg) return;
  img.addEventListener('error', () => bg.classList.add('no-img'));
}

/* ═══════════════════════════════════════════════════════════════════
   3. SCROLL REVEAL
   ─────────────────────────────────────────────────────────────────
   Aggiunge la classe .revealed quando l'elemento entra nel viewport.
   Con reduced-motion il CSS li mostra già visibili, quindi questi
   Observer si connettono ma l'effetto è nullo (trasparente).
═══════════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.js-reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(t => observer.observe(t));
}

/* ═══════════════════════════════════════════════════════════════════
   4. SEZIONE MENTE / ANIMA — PROFILO + CONDIZIONI FLUTTUANTI
   ─────────────────────────────────────────────────────────────────
   Un profilo umano astratto (silhouette decorativa) sta al centro;
   attorno fluttuano le condizioni come <button> reali. Hover / focus /
   tap su una condizione la evidenzia e fa comparire la sua descrizione
   in dissolvenza (Web Animations API) nel pannello sotto lo stage.
   I <button> garantiscono l'accesso da tastiera (l'SVG è aria-hidden).
═══════════════════════════════════════════════════════════════════ */

/* Posizioni (% nello stage) attorno al profilo — una per condizione,
   nello stesso ordine dell'array CONDITIONS. */
const COND_SPOTS = [
  { x: 86, y: 30 }, // clinica
  { x: 84, y: 62 }, // coppia-famiglia
  { x: 65, y: 9  }, // sport
  { x: 8,  y: 31 }, // mental-training
  { x: 64, y: 90 }, // caregiver
  { x: 33, y: 92 }, // gruppi
  { x: 9,  y: 64 }, // training-autogeno
  { x: 24, y: 12 }, // crescita
];

function initMindSection() {
  const stage   = document.getElementById('mind-stage');
  const floatW  = document.getElementById('conditions-float');
  const hint    = document.getElementById('mind-panel-hint');
  const content = document.getElementById('mind-panel-content');
  const titleEl = document.getElementById('mind-panel-title');
  const bodyEl  = document.getElementById('mind-panel-body');

  if (!stage || !floatW || !content || !titleEl || !bodyEl) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chips  = [];
  let activeId = null;

  /** Evidenzia la condizione e mostra la descrizione in dissolvenza */
  function activate(id) {
    const cond = CONDITIONS.find(c => c.id === id);
    if (!cond || id === activeId) return;
    activeId = id;

    chips.forEach(b => b.classList.toggle('is-active', b.dataset.id === id));

    titleEl.textContent = cond.label;
    bodyEl.textContent  = cond.description;

    if (hint) hint.hidden = true;
    content.hidden = false;

    /* Dissolvenza morbida — saltata con prefers-reduced-motion */
    if (!reduce && typeof content.animate === 'function') {
      content.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
    }
  }

  /* Crea i chip fluttuanti — un <button> reale per condizione */
  CONDITIONS.forEach((cond, i) => {
    const spot = COND_SPOTS[i] || { x: 50, y: 50 };

    const anchor = document.createElement('div');
    anchor.className = 'cond-anchor';
    anchor.style.left = `${spot.x}%`;
    anchor.style.top  = `${spot.y}%`;

    const btn = document.createElement('button');
    btn.type       = 'button';
    btn.className   = 'cond-chip';
    btn.dataset.id  = cond.id;
    btn.textContent = cond.label;

    /* Parametri di fluttuazione organici, diversi per ogni chip */
    btn.style.setProperty('--dur',   `${(6 + (i % 4) * 0.7).toFixed(2)}s`);
    btn.style.setProperty('--delay', `${(-(i * 0.8)).toFixed(2)}s`);
    btn.style.setProperty('--dy',    `${-(7 + (i % 3) * 3)}px`);
    btn.style.setProperty('--dx',    `${(i % 2 ? 1 : -1) * (3 + (i % 3) * 2)}px`);

    btn.addEventListener('pointerenter', () => activate(cond.id));
    btn.addEventListener('focus',        () => activate(cond.id));
    btn.addEventListener('click',        () => activate(cond.id));

    anchor.appendChild(btn);
    floatW.appendChild(anchor);
    chips.push(btn);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   5. TIMELINE METODO — scroll-driven
   ─────────────────────────────────────────────────────────────────
   La linea (#timeline-fill) si riempie man mano che l'utente scrolla
   attraverso la sezione. Quando la fill raggiunge il nodo di una tappa,
   quella tappa riceve la classe .active → pop del nodo + fade-in testo.
═══════════════════════════════════════════════════════════════════ */
function initMethodTimeline() {
  const timeline = document.getElementById('method-timeline');
  const fill     = document.getElementById('timeline-fill');
  const track    = timeline?.querySelector('.timeline-track');
  const steps    = Array.from(timeline?.querySelectorAll('.js-timeline-step') ?? []);

  if (!timeline || !fill || !track || !steps.length) return;

  /* Reduced motion: mostra tutto immediatamente */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fill.style.height = '100%';
    steps.forEach(s => s.classList.add('active'));
    return;
  }

  /*
   * nodeRatios[i] = posizione del centro del nodo i rispetto alla height
   * del track, come valore 0–1.
   * La differenza (nodeRect.top - trackRect.top) è costante al variare
   * dello scroll (i due elementi si muovono insieme), quindi i valori
   * calcolati una volta sono validi per sempre fino al resize.
   */
  let nodeRatios = [];

  function cacheRatios() {
    const trackRect = track.getBoundingClientRect();
    const h = trackRect.height || 1;
    nodeRatios = steps.map(step => {
      const node = step.querySelector('.timeline-node');
      const nr   = node.getBoundingClientRect();
      return Math.max(0.02, Math.min(0.98, (nr.top + nr.height / 2 - trackRect.top) / h));
    });
  }

  /* Due rAF per aspettare che il layout (font, img) sia stabile */
  requestAnimationFrame(() => requestAnimationFrame(cacheRatios));

  /* Ricalcola su resize (debounced) */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(cacheRatios, 150);
  }, { passive: true });

  function update() {
    const rect = timeline.getBoundingClientRect();
    const vh   = window.innerHeight;

    /*
     * Progresso 0 → 1:
     *   0 quando il top della sezione è all'90% della viewport (inizia ad entrare)
     *   1 quando il bottom è al 10% della viewport (sta per uscire)
     */
    const totalRange = rect.height + vh * 0.8;
    const scrolled   = vh * 0.9 - rect.top;
    const progress   = Math.max(0, Math.min(1, scrolled / totalRange));

    fill.style.height = `${progress * 100}%`;

    /* Attiva ogni step quando la linea raggiunge il suo nodo */
    steps.forEach((step, i) => {
      const threshold = nodeRatios[i] ?? (i + 1) / (steps.length + 1);
      step.classList.toggle('active', progress >= threshold);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); /* calcolo iniziale */
}

/* ═══════════════════════════════════════════════════════════════════
   6. ANNO FOOTER
═══════════════════════════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ═══════════════════════════════════════════════════════════════════
   7. CURSORE — aura luminosa che respira + scia
   ─────────────────────────────────────────────────────────────────
   - Un nucleo preciso segue esattamente il puntatore (hotspot).
   - Un'aura morbida lo insegue con leggero ritardo e "respira" (scale
     CSS indipendente dalla posizione → niente conflitti col transform).
   - Alcuni punti formano una scia che insegue a catena (effetto cometa).
   Attivo solo con puntatore fine e senza prefers-reduced-motion; anima
   esclusivamente translate3d/opacity (GPU-friendly).
═══════════════════════════════════════════════════════════════════ */
function initCursorAura() {
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reduce      = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reduce) return;

  const TRAIL = 6;
  const trail = [];
  for (let i = 0; i < TRAIL; i++) {
    const el = document.createElement('div');
    el.className = 'cursor-trail-dot';
    el.style.opacity = String(0.45 * (1 - i / TRAIL));
    document.body.appendChild(el);
    trail.push({ el, x: -100, y: -100 });
  }

  const aura = document.createElement('div');
  aura.className = 'cursor-aura';
  const core = document.createElement('div');
  core.className = 'cursor-core';
  document.body.append(aura, core);

  document.body.classList.add('cursor-aura-active', 'cursor-hidden');

  let mx = -100, my = -100; // posizione puntatore
  let ax = -100, ay = -100; // posizione aura (smussata)

  const lerp = (a, b, n) => a + (b - a) * n;

  window.addEventListener('pointermove', e => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mx = e.clientX;
    my = e.clientY;
    document.body.classList.remove('cursor-hidden');
    core.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
  }, { passive: true });

  /* Nascondi quando il puntatore lascia la finestra */
  document.addEventListener('pointerleave', () => {
    document.body.classList.add('cursor-hidden');
  });
  window.addEventListener('blur', () => {
    document.body.classList.add('cursor-hidden');
  });

  function frame() {
    /* L'aura insegue con ritardo morbido */
    ax = lerp(ax, mx, 0.2);
    ay = lerp(ay, my, 0.2);
    aura.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;

    /* La scia: ogni punto insegue il precedente (catena) */
    let px = ax, py = ay;
    for (let i = 0; i < trail.length; i++) {
      const t = trail[i];
      t.x = lerp(t.x, px, 0.34);
      t.y = lerp(t.y, py, 0.34);
      t.el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
      px = t.x;
      py = t.y;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ═══════════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initPortraitFallback();
  initScrollReveal();
  initMindSection();
  initMethodTimeline();
  initFooterYear();
  initCursorAura();
});
