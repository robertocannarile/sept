// space.js — pagina Space
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Usa le costanti globali di js/core.js (appEl, lenis, onScroll, requestScrollFrame, measureSections).

  // ── space horizontal scroll ─────────────────────
  const spaceWrapper = document.getElementById('space-scroll-wrapper');
  const spaceSection = document.getElementById('space');
  const spaceStrip   = document.getElementById('space-strip');
  let spaceTravelX   = 0;
  let spaceStripX    = 0;   // translateX gia' applicato allo strip (per correggere i rect letti)

  // px di scroll verticale per px di viaggio orizzontale della strip di Space. Era 2.2 su tutti i
  // device; (17.09.26) "su mobile le immagini di Space sono troppo lente e richiedono tanto scroll"
  // → 1.4 su mobile, desktop/tablet invariati. Regolabile da `?regola=1` o `?spacesosta=`.
  let SPACE_SOSTA = +((location.search.match(/[?&]spacesosta=([\d.]+)/) || [])[1]
                      || (window.matchMedia('(max-width: 768px)').matches ? 0.6 : 2.2));   // mobile 0.6 scelto da Roberto (17.09.26)
  window.__septSpace = { get sosta() { return SPACE_SOSTA; }, set sosta(v) { SPACE_SOSTA = v; initSpaceScroll(); } };
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
  function adattaSpace() {
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
  }

  function initSpaceScroll() {
    spaceStrip.style.transform = '';
    spaceStripX = 0;
    adattaSpace();   // prima di misurare il viaggio: immagini piu' basse = strip piu' corta
    const totalW   = spaceStrip.scrollWidth;
    const viewW    = spaceSection.clientWidth;
    // partenza della strip = il suo `left` del CSS (16 mobile · 136 tablet con sidebar ·
    // colonna 4 su desktop): prima era ricalcolata qui a mano e su tablet valeva 16
    const col4Left = parseFloat(getComputedStyle(spaceStrip).left) || 16;
    spaceTravelX   = Math.max(0, col4Left + totalW - viewW);
    spaceWrapper.style.height = (window.innerHeight + spaceTravelX * SPACE_SOSTA) + 'px';
    measureSections();   // cambia l'altezza del wrapper → i range delle sezioni vanno rifatti
    updateSpace();
  }

  const spaceParallaxImgs = spaceStrip.querySelectorAll('.space-parallax-frame img');

  // gate viewport: senza questo updateSpace girava a ogni scroll frame di TUTTA
  // la pagina, con reflow forzati anche quando Space e' lontanissima.
  let spaceInView = false;
  new IntersectionObserver(es => {
    es.forEach(e => { spaceInView = e.isIntersecting; });
    if (spaceInView) requestScrollFrame();
  }, { rootMargin: '50% 0px' }).observe(spaceWrapper);

  const spaceParallaxOff = new Float32Array(spaceParallaxImgs.length);

  const SPACE_FRENO = 0.6;   // da che punto della corsa la strip inizia a frenare
  function updateSpace() {
    const rect       = spaceWrapper.getBoundingClientRect();
    const vh         = appEl.clientHeight;
    // (23.09.26) era vh * 0.4: la strip partiva quando Space arrivava al 40% dello schermo
    // scendendo da Brands. Ora Space e' in cima alla sua pagina, quindi si parte da 0,
    // altrimenti la strip comparirebbe gia' spostata all'apertura.
    const earlyStart = 0;
    // (23.09.26) era `innerWidth < 1024 ? 0 : vh * 0.4`: margine per la strip mentre Space usciva
    // verso Campaigns. In una pagina a se' Space non esce mai, e con quel margine la corsa non
    // arrivava a 1 in fondo alla pagina: su desktop l'ultima immagine restava tagliata di ~30 px.
    const earlyEnd   = 0;
    const scrolled   = -(rect.top - earlyStart);
    const scrollable = spaceWrapper.offsetHeight - vh + earlyStart + earlyEnd;
    // strip moves continuously across the whole pin — longer & fluid, no dead stop
    const lineare    = Math.max(0, Math.min(1, scrolled / scrollable));
    // USCITA FLUIDA (Roberto 16.09.26): prima la strip andava a velocita' costante e si
    // piantava di colpo a fine corsa. Ora e' lineare fino a SPACE_FRENO, poi rallenta fino a
    // fermarsi con velocita' zero (tratto quadratico). Pendenza e raccordo calcolati perche'
    // valore e velocita' combacino nel punto di passaggio: nessuno scatto.
    const c = SPACE_FRENO, a = 2 / (1 + c);
    const progress   = lineare <= c ? lineare * a
                                    : 1 - (a / (2 * (1 - c))) * (1 - lineare) * (1 - lineare);

    // Due fasi: prima TUTTE le letture (rect delle frame), poi TUTTE le scritture
    // (strip + img). Prima la write del transform dello strip e quelle delle img
    // erano interlacciate con le getBoundingClientRect → un reflow sincrono per
    // immagine, a ogni frame di scroll.
    const vw = window.innerWidth;
    const stripX = -spaceTravelX * progress;
    // i rect vengono letti PRIMA di scrivere il nuovo transform dello strip,
    // quindi riflettono ancora spaceStripX: correggo con il delta → risultato
    // identico a prima, ma senza interlacciare read e write.
    const dx = stripX - spaceStripX;
    for (let i = 0; i < spaceParallaxImgs.length; i++) {
      const r = spaceParallaxImgs[i].parentElement.getBoundingClientRect();
      const relPos = (r.left + dx + r.width / 2 - vw / 2) / vw;
      spaceParallaxOff[i] = Math.max(-8, Math.min(8, relPos * 12));
    }
    spaceStrip.style.transform = `translateX(${stripX}px)`;
    spaceStripX = stripX;
    for (let i = 0; i < spaceParallaxImgs.length; i++) {
      spaceParallaxImgs[i].style.transform = `scale(1.2) translateX(${spaceParallaxOff[i]}%)`;
    }
  }

  onScroll(() => { if (spaceInView) updateSpace(); });
  window.addEventListener('resize', initSpaceScroll);
  // il font arriva dopo il primo layout e cambia l'altezza del testo
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(initSpaceScroll);

  const spaceImgs = Array.from(spaceStrip.querySelectorAll('img'));
  let spaceLoaded = 0;
  function onSpaceImg() { if (++spaceLoaded >= spaceImgs.length) initSpaceScroll(); }
  spaceImgs.forEach(img => {
    if (img.complete && img.naturalWidth) onSpaceImg();
    else { img.addEventListener('load', onSpaceImg); img.addEventListener('error', onSpaceImg); }
  });
