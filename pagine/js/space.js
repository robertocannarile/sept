// space.js — pagina Space
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Usa le costanti globali di js/core.js (appEl, lenis, onScroll, requestScrollFrame, measureSections).

  // ── space horizontal scroll ─────────────────────
  const spaceWrapper = document.getElementById('space-scroll-wrapper');
  const spaceSection = document.getElementById('space');
  const spaceStrip   = document.getElementById('space-strip');

  // (11.10.26) Via la strip mossa dallo scroll (sosta, SPACE_SOSTA, wrapper allungato): ora e' un
  // NASTRO che scorre da solo, all'infinito. La versione a scroll e' in ../Base e nei backup.
  // ── tutto in uno schermo (23.09.2026, Roberto) ──
  // Immagini piu' basse quanto serve perche' etichetta + immagini + testo stiano nello schermo
  // senza scorrere. Si fa in JS perche' l'altezza del testo cambia con la larghezza (a capo),
  // e il CSS non la conosce. Le immagini non superano MAI l'altezza del CSS (si rimpiccioliscono
  // soltanto) e non scendono sotto SPACE_IMG_MIN. Il CSS resta come riserva se il JS non gira.
  // NB il 17.09 una versione in CSS era stata ritirata ("si restringe male"): ora lo chiede lui.
  const spaceFrames = [...spaceStrip.querySelectorAll('.space-parallax-frame')];
  const spaceText   = spaceSection.querySelector('.space-text');
  const SPACE_IMG_MIN = 140;   // px: sotto, meglio che il testo esca un po' di sotto
  const SPACE_FONDO   = 24;    // px liberi sotto l'ultima riga di testo
  let adattaSpace = function () {
    spaceFrames.forEach(f => { f.style.height = ''; });
    spaceText.style.top = '';
    const top0    = spaceStrip.offsetTop;                 // 64 + etichetta, dal CSS
    const altCss  = spaceFrames[0].offsetHeight;          // altezza immagini del CSS
    const stacco  = spaceText.offsetTop - (top0 + altCss); // spazio immagini → testo, dal CSS
    // altezza del testo = fondo del suo figlio piu' basso (il blocco ruotato sborda un po')
    const tTop = spaceText.getBoundingClientRect().top;
    let testoH = 0;
    for (const c of spaceText.children) testoH = Math.max(testoH, c.getBoundingClientRect().bottom - tTop);
    const schermo = appEl.clientHeight;
    const alt = Math.round(Math.max(SPACE_IMG_MIN, Math.min(altCss, schermo - top0 - stacco - testoH - SPACE_FONDO)));
    if (alt === altCss) return;
    spaceFrames.forEach(f => { f.style.height = alt + 'px'; });
    spaceText.style.top = (top0 + alt + stacco) + 'px';
  };

  // ── NASTRO AUTOMATICO INFINITO (11.10.2026, Roberto) ──
  // "rendiamo lo scroll delle immagini automatico e infinito; se l'utente va su con il mouse puo'
  // scrollare lui". Stessa meccanica del nastro di About (about.js): le cornici dentro
  // `.space-nastro` + copie, `pos` cresce di VELOCITA px/s, transform = -(pos mod giro), giro =
  // distanza fra la 1a cornice e la sua prima copia → nessuno stacco. La strip fa da finestra
  // (CSS "SPACE — NASTRO AUTOMATICO").
  // Mouse sopra la strip: il nastro continua, la rotella/trackpad lo sposta (avanti e indietro). Col dito: si trascina in orizzontale, al rilascio riparte.
  const VELOCITA = window.matchMedia(window.SEPT_TELEFONO).matches ? 30 : 40;   // px al secondo
  const COPIE = 3;
  const originali = [...spaceFrames];
  const nastro = document.createElement('div');
  nastro.className = 'space-nastro';
  originali.forEach(f => nastro.appendChild(f));
  for (let c = 1; c < COPIE; c++) originali.forEach(f => {
    const k = f.cloneNode(true);
    k.setAttribute('aria-hidden', 'true');
    nastro.appendChild(k);
  });
  spaceStrip.appendChild(nastro);
  spaceStrip.setAttribute('data-lenis-prevent', '');   // la rotella sopra la strip e' sua, non della pagina
  const cornici = [...nastro.querySelectorAll('.space-parallax-frame')];
  const immagini = cornici.map(f => f.querySelector('img'));
  // adattaSpace scrive l'altezza sulle cornici originali: le copie la devono seguire
  const adattaPrima = adattaSpace;
  adattaSpace = function () {
    cornici.forEach(f => { f.style.height = ''; });
    adattaPrima();
    const h = spaceFrames[0].style.height;
    cornici.forEach(f => { f.style.height = h; });
  };

  // la finestra ora e' larga tutta la pagina (left 0): all'apertura il nastro parte spostato a
  // destra di quanto era il `left` della strip, cosi' la prima immagine e' dove stava prima
  // (colonna del testo); a sinistra c'e' gia' la coda del giro precedente, quindi niente vuoto.
  const partenza = parseFloat(getComputedStyle(spaceStrip).left) || 0;   // letto PRIMA della classe --auto
  let pos = 0, giro = 0, tPrima = 0, fermo = false, inVista = true, stripLeft = 0;
  pos = -partenza;
  spaceStrip.classList.add('space-strip--auto');
  const centri = new Float32Array(cornici.length), larghe = new Float32Array(cornici.length);

  function misura() {
    adattaSpace();
    giro = cornici[originali.length].offsetLeft - cornici[0].offsetLeft;
    cornici.forEach((f, i) => { centri[i] = f.offsetLeft + f.offsetWidth / 2; larghe[i] = f.offsetWidth; });
    stripLeft = spaceStrip.getBoundingClientRect().left;
    spaceWrapper.style.height = '';   // niente piu' sosta: il wrapper e' alto quanto la sezione
    measureSections();
    disegna();
  }
  window.__septSpace = { misura };

  function disegna() {
    if (!giro) return;
    const x = ((pos % giro) + giro) % giro;   // anche con pos negativo (rotella all'indietro)
    nastro.style.transform = `translate3d(${-x}px, 0, 0)`;
    // parallasse dentro le cornici, come prima: l'immagine si sposta di +-8% secondo la posizione
    // della cornice sullo schermo. Posizioni calcolate (offsetLeft in cache), nessuna lettura di layout.
    const vw = window.innerWidth;
    for (let i = 0; i < cornici.length; i++) {
      const c = stripLeft + centri[i] - x;
      if (c < -larghe[i] || c > vw + larghe[i]) continue;   // fuori schermo: non serve
      const off = Math.max(-8, Math.min(8, (c - vw / 2) / vw * 12));
      immagini[i].style.transform = `scale(1.2) translateX(${off}%)`;
    }
  }

  function passo(t) {
    if (tPrima && !fermo && inVista) pos += VELOCITA * Math.min(0.1, (t - tPrima) / 1000);   // max 0.1 s: niente salti dopo una scheda in background
    tPrima = t;
    if (inVista) disegna();
    requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);

  new IntersectionObserver(es => { inVista = es[0].isIntersecting; }).observe(spaceStrip);

  // mouse sopra: il nastro NON si ferma (Roberto 11.10.26, prima si fermava), la rotella lo sposta
  // avanti/indietro mentre continua a scorrere da solo
  spaceStrip.addEventListener('wheel', e => {
    e.preventDefault();
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerWidth : 1;   // righe/pagine → px
    pos += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * k;
    disegna();
  }, { passive: false });

  // dito: trascinamento orizzontale (lo scroll verticale della pagina resta al browser)
  spaceStrip.style.touchAction = 'pan-y';
  let tocco = null;
  spaceStrip.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    tocco = { x: e.clientX, y: e.clientY, pos, oriz: null };
    fermo = true;
  });
  window.addEventListener('pointermove', e => {
    if (!tocco) return;
    const dx = e.clientX - tocco.x, dy = e.clientY - tocco.y;
    if (tocco.oriz === null && Math.abs(dx) + Math.abs(dy) > 6) tocco.oriz = Math.abs(dx) > Math.abs(dy);
    if (tocco.oriz) { pos = tocco.pos - dx; disegna(); }
  });
  const lascia = () => { if (tocco) { tocco = null; fermo = false; } };
  window.addEventListener('pointerup', lascia);
  window.addEventListener('pointercancel', lascia);

  window.addEventListener('resize', misura);
  // il font arriva dopo il primo layout e cambia l'altezza del testo
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(misura);

  let spaceLoaded = 0;
  function onSpaceImg() { if (++spaceLoaded >= immagini.length) misura(); }
  immagini.forEach(img => {
    if (img.complete && img.naturalWidth) onSpaceImg();
    else { img.addEventListener('load', onSpaceImg); img.addEventListener('error', onSpaceImg); }
  });
  misura();

  // (19.10.26) immagini che entrano dal basso all'apertura (core.js), come in Campaigns
  window.septEntrataCornici(cornici);
