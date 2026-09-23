// campaigns.js — pagina Campaigns
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Usa le costanti globali di js/core.js (appEl, lenis, onScroll, requestScrollFrame, measureSections).

  // ── campaigns scroll wrapper ────────────────────
  const campWrapper    = document.getElementById('campaigns-scroll-wrapper');
  const campScrollable = document.getElementById('camp-scrollable');
  const campCaption    = document.getElementById('camp-caption');
  const campPrevBtn    = document.getElementById('camp-prev');
  const campNextBtn    = document.getElementById('camp-next');
  let campCurrent = 0;
  let campSlideX = 0;         // horizontal slide offset during a campaign switch
  let campSwitching = false;  // freeze the vertical scroll while sliding

  const campSection = document.getElementById('campaigns');   // serve gia' a setCampWrapperHeight

  function campImgOverflow() {
    const topOffset = window.innerWidth <= 768 ? campScrollable.offsetTop : 0;
    return Math.max(0, topOffset + campScrollable.offsetHeight - window.innerHeight);
  }

  // Sotto questa soglia il pin non vale la pena: si aggancerebbe e staccherebbe quasi nello
  // stesso istante, e quel passaggio si vede come uno scatto verso il basso mentre scorri.
  // ⚠️ Su iPhone capita proprio cosi': misurato con la barra di Safari visibile, l'eccedenza
  // delle immagini sulla sezione era di SETTE pixel — un pin da 7 px, inutile e fastidioso.
  const CAMP_PIN_MIN = 80;

  function setCampWrapperHeight() {
    const overflow = campImgOverflow();
    const pin = overflow >= CAMP_PIN_MIN;
    // ⚠️ L'altezza si prende dalla SEZIONE, non da window.innerHeight: su iOS la sezione e'
    // alta `100vh` (che li' vuol dire "senza barra del browser") mentre innerHeight e'
    // l'altezza corrente, con la barra. Mescolarli rendeva il wrapper piu' corto della
    // sezione — cioe' esattamente il caso che il commento nel CSS avverte di evitare.
    const base = Math.max(campSection.offsetHeight, window.innerHeight);
    campWrapper.style.height = (base + (pin ? overflow : 0)) + 'px';
    campSection.style.position = pin ? '' : 'relative';
  }

  function updateCampaign() {
    // vertical offset from scroll — kept during a switch so we don't jump to section top
    let ty = 0;
    const scrollable = campWrapper.offsetHeight - appEl.clientHeight;
    if (scrollable > 0) {
      const progress = Math.max(0, Math.min(1, -campWrapper.getBoundingClientRect().top / scrollable));
      ty = -campImgOverflow() * progress;
    }
    // compose horizontal slide (X) + vertical scroll (Y) in one transform
    campScrollable.style.transform = `translate(${campSlideX}px, ${ty}px)`;
    campCaption.style.transform = window.innerWidth <= 768
      ? `translate(${campSlideX}px, ${ty}px)`
      : `translateX(${campSlideX}px)`;
  }

  onScroll(updateCampaign);
  window.addEventListener('resize', () => { setCampWrapperHeight(); updateCampaign(); });

  // ── campaigns ───────────────────────────────────
  // To add a campaign: copy one object and update season, name, subtitle, images[].
  // Images can be local paths ('assets/campaigns/myimage.jpg') or remote URLs.
  const campaigns = [
    {
      season:   'SS26',
      name:     'Campaign',
      subtitle: 'The Sept Summer',
      images: [
        'assets/campaigns/ss26/1.jpg',
        'assets/campaigns/ss26/2.jpg',
      ]
    },
    {
      season:   'FW26',
      name:     'Campaign',
      subtitle: 'Our new stars shine bright',
      images: [
        'assets/campaigns/fw26/Sept Fall Winter 2026.From December 1st to February 28th.This season, our new stars shine bright.jpg',
        'assets/campaigns/fw26/Sept Fall Winter 2026.From December 1st to February 28th.This season, our new stars shine bright-2.jpg',
      ]
    },
    // ss27 — cartella vuota: aggiungi le immagini e poi un blocco qui sotto.
  ];

  function renderCampaign(idx) {
    const c = campaigns[idx];
    campScrollable.innerHTML = c.images.map(src =>
      `<img src="${src}" alt="${c.season} ${c.name}" fetchpriority="low" decoding="async">`
    ).join('');
    campCaption.innerHTML =
      `<span>${c.season}</span><span>${c.name}</span><span class="camp-gap"></span><span>${c.subtitle}</span>`;
    campCurrent = idx;
    campPrevBtn.disabled = campaigns.length <= 1;
    campNextBtn.disabled = campaigns.length <= 1;
    updateCampaign(); // apply current slide/scroll transform to fresh content

    // Recalc wrapper height once images have loaded (aspect ratio known)
    const imgs = campScrollable.querySelectorAll('img');
    let loaded = 0;
    function onImgSettled() {
      if (++loaded >= imgs.length) {
        setCampWrapperHeight();
        updateCampaign();
      }
    }
    imgs.forEach(img => {
      if (img.complete && img.naturalWidth) { onImgSettled(); }
      else { img.addEventListener('load', onImgSettled); img.addEventListener('error', onImgSettled); }
    });
  }

  // ── directional slide between campaigns ─────────
  // NEXT (dir +1): current exits left, new enters from right. PREV: opposite.
  // Sequential (out → swap → in) with a crossfade covering the content swap.
  const CAMP_SLIDE = 180; // px travel of the slide
  function switchCampaign(dir) {
    if (campSwitching || campaigns.length <= 1) return;
    campSwitching = true;
    const newIdx = (campCurrent + dir + campaigns.length) % campaigns.length;

    const outP = { x: campSlideX };
    gsap.to(outP, {
      x: -dir * CAMP_SLIDE, duration: 0.3, ease: 'power2.in',
      onUpdate() { campSlideX = outP.x; updateCampaign(); },
      onComplete() {
        renderCampaign(newIdx);                // swap content (keeps current scroll position)
        campSlideX = dir * CAMP_SLIDE;         // pre-place incoming on the far side
        updateCampaign();
        const inP = { x: campSlideX };
        gsap.to(inP, {
          x: 0, duration: 0.45, ease: 'power3.out',
          onUpdate() { campSlideX = inP.x; updateCampaign(); },
          onComplete() { campSwitching = false; campSlideX = 0; updateCampaign(); }
        });
      }
    });
    // crossfade hides the mid-point content swap
    gsap.fromTo(campScrollable, { opacity: 1 }, {
      opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete() { gsap.to(campScrollable, { opacity: 1, duration: 0.45, ease: 'power3.out' }); }
    });
  }

  campPrevBtn.addEventListener('click', () => switchCampaign(-1));
  campNextBtn.addEventListener('click', () => switchCampaign(1));

  // toggle the fixed nav's visibility with the Campaigns section
  const campNav     = document.getElementById('camp-nav');
  new IntersectionObserver(es => {
    es.forEach(e => campNav.classList.toggle('visible', e.isIntersecting));
  }, { threshold: 0.1 }).observe(campWrapper);

  // nav follows the section vertically: top ≈ 0 while pinned (centered),
  // negative on exit (buttons rise up with the section) — like the old absolute buttons,
  // but on a fixed layer so the switch reflow can't jitter them.
  function updateCampNav() {
    campNav.style.transform = `translateY(${campSection.getBoundingClientRect().top}px)`;
  }
  onScroll(updateCampNav);
  updateCampNav();

  // Initial height placeholder so page doesn't collapse before images load
  campWrapper.style.height = (window.innerHeight * 2) + 'px';
  renderCampaign(0);
