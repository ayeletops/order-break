/* LATENT FIELD
   The rings (ages) never move. The field of words moves beneath them.
   The word nearest the centre becomes the centre. Projects: one sample panel on hover/focus, the whole PDF on click.
   Positions are placeholders — Ayelet places them.
*/
(() => {
  const W = [
    // regions of interest
    { t: 'Biology',       x: -300, y: -170, k: 'region' },
    { t: 'Governance',    x:  320, y: -190, k: 'region' },
    { t: 'Communication', x: -270, y:  200, k: 'region' },
    { t: 'Freedom',       x:  330, y:  180, k: 'region' },
    // projects: title + one sample image + full pdf
    { t: 'Vaccine Futures',     x:  -60, y: -230, k: 'proj', img: 'assets/img/gn-13-petri-dish.jpg',  pdf: 'assets/pdf/vaccine-futures.pdf', note: 'graphic novel' },
    { t: 'Opt-Out Society',     x:   10, y: -110, k: 'proj', img: 'assets/img/gn-09-opt-out-kit.jpg', pdf: 'assets/pdf/opt-out-society.pdf', note: 'speculative design' },
    { t: 'Frequencies',         x:   40, y:   90, k: 'proj', img: 'assets/img/proj-frequencies.jpg',  pdf: 'assets/pdf/frequencies.pdf', note: 'data viz' },
    { t: 'Urban Healing',       x: -470, y:   10, k: 'proj', img: 'assets/img/proj-urban-healing.jpg', pdf: 'assets/pdf/urban-healing.pdf', note: 'ecology' },
    { t: 'In the Zone',         x:  180, y:  310, k: 'proj', img: 'assets/img/proj-in-the-zone.jpg',  pdf: 'assets/pdf/in-the-zone.pdf', note: 'thesis' },
    { t: 'Learn not Confirm',   x: -120, y:  330, k: 'proj', img: 'assets/img/proj-resonance.jpg',    pdf: 'assets/pdf/learn-not-confirm.pdf', note: 'system' },
    { t: 'Calculating Empires', x:  170, y: -350, k: 'proj', img: 'assets/img/proj-calculating-empires.jpg', pdf: 'assets/pdf/calculating-empires.pdf', note: 'essay' },
    { t: 'This and That',       x: -480, y: -330, k: 'proj', img: 'assets/img/proj-this-and-that.jpg', pdf: 'assets/pdf/this-and-that.pdf', note: 'future burial' },
    { t: 'Peres Center',        x:  520, y:  -20, k: 'proj', img: 'assets/img/proj-peres.jpg', pdf: null, note: 'lab · client deck held back' },
  ];
  const field = document.getElementById('field'), layer = document.getElementById('layer');
  const panel = document.getElementById('panel'), pImg = document.getElementById('panel-img'), pTitle = document.getElementById('panel-title'),
        pLink = document.getElementById('panel-link'), pAct = document.getElementById('panel-act'), centre = document.getElementById('centre');
  let off = { x: 0, y: 0 }, start = null, moved = false, focused = null;

  W.forEach(w => {
    const d = document.createElement('span');
    d.className = 'w ' + w.k; d.textContent = w.t; d.style.left = w.x + 'px'; d.style.top = w.y + 'px';
    d.addEventListener('click', () => { if (moved) return; if (w === focused && w.pdf) open(w.pdf, '_blank', 'noopener'); else go(w); });
    d.addEventListener('mouseenter', () => show(w));
    d.addEventListener('mouseleave', () => show(focused));
    w.el = d; layer.appendChild(d);
  });

  function show(w) {
    if (!w || w.k !== 'proj') { panel.classList.remove('on'); return; }
    pImg.src = w.img; pTitle.textContent = `${w.t} — ${w.note}`;
    if (w.pdf) { pLink.href = w.pdf; pAct.textContent = 'open pdf ↗'; } else { pLink.removeAttribute('href'); pAct.textContent = 'not public'; }
    panel.classList.add('on');
  }
  function place(ease) {
    layer.classList.toggle('ease', !!ease);
    layer.style.transform = `translate(${off.x}px,${off.y}px)`;
    let best = null, bd = Infinity;
    W.forEach(w => {
      const dx = w.x + off.x, dy = w.y + off.y, dd = dx * dx + dy * dy;
      if (dd < bd) { bd = dd; best = w; }
      w.el.style.opacity = Math.max(.22, 1 - Math.sqrt(dd) / 650);
    });
    W.forEach(w => w.el.classList.toggle('focus', w === best));
    return best;
  }
  function go(w) { off = { x: -w.x, y: -w.y }; focused = place(true); centre.textContent = w.t; show(w); }

  field.addEventListener('pointerdown', e => { if (panel.contains(e.target)) return; start = { x: e.clientX - off.x, y: e.clientY - off.y }; moved = false; field.classList.add('drag'); });
  field.addEventListener('pointermove', e => {
    if (!start) return;
    const nx = e.clientX - start.x, ny = e.clientY - start.y;
    if (!moved && Math.abs(nx - off.x) + Math.abs(ny - off.y) > 3) { moved = true; field.setPointerCapture(e.pointerId); }
    if (!moved) return;
    off = { x: nx, y: ny }; const b = place(false); centre.textContent = b.t;
  });
  const end = () => { if (!start) return; start = null; field.classList.remove('drag'); if (moved) go(place(false)); setTimeout(() => moved = false, 0); };
  field.addEventListener('pointerup', end); field.addEventListener('pointercancel', end);
  addEventListener('keydown', e => {   // keyboard travel: arrow keys move to the nearest word in that direction
    const dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!dir || !focused) return;
    const cands = W.filter(w => w !== focused && ((w.x - focused.x) * dir[0] + (w.y - focused.y) * dir[1]) > 0);
    if (!cands.length) return;
    cands.sort((a, b) => Math.hypot(a.x - focused.x, a.y - focused.y) - Math.hypot(b.x - focused.x, b.y - focused.y));
    go(cands[0]);
  });
  // circular grid: rings as filled discs, largest at the back, alternating millennial pink and butter yellow
  [...document.querySelectorAll('.rings span')].map(r => [r, r.getBoundingClientRect().height])
    .sort((a, b) => b[1] - a[1]).forEach(([r], i) => { r.style.zIndex = i; r.style.setProperty('--c', i % 2 ? 'var(--butter)' : 'var(--pink)'); });
  go(W[0]);
})();
