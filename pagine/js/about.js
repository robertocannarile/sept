// about.js — pagina About
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Usa le costanti globali di js/core.js (appEl, lenis, onScroll, requestScrollFrame, measureSections).

  // ── about parallax ──────────────────────────────
  // `let`: il nastro automatico (piu' sotto) aggiunge le copie delle immagini → si rilegge
  let aboutParallaxImgs = document.querySelectorAll('.about-parallax-img');
  let aboutInView = false;
  new IntersectionObserver(es => {
    es.forEach(e => { aboutInView = e.isIntersecting; });
    if (aboutInView) requestScrollFrame();
  }, { rootMargin: '50% 0px' }).observe(document.getElementById('about'));

  // Due fasi: prima TUTTE le letture, poi TUTTE le scritture.
  // Prima leggeva un rect e scriveva un transform nella stessa iterazione: la
  // scrittura invalidava il layout e il rect dell'iterazione dopo lo forzava a
  // ricalcolare → un reflow sincrono per immagine, per frame.
  let aboutParallaxOff = new Float32Array(aboutParallaxImgs.length);
  function applyAboutParallax() {
    if (!aboutInView) return;
    // sotto i 1024 px le immagini le muove updateAboutStrip (strip orizzontale):
    // due scritture sullo stesso transform si annullerebbero a vicenda
    if (window.__septAboutStrip) return;
    const vh = window.innerHeight;
    // fase READ
    for (let i = 0; i < aboutParallaxImgs.length; i++) {
      const frame = aboutParallaxImgs[i].parentElement;
      const rect  = frame.getBoundingClientRect();
      aboutParallaxOff[i] = (rect.bottom < -200 || rect.top > vh + 200)
        ? NaN                                            // fuori vista: salta
        : (rect.bottom / (vh + rect.height) - 0.5) * 20;
    }
    // fase WRITE
    for (let i = 0; i < aboutParallaxImgs.length; i++) {
      const offset = aboutParallaxOff[i];
      if (offset !== offset) continue;                   // NaN
      aboutParallaxImgs[i].style.transform =
        `scale(1.2) translate3d(0, ${offset.toFixed(2)}%, 0)`;
    }
  }
  onScroll(applyAboutParallax);
  applyAboutParallax();

  (function () {
    // ── About: due modalita' sole, e il passaggio fra le due ────────────────────────
    // MOBILE (<=768, cioe' senza sidebar): colonna unica, immagini in strip orizzontale che
    //   scorre mentre scendi. Meccanica di initSpaceScroll/updateSpace.
    // DESKTOP/TABLET (>=769): layout a colonne, immagini impilate con la parallasse verticale.
    //
    // ⚠️ Il punto delicato e' il PASSAGGIO. Prima questo blocco girava una volta sola al
    // caricamento: ridimensionando la finestra il CSS cambiava modalita' ma il JS no, e ci si
    // ritrovava con il layout mobile e le immagini che non scorrevano (segnalato da Roberto il
    // 16.09.26). Ora si ascolta il matchMedia e si monta/smonta davvero.
    (function aboutModes() {
      const wrapper  = document.getElementById('about-scroll-wrapper');
      const section  = document.getElementById('about');
      const images   = document.querySelector('#about .about-images');
      const imgs     = Array.from(document.querySelectorAll('#about .about-parallax-img'));
      if (!wrapper || !images) return;
      const off = new Float32Array(imgs.length);
      const mq  = window.matchMedia('(max-width: 768px)');   // stessa soglia del CSS
      // NIENTE SOSTA e niente trucchi sulla pagina (versione 8, Roberto 16.09.26: "naturale,
      // che faccia vedere tutte le immagini lentamente"). La 7 spingeva la sezione con
      // translateY per rallentare la pagina: laggava e sembrava innaturale.
      // Qui la strip parte quando la sezione e' salita al 40% dello schermo (PARTENZA, come
      // Space) e arriva in fondo quando sta uscendo in alto (ne resta visibile USCITA di
      // schermo). Lineare come lo scroll.
      // (17.09.26) "le immagini di About sono troppo veloci": la corsa ora parte appena la sezione
      // entra dal basso (PARTENZA 1) e finisce con la strip al bordo alto (USCITA 0) = la corsa piu'
      // lunga senza sosta: con USCITA -0.25 ~0.9 px per px a 402x654 (prima 0.4 / 0.15 = ~1.25).
      // Regolabili dal pannello `?regola=1` o con `?aboutpartenza=` / `?aboutuscita=`.
      //  PARTENZA: a che frazione di schermo dall'alto e' la testa della sezione quando parte
      //            (piu' alto = parte prima = piu' lenta). USCITA: quanto schermo resta sopra la
      //            strip quando finisce (piu' basso = finisce dopo = piu' lenta).
      const leggi = (k, d) => { const m = location.search.match(new RegExp('[?&]' + k + '=(-?[\\d.]+)')); return m ? +m[1] : d; };
      // scelti da Roberto sull'iPhone col pannello (17.09.26): partenza 0.45, uscita -0.2
      let USCITA   = leggi('aboutuscita', -0.2);   // negativo = la strip e' gia' in parte sopra il bordo
      let PARTENZA = leggi('aboutpartenza', 0.45);
      let travelX = 0, stripX = 0, attiva = false, inizio = 0, fine = 1;

      function misura() {
        if (!attiva) return;
        images.style.transform = '';
        stripX = 0;
        // ⚠️ La strip ha `width: max-content` con 16 px di padding per lato, e offsetWidth li
        // comprende gia' entrambi. Prima si aggiungevano altri 16 px e l'ultima immagine
        // finiva troppo a sinistra. Cosi' a fine corsa il suo bordo destro sta a 16 px dal
        // bordo dello schermo, come la prima sta a sinistra.
        travelX = Math.max(0, images.offsetWidth - section.clientWidth);
        wrapper.style.height = '';
        section.style.top = '';
        section.style.transform = '';
        const y  = appEl.scrollTop;
        const vh = appEl.clientHeight;
        const r  = images.getBoundingClientRect();
        // parte quando la sezione e' salita al 40% dell'altezza dello schermo (Roberto 16.09.26)
        // (23.09.26) About ora e' in cima alla sua pagina: senza il max la partenza cadeva
        // prima dello scroll 0 e la strip compariva gia' spostata all'apertura
        inizio = Math.max(0, section.getBoundingClientRect().top + y - vh * PARTENZA);
        fine   = r.top + y - vh * USCITA;         // strip al bordo alto (meno USCITA)
        measureSections();
        aggiorna();
      }

      function aggiorna() {
        if (!attiva) return;
        const corsa = fine - inizio;
        if (corsa <= 0) return;
        const progress = Math.max(0, Math.min(1, (appEl.scrollTop - inizio) / corsa));
        const nuovoX = -travelX * progress;
        // due fasi come in updateSpace: prima tutte le letture, poi tutte le scritture,
        // altrimenti ogni immagine costa un reflow sincrono per frame
        const vw = window.innerWidth;
        const dx = nuovoX - stripX;
        for (let i = 0; i < imgs.length; i++) {
          const r = imgs[i].parentElement.getBoundingClientRect();
          off[i] = Math.max(-8, Math.min(8, ((r.left + dx + r.width / 2 - vw / 2) / vw) * 12));
        }
        images.style.transform = `translateX(${nuovoX}px)`;
        stripX = nuovoX;
        for (let i = 0; i < imgs.length; i++) imgs[i].style.transform = `scale(1.2) translateX(${off[i]}%)`;
      }

      function accendi() {
        if (attiva) return;
        attiva = true;
        window.__septAboutStrip = true;   // lo legge applyAboutParallax per non sovrascrivere
        misura();
      }

      function spegni() {
        if (!attiva) return;
        attiva = false;
        window.__septAboutStrip = false;
        // si rimette tutto com'era, o tornando al desktop restano appiccicati i transform
        images.style.transform = '';
        stripX = 0;
        wrapper.style.height = '';
        section.style.top = '';
        section.style.transform = '';
        imgs.forEach(im => { im.style.transform = ''; });
        measureSections();
        applyAboutParallax();
      }

      function applica() { mq.matches ? accendi() : spegni(); }

      applica();
      if (mq.addEventListener) mq.addEventListener('change', applica);
      else mq.addListener(applica);
      window.addEventListener('resize', () => { applica(); misura(); });
      // le immagini arrivano dopo: cambiano altezze e larghezze, quindi si rimisura
      imgs.forEach(im => { if (!im.complete) im.addEventListener('load', misura, { once: true }); });
      window.addEventListener('load', misura);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(misura);
      onScroll(aggiorna);
      // per il pannello `?regola=1`
      window.__septAbout = {
        get partenza() { return PARTENZA; }, set partenza(v) { PARTENZA = v; misura(); },
        get uscita()   { return USCITA; },   set uscita(v)   { USCITA = v; misura(); },
      };
    })();

  })();

  // ── About: IMMAGINI CHE SCORRONO DA SOLE (23.09.2026, Roberto) ────────────────────
  // Da 769 px in su (sidebar, due colonne) la pagina non scorre piu' (CSS "ABOUT FERMA") e la
  // colonna delle immagini sale da sola in loop, come il nastro dei nomi di Brands: le cornici
  // vanno dentro `.about-nastro` + 2 copie, e il nastro si sposta di `pos` modulo l'altezza di un
  // giro. La parallasse dentro le cornici resta: applyAboutParallax legge le posizioni vere.
  // Sotto i 769 px il nastro si smonta (le cornici tornano nella strip orizzontale del telefono,
  // che ha la sua meccanica in aboutModes).
  (function nastroAbout() {
    const colonna = document.querySelector('#about .about-images');
    if (!colonna) return;
    const mq = window.matchMedia('(min-width: 769px)');
    const VELOCITA = 30;   // px al secondo
    const COPIE = 3;
    let nastro = null, originali = [], pos = 0, giro = 0, tPrima = 0, attivo = false;

    function rileggiImmagini() {
      aboutParallaxImgs = document.querySelectorAll('#about .about-parallax-img');
      aboutParallaxOff = new Float32Array(aboutParallaxImgs.length);
    }
    function misura() {
      if (!nastro) return;
      const prime = nastro.querySelectorAll('.about-parallax-frame');
      // distanza fra la 1a cornice del primo giro e la 1a della copia = altezza di un giro
      giro = prime[originali.length] ? prime[originali.length].offsetTop - prime[0].offsetTop : 0;
    }
    function monta() {
      if (nastro) return;
      originali = [...colonna.querySelectorAll(':scope > .about-parallax-frame')];
      nastro = document.createElement('div');
      nastro.className = 'about-nastro';
      originali.forEach(f => nastro.appendChild(f));
      for (let c = 1; c < COPIE; c++) originali.forEach(f => {
        const k = f.cloneNode(true);
        k.setAttribute('aria-hidden', 'true');
        nastro.appendChild(k);
      });
      colonna.appendChild(nastro);
      rileggiImmagini();
      misura();
      if (!attivo) { attivo = true; tPrima = 0; requestAnimationFrame(passo); }
    }
    function smonta() {
      if (!nastro) return;
      attivo = false;
      originali.forEach(f => colonna.appendChild(f));
      nastro.remove();
      nastro = null;
      rileggiImmagini();
    }
    function passo(t) {
      if (!attivo) return;
      if (tPrima) pos += VELOCITA * Math.min(0.1, (t - tPrima) / 1000);   // max 0.1 s: niente salti dopo una scheda in background
      tPrima = t;
      if (giro) nastro.style.transform = `translate3d(0, ${-(pos % giro)}px, 0)`;
      applyAboutParallax();
      requestAnimationFrame(passo);
    }
    function applica() { mq.matches ? monta() : smonta(); }
    applica();
    if (mq.addEventListener) mq.addEventListener('change', applica); else mq.addListener(applica);
    window.addEventListener('resize', misura);
    window.addEventListener('load', misura);
    colonna.querySelectorAll('img').forEach(im => { if (!im.complete) im.addEventListener('load', misura, { once: true }); });
  })();
