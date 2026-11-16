/* WORK · CHAOS — the board. Another realm: a cork board of a life spent in cinema, edit suites and late-night TV.
   No school projects here. What's pinned: public-domain film history (Wikimedia Commons), and ephemera drawn in code —
   tickets to films that matter to me, "persons of interest" cards for directors (no photos: a silhouette, a name, the films),
   TV-guide clippings, homage motifs (a red curtain, a zig-zag floor, a one-point corridor), countdown leaders, EDL printouts,
   stickies, ransom lettering, marker scrawl, tape, a VHS label, a mixtape, passes — tied together with real-looking string.
   Positions come from the secret offsets (js/placement.js): the mess is not random.
*/
window.Board = (() => {
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
  const PD = [   // public domain, verified to load
    [WM + 'd/d2/The_Horse_in_Motion_high_res.jpg/500px-The_Horse_in_Motion_high_res.jpg', 'Muybridge, 1878'],
    [WM + 'd/dd/Muybridge_race_horse_animated.gif/500px-Muybridge_race_horse_animated.gif', '24 frames a second'],
    [WM + '0/04/Le_Voyage_dans_la_lune.jpg/500px-Le_Voyage_dans_la_lune.jpg', 'Méliès, 1902'],
    [WM + '0/0b/Kinetoscope.jpg/500px-Kinetoscope.jpg', 'Kinetoscope'],
    [WM + '6/66/SMPTE_Color_Bars.svg/500px-SMPTE_Color_Bars.svg.png', 'bars & tone'],
  ];
  const FILMS = [['ERASERHEAD', 1977], ['BLUE VELVET', 1986], ['LOST HIGHWAY', 1997], ['MULHOLLAND DR.', 2001], ['2001: A SPACE ODYSSEY', 1968],
    ['THE SHINING', 1980], ['EYES WIDE SHUT', 1999], ['DOGTOOTH', 2009], ['THE LOBSTER', 2015], ['POOR THINGS', 2023],
    ['THE VIRGIN SUICIDES', 1999], ['LOST IN TRANSLATION', 2003], ['MARIE ANTOINETTE', 2006], ['REALITY BITES', 1994]];
  const POI = [['DAVID LYNCH', 'Eraserhead · Blue Velvet · Twin Peaks · Mulholland Dr.', 'dreams, electricity, curtains'],
    ['STANLEY KUBRICK', '2001 · A Clockwork Orange · The Shining · Eyes Wide Shut', 'one-point perspective'],
    ['YORGOS LANTHIMOS', 'Dogtooth · The Lobster · The Favourite · Poor Things', 'rules that make no sense'],
    ['SOFIA COPPOLA', 'The Virgin Suicides · Lost in Translation · Marie Antoinette', 'boredom as a colour']];
  const TV = [['ALTERNATIVE NATION', '11:00 PM'], ['120 MINUTES', 'SUN 12:00 AM'], ['MTV ODDITIES', '1:30 AM'], ['HEADBANGERS BALL', 'SAT 1:00 AM'], ['LIQUID TELEVISION', '12:30 AM']];
  const SLOGANS = ['FIRE WALK WITH ME', 'ALL WORK AND NO PLAY MAKES JACK A DULL BOY', 'PHYSICALLY UNABLE TO LEAVE A BAD CUT ALONE', 'THE AVERAGE WON', 'KEEP SECRETS'];
  const NOTES = ['the cut that lies', 'QC → pass?', 'continuity!!', 'frame 1 of 24', 'conform again', 'who decides?', 'rewind', 'too smooth = fake', 'bad cut — leave it', 'red room?', 'symmetry', 'room 237'];
  const STICKY = ['?', '#4', 'time?', '01:00:00:00', 'why?', '??', 'NOW', '#7', 'LYNCH?', 'SPLICE'];
  const EDL = n => { let t = 'TITLE: OPUS_R3_CONFORM\nFCM: NON-DROP FRAME\n\n'; for (let i = 1; i <= n; i++) {
    const a = 3600 + i * 7, b = a + 4 + (i % 5), tc = s => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, (i * 7) % 25].map(v => String(v).padStart(2, '0')).join(':');
    t += `${String(i).padStart(3, '0')}  A0${i % 9}  V  C  ${tc(a)} ${tc(b)}\n`; } return t; };
  const face = i => Stretch.FACES[i % Stretch.FACES.length];
  const ransom = (t, k) => [...t].map((ch, i) => { if (ch === ' ') return '<i class="sp"></i>';
    const f = face(k * 5 + i * 3), inv = (k + i) % 4 === 0, rot = ((i * 37 + k * 11) % 13) - 6;
    return `<b style="font-family:'${f.f}';font-weight:${f.w};font-style:${f.s};transform:rotate(${rot}deg)" class="${inv ? 'inv' : ''}">${ch}</b>`; }).join('');
  const CUTS = ['polygon(2% 4%,97% 0,100% 93%,4% 100%)', 'polygon(0 2%,100% 6%,95% 100%,3% 96%)', 'polygon(5% 0,100% 3%,97% 97%,0 100%,2% 50%)',
    'polygon(0 0,92% 4%,100% 60%,96% 100%,6% 94%)', 'none', 'polygon(3% 6%,50% 0,98% 5%,100% 98%,0 95%)'];
  const wob = (k, n, R) => Array.from({ length: n + 1 }, (_, i) => { const a = i / n * 6.9 + k, o = (Math.sin(i * 1.7 + k * 3) * .09 + 1) * R; return `${i ? 'L' : 'M'}${(60 + Math.cos(a) * o * 1.25).toFixed(1)},${(50 + Math.sin(a) * o).toFixed(1)}`; }).join('');
  const SCRIB = k => [`<path d="${wob(k, 40, 38)}"/>`, `<path d="M10 80 C40 60 60 40 100 18 M100 18 l-18 2 M100 18 l-6 16"/>`, `<path d="M20 20 L100 82 M100 20 L22 84"/>`, `<path d="M8 60 Q30 20 52 58 T96 52 T112 40"/>`][k % 4];
  const SIL = `<svg viewBox="0 0 100 110"><circle cx="50" cy="38" r="22"/><path d="M8 110 C12 78 30 66 50 66 C70 66 88 78 92 110Z"/></svg>`;   // a generic head: nobody's likeness

  function build({ OFF, left, width, top, height }) {
    const out = [], pins = [];
    let k = 0;
    const place = (w, h) => { const o = OFF[(k * 13 + 5) % OFF.length], o2 = OFF[(k * 7 + 19) % OFF.length]; k++;
      const x = left + ((k * .6180339) % 1) * (width - w) + o[0] * 60, y = top + (Math.abs(o[1]) * (height - h - 30)) + 8;
      return { x, y, r: (o2[0] * 26).toFixed(1), s: (.78 + Math.abs(o[0] * o2[1]) * .7).toFixed(2), d: (.4 + Math.abs(o2[1]) * 1.6).toFixed(2), z: 4 + (k % 14) }; };
    const add = (cls, w, h, inner, pin = true) => { const p = place(w, h || 120);
      out.push(`<div class="sc ${cls}" style="left:${p.x.toFixed(0)}px;top:${p.y.toFixed(0)}px;width:${w}px;${h ? `height:${h}px;` : ''}--r:${p.r}deg;--s:${p.s};--depth:${p.d};z-index:${p.z};--cut:${CUTS[k % CUTS.length]}">${inner}</div>`);
      if (pin) pins.push([p.x + w / 2, p.y + 6]); };
    // film history, as xeroxed prints, polaroids and camcorder frames
    PD.forEach(([src, cap], i) => add(i % 2 ? 'print' : 'pol', 210 + (i % 3) * 30, 0, `<img src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer"><span>${cap}</span>`));
    PD.slice(0, 3).forEach(([src], i) => add('cam', 250, 0, `<img src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer"><b>● REC</b><em>${['JUN 14 1996', 'OCT 02 1998', 'AUG 30 1994'][i]}  ${['11:42 PM', '03:15 AM', '09:01 PM'][i]}</em><i>SP</i>`));
    PD.slice(0, 3).forEach(([src], i) => add('duo d' + i, 190, 0, `<img src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer">`, i !== 1));
    add('strip', 380, 92, PD.slice(0, 4).map(([s]) => `<i style="background-image:url('${s}')"></i>`).join(''), false);
    // persons of interest: the directors (no photos)
    POI.forEach(([n, films, note], i) => add('poi', 220, 0, `<b class="tag">PERSON OF INTEREST · Nº ${String(i + 1).padStart(2, '0')}</b><div class="sil">${SIL}</div><strong>${n}</strong><small>${films}</small><em>${note}</em>`));
    // tickets to the films
    FILMS.forEach(([t, y], i) => add('ticket' + (i % 3 === 2 ? ' tk2' : ''), 190, 0, `<b>ADMIT ONE</b><strong>${t}</strong><em>${y} · Nº ${String(4719 + i * 233).padStart(6, '0')}</em>`, i % 2 === 0));
    // TV guide clippings
    TV.forEach(([t, time]) => add('tv', 220, 0, `<small>TONIGHT</small><b>${t}</b><em>${time} · CH 33</em>`));
    // homage motifs, drawn in code
    add('curtain', 200, 160, '<i></i>'); add('zig', 180, 120, ''); add('corridor', 210, 150, '<svg viewBox="0 0 200 140"><rect x="1" y="1" width="198" height="138"/><rect x="80" y="50" width="40" height="38"/><path d="M1 1L80 50M199 1L120 50M1 139L80 88M199 139L120 88"/></svg>');
    // countdown leaders: circles
    [8, 3, 5].forEach(n => add('leader', 140, 140, `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="36"/><path d="M50 0V100M0 50H100"/><text x="50" y="62">${n}</text></svg>`, false));
    [14, 9].forEach(n => add('edl', 270, 0, `<pre>${EDL(n)}</pre>`));
    SLOGANS.forEach((t, i) => add('ransom', Math.min(600, 24 * t.length), 0, ransom(t, i), false));
    STICKY.forEach((t, i) => add('sticky' + (i % 3 ? '' : ' y2'), 92, 88, `<span>${t}</span>`, false));
    NOTES.forEach((t, i) => add('marker' + (i % 2 ? ' m2' : ''), 220, 0, t, false));
    ['WHATEVER', 'TAPE IT', 'REWIND', 'LIVE', 'BE KIND', 'X', 'ODD'].forEach((t, i) => add('glo g' + (i % 3), 116, 116, `<span>${t}</span>`, false));
    Array.from({ length: 3 }, () => add('static', 200, 150, '<canvas width="100" height="75"></canvas>', false));
    Array.from({ length: 4 }, () => add('ring', 150, 150, '', false));
    Array.from({ length: 6 }, () => add('staple', 34, 7, '', false));
    Array.from({ length: 12 }, (_, i) => add('scrib s' + (i % 3), 130, 110, `<svg viewBox="0 0 120 100">${SCRIB(i)}</svg>`, false));
    Array.from({ length: 9 }, (_, i) => add('tape t' + (i % 3), 110 + (i % 4) * 30, 22, '', false));
    add('vhs', 290, 56, `<b>EDIT SUITE · REEL 03</b><em>SP · 2:00 · DO NOT ERASE</em>`);
    add('cassette', 230, 150, `<div class="cl">MIXTAPE — for the night conform</div><div class="cw"><i></i><i></i></div>`);
    add('pass', 150, 200, `<b>ALL AREA</b><em>edit suite B</em><strong>PASS</strong><small>NIGHT SHIFT</small>`);
    add('pass p2', 150, 200, `<b>BACKSTAGE</b><em>Opus Post</em><strong>2nd</strong><small>2014 – 2018</small>`);
    return { html: out.join(''), pins };
  }
  // real-looking string: a sagging twine between two pins, with a twist highlight, a cast shadow and a knot at each end
  function twine(a, b, i) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), sag = Math.min(70, L * .07) + (i % 3) * 3;
    const mx = (a[0] + b[0]) / 2 + (i % 2 ? 6 : -6), my = (a[1] + b[1]) / 2 + sag, d = `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
    return `<path class="tw-sh" d="${d}" transform="translate(3 5)"/><path class="tw" d="${d}"/><path class="tw-hi" d="${d}"/>`
      + `<circle class="knot" cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="2.6"/><circle class="knot" cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="2.6"/>`;
  }
  function live(root) {
    const cs = [...root.querySelectorAll('.sc.static canvas')]; if (!cs.length) return;
    const ctxs = cs.map(c => c.getContext('2d'));
    const tick = () => { ctxs.forEach(x => { const d = x.createImageData(100, 75); for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255 | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); }); };
    tick(); clearInterval(live.t); live.t = setInterval(tick, 125);
  }
  return { build, live, twine };
})();
