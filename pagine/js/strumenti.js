// strumenti.js — pannelli di prova, attivi SOLO con un parametro nell'indirizzo:
//   ?prova=radio · ?regola=1 · ?debug=1   (vedi CLAUDE.md)
// Estratto da index.html il 23.09.2026. Caricato da tutte le pagine, per ultimo.

if (/[?&]prova=[^&]*radio/.test(location.search)) {
  document.addEventListener('DOMContentLoaded', () => {
    const r = document.querySelector('.radio-boxes'); if (r) r.removeAttribute('data-lenis-prevent');
  });
}

/* ══ REGOLA SCROLL (solo con ?regola=1) ══════════════════════════════════════════
     Due cursori per scegliere a sensazione, sul telefono, la velocita' dello scroll col dito.
     Cambiano le opzioni di Lenis SOLO quando muovi il cursore (niente lavoro a ogni frame) e
     scrivono i valori nell'indirizzo, cosi' ricaricando restano. Quando va bene, i due numeri
     si copiano in SCROLL_DITO / SCROLL_LANCIO. */
(function () {
  if (!/[?&]regola=1/.test(location.search)) return;
  document.addEventListener('DOMContentLoaded', () => {
    const L = window.lenis || {};
    const conLenis = !!(window.Lenis && L instanceof window.Lenis);   // con `?nolenis=1` Lenis non c'e': restano i cursori delle strip
    const box = document.createElement('div');
    box.setAttribute('data-lenis-prevent', '');   // i cursori si trascinano senza scrollare la pagina
    box.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;background:rgba(0,0,0,.9);'
      + 'color:#fff;font:14px/1.3 -apple-system,system-ui,sans-serif;padding:12px 14px;border:1px solid #fff;border-radius:10px';
    function riga(nome, chiave, min, max, step, spiega, bersaglio) {
      const T = bersaglio || L.options;
      const w = document.createElement('label');
      w.style.cssText = 'display:block;margin:4px 0 10px';
      const t = document.createElement('div');
      const r = document.createElement('input');
      r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = T[chiave];
      r.style.cssText = 'width:100%;height:32px';
      const scrivi = () => { t.innerHTML = `<b>${nome}: ${(+r.value).toFixed(step < 1 ? 2 : 0)}</b> <span style="opacity:.6">${spiega}</span>`; };
      r.addEventListener('input', () => {
        T[chiave] = +r.value; scrivi();
        const u = new URL(location.href); u.searchParams.set(nome, r.value); history.replaceState(null, '', u);
      });
      scrivi(); w.appendChild(t); w.appendChild(r); box.appendChild(w);
    }
    if (conLenis) riga('dito',   'touchMultiplier',        0.2, 1.5, 0.05, '— mentre il dito tocca (1 = normale)');
    if (conLenis) riga('lancio', 'touchInertiaMultiplier', 0,   40,  1,    '— quanto scivola quando lo lasci (35 = normale)');
    if (conLenis) riga('morbidezza', 'syncTouchLerp',      0.02, 1,  0.01, '— lerp della scivolata (1 = niente lerp, 0.075 = normale)');
    // velocita' delle strip: oggetti esposti da aboutModes e da initSpaceScroll
    function rigaObj(nome, obj, chiave, min, max, step, spiega) {
      if (!obj) return;
      riga(nome, chiave, min, max, step, spiega, obj);
    }
    rigaObj('aboutpartenza', window.__septAbout, 'partenza', 0.2, 1.5, 0.05, '— About: piu\' alto = parte prima = piu\' lenta');
    rigaObj('aboutuscita',   window.__septAbout, 'uscita',   -0.5, 0.6, 0.05, '— About: piu\' basso = finisce dopo = piu\' lenta');
    rigaObj('spacesosta',    window.__septSpace, 'sosta',    0.5, 3,   0.1,  '— Space: scroll per px di immagini (meno = piu\' veloce)');
    // "nascondi" riduce il pannello a un bottoncino "regola" che lo riapre (prima lo toglieva e non
    // c'era modo di riaverlo senza ricaricare)
    const chiudi = document.createElement('button');
    chiudi.textContent = 'nascondi';
    chiudi.style.cssText = 'font:13px system-ui;background:#fff;color:#000;border:0;border-radius:6px;padding:6px 12px';
    const riapri = document.createElement('button');
    riapri.textContent = 'regola';
    riapri.setAttribute('data-lenis-prevent', '');
    riapri.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;font:13px system-ui;background:#fff;'
      + 'color:#000;border:0;border-radius:6px;padding:8px 14px;box-shadow:0 0 0 1px #000';
    riapri.hidden = true;
    chiudi.addEventListener('click', () => { box.hidden = true; riapri.hidden = false; });
    riapri.addEventListener('click', () => { box.hidden = false; riapri.hidden = true; });
    box.appendChild(chiudi);
    document.body.appendChild(box);
    document.body.appendChild(riapri);
  });
})();

