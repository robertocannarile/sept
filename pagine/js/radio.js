// radio.js — pagina Organic Noise
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Usa le costanti globali di js/core.js (appEl, lenis, onScroll, requestScrollFrame, measureSections).

  // ── radio volume ─────────────────────────────────
  (function () {
    const slider  = document.getElementById('radio-vol-slider');
    const volIcon = document.getElementById('radio-vol-icon');
    const volWave = document.getElementById('radio-vol-wave');
    if (!slider || !volIcon || !volWave) return;   // volume rimosso
    let muted = false;

    function updateTrack() {
      const v = slider.value;
      slider.style.background = `linear-gradient(to right, white ${v}%, rgba(255,255,255,0.25) ${v}%)`;
    }

    slider.addEventListener('input', () => {
      muted = slider.value === '0';
      updateTrack();
      setVolIcon();
    });

    volIcon.addEventListener('click', () => {
      muted = !muted;
      slider.value = muted ? 0 : 80;
      updateTrack();
      setVolIcon();
    });

    function setVolIcon() {
      volWave.style.display = muted ? 'none' : '';
    }

    updateTrack();
  })();

  // ── sept radio carousel ─────────────────────────
  gsap.registerPlugin(Draggable);
  (function () {
    const R_BOXES    = gsap.utils.toArray('.radio-box');
    const R_STAGGER  = 0.1;
    const R_DURATION = 1;
    const R_CYCLE    = R_STAGGER * R_BOXES.length;
    const R_START    = R_CYCLE + R_DURATION * 0.5;

    gsap.set('.radio-box', { yPercent: -50 });

    const R_LOOP = gsap.timeline({ paused: true, repeat: -1, ease: 'none' });

    [...R_BOXES, ...R_BOXES, ...R_BOXES].forEach((box, i) => {
      R_LOOP.add(
        gsap.timeline()
          .set(box, { xPercent: 250, rotateY: -50, opacity: 0, scale: 0.5 })
          .to(box,  { opacity: 1, scale: 1, duration: 0.1 }, 0)
          .to(box,  { opacity: 0, scale: 0.5, duration: 0.1 }, 0.9)
          .fromTo(box, { xPercent: 250 }, { xPercent: -350, duration: 1, immediateRender: false, ease: 'power1.inOut' }, 0)
          .fromTo(box, { rotateY: -50 },  { rotateY: 50, duration: 1, immediateRender: false, ease: 'power4.inOut' }, 0)
          .to(box,  { z: 100, scale: 1.25, duration: 0.1, repeat: 1, yoyo: true }, 0.4)
          .fromTo(box, { zIndex: 1 }, { zIndex: R_BOXES.length, repeat: 1, yoyo: true, ease: 'none', duration: 0.5, immediateRender: false }, 0),
        i * R_STAGGER
      );
    });

    const R_HEAD = gsap.fromTo(R_LOOP,
      { totalTime: R_START },
      { totalTime: `+=${R_CYCLE}`, duration: 1, ease: 'none', repeat: -1, paused: true }
    );

    const R_PH   = { position: 0 };
    const R_WRAP = gsap.utils.wrap(0, R_HEAD.duration());
    const R_SNAP = gsap.utils.snap(1 / R_BOXES.length);

    const R_CAP_T = document.querySelector('.radio-caption .r-title');
    let R_CAP_I = -1;
    const frontIndex = () => gsap.utils.wrap(0, R_BOXES.length, Math.round(R_BOXES.length * R_PH.position));
    function updateCaption() {
      const idx = frontIndex();
      if (idx === R_CAP_I) return;
      R_CAP_I = idx;
      R_CAP_T.textContent = R_BOXES[idx].dataset.title || '';
    }

    const R_SCRUB = gsap.to(R_PH, {
      position: 0,
      onUpdate: () => { R_HEAD.totalTime(R_WRAP(R_PH.position)); updateCaption(); },
      paused: true, duration: 0.25, ease: 'power3',
    });

    const goTo = pos => {
      R_SCRUB.vars.position = R_SNAP(pos);
      R_SCRUB.invalidate().restart();
    };

    const R_NEXT = () => goTo(R_PH.position - 1 / R_BOXES.length);
    const R_PREV = () => goTo(R_PH.position + 1 / R_BOXES.length);

    document.querySelector('.radio-next-btn').addEventListener('click', R_NEXT);
    document.querySelector('.radio-prev-btn').addEventListener('click', R_PREV);

    document.querySelector('.radio-boxes').addEventListener('click', e => {
      const box = e.target.closest('.radio-box');
      if (!box) return;
      const TARGET  = R_BOXES.indexOf(box);
      const CURRENT = frontIndex();
      // click on the already-centered cover → open its playlist
      if (TARGET === CURRENT) {
        if (box.dataset.href) window.open(box.dataset.href, '_blank', 'noopener');
        return;
      }
      let bump = TARGET - CURRENT;
      if (TARGET  > CURRENT && TARGET  - CURRENT > R_BOXES.length * 0.5) bump = (R_BOXES.length - bump) * -1;
      if (CURRENT > TARGET  && CURRENT - TARGET  > R_BOXES.length * 0.5) bump = R_BOXES.length + bump;
      goTo(R_PH.position + bump * (1 / R_BOXES.length));
    });

    document.addEventListener('keydown', e => {
      if (document.querySelector('#sept-radio').matches(':hover')) {
        if (e.code === 'ArrowLeft'  || e.code === 'KeyA') R_NEXT();
        if (e.code === 'ArrowRight' || e.code === 'KeyD') R_PREV();
      }
    });

    gsap.set('.radio-box', { display: 'block' });
    gsap.set('.radio-controls button', { z: 200 });
    updateCaption();

    Draggable.create('.drag-proxy-radio', {
      type: 'x',
      trigger: '.radio-boxes',
      onPress()   { this.startOffset = R_PH.position; },
      onDrag()    { R_SCRUB.vars.position = this.startOffset + (this.startX - this.x) * 0.001; R_SCRUB.invalidate().restart(); },
      onDragEnd() { goTo(R_PH.position); },
    });
  })();
