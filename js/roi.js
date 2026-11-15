/* ROI — rhizomatic field
   The thin red circles (ages) never move. The field of words moves beneath them.
   Drag to travel. On release the field keeps gliding with your momentum and eases out,
   then settles so the nearest word is the centre. Words use the site's fonts, at random.
   Projects: one sample panel on hover/focus; click the centred project to open its PDF.
   Positions are placeholders — Ayelet places them.
*/
(() => {
  const W = [
    { t: 'Biology',       x: -300, y: -170, k: 'region' },
    { t: 'Governance',    x:  320, y: -190, k: 'region' },
    { t: 'Communication', x: -270, y:  200, k: 'region' },
    { t: 'Freedom',       x:  330, y:  180, k: 'region' },
    { t: 'Vaccine Futures',     x:  -60, y: -230, k: 'proj', img: 'assets/img/gn-13-petri-dish.jpg',  pdf: 'assets/pdf/vaccine-futures.pdf', note: 'graphic novel' },
    { t: 'Opt-Out Society',     x:   10, y: -110, k: 'proj', img: 'assets/img/gn-09-opt-out-kit.jpg', pdf: 'assets/pdf/opt-out-society.pdf', note: 'speculative design' },
    { t: 'Frequencies',         x:   40, y:   90, k: 'proj', img: 'assets/img/proj-frequencies.jpg',  pdf: 'assets/pdf/frequencies.pdf', note: 'data viz' },
    { t: 'Urban Healing',       x: -470, y:   10, k: 'proj', img: 'assets/img/proj-urban-healing.jpg', pdf: 'assets/pdf/urban-healing.pdf', note: 'ecology' },
    { t: 'In the Zone',         x:  180, y:  310, k: 'proj', img: 'assets/img/proj-in-the-zone.jpg',  pdf: 'assets/pdf/in-the-zone.pdf', note: 'thesis' },
    { t: 'Learn not Confirm',   x: -120, y:  330, k: 'proj', img: 'assets/img/proj-resonance.jpg',    pdf: 'assets/pdf/learn-not-confirm.pdf', note: 'system' },
    { t: 'Calculating Empires', x:  170, y: -350, k: 'proj', img: 'assets/img/proj-calculating-empires.jpg', pdf: 'assets/pdf/calculating-empires.pdf', note: 'essay' },
    { t: 'This and That',       x: -480, y: -330, k: 'proj', img: 'assets/img/proj-this-and-that.jpg', pdf: 'assets/pdf/this-and-that.pdf', note: 'future burial' },
    { t: 'Peres Center',        x:  520, y:  -20, k: 'proj', img: 'assets/img/proj-peres.jpg', pdf: null, note: 'lab · client deck held back' },
    // personal regions: life, not school (approved: cat & creature, me & walking). Click opens the photo.
    { t: 'the cat',      x: -620, y:  260, k: 'proj life', img: 'assets/img/life-cat.jpg',          pdf: 'assets/img/life-cat.jpg', note: 'life' },
    { t: 'found creature', x: -380, y: -470, k: 'proj life', img: 'assets/img/life-creature.jpg',   pdf: 'assets/img/life-creature.jpg', note: 'life · biology' },
    { t: 'walking',      x:  560, y:  380, k: 'proj life', img: 'assets/img/life-walking.jpg',      pdf: 'assets/img/life-walking.jpg', note: 'life · freedom' },
    { t: 'on the rock',  x:  430, y:  520, k: 'proj life', img: 'assets/img/life-walking-rock.jpg', pdf: 'assets/img/life-walking-rock.jpg', note: 'life · freedom' },
    { t: 'landscape',    x:  680, y:  140, k: 'proj life', img: 'assets/img/life-landscape.jpg',    pdf: 'assets/img/life-landscape.jpg', note: 'life' },
    { t: 'me, garden',   x: -640, y: -120, k: 'proj life', img: 'assets/img/life-me-garden.jpg',    pdf: 'assets/img/life-me-garden.jpg', note: 'me' },
    { t: 'me, mirror',   x: -150, y:  520, k: 'proj life', img: 'assets/img/life-me-mirror.jpg',    pdf: 'assets/img/life-me-mirror.jpg', note: 'me · communication' },
  ];
  const FACES = Stretch.FACES;
  const field = document.getElementById('field'), layer = document.getElementById('layer');
  const panel = document.getElementById('panel'), pImg = document.getElementById('panel-img'), pTitle = document.getElementById('panel-title'),
        pLink = document.getElementById('panel-link'), pAct = document.getElementById('panel-act'), centre = document.getElementById('centre');
  let off = { x: 0, y: 0 }, focused = null, raf = 0;

  W.forEach(w => {
    const d = document.createElement('span'), fc = FACES[Math.floor(Math.random() * FACES.length)];
    d.className = 'w ' + w.k; d.textContent = w.t; d.style.left = w.x + 'px'; d.style.top = w.y + 'px';
    d.style.fontFamily = `"${fc.f}"`; d.style.fontWeight = fc.w; d.style.fontStyle = fc.s;
    d.addEventListener('click', () => { if (dragged) return; if (w === focused && w.pdf) open(w.pdf, '_blank', 'noopener'); else glideTo(w); });
    d.addEventListener('mouseenter', () => show(w)); d.addEventListener('mouseleave', () => show(focused));
    w.el = d; layer.appendChild(d);
  });

  function show(w) {
    if (!w || !w.k.startsWith('proj')) { panel.classList.remove('on'); return; }
    pImg.src = w.img; pTitle.textContent = `${w.t} — ${w.note}`;
    if (w.pdf) { pLink.href = w.pdf; pAct.textContent = w.k.includes('life') ? 'open photo ↗' : 'open pdf ↗'; } else { pLink.removeAttribute('href'); pAct.textContent = 'not public'; }
    panel.classList.add('on');
  }
  function nearest() {
    let best = null, bd = Infinity;
    W.forEach(w => { const dx = w.x + off.x, dy = w.y + off.y, dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; best = w; } });
    return best;
  }
  function render() {
    layer.style.transform = `translate(${off.x}px,${off.y}px)`;
    W.forEach(w => w.el.style.opacity = Math.max(.25, 1 - Math.hypot(w.x + off.x, w.y + off.y) / 650));
    const b = nearest();
    if (b !== focused) { focused = b; W.forEach(w => w.el.classList.toggle('focus', w === b)); centre.textContent = b.t; show(b); }
  }
  // ease the field so a word sits at the centre (cubic ease-out)
  function glideTo(w, ms = 700) {
    cancelAnimationFrame(raf);
    const from = { ...off }, to = { x: -w.x, y: -w.y }, t0 = performance.now();
    const step = now => { const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      off = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e }; render(); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }
  // momentum after release: velocity decays (ease-out), then settle on the nearest word
  function coast(vx, vy) {
    cancelAnimationFrame(raf);
    let last = performance.now();
    const step = now => {
      const dt = Math.min(32, now - last) / 16.7; last = now;
      off.x += vx * dt; off.y += vy * dt; const k = Math.pow(0.92, dt); vx *= k; vy *= k; render();
      if (Math.hypot(vx, vy) > 0.4) raf = requestAnimationFrame(step); else glideTo(nearest(), 500);
    };
    raf = requestAnimationFrame(step);
  }

  let start = null, dragged = false, hist = [];
  field.addEventListener('pointerdown', e => {
    if (panel.contains(e.target)) return;
    cancelAnimationFrame(raf); start = { x: e.clientX - off.x, y: e.clientY - off.y }; dragged = false; hist = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
  });
  field.addEventListener('pointermove', e => {
    if (!start) return;
    const nx = e.clientX - start.x, ny = e.clientY - start.y;
    if (!dragged && Math.hypot(nx - off.x, ny - off.y) > 3) { dragged = true; field.classList.add('drag'); field.setPointerCapture(e.pointerId); }
    if (!dragged) return;
    off = { x: nx, y: ny }; render();
    hist.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (hist.length > 6) hist.shift();
  });
  const end = () => {
    if (!start) return; start = null; field.classList.remove('drag');
    if (dragged && hist.length > 1) {
      const a = hist[0], b = hist[hist.length - 1], dt = Math.max(1, b.t - a.t) / 16.7;
      coast((b.x - a.x) / dt, (b.y - a.y) / dt);
    }
    setTimeout(() => dragged = false, 0);
  };
  field.addEventListener('pointerup', end); field.addEventListener('pointercancel', end);
  addEventListener('keydown', e => {
    const dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!dir || !focused) return;
    const c = W.filter(w => w !== focused && ((w.x - focused.x) * dir[0] + (w.y - focused.y) * dir[1]) > 0)
               .sort((a, b) => Math.hypot(a.x - focused.x, a.y - focused.y) - Math.hypot(b.x - focused.x, b.y - focused.y));
    if (c.length) glideTo(c[0]);
  });
  off = { x: -W[0].x, y: -W[0].y }; render();
})();
