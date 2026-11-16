// Functional test: load each page with its scripts, exercise the controls, report errors.
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path'), fs = require('fs');
const ROOT = process.argv[2];
const fakeCtx = new Proxy({}, { get: (t, k) => k === 'measureText' ? () => ({ actualBoundingBoxLeft: 1, actualBoundingBoxRight: 10, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 2, width: 11 })
  : k === 'createImageData' || k === 'getImageData' ? (w, h) => ({ data: new Uint8ClampedArray((w || 1) * (h || 1) * 4) })
  : k === 'createRadialGradient' || k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : (typeof k === 'string' ? (() => {}) : undefined), set: () => true });
async function run(page, steps) {
  const errors = [];
  const vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(String(e.message || e).slice(0, 200))); vc.on('error', e => errors.push(String(e).slice(0, 200)));
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const dom = new JSDOM(html, { url: 'file://' + path.join(ROOT, page), runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = () => fakeCtx; w.HTMLCanvasElement.prototype.toDataURL = () => 'data:,';
      w.ResizeObserver = class { observe() {} disconnect() {} };
      w.matchMedia = () => ({ matches: false, addEventListener() {} });
      w.document.fonts = { load: () => Promise.resolve(), ready: Promise.resolve() };
      Object.defineProperty(w.HTMLElement.prototype, 'clientHeight', { get() { return 700; } });
      Object.defineProperty(w.HTMLElement.prototype, 'clientWidth', { get() { return 1280; } });
      w.scrollTo = () => {};
    } });
  await new Promise(r => dom.window.addEventListener('load', r));
  await new Promise(r => setTimeout(r, 400));
  const out = {};
  try { await steps(dom.window, out); } catch (e) { errors.push('TEST: ' + e.message); }
  dom.window.close();
  return { page, ...out, errors: [...new Set(errors)] };
}
const click = (w, sel) => { const el = w.document.querySelector(sel); if (!el) throw new Error('missing ' + sel); el.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); };
(async () => {
  const R = [];
  R.push(await run('index.html', async (w, o) => {
    const d = w.document; o.slots = d.querySelectorAll('#cover .st-slot').length;
    click(w, '.switch button[data-w=sella_vie]'); await new Promise(r => setTimeout(r, 900));
    o.switched = d.getElementById('cover').getAttribute('aria-label'); o.stance = !!d.querySelector('#stance .col');
    o.nav = [...d.querySelectorAll('.nav a')].map(a => a.textContent + (a.hasAttribute('aria-current') ? '*' : '')).join(' | ');
  }));
  R.push(await run('work.html', async (w, o) => {
    const d = w.document, tr = d.getElementById('track');
    o.cats = d.querySelectorAll('.cat').length; o.roles = d.querySelectorAll('.role').length; o.scraps = d.querySelectorAll('.sc, .ph').length;
    o.strings = d.querySelectorAll('.strings path').length; o.rings = d.querySelectorAll('.chaos .ring').length;
    o.ownImages = [...d.querySelectorAll('.sc img')].filter(i => /assets\//.test(i.getAttribute('src'))).length;
    o.startChaos = !tr.classList.contains('grid');
    click(w, '.views [data-v=grid]'); o.afterNotToBe = tr.classList.contains('grid') ? 'grid' : 'chaos';
    click(w, '.views [data-v=chaos]'); o.afterToBe = tr.classList.contains('grid') ? 'grid' : 'chaos';
  }));
  R.push(await run('roi.html', async (w, o) => {
    const d = w.document, f = d.getElementById('field');
    o.nodes = d.querySelectorAll('.n').length; o.projects = d.querySelectorAll('.n.proj').length;
    click(w, '.views [data-v=grid]'); await new Promise(r => setTimeout(r, 50)); o.grid = f.classList.contains('gridview');
    click(w, '.views [data-v=chaos]'); o.back = !f.classList.contains('gridview');
    click(w, '.n.lv2'); o.dict = d.getElementById('def').classList.contains('on');
  }));
  R.push(await run('horizon.html', async (w, o) => { o.canvas = !!w.document.getElementById('sky'); }));
  R.push(await run('process.html', async (w, o) => { o.stage = !!w.document.getElementById('stage'); }));
  console.log(JSON.stringify(R, null, 1));
})();
