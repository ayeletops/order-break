/* WORK · CHAOS — the board. Photographs only, pinned on a real board.
   Images: whatever Ayelet drops into assets/board/ (listed by tools/board-manifest.py into js/board-manifest.js),
   plus a few public-domain photographs of early cinema. Materials (cork, string, pin) come from assets/board/materials/ when present.
   Each photo is printed: white border, slight curl, paper sheen, a soft real shadow. Positions come from the secret offsets.
*/
window.Board = (() => {
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
  const PD = [   // public-domain photographs, verified to load
    WM + 'd/d2/The_Horse_in_Motion_high_res.jpg/500px-The_Horse_in_Motion_high_res.jpg',
    WM + 'd/dd/Muybridge_race_horse_animated.gif/500px-Muybridge_race_horse_animated.gif',
    WM + '0/04/Le_Voyage_dans_la_lune.jpg/500px-Le_Voyage_dans_la_lune.jpg',
    WM + '0/0b/Kinetoscope.jpg/500px-Kinetoscope.jpg',
  ];
  // a real cork photograph (PAKUTASO, free for any use) until a cork.jpg is dropped into materials/
  const CORK = 'https://cdn.pakutaso.com/shared/img/thumb/YUKI1211A1139_TP_V.jpg';
  const M = () => Object.assign({ cork: CORK }, (window.BOARD && BOARD.materials) || {});
  function build({ OFF, left, width, top, height }) {
    const imgs = ((window.BOARD && BOARD.images) || []).concat(PD), out = [], pins = [];
    let k = 0;
    const many = imgs.length < 18 ? Math.ceil(18 / imgs.length) : 1;            // fill the board even with few photos
    for (let rep = 0; rep < many; rep++) imgs.forEach((src, i) => {
      const o = OFF[(k * 13 + 5) % OFF.length], o2 = OFF[(k * 7 + 19) % OFF.length]; k++;
      const w = Math.round(150 + Math.abs(o2[0]) * 150), x = left + ((k * .6180339) % 1) * (width - w) + o[0] * 70, y = top + Math.abs(o[1]) * (height - w * .8) + 6;
      const kind = (i + rep) % 4 === 0 ? 'pol' : 'print', curl = (o2[1] * 6).toFixed(1);
      const corner = /\/s-\d/.test(src);                                           // cut from a saved board: the pin goes top-right
      out.push(`<figure class="ph ${kind}${corner ? ' tr' : ''}" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${w}px;--r:${(o2[0] * 16).toFixed(1)}deg;--curl:${curl}deg;--depth:${(.4 + Math.abs(o2[1]) * 1.5).toFixed(2)};z-index:${5 + (k % 15)}">`
        + `<img src="${src}" alt="" decoding="async" referrerpolicy="no-referrer"><i class="sheen"></i>${pin()}</figure>`);
      pins.push(corner ? [x + w * .86, y + w * .13] : [x + w / 2, y + 10]);
    });
    return { html: out.join(''), pins };
  }
  const pin = () => M().pin ? `<img class="pin img" src="${M().pin}" alt="">` : '<b class="pin"></b>';
  // string: a real string photo laid along the curve in short rotated segments; otherwise a twisted twine
  function twine(a, b, i) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), sag = Math.min(80, L * .08) + (i % 3) * 4;
    const mx = (a[0] + b[0]) / 2 + (i % 2 ? 8 : -8), my = (a[1] + b[1]) / 2 + sag;
    const d = `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
    if (M().string) {
      const n = Math.max(3, Math.round(L / 26)), seg = [], q = t => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
      for (let j = 0; j < n; j++) { const p0 = q(j / n), p1 = q((j + 1) / n), ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180 / Math.PI, len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + 2;
        seg.push(`<image href="${M().string}" x="0" y="-2.5" width="${len.toFixed(1)}" height="5" preserveAspectRatio="none" transform="translate(${p0[0].toFixed(1)} ${p0[1].toFixed(1)}) rotate(${ang.toFixed(1)})"/>`); }
      return `<path class="tw-sh" d="${d}" transform="translate(3 6)"/>${seg.join('')}`;
    }
    return `<path class="tw-sh" d="${d}" transform="translate(3 6)"/><path class="tw" d="${d}"/><path class="tw-hi" d="${d}"/><path class="tw-hi2" d="${d}"/>`;
  }
  const live = () => {};
  const material = () => M();
  return { build, live, twine, material };
})();
