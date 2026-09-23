// contact.js — pagina Contact
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Usa le costanti globali di js/core.js (appEl, lenis, onScroll, requestScrollFrame, measureSections).

  // ── contact-sept entrance ────────────────────────
  // La scritta esce SOLO quando si tocca il fondo del sito, e rientra appena si risale; di
  // nuovo fuori a ogni ritorno in fondo (Roberto 16.09.26). Prima usciva una volta sola, con
  // Contact visibile al 25%.
  (function () {
    const el = document.querySelector('.contact-sept');
    if (!el) return;
    gsap.set(el, { y: '110%' });
    let fuori = false;
    // 2 px di tolleranza: con l'inerzia di Lenis scrollTop arriva al fondo per approssimazione
    const TOLLERANZA = 2;
    function septAlFondo() {
      const inFondo = appEl.scrollTop >= appEl.scrollHeight - appEl.clientHeight - TOLLERANZA;
      if (inFondo === fuori) return;
      fuori = inFondo;
      gsap.killTweensOf(el);
      if (inFondo) gsap.to(el, { y: 0, duration: 0.65, ease: 'power2.out' });
      else         gsap.to(el, { y: '110%', duration: 0.45, ease: 'power2.in' });
    }
    // PROVA `?prova=sept` (16.09.26): scritta senza callback di scroll, per isolare il blocco
    if (/[?&]prova=[^&]*sept/.test(location.search)) { gsap.set(el, { y: 0 }); return; }
    onScroll(septAlFondo);
    septAlFondo();
  })();
