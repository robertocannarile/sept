// home.js — pagina Home (index.html). L'array `images` lo riscrive build_pool.py
// Estratto da index.html il 23.09.2026, quando il sito e' stato diviso in pagine.
// Usa le costanti globali di js/core.js (appEl, lenis, onScroll, requestScrollFrame, measureSections).

  // ── home interactive (V2) ────────────────────────
  (function () {
    if (window.Observer) gsap.registerPlugin(Observer);
    const EASE = 'expo.inOut';

    const images = [
      "assets/img_pool/A BATHING APE/img_1.webp",
      "assets/img_pool/A BATHING APE/img_2.webp",
      "assets/img_pool/A BATHING APE/img_3.webp",
      "assets/img_pool/ACUPUNCTURE 1993/img_1.webp",
      "assets/img_pool/ACUPUNCTURE 1993/img_2.webp",
      "assets/img_pool/ACUPUNCTURE 1993/img_3.webp",
      "assets/img_pool/ALPHA INDUSTRIES/SaveClip.App_712153092_1427441886083171_6987140677704541485_n.webp",
      "assets/img_pool/ALPHA INDUSTRIES/SaveClip.App_753715936_18617656666014611_2477963505650738006_n.webp",
      "assets/img_pool/ALPHA INDUSTRIES/images-30.webp",
      "assets/img_pool/AMISH SUPPLIES/img_1.webp",
      "assets/img_pool/AMISH SUPPLIES/img_2.webp",
      "assets/img_pool/AMISH SUPPLIES/img_3.webp",
      "assets/img_pool/AMISH SUPPLIES/img_4.webp",
      "assets/img_pool/ARIES/img_1.webp",
      "assets/img_pool/ARIES/img_2.webp",
      "assets/img_pool/ARIES/img_3.webp",
      "assets/img_pool/ARTE ANTWERP/img_1.webp",
      "assets/img_pool/ARTE ANTWERP/img_2.webp",
      "assets/img_pool/ARTE ANTWERP/img_3.webp",
      "assets/img_pool/ARTE ANTWERP/img_4.webp",
      "assets/img_pool/ARTE ANTWERP/img_5.webp",
      "assets/img_pool/ARTE ANTWERP/img_6.webp",
      "assets/img_pool/ARTE ANTWERP/img_7.webp",
      "assets/img_pool/CHAMPION PINNACLE/img_1.webp",
      "assets/img_pool/CHAMPION PINNACLE/img_2.webp",
      "assets/img_pool/CHAMPION PINNACLE/img_3.webp",
      "assets/img_pool/CHAMPION PINNACLE/img_4.webp",
      "assets/img_pool/CIELE ATHLETICS/img_1.webp",
      "assets/img_pool/CIELE ATHLETICS/img_2.webp",
      "assets/img_pool/CIELE ATHLETICS/img_3.webp",
      "assets/img_pool/CIELE ATHLETICS/img_4.webp",
      "assets/img_pool/COOKMAN/img_1.webp",
      "assets/img_pool/COOKMAN/img_2.webp",
      "assets/img_pool/COOKMAN/img_3.webp",
      "assets/img_pool/COTOPAXI/img_1.webp",
      "assets/img_pool/COTOPAXI/img_2.webp",
      "assets/img_pool/COTOPAXI/img_3.webp",
      "assets/img_pool/CROCS EXP/img_1.webp",
      "assets/img_pool/CROCS EXP/img_2.webp",
      "assets/img_pool/CROCS EXP/img_3.png.webp",
      "assets/img_pool/DAILY PAPER/img_1.webp",
      "assets/img_pool/DAILY PAPER/img_2.webp",
      "assets/img_pool/DAILY PAPER/img_3.webp",
      "assets/img_pool/DAILY PAPER/img_4.webp",
      "assets/img_pool/EVISU/img_1.webp",
      "assets/img_pool/EVISU/img_2.webp",
      "assets/img_pool/EVISU/img_3.webp",
      "assets/img_pool/EVISU/img_4.webp",
      "assets/img_pool/EVISU/img_5.webp",
      "assets/img_pool/GR10K/img_1.webp",
      "assets/img_pool/GR10K/img_2.webp",
      "assets/img_pool/GR10K/img_3.webp",
      "assets/img_pool/GR10K/img_4.webp",
      "assets/img_pool/HIKING PATROL/img_1.webp",
      "assets/img_pool/HIKING PATROL/img_2.webp",
      "assets/img_pool/HIKING PATROL/img_3.webp",
      "assets/img_pool/HIKING PATROL/img_4.webp",
      "assets/img_pool/HIKING PATROL/img_5.webp",
      "assets/img_pool/KAPPY/img_1.webp",
      "assets/img_pool/KAPPY/img_2.webp",
      "assets/img_pool/KAPPY/img_3.webp",
      "assets/img_pool/KAPPY/img_4.webp",
      "assets/img_pool/KAPPY/img_5.webp",
      "assets/img_pool/KEEN/img_1.webp",
      "assets/img_pool/KEEN/img_2.webp",
      "assets/img_pool/KEEN/img_3.webp",
      "assets/img_pool/KEEN/img_4.webp",
      "assets/img_pool/KEEN/img_5.webp",
      "assets/img_pool/KEEN/img_6.webp",
      "assets/img_pool/KEEN/img_7.webp",
      "assets/img_pool/KEEN/img_8.webp",
      "assets/img_pool/LEE 101/img_2.webp",
      "assets/img_pool/LEE 101/img_3.webp",
      "assets/img_pool/LEVI'S/img_1.webp",
      "assets/img_pool/LEVI'S/img_2.webp",
      "assets/img_pool/LEVI'S/img_3.webp",
      "assets/img_pool/MONO/img_1.webp",
      "assets/img_pool/MONO/img_2.webp",
      "assets/img_pool/MONO/img_3.webp",
      "assets/img_pool/NEW AMSTERDAM SURF ASSOCIATION/img_1.webp",
      "assets/img_pool/NEW AMSTERDAM SURF ASSOCIATION/img_2.webp",
      "assets/img_pool/NEW AMSTERDAM SURF ASSOCIATION/img_3.webp",
      "assets/img_pool/NEW AMSTERDAM SURF ASSOCIATION/img_4.webp",
      "assets/img_pool/NEW AMSTERDAM SURF ASSOCIATION/img_5.webp",
      "assets/img_pool/NO PROBLEMO/img_1.webp",
      "assets/img_pool/NO PROBLEMO/img_2.webp",
      "assets/img_pool/NO PROBLEMO/img_3.webp",
      "assets/img_pool/NO PROBLEMO/img_4.webp",
      "assets/img_pool/NO PROBLEMO/img_5.webp",
      "assets/img_pool/NO PROBLEMO/img_6.webp",
      "assets/img_pool/NORDA/img_1.webp",
      "assets/img_pool/NORDA/img_2.webp",
      "assets/img_pool/NORDA/img_3.webp",
      "assets/img_pool/NORTHWAVE ESPRESSO/img_1.webp",
      "assets/img_pool/NORTHWAVE ESPRESSO/img_2.webp",
      "assets/img_pool/NORTHWAVE ESPRESSO/img_3.webp",
      "assets/img_pool/PEACEMAKER OAMC/img_1.webp",
      "assets/img_pool/PEACEMAKER OAMC/img_2.webp",
      "assets/img_pool/PEACEMAKER OAMC/img_3.webp",
      "assets/img_pool/PRESIDENT'S/img_1.webp",
      "assets/img_pool/PRESIDENT'S/img_2.webp",
      "assets/img_pool/PRESIDENT'S/img_3.webp",
      "assets/img_pool/PURAAI/img_1.webp",
      "assets/img_pool/PURAAI/img_2.webp",
      "assets/img_pool/PURAAI/img_3.webp",
      "assets/img_pool/PYRENEX/img_1.webp",
      "assets/img_pool/PYRENEX/img_2.webp",
      "assets/img_pool/PYRENEX/img_3.webp",
      "assets/img_pool/PYRENEX/img_4.webp",
      "assets/img_pool/REEBOK/img_1.webp",
      "assets/img_pool/REEBOK/img_2.webp",
      "assets/img_pool/REEBOK/img_3.webp",
      "assets/img_pool/REPLICATED GR10K/img_1.webp",
      "assets/img_pool/REPLICATED GR10K/img_2.webp",
      "assets/img_pool/REPLICATED GR10K/img_3.webp",
      "assets/img_pool/RHIZOME/img_1.webp",
      "assets/img_pool/RHIZOME/img_2.webp",
      "assets/img_pool/RHIZOME/img_3.webp",
      "assets/img_pool/RHIZOME/img_4.webp",
      "assets/img_pool/RHIZOME/img_5.webp",
      "assets/img_pool/SAMSØE SAMSØE/img_1.webp",
      "assets/img_pool/SAMSØE SAMSØE/img_2.webp",
      "assets/img_pool/SAMSØE SAMSØE/img_3.webp",
      "assets/img_pool/SANTHA/img_1.webp",
      "assets/img_pool/SANTHA/img_2.webp",
      "assets/img_pool/SANTHA/img_3.webp",
      "assets/img_pool/SANTHA/img_4.webp",
      "assets/img_pool/SATISFY/img_1.webp",
      "assets/img_pool/SATISFY/img_2.webp",
      "assets/img_pool/SATISFY/img_3.webp",
      "assets/img_pool/SESSÙN/img_1.webp",
      "assets/img_pool/SESSÙN/img_2.webp",
      "assets/img_pool/SESSÙN/img_3.webp",
      "assets/img_pool/SESSÙN/img_4.webp",
      "assets/img_pool/TEVA/img_1.webp",
      "assets/img_pool/TEVA/img_2.webp",
      "assets/img_pool/TEVA/img_3.webp",
      "assets/img_pool/TEVA/img_4.webp",
      "assets/img_pool/TEVA/img_5.webp",
      "assets/img_pool/THE SKATEROOM/img_1.webp",
      "assets/img_pool/THE SKATEROOM/img_2.webp",
      "assets/img_pool/THE SKATEROOM/img_3.webp",
      "assets/img_pool/THE SKATEROOM/img_4.webp",
      "assets/img_pool/THE SKATEROOM/img_5.webp",
      "assets/img_pool/THE SKATEROOM/img_6.webp",
      "assets/img_pool/WRANGLER/img_1.webp",
      "assets/img_pool/WRANGLER/img_2.webp",
      "assets/img_pool/WRANGLER/img_3.webp",
      "assets/img_pool/XLARGE/img_1.webp",
      "assets/img_pool/XLARGE/img_2.webp",
      "assets/img_pool/XLARGE/img_3.webp",
      "assets/img_pool/sept_images/1.webp",
      "assets/img_pool/sept_images/2.webp",
      "assets/img_pool/sept_images/A_Industries_1.webp",
      "assets/img_pool/sept_images/Sept Fall Winter 2026.From December 1st to February 28th.This season, our new stars shine bright-2.webp",
      "assets/img_pool/sept_images/Sept Fall Winter 2026.From December 1st to February 28th.This season, our new stars shine bright.webp",
      "assets/img_pool/sept_images/SnapInsta.to_330842960_195784483062928_1578246530559252716_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_346457565_562529522672731_5096596684176781966_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_420397953_717469730548917_2668765958583405295_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_427971984_686879213607969_8105612858602778323_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_430678865_698103682485522_8202629281121172911_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_430685671_698103925818831_2795973431690963513_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_434850167_717469820548908_398094931633592701_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_435658579_717469673882256_4778751413293467465_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_438169272_741524314810125_6145839405794960553_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_444784474_741525484810008_106472029674632954_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_448687580_758647679764455_615625312844814819_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_448755240_758647583097798_5379362336099471996_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_448760683_758647489764474_6530621644367498186_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_448796172_758647163097840_93102257879780321_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_4613343987_818306570465232_6926685773531405993_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_468043301_861320709497151_4100290394733275452_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_468301770_861322466163642_72289700985612363_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_468313693_861322792830276_5069859952554229913_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_468361387_861321889497033_1894285137542967504_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_473226376_890979739864581_2838419973582499864_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_480941776_936798545282700_880710541348340531_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_597552009_1140007161628503_5729618353512338259_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_599172435_1141529151476304_7726711735671877785_n.webp",
      "assets/img_pool/sept_images/SnapInsta.to_622454035_18098022472728981_4810470149169620197_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_712227571_18099050669173192_3109767083489245341_n.webp",
      "assets/img_pool/sept_images/Vibram_1.webp",
      "assets/img_pool/sept_images/sept_514253912.webp",
      "assets/img_pool/sept_images/sept_623386747.webp",
      "assets/img_pool/sept_images/sept_728861378.webp",
      "assets/img_pool/sept_images/sept_729629356.webp",
      "assets/img_pool/sept_images/sept_730275153.webp",
      "assets/img_pool/sept_images/sept_733019708.webp",
      "assets/img_pool/sept_images/sept_753267551.webp",
      "assets/img_pool/sept_images/sept_753471567.webp",
      "assets/img_pool/sept_images/sept_753707197.webp",
      "assets/img_pool/sept_images/sept_753741889.webp"
    ];

    // Immagini senza sfondo (webp con canale alpha). Rigenerato da build_pool.py.
    // In fitItems vengono renderizzate leggermente piu' grandi (NOBG_MUL).
    const noBgImages = new Set([
      "assets/img_pool/A BATHING APE/img_1.webp",
      "assets/img_pool/ALPHA INDUSTRIES/images-30.webp",
      "assets/img_pool/AMISH SUPPLIES/img_2.webp",
      "assets/img_pool/KAPPY/img_1.webp",
      "assets/img_pool/KAPPY/img_2.webp",
      "assets/img_pool/NORDA/img_1.webp",
      "assets/img_pool/PYRENEX/img_1.webp",
      "assets/img_pool/RHIZOME/img_1.webp",
      "assets/img_pool/SESSÙN/img_1.webp",
      "assets/img_pool/SESSÙN/img_2.webp",
      "assets/img_pool/sept_images/2.webp",
      "assets/img_pool/sept_images/A_Industries_1.webp",
      "assets/img_pool/sept_images/SnapInsta.to_346457565_562529522672731_5096596684176781966_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_420397953_717469730548917_2668765958583405295_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_427971984_686879213607969_8105612858602778323_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_435658579_717469673882256_4778751413293467465_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_4613343987_818306570465232_6926685773531405993_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_480941776_936798545282700_880710541348340531_n copia.webp",
      "assets/img_pool/sept_images/SnapInsta.to_622454035_18098022472728981_4810470149169620197_n copia.webp",
      "assets/img_pool/sept_images/Vibram_1.webp",
      "assets/img_pool/sept_images/sept_514253912.webp",
      "assets/img_pool/sept_images/sept_623386747.webp",
      "assets/img_pool/sept_images/sept_728861378.webp",
      "assets/img_pool/sept_images/sept_753741889.webp"
    ]);
    const NOBG_MUL = 1.35;   // quanto piu' grandi le immagini senza sfondo (1 = uguali)

    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }

    const CFG = {
      // (23.09.26 "piu' veloce") entrata delle tile ~40% piu' rapida: era 1.6 / 1.6 / 0.9
      entryDur: 1.0, entrySpread: 1.0, entryRand: 0.55,
      zoom: 5, exitDur: 0.85, count: 200, sizeMul: 1.4,
      vibAmp: 0.04, vibSpd: 1.4, flyDist: 14
    };

    gsap.config({ force3D: true });
    // NB: niente lagSmoothing qui — lo scroll di lenis gira su gsap.ticker e
    // vuole lagSmoothing(0), impostato una volta sola nel setup di lenis.

    const SVG_W = 36.63, SVG_H = 36.66;
    const HALF_W = SVG_W / 2, HALF_H = SVG_H / 2;
    const NS = 'http://www.w3.org/2000/svg';
    const PROX_RADIUS = 2.4, PROX_PUSH = 0.28;

    const svg   = document.getElementById('home-svg-root');
    const scene = document.getElementById('home-imgs');
    const cam = { cx: HALF_W, cy: HALF_H, zoom: 1 };

    // ── RENDERER CANVAS ───────────────────────────────────────────
    // Il collage e' disegnato qui. Prima erano 192 <image> dentro 1153 nodi SVG
    // che Safari ridipingeva in CPU: misurati 53 picchi >50ms in 12s (peggiore
    // 361ms), molti anche da FERMO, per sola colpa della vibrazione. Stesso
    // collage in canvas: 0 picchi, peggiore 20ms. Vedi ../_test_canvas/.
    // L'SVG resta, ma solo come strato di eventi (rect trasparenti).
    const cvs = document.createElement('canvas');
    cvs.id = 'home-canvas';
    cvs.style.opacity = '0';
    cvs.style.transition = 'opacity 0.6s ease';
    svg.parentNode.insertBefore(cvs, svg);
    const ctx = cvs.getContext('2d');
    let cvW = 0, cvH = 0;
    let drawOrder = [];   // non-alpha prima, alpha dopo (= disegnate sopra)
    // Simbolo della pace disegnato SOTTO le tile durante l'apertura (23.09.26, vedi revealAll).
    // `a` opacita', `s` scala attorno al centro. Dichiarato qui (non vicino a pathStr) perche'
    // matchSvgBox → drawScene gira gia' al parse: stessa trappola TDZ di drawOrder.
    const logoPace = { a: 0, s: 1, i: 0 };   // i = opacita' dei 4 simbolini sul bordo (schermata d'apertura)
    let logoPath = null;   // Path2D creato al primo uso: pathStr e' dichiarato piu' sotto
    function sizeCanvas(w, h) {
      const dpr = window.devicePixelRatio || 1;
      cvW = w || cvs.clientWidth  || window.innerWidth;
      cvH = h || cvs.clientHeight || window.innerHeight;
      cvs.width  = Math.round(cvW * dpr);
      cvs.height = Math.round(cvH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // Il canvas insegue il riquadro dell'SVG (stesso box = stessa inquadratura).
    // ResizeObserver e non un listener di resize: al parse l'SVG non ha ancora la
    // dimensione finale, e la sua misura cambia anche nelle media query senza che
    // la finestra venga ridimensionata.
    const homeSection = document.getElementById('home');
    // Il canvas copre TUTTA la sezione, ma le coordinate restano mappate sul
    // riquadro dell'SVG (boxX/Y/W/H). Serve perche' `#home-svg-root` ha
    // `overflow: visible`: in zoom le immagini debordano dal suo quadrato 680x680
    // e riempiono lo schermo. Un canvas invece ritaglia SEMPRE ai propri bordi:
    // con il canvas grande quanto il quadrato si vedeva un riquadro tagliato.
    // Il debordamento resta comunque contenuto da `#home { overflow: hidden }`,
    // esattamente come per l'SVG.
    let boxX = 0, boxY = 0, boxW = 0, boxH = 0;
    function matchSvgBox() {
      // NB: niente offsetLeft/offsetWidth qui — sono proprieta' di HTMLElement e
      // su un elemento SVG valgono `undefined`. Serve getBoundingClientRect.
      const r = svg.getBoundingClientRect();
      const p = homeSection.getBoundingClientRect();
      if (!r.width || !r.height || !p.width) return;
      boxX = r.left - p.left; boxY = r.top - p.top;
      boxW = r.width;         boxH = r.height;
      sizeCanvas(p.width, p.height);   // il canvas e' grande quanto la sezione
      drawScene();
    }
    if (window.ResizeObserver) new ResizeObserver(matchSvgBox).observe(svg);
    window.addEventListener('resize', matchSvgBox);
    matchSvgBox();

    function drawScene() {
      if (!cvW || !boxW) return;
      // stessa inquadratura del viewBox SVG, con preserveAspectRatio "meet"
      const hw = SVG_W / (2 * cam.zoom), hh = SVG_H / (2 * cam.zoom);
      const vw = hw * 2, vh = hh * 2;
      // scala e centratura calcolate sul RIQUADRO dell'SVG (come preserveAspectRatio
      // "meet" farebbe li' dentro), non sul canvas: il canvas e' piu' grande apposta.
      const sc = Math.min(boxW / vw, boxH / vh);
      const ox = boxX + (boxW - vw * sc) / 2 - (cam.cx - hw) * sc;
      const oy = boxY + (boxH - vh * sc) / 2 - (cam.cy - hh) * sc;
      ctx.clearRect(0, 0, cvW, cvH);
      if (logoPace.a > 0) {
        if (!logoPath) logoPath = new Path2D(pathStr);
        ctx.save();
        ctx.globalAlpha = logoPace.a;
        // #3F108A, un tono sotto lo sfondo #4F14AD (Roberto 23.09.26: "lascia quello scuro").
        // Provati e scartati: bianco, #7243BD (piu' chiaro, dal Figma "MacBook Pro 14_ - 15")
        ctx.fillStyle = '#3F108A';
        // coordinate della scena (come le tile) → segue anche lo zoom; scala attorno al centro
        ctx.translate(ox + HALF_W * sc, oy + HALF_H * sc);
        ctx.scale(sc * logoPace.s, sc * logoPace.s);
        ctx.translate(-HALF_W, -HALF_H);
        ctx.fill(logoPath);
        ctx.restore();
      }
      // 4 simbolini bianchi sul bordo del cerchio (alto, destra, basso, sinistra): seguono il raggio
      // del simbolo grande mentre cresce. 10 px su 1502 nel Figma.
      if (logoPace.i > 0 && logoPace.a > 0) {
        if (!logoPath) logoPath = new Path2D(pathStr);
        const cx = ox + HALF_W * sc, cy = oy + HALF_H * sc;
        const r  = HALF_W * sc * logoPace.s;
        const lato = Math.max(8, Math.min(14, window.innerWidth * 0.0067));
        ctx.save();
        ctx.globalAlpha = logoPace.i;
        ctx.fillStyle = '#fff';
        for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          const dpr = window.devicePixelRatio || 1;
          ctx.scale(dpr, dpr);
          ctx.translate(cx + dx * r, cy + dy * r);
          ctx.scale(lato / SVG_W, lato / SVG_W);
          ctx.translate(-HALF_W, -HALF_H);
          ctx.fill(logoPath);
        }
        ctx.restore();
      }
      for (let i = 0; i < drawOrder.length; i++) {
        const it = drawOrder[i];
        // in zoom, se la 700 px e' gia' arrivata si disegna quella (vedi updateHiRes)
        const src = it.imgFull || it.img;
        if (!src || it.anim.o <= 0) continue;
        const x = it.x + it.fly.x + it.nudge.x + it.vx;
        const y = it.y + it.fly.y + it.nudge.y + it.vy;
        const w = it.w * it.anim.s * sc, h = it.h * it.anim.s * sc;
        const px = ox + x * sc, py = oy + y * sc;
        ctx.globalAlpha = it.anim.o;
        if (it.fly.rot) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(it.fly.rot * Math.PI / 180);
          ctx.drawImage(src, -w / 2, -h / 2, w, h);
          ctx.restore();
        } else {
          ctx.drawImage(src, px - w / 2, py - h / 2, w, h);
        }
      }
      ctx.globalAlpha = 1;
    }
    let isZoomed = false;
    let panObserver = null;   // Observer di pan: attivo SOLO in zoom (altrimenti ruba lo scroll)

    function setViewBox() {
      const hw = SVG_W / (2 * cam.zoom);
      const hh = SVG_H / (2 * cam.zoom);
      svg.setAttribute('viewBox', (cam.cx - hw) + ' ' + (cam.cy - hh) + ' ' + (hw * 2) + ' ' + (hh * 2));
      updateCenterBrand();
      updateHiRes();
    }

    // Swap alla risoluzione piena (700 px) solo per le tile inquadrate in zoom. A riposo il
    // collage sta tutto sulle 200 px; in zoom 5x il viewBox copre ~1/25 della scena, quindi
    // entrano in gioco ~15-25 tile. All'uscita si torna alle 200 px e la memoria si libera.
    const HIRES_MARGIN = 1.35;   // quanto oltre il bordo del viewBox si precarica
    let hiResItems = [];
    function updateHiRes() {
      if (!isZoomed) return;
      // NB: si misura sullo zoom di ARRIVO, non su cam.zoom. setViewBox gira gia' dal primo
      // frame dell'animazione, quando lo zoom vale ancora ~1 e il riquadro coprirebbe tutta
      // la scena → verrebbero promosse tutte e 192 le tile.
      const zt = Math.max(cam.zoom, CFG.zoom);
      const hw = (SVG_W / (2 * zt)) * HIRES_MARGIN;
      const hh = (SVG_H / (2 * zt)) * HIRES_MARGIN;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it.hiRes) continue;
        if (Math.abs(it.x - cam.cx) > hw || Math.abs(it.y - cam.cy) > hh) continue;
        it.hiRes = true;
        hiResItems.push(it);
        const full = new Image();
        full.decoding = 'async';
        // `it.imgFull` si popola solo a bitmap pronta: il canvas continua a disegnare la
        // 200 px fino a quel momento, quindi niente buco al posto della tile
        full.onload = function() { if (it.hiRes) it.imgFull = full; };
        full.src = it.src;
      }
    }
    function dropHiRes() {
      for (let i = 0; i < hiResItems.length; i++) {
        const it = hiResItems[i];
        it.hiRes = false;
        it.imgFull = null;   // unica referenza: la bitmap a 700 px viene liberata
      }
      hiResItems = [];
    }

    // Su touch non esiste hover: in zoom si mostra il brand dell'immagine piu' vicina al centro
    // del viewport, aggiornato mentre si panna. Su desktop non fa nulla (li' comanda l'hover).
    // Si saltano le tile senza brand (cartella sept_images): bastava una di quelle al centro
    // per far sparire l'etichetta, e sembrava che avesse smesso di funzionare.
    const IS_TOUCH = window.matchMedia('(hover: none)').matches;
    let centerBrandItem = null;
    function updateCenterBrand() {
      if (!IS_TOUCH) return;
      if (!isZoomed) { centerBrandItem = null; return; }
      let best = null, bestD = Infinity;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (!it.brand) continue;
        const d = (it.x - cam.cx) * (it.x - cam.cx) + (it.y - cam.cy) * (it.y - cam.cy);
        if (d < bestD) { bestD = d; best = it; }
      }
      if (!best || best === centerBrandItem) return;
      centerBrandItem = best;
      homeBrandLabel.textContent = best.brand;
      homeBrandLabel.classList.add('show');
    }
    function clampCX(v) { const hw = SVG_W / (2 * cam.zoom); return Math.max(hw, Math.min(SVG_W - hw, v)); }
    function clampCY(v) { const hh = SVG_H / (2 * cam.zoom); return Math.max(hh, Math.min(SVG_H - hh, v)); }

    // hit canvas
    const CSIZE = 300, HIT_SCL = CSIZE / SVG_W;
    const pathStr = "M18.28,36.66a18.33,18.33,0,1,1,18.34-18A18.34,18.34,0,0,1,18.28,36.66Zm-.67-4.07a16,16,0,0,0,3.87-.37,15,15,0,0,0,3.19-1.14c.38-.18.39-.22.13-.57-1.19-1.6-2.39-3.19-3.58-4.8s-2.15-3-3.25-4.44c-.83-1.09-.5-.88-1.78-.89-3.85,0-7.7,0-11.55,0-.33,0-.4.07-.36.4a8.75,8.75,0,0,0,.2,1A17.16,17.16,0,0,0,5.74,25a14.3,14.3,0,0,0,8.73,7A14.38,14.38,0,0,0,17.61,32.59ZM10.8,16.27h6.07a.82.82,0,0,0,.72-.36c1.07-1.46,2.16-2.91,3.23-4.36.61-.83,1.2-1.66,1.81-2.48.74-1,1.48-2,2.24-3q.21-.29-.09-.42c-.66-.29-1.31-.61-2-.85a11.32,11.32,0,0,0-1.74-.42,16.78,16.78,0,0,0-2.44-.31,12.74,12.74,0,0,0-4.2.58,18.24,18.24,0,0,0-3,1.22A12.7,12.7,0,0,0,8.17,8.33,15.3,15.3,0,0,0,5.57,12a16.59,16.59,0,0,0-1.28,3.81c-.09.41,0,.48.4.48ZM22.42,20.4a.86.86,0,0,0,0,.19l2.35,3.15,2,2.71,1.29,1.74c.13.18.26.25.45,0a14.42,14.42,0,0,0,3.26-5.44c.2-.61.33-1.25.5-1.87.13-.45.08-.53-.4-.53h-9Zm0-4.25.06.11H32c.38,0,.44-.05.36-.36a22.3,22.3,0,0,0-.6-2.27,15.58,15.58,0,0,0-2.87-4.87c-.11-.12-.23-.23-.35-.34s-.26-.14-.39,0l-1.34,1.8Q25,12.63,23.28,15C23,15.39,22.73,15.77,22.45,16.15Z";
    const hitCv = document.createElement('canvas');
    hitCv.width = hitCv.height = CSIZE;
    const hitCtx = hitCv.getContext('2d');
    hitCtx.scale(HIT_SCL, HIT_SCL);
    hitCtx.fill(new Path2D(pathStr));
    let hitPx = hitCtx.getImageData(0, 0, CSIZE, CSIZE).data;
    function insideShape(sx, sy) {
      const px = Math.round(sx * HIT_SCL), py = Math.round(sy * HIT_SCL);
      if (px < 0 || py < 0 || px >= CSIZE || py >= CSIZE) return false;
      return hitPx[(py * CSIZE + px) * 4 + 3] > 128;
    }

    // hex grid
    const CELL_W = 1.3, CELL_H = CELL_W * 0.75;
    const IMG_W = CELL_W * 1.18, IMG_H = CELL_H * 1.18;
    const JX = CELL_W * 0.42, JY = CELL_H * 0.42;
    function hexGrid() {
      const pts = [];
      const phX = Math.random() * CELL_W, phY = Math.random() * CELL_H;
      let row = 0;
      for (let y = phY; y < SVG_H + CELL_H; y += CELL_H * 0.88) {
        const xOff = (row % 2 === 0 ? 1 : -1) * CELL_W * 0.5 * (Math.random() > 0.5 ? 1 : 0.5);
        for (let x = phX + xOff; x < SVG_W + CELL_W; x += CELL_W) {
          const cx = x + (Math.random() * 2 - 1) * JX;
          const cy = y + (Math.random() * 2 - 1) * JY;
          if (insideShape(cx, cy)) pts.push([cx, cy]);
        }
        row++;
      }
      for (let k = pts.length - 1; k > 0; k--) {
        const m = Math.floor(Math.random() * (k + 1));
        const t = pts[k]; pts[k] = pts[m]; pts[m] = t;
      }
      return pts;
    }

    const positions = hexGrid();
    hitPx = null;

    // build items
    const items = [];
    const MAX_DIST = Math.sqrt(HALF_W * HALF_W + HALF_H * HALF_H);
    // aspect ratio (w/h) per src, riempita dal preloader; usata da fitItems()
    const ratioMap = {};

    // Pool a due risoluzioni. `assets/img_pool_small/` (lato lungo 200 px, generato da
    // make_pool_small.py) e' il mirror esatto di `assets/img_pool/` (700 px): stessi path,
    // stesso aspetto, stesso alpha. Sul canvas le <img> vanno tenute VIVE — sono la sorgente
    // di ogni drawImage — quindi il pool a 700 px significherebbe 278 MB di bitmap residenti,
    // che su iPhone fa espellere la scheda. Con le 200 px sono 24 MB; le tile si disegnano a
    // ~40-60 px CSS (fino a ~180 su schermo 3x), quindi a riposo non si vede differenza.
    // Le 700 px entrano solo sulle tile inquadrate in zoom (updateHiRes).
    function smallSrc(src) { return src.replace('assets/img_pool/', 'assets/img_pool_small/'); }

    function buildItems() {
      while (scene.firstChild) scene.removeChild(scene.firstChild);
      items.length = 0;

      // ogni immagine UNA volta sola: shuffle di tutte le immagini uniche, poi taglio a COUNT.
      // COUNT limitato anche da images.length → niente duplicati (prima era images[s % len]).
      const COUNT = Math.min(positions.length, CFG.count, images.length);
      const srcs = images.slice();
      for (let s = srcs.length - 1; s > 0; s--) {
        const sj = Math.floor(Math.random() * (s + 1));
        const st = srcs[s]; srcs[s] = srcs[sj]; srcs[sj] = st;
      }
      srcs.length = COUNT;

      for (let n = 0; n < COUNT; n++) {
        const pos = positions[n];
        const px = pos[0], py = pos[1];
        const jit = (0.94 + Math.random() * 0.18) * CFG.sizeMul;
        const iw = IMG_W * jit, ih = IMG_H * jit;

        // Un solo <rect> trasparente per item: serve SOLO al hit-test di hover e
        // click (delega eventi su `scene`). Statico: non vibra e non scala, cosi'
        // l'SVG non si sporca mai e Safari non deve ridipingerlo. Lo scarto
        // rispetto alla tile disegnata e' al massimo l'ampiezza della vibrazione
        // (0.04 unita'), impercettibile. Segue lo zoom tramite il viewBox.
        const itemG = document.createElementNS(NS, 'rect');
        itemG.setAttribute('class', 'item');
        itemG.setAttribute('pointer-events', 'all');
        scene.appendChild(itemG);

        items.push({
          itemG, parallaxG: null,
          src: srcs[n], baseArea: iw * ih,
          x: px, y: py, w: iw, h: ih,
          img: null,                       // <img> del preloader: sorgente del disegno
          fly:   { x: 0, y: 0, rot: 0 },   // entrata
          nudge: { x: 0, y: 0 },           // spinta dei vicini all'hover
          anim:  { s: 1, o: 0 },           // scala e opacita' (entry, breathing, hover)
          vx: 0, vy: 0,                    // vibrazione
          // la cartella e' il nome del brand; `sept_images` e' materiale di casa, non un brand
          brand: (function(f) { return f === 'sept_images' ? '' : (f || ''); })(srcs[n].split('/').slice(-2)[0]),
          vibFx: 0.6 + Math.random() * 1.4, vibFy: 0.6 + Math.random() * 1.4,
          vibPx: Math.random() * Math.PI * 2, vibPy: Math.random() * Math.PI * 2,
          vibAm: 0.7 + Math.random() * 0.6,
          parallaxDepth: 0.3 + Math.random() * 0.7,
          hovered: false
        });
      }
    }

    buildItems();

    // Dà a ogni box l'aspect reale della sua immagine (area costante = it.baseArea).
    // Box == aspect immagine → 'meet' riempie esatto: zero crop, zero letterbox.
    // Chiamata dopo il preload (ratioMap pronta).
    function fitItems() {
      for (const it of items) {
        const r = ratioMap[it.src] || (IMG_W / IMG_H);
        // B: normalizza per lato LUNGO (= √baseArea, con jitter). Il lato corto segue l'aspect.
        // Box == aspect immagine → 'meet' riempie esatto: zero crop.
        // Immagini senza sfondo (alpha) leggermente piu' grandi (NOBG_MUL).
        const L = Math.sqrt(it.baseArea) * (noBgImages.has(it.src) ? NOBG_MUL : 1);
        let w, h;
        if (r >= 1) { w = L; h = L / r; }   // landscape: lato lungo = larghezza
        else        { h = L; w = L * r; }   // portrait:  lato lungo = altezza
        it.w = w; it.h = h;
        it.itemG.setAttribute('x', (it.x - w / 2).toFixed(3));
        it.itemG.setAttribute('y', (it.y - h / 2).toFixed(3));
        it.itemG.setAttribute('width',  w.toFixed(3));
        it.itemG.setAttribute('height', h.toFixed(3));
      }
      // Immagini senza sfondo SOPRA a tutte. Nel canvas lo z-order e' l'ordine di
      // disegno; nell'SVG degli eventi e' l'ordine DOM → ri-appendo i loro rect in
      // fondo cosi' anche il hit-test da' la precedenza a quelle sopra.
      const sotto = [], sopra = [];
      for (const it of items) (noBgImages.has(it.src) ? sopra : sotto).push(it);
      for (const it of sopra) scene.appendChild(it.itemG);
      drawOrder = sotto.concat(sopra);
    }

    // entry
    function playEntry() {
      for (let r = 0; r < items.length; r++) {
        const it = items[r];
        const ddx = it.x - HALF_W, ddy = it.y - HALF_H;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        const outsideFirst = 1 - dist / MAX_DIST;
        const delay = outsideFirst * CFG.entrySpread + Math.random() * CFG.entryRand;
        const baseAng = Math.atan2(ddy, ddx);
        const ang = baseAng + (Math.random() - 0.5) * Math.PI;
        const d = CFG.flyDist * (0.5 + Math.random() * 0.8);
        // Stessi easing, durate e delay di prima: cambia solo il bersaglio, che ora
        // e' un oggetto di numeri letto dal renderer invece di un nodo SVG.
        gsap.fromTo(it.fly,
          { x: Math.cos(ang) * d, y: Math.sin(ang) * d, rot: Math.random() * 60 - 30 },
          { x: 0, y: 0, rot: 0, duration: CFG.entryDur, delay, ease: EASE, overwrite: 'auto' });
        gsap.fromTo(it.anim,
          { s: 0.2, o: 0 },
          { s: 1, o: 1, duration: CFG.entryDur, delay, ease: EASE, overwrite: 'auto' });
      }
    }

    // vibration
    let homeVisible = true;   // gated by IntersectionObserver below
    let vibRunning = false;
    function startVibration() {
      // `?debug=1&fx=noloops`: niente vibrazione ne' respiro → il canvas della home smette di
      // essere ridisegnato. Serve a vedere se i frame persi vengono da li' anche quando la
      // home e' lontana dallo schermo.
      if (/[?&]debug=1/.test(location.search) && /[?&]fx=[^&]*noloops/.test(location.search)) return;
      if (/[?&]prova=[^&]*noloops/.test(location.search)) return;   // PROVA 17.09.26, senza debug
      if (vibRunning) return;
      vibRunning = true;
      const t0 = performance.now();
      let lastApply = 0;
      function loop(now) {
        if (!homeVisible) { vibRunning = false; return; } // pause loop when home off-screen
        if (now - lastApply >= 33) {
          lastApply = now;
          const t = (now - t0) / 1000 * CFG.vibSpd;
          const amp = CFG.vibAmp;
          for (let i = 0; i < items.length; i++) {
            const it = items[i];
            if (it.hovered) { it.vx = it.vy = 0; continue; }
            const a = amp * it.vibAm;
            it.vx = Math.sin(t * it.vibFx + it.vibPx) * a;
            it.vy = Math.cos(t * it.vibFy + it.vibPy) * a;
          }
        }
        // La vibrazione si aggiorna a 30fps come prima, ma il disegno va a ogni
        // frame: entry, breathing e hover sono tween a 60fps e a 30 si vedrebbero
        // a scatti. Ridisegnare il canvas costa pochissimo (vedi prototipo).
        drawScene();
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }

    // breathing
    let breathingStarted = false;
    let breathingRunning = false;
    function startBreathing() {
      if (breathingRunning) return;
      breathingRunning = true;
      function wave() {
        if (!homeVisible) { breathingRunning = false; return; } // pause when home off-screen
        if (isZoomed) { setTimeout(wave, 2200); return; }
        const ci = Math.floor(Math.random() * items.length);
        const cx = items[ci].x, cy = items[ci].y;
        const bucket = items.map(it => ({ item: it, d: Math.hypot(it.x - cx, it.y - cy) }))
          .sort((a, b) => a.d - b.d).slice(0, 28);
        const maxD = bucket[bucket.length - 1].d || 1;
        bucket.forEach(e => {
          if (e.item.itemG === hoveredItem) return;
          const waveDelay = (e.d / maxD) * 0.45;
          // keyframes: anima dalla scala CORRENTE → picco → 1, sempre FLUIDO
          // (niente snap di immediateRender). Finisce a 1 → sblocca gli item
          // rimasti incastrati piccoli. Pulsa verso l'alto: resting = 1, mai più piccoli.
          const dur = 0.65 + Math.random() * 0.3;
          gsap.to(e.item.anim, {
            keyframes: [
              { s: 1.04 + Math.random() * 0.06, duration: dur * 0.5 },
              { s: 1, duration: dur * 0.5 }
            ],
            delay: waveDelay, ease: EASE, overwrite: 'auto'
          });
        });
        setTimeout(wave, 1600 + Math.random() * 1600);
      }
      setTimeout(wave, 1200);
    }

    // pause/resume the home rAF loops when the section leaves/enters the
    // viewport — they used to run forever (200-item vib loop @30fps + breathing),
    // loading the main thread and making all scrolling feel less fluid.
    // PROVATO E SCARTATO (14.09.26): due observer asimmetrici (stop stretto + start
    // anticipato a rootMargin 75%) per far ripartire i loop prima del rientro.
    // Nessun guadagno misurato su Safari (190 → 199ms) → tornato a uno solo.
    new IntersectionObserver(es => {
      es.forEach(e => { homeVisible = e.isIntersecting; });
      if (homeVisible) {
        startVibration();
        if (breathingStarted) startBreathing();
      }
    }, { threshold: 0 }).observe(document.getElementById('home'));

    // hover
    let hoveredItem = null;
    let nudgedItems = [];
    function findItemGroup(el) {
      while (el && el !== scene) {
        if (el.getAttribute && el.getAttribute('class') === 'item') return el;
        el = el.parentNode;
      }
      return null;
    }
    function findItemData(g) {
      for (let i = 0; i < items.length; i++) if (items[i].itemG === g) return items[i];
      return null;
    }
    function getNeighbors(hItem) {
      const res = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it === hItem) continue;
        const dx = it.x - hItem.x, dy = it.y - hItem.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < PROX_RADIUS && d > 0) {
          const falloff = Math.pow(1 - d / PROX_RADIUS, 2);
          const strength = PROX_PUSH * falloff;
          res.push({ item: it, nx: (dx / d) * strength, ny: (dy / d) * strength });
        }
      }
      return res;
    }
    const homeBrandLabel = document.getElementById('home-brand-label');

    function clearHover() {
      if (hoveredItem) {
        // `hoveredItem` resta il <rect> (serve come identita' per i confronti),
        // ma cio' che si anima ora e' l'oggetto numerico dell'item.
        const prev = findItemData(hoveredItem);
        if (prev) {
          gsap.to(prev.anim, { s: 1, duration: 0.32, ease: EASE });
          prev.hovered = false;
        }
      }
      for (let i = 0; i < nudgedItems.length; i++) {
        gsap.to(nudgedItems[i].item.nudge, { x: 0, y: 0, duration: 0.4, ease: EASE });
      }
      nudgedItems = [];
      hoveredItem = null;
      homeBrandLabel.classList.remove('show'); // hide brand name
    }
    scene.addEventListener('mouseover', function(e) {
      const g = findItemGroup(e.target);
      if (!g) return;
      const hItem = findItemData(g);
      if (isZoomed) {
        // zoomed: show only the brand name of the hovered image (no scale/nudge)
        if (hItem && hItem.brand) { homeBrandLabel.textContent = hItem.brand; homeBrandLabel.classList.add('show'); }
        return;
      }
      // normal state: hover scale + neighbour nudge, NO brand label
      if (g === hoveredItem) return;
      clearHover();
      hoveredItem = g;
      if (hItem) {
        gsap.to(hItem.anim, { s: 1.5, duration: 0.35, ease: EASE });
        hItem.hovered = true;      // ferma la vibrazione su questa tile
        hItem.vx = hItem.vy = 0;
        nudgedItems = getNeighbors(hItem);
        for (let i = 0; i < nudgedItems.length; i++) {
          gsap.to(nudgedItems[i].item.nudge, {
            x: nudgedItems[i].nx, y: nudgedItems[i].ny,
            duration: 0.36, ease: EASE
          });
        }
      }
    });
    scene.addEventListener('mouseout', function(e) {
      if (isZoomed) {
        // hide brand unless moving straight onto another item (its mouseover updates it)
        if (!findItemGroup(e.relatedTarget)) homeBrandLabel.classList.remove('show');
        return;
      }
      if (!hoveredItem) return;
      if (findItemGroup(e.relatedTarget) === hoveredItem) return;
      clearHover();
    });

    // zoom in/out
    function zoomIn(nearX, nearY) {
      clearHover();
      isZoomed = true;
      document.body.classList.add('home-zoomed');
      document.getElementById('home').classList.add('gradient-active');
      if (panObserver) panObserver.enable();   // pan attivo solo ora
      // mobile/tablet: in zoom la pagina NON scrolla (solo fuori zoom)
      if (window.innerWidth <= 1024 && window.lenis) window.lenis.stop();
      const ZI = CFG.zoom;
      const targetCX = Math.max(SVG_W / (2 * ZI), Math.min(SVG_W - SVG_W / (2 * ZI), nearX));
      const targetCY = Math.max(SVG_H / (2 * ZI), Math.min(SVG_H - SVG_H / (2 * ZI), nearY));
      const fracX = (nearX - cam.cx) / (SVG_W / cam.zoom);
      const fracY = (nearY - cam.cy) / (SVG_H / cam.zoom);
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1, duration: 1.0, ease: EASE,
        onUpdate: function() {
          const t = proxy.t;
          const z = 1 + (ZI - 1) * t;
          cam.zoom = z;
          const zCX = nearX - fracX * (SVG_W / z);
          const zCY = nearY - fracY * (SVG_H / z);
          cam.cx = zCX + (targetCX - zCX) * t;
          cam.cy = zCY + (targetCY - zCY) * t;
          setViewBox();
        }
      });
    }
    function zoomOut() {
      isZoomed = false;
      document.body.classList.remove('home-zoomed');
      document.getElementById('home').classList.remove('gradient-active');
      if (panObserver) panObserver.disable();   // spento fuori zoom → non ruba lo scroll
      if (window.lenis) window.lenis.start();    // riabilita scroll (era bloccato in zoom su mobile/tablet)
      homeBrandLabel.classList.remove('show'); // clear brand when leaving zoom
      centerBrandItem = null;
      dropHiRes();                              // torna alle 200 px → memoria liberata
      const startCX = cam.cx, startCY = cam.cy, startZ = cam.zoom;
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1, duration: CFG.exitDur, ease: EASE,
        onUpdate: function() {
          const t = proxy.t;
          cam.zoom = startZ + (1 - startZ) * t;
          cam.cx = startCX + (HALF_W - startCX) * t;
          cam.cy = startCY + (HALF_H - startCY) * t;
          setViewBox();
        }
      });
    }
    let mouseDownPos = null;
    svg.addEventListener('mousedown', e => { mouseDownPos = { x: e.clientX, y: e.clientY }; });
    svg.addEventListener('click', function(e) {
      if (!mouseDownPos) return;
      if (Math.abs(e.clientX - mouseDownPos.x) > 5 || Math.abs(e.clientY - mouseDownPos.y) > 5) return;
      if (isZoomed) {
        // un click/tap in QUALSIASI punto esce dallo zoom, immagini comprese: prima il tap su
        // una tile mostrava solo il brand e non usciva, e da telefono sembrava bloccato.
        // Il brand su touch lo mostra updateCenterBrand() mentre panni.
        zoomOut();
        return;
      }
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const sp = pt.matrixTransform(svg.getScreenCTM().inverse());
      let nearX = sp.x, nearY = sp.y;
      const g = findItemGroup(e.target);
      if (g) {
        const h = findItemData(g);
        if (h) { nearX = h.x; nearY = h.y; }
      }
      zoomIn(nearX, nearY);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isZoomed) zoomOut(); });

    if (window.Observer) {
      let dragCamStart = null, dragStartX = 0, dragStartY = 0;
      panObserver = Observer.create({
        target: svg, type: 'pointer', dragMinimum: 5,
        onDragStart: function(self) {
          if (!isZoomed) return;
          if (self.event && self.event.pointerType === 'touch') return;
          dragCamStart = { cx: cam.cx, cy: cam.cy };
          dragStartX = self.x; dragStartY = self.y;
        },
        onDrag: function(self) {
          if (!isZoomed || !dragCamStart) return;
          if (self.event && self.event.pointerType === 'touch') return;
          const rootW = svg.getBoundingClientRect().width;
          const upx = (SVG_W / cam.zoom) / rootW;
          cam.cx = clampCX(dragCamStart.cx - (self.x - dragStartX) * upx);
          cam.cy = clampCY(dragCamStart.cy - (self.y - dragStartY) * upx);
          setViewBox();
        },
        onDragEnd: function() { dragCamStart = null; }
      });
      panObserver.disable();   // parte spento: si accende solo in zoom
    }

    // ── preload + reveal with menu compose ───────────
    const preloader  = document.getElementById('preloader');
    const preloadPct = document.getElementById('preload-pct');
    const homeLoader = document.getElementById('home-loader');
    if (homeLoader) homeLoader.style.display = 'none';
    // Il preloader mostra solo la percentuale: il logo che si disegnava e i nomi delle sezioni
    // sono stati tolti il 16.09.26 (con loro sono spariti il tween infinito sullo stroke e
    // i cinque tween del menu).

    // parallax on mouse/touch move
    const PARALLAX_SCALE = 0.022;
    let pMX = 0, pMY = 0, pCX = 0, pCY = 0, pRunning = false;
    function updateParallax(clientX, clientY) {
      return; // parallasse home disattivata (richiesta utente)
      const r = svg.getBoundingClientRect();
      pMX = ((clientX - r.left) / r.width - 0.5) * SVG_W;
      pMY = ((clientY - r.top) / r.height - 0.5) * SVG_H;
      if (!pRunning) { pRunning = true; requestAnimationFrame(parallaxLoop); }
    }
    svg.addEventListener('mousemove', function(e) { updateParallax(e.clientX, e.clientY); });
    svg.addEventListener('touchmove', function(e) {
      if (e.touches.length === 1) updateParallax(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    svg.addEventListener('mouseleave', function() { pMX = 0; pMY = 0; });
    svg.addEventListener('touchend', function() { pMX = 0; pMY = 0; });
    function parallaxLoop() {
      // Parallasse spenta. Per riaccenderla ora: togliere il `return` in cima a
      // updateParallax e sommare l'offset nel renderer (drawScene), come si fa
      // gia' per fly, nudge e vibrazione. Il vecchio gruppo SVG non esiste piu'.
      if (!items.length || !items[0].parallaxG) { pRunning = false; return; }
      pCX += (pMX - pCX) * 0.07;
      pCY += (pMY - pCY) * 0.07;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const ox = pCX * it.parallaxDepth * PARALLAX_SCALE;
        const oy = pCY * it.parallaxDepth * PARALLAX_SCALE;
        it.parallaxG.setAttribute('transform', 'translate(' + ox.toFixed(4) + ',' + oy.toFixed(4) + ')');
      }
      if (Math.abs(pMX) > 0.001 || Math.abs(pMY) > 0.001 || Math.abs(pCX) > 0.001 || Math.abs(pCY) > 0.001) {
        requestAnimationFrame(parallaxLoop);
      } else {
        pRunning = false;
      }
    }

    let loaded = 0, revealed = false;
    // ── SCHERMATA D'APERTURA (23.09.26, Figma di Roberto) ──
    // Parte subito, mentre le immagini del collage si caricano: .sept, le due righe di testo,
    // "Founded in 2020" e i quattro simboli entrano con lo stile delle scritte del sito (righe che
    // salgono di 10 px comparendo, in sequenza, vedi testo.js), poi restano ferme INTRO_SOSTA
    // secondi. La promessa si risolve a quel punto: la home parte quando sono pronte ENTRAMBE le
    // cose (schermata finita + immagini caricate), vedi revealAll.
    // misura del simbolo durante la schermata, rispetto a quella finale del collage: 489 px su 784
    // nel Figma a 1502x864
    const SIMBOLO_INTRO = 0.62;
    const INTRO_SOSTA = 0.15;  // (23.09.26 "pause molto piu' brevi": era 1.2, poi 0.6)
    function introApertura() {
      const intro = document.getElementById('intro');
      if (!intro || !window.gsap) return Promise.resolve();
      return new Promise(resolve => {
        function via() {
          const q = sel => [...intro.querySelectorAll(sel)];
          const righe = [].concat(...q('.intro-testo').map(el => {
            const sp = window.SplitType ? new SplitType(el, { types: 'lines' }) : { lines: [el] };
            sp.lines.forEach(l => {
              if (l === el) return;
              const w = document.createElement('span');
              w.className = 'anim-line-wrap';
              l.parentNode.insertBefore(w, l);
              w.appendChild(l);
            });
            gsap.set(el, { opacity: 1 });
            return sp.lines;
          }));
          const logo = q('.intro-logo');
          const su   = { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' };
          gsap.set([...logo, ...righe], { opacity: 0, y: 10 });
          // IL SIMBOLO CRESCE SOTTO LE SCRITTE (versione 2, Figma "MacBook Pro 14_ - 15"): la
          // schermata e' trasparente e il canvas della home, dietro, disegna il simbolo #7243BD fino
          // a SIMBOLO_INTRO della sua misura finale, con i 4 simbolini bianchi sul bordo. Non servono
          // le immagini: il loop della vibrazione ridisegna il canvas, le tile sono a opacita' 0.
          cvs.style.opacity = '1';   // l'SVG resta trasparente: e' solo lo strato eventi
          startVibration();
          gsap.timeline()
            .fromTo(logoPace, { s: 0.15 }, { s: SIMBOLO_INTRO, duration: 0.9, ease: 'expo.out' })
            .fromTo(logoPace, { a: 0 }, { a: 1, duration: 0.4, ease: 'power1.out' }, '<')
            .fromTo(logoPace, { i: 0 }, { i: 1, duration: 0.4, ease: 'power1.out' }, 0.35);
          // uscita: come l'entrata ma verso l'ALTO (Roberto 23.09.26): .sept e poi le righe salgono
          // di 10 px sparendo, in sequenza. La chiama avviaHome.
          introEsci = () => gsap.timeline()
            .to(logo,  { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' })
            .to(righe, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in', stagger: 0.04 }, '-=0.22');
          gsap.timeline({ onComplete: resolve, delay: 0.15 })
            .to(logo, su)
            .to(righe, { ...su, stagger: 0.04 }, '-=0.2')
            .to({}, { duration: INTRO_SOSTA });
        }
        // il font arriva dopo il primo layout: si aspetta (al massimo 1 s) per spezzare le righe giuste
        const font = document.fonts && document.fonts.ready
          ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1000))]) : Promise.resolve();
        font.then(via);
      });
    }
    let introEsci = null;   // uscita delle scritte, preparata da introApertura
    const introFatta = introApertura();

    function revealAll() {
      if (revealed) return;
      revealed = true;
      // (23.09.26 "troppa attesa") l'entrata delle tile parte APPENA le immagini sono caricate, anche
      // se la schermata e' ancora in corso: nei primi ENTRATA_ANTICIPO s le tile sono trasparenti.
      // La fase 2 parte quando ci sono ENTRAMBE: schermata finita e anticipo trascorso.
      avviaHome();
      const anticipo = new Promise(r => gsap.delayedCall(ENTRATA_ANTICIPO, r));
      Promise.all([introFatta, anticipo]).then(faseDue);
    }
    // Le tile entrano come sempre (playEntry), ma con expo.inOut restano quasi trasparenti per
    // ~0.5 s dopo la partenza. Per farle VEDERE proprio quando il simbolo inizia la seconda
    // crescita (fase 2b, Roberto 23.09.26) l'entrata parte ENTRATA_ANTICIPO secondi prima, con le
    // scritte ancora ferme. Provate e scartate: opacita' separata e rapida + ritardi dimezzati (si
    // vedevano "i puntini delle immagini lontane").
    const ENTRATA_ANTICIPO = 0.8;    // 0.5: tile visibili a crescita finita · 0.95: giusto ma lasciava attesa (23.09.26)
    function avviaHome() {
      cvs.style.opacity = '1';
      startVibration();
      fitItems();
      playEntry();
      if (!breathingStarted) {
        breathingStarted = true;
        setTimeout(startBreathing, 3200 + ENTRATA_ANTICIPO * 1000);   // dopo l'entrata delle tile
      }
    }
    // FASE 2: le scritte escono salendo, i simbolini sfumano, il simbolo cresce fino alla forma del
    // collage mentre le tile iniziano a vedersi, poi il simbolo sfuma
    function faseDue() {
      document.body.classList.add('preloaded');   // CSS: ricompaiono menu e logo laterali
      const uscita = introEsci ? introEsci() : gsap.to(preloader, { opacity: 0, duration: 0.35 });
      gsap.to('#preload-pct', { opacity: 0, duration: 0.2 });
      uscita.eventCallback('onComplete', () => { preloader.remove(); });
      gsap.to(logoPace, { i: 0, duration: 0.3, ease: 'power1.in' });
      // "piu' fluido": expo.out fa quasi tutta la crescita nei primi ~0.25 s e poi si posa morbida.
      // Provate e scartate: 0.9 s power2.inOut, 0.5 s e 0.3 s power1.inOut ("quad": a scatto).
      gsap.to(logoPace, { s: 1, duration: 0.9, ease: 'expo.out' });
      // il simbolo sparisce mentre le immagini arrivano
      gsap.to(logoPace, { a: 0, duration: 1.2, ease: 'power1.inOut', delay: 0.3, overwrite: 'auto' });
    }

    // Precarica esattamente le immagini che finiscono nel collage, prese da `items`
    // (buildItems gira prima di qui). Oggi coincidono con tutto il pool
    // (images = 192, posizioni = 192 → COUNT = 192), quindi non si risparmia nulla;
    // serve a non regredire se un domani il pool diventa piu' grande delle
    // posizioni disponibili: in quel caso le immagini in eccesso non entrerebbero
    // nel collage e restare in attesa del loro download bloccherebbe il preloader.
    const preloadSrcs = items.map(it => it.src);
    const preloadTot  = preloadSrcs.length;
    // src → item, per agganciare a ogni tile la sua <img>: e' la sorgente da cui
    // il renderer canvas disegna, quindi queste <img> DEVONO restare in vita.
    const itemBySrc = {};
    for (const it of items) itemBySrc[it.src] = it;

    // Si scarica la variante SMALL (1.3 MB in tutto contro 7.5): e' quella che il canvas
    // disegna a riposo. `ratioMap` resta indicizzata sul path FULL, che e' quello che
    // fitItems() legge — l'aspetto delle due varianti coincide (make_pool_small.py rifiuta
    // un file che non conservi aspetto e alpha).
    // Le <img> restano referenziate da `it.img`: sul canvas sono la sorgente di ogni
    // drawImage, non si possono lasciare andare. `decode()` forza la bitmap subito, senza
    // bloccare il main thread ne' il preloader.
    for (let p = 0; p < preloadTot; p++) {
      (function(src) {
        const img = new Image();
        img.decoding = 'async';   // decodifica fuori dal main thread: meno blocco durante il load
        function settle() {
          loaded++;
          preloadPct.textContent = Math.round(loaded / preloadTot * 100) + '%';
          if (loaded >= preloadTot) revealAll();
        }
        img.onload = function() {
          if (img.naturalWidth && img.naturalHeight) {
            ratioMap[src] = img.naturalWidth / img.naturalHeight;
            const it = itemBySrc[src];
            if (it) it.img = img;          // sorgente del disegno sul canvas
          }
          if (img.decode) img.decode().then(settle, settle); else settle();
        };
        img.onerror = settle;
        img.src = smallSrc(src);
      })(preloadSrcs[p]);
    }

    // ── PRECARICO IN BACKGROUND, A PRELOADER FINITO ──────────────────────────────
    // Tutto quello che sta sotto la home ha `loading="lazy"`, cosi' non ruba banda alle tile
    // del collage durante il caricamento. Ma da solo "lazy" vuol dire che l'immagine parte
    // quando te la trovi addosso, e si vedeva arrivare mentre scorrevi. Qui la si scarica in
    // anticipo nella CACHE HTTP: quando poi la sezione entra, l'<img> lazy la prende dal disco
    // ed e' istantanea.
    // Ordine = ordine in cui le incontri scorrendo (Brands, Space, Campaigns, la gif di About),
    // e per ultime le 700 px della home, che servono solo se entri in zoom.
    // Solo download: niente decodifica e niente riferimenti vivi, quindi zero memoria.
    (function warmBelowTheFold() {
      // `?debug=1&fx=nowarm`: niente precarico. Su Safari `requestIdleCallback` non esiste e si
      // ripiega su setTimeout: una richiesta ogni 60 ms per ~230 file, che continua mentre
      // scorri. E' uno dei sospetti per i frame persi.
      if (/[?&]debug=1/.test(location.search) && /[?&]fx=[^&]*nowarm/.test(location.search)) return;
      const conn = navigator.connection;
      if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return;

      const later = [];
      // 1. card dei brand (3.1 MB in tutto dopo shrink_images.py): sono le prime che incontri
      const brandFolders = window.__septBrandFolders || [];
      for (let i = 0; i < brandFolders.length; i++) {
        later.push('assets/brands_img/' + encodeURIComponent(brandFolders[i]) + '/img_1.webp');
      }
      // 2. immagini delle altre pagine (strip Space, About, cover di Organic Noise). (23.09.26) Prima
      //    si leggevano dal DOM, quando tutte le sezioni stavano qui; ora sono in altre pagine,
      //    quindi si scarica il loro HTML e se ne leggono le <img>: nessuna lista da tenere a mano.
      //    Le campagne restano fuori: le loro immagini sono nell'array di campaigns.js.
      const PAGINE = ['about.html', 'space.html', 'organic-noise.html', 'contact.html'];
      const daPagine = Promise.all(PAGINE.map(p => fetch(p)
        .then(r => r.text())
        .then(t => [...new DOMParser().parseFromString(t, 'text/html').querySelectorAll('img')]
          .map(im => im.getAttribute('src')).filter(Boolean))
        .catch(() => [])));

      let i = 0;
      function next() {
        if (i >= later.length) return;
        fetch(later[i++], { cache: 'force-cache', priority: 'low' })
          .then(r => r.blob())      // consumare il body chiude la richiesta
          .catch(() => {})
          .then(() => {
            if ('requestIdleCallback' in window) requestIdleCallback(next, { timeout: 800 });
            else setTimeout(next, 60);
          });
      }
      const start = () => daPagine.then(liste => {
        later.push(...[].concat(...liste));
        // 3. pool a 700 px: serve solo in zoom
        later.push(...items.map(it => it.src));
        if ('requestIdleCallback' in window) requestIdleCallback(next, { timeout: 2000 }); else setTimeout(next, 800);
      });
      if (document.body.classList.contains('preloaded')) start();
      else {
        const mo = new MutationObserver(() => {
          if (document.body.classList.contains('preloaded')) { mo.disconnect(); start(); }
        });
        mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      }
    })();
  })();
