/* ROI — a vast latent field of interests.
   Four regions branch into fields and terms (a rhizome, not a tree: terms link across regions).
   Hybrid zones sit where regions meet. Projects (red dots) and pieces of life (hollow dots) sit near what they're about.
   The thin red circles (ages) stay centred; the field moves under them.
   Drag to travel (release → glide, ease-out, settle on the nearest word). Wheel / pinch to zoom.
   Every point carries a breathing target grid; the point nearest the centre is chosen and its target grows.
   Projects: larger red dots with a year. Click → centre + thumbnail; click again / thumbnail → gallery (a window).
*/
(() => {
  let view = 'chaos';
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
  // ORDER underneath: a Swiss layout on a 24px module (region block per quadrant, fields in two columns, terms listed).
  // BREAK on top: each point is pushed off its grid position by an offset from the secret file (js/placement.js).
  // Hover a cluster and it snaps back into the grid: the order was there all along.
  const M = 24, snap = v => Math.round(v / M) * M;
  const QUAD = { Biology: [-1, -1], Governance: [1, -1], Communication: [-1, 1], Freedom: [1, 1] };
  Object.entries(TREE).forEach(([R, def]) => {
    const [sx, sy] = QUAD[R], fs = Object.entries(def.fields), colW = 13 * M, blockH = f => (f[1].length + 1) * M + 2 * M;
    const colH = [0, 0]; fs.forEach((f, i) => colH[i % 2] += blockH(f));
    const W = 2 * colW, H = Math.max(...colH) + 4 * M, x0 = sx < 0 ? -W - 6 * M : 6 * M, y0 = sy < 0 ? -H - 4 * M : 4 * M;
    const reg = add(R, snap(x0), snap(y0), 0); reg.cl = R;
    const cy = [y0 + 4 * M, y0 + 4 * M];
    fs.forEach(([F, terms], i) => {
      const c = i % 2, fx = snap(x0 + c * colW + M), fy = snap(cy[c]);
      const f = add(F, fx, fy, 1); f.parent = reg; f.cl = R;
      terms.forEach((T, j) => { const t = add(T, fx + M, fy + (j + 1) * M, 2); t.parent = f; t.cl = R; });
      cy[c] += blockH([F, terms]);
    });
  });
  const HPOS = { 'Biopolitics': [0, -8], 'Contagion of ideas': [-14, 0], 'The right to opt out': [14, 0], 'Free radio': [0, 8],
                 'Bodily autonomy': [-5, 4], 'Electromagnetic colonialism': [5, -4], 'Invisible systems': [0, 0] };
  HYBRIDS.forEach(([t]) => { const [gx, gy] = HPOS[t] || [0, 0]; const h = add(t, gx * M, gy * M, t === 'Invisible systems' ? 0 : 0.5); h.cl = 'hybrid'; });
  P.forEach(p => { const n = byName[p.near] || { x: 0, y: 0 }; p.x = n.x - M; p.y = n.y; p.cl = n.cl; });
  // the break: offsets from the secret file. Regions move little, terms a lot, so the blocks dissolve into a rhizome.
  const OFF = (window.PLACEMENT && PLACEMENT.offsets) || [[0, 0]];
  const AMP = { 0: 5 * M, 0.5: 6 * M, 1: 7 * M, 2: 8 * M };
  N.concat(P).forEach((n, i) => {
    const o = OFF[i % OFF.length], amp = n.y_ ? 7 * M : AMP[n.lv];
    n.gx = n.x; n.gy = n.y;                                       // where the grid wants it
    n.dx = n.x + o[0] * amp; n.dy = n.y + o[1] * amp;             // where the people put it
    n.x = n.dx; n.y = n.dy;
  });
  // in the grid, projects get their own column on the right, in order of year: an index, not a crowd
  const gxMax = Math.max(...N.map(n => n.gx)), gyMin = Math.min(...N.map(n => n.gy));
  P.slice().sort((a, b) => a.y_ - b.y_ || a.t.localeCompare(b.t)).forEach((p, i) => { p.gx = snap(gxMax + 16 * M); p.gy = snap(gyMin + 2 * M + i * 3 * M); });
  // keep the break legible: push overlapping labels apart (deterministic, so still the same for everyone)
  const box = n => { const fs = n.lv === 0 ? 54 : n.lv === 1 ? 20 : n.lv === .5 ? 22 : n.y_ ? 22 : 14; return { w: (n.y_ ? 16 : n.t.length) * fs * .5 + 16, h: fs * 1.2 + (n.y_ ? 16 : 0) }; };
  const ALLP = N.concat(P);
  for (let it = 0; it < 120; it++) for (let i = 0; i < ALLP.length; i++) for (let j = i + 1; j < ALLP.length; j++) {
    const A = ALLP[i], B = ALLP[j], ba = box(A), bb = box(B);
    const ox = Math.min(A.dx + ba.w, B.dx + bb.w) - Math.max(A.dx - 8, B.dx - 8), oy = Math.min(A.dy + ba.h / 2, B.dy + bb.h / 2) - Math.max(A.dy - ba.h / 2, B.dy - bb.h / 2);
    if (ox <= 0 || oy <= 0) continue;
    const push = Math.min(ox, oy) / 2 + .5;
    if (oy < ox) { const d = Math.sign(A.dy - B.dy || 1); A.dy += d * push; B.dy -= d * push; } else { const d = Math.sign(A.dx - B.dx || 1); A.dx += d * push; B.dx -= d * push; }
  }
  ALLP.forEach(n => { n.x = n.dx; n.y = n.dy; });

  // ── render: every point is a dot with its own target grid (8 rings, ages) and a label
  const FACES = Stretch.FACES, rand = a => a[Math.floor(Math.random() * a.length)];
  const AGES = Stretch.weights('ages');
  const field = document.getElementById('field'), layer = document.getElementById('layer'), centre = document.getElementById('centre'), card = document.getElementById('card');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'links'); svg.setAttribute('viewBox', '-3000 -2000 6000 4000'); layer.appendChild(svg);
  const line = (a, b, cls) => { const l = document.createElementNS(svg.namespaceURI, 'line');
    l.setAttribute('x1', a.x); l.setAttribute('y1', a.y); l.setAttribute('x2', b.x); l.setAttribute('y2', b.y); l.setAttribute('class', cls); svg.appendChild(l); };
  const EDGES = [];
  const shape = e => { const { a, b, k } = e, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y;
    const sn = a.snapped && b.snapped;                             // in the grid: right angles; in the break: a root-like bend
    e.el.setAttribute('d', sn ? `M${a.x},${a.y} L${a.x},${b.y} L${b.x},${b.y}` : `M${a.x},${a.y} Q${mx - dy * k},${my + dx * k} ${b.x},${b.y}`); };
  const curve = (a, b, cls) => { const l = document.createElementNS(svg.namespaceURI, 'path');
    l.setAttribute('class', cls); l.setAttribute('fill', 'none'); svg.appendChild(l);
    const e = { a, b, el: l, k: .22 * ((EDGES.length % 2) ? 1 : -1) }; EDGES.push(e); shape(e); };
  N.forEach(n => { if (n.parent) curve(n.parent, n, 'tree'); });
  LINKS.forEach(([a, b]) => { if (byName[a] && byName[b]) curve(byName[a], byName[b], 'rhizome'); });
  const rings = () => AGES.map((r, i) => `<i style="--r:${r}%;--dl:${(i * 30)}ms"></i>`).join('');
  function node(n, cls, label) {
    const d = document.createElement('div'); d.className = 'n ' + cls; d.style.left = n.x + 'px'; d.style.top = n.y + 'px';
    d.innerHTML = `<div class="tg">${rings()}</div><button class="dt" aria-label="${n.t}"></button><span class="lb">${label}</span>`;
    n.el = d; layer.appendChild(d); return d;
  }
  N.forEach(n => {
    const d = node(n, 'lv' + String(n.lv).replace('.', ''), n.t);
    d.addEventListener('click', e => { e.stopPropagation(); hideCard(); if (pinned === n) { unpin(); return; } pinned = n; showDef(n, d.querySelector('.lb')); });
  });
  setTimeout(() => N.concat(P).forEach(n => {
    n.el.addEventListener('mouseenter', () => { hovered = n; n.el.classList.add('hl'); render(); });
    n.el.addEventListener('mouseleave', () => { hovered = null; n.el.classList.remove('hl'); render(); });
  }), 0);
  P.forEach(p => { const t = byName[p.near]; if (t) curve(p, t, 'plink'); });   // red threads from each project to its term
  P.forEach(p => {
    const d = node(p, 'proj', `<b>${p.t}</b>${p.y_}`);
    d.addEventListener('click', e => { e.stopPropagation(); unpin(); if (open === p) openGallery(p); else showCard(p); });
  });

  // ── VIEW: grid ⇄ chaos.  (view declared up top) The same points, two places each: where the grid wants them, where the people put them.
  // Switching moves everything across in two beats; red after-images are left along the way, like light through a prism.
  const ALLN = N.concat(P);
  ALLN.forEach(n => {
    const gh = document.createElement('div'); gh.className = 'ghost'; gh.innerHTML = '<i class="e1"></i><i class="e2"></i><i class="e3"></i>'; layer.appendChild(gh); n.gh = gh;
  });
  let anim = 0;
  function setView(v) {
    if (v === view) return; view = v;
    document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === v));
    field.classList.toggle('gridview', v === 'grid');
    const toGrid = v === 'grid', from = ALLN.map(n => [n, n.x, n.y]);
    ALLN.forEach(n => {                                            // after-images from where it was
      const tx = toGrid ? n.gx : n.dx, ty = toGrid ? n.gy : n.dy;
      n.gh.style.left = n.x + 'px'; n.gh.style.top = n.y + 'px';
      n.gh.style.setProperty('--tx', (tx - n.x) + 'px'); n.gh.style.setProperty('--ty', (ty - n.y) + 'px');
      n.gh.classList.remove('go'); void n.gh.offsetWidth; n.gh.classList.add('go');
      n.snapped = toGrid;
    });
    cancelAnimationFrame(anim); const t0 = performance.now();
    const f = now => { const p = Math.min(1, (now - t0) / 1000), e = p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;   // two beats
      from.forEach(([n, x0, y0]) => { const tx = toGrid ? n.gx : n.dx, ty = toGrid ? n.gy : n.dy;
        n.x = x0 + (tx - x0) * e; n.y = y0 + (ty - y0) * e; n.el.style.left = n.x + 'px'; n.el.style.top = n.y + 'px'; });
      EDGES.forEach(shape); render();
      if (p < 1) anim = requestAnimationFrame(f); };
    anim = requestAnimationFrame(f);
  }
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

  // ── dictionary pop-up
  const def = document.getElementById('def');
  function showDef(n, el) {
    const e = (window.DICT || {})[n.t] || ['', 'An open term in the field.'];
    def.innerHTML = `<b>${n.t}</b> <i>${e[0]}</i><span>${e[1]}</span>`;
    const r = el.getBoundingClientRect(), fr = field.getBoundingClientRect();
    let x = r.left - fr.left, y = r.bottom - fr.top + 10;
    if (x + 300 > fr.width - 12) x = fr.width - 312; if (y + 120 > fr.height) y = r.top - fr.top - 130;
    def.style.left = Math.max(12, x) + 'px'; def.style.top = Math.max(12, y) + 'px';
    def.classList.remove('on'); void def.offsetWidth; def.classList.add('on');
  }
  function hideDef() { def.classList.remove('on'); }
  let pinned = null; const unpin = () => { pinned = null; hideDef(); };

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
  let off = { x: 0, y: 0 }, z = .8, focused = null, raf = 0, hovered = null;
  const ALL = N.concat(P);
  const nearest = () => { let b = null, bd = Infinity; ALL.forEach(n => { const d = (n.x * z + off.x) ** 2 + (n.y * z + off.y) ** 2; if (d < bd) { bd = d; b = n; } }); return b; };
  function render() {
    layer.style.transform = `translate(${off.x}px,${off.y}px) scale(${z})`;
    // rhizome: points fade with distance from the centre (depth). grid: everything at full strength.
    const fade = 520 / Math.max(.4, z), gv = view === 'grid';
    ALL.forEach(n => n.el.style.opacity = gv ? 1 : Math.max(.12, 1 - Math.hypot(n.x + off.x / z, n.y + off.y / z) / fade));
    const b = hovered || nearest();
    if (b !== focused) { if (focused) focused.el.classList.remove('focus'); focused = b; b.el.classList.add('focus');
      centre.textContent = b.y_ ? `${b.t} · ${b.y_}` : (b.parent ? (b.parent.parent ? b.parent.parent.t + ' › ' + b.parent.t + ' › ' : b.parent.t + ' › ') : '') + b.t; }
  }
  function animTo(tx, ty, tz, ms = 750) {
    cancelAnimationFrame(raf); hideCard(); follow = false; clearTimeout(animTo.t); animTo.t = setTimeout(() => follow = true, ms + 50);
    const f0 = { ...off }, z0 = z, t0 = performance.now();
    const f = now => { const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      off = { x: f0.x + (tx - f0.x) * e, y: f0.y + (ty - f0.y) * e }; z = z0 + (tz - z0) * e; render(); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
  }
  const glideTo = (n, ms) => animTo(-n.x * z, -n.y * z, z, ms);
  // the map's centre follows the mouse: point toward an edge and the field slides that way, easing like a lens
  let dragged = false, follow = true, aim = { x: 0, y: 0 }, inside = false;
  const ext = () => { let mx = 0, my = 0; ALL.forEach(n => { mx = Math.max(mx, Math.abs(n.x)); my = Math.max(my, Math.abs(n.y)); }); return { x: mx + 200, y: my + 160 }; };
  field.addEventListener('pointermove', e => {
    const r = field.getBoundingClientRect(); inside = true;
    aim = { x: ((e.clientX - r.left) / r.width - .5) * 2, y: ((e.clientY - r.top) / r.height - .5) * 2 };
  });
  field.addEventListener('pointerleave', () => inside = false);
  (function tick() {
    if (follow && inside && !open && !pinned) {
      const E = ext(), dz = Math.max(0, Math.abs(aim.x) - .12) * Math.sign(aim.x), dy = Math.max(0, Math.abs(aim.y) - .12) * Math.sign(aim.y);   // a small dead zone in the middle
      const tx = -dz / .88 * E.x * z, ty = -dy / .88 * E.y * z;
      off.x += (tx - off.x) * .045; off.y += (ty - off.y) * .045; render();
    }
    requestAnimationFrame(tick);
  })();
  field.addEventListener('pointerdown', e => { if (!card.contains(e.target) && !e.target.closest('.n') && !def.contains(e.target)) { hideCard(); unpin(); } });
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
