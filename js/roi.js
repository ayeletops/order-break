/* ROI — a vast latent field of interests.
   Four regions branch into fields and terms (a rhizome, not a tree: terms link across regions).
   Hybrid zones sit where regions meet. Projects (red dots) and pieces of life (hollow dots) sit near what they're about.
   The thin red circles (ages) stay centred; the field moves under them.
   Drag to travel (release → glide, ease-out, settle on the nearest word). Wheel / pinch to zoom.
   Every point carries a breathing target grid; the point nearest the centre is chosen and its target grows.
   Projects: larger red dots with a year. Click → centre + thumbnail; click again / thumbnail → gallery (a window).
*/
(() => {
  // ── the field: region → fields → terms. Angles in degrees around the region, radii in px.
  const TREE = {
    Biology: { at: [-1150, -700], fields: {
      Microbiology: ['bacteria', 'quorum sensing', 'biofilms', 'phages', 'the microbiome'],
      'Immune system': ['antibodies', 'autoimmunity', 'herd immunity', 'inflammation', 'tolerance'],
      Epidemiology: ['contagion', 'outbreak maps', 'R₀', 'vectors', 'zoonosis'],
      Biomimicry: ['mycelium', 'swarm logic', 'self-repair', 'living materials'],
      'Death & decay': ['bones', 'compost', 'burial futures', 'the luz bone'],
      Genetics: ['mRNA', 'CRISPR', 'inheritance', 'mutation'] } },
    Governance: { at: [1200, -650], fields: {
      'Public health': ['mandates', 'vaccine passports', 'treaties', 'triage'],
      Surveillance: ['dashboards', 'biometrics', 'tracking', 'the archive'],
      Territory: ['borders', 'checkpoints', 'maps', 'settlement'],
      'Spectrum law': ['frequency allocation', 'licences', 'jamming', 'pirate radio'],
      'Data sovereignty': ['consent forms', 'platforms', 'ownership', 'calculating empires'],
      'Urban planning': ['zoning', 'density', 'green roofs', 'shelters'] } },
    Communication: { at: [-1100, 720], fields: {
      Signals: ['radio', 'electromagnetic waves', 'noise', 'interference'],
      Media: ['broadcast', 'the cut', 'continuity', 'montage'],
      'Echo chambers': ['confirmation', 'resonance', 'dissonance', 'algorithms'],
      Language: ['translation', 'Hebrew / English', 'naming', 'silence'],
      'Visual culture': ['iconography', 'Panofsky', 'propaganda', 'the screen'],
      Interfaces: ['typography', 'grids', 'defaults', 'the prompt'] } },
    Freedom: { at: [1150, 700], fields: {
      Autonomy: ['opting out', 'refusal', 'bodily autonomy', 'self-care'],
      Privacy: ['encryption', 'redaction', 'anonymity', 'secrets'],
      Flow: ['the zone', 'immersion', 'colour', 'attention'],
      Healing: ['gardens', 'ritual', 'cities', 'repair'],
      Play: ['DIY labs', 'hacking', 'hackathons', 'improvisation'] } },
  };
  const HYBRIDS = [
    ['Biopolitics', 'Biology', 'Governance'], ['Contagion of ideas', 'Biology', 'Communication'],
    ['Bodily autonomy', 'Biology', 'Freedom'], ['Electromagnetic colonialism', 'Governance', 'Communication'],
    ['The right to opt out', 'Governance', 'Freedom'], ['Free radio', 'Communication', 'Freedom'],
    ['Invisible systems', null, null],   // the middle of everything
  ];
  const g = (dir, n) => Array.from({ length: n }, (_, i) => `assets/gallery/${dir}/p-${String(i + 1).padStart(n > 9 ? 2 : 1, '0')}.jpg`);
  // projects sit next to a term (by name) with a small offset
  const P = [
    { t: 'Vaccine Futures', y_: 2026, near: 'herd immunity', thumb: 'vaccine-futures', note: 'graphic novel', gal: Array.from({ length: 32 }, (_, i) => `assets/gallery/vaccine-futures/p-${String(i + 1).padStart(2, '0')}.jpg`), pdf: 'assets/pdf/vaccine-futures.pdf' },
    { t: 'This and That', y_: 2025, near: 'burial futures', thumb: 'this-and-that', note: 'future burial', gal: g('this-and-that', 21), pdf: 'assets/pdf/this-and-that.pdf' },
    { t: 'Opt-Out Society', y_: 2026, near: 'The right to opt out', thumb: 'opt-out-society', note: 'speculative design', gal: g('opt-out-society', 5), pdf: 'assets/pdf/opt-out-society.pdf' },
    { t: 'Calculating Empires', y_: 2026, near: 'calculating empires', type: true, note: 'essay', gal: g('calculating-empires', 1), pdf: 'assets/pdf/calculating-empires.pdf' },
    { t: 'Peres Center', y_: 2026, near: 'the archive', thumb: 'peres', note: 'lab · client deck, not public', gal: null },
    { t: 'Frequencies', y_: 2025, near: 'Electromagnetic colonialism', thumb: 'frequencies', note: 'data viz', gal: g('frequencies', 9), pdf: 'assets/pdf/frequencies.pdf' },
    { t: 'Learn not Confirm', y_: 2025, near: 'resonance', thumb: 'learn-not-confirm', note: 'system', gal: g('learn-not-confirm', 7), pdf: 'assets/pdf/learn-not-confirm.pdf' },
    { t: 'Urban Healing', y_: 2026, near: 'cities', thumb: 'urban-healing', note: 'ecology', gal: g('urban-healing', 10), pdf: 'assets/pdf/urban-healing.pdf' },
    { t: 'In the Zone', y_: 2026, near: 'the zone', type: true, note: 'thesis', gal: g('in-the-zone', 16), pdf: 'assets/pdf/in-the-zone.pdf' },
  ];
  // cross-links: the rhizome (terms that talk across regions)
  const LINKS = [['quorum sensing', 'swarm logic'], ['herd immunity', 'mandates'], ['contagion', 'algorithms'], ['radio', 'pirate radio'],
    ['frequency allocation', 'electromagnetic waves'], ['the archive', 'redaction'], ['encryption', 'secrets'], ['the zone', 'colour'],
    ['mycelium', 'living materials'], ['burial futures', 'ritual'], ['defaults', 'the prompt'], ['dashboards', 'outbreak maps'],
    ['consent forms', 'opting out'], ['resonance', 'confirmation'], ['green roofs', 'gardens'], ['the cut', 'continuity'], ['mRNA', 'vaccine passports']];

  // ── build nodes deterministically
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(8);
  const N = [];   // {t, x, y, lv}
  const byName = {};
  const add = (t, x, y, lv) => { const n = { t, x, y, lv }; N.push(n); byName[t] = n; return n; };
  Object.entries(TREE).forEach(([R, def]) => {
    const [rx, ry] = def.at, reg = add(R, rx, ry, 0);
    const fs = Object.entries(def.fields), base = Math.atan2(-ry, -rx);   // fan the fields away from the centre... and around
    fs.forEach(([F, terms], i) => {
      const a = base + Math.PI + (i - (fs.length - 1) / 2) * (Math.PI * 1.7 / fs.length) + (rnd() - .5) * .25;
      const fr = 360 + rnd() * 120, fx = rx + Math.cos(a) * fr, fy = ry + Math.sin(a) * fr;
      const f = add(F, fx, fy, 1); f.parent = reg;
      terms.forEach((T, j) => {
        const b = a + (j - (terms.length - 1) / 2) * .55 + (rnd() - .5) * .3, tr = 150 + rnd() * 90;
        const t = add(T, fx + Math.cos(b) * tr, fy + Math.sin(b) * tr, 2); t.parent = f;
      });
    });
  });
  HYBRIDS.forEach(([t, a, b]) => {
    if (!a) return add(t, 0, 0, 0.5);
    const A = byName[a], B = byName[b]; add(t, (A.x + B.x) / 2 + (rnd() - .5) * 140, (A.y + B.y) / 2 + (rnd() - .5) * 140, 0.5);
  });
  P.forEach(p => { const n = byName[p.near] || { x: 0, y: 0 }; const a = rnd() * 6.283; p.x = n.x + Math.cos(a) * 46; p.y = n.y + Math.sin(a) * 46; });

  // ── render: every point is a dot with its own target grid (8 rings, ages) and a label
  const FACES = Stretch.FACES, rand = a => a[Math.floor(Math.random() * a.length)];
  const AGES = Stretch.weights('ages');
  const field = document.getElementById('field'), layer = document.getElementById('layer'), centre = document.getElementById('centre'), card = document.getElementById('card');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'links'); svg.setAttribute('viewBox', '-3000 -2000 6000 4000'); layer.appendChild(svg);
  const line = (a, b, cls) => { const l = document.createElementNS(svg.namespaceURI, 'line');
    l.setAttribute('x1', a.x); l.setAttribute('y1', a.y); l.setAttribute('x2', b.x); l.setAttribute('y2', b.y); l.setAttribute('class', cls); svg.appendChild(l); };
  N.forEach(n => { if (n.parent) line(n.parent, n, 'tree'); });
  LINKS.forEach(([a, b]) => { if (byName[a] && byName[b]) line(byName[a], byName[b], 'rhizome'); });
  const rings = () => AGES.map((r, i) => `<i style="--r:${r}%;--dur:${5 + (i % 4) * 1.3}s;--dl:${-(i * .7 + Math.random() * 3).toFixed(2)}s"></i>`).join('');
  function node(n, cls, label) {
    const d = document.createElement('div'); d.className = 'n ' + cls; d.style.left = n.x + 'px'; d.style.top = n.y + 'px';
    d.innerHTML = `<div class="tg">${rings()}</div><button class="dt" aria-label="${n.t}"></button><span class="lb">${label}</span>`;
    n.el = d; layer.appendChild(d); return d;
  }
  N.forEach(n => {
    const d = node(n, 'lv' + String(n.lv).replace('.', ''), n.t);
    d.addEventListener('click', () => { if (!dragged) glideTo(n); });
    d.querySelector('.lb').addEventListener('mouseenter', e => showDef(n, e.currentTarget));
    d.querySelector('.lb').addEventListener('mouseleave', hideDef);
  });
  P.forEach(p => {
    const d = node(p, 'proj', `<b>${p.t}</b>${p.y_}`);
    d.querySelector('.dt').addEventListener('mouseenter', () => showCard(p));
    d.addEventListener('click', e => { e.stopPropagation(); if (dragged) return; if (open === p) openGallery(p); else { glideTo(p); setTimeout(() => showCard(p), 760); } });
  });

  // ── dictionary pop-up
  const def = document.getElementById('def');
  function showDef(n, el) {
    const e = (window.DICT || {})[n.t]; if (!e || dragged) return;
    def.innerHTML = `<b>${n.t}</b> <i>${e[0]}</i><span>${e[1]}</span>`;
    const r = el.getBoundingClientRect(), fr = field.getBoundingClientRect();
    let x = r.left - fr.left, y = r.bottom - fr.top + 10;
    if (x + 300 > fr.width - 12) x = fr.width - 312; if (y + 120 > fr.height) y = r.top - fr.top - 130;
    def.style.left = Math.max(12, x) + 'px'; def.style.top = Math.max(12, y) + 'px';
    def.classList.remove('on'); void def.offsetWidth; def.classList.add('on');
  }
  function hideDef() { def.classList.remove('on'); }

  // ── thumbnail card
  let open = null;
  function showCard(p) {
    open = p;
    const r = p.el.querySelector('.dt').getBoundingClientRect(), fr = field.getBoundingClientRect();
    const W = Math.min(340, fr.width * .6), H = W * .75 + 74;
    let x = r.left - fr.left + 20, y = r.top - fr.top + 20;
    if (x + W > fr.width - 12) x = r.left - fr.left - W - 20;
    if (y + H > fr.height - 12) y = r.top - fr.top - H - 8;
    x = Math.max(12, x); y = Math.max(12, y);
    Object.assign(card.style, { width: W + 'px', left: x + 'px', top: y + 'px', transformOrigin: `${r.left - fr.left - x}px ${r.top - fr.top - y}px` });
    card.innerHTML = `<div class="media">${p.type ? '<div class="type" id="cardtype"></div>' : `<img src="assets/thumbs/${p.thumb}.jpg" alt="">`}</div>
      <div class="cap"><h3>${p.t}</h3><span class="yr">${p.y_}</span></div>
      <div class="sub">${p.note ? p.note + ' · ' : ''}${p.gal ? (p.gal.length > 1 ? `view ${p.gal.length} pages →` : 'view →') : 'not public'}</div>`;
    if (p.type) Stretch.make(card.querySelector('#cardtype'), p.t.replace(/\s/g, '').toUpperCase().slice(0, 8), [3, 2, 4, 2, 3, 2, 4, 3], { every: 1300, hover: false });
    card.classList.remove('on'); void card.offsetWidth; card.classList.add('on'); card.onclick = () => openGallery(p);
  }
  const hideCard = () => { card.classList.remove('on'); open = null; };

  // ── gallery
  const gal = document.getElementById('gallery'), gImg = document.getElementById('g-img'), gT = document.getElementById('g-title'), gN = document.getElementById('g-n'), gPdf = document.getElementById('g-pdf');
  let gp = null, gi = 0;
  function openGallery(p) { if (!p.gal) return; gp = p; gi = 0; gT.textContent = `${p.t} — ${p.y_}`;
    if (p.pdf) { gPdf.href = p.pdf; gPdf.hidden = false; } else gPdf.hidden = true;
    gal.hidden = false; requestAnimationFrame(() => gal.classList.add('on')); showPage(); }
  function showPage() { gImg.classList.remove('in'); gImg.onload = () => gImg.classList.add('in'); gImg.src = gp.gal[gi]; gN.textContent = `${gi + 1} / ${gp.gal.length}`; }
  const step = d => { if (!gp) return; gi = (gi + d + gp.gal.length) % gp.gal.length; showPage(); };
  const closeG = () => { gal.classList.remove('on'); setTimeout(() => gal.hidden = true, 350); gp = null; };
  document.getElementById('g-prev').onclick = () => step(-1); document.getElementById('g-next').onclick = () => step(1);
  document.getElementById('g-close').onclick = closeG; gImg.onclick = () => step(1);
  gal.addEventListener('click', e => { if (e.target === gal) closeG(); });
  addEventListener('keydown', e => { if (!gp) return; if (e.key === 'Escape') closeG(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });

  // ── motion: pan + zoom
  let off = { x: 0, y: 0 }, z = .8, focused = null, raf = 0;
  const ALL = N.concat(P);
  const nearest = () => { let b = null, bd = Infinity; ALL.forEach(n => { const d = (n.x * z + off.x) ** 2 + (n.y * z + off.y) ** 2; if (d < bd) { bd = d; b = n; } }); return b; };
  function render() {
    layer.style.transform = `translate(${off.x}px,${off.y}px) scale(${z})`;
    const fade = 520 / Math.max(.4, z);
    ALL.forEach(n => n.el.style.opacity = Math.max(.12, 1 - Math.hypot(n.x + off.x / z, n.y + off.y / z) / fade));
    const b = nearest();
    if (b !== focused) { if (focused) focused.el.classList.remove('focus'); focused = b; b.el.classList.add('focus');
      centre.textContent = b.y_ ? `${b.t} · ${b.y_}` : (b.parent ? (b.parent.parent ? b.parent.parent.t + ' › ' + b.parent.t + ' › ' : b.parent.t + ' › ') : '') + b.t; }
  }
  function animTo(tx, ty, tz, ms = 750) {
    cancelAnimationFrame(raf); hideCard();
    const f0 = { ...off }, z0 = z, t0 = performance.now();
    const f = now => { const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      off = { x: f0.x + (tx - f0.x) * e, y: f0.y + (ty - f0.y) * e }; z = z0 + (tz - z0) * e; render(); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
  }
  const glideTo = (n, ms) => animTo(-n.x * z, -n.y * z, z, ms);
  function coast(vx, vy) {
    cancelAnimationFrame(raf); let last = performance.now();
    const f = now => { const dt = Math.min(32, now - last) / 16.7; last = now;
      off.x += vx * dt; off.y += vy * dt; const k = Math.pow(0.93, dt); vx *= k; vy *= k; render();
      if (Math.hypot(vx, vy) > 0.35) raf = requestAnimationFrame(f); else glideTo(nearest(), 520); };
    raf = requestAnimationFrame(f);
  }
  let start = null, dragged = false, hist = [];
  field.addEventListener('pointerdown', e => {
    if (card.contains(e.target)) return; if (!e.target.closest('.dot')) hideCard();
    cancelAnimationFrame(raf); start = { x: e.clientX - off.x, y: e.clientY - off.y }; dragged = false; hist = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
  });
  field.addEventListener('pointermove', e => {
    if (!start) return; const nx = e.clientX - start.x, ny = e.clientY - start.y;
    if (!dragged && Math.hypot(nx - off.x, ny - off.y) > 3) { dragged = true; field.classList.add('drag'); field.setPointerCapture(e.pointerId); hideCard(); }
    if (!dragged) return; off = { x: nx, y: ny }; render(); hist.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (hist.length > 6) hist.shift();
  });
  const end = () => { if (!start) return; start = null; field.classList.remove('drag');
    if (dragged && hist.length > 1) { const a = hist[0], b = hist[hist.length - 1], dt = Math.max(1, b.t - a.t) / 16.7; coast((b.x - a.x) / dt, (b.y - a.y) / dt); }
    setTimeout(() => dragged = false, 0); };
  field.addEventListener('pointerup', end); field.addEventListener('pointercancel', end);
  field.addEventListener('wheel', e => {   // zoom toward the centre
    e.preventDefault(); cancelAnimationFrame(raf); hideCard();
    const nz = Math.min(2.2, Math.max(.22, z * Math.exp(-e.deltaY * .0015))); off = { x: off.x * nz / z, y: off.y * nz / z }; z = nz; render();
  }, { passive: false });
  document.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => {
    const nz = Math.min(2.2, Math.max(.22, z * (+b.dataset.zoom))); animTo(off.x * nz / z, off.y * nz / z, nz, 400); }));
  // start at the middle, zoomed out to show the vastness, then settle into Biology
  off = { x: 0, y: 0 }; z = .28; render();
  setTimeout(() => { const b = byName['Biology']; animTo(-b.x * .8, -b.y * .8, .8, 1600); }, 600);
})();
