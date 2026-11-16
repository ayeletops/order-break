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
  const face = i => Stretch.FACES[i % Stretch.FACES.length];
  const ransom = (t, k) => [...t].map((ch, i) => { if (ch === ' ') return '<i class="sp"></i>';
    const f = face(k * 5 + i * 3), inv = (k + i) % 4 === 0, rot = ((i * 37 + k * 11) % 13) - 6;
    return `<b style="font-family:'${f.f}';font-weight:${f.w};font-style:${f.s};transform:rotate(${rot}deg)" class="${inv ? 'inv' : ''}">${ch}</b>`; }).join('');

  function build({ OFF, left, width, top, height }) {
    const out = [], pins = [];
    let k = 0;
    const place = (w, h, depth) => { const o = OFF[(k * 13 + 5) % OFF.length], o2 = OFF[(k * 7 + 19) % OFF.length]; k++;
      const x = left + ((k * .6180339) % 1) * (width - w) + o[0] * 60, y = top + (Math.abs(o[1]) * (height - h - 30)) + 8;
      return { x, y, r: (o2[0] * 11).toFixed(1), d: (depth != null ? depth : .4 + Math.abs(o2[1]) * 1.6).toFixed(2), z: 4 + (k % 9) }; };
    const add = (cls, w, h, inner, pin = true, extra = '') => { const p = place(w, h);
      out.push(`<div class="sc ${cls}" style="left:${p.x.toFixed(0)}px;top:${p.y.toFixed(0)}px;width:${w}px;${h ? `height:${h}px;` : ''}--r:${p.r}deg;--depth:${p.d};z-index:${p.z};${extra}">${inner}</div>`);
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
    // a VHS label, a cassette, a pass
    add('vhs', 280, 54, `<b>EDIT SUITE · REEL 03</b><em>SP · 2:00 · DO NOT ERASE</em>`);
    add('cassette', 230, 150, `<div class="cl">MIXTAPE — for the night conform</div><div class="cw"><i></i><i></i></div>`);
    add('pass', 150, 200, `<b>ALL AREA</b><em>HIT · M.Des</em><strong>PASS</strong><small>2025 → </small>`);
    add('pass p2', 150, 200, `<b>BACKSTAGE</b><em>Opus Post</em><strong>2nd</strong><small>2014 – 2018</small>`);
    return { html: out.join(''), pins };
  }
  return { build };
})();
