/* WORK · CHAOS — the board of a mind that connects everything.
   Paper: Ayelet's own images (assets/board, listed by tools/board-manifest.py) + real scans of tickets, receipts, telegrams,
   envelopes and handwriting from Wikimedia Commons (js/board-scraps.js) + a few public-domain photographs of early cinema.
   Sizes from small to medium, a rare large one; rotated, layered, no blending. Click brings one forward; click again puts it back.
   No pins: it is a map on black. Thin red threads (js/board-threads.js) run through things that belong together.
   Thin lines, as on the ROI field, join things that share a topic (js/board-topics.js for her images; keywords for the scans).
   Every position comes from the secret offsets.
*/
window.Board = (() => {
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
  const thumb = (p, w) => WM + p + '/' + w + 'px-' + p.split('/').pop();
  const PD = ['d/d2/The_Horse_in_Motion_high_res.jpg', '0/04/Le_Voyage_dans_la_lune.jpg', '0/0b/Kinetoscope.jpg'];
  const M = () => Object.assign({}, (window.BOARD && BOARD.materials) || {});

  // every piece has a key the threads can name (js/board-threads.js): n005, s01, p:ego, scan:<file>, pd
  const keyOf = src => { const f = src.split('/').pop().replace(/\.\w+$/, ''); return f.startsWith('p-') ? 'p:' + f.slice(2) : f.replace('-', ''); };
  // the paper, mixed: own images and scans interleaved, so the eye never settles
  function items() {
    const own = ((window.BOARD && BOARD.images) || []).map(e => { const [src, ar] = Array.isArray(e) ? e : [e, 1]; return { src, ar, own: 1, key: keyOf(src) }; });
    const scans = (window.SCRAPS || []).map(([p, ar, lic, by]) => ({ p, ar, lic, by, scan: 1, key: 'scan:' + decodeURIComponent(p.split('/').pop()) }));
    const pd = PD.map(p => ({ p, ar: .75, key: 'pd' }));
    const out = []; let j = 0;
    own.forEach((o, i) => { out.push(o); if (i % 2 === 1 && scans[j]) out.push(scans[j++]); });   // two of hers, one scan
    while (scans[j]) out.push(scans[j++]);
    return out.concat(pd);
  }

  function build({ OFF, left, width, top, height }) {
    const list = items(), html = [], anchors = []; G.length = 0;
    list.forEach((it, k) => {
      const o = OFF[(k * 13 + 5) % OFF.length], o2 = OFF[(k * 7 + 19) % OFF.length], o3 = OFF[(k * 11 + 3) % OFF.length];
      // size: excess. mostly small, many medium, a rare large one; nothing taller than ~40% of the board
      const ar = it.ar || 1;
      let w = Math.round(70 + Math.pow(Math.abs(o2[0]), 1.6) * 210);
      if (k % 29 === 4) w = Math.round(250 + Math.abs(o3[0]) * 70);
      const hMax = height * .34; if (w * ar > hMax) w = Math.round(hMax / ar);
      w = Math.max(54, w);
      const h = w * ar;
      const x = left + ((k * .6180339) % 1) * (width - w * .6) + o[0] * 90 - w * .2;
      const y = top - 20 + ((k * .7548776 + Math.abs(o[1]) * .5) % 1) * Math.max(40, height - h * .55);
      const kind = it.scan ? 'scan' : (k % 5 === 0 && ar < 1.15 && ar > .85 ? 'pol' : 'print');
      const rt = (k * 7 + 3) % 6 === 0;                                                        // red thread: grainy red duotone, like a risograph
      const blend = 'normal';   // no blending: every piece is itself
      const r = (o2[1] * (it.scan ? 28 : 18)).toFixed(1), curl = (o3[0] * 7).toFixed(1);
      // the pin: top-centre, or top-right for tiles cut from a saved board; the print rotates around it
      const ax = w * (.5 + o3[0] * .18), ay = Math.min(18, h * .08);
      const src = it.src || thumb(it.p, w > 300 ? 500 : 330);
      html.push(`<figure class="ph ${kind}${rt ? ' rt' : ''}${blend !== 'normal' ? ' bl' : ''}" data-k="${k}" data-id="p${k}" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${w}px;--r:${r}deg;--curl:${curl}deg;transform-origin:${ax.toFixed(0)}px ${ay.toFixed(0)}px;z-index:${5 + (k % 25)}">`
        + `<img src="${src}" alt="" decoding="async" referrerpolicy="no-referrer"><i class="sheen"></i></figure>`);
      const hh = h + (kind === 'pol' ? 51 : kind === 'scan' || blend !== 'normal' ? 0 : 14), ww = w + (kind === 'scan' || blend !== 'normal' ? 0 : 14);
      anchors.push([x + ww / 2, y + hh / 2, w, it.key, 'ph', 'p' + k, ww, hh]);   // a place on the map: centre and size
      G.push({ own: !!it.src, big: it.src || thumb(it.p, 960), cap: it.scan ? decodeURIComponent(it.p.split('/').pop()).replace(/_/g, ' ').replace(/\.\w+$/, '') + ' · ' + it.by + ' · ' + it.lic + ' · Wikimedia Commons' : '' });
    });
    return { html: html.join(''), anchors };
  }

  // threads: each named thread (js/board-threads.js) runs as one thin red line through its members in time order (left to right),
  // with a few cross-ties inside it. A piece on several threads is where they cross. No arrows: everything is already connected.
  // nodes: [cx, cy, w, key, kind, id, width, height]
  function lines(nodes, W, H, OFF) {
    const T = window.THREADS || {}, seen = new Set(), out = [], f = v => v.toFixed(1);
    const match = (m, n) => m === n[3] || (m === 'pd' && n[3] === 'pd') || (m.startsWith('scan:') && n[3].startsWith('scan:') && new RegExp(m.slice(5), 'i').test(n[3]));
    const edge = (n, ux, uy) => { const hw = (n[6] || 0) / 2, hh = (n[7] || 0) / 2; if (!hw || !hh) return 0;
      return Math.min(Math.abs(ux) > 1e-6 ? hw / Math.abs(ux) : 1e9, Math.abs(uy) > 1e-6 ? hh / Math.abs(uy) : 1e9); };
    const tie = (a, b, name) => { const key = a[5] < b[5] ? a[5] + '|' + b[5] : b[5] + '|' + a[5]; if (a === b || seen.has(key)) return; seen.add(key);
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, ta = edge(a, ux, uy) + 2, tb = edge(b, ux, uy) + 2;
      if (ta + tb > L - 6) return;
      out.push(`<path data-a="${a[5]}" data-b="${b[5]}" data-t="${name}" d="M${f(a[0] + ux * ta)},${f(a[1] + uy * ta)} L${f(b[0] - ux * tb)},${f(b[1] - uy * tb)}"/>`); };
    Object.entries(T).forEach(([name, members], ti) => {
      const ms = []; members.forEach(m => nodes.forEach(n => { if (n[3] && match(m, n) && !ms.includes(n)) ms.push(n); }));
      ms.sort((p, q) => p[0] - q[0]);
      ms.forEach((n, i) => { if (ms[i + 1]) tie(n, ms[i + 1], name);                               // the thread itself
        const o = OFF[(i * 7 + ti * 13) % OFF.length]; if (Math.abs(o[0]) > .55 && ms.length > 4) tie(n, ms[(i + 2 + (Math.abs(Math.round(o[1] * 50)) % (ms.length - 2))) % ms.length], name); });   // a cross-tie
    });
    // the label tape leads to its own cards
    nodes.filter(n => n[4] === 'tag').forEach(t => nodes.filter(n => n[4] === 'card' && n[3] === t[3]).forEach(c => tie(t, c, 'tag')));
    return `<svg class="topics" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out.join('')}</svg>`
      + `<svg class="topics hl" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"></svg>`;
  }
  // hover: a thing's own arrows, in and out, come up over the paper
  function trace(track) {
    track.addEventListener('pointerover', e => { const el = e.target.closest('[data-id]'), hl = track.querySelector('svg.topics.hl'), base = track.querySelector('svg.topics:not(.hl)');
      if (!hl || !base) return; if (!el || el.classList.contains('lifted')) { hl.innerHTML = ''; return; }
      const id = el.dataset.id, mine = [...base.querySelectorAll(`path[data-a="${id}"],path[data-b="${id}"]`)]; hl.innerHTML = mine.map(p => p.outerHTML).join('');
      if (!el.title) el.title = [...new Set(mine.map(p => p.dataset.t).filter(t => t !== 'tag'))].join(' · '); });   // which threads run through it
    track.addEventListener('pointerleave', () => { const hl = track.querySelector('svg.topics.hl'); if (hl) hl.innerHTML = ''; });
  }

  // pins: photographed brass tacks and black cobbler's nails (cut out of Ayelet's photos), one per anchor, above the cord
  function pins(points, OFF) {
    const m = M(), set = re => Object.keys(m).filter(k => re.test(k)).sort().map(k => m[k]);
    const nails = set(/^nail-/), push = set(/^push-/);
    return points.map(([x, y, w], i) => { const o = OFF[(i * 5 + 2) % OFF.length], hsh = Math.abs(Math.round(o[0] * 991 + o[1] * 313));
      // a mixed handful: mostly small dark tacks, some nails, some red pushpins
      const r5 = hsh % 8, kind = r5 < 4 || !(nails.length || push.length) ? 'tack' : (r5 < 6 && nails.length) || !push.length ? 'nail' : 'push';
      const src = kind === 'tack' ? m.tack : kind === 'nail' ? nails[hsh % nails.length] : push[hsh % push.length];
      if (!src) return `<i class="pin drawn" style="left:${x - 5}px;top:${y - 5}px"></i>`;
      const s = Math.round(kind === 'nail' ? 22 + Math.abs(o[1]) * 10 : kind === 'push' ? 17 + Math.abs(o[1]) * 7 : 9 + Math.abs(o[0]) * 5);
      const rot = kind === 'nail' ? (hsh * 37) % 360 : kind === 'push' ? Math.round(o[1] * 35) : Math.round(o[1] * 90);
      return `<img class="pin ${kind}" src="${src}" alt="" style="left:${(x - s / 2).toFixed(0)}px;top:${(y - s / 2).toFixed(0)}px;width:${s}px;transform:rotate(${rot}deg)">`; }).join('');
  }
  function dress() {}

  // click: a card or a tag comes to the front. a print leaves its place and comes forward, large, in front of the board;
  // clicking it again, clicking the board, Esc or scrolling puts it back exactly where it was
  const G = []; let Z = 40, cur = null, ui = null, wrapEl = null;
  function controls() {
    if (ui) return ui;
    ui = document.createElement('div'); ui.className = 'gal'; ui.hidden = true;
    ui.innerHTML = '<p class="cap"></p>';
    document.body.appendChild(ui);
    document.addEventListener('keydown', e => { if (cur && e.key === 'Escape') drop(); });
    document.addEventListener('click', e => { if (cur && !e.target.closest('.wrap')) drop(); });
    return ui;
  }
  function lift(el) {
    if (cur === el) return; drop(); controls();
    const w = el.offsetWidth, h = el.offsetHeight, vw = wrapEl.clientWidth, vh = wrapEl.clientHeight;
    const g0 = G[+el.dataset.k], nat = (el.querySelector('img') || {}).naturalWidth || 0;
    const s = Math.min(Math.min(vw * .6, 760) / w, vh * .8 / h, 4, g0 && g0.own && nat ? Math.max(1.2, nat * 2.2 / w) : 4);   // never blow a small file up past ~2x
    const [ox, oy] = getComputedStyle(el).transformOrigin.split(' ').map(parseFloat);
    const cx = wrapEl.scrollLeft + vw / 2 - el.offsetLeft, cy = vh / 2 - el.offsetTop;
    const tx = cx - ox - s * (w / 2 - ox), ty = cy - oy - s * (h / 2 - oy);
    el.dataset.z = el.style.zIndex;
    el.classList.add('lifted'); el.style.zIndex = 5000;
    el.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${s.toFixed(3)})`;
    const g = G[+el.dataset.k], img = el.querySelector('img'); if (g && !g.own && img.src !== g.big) { const hi = new Image(); hi.onload = () => { img.src = g.big; }; hi.src = g.big; }
    cur = el; ui.hidden = false; ui.querySelector('.cap').textContent = (g && g.cap) || '';
  }
  function drop() {
    if (!cur) return; const el = cur; cur = null; if (ui) ui.hidden = true;
    el.classList.remove('lifted'); el.classList.add('landing'); el.style.transform = '';
    setTimeout(() => { el.classList.remove('landing'); el.style.zIndex = el.dataset.z; }, 700);
  }
  function front(track) {
    wrapEl = track.closest('.wrap');
    track.addEventListener('click', e => { if (e.target.closest('a')) return; const el = e.target.closest('.ph, .role, .dymo');
      if (!el) { drop(); return; }
      if (el.classList.contains('ph')) { if (el === cur) drop(); else lift(el); return; }
      drop(); el.style.zIndex = ++Z; });
    wrapEl.addEventListener('scroll', () => { if (cur) drop(); }, { passive: true });
    trace(track);
  }
  function reset() { cur = null; if (ui) ui.hidden = true; }
  const material = () => M();
  return { build, lines, pins, dress, front, reset, material };
})();
