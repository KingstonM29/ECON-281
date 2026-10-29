/* Chapter 6 interactive figures: short-run production (MPL/APL), isoquants and MRTS,
   returns to scale, and technological change (the Amazon example). */
(function () {
  const { Plot, fmt, tween, niceCeil } = Graph;
  const { mk, shell, slider, chips, readout, verdict, button, row, note } = UI;
  const reg = Study.registerWidget;

  /* ---------- 6.2 Total product, MPL and APL ---------- */
  const TABLE61 = [0, 10, 30, 60, 80, 95, 108, 112, 112, 108, 100];
  const SR = {
    sq: { label: 'q = L² (K = 1)', f: (L) => L * L, Lmax: 5, qmax: 25, unit: 'workers', note: 'MPL rises: division of labour.' },
    root: { label: 'q = √L (hundreds of hours)', f: (L) => 10 * Math.sqrt(L), Lmax: 9, qmax: 32, unit: 'hundred labour hours', note: 'MPL diminishes from the start.' },
    table: { label: 'Table 6.1 (K = 10)', f: (L) => TABLE61[Math.round(L)], Lmax: 10, qmax: 120, unit: 'workers', note: 'MPL rises, then diminishes once the fixed K is crowded.', discrete: true },
    linear: { label: 'q = 2L (constant MPL)', f: (L) => 2 * L, Lmax: 6, qmax: 14, unit: 'workers', note: 'MPL = APL = 2 throughout.' },
  };
  reg('tpCurve', (root, opts) => {
    const { plotEl, side } = shell(root, 'Total product, MPL and APL',
      'Add workers one at a time. Each coloured step on the top graph is the marginal product of that worker. The lower graph compares MPL with APL.');
    const top = new Plot(plotEl, { h: 320, xlabel: 'L', ylabel: 'Output, q' });
    const bot = new Plot(plotEl, { h: 260, m: { t: 30 }, xlabel: 'L', ylabel: 'MPL, APL' });
    bot.svg.classList.add('sub-plot');
    let cfg, L;
    const keys = Object.keys(SR);
    const pc = chips(side, keys.map((k) => SR[k].label), (i) => load(keys[i]));
    const box = mk('<div></div>'); side.appendChild(box);
    const tb = mk('<div class="table-wrap"><table class="compact"><thead><tr><th class="num">L</th><th class="num">q</th><th class="num">MPL</th><th class="num">APL</th></tr></thead><tbody></tbody></table></div>');
    side.appendChild(tb);
    const vd = verdict(side);
    function load(k) {
      cfg = SR[k]; L = Math.min(cfg.Lmax, 4);
      top.setDomain(cfg.Lmax + 0.5, cfg.qmax); top.setLabels(`L (${cfg.unit})`, 'Output, q');
      const mpls = [], apls = [];
      for (let i = 1; i <= cfg.Lmax; i++) { mpls.push(cfg.f(i) - cfg.f(i - 1)); apls.push(cfg.f(i) / i); }
      bot.setDomain(cfg.Lmax + 0.5, niceCeil(Math.max(...mpls, ...apls) * 1.15));
      box.innerHTML = '';
      slider(box, { label: 'Labour, L', min: 1, max: cfg.Lmax, step: 1, value: L, onInput: (v) => { L = v; draw(); } });
      draw();
    }
    function draw() {
      const f = cfg.f;
      top.clear(); bot.clear();
      if (cfg.discrete) top.path(TABLE61.slice(0, cfg.Lmax + 1).map((q, i) => [i, q]), 'curve c3');
      else top.fn(f, 0, cfg.Lmax + 0.5, 'curve c3');
      for (let i = 1; i <= L; i++) {
        top.line(i - 1, f(i - 1), i, f(i - 1), 'mu-step');
        top.line(i, f(i - 1), i, f(i), 'mu-bar' + (i === L ? ' hot' : ''));
      }
      top.dot(L, f(L), 6, 'pt-ic');
      top.text(L, f(L), `q = ${fmt(f(L))}`, 'lbl', -8, -12, 'end');
      const mp = [], ap = [];
      for (let i = 1; i <= cfg.Lmax; i++) { mp.push([i, f(i) - f(i - 1)]); ap.push([i, f(i) / i]); }
      bot.path(mp, 'curve ic'); bot.path(ap, 'curve c3');
      mp.forEach(([x, y]) => { if (y >= 0) bot.dot(x, y, x === L ? 6 : 3, x === L ? 'pt-ic' : 'pt'); });
      ap.forEach(([x, y]) => bot.dot(x, y, x === L ? 6 : 3, x === L ? 'pt-opt' : 'pt'));
      const top1 = mp.reduce((m, v) => (v[1] > m[1] ? v : m)); bot.text(top1[0], top1[1], 'MPL', 'clabel', 8, -8); bot.text(cfg.Lmax, ap[ap.length - 1][1], 'APL', 'clabel', 8, 4);
      const rows = [];
      for (let i = Math.max(1, L - 3); i <= Math.min(cfg.Lmax, L + 1); i++) rows.push(`<tr${i === L ? ' class="sel"' : ''}><td class="num">${i}</td><td class="num">${fmt(f(i))}</td><td class="num">${fmt(f(i) - f(i - 1))}</td><td class="num">${fmt(f(i) / i)}</td></tr>`);
      tb.querySelector('tbody').innerHTML = rows.join('');
      const m = f(L) - f(L - 1), a = f(L) / L, prevA = L > 1 ? f(L - 1) / (L - 1) : null;
      const rel = Math.abs(m - (prevA ?? m)) < 1e-9 ? 'MPL = APL, so APL stays the same' : m > (prevA ?? 0) ? 'MPL > APL, so APL rises' : 'MPL < APL, so APL falls';
      const mpPrev = L > 1 ? f(L - 1) - f(L - 2) : null;
      const trend = mpPrev == null ? '' : m > mpPrev + 1e-9 ? 'MPL is <b>increasing</b>: output grows at an increasing rate. ' : m < mpPrev - 1e-9 ? 'MPL is <b>diminishing</b>: output grows at a decreasing rate (K is fixed). ' : 'MPL is <b>constant</b>. ';
      vd.set(m < 0 ? 'bad' : 'ic', `Worker ${L} adds <b>${fmt(m)}</b> units (MPL); output per worker is ${fmt(a)} (APL). ${trend}Compared with the previous APL: ${rel}. ${cfg.note}`);
    }
    const first = keys.includes(opts.preset) ? opts.preset : 'table';
    pc.setActive(keys.indexOf(first)); load(first);
  });

  /* ---------- 6.3 Isoquants and MRTS ---------- */
  reg('isoquantLab', (root) => {
    const { plotEl, side } = shell(root, 'Isoquants and the MRTS',
      'Drag the input bundle. The magenta isoquant shows every (L, K) that makes the same output. MRTS of L for K = MPL/MPK = slope of the isoquant.');
    const p = new Plot(plotEl, { xmax: 12, ymax: 12, xlabel: 'Labour, L', ylabel: 'Capital, K' });
    let mode = 0, a = 0.5, P = [3, 6];
    const PRE = [['q = √(LK)', 0.5], ['Clothing: L^¾K^¼ (labour-intensive)', 0.75], ['Cars: L^¼K^¾ (capital-intensive)', 0.25]];
    const modeChips = chips(side, ['Cobb–Douglas', 'Perfect substitutes', 'Perfect complements'], (i) => { mode = i; build(); }, { active: [0] });
    const box = mk('<div style="display:grid;gap:10px"></div>'); side.appendChild(box);
    const rd = readout(side), vd = verdict(side);
    const h = p.handle(P[0], P[1], { label: 'Input bundle', onMove: (x, y) => { P = [Math.max(0.2, x), Math.max(0.2, y)]; draw(); } });
    const q = (L, K) => Math.pow(L, a) * Math.pow(K, 1 - a);
    function build() {
      box.innerHTML = '';
      if (mode === 0) {
        p.setLabels('Labour, L', 'Capital, K');
        const sl = slider(box, { label: 'Labour exponent a in q = L<sup>a</sup>K<sup>1−a</sup>', min: 0.15, max: 0.85, step: 0.05, value: a, onInput: (v) => { a = v; draw(); } });
        chips(box, PRE.map((x) => x[0]), (i) => { a = PRE[i][1]; sl.set(a); P = [3, 6]; draw(); });
      } else if (mode === 1) p.setLabels('High-capacity drives (10 TB)', 'Low-capacity drives (1 TB)');
      else p.setLabels('Bags of cereal', 'Boxes');
      h.show(mode === 0);
      draw();
    }
    function draw() {
      p.clear();
      if (mode === 0) {
        p.setDomain(12, 12);
        [5, 8].forEach((Q) => { p.fn((L) => Math.pow(Q / Math.pow(L, a), 1 / (1 - a)), 0.2, 12, 'curve faint'); });
        const Q = q(P[0], P[1]);
        p.fn((L) => Math.pow(Q / Math.pow(L, a), 1 / (1 - a)), 0.15, 12, 'curve ic');
        const mpl = a * Q / P[0], mpk = (1 - a) * Q / P[1], mrts = mpl / mpk;
        const u = p.pxPerUnit(), d = 55 / Math.hypot(u.x, mrts * u.y);
        p.line(P[0] - d, P[1] + mrts * d, P[0] + d, P[1] - mrts * d, 'tangent');
        h.set(P[0], P[1]);
        p.text(P[0], P[1], `q = ${fmt(Q)}`, 'lbl', 12, -12);
        rd.set([['Bundle (L, K)', `(${fmt(P[0], 1)}, ${fmt(P[1], 1)})`], ['MPL = a·q/L', fmt(mpl, 3)], ['MPK = (1−a)·q/K', fmt(mpk, 3)], ['MRTS of L for K', fmt(mrts)]]);
        vd.set('ic', `One more unit of labour replaces <b>${fmt(mrts)}</b> units of capital at this bundle. Move right along the isoquant: MPL falls, MPK rises, so the MRTS <b>diminishes</b> and the isoquant is convex. ${a > 0.5 ? 'Labour-intensive production: isoquants are steep.' : a < 0.5 ? 'Capital-intensive production: isoquants are flat.' : ''}`);
      } else if (mode === 1) {
        p.setDomain(4, 40);
        [10, 20, 30].forEach((Q, i) => { p.line(0, Q, Q / 10, 0, i === 2 ? 'curve ic' : 'curve faint'); p.text(0, Q, `q = ${Q} TB`, 'ilabel', 8, -4); });
        rd.set([['MRTS (high for low)', '10, constant'], ['Shape', 'Straight lines']]);
        vd.set('ic', 'One high-capacity drive (10 TB) always replaces 10 low-capacity drives (1 TB). MRTS is <b>constant</b>, so isoquants are straight lines: perfect substitutes.');
      } else {
        p.setDomain(4, 4);
        [1, 2, 3].forEach((k) => { p.path([[k, 4], [k, k], [4, k]], k === 3 ? 'curve ic' : 'curve faint'); p.dot(k, k, 4, 'pt'); p.text(k, k, `q = ${k}`, 'ilabel', 6, 14); });
        rd.set([['Fixed ratio', '1 bag : 1 box'], ['Shape', 'L-shaped']]);
        vd.set('ic', 'Each box needs exactly one bag of cereal. Extra bags without boxes (or boxes without bags) add no output: <b>perfect complements</b>, L-shaped isoquants.');
      }
    }
    build();
  });

  /* ---------- 6.4 Returns to scale ---------- */
  reg('returnsScale', (root) => {
    const { plotEl, side } = shell(root, 'Double every input: what happens to output?',
      'q = L<sup>a</sup>K<sup>b</sup>. Start at (5, 5) and double both inputs. If output more than doubles: IRTS. Exactly doubles: CRTS. Less than doubles: DRTS.');
    const p = new Plot(plotEl, { xmax: 22, ymax: 22, xlabel: 'Labour, L', ylabel: 'Capital, K' });
    let A = 0.25, B = 0.25;
    const PRE = [['DRTS: L^¼K^¼ (lecture)', 0.25, 0.25], ['CRTS: √(LK)', 0.5, 0.5], ['IRTS: L^¾K^¾', 0.75, 0.75]];
    let sa, sb;
    chips(side, PRE.map((x) => x[0]), (i) => { A = PRE[i][1]; B = PRE[i][2]; sa.set(A); sb.set(B); draw(); }, { active: [0] });
    sa = slider(side, { label: 'Exponent on L, a', min: 0.1, max: 1, step: 0.05, value: A, onInput: (v) => { A = v; draw(); } });
    sb = slider(side, { label: 'Exponent on K, b', min: 0.1, max: 1, step: 0.05, value: B, onInput: (v) => { B = v; draw(); } });
    const rd = readout(side), vd = verdict(side);
    const q = (L, K) => Math.pow(L, A) * Math.pow(K, B);
    const iso = (Q) => (L) => Math.pow(Q / Math.pow(L, A), 1 / B);
    function draw() {
      p.clear();
      const q1 = q(5, 5), q2 = q(10, 10), q4 = q(20, 20);
      p.line(0, 0, 22, 22, 'curve ray');
      p.fn(iso(q1), 0.5, 22, 'curve faint'); p.fn(iso(q2), 0.5, 22, 'curve ic'); p.fn(iso(2 * q1), 0.5, 22, 'curve opt');
      p.dot(5, 5, 6, 'pt'); p.dot(10, 10, 6, 'pt-ic');
      p.text(5, 5, `(5,5): q = ${fmt(q1)}`, 'lbl', 10, 16); p.text(10, 10, `(10,10): q = ${fmt(q2)}`, 'lbl', 10, 16);
      const m = Math.pow(2, A + B);
      rd.set([['a + b', fmt(A + B)], ['q(5, 5)', fmt(q1, 3)], ['q(10, 10)', fmt(q2, 3)], ['q(20, 20)', fmt(q4, 3)], ['Output multiplier from doubling', '×' + fmt(m, 3)]]);
      const kind = Math.abs(A + B - 1) < 1e-9 ? 'CRTS' : A + B > 1 ? 'IRTS' : 'DRTS';
      vd.set(kind === 'IRTS' ? 'good' : kind === 'DRTS' ? 'bad' : 'ic', `Doubling inputs multiplies output by ${fmt(m, 3)}: <b>${kind}</b>. ${kind === 'IRTS' ? 'Output more than doubles (e.g. fixed R&D/design inputs).' : kind === 'DRTS' ? `Output less than doubles (coordination problems, regulatory burden). To double output from ${fmt(q1, 3)} the firm must quadruple inputs to (20, 20).` : 'Output exactly doubles: the firm replicates what it was doing.'} The green dashed isoquant is <i>twice</i> the original output.`);
    }
    draw();
  });

  /* ---------- 6.5 Technological change (Amazon) ---------- */
  reg('techChange', (root) => {
    const { plotEl, side } = shell(root, 'Amazon\'s robots: technology changes the production function',
      'q = A·L<sup>α</sup>K<sup>1−α</sup>. Robots made production more capital-intensive (α falls), and then more productive (A rises). Each curve is an isoquant through bundle A = (2, 2) or for q = 10.');
    const p = new Plot(plotEl, { xmax: 6, ymax: 6, xlabel: 'Labour, L', ylabel: 'Capital, K' });
    const ST = [
      { label: '1 · Before robots', A: 5, al: 0.5 },
      { label: '2 · Capital-intensive (α = 0.4)', A: 5, al: 0.4 },
      { label: '3 · Productivity up (A = 10)', A: 10, al: 0.4 },
    ];
    let s = 0;
    chips(side, ST.map((x) => x.label), (i) => { s = i; draw(); }, { active: [0] });
    const rd = readout(side), vd = verdict(side);
    const iso = (A, al, Q) => (L) => Math.pow(Q / (A * Math.pow(L, al)), 1 / (1 - al));
    function draw() {
      p.clear();
      const c = ST[s];
      p.fn(iso(5, 0.5, 10), 0.3, 6, s === 0 ? 'curve ic' : 'curve faint');
      if (s >= 1) p.fn(iso(5, 0.4, 10), 0.3, 6, s === 1 ? 'curve ic' : 'curve faint');
      if (s >= 2) { p.fn(iso(10, 0.4, 20), 0.3, 6, 'curve c3'); p.fn(iso(10, 0.4, 10), 0.2, 6, 'curve ic'); p.dot(1, 1, 6, 'pt-opt'); p.text(1, 1, 'B (1, 1): q = 10', 'lbl', 10, 16); }
      p.dot(2, 2, 6, 'pt'); p.text(2, 2, 'A (2, 2)', 'lbl', 10, -10);
      const qA = c.A * Math.pow(2, c.al) * Math.pow(2, 1 - c.al);
      rd.set([['Production function', `q = ${c.A}·L<sup>${c.al}</sup>K<sup>${fmt(1 - c.al)}</sup>`], ['Output at A = (2, 2)', fmt(qA)], ['MRTS at A = (α/(1−α))·K/L', fmt(c.al / (1 - c.al))]]);
      vd.set(s === 0 ? '' : 'good', [
        'Before robots: q = 5L<sup>0.5</sup>K<sup>0.5</sup>. Bundle A = (2, 2) produces 10 units.',
        'Robots make production capital-intensive: α falls to 0.4, so MRTS falls and the q = 10 isoquant gets <b>flatter</b>. A still makes 10 units.',
        'Productivity doubles A to 10. The same bundle A now makes <b>20</b> units (blue isoquant), or the firm needs only B = (1, 1) to make 10. Fewer inputs per unit means lower costs.',
      ][s]);
    }
    draw();
  });
})();