/* ══ DIAGNOSTICA (solo con ?debug=1) ══════════════════════════════════════════════
     Serve a capire cosa fa perdere frame quando NON si riesce a riprodurre il difetto in
     locale: misura sul browser di chi il problema ce l'ha davvero.
       ?debug=1            pannello + registrazione
       &fx=noreflect       spegne i riflessi delle cover (-webkit-box-reflect)
       &fx=nocontain       toglie contain/will-change da #sept-radio
       &fx=no3d            toglie preserve-3d e perspective al coverflow
       &fx=fewcovers       tiene solo 9 cover invece di 31
       &fx=nolenis         scroll nativo del browser, senza Lenis
       &fx=noloops         ferma vibrazione/respiro della home (canvas fermo)
       &fx=nowarm          niente precarico in background delle immagini
       &fx=nosmoothwheel   Lenis resta, ma la rotella torna nativa
       &fx=cvauto          le sezioni fuori schermo non vengono renderizzate
     Si possono combinare: &fx=noreflect,no3d
*/
(function () {
  if (!/[?&]debug=1/.test(location.search)) return;
  const fx = (location.search.match(/[?&]fx=([^&]*)/) || [,''])[1].split(',').filter(Boolean);

  function applyFx() {
    const css = [];
    // `fx=cvauto`: dice al browser di NON renderizzare le sezioni fuori schermo. Se il costo
    // per frame viene dal ridipingere tutta la pagina a ogni scrittura di scrollTop fatta da
    // Lenis, questo lo taglia alla radice e permette di tenere lo scroll morbido.
    // `contain-intrinsic-size` serve a non far collassare l'altezza di cio' che viene saltato.
    if (fx.includes('cvauto')) css.push(
      '#sept-radio, #campaigns, #brands, #space, #about {' +
      '  content-visibility: auto;' +
      '  contain-intrinsic-size: auto 100vh;' +
      '}');
    // ⚠️ `none` viene IGNORATO dal browser: per togliere il riflesso serve `unset`
    // (verificato: con `none` il valore computato resta il gradiente).
    if (fx.includes('noreflect'))  css.push('.radio-box{-webkit-box-reflect:unset !important}');
    if (fx.includes('nocontain'))  css.push('#sept-radio{contain:none !important;will-change:auto !important}');
    if (fx.includes('no3d'))       css.push('.radio-boxes{perspective:none !important;transform-style:flat !important}.radio-box{transform-style:flat !important}');
    if (css.length) { const st = document.createElement('style'); st.textContent = css.join('\n'); document.head.appendChild(st); }
    if (fx.includes('fewcovers')) {
      const boxes = [...document.querySelectorAll('.radio-box')];
      boxes.slice(9).forEach(b => b.remove());
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyFx);
  else applyFx();

  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;background:rgba(0,0,0,.85);color:#0f0;'
    + 'font:11px/1.35 ui-monospace,Menlo,monospace;padding:8px 10px;border:1px solid #0f0;max-width:min(92vw,420px);'
    + 'pointer-events:auto;user-select:text';
  // ⚠️ Il testo vive in un nodo SUO: prima il pannello riscriveva tutto il proprio contenuto a
  // ogni frame e cosi' staccava e riattaccava il pulsante, che quindi non riceveva mai il click.
  const live = document.createElement('pre');
  live.style.cssText = 'margin:0;font:inherit;white-space:pre';
  const btn = document.createElement('button');
  btn.textContent = 'copia report';
  btn.style.cssText = 'margin-top:6px;font:11px ui-monospace,monospace;background:#0f0;color:#000;border:0;padding:4px 10px;cursor:pointer';
  // riserva: se la copia automatica non e' permessa, il report compare qui, gia' selezionato
  const out = document.createElement('textarea');
  out.style.cssText = 'display:none;width:100%;height:28vh;margin-top:6px;font:10px ui-monospace,monospace;'
    + 'background:#000;color:#0f0;border:1px solid #0f0';
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(box); box.appendChild(live); box.appendChild(btn); box.appendChild(out);
  });

  // ── raccolta dati ────────────────────────────────────────────────────────────
  const frames = [];            // durata di ogni frame
  const longTasks = [];         // task che bloccano il main thread
  const peaks = [];             // frame lenti, con dove ti trovavi e cosa costava
  let lastT = performance.now();

  if (window.PerformanceObserver) {
    try {
      new PerformanceObserver(list => {
        for (const e of list.getEntries()) longTasks.push({ ms: Math.round(e.duration), at: Math.round(e.startTime) });
      }).observe({ entryTypes: ['longtask'] });
    } catch (e) {}
  }

  const app = () => document.getElementById('app');
  const radio = () => document.getElementById('radio-scroll-wrapper');

  function inRadio() {
    const w = radio(); if (!w) return false;
    const r = w.getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  }

  function tick(t) {
    const dt = t - lastT; lastT = t;
    frames.push(dt);
    if (frames.length > 600) frames.shift();
    if (dt > 24) {
      const costs = (window.__scrollCost || []).map((c, i) => [ (window.__scrollNames || [])[i] || i, +c.toFixed(1) ])
        .filter(x => x[1] > 0.3).sort((a,b) => b[1]-a[1]).slice(0,3);
      peaks.push({ ms: Math.round(dt), y: app() ? Math.round(app().scrollTop) : -1, radio: inRadio(), top3: costs });
      if (peaks.length > 40) peaks.shift();
    }
    render();
    requestAnimationFrame(tick);
  }

  function render() {
    if (!box.isConnected) return;
    const f = frames.slice().sort((a,b)=>a-b);
    const med = f.length ? f[f.length>>1] : 0;
    const p95 = f.length ? f[Math.floor(f.length*0.95)] : 0;
    const lenti = f.filter(x=>x>24).length;
    const nelRadio = peaks.filter(p=>p.radio).length;
    const costs = (window.__scrollCost || []).map((c,i)=>[ (window.__scrollNames||[])[i]||('cb'+i), +c.toFixed(2) ])
      .sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>`  ${x[0]}: ${x[1]}ms`).join('\n');
    live.textContent =
      `FPS ~${med ? Math.round(1000/med) : 0}   frame mediano ${med.toFixed(1)}ms   p95 ${p95.toFixed(1)}ms\n`
      + `frame lenti (>24ms): ${lenti} su ${f.length}   di cui in Organic Noise: ${nelRadio}\n`
      + `long task: ${longTasks.length}${longTasks.length ? ' (peggiore ' + Math.max(...longTasks.map(l=>l.ms)) + 'ms)' : ''}\n`
      + `sei in Organic Noise: ${inRadio() ? 'SI' : 'no'}   scrollTop ${app() ? Math.round(app().scrollTop) : '-'}\n`
      + `fx attivi: ${fx.length ? fx.join(',') : 'nessuno'}\n`
      + `costo callback di scroll:\n${costs || '  (nessuno)'}`;
  }

  btn.addEventListener('click', () => {
    const f = frames.slice().sort((a,b)=>a-b);
    const report = {
      quando: new Date().toISOString(),
      browser: navigator.userAgent,
      schermo: `${innerWidth}x${innerHeight} dpr${devicePixelRatio}`,
      fx: fx,
      frameMediano: +(f[f.length>>1]||0).toFixed(1),
      p95: +(f[Math.floor(f.length*0.95)]||0).toFixed(1),
      peggiore: +(f[f.length-1]||0).toFixed(1),
      frameLenti: f.filter(x=>x>24).length,
      suTotale: f.length,
      longTask: longTasks.slice(-15),
      picchi: peaks.slice(-20),
      costoCallback: (window.__scrollCost||[]).map((c,i)=>({ nome:(window.__scrollNames||[])[i]||('cb'+i), ms:+c.toFixed(2) })).sort((a,b)=>b.ms-a.ms).slice(0,8),
    };
    const txt = JSON.stringify(report, null, 1);
    console.log('[SEPT debug]\n' + txt);          // c'e' sempre, anche se la copia fallisce
    function mostra(msg) {
      out.style.display = 'block';
      out.value = txt;
      out.focus(); out.select();
      btn.textContent = msg;
      setTimeout(() => { btn.textContent = 'copia report'; }, 2500);
    }
    // 1) via moderna (serve HTTPS o localhost), 2) execCommand, 3) riquadro gia' selezionato
    const viaClipboard = navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(txt) : Promise.reject();
    viaClipboard.then(
      () => { btn.textContent = 'copiato!'; setTimeout(()=>btn.textContent='copia report', 2000); },
      () => {
        out.style.display = 'block'; out.value = txt; out.focus(); out.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        mostra(ok ? 'copiato!' : 'selezionato: premi Cmd+C');
      }
    );
  });

  requestAnimationFrame(tick);
})();
