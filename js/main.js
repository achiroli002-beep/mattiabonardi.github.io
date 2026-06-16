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
    id: 'ansia',
    label: 'Ansia e preoccupazione',
    description:
      'Preoccupazione eccessiva, tensione cronica, attacchi di panico. Lavoriamo insieme per riconoscere i pattern e ritrovare una sensazione di sicurezza interiore.',
  },
  {
    id: 'depressione',
    label: 'Depressione',
    description:
      'Tristezza persistente, mancanza di energia o motivazione, senso di vuoto. Il percorso aiuta a riscoprire risorse sopite e a riconnettersi con ciò che conta.',
  },
  {
    id: 'relazioni',
    label: 'Difficoltà relazionali',
    description:
      'Conflitti di coppia, difficoltà di comunicazione, rotture. Lo spazio terapeutico permette di capire i propri schemi e costruire legami più autentici.',
  },
  {
    id: 'autostima',
    label: 'Autostima e identità',
    description:
      'Senso di inadeguatezza, critica interiore, incertezza su chi si è. Lavoriamo per rafforzare il rapporto con se stessi e con i propri valori.',
  },
  {
    id: 'stress',
    label: 'Stress e burnout',
    description:
      'Sovraccarico lavorativo o familiare, esaurimento, difficoltà a "staccare". Costruiamo strategie concrete per recuperare equilibrio e confini.',
  },
  {
    id: 'lutto',
    label: 'Lutto e perdita',
    description:
      'Elaborare la perdita di una persona cara, di una relazione o di una parte di sé. Un accompagnamento rispettoso dei tempi di ciascuno.',
  },
  {
    id: 'fobie',
    label: 'Fobie e ossessioni',
    description:
      "Paure specifiche, rituali compulsivi, pensieri intrusivi. Con tecniche evidence-based aiutiamo a ridurre l’impatto sulla vita quotidiana.",
  },
  {
    id: 'crescita',
    label: 'Crescita personale',
    description:
      'Chi non ha un "problema" ma sente di voler capirsi meglio, espandere i propri confini e vivere in modo più consapevole.',
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
   4. SEZIONE MENTE / ANIMA — ORBITA CONDIZIONI
   ─────────────────────────────────────────────────────────────────
   Flusso logico:
   a) buildConditionButtons() — crea i <button> e li aggiunge al DOM
   b) buildFallbackList()     — popola la lista statica accessibile
   c) OrbitAnimation          — classe che gestisce l'animazione
   d) initMindSection()       — entry point, gestisce mobile/reduced-motion
═══════════════════════════════════════════════════════════════════ */

/** Crea i pulsanti condizione e li inietta nell'orbita */
function buildConditionButtons(containerEl, onClickCallback) {
  CONDITIONS.forEach(cond => {
    const btn = document.createElement('button');
    btn.className   = 'condition-btn';
    btn.type        = 'button';
    btn.dataset.id  = cond.id;
    btn.textContent = cond.label;
    btn.setAttribute('aria-label', cond.label);
    btn.addEventListener('click', () => onClickCallback(cond, btn));
    containerEl.appendChild(btn);
  });
}

/** Popola il fallback statico (lista chip) */
function buildFallbackList() {
  const list = document.getElementById('fallback-list');
  if (!list) return;
  CONDITIONS.forEach(cond => {
    const li = document.createElement('li');
    li.textContent = cond.label;
    list.appendChild(li);
  });
}

/* ───────────────────────────────────────────────────────────────────
   OrbitAnimation
   ─────────────────────────────────────────────────────────────────
   Gestisce:
   - Calcolo posizioni su ellisse
   - Animazione drift (leggera deriva organica)
   - Animazione opacity (pulsazione/dissolvenza)
   - Ciclo timer per garantire che tutte le condizioni siano visibili
   - Pausa orbita quando il popover è aperto
   - IntersectionObserver: avvia/ferma l'animazione se la sezione
     è fuori dallo schermo (risparmio GPU)
─────────────────────────────────────────────────────────────────── */
class OrbitAnimation {
  constructor(stageEl, buttons) {
    this.stage   = stageEl;
    this.buttons = Array.from(buttons);
    this.rafId   = null;
    this.paused  = false;
    this.running = false;

    /* Ellisse di base centrata nel palcoscenico */
    this.cx = 0.5; // centro relativo (0–1)
    this.cy = 0.5;

    /* Ogni pulsante ha un suo stato di animazione */
    this.states = this.buttons.map((_, i) => ({
      /* Angolo iniziale distribuito uniformemente */
      angle:     (i / this.buttons.length) * Math.PI * 2,
      /* Velocità angolare base (rad/ms) — molto lenta */
      speed:     0.00018 + Math.random() * 0.00008,
      /* Parametri drift — piccolo offset sinusoidale organico */
      driftAmp:  6 + Math.random() * 8,          // px
      driftFreq: 0.0004 + Math.random() * 0.0003,// rad/ms
      driftPhase:Math.random() * Math.PI * 2,
      /* Parametri opacity — pulsazione lenta */
      opacityMin: 0.45,
      opacityMax: 1,
      opacityFreq:0.0006 + Math.random() * 0.0004,
      opacityPhase:Math.random() * Math.PI * 2,
    }));

    this.lastTime = null;
    this._tick    = this._tick.bind(this);
  }

  /**
   * Calcola dimensioni ellisse in base al container.
   * Chiamato ogni frame per adattarsi al resize.
   */
  _getEllipse() {
    const w = this.stage.offsetWidth;
    const h = this.stage.offsetHeight;
    return {
      cx: w * this.cx,
      cy: h * this.cy,
      rx: w * 0.40, // semiasse orizzontale
      ry: h * 0.38, // semiasse verticale
    };
  }

