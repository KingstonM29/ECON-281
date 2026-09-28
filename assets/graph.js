/* Tiny SVG plotting helper used by every interactive figure.
   Coordinates passed to drawing methods are in data units (quantities of goods). */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function niceStep(max, target = 6) {
    const raw = max / target;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const n = raw / mag;
    return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
  }
  function niceCeil(v) {
    const s = niceStep(v);
    return Math.ceil(v / s - 1e-9) * s;
  }
  function fmt(v, d = 2) {
    if (v === Infinity) return '∞';
    if (!isFinite(v)) return '–';
    const p = Math.pow(10, d);
    const r = Math.round(v * p) / p;
    return String(Math.abs(r) < 1e-9 ? 0 : r);
  }
  const reducedMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Eased animation from 0 to 1. Returns a cancel function.
  function tween(ms, step, done) {
    if (reducedMotion() || ms <= 0) { step(1); if (done) done(); return () => {}; }
    let t0 = null, raf, stopped = false;
    function frame(t) {
      if (stopped) return;
      if (t0 == null) t0 = t;
      const k = Math.min(1, (t - t0) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      step(e);
      if (k < 1) raf = requestAnimationFrame(frame); else if (done) done();
    }
    raf = requestAnimationFrame(frame);
    return () => { stopped = true; cancelAnimationFrame(raf); };
  }

  class Plot {
    constructor(container, o = {}) {
      this.o = Object.assign({ w: 460, h: 400, xmax: 12, ymax: 12, xlabel: 'Quantity of X', ylabel: 'Quantity of Y' }, o);
      this.m = Object.assign({ l: 46, r: 20, t: 34, b: 48 }, o.m || {});
      const { w, h } = this.o;
      this.id = ++uid;
      this.svg = el('svg', { viewBox: `0 0 ${w} ${h}`, class: 'plot', role: 'img' }, container);
      const defs = el('defs', null, this.svg);
      const cp = el('clipPath', { id: 'clip' + this.id }, defs);
      this.clipRect = el('rect', null, cp);
      this.gGrid = el('g', { class: 'grid' }, this.svg);
      this.gAxes = el('g', { class: 'axes' }, this.svg);
      this.gData = el('g', { 'clip-path': `url(#clip${this.id})` }, this.svg);
      this.gTop = el('g', null, this.svg);
      this.gHandles = el('g', null, this.svg);
      this.handles = [];
      this.drawAxes();
    }
    get pw() { return this.o.w - this.m.l - this.m.r; }
    get ph() { return this.o.h - this.m.t - this.m.b; }
    sx(x) { return this.m.l + (x / this.o.xmax) * this.pw; }
    sy(y) { return this.m.t + this.ph - (y / this.o.ymax) * this.ph; }
    ix(px) { return ((px - this.m.l) / this.pw) * this.o.xmax; }
    iy(py) { return ((this.m.t + this.ph - py) / this.ph) * this.o.ymax; }

    setDomain(xmax, ymax) {
      this.o.xmax = xmax; this.o.ymax = ymax;
      this.drawAxes();
      this.handles.forEach(h => h.set(h.x, h.y));
    }
    setLabels(xlabel, ylabel) { this.o.xlabel = xlabel; this.o.ylabel = ylabel; this.drawAxes(); }

    drawAxes() {
      const { l, t } = this.m, pw = this.pw, ph = this.ph, { xmax, ymax } = this.o;
      this.gGrid.textContent = ''; this.gAxes.textContent = '';
      this.svg.setAttribute('aria-label', `Graph with ${this.o.xlabel} on the horizontal axis and ${this.o.ylabel} on the vertical axis`);
      for (const [k, v] of Object.entries({ x: l - 2, y: t - 2, width: pw + 4, height: ph + 4 })) this.clipRect.setAttribute(k, v);
      const xs = niceStep(xmax), ys = niceStep(ymax);
      for (let v = xs; v <= xmax + 1e-9; v += xs) {
        const X = this.sx(v);
        el('line', { x1: X, x2: X, y1: t, y2: t + ph }, this.gGrid);
        el('text', { x: X, y: t + ph + 17, 'text-anchor': 'middle' }, this.gAxes).textContent = fmt(v, 3);
      }
      for (let v = ys; v <= ymax + 1e-9; v += ys) {
        const Y = this.sy(v);
        el('line', { x1: l, x2: l + pw, y1: Y, y2: Y }, this.gGrid);
        el('text', { x: l - 8, y: Y + 4, 'text-anchor': 'end' }, this.gAxes).textContent = fmt(v, 3);
      }
      el('text', { x: l - 8, y: t + ph + 17, 'text-anchor': 'end' }, this.gAxes).textContent = '0';
      el('line', { x1: l, y1: t - 6, x2: l, y2: t + ph, class: 'axis' }, this.gAxes);
      el('line', { x1: l, y1: t + ph, x2: l + pw + 6, y2: t + ph, class: 'axis' }, this.gAxes);
      el('text', { x: l + pw, y: t + ph + 38, 'text-anchor': 'end', class: 'axis-label' }, this.gAxes).textContent = this.o.xlabel + ' →';
      el('text', { x: l - 4, y: t - 14, 'text-anchor': 'start', class: 'axis-label' }, this.gAxes).textContent = '↑ ' + this.o.ylabel;
    }

    clear() { this.gData.textContent = ''; this.gTop.textContent = ''; }
    _g(top) { return top ? this.gTop : this.gData; }
    line(x1, y1, x2, y2, cls, top) {
      return el('line', { x1: this.sx(x1), y1: this.sy(y1), x2: this.sx(x2), y2: this.sy(y2), class: cls }, this._g(top));
    }
    path(pts, cls, close, top) {
      const d = pts.map((p, i) => (i ? 'L' : 'M') + this.sx(p[0]).toFixed(2) + ',' + this.sy(p[1]).toFixed(2)).join('') + (close ? 'Z' : '');
      return el('path', { d, class: cls }, this._g(top));
    }
    fn(f, x0, x1, cls, n = 180) {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const x = x0 + ((x1 - x0) * i) / n;
        let y = f(x);
        if (!isFinite(y)) continue;
        pts.push([x, Math.min(y, this.o.ymax * 4)]);
      }
      return pts.length > 1 ? this.path(pts, cls) : null;
    }
    rect(x0, y0, x1, y1, cls) {
      return el('rect', {
        x: this.sx(Math.min(x0, x1)), y: this.sy(Math.max(y0, y1)),
        width: Math.abs(this.sx(x1) - this.sx(x0)), height: Math.abs(this.sy(y1) - this.sy(y0)), class: cls,
      }, this.gData);
    }
    dot(x, y, r, cls) { return el('circle', { cx: this.sx(x), cy: this.sy(y), r, class: cls }, this.gTop); }
    text(x, y, s, cls, dx = 0, dy = 0, anchor = 'start') {
      const e = el('text', { x: this.sx(x) + dx, y: this.sy(y) + dy, class: cls || 'lbl', 'text-anchor': anchor }, this.gTop);
      e.textContent = s;
      return e;
    }
    arrow(x1, y1, x2, y2, cls = 'arr') {
      const X1 = this.sx(x1), Y1 = this.sy(y1), X2 = this.sx(x2), Y2 = this.sy(y2);
      const len = Math.hypot(X2 - X1, Y2 - Y1);
      if (len < 14) return;
      const ux = (X2 - X1) / len, uy = (Y2 - Y1) / len, s = 9;
      el('line', { x1: X1, y1: Y1, x2: X2 - ux * s * 0.8, y2: Y2 - uy * s * 0.8, class: cls }, this.gTop);
      const pts = [[X2, Y2], [X2 - ux * s - uy * s * 0.6, Y2 - uy * s + ux * s * 0.6], [X2 - ux * s + uy * s * 0.6, Y2 - uy * s - ux * s * 0.6]];
      el('polygon', { points: pts.map(p => p.join(',')).join(' '), class: cls }, this.gTop);
    }
    // Pixel-length of a data-space direction, used to draw fixed-size tangent segments.
    pxPerUnit() { return { x: this.pw / this.o.xmax, y: this.ph / this.o.ymax }; }

    // A draggable, keyboard-operable point. onMove(x, y) decides where it actually goes (call h.set).
    handle(x, y, { onMove, label = 'Draggable bundle', step } = {}) {
      const g = el('g', { class: 'handle', tabindex: 0, role: 'slider', 'aria-label': label }, this.gHandles);
      el('circle', { r: 20, class: 'halo' }, g);
      el('circle', { r: 8, class: 'knob' }, g);
      const h = {
        x, y, g,
        set: (nx, ny) => {
          h.x = nx; h.y = ny;
          g.setAttribute('transform', `translate(${this.sx(nx).toFixed(2)},${this.sy(ny).toFixed(2)})`);
          g.setAttribute('aria-valuetext', `(${fmt(nx)}, ${fmt(ny)})`);
        },
        show: (on) => g.setAttribute('visibility', on ? 'visible' : 'hidden'),
      };
      h.set(x, y);
      const toData = (ev) => {
        const pt = this.svg.createSVGPoint();
        pt.x = ev.clientX; pt.y = ev.clientY;
        const p = pt.matrixTransform(this.svg.getScreenCTM().inverse());
        return [clamp(this.ix(p.x), 0, this.o.xmax), clamp(this.iy(p.y), 0, this.o.ymax)];
      };
      let dragging = false;
      g.addEventListener('pointerdown', (ev) => {
        dragging = true;
        try { this.svg.setPointerCapture(ev.pointerId); } catch (e) { /* older browsers */ }
        ev.preventDefault();
        g.focus({ preventScroll: true });
      });
      this.svg.addEventListener('pointermove', (ev) => { if (dragging) onMove(...toData(ev)); });
      const end = () => { dragging = false; };
      this.svg.addEventListener('pointerup', end);
      this.svg.addEventListener('pointercancel', end);
      g.addEventListener('keydown', (ev) => {
        const s = step || Math.max(this.o.xmax, this.o.ymax) / 50;
        const d = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, s], ArrowDown: [0, -s] }[ev.key];
        if (!d) return;
        ev.preventDefault();
        onMove(clamp(h.x + d[0], 0, this.o.xmax), clamp(h.y + d[1], 0, this.o.ymax));
      });
      this.handles.push(h);
      return h;
    }
  }

  window.Graph = { Plot, el, fmt, tween, niceStep, niceCeil, clamp, reducedMotion };
})();
