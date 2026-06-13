# Sito psicologo — mattiabonardi.github.io

Sito one-page statico per psicologo. HTML + CSS + JS vanilla, nessun build step.

## Come pubblicare su GitHub Pages

### Prima pubblicazione

1. Assicurati che il repository si chiami `<tuousername>.github.io` (es. `mattiabonardi.github.io`).
2. Su GitHub → repo → **Settings → Pages**.
3. In "Source" seleziona **Deploy from a branch**.
4. Branch: `main`, cartella: `/ (root)`. Salva.
5. Dopo ~1 minuto il sito è live su `https://<tuousername>.github.io`.

### Aggiornamenti

Ogni push sul branch `main` triggera automaticamente un nuovo deploy.

```bash
git add .
git commit -m "aggiornamento contenuti"
git push
```

### Struttura

```
/
├── index.html          # Pagina unica
├── css/styles.css      # Stili (custom properties, nessun hardcoded)
├── js/main.js          # Logica interattiva
└── assets/
    └── img/            # portrait.jpg, og-image.jpg, favicon.svg
```

### Cosa completare prima del deploy definitivo

- [ ] Sostituire tutti i `<!-- PLACEHOLDER -->` in `index.html` con i contenuti reali
- [ ] Aggiornare l'array `CONDITIONS` in `js/main.js` con le condizioni trattate e le descrizioni
- [ ] Aggiungere `assets/img/portrait.jpg` (foto psicologo, ~800×1000px)
- [ ] Aggiungere `assets/img/og-image.jpg` (immagine social, 1200×630px)
- [ ] Aggiungere `assets/img/favicon.svg`
- [ ] Integrare la soluzione di prenotazione (form, Calendly, ecc.) nella sezione `#prenota`
- [ ] Aggiungere informativa privacy e collegare il link nel footer

### Test locale

Apri `index.html` direttamente nel browser, oppure usa un server locale:

```bash
# Python 3
python3 -m http.server 8080
# poi apri http://localhost:8080
```

> **Nota**: il sito funziona anche aperto direttamente come file (`file://`), ma un server locale è consigliato per testare i font e le immagini correttamente.