  _tick(timestamp) {
    if (!this.running) return;

    const dt = this.lastTime ? Math.min(timestamp - this.lastTime, 50) : 0;
    this.lastTime = timestamp;

    if (!this.paused) {
      const { cx, cy, rx, ry } = this._getEllipse();

      this.buttons.forEach((btn, i) => {
        const s = this.states[i];
        s.angle += s.speed * dt;

        /* Posizione ellisse + drift sinusoidale */
        const t   = timestamp;
        const x   = cx + rx * Math.cos(s.angle) + s.driftAmp * Math.sin(s.driftFreq * t + s.driftPhase);
        const y   = cy + ry * Math.sin(s.angle) + s.driftAmp * Math.cos(s.driftFreq * t + s.driftPhase + 1);

        /* Opacity: pulsazione tra min e max */
        const opRange = s.opacityMax - s.opacityMin;
        const opacity = s.opacityMin + opRange * (0.5 + 0.5 * Math.sin(s.opacityFreq * t + s.opacityPhase));

        /* Applica con transform + opacity (GPU-friendly, niente reflow) */
        btn.style.left    = `${x}px`;
        btn.style.top     = `${y}px`;
        btn.style.opacity = opacity.toFixed(3);
      });
    }

    this.rafId = requestAnimationFrame(this._tick);
  }

  start() {
    if (this.running) return;
    this.running  = true;
    this.lastTime = null;
    this.rafId    = requestAnimationFrame(this._tick);
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  pause()  { this.paused = true; }
  resume() { this.paused = false; }
}

/* ───────────────────────────────────────────────────────────────────
   Popover — gestione accessibile
─────────────────────────────────────────────────────────────────── */
class ConditionPopover {
  constructor(popoverEl, orbit) {
    this.el     = popoverEl;
    this.orbit  = orbit; // riferimento all'OrbitAnimation per pause/resume
    this.active = null;  // pulsante attualmente attivo

    this.titleEl = document.getElementById('popover-title');
    this.bodyEl  = document.getElementById('popover-body');
    this.closeBtn = document.getElementById('popover-close');

    this.closeBtn?.addEventListener('click', () => this.close());

    /* Chiudi con Esc */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !this.isHidden()) this.close();
    });

    /* Chiudi con click esterno */
    document.addEventListener('pointerdown', e => {
      if (!this.isHidden() && !this.el.contains(e.target) && e.target !== this.active) {
        this.close();
      }
    });
  }

  isHidden() {
    return this.el.getAttribute('aria-hidden') === 'true';
  }

  open(condition, triggerBtn) {
    if (this.titleEl) this.titleEl.textContent = condition.label;
    if (this.bodyEl)  this.bodyEl.textContent  = condition.description;
    this.el.setAttribute('aria-hidden', 'false');
    this.active = triggerBtn;
    this.orbit?.pause();
    /* Sposta il focus nel popover */
    requestAnimationFrame(() => this.el.focus());
  }

  close() {
    this.el.setAttribute('aria-hidden', 'true');
    this.orbit?.resume();
    /* Restituisci il focus al pulsante che ha aperto il popover */
    this.active?.focus();
    this.active = null;
  }
}

/* ───────────────────────────────────────────────────────────────────
   initMindSection — entry point
─────────────────────────────────────────────────────────────────── */
function initMindSection() {
  const section    = document.getElementById('mind-map');
  const stage      = document.getElementById('mind-stage');
  const orbitEl    = document.getElementById('conditions-orbit');
  const popoverEl  = document.getElementById('condition-popover');

  if (!section || !stage || !orbitEl || !popoverEl) return;

  /* Popola sempre la lista statica fallback */
  buildFallbackList();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile       = () => window.innerWidth < 768;

  /* Su mobile o reduced-motion: layout statico, niente orbit */
  if (prefersReduced || isMobile()) {
    buildConditionButtons(orbitEl, (cond, btn) => {
      /* Crea popover semplificato anche in modalità statica */
      const popover = new ConditionPopover(popoverEl, null);
      popover.open(cond, btn);
    });
    return;
  }

  /* ── Desktop, animazione completa ── */
  let orbit   = null;
  let popover = null;

  function setup() {
    /* Crea pulsanti */
    buildConditionButtons(orbitEl, (cond, btn) => {
      popover.open(cond, btn);
    });

    const buttons = orbitEl.querySelectorAll('.condition-btn');
    orbit   = new OrbitAnimation(stage, buttons);
    popover = new ConditionPopover(popoverEl, orbit);

    /*
     * IntersectionObserver: avvia l'animazione solo quando la sezione
     * è visibile almeno al 10% — risparmia RAF quando l'utente è
     * in un'altra parte della pagina.
     */
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting ? orbit.start() : orbit.stop(),
      { threshold: 0.1 }
    );
    visibilityObserver.observe(section);
  }

  setup();

  /* Rileva resize: se si passa a mobile, ricrea in modalità statica */
  const mq = window.matchMedia('(max-width: 767px)');
  mq.addEventListener('change', e => {
    if (e.matches) {
      orbit?.stop();
      /* Non è necessario ricostruire il DOM: il CSS mobile li mostra già statici */
    } else {
      orbit?.start();
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════
   5. ANNO FOOTER
═══════════════════════════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ═══════════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initPortraitFallback();
  initScrollReveal();
  initMindSection();
  initFooterYear();
});
