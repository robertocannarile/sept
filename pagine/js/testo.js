// testo.js — entrata del testo a righe; caricato da tutte le pagine DOPO il file della sezione
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Usa le costanti globali di js/core.js (appEl, lenis, onScroll, requestScrollFrame, measureSections).

  // ── text reveal animation ────────────────────────
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({ scroller: appEl });
  // PROVA `?prova=nost` (17.09.26): niente ScrollTrigger (i testi compaiono subito, senza animazione)
  if (/[?&]prova=[^&]*nost/.test(location.search)) {
    window.addEventListener('load', () => { ScrollTrigger.getAll().forEach(t => t.kill()); gsap.set('.line', { opacity: 1, y: 0 }); ScrollTrigger.disable && ScrollTrigger.disable(); });
  }

  const animSelectors = [
    '.section-title',
    '.about-label',
    '.about-text',
    // (23.09.26) un nome alla volta, non il blocco: con la lista in colonna i nomi arrivano sullo
    // schermo uno dopo l'altro scorrendo, e ognuno entra quando lo vedi
    '.brands-text a',
    // (17.09.26) "in Space e Contact le scritte appaiono prima": non erano proprio nella lista.
    // Un paragrafo/riga alla volta (non i contenitori): SplitType su un div con piu' <p> dentro
    // fonde le righe dei paragrafi.
    '.space-text p',
    '.contact-top p',
    '.contact-top a',
    // '.camp-caption' TOLTA (16.09.26): SplitType fondeva i suoi <span> a blocco in una riga
    // sola ("SS26CAMPAIGN" invece di SS26 / CAMPAIGN), e a ogni cambio campagna renderCampaign
    // la riscrive comunque senza animazione.
  ];

  // ⚠️ SplitType spezza il testo in righe FISSE, calcolate alla larghezza del momento. Prima lo
  // faceva una volta sola al caricamento: ridimensionando la finestra (desktop → mobile) le
  // righe restavano quelle vecchie e andavano a capo nel punto sbagliato ("FASHION," da sola),
  // mentre ricaricando la pagina tornavano giuste (Roberto, 16.09.26). Ora, quando cambia la
  // LARGHEZZA, si annulla lo split e lo si rifa', ricostruendo le timeline allo stesso punto.
  // Solo la larghezza: su telefono l'altezza cambia di continuo con la barra di Safari.

  // ── ENTRATA DEL TESTO: A TEMPO, UNA VOLTA, QUANDO IL BLOCCO ENTRA (17.09.26) ──
  // Prima l'animazione avanzava con lo scroll (progress della sezione da 'top bottom' a
  // 'top top', solo in avanti): scorrendo a velocita' normale le righe erano gia' accese e non
  // si vedeva quasi. Roberto ha scelto la variante "1" a tempo della pagina _prova_testo: righe
  // che salgono di 10 px comparendo, in sequenza, e partono da sole quando il BLOCCO di testo
  // arriva all'85% dello schermo. Un trigger per elemento (non per sezione), cosi' il paragrafo
  // di About sotto le immagini parte quando lo vedi davvero.
  const splitEls = [...document.querySelectorAll(animSelectors.join(','))].filter(el => el.closest('.section'));
  let splits = [];
  const textAnim = splitEls.map(() => ({ tl: null, fatto: false }));

  function splitText() {
    splits = splitEls.map((el, i) => {
      const split = new SplitType(el, { types: 'lines' });
      split.lines.forEach(line => {
        const wrap = document.createElement('span');
        wrap.className = 'anim-line-wrap';
        line.parentNode.insertBefore(wrap, line);
        wrap.appendChild(line);
      });
      const st = textAnim[i];
      if (st.tl) st.tl.kill();
      gsap.set(split.lines, { opacity: 0, y: 10 });
      st.tl = gsap.timeline({ paused: true })
        .to(split.lines, { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out' });
      if (st.fatto) st.tl.progress(1);   // gia' entrato: dopo un resize il testo resta visibile
      return split;
    });
  }
  splitText();

  // ⚠️ IntersectionObserver e NON ScrollTrigger (17.09.26, "l'animazione in alcune parti non si
  // vede"). ScrollTrigger calcola in anticipo a che scroll il testo arrivera' sullo schermo, ma
  // Brands/Space/Campaigns/About cambiano l'altezza dei loro wrapper quando le immagini finiscono
  // di caricare: il calcolo restava vecchio e il testo si animava mentre era ancora fuori schermo
  // (misurato con immagini lente: "Our Radio" partiva 2000 px sotto lo schermo). L'observer guarda
  // la posizione VERA, sticky compresi. -15% in basso = parte quando il blocco supera l'85%.
  // Blocchi che entrano INSIEME (es. le righe di Contact, i due paragrafi di Space) partono uno
  // dopo l'altro, in ordine di pagina, sfasati di ENTRATA_SFASA secondi: non tutti di colpo.
  const ENTRATA_SFASA = 0.12;
  let entrateAperte = 0;
  function entrataChiusa() {
    if (--entrateAperte <= 0) { entrateAperte = 0; window.dispatchEvent(new Event('sept:entratefinite')); }
  }
  let prossimaEntrata = 0;   // (secondi, orologio di performance.now) prima partenza libera della coda
  const ADESIVO_ROT = -8;   // deve combaciare col rotate() del CSS di .space-text-side
  // "Schiaffo": arriva dall'alto grande e storto, sbatte rimpicciolendosi, supera un po' la misura e
  // si assesta. Le righe dello split si accendono subito: si muove l'adesivo intero.
  function schiaffoAdesivo(el, stati) {
    stati.forEach(st => st.tl.progress(1));
    gsap.timeline({ onComplete: () => gsap.set(el, { clearProps: 'transform,opacity' }) })
      .fromTo(el, { y: -120, scale: 1.8, rotation: ADESIVO_ROT - 14, opacity: 0 },
                  { y: 0, scale: 0.94, rotation: ADESIVO_ROT + 2, opacity: 1, duration: 0.32, ease: 'power3.in' })
      .to(el,     { scale: 1, rotation: ADESIVO_ROT, duration: 0.45, ease: 'elastic.out(1.1, 0.45)' });
  }

  const entrataIO = new IntersectionObserver(entries => {
    // parte se il blocco ha superato l'85% dello schermo OPPURE se ne vede gia' almeno il 20%: nelle
    // sezioni ferme (Space in sosta) un testo in fondo allo schermo non supera mai l'85% finche' la
    // sezione non riparte, e restava visibile ma spento per tutta la sosta
    const partono = entries
      .filter(e => e.isIntersecting && (e.intersectionRatio >= 0.2
                   || e.boundingClientRect.top < (e.rootBounds ? e.rootBounds.height : appEl.clientHeight) * 0.85))
      .map(e => { entrataIO.unobserve(e.target); return splitEls.indexOf(e.target); })
      .filter(i => textAnim[i] && !textAnim[i].fatto)
      .sort((a, b) => a - b);
    partono.forEach((i, k) => {
      const st = textAnim[i];
      st.fatto = true;
      const el = splitEls[i];
      let parti = () => { st.tl.eventCallback('onComplete', entrataChiusa); st.tl.play(); };
      if (el.closest('.space-text-side')) {
        // lo schiaffo e' del blocco intero, una volta sola per tutti i suoi paragrafi
        const blocco = el.closest('.space-text-side');
        const dentro = splitEls.map((e, j) => [e, j]).filter(([e]) => blocco.contains(e));
        dentro.forEach(([e, j]) => { textAnim[j].fatto = true; entrataIO.unobserve(e); });
        if (blocco.dataset.schiaffo) return;
        blocco.dataset.schiaffo = '1';
        parti = () => { schiaffoAdesivo(blocco, dentro.map(([, j]) => textAnim[j])); entrataChiusa(); };
      }
      // conta le entrate in coda o in corso: quando tornano a zero la pagina riceve
      // `sept:entratefinite` (la usa Brands per sbloccare lo scroll, 23.09.26)
      entrateAperte++;
      // UNA coda per tutta la pagina (23.09.26, "l'entrata non e' sequenziale"): prima lo sfasamento
      // valeva solo dentro lo stesso gruppo di blocchi; se scorrendo ne arrivava un altro mentre il
      // primo gruppo era ancora in coda, il nuovo partiva subito e passava davanti. Ora ogni blocco
      // parte dopo il precedente, qualunque sia il gruppo. I nomi di Brands sono righe: sfasamento
      // come quello fra le righe (0.06), non fra i paragrafi.
      const adesso = performance.now() / 1000;
      const quando = Math.max(adesso, prossimaEntrata);
      prossimaEntrata = quando + (el.closest('.brands-text') ? 0.06 : ENTRATA_SFASA);
      if (quando <= adesso) parti();
      else gsap.delayedCall(quando - adesso, parti);
    });
  }, { root: appEl, threshold: [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1] });
  splitEls.forEach(el => entrataIO.observe(el));

  // Segna come GIA' ENTRATI tutti i blocchi dentro `contenitore`, anche fuori schermo: righe subito
  // visibili, niente piu' entrata quando arrivano (23.09.26, Brands: il nastro porta su dal basso
  // nomi che prima comparivano uno alla volta). `fatto` resta vero anche dopo un ri-split al resize.
  window.septTuttiEntrati = function (contenitore) {
    splitEls.forEach((el, i) => {
      if (!contenitore.contains(el) || textAnim[i].fatto) return;
      textAnim[i].fatto = true;
      entrataIO.unobserve(el);
      if (textAnim[i].tl) textAnim[i].tl.progress(1);
    });
  };

  // ⚠️ Niente "salto" (Roberto 16.09.26): prima le righe vecchie restavano a schermo per tutto
  // il resize e poi scattavano di colpo alla versione giusta. Ora al PRIMO evento di resize il
  // testo torna subito normale (revert: va a capo da solo, in tempo reale mentre si trascina) e
  // lo si ri-spezza solo a resize finito. Le righe nuove cadono negli stessi punti del testo
  // normale, quindi a schermo non cambia nulla.
  let splitW = window.innerWidth, splitTimer, splitAperto = false;
  window.addEventListener('resize', () => {
    if (window.innerWidth === splitW && !splitAperto) return;
    if (!splitAperto) {
      splitAperto = true;
      // ⚠️ solo gli elementi ancora spezzati: la didascalia di Campaigns viene riscritta da
      // renderCampaign a ogni cambio campagna, e `revert()` rimetterebbe il testo salvato al
      // caricamento, cioe' la didascalia della campagna SBAGLIATA
      splitEls.forEach((el, i) => { if (el.querySelector('.anim-line-wrap')) splits[i].revert(); });
      // fitBrands misura sul testo pulito: le righe si spezzano DOPO, sulla misura giusta
      window.dispatchEvent(new Event('sept:textreverted'));
    }
    clearTimeout(splitTimer);
    splitTimer = setTimeout(() => {
      splitAperto = false;
      splitW = window.innerWidth;
      window.dispatchEvent(new Event('sept:textreverted'));
      // ⚠️ SplitType si ricorda l'HTML originale di ogni elemento e, ri-spezzandolo, rimette
      // QUELLO: la didascalia tornava alla campagna del caricamento. Qui i testi sono tutti gia'
      // puliti, quindi si svuota la memoria e lo split riparte dal contenuto attuale.
      SplitType.clearData();
      splitText();
      measureSections();   // le altezze del testo possono essere cambiate
      window.dispatchEvent(new Event('sept:textsplit'));
    }, 200);
  });
