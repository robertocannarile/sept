// brands.js — pagina Brands
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Usa le costanti globali di js/core.js (appEl, lenis, SEPT_BRANDS).

  // ── Brands: NASTRO INFINITO AUTOMATICO (23.09.2026, Roberto) ──────────────────────
  // I 39 nomi, uno per riga, salgono da soli a velocita' costante e ricominciano senza stacco
  // (XLARGE → A BATHING APE). Acceso e' il nome a META' ALTEZZA dello schermo, con una breve
  // sfumatura mentre passa; la card mostra il suo brand. La pagina non scorre: la sezione e'
  // alta quanto lo schermo (CSS, blocco "BRANDS NASTRO"). Rotella, trackpad e dito spostano il
  // nastro avanti e indietro; poi riparte da solo.
  // Storia della giornata: testo continuo in un pin (sito monofile) → colonna letta scorrendo la
  // pagina → questo. Le versioni prima sono descritte in CLAUDE.md.
  //
  // Il loop: la lista viene COPIATA (qui, prima che testo.js la spezzi in righe) e il nastro si
  // sposta di `pos` modulo l'altezza di una copia: quando la prima copia e' tutta sopra, la
  // seconda e' esattamente dove era la prima, quindi il salto non si vede.
  const nastroTesto = document.querySelector('#brands .brands-text');
  const N           = SEPT_BRANDS.length;
  const COPIE       = 3;          // 2 bastano se una copia e' piu' alta dello schermo; 3 per margine
  const BRANDS_VELOCITA = 32;     // px al secondo: ~1 nome ogni 1.5 s su desktop
  const nastro = document.createElement('div');
  nastro.className = 'brands-nastro';
  nastroTesto.parentNode.insertBefore(nastro, nastroTesto);
  nastro.appendChild(nastroTesto);
  for (let c = 1; c < COPIE; c++) {
    const copia = nastroTesto.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');   // i lettori di schermo leggono i nomi una volta
    nastro.appendChild(copia);
  }
  // `let`: al resize il testo viene ri-spezzato in righe (SplitType) → si rilegge (sept:textsplit)
  let brandLinks = nastro.querySelectorAll('.brands-text a');

  // ── card del brand (invariata dal sito monofile) ─────────────────
  const brandFolders = SEPT_BRANDS;   // elenco in core.js

  const brandCard = document.getElementById('brand-card');
  const brandImgA = document.getElementById('brand-card-img-a');
  const brandImgB = document.getElementById('brand-card-img-b');
  let activeBrandIdx = -1;
  let frontImg = brandImgA; // currently visible layer

  // webp per primo: dal 14.09.26 le card sono tutte webp (max 1200 px di lato lungo, vedi
  // shrink_images.py; originali in ../_originali_14.09.26/). Tenere 'jpg' davanti costava un 404 per card.
  const BRAND_EXTS = ['webp', 'jpg', 'avif'];

  // Prefetch delle card: senza, la prima immagine partiva solo dentro `crossfade`, cioe' dopo che
  // lo scroll aveva gia' scoperto il brand → la card arrivava in ritardo al primo passaggio.
  // Le <img> risolte restano in `brandPrefetch` (referenza viva = bitmap non buttata) e il path
  // che ha risposto in `brandSrcResolved`, cosi' il crossfade non ritenta le estensioni.

  const brandPrefetch    = new Map();   // idx → HTMLImageElement (null = brand senza immagine)
  const brandLive        = [];          // indici con la <img> ancora viva, dal piu' vecchio
  const BRAND_LIVE_MAX   = 6;           // 34 card decodificate insieme = ~87 MB: troppo su iPhone
  const brandSrcResolved = new Map();   // idx → src che ha caricato ('' = nessuna immagine)

  function brandUrl(idx, ext) {
    return `assets/brands_img/${encodeURIComponent(brandFolders[idx])}/img_1.${ext}`;
  }

  function prefetchBrand(idx, onDone) {
    if (idx < 0 || idx >= brandFolders.length) { if (onDone) onDone(null); return; }
    if (brandPrefetch.has(idx)) { if (onDone) onDone(brandPrefetch.get(idx)); return; }
    let attempt = 0;
    const img = new Image();
    img.decoding = 'async';
    brandPrefetch.set(idx, img);          // segnaposto: evita due prefetch sullo stesso indice
    function tryNext() {
      if (attempt >= BRAND_EXTS.length) {  // 5 brand non hanno immagine: LEE 101, MONO,
        brandSrcResolved.set(idx, '');     // PEACEMAKER OAMC, RHIZOME, THE SKATEROOM
        brandPrefetch.set(idx, null);
        if (onDone) onDone(null);
        return;
      }
      img.src = brandUrl(idx, BRAND_EXTS[attempt++]);
    }
    img.onerror = tryNext;
    img.onload = function() {
      brandSrcResolved.set(idx, img.src);
      brandLive.push(idx);
      while (brandLive.length > BRAND_LIVE_MAX) {
        // si lascia andare la bitmap piu' vecchia: il file resta nella cache HTTP, quindi
        // se ci torni sopra ricarica dal disco senza rete
        const old = brandLive.shift();
        if (old !== idx) brandPrefetch.delete(old);
      }
      const finish = () => { if (onDone) onDone(img); };
      if (img.decode) img.decode().then(finish, finish); else finish();
    };
    tryNext();
  }

  function loadBrandImg(idx, onReady) {
    const backImg = frontImg === brandImgA ? brandImgB : brandImgA;
    backImg.alt   = brandFolders[idx];
    prefetchBrand(idx, function(img) {
      if (!img) { onReady(null); return; }
      // sorgente gia' scaricata e decodificata: l'assegnazione e' immediata
      if (backImg.src === img.src) { onReady(backImg); return; }
      backImg.onerror = () => onReady(null);
      backImg.onload  = () => onReady(backImg);
      backImg.src     = img.src;
    });
  }

  function crossfade(idx) {
    loadBrandImg(idx, (backImg) => {
      if (!backImg) { brandCard.classList.remove('active'); return; }
      // bring back layer on top, fade it in
      backImg.style.zIndex  = 2;
      frontImg.style.zIndex = 1;
      backImg.classList.add('visible');
      // fade out front
      frontImg.classList.remove('visible');
      frontImg = backImg;
      brandCard.classList.add('active');
    });
  }

  // ── misure (rifatte a resize, font caricato, ri-split del testo) ──
  // Posizioni lette UNA volta, relative al nastro (il transform le sposta tutte insieme, quindi la
  // differenza non cambia): per frame e' aritmetica. ⚠️ Non offsetTop: `.brands-text` e'
  // position: relative, quindi l'offsetTop di un nome e' dal suo paragrafo, non dal nastro.
  let giro = 0, centri = [], altRiga = 40;
  function misura() {
    brandLinks = nastro.querySelectorAll('.brands-text a');
    const copie = nastro.querySelectorAll('.brands-text');
    const n0 = nastro.getBoundingClientRect().top;
    giro = copie.length > 1 ? copie[1].getBoundingClientRect().top - copie[0].getBoundingClientRect().top : nastro.offsetHeight;
    centri = [...brandLinks].map(a => { const r = a.getBoundingClientRect(); return r.top - n0 + r.height / 2; });
    altRiga = brandLinks.length ? brandLinks[0].getBoundingClientRect().height : 40;
  }

  // posizione del nastro: `pos` cresce col tempo (e con rotella/dito). All'apertura A BATHING APE
  // (primo nome della SECONDA copia) sta a meta' schermo; sopra si vedono gli ultimi della prima.
  let pos = 0, posPronta = false;
  function mettiPrimoAlCentro() {
    const meta = appEl.clientHeight / 2 - nastro.offsetTop;
    pos = centri[N] - meta;   // centri[N] = primo nome della seconda copia
    posPronta = true;
  }

  function disegna() {
    if (!giro) return;
    const y = ((pos % giro) + giro) % giro;          // modulo sempre positivo (anche tornando indietro)
    nastro.style.transform = `translate3d(0, ${-y}px, 0)`;
    // centro dello schermo in coordinate del nastro
    const c = y + appEl.clientHeight / 2 - nastro.offsetTop;
    let piuVicino = -1, dMin = Infinity;
    for (let i = 0; i < brandLinks.length; i++) {
      const d = Math.abs(centri[i] - c);
      if (d < dMin) { dMin = d; piuVicino = i; }
      // acceso pieno al centro, spento a una riga di distanza: la sfumatura dura quanto il passaggio
      const luce = Math.max(0, 1 - d / altRiga);
      const col = `rgba(255,255,255,${(0.1 + 0.9 * luce).toFixed(3)})`;
      if (brandLinks[i].__col !== col) { brandLinks[i].__col = col; brandLinks[i].style.color = col; }
    }
    const idx = piuVicino % N;
    if (cardAccese && idx !== activeBrandIdx) {
      activeBrandIdx = idx;
      crossfade(idx);
      // due card avanti (il nastro sale): con una sola di margine la successiva non faceva in tempo
      prefetchBrand((idx + 1) % N);
      prefetchBrand((idx + 2) % N);
    }
  }

  // ── movimento: parte DOPO l'entrata dei nomi (Roberto: prima appaiono, poi si muove) ──
  let inMoto = false, tPrima = 0;
  // la card (immagine del brand al centro) compare solo quando i nomi sono entrati tutti
  // (Roberto 23.09.26: "l'immagine del primo brand esce dopo il caricamento di tutto")
  let cardAccese = false;
  function passo(t) {
    if (tPrima) pos += BRANDS_VELOCITA * Math.min(0.1, (t - tPrima) / 1000);   // max 0.1 s: niente salti dopo una scheda in background
    tPrima = t;
    disegna();
    requestAnimationFrame(passo);
  }
  function parti() {
    if (inMoto) return;
    inMoto = true;
    // tutti gli altri nomi (fuori schermo e nelle copie) sono gia' visibili prima che il nastro li
    // porti su: entrano in sequenza solo quelli sullo schermo all'apertura (Roberto 23.09.26)
    if (window.septTuttiEntrati) window.septTuttiEntrati(nastro);
    cardAccese = true;
    activeBrandIdx = -1;   // forza la prima card al prossimo disegno
    requestAnimationFrame(passo);
  }
  window.addEventListener('sept:entratefinite', parti, { once: true });
  setTimeout(parti, 6000);   // rete di sicurezza se un'entrata si perde

  // rotella / trackpad / dito: spostano il nastro (solo quando e' gia' partito)
  window.addEventListener('wheel', e => { if (inMoto) pos += e.deltaY; }, { passive: true });
  let ditoY = null;
  window.addEventListener('touchstart', e => { ditoY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (ditoY === null || !inMoto) return;
    const y = e.touches[0].clientY;
    pos += ditoY - y; ditoY = y;
  }, { passive: true });
  window.addEventListener('touchend', () => { ditoY = null; }, { passive: true });

  function rimisura() {
    // tiene fermo il nome al centro mentre cambiano le misure: si salva a che punto del giro era
    const frazione = giro ? (((pos % giro) + giro) % giro) / giro : 0;
    misura();
    // prima della partenza A BATHING APE resta al centro anche se il font arriva dopo
    if (!posPronta || !inMoto) mettiPrimoAlCentro(); else pos = frazione * giro;
    disegna();
  }
  window.addEventListener('sept:textsplit', rimisura);
  window.addEventListener('resize', rimisura);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rimisura);

  misura();
  mettiPrimoAlCentro();
  disegna();
  // ⚠️ testo.js gira DOPO questo file e spezza ogni nome in righe (SplitType): le altezze cambiano
  // (su mobile i nomi lunghi vanno a capo) e le misure prese qui sopra diventano vecchie → il giro
  // del loop non combaciava e il nome al centro saltava. Si rimisura al primo frame, a split fatto.
  requestAnimationFrame(rimisura);
  window.addEventListener('load', rimisura);
  for (let i = 0; i < 6; i++) prefetchBrand(i);
