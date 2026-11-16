/* WORK · CHAOS — the board. Another realm: a cork board of a life in film, edit suites and school.
   Everything pinned here is either my own work, public-domain film history (Wikimedia Commons), or ephemera drawn in code:
   tickets, film strips, countdown leaders, EDL printouts, sticky notes, tape, ransom lettering, marker notes, a VHS label, a pass.
   Positions come from the secret offsets (js/placement.js) — the mess is not random.
*/
window.Board = (() => {
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
  const PD = [   // public domain, verified to load
    [WM + 'd/d2/The_Horse_in_Motion_high_res.jpg/500px-The_Horse_in_Motion_high_res.jpg', 'Muybridge, 1878'],
    [WM + 'd/dd/Muybridge_race_horse_animated.gif/500px-Muybridge_race_horse_animated.gif', '24 frames'],
    [WM + '0/04/Le_Voyage_dans_la_lune.jpg/500px-Le_Voyage_dans_la_lune.jpg', 'Méliès, 1902'],
    [WM + '0/0b/Kinetoscope.jpg/500px-Kinetoscope.jpg', 'Kinetoscope'],
    [WM + '6/66/SMPTE_Color_Bars.svg/500px-SMPTE_Color_Bars.svg.png', 'bars & tone'],
  ];
  const MINE = [['thumbs/vaccine-futures', 'Vaccine Futures'], ['img/gn-06-rna', 'RNA'], ['thumbs/frequencies', 'Frequencies'], ['thumbs/opt-out-society', 'Opt-Out'],
    ['img/gn-15-bio-glove', 'bio glove'], ['thumbs/urban-healing', 'Urban Healing'], ['thumbs/this-and-that', 'luz'], ['img/gn-09-opt-out-kit', 'kit'],
    ['thumbs/learn-not-confirm', 'Learn not Confirm'], ['img/gn-13-petri-dish', 'petri'], ['img/gn-07-material-design', 'material'], ['img/gn-03-outbreak-map', 'outbreak']];
  const NOTES = ['the cut that lies', 'QC → pass?', 'continuity!!', 'frame 1 of 24', 'conform again', 'R&D: who decides?', 'M.Des →', 'keep secrets', 'too smooth = fake', 'bad cut — leave it'];
  const STICKY = ['?', '#4', 'time?', '01:00:00:00', 'why?', '??', 'NOW', '#7'];
  const RANSOM = ['PHYSICALLY UNABLE TO LEAVE A BAD CUT ALONE', 'STAY SLIGHTLY WRONG', 'KEEP SECRETS', 'THE AVERAGE WON'];
  const EDL = n => { let t = 'TITLE: OPUS_R3_CONFORM\nFCM: NON-DROP FRAME\n\n'; for (let i = 1; i <= n; i++) {
    const a = 3600 + i * 7, b = a + 4 + (i % 5), tc = s => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, (i * 7) % 25].map(v => String(v).padStart(2, '0')).join(':');
    t += `${String(i).padStart(3, '0')}  A0${i % 9}  V  C  ${tc(a)} ${tc(b)}\n`; } return t; };
  const rand = (o, k = 1) => o * k;
  // hand-cut silhouettes (clip-paths), applied to prints
  const CUTS = ['polygon(2% 4%,97% 0,100% 93%,4% 100%)', 'polygon(0 2%,100% 6%,95% 100%,3% 96%)', 'polygon(5% 0,100% 3%,97% 97%,0 100%,2% 50%)',
    'polygon(0 0,92% 4%,100% 60%,96% 100%,6% 94%)', 'none', 'polygon(3% 6%,50% 0,98% 5%,100% 98%,0 95%)'];
  // marker scribbles: wobbly circles, arrows, crosses (drawn, not typed)
  const wob = (k, n, R) => Array.from({ length: n + 1 }, (_, i) => { const a = i / n * 6.9 + k, o = (Math.sin(i * 1.7 + k * 3) * .09 + 1) * R; return `${i ? 'L' : 'M'}${(60 + Math.cos(a) * o * 1.25).toFixed(1)},${(50 + Math.sin(a) * o).toFixed(1)}`; }).join('');
  const SCRIB = k => [
    `<path d="${wob(k, 40, 38)}"/>`,
    `<path d="M10 80 C40 60 60 40 100 18 M100 18 l-18 2 M100 18 l-6 16"/>`,
    `<path d="M20 20 L100 82 M100 20 L22 84"/>`,
    `<path d="M8 60 Q30 20 52 58 T96 52 T112 40"/>`][k % 4];
  const face = i => Stretch.FACES[i % Stretch.FACES.length];
  const ransom = (t, k) => [...t].map((ch, i) => { if (ch === ' ') return '<i class="sp"></i>';
    const f = face(k * 5 + i * 3), inv = (k + i) % 4 === 0, rot = ((i * 37 + k * 11) % 13) - 6;
    return `<b style="font-family:'${f.f}';font-weight:${f.w};font-style:${f.s};transform:rotate(${rot}deg)" class="${inv ? 'inv' : ''}">${ch}</b>`; }).join('');

  function build({ OFF, left, width, top, height }) {
    const out = [], pins = [];
    let k = 0;
    const place = (w, h, depth) => { const o = OFF[(k * 13 + 5) % OFF.length], o2 = OFF[(k * 7 + 19) % OFF.length]; k++;
      const x = left + ((k * .6180339) % 1) * (width - w) + o[0] * 60, y = top + (Math.abs(o[1]) * (height - h - 30)) + 8;
      return { x, y, r: (o2[0] * 26).toFixed(1), s: (.75 + Math.abs(o[0] * o2[1]) * .8).toFixed(2), d: (depth != null ? depth : .4 + Math.abs(o2[1]) * 1.6).toFixed(2), z: 4 + (k % 14) }; };
    const add = (cls, w, h, inner, pin = true, extra = '') => { const p = place(w, h);
      out.push(`<div class="sc ${cls}" style="left:${p.x.toFixed(0)}px;top:${p.y.toFixed(0)}px;width:${w}px;${h ? `height:${h}px;` : ''}--r:${p.r}deg;--s:${p.s};--depth:${p.d};z-index:${p.z};--cut:${CUTS[k % CUTS.length]};${extra}">${inner}</div>`);
      if (pin) pins.push([p.x + w / 2, p.y + 4]); };
    // film history (public domain) as prints and polaroids
    PD.forEach(([src, cap], i) => add(i % 2 ? 'print' : 'pol', i === 1 ? 220 : 200 + (i % 3) * 30, 0, `<img src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer"><span>${cap}</span>`));
    // my work
    MINE.forEach(([src, cap], i) => add(i % 3 === 0 ? 'print' : 'pol', 150 + (i % 4) * 26, 0, `<img src="assets/${src}.jpg" alt="" loading="lazy"><span>${cap}</span>`));
    // film strips of my panels
    [0, 1].forEach(j => add('strip', 360, 92, MINE.slice(j * 4, j * 4 + 4).map(([s]) => `<i style="background-image:url(assets/${s}.jpg)"></i>`).join(''), false));
    // cinema tickets
    ['ADMIT ONE', 'ADMIT ONE', 'NIGHT SHIFT', 'PREMIERE'].forEach((t, i) => add('ticket', 170, 70, `<b>${t}</b><em>Nº ${String(4719 + i * 233).padStart(6, '0')}</em><small>ROW ${'FGHK'[i]} · SEAT ${12 + i}</small>`, i % 2 === 0));
    // countdown leaders: circles
    [8, 3].forEach(n => add('leader', 150, 150, `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="36"/><path d="M50 0V100M0 50H100"/><text x="50" y="62">${n}</text></svg>`, false));
    // EDL printouts
    [14, 9].forEach(n => add('edl', 270, 0, `<pre>${EDL(n)}</pre>`));
    // sticky notes
    STICKY.forEach((t, i) => add('sticky' + (i % 3 ? '' : ' y2'), 92, 88, `<span>${t}</span>`, false));
    // ransom lettering (my own phrases)
    RANSOM.forEach((t, i) => add('ransom', Math.min(560, 26 * t.length), 0, ransom(t, i), false));
    // marker notes
    NOTES.forEach(t => add('marker', 200, 0, t, false));
    // washi tape strips
    Array.from({ length: 9 }, (_, i) => add('tape t' + (i % 3), 110 + (i % 4) * 30, 22, '', false));
    // MTV / analogue: camcorder frames over film history, day-glo stickers, static, coffee rings, staples, scribbles
    PD.slice(0, 3).forEach(([src], i) => add('cam', 240, 0, `<img src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer"><b>● REC</b><em>${['JUN 14 1996', 'OCT 02 1998', 'AUG 30 1994'][i]}  ${['11:42 PM', '03:15 AM', '09:01 PM'][i]}</em><i>SP</i>`, false));
    MINE.slice(0, 6).forEach(([src], i) => add('duo d' + (i % 3), 170 + (i % 3) * 40, 0, `<img src="assets/${src}.jpg" alt="" loading="lazy">`, i % 2 === 0));
    ['WHATEVER', 'TAPE IT', 'NO!', 'REWIND', 'LIVE', 'VOL 3', 'BE KIND', 'X'].forEach((t, i) => add('glo g' + (i % 3), 120, 120, `<span>${t}</span>`, false));
    Array.from({ length: 3 }, () => add('static', 200, 150, '<canvas width="100" height="75"></canvas>', false));
    Array.from({ length: 4 }, () => add('ring', 150, 150, '', false));
    Array.from({ length: 6 }, () => add('staple', 34, 7, '', false));
    Array.from({ length: 12 }, (_, i) => add('scrib s' + (i % 3), 130, 110, `<svg viewBox="0 0 120 100">${SCRIB(i)}</svg>`, false));
    NOTES.forEach(t => add('marker m2', 220, 0, t, false));
    STICKY.forEach((t, i) => add('sticky' + (i % 2 ? ' y2' : ''), 92, 88, `<span>${t}</span>`, false));
    // a VHS label, a cassette, a pass
    add('vhs', 280, 54, `<b>EDIT SUITE · REEL 03</b><em>SP · 2:00 · DO NOT ERASE</em>`);
    add('cassette', 230, 150, `<div class="cl">MIXTAPE — for the night conform</div><div class="cw"><i></i><i></i></div>`);
    add('pass', 150, 200, `<b>ALL AREA</b><em>HIT · M.Des</em><strong>PASS</strong><small>2025 → </small>`);
    add('pass p2', 150, 200, `<b>BACKSTAGE</b><em>Opus Post</em><strong>2nd</strong><small>2014 – 2018</small>`);
    return { html: out.join(''), pins };
  }
  // TV static that flickers on the beat
  function live(root) {
    const cs = [...root.querySelectorAll('.sc.static canvas')]; if (!cs.length) return;
    const ctxs = cs.map(c => c.getContext('2d'));
    const tick = () => { ctxs.forEach(x => { const d = x.createImageData(100, 75); for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255 | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); }); };
    tick(); clearInterval(live.t); live.t = setInterval(tick, 125);   // one timer, even when the board is rebuilt
  }
  return { build, live };
})();
