/* ROI — rhizomatic field
   Thin red circles (ages) stay centred. The field moves beneath them: drag, release → glide + ease-out → settle.
   Regions are words (random faces from the title family). Projects and pieces of life are red dots placed in their regions.
   Hover/click a dot → a thumbnail eases in (title + year beneath). Click the thumbnail → gallery.
   Positions are placeholders for Ayelet to adjust.
*/
(() => {
  const REGIONS = [
    { t: 'Biology', x: -300, y: -170 }, { t: 'Governance', x: 320, y: -190 },
    { t: 'Communication', x: -270, y: 200 }, { t: 'Freedom', x: 330, y: 180 },
  ];
  const g = (dir, n, ext = 'jpg') => Array.from({ length: n }, (_, i) => `assets/gallery/${dir}/p-${String(i + 1).padStart(n > 9 ? 2 : 1, '0')}.${ext}`);
  const P = [
    { t: 'Vaccine Futures', y_: 2026, x: -220, y: -270, thumb: 'vaccine-futures', note: 'graphic novel', gal: Array.from({ length: 32 }, (_, i) => `assets/gallery/vaccine-futures/p-${String(i + 1).padStart(2, '0')}.jpg`), pdf: 'assets/pdf/vaccine-futures.pdf' },
    { t: 'This and That', y_: 2025, x: -430, y: -250, thumb: 'this-and-that', note: 'future burial', gal: g('this-and-that', 21), pdf: 'assets/pdf/this-and-that.pdf' },
    { t: 'Opt-Out Society', y_: 2026, x: 110, y: -150, thumb: 'opt-out-society', note: 'speculative design', gal: g('opt-out-society', 5), pdf: 'assets/pdf/opt-out-society.pdf' },
    { t: 'Calculating Empires', y_: 2026, x: 240, y: -320, type: true, note: 'essay', gal: g('calculating-empires', 1), pdf: 'assets/pdf/calculating-empires.pdf' },
    { t: 'Peres Center', y_: 2026, x: 450, y: -80, thumb: 'peres', note: 'lab · client deck, not public', gal: null },
    { t: 'Frequencies', y_: 2025, x: -40, y: 130, thumb: 'frequencies', note: 'data viz', gal: g('frequencies', 9), pdf: 'assets/pdf/frequencies.pdf' },
    { t: 'Learn not Confirm', y_: 2025, x: -340, y: 330, thumb: 'learn-not-confirm', note: 'system', gal: g('learn-not-confirm', 7), pdf: 'assets/pdf/learn-not-confirm.pdf' },
    { t: 'Urban Healing', y_: 2026, x: -460, y: 30, thumb: 'urban-healing', note: 'ecology', gal: g('urban-healing', 10), pdf: 'assets/pdf/urban-healing.pdf' },
    { t: 'In the Zone', y_: 2026, x: 210, y: 310, type: true, note: 'thesis', gal: g('in-the-zone', 16), pdf: 'assets/pdf/in-the-zone.pdf' },
    // life
    { t: 'found creature', y_: 2025, x: -380, y: -60, thumb: 'life-creature', life: true, gal: ['assets/img/life-creature.jpg'] },
    { t: 'the cat', y_: 2024, x: -560, y: 240, thumb: 'life-cat', life: true, gal: ['assets/img/life-cat.jpg'] },
    { t: 'me, garden', y_: 2026, x: -570, y: -110, thumb: 'life-me-garden', life: true, gal: ['assets/img/life-me-garden.jpg'] },
    { t: 'me, mirror', y_: 2026, x: -140, y: 300, thumb: 'life-me-mirror', life: true, gal: ['assets/img/life-me-mirror.jpg'] },
    { t: 'walking', y_: 2026, x: 460, y: 280, thumb: 'life-walking', life: true, gal: ['assets/img/life-walking.jpg'] },
    { t: 'on the rock', y_: 2026, x: 390, y: 390, thumb: 'life-walking-rock', life: true, gal: ['assets/img/life-walking-rock.jpg'] },
    { t: 'landscape', y_: 2024, x: 540, y: 110, thumb: 'life-landscape', life: true, gal: ['assets/img/life-landscape.jpg'] },
  ];
  const FACES = Stretch.FACES, rand = a => a[Math.floor(Math.random() * a.length)];
  const field = document.getElementById('field'), layer = document.getElementById('layer'), centre = document.getElementById('centre');
  const card = document.getElementById('card');
  let off = { x: 0, y: 0 }, focused = null, raf = 0, open = null;

  // regions: words in random faces
  REGIONS.forEach(r => {
    const d = document.createElement('span'), fc = rand(FACES);
    d.className = 'w'; d.textContent = r.t; d.style.left = r.x + 'px'; d.style.top = r.y + 'px';
    d.style.fontFamily = `"${fc.f}"`; d.style.fontWeight = fc.w; d.style.fontStyle = fc.s;
    d.addEventListener('click', () => { if (!dragged) glideTo(r); });
    r.el = d; layer.appendChild(d);
  });
  // projects: dots
  P.forEach(p => {
    const d = document.createElement('button');
    d.className = 'dot' + (p.life ? ' life' : ''); d.style.left = p.x + 'px'; d.style.top = p.y + 'px';
    d.setAttribute('aria-label', `${p.t}, ${p.y_}`);
    d.innerHTML = `<span class="lbl">${p.t}</span>`;
    d.addEventListener('mouseenter', () => showCard(p));
    d.addEventListener('click', e => { e.stopPropagation(); if (dragged) return; open === p ? openGallery(p) : showCard(p, true); });
    p.el = d; layer.appendChild(d);
  });

  // ── thumbnail card: eases in from the dot
  function showCard(p, sticky) {
    open = p;
    const r = p.el.getBoundingClientRect(), fr = field.getBoundingClientRect();
    let x = r.left - fr.left + 18, y = r.top - fr.top + 18;
    const W = Math.min(340, fr.width * .6), H = W * .75 + 70;
    if (x + W > fr.width - 12) x = r.left - fr.left - W - 18;
    if (y + H > fr.height - 12) y = r.top - fr.top - H - 6;
    card.style.width = W + 'px'; card.style.left = Math.max(12, x) + 'px'; card.style.top = Math.max(12, y) + 'px';
    card.style.transformOrigin = `${r.left - fr.left - Math.max(12, x)}px ${r.top - fr.top - Math.max(12, y)}px`;
    const media = p.type
      ? `<div class="type" id="cardtype"></div>`
      : `<img src="assets/thumbs/${p.thumb}.jpg" alt="">`;
    card.innerHTML = `<div class="media">${media}</div>
      <div class="cap"><h3>${p.t}</h3><span class="yr">${p.y_}</span></div>
      <div class="sub">${p.note ? p.note + ' · ' : ''}${p.gal ? (p.gal.length > 1 ? `view ${p.gal.length} pages →` : 'view →') : 'not public'}</div>`;
    if (p.type) Stretch.make(card.querySelector('#cardtype'), p.t.replace(/\s/g, '').toUpperCase().slice(0, 8), [3, 2, 4, 2, 3, 2, 4, 3], { every: 1300, hover: false });
    card.classList.remove('on'); void card.offsetWidth; card.classList.add('on');
    card.onclick = () => openGallery(p);
  }
  field.addEventListener('pointerdown', e => { if (!card.contains(e.target) && !e.target.closest('.dot')) card.classList.remove('on'), open = null; });

  // ── gallery
  const gal = document.getElementById('gallery'), gImg = document.getElementById('g-img'), gT = document.getElementById('g-title'),
        gN = document.getElementById('g-n'), gPdf = document.getElementById('g-pdf');
  let gp = null, gi = 0;
  function openGallery(p) {
    if (!p.gal) return;
    gp = p; gi = 0; gT.textContent = `${p.t} — ${p.y_}`;
    if (p.pdf) { gPdf.href = p.pdf; gPdf.hidden = false; } else gPdf.hidden = true;
    gal.hidden = false; requestAnimationFrame(() => gal.classList.add('on')); showPage();
  }
  function showPage() { gImg.classList.remove('in'); gImg.onload = () => gImg.classList.add('in'); gImg.src = gp.gal[gi]; gN.textContent = `${gi + 1} / ${gp.gal.length}`; }
  const step = d => { if (!gp) return; gi = (gi + d + gp.gal.length) % gp.gal.length; showPage(); };
  const closeG = () => { gal.classList.remove('on'); setTimeout(() => gal.hidden = true, 350); gp = null; };
  document.getElementById('g-prev').onclick = () => step(-1);
  document.getElementById('g-next').onclick = () => step(1);
  document.getElementById('g-close').onclick = closeG;
  gImg.onclick = () => step(1);
  addEventListener('keydown', e => { if (!gp) return; if (e.key === 'Escape') closeG(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });

  // ── field motion
  const ALL = REGIONS.concat(P);
  const nearest = () => { let b = null, bd = Infinity; REGIONS.forEach(w => { const d = (w.x + off.x) ** 2 + (w.y + off.y) ** 2; if (d < bd) { bd = d; b = w; } }); return b; };
  function render() {
    layer.style.transform = `translate(${off.x}px,${off.y}px)`;
    ALL.forEach(w => w.el.style.opacity = Math.max(.3, 1 - Math.hypot(w.x + off.x, w.y + off.y) / 700));
    const b = nearest();
    if (b !== focused) { focused = b; REGIONS.forEach(w => w.el.classList.toggle('focus', w === b)); centre.textContent = b.t; }
  }
  function glideTo(w, ms = 700) {
    cancelAnimationFrame(raf); card.classList.remove('on'); open = null;
    const from = { ...off }, to = { x: -w.x, y: -w.y }, t0 = performance.now();
    const f = now => { const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      off = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e }; render(); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
  }
  function coast(vx, vy) {
    cancelAnimationFrame(raf); let last = performance.now();
    const f = now => { const dt = Math.min(32, now - last) / 16.7; last = now;
      off.x += vx * dt; off.y += vy * dt; const k = Math.pow(0.92, dt); vx *= k; vy *= k; render();
      if (Math.hypot(vx, vy) > 0.4) raf = requestAnimationFrame(f); else glideTo(nearest(), 500); };
    raf = requestAnimationFrame(f);
  }
  let start = null, dragged = false, hist = [];
  field.addEventListener('pointerdown', e => {
    if (card.contains(e.target)) return;
    cancelAnimationFrame(raf); start = { x: e.clientX - off.x, y: e.clientY - off.y }; dragged = false; hist = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
  });
  field.addEventListener('pointermove', e => {
    if (!start) return;
    const nx = e.clientX - start.x, ny = e.clientY - start.y;
    if (!dragged && Math.hypot(nx - off.x, ny - off.y) > 3) { dragged = true; field.classList.add('drag'); field.setPointerCapture(e.pointerId); card.classList.remove('on'); open = null; }
    if (!dragged) return;
    off = { x: nx, y: ny }; render(); hist.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (hist.length > 6) hist.shift();
  });
  const end = () => {
    if (!start) return; start = null; field.classList.remove('drag');
    if (dragged && hist.length > 1) { const a = hist[0], b = hist[hist.length - 1], dt = Math.max(1, b.t - a.t) / 16.7; coast((b.x - a.x) / dt, (b.y - a.y) / dt); }
    setTimeout(() => dragged = false, 0);
  };
  field.addEventListener('pointerup', end); field.addEventListener('pointercancel', end);
  off = { x: -REGIONS[0].x, y: -REGIONS[0].y }; render();
})();
