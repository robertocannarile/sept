// core.js — caricato da TUTTE le pagine, per primo
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Definisce le costanti globali usate dagli altri file: appEl, mainEl, lenis, onScroll,
// requestScrollFrame, measureSections, SEPT_BRANDS.

  const appEl       = document.getElementById('app');
  const mainEl      = document.getElementById('main');

  // ── Lenis smooth scroll ─────────────────────────
  // `?debug=1&fx=nolenis` fa a meno di Lenis: scroll nativo del browser. Serve a capire se i
  // frame persi su Safari vengono dal fatto che la posizione la scrive JS a ogni frame.
  // `?nolenis=1` (17.09.26): stessa prova ma SENZA il pannello di debug, che pesa da solo
  const FX_NOLENIS = (/[?&]fx=[^&]*nolenis/.test(location.search) && /[?&]debug=1/.test(location.search))
                  || /[?&]nolenis=1/.test(location.search);
  // valori scelti · con `?dito=` e `?lancio=` nell'indirizzo si provano altri valori senza toccare il file
  // scelti da Roberto sull'iPhone col pannello `?regola=1` (17.09.26, dopo il fix del blend):
  // dito 1, lancio 9, morbidezza 0.07. (16.09: dito 0.7, lancio 4 → 10)
  const SCROLL_DITO   = +((location.search.match(/[?&]dito=([\d.]+)/)   || [])[1] || 1);
  const SCROLL_LANCIO = +((location.search.match(/[?&]lancio=([\d.]+)/) || [])[1] || 9);
  const SCROLL_MORBIDEZZA = +((location.search.match(/[?&]morbidezza=([\d.]+)/) || [])[1] || 0.07);
  const lenis = FX_NOLENIS ? null : new Lenis({
    wrapper: appEl,
    content: mainEl,
    lerp: 0.09,          // prima era 0.05 ma girava DUE volte per frame → ~0.0975 effettivo;
                         // ora il driver e' uno solo, quindi il valore qui e' quello vero.
    // ⚠️ SCROLL MORBIDO DELLA ROTELLA SPENTO (16.09.2026) — la decisione piu' pesante di
    // questo giro, presa su misura fatta da Roberto su Safari con `?debug=1`.
    // Con `smoothWheel: true` la posizione di scroll la scrive JS a OGNI frame; Safari tratta
    // ogni scrittura come un cambio da ridipingere, e con il canvas della home, le 31 cover in
    // preserve-3d e i riflessi quel ridisegno non sta nei 16 ms: 10 frame persi su 600, picchi
    // di 86 ms, cover che si sdoppiavano. Il report lo ha mostrato chiaramente: **costo delle
    // callback di scroll 0 ms** e picchi lo stesso → il tempo se ne andava nel rendering, non
    // nel nostro codice. Per questo spegnere riflessi, 3d, contain o ridurre le cover non
    // cambiava nulla: nessuno di quelli era la causa, era il ridisegno in se'.
    // Provato anche `content-visibility: auto` sulle sezioni: non basta.
    // Lenis resta vivo e serve ancora: `scrollTo` di snap, link di nav, stop/start nello zoom.
    // Per riprovare lo scroll morbido un domani: `?smoothwheel=1`.
    smoothWheel: /[?&]smoothwheel=1/.test(location.search),
    // NB: `smoothTouch` era l'opzione della vecchia API e in lenis 1.1.13 viene IGNORATA;
    // il nome giusto e' `syncTouch`. Con `false` (scroll touch nativo) su iOS gli effetti
    // scroll-driven inseguivano il contenuto di qualche frame durante l'inerzia. Con `true`
    // la posizione la scrive Lenis, quindi effetti e contenuto sono sincroni per costruzione:
    // provate entrambe sull'iPhone, questa e' nettamente migliore. Per tornare al nativo basta
    // `?synctouch=0` in coda all'indirizzo.
    syncTouch: !/[?&]synctouch=0/.test(location.search),
    wheelMultiplier: 0.6,
    // Velocita' dello scroll col dito (16.09.26). Valori FISSI, letti una volta all'avvio.
    // Si regolano a sensazione con `?regola=1` (pannello coi cursori, vedi fondo pagina) e poi
    // si scrivono qui. Default di Lenis: dito 1, lancio 35.
    //  - DITO:   quanto si muove la pagina mentre il dito e' appoggiato (1 = segue il dito)
    //  - LANCIO: quanto scivola dopo che lasci il dito
    touchMultiplier:        SCROLL_DITO,
    touchInertiaMultiplier: SCROLL_LANCIO,
    //  - MORBIDEZZA: `syncTouchLerp`, come arriva la scivolata dopo il rilascio. Basso = lunga e
    //    morbida, 1 = niente lerp (arriva subito). Col dito appoggiato Lenis non usa lerp comunque.
    syncTouchLerp:          SCROLL_MORBIDEZZA,
  });
  window.lenis = lenis;   // accessibile alle IIFE (es. stop/start in zoom home)
  if (FX_NOLENIS) {
    // senza Lenis serve comunque tenere aggiornato ScrollTrigger e il dispatcher
    if (window.ScrollTrigger) appEl.addEventListener('scroll', () => ScrollTrigger.update(), { passive: true });
    // finto oggetto: il resto del codice chiama scrollTo/stop/start senza sapere che non c'e'
    window.lenis = {
      scrollTo: (t, o) => { const y = typeof t === 'number' ? t : (t && t.offsetTop) || 0; appEl.scrollTo({ top: y, behavior: 'smooth' }); },
      stop: () => {}, start: () => {}, on: () => {}, options: {},
    };
  } else {
  // UN SOLO driver per lenis.raf. Prima c'erano due loop (rAF proprio +
  // gsap.ticker): lenis avanzava il lerp DUE volte per frame, in ordine non
  // deterministico → micro-stutter sullo scroll e lerp effettivo ~0.0975
  // invece di 0.05. Ora guida gsap.ticker se GSAP c'e', altrimenti rAF.
  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const lenisRaf = time => { lenis.raf(time); requestAnimationFrame(lenisRaf); };
    requestAnimationFrame(lenisRaf);
  }
  }

  const sections    = document.querySelectorAll('.section');
  const navItems    = document.querySelectorAll('.nav-item[data-target]');
  const activeLabel = document.getElementById('active-label');

  // (23.09.26) Con una sezione per pagina l'etichetta e la voce attiva sono gia' scritte
  // nell'HTML di ogni pagina; il calcolo qui sotto resta perche' da' lo stesso risultato
  // e serve comunque a `navSuChiaro` (colore della barra mobile).
  // L'etichetta laterale e la voce di nav attiva sono calcolate nel dispatcher di
  // scroll (piu' sotto, `updateActiveSection`), non con un IntersectionObserver.
  // Motivo: con `threshold: 0.5` la sezione About non si attivava MAI — e' alta
  // ~2000px contro un viewport di ~945, quindi il suo ratio massimo e' 0.47 e la
  // soglia era irraggiungibile. L'etichetta restava su "Home" per tutta About.


  // ── unified scroll dispatcher (single listener, rAF-batched) ──
  // All per-frame scroll work registers here via onScroll(fn). One
  // 'scroll' event schedules one rAF that runs every callback once,
  // instead of N listeners each thrashing layout per event.
  const scrollCallbacks = [];
  const scrollCallbackNames = [];
  let scrollRafPending = false;
  // `?debug=1` misura quanto costa OGNI callback di scroll, per sapere chi fa perdere frame
  // invece di indovinare. Fuori da debug il ramo non esiste nemmeno.
  const SCROLL_DEBUG = /[?&]debug=1/.test(location.search);
  const scrollCallbackCost = [];
  // PROVA `?prova=fermo` (17.09.26): nessun effetto legato allo scroll (strip, parallassi, colori,
  // nav...). Serve a capire se il "tremolio" dei bordi delle sezioni ferme su iPhone viene dal JS
  // che aggiorna gli effetti a ogni frame o da Safari stesso (sticky dentro un div che scrolla).
  const PROVA_FERMO = /[?&]prova=[^&]*fermo/.test(location.search);
  function runScrollFrame() {
    scrollRafPending = false;
    if (PROVA_FERMO) return;
    if (SCROLL_DEBUG) {
      for (let i = 0; i < scrollCallbacks.length; i++) {
        const t0 = performance.now();
        scrollCallbacks[i]();
        scrollCallbackCost[i] = (scrollCallbackCost[i] || 0) * 0.9 + (performance.now() - t0) * 0.1;
      }
      window.__scrollCost  = scrollCallbackCost;
      window.__scrollNames = scrollCallbackNames;
      return;
    }
    for (let i = 0; i < scrollCallbacks.length; i++) scrollCallbacks[i]();
  }
  let touchLoopRunning = false;   // vero mentre gira scrollFrameLoop (vedi piu' sotto)
  function requestScrollFrame() {
    if (scrollRafPending || touchLoopRunning) return;   // il loop gia' aggiorna ogni frame
    scrollRafPending = true;
    requestAnimationFrame(runScrollFrame);
  }
  function onScroll(cb) { scrollCallbacks.push(cb); scrollCallbackNames.push(cb.name || ('callback#' + scrollCallbacks.length)); }
  appEl.addEventListener('scroll', requestScrollFrame, { passive: true });

  // ── touch: aggiornamento a ogni frame finche' la pagina si muove ───────────────
  // Su desktop lo scroll passa da Lenis, che scrive lui la posizione: un evento 'scroll' per
  // frame e gli effetti restano in passo. Su TOUCH invece lo scroll e' nativo (Lenis lo lascia
  // al browser) e su iOS, durante l'inerzia, gli eventi 'scroll' arrivano a intervalli
  // irregolari: il contenuto scorre sul compositor mentre parallassi, strip e canvas venivano
  // aggiornati solo agli eventi → sembrava che la sezione sopra scivolasse sul contenuto.
  // Qui, finche' `scrollTop` cambia, si gira in rAF continuo: ogni frame legge la posizione
  // vera invece di aspettare l'evento. Il loop si spegne da solo ~250 ms dopo l'ultimo
  // movimento, quindi da fermo non consuma nulla.
  // Prima girava solo su touch; da quando la rotella e' nativa (smoothWheel: false) lo stesso
  // ragionamento vale sul desktop: lo scroll lo muove il browser sul compositore e gli eventi
  // 'scroll' non arrivano per forza a ogni frame, quindi parallassi, strip e canvas
  // resterebbero indietro. Finche' la posizione cambia si gira in rAF; da fermo, niente.
  {
    let lastTop = -1, idleSince = 0, looping = false;
    const IDLE_MS = 250;
    function scrollFrameLoop(t) {
      const top = appEl.scrollTop;
      if (top !== lastTop) { lastTop = top; idleSince = t; }
      runScrollFrame();
      if (t - idleSince < IDLE_MS) requestAnimationFrame(scrollFrameLoop);
      else { looping = false; touchLoopRunning = false; }
    }
    appEl.addEventListener('scroll', function () {
      if (looping) return;
      looping = true; touchLoopRunning = true;
      lastTop = appEl.scrollTop;
      idleSince = performance.now();
      requestAnimationFrame(scrollFrameLoop);
    }, { passive: true });
  }

  // ── sezione attiva (etichetta laterale + voce di nav) ──
  // Range per sezione presi dal suo wrapper di scroll quando c'e' (Brands, Space,
  // Campaigns, Organic Noise sono in pin dentro wrapper alti: la <section> sticky
  // da sola coprirebbe solo il primo viewport del pin e per il resto l'etichetta
  // resterebbe indietro). I range sono contigui e coprono tutta la pagina.
  // Calcolati una volta e ricalcolati al resize → per frame e' pura aritmetica.
  let sectionRanges = [];
  function measureSections() {
    sectionRanges = [...sections].map(sec => {
      const par = sec.parentElement;
      const box = (par && /-scroll-wrapper$/.test(par.id || '')) ? par : sec;
      return { id: sec.id, label: sec.dataset.label,
               top: box.offsetTop, bottom: box.offsetTop + box.offsetHeight,
               chiaro: sfondoChiaro(sec) };
    }).sort((a, b) => a.top - b.top);
  }
  let activeSectionId = null;
  function updateActiveSection() {
    const mid = appEl.scrollTop + appEl.clientHeight / 2;   // centro del viewport
    let hit = null;
    for (const r of sectionRanges) {
      if (mid >= r.top && mid < r.bottom) { hit = r; break; }
    }
    if (!hit) {
      if (!sectionRanges.length) return;
      const first = sectionRanges[0], last = sectionRanges[sectionRanges.length - 1];
      // Fuori dagli estremi: aggancia al primo/ultimo. DENTRO un buco fra due
      // sezioni (le fasce nere da --section-gap, che non sono di nessuna sezione)
      // si TIENE quella corrente: prima il fallback saltava all'ultimo range e
      // l'etichetta lampeggiava "Contact" a ogni stacco fra le sezioni.
      if (mid < first.top) hit = first;
      else if (mid >= last.bottom) hit = last;
      else return;
    }
    if (!hit || hit.id === activeSectionId) return;
    activeSectionId = hit.id;
    activeLabel.textContent = hit.label;
    navItems.forEach(a => a.classList.toggle('active', a.dataset.target === hit.id));
  }
  // ── colore della barra mobile (al posto di mix-blend-mode, vedi CSS) ──
  // Una sezione e' "chiara" se il suo sfondo e' chiaro: lo si legge dal CSS a ogni misura, cosi'
  // se un domani cambia uno sfondo non c'e' niente da aggiornare qui. Negli stacchi fra le
  // sezioni si vede #app, nero. Per frame: un confronto fra numeri, e il DOM si tocca solo
  // quando il colore cambia davvero.
  const mobileNav = document.getElementById('mobile-nav');
  const NAV_Y = 28;   // centro della barra dal bordo alto (top 8 + 40/2)
  let navChiaro = null;
  function sfondoChiaro(el) {
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    if (!m || (m[3] !== undefined && +m[3] < 0.5)) return false;
    return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 > 0.6;
  }
  function navSuChiaro() {
    if (!mobileNav) return;
    const y = appEl.scrollTop + NAV_Y;
    let chiaro = false;
    for (const r of sectionRanges) { if (y >= r.top && y < r.bottom) { chiaro = r.chiaro; break; } }
    if (chiaro === navChiaro) return;
    navChiaro = chiaro;
    mobileNav.classList.toggle('su-chiaro', chiaro);
  }

  measureSections();
  onScroll(updateActiveSection);
  onScroll(navSuChiaro);
  updateActiveSection();
  navSuChiaro();
  // rete di sicurezza: a `load` le immagini hanno altezza definitiva
  window.addEventListener('load', () => { measureSections(); updateActiveSection(); navSuChiaro(); });
  window.addEventListener('resize', () => { measureSections(); updateActiveSection(); navSuChiaro(); });


  // Elenco dei brand (= cartelle di assets/brands_img e assets/img_pool). Sta qui e non in
  // brands.js perche' lo usa anche la home, per precaricare le card mentre sei su un'altra pagina.
  const SEPT_BRANDS = [
    'A BATHING APE','ACUPUNCTURE 1993','ALPHA INDUSTRIES','AMISH SUPPLIES',
    'ARIES','ARTE ANTWERP','CHAMPION PINNACLE','CIELE ATHLETICS','COOKMAN',
    'COTOPAXI','CROCS EXP','DAILY PAPER','EVISU','GR10K','HIKING PATROL',
    'KAPPY','KEEN','LEE 101',"LEVI'S",'MONO','NEW AMSTERDAM SURF ASSOCIATION',
    'NO PROBLEMO','NORDA','NORTHWAVE ESPRESSO','PEACEMAKER OAMC',"PRESIDENT'S",
    'PURAAI','PYRENEX','REEBOK','REPLICATED GR10K','RHIZOME','SAMSØE SAMSØE',
    'SANTHA','SATISFY','SESSÙN','TEVA','THE SKATEROOM','WRANGLER','XLARGE'
  ];
  window.__septBrandFolders = SEPT_BRANDS;

  // ── snap fra le sezioni: TOLTO (23.09.2026) ──
  // Serviva ad agganciare About, Campaigns e Organic Noise mentre si scorreva da una sezione
  // all'altra. Con una sezione per pagina non c'e' piu' niente a cui agganciarsi.
  // La versione completa (con la storia dei tre bug) e' in ../Base/index.html, `snapTargets`.

  // ── bitmap calde nelle sezioni in arrivo ─────────
  // Le <img> di About/Space/Campaigns sono nel DOM, quindi il file arriva comunque; quello che
  // Safari butta quando la sezione e' fuori schermo e' la BITMAP DECODIFICATA, e al ritorno
  // disegna il quadrato col punto interrogativo finche' non la ri-decodifica. `decode()` la
  // rifa' in anticipo, fuori dal main thread, un viewport prima che la sezione entri.
  // Si ri-arma a ogni rientro: la bitmap puo' essere buttata di nuovo.
  (function () {
    if (!('IntersectionObserver' in window)) return;
    function warm(el) {
      const imgs = el.querySelectorAll('img');
      for (let i = 0; i < imgs.length; i++) {
        const im = imgs[i];
        if (!im.src || !im.decode) continue;
        im.decode().catch(() => {});   // non ancora arrivata: ci pensa il giro dopo
      }
    }
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) warm(e.target);
    }, { rootMargin: '100% 0px' });
    for (const sel of ['#about', '#space', '#campaigns', '#sept-radio', '#contact']) {   // ognuna sulla sua pagina: le assenti si saltano
      const el = document.querySelector(sel);
      if (el) io.observe(el);
    }
    // Campaigns riscrive il proprio contenuto (renderCampaign): le nuove <img> vanno riscaldate
    const camp = document.getElementById('camp-scrollable');
    if (camp) new MutationObserver(() => warm(camp)).observe(camp, { childList: true });
  })();

  // ── footer overlay ──────────────────────────────

  document.getElementById('copy-email-btn').addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('hello@sept-showroom.com');
  });
  document.getElementById('copy-ig-btn').addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('https://instagram.com/septshowroom');
  });

  // Link "#": sono segnaposto (i 39 brand, il footer) e non devono saltare in cima.
  // I link del menu ora sono pagine vere (about.html…) e il browser li apre da solo;
  // resta lo scroll morbido per un eventuale #ancora dentro la stessa pagina.
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') { e.preventDefault(); return; } // placeholder link — no jump-to-top
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target);
      }
    });
  });

  // ── mobile menu ─────────────────────────────────
  (function () {
    const openBtn  = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const logoLink = document.getElementById('mobile-logo-link');
    const menu     = document.getElementById('mobile-menu');
    const links    = menu.querySelectorAll('.mobile-nav-item');

    function openMenu() {
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    logoLink.addEventListener('click', closeMenu);
    links.forEach(a => a.addEventListener('click', closeMenu));
  })();
