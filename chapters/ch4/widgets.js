/* Chapter 4 interactive figures: income effects and Engel curves, deriving demand,
   substitution/income decomposition, labour supply, market demand, consumer surplus,
   quality choice and network externalities. */
(function () {
  const { Plot, fmt, tween, niceCeil } = Graph;
  const { mk, shell, slider, chips, check, readout, verdict, button, row, note, cap, nextId } = UI;
  const E = Econ, reg = Study.registerWidget;

  const K_PAM = Math.log(2 * Math.pow(2 / 3, 1.5)) / Math.log(7 / 6);
  const MODELS = {
    cdHalf: E.cd(0.5),
    cdLow: E.cd(0.3),
    inferior: E.power(324, 3, 1),
    pam: E.power(Math.pow(4, 1.5) * Math.pow(6, K_PAM), 1.5, K_PAM),
    giffen: E.power(2 * Math.pow(7, 4) * Math.pow(16, 3), 4, 3),
    tyler: E.quasi(17.5, 1.25),
  };
  const sgn = (v, d = 2) => (v > 0.005 ? '+' : v < -0.005 ? '−' : '') + fmt(Math.abs(v), d);
  const money = (v) => '$' + fmt(v);
  function drawIC(p, model, pt, cls) {
    if (!(pt[0] > 0 && pt[1] > 0)) return;
    p.path(E.ic(model, pt[0], pt[1], p.o.xmax / 500, p.o.xmax, p.o.ymax * 1.6), cls);
  }
  // Data-space y for a pixel offset below the x-axis (used for effect arrows under the graph).
  const below = (p, px) => p.iy(p.m.t + p.ph + px);

  /* Generic "fill in the table, then check" exercise. rows: [label, [answerIndex per column]] */
  function quizTable(root, { title, hint, cols, options, rows, onRow }) {
    root.classList.add('lab', 'stack');
    const base = nextId('qt');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>${title}</h4>${hint ? `<p>${hint}</p>` : ''}</div>
      <div class="table-wrap bltable"><table><thead><tr><th></th>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r, i) => `<tr data-i="${i}"><td>${onRow ? `<button class="chip" data-row="${i}">${r[0]}</button>` : `<b>${r[0]}</b>`}</td>${cols.map((_, c) => `<td><select id="${base}-${i}-${c}" aria-label="${cols[c]} for row ${i + 1}"><option value="">Choose…</option>${options[c].map((o, k) => `<option value="${k}">${o}</option>`).join('')}</select></td>`).join('')}</tr>`).join('')}
      </tbody></table></div><div class="lab-side"></div>`;
    const side = root.querySelector('.lab-side');
    const r = row(side), vd = verdict(side);
    const cell = (i, c) => root.querySelector(`#${base}-${i}-${c}`);
    button(r, 'Check my answers', () => {
      let right = 0, total = 0;
      rows.forEach((rw, i) => rw[1].forEach((ans, c) => {
        const s = cell(i, c); total++; s.classList.remove('right', 'wrong');
        if (s.value === '') return;
        const ok = +s.value === ans; if (ok) right++; s.classList.add(ok ? 'right' : 'wrong');
      }));
      vd.set(right === total ? 'good' : '', `${right} of ${total} correct.${right === total ? ' Nice work.' : ''}`);
    }, true);
    button(r, 'Reveal answers', () => {
      rows.forEach((rw, i) => rw[1].forEach((ans, c) => { const s = cell(i, c); s.value = ans; s.classList.remove('wrong'); s.classList.add('right'); }));
      vd.set('good', 'Answers filled in.');
    });
    button(r, 'Clear', () => { root.querySelectorAll('select').forEach((s) => { s.value = ''; s.classList.remove('right', 'wrong'); }); vd.set('', ''); });
    vd.set('', '');
    if (onRow) root.querySelectorAll('[data-row]').forEach((b) => b.addEventListener('click', () => {
      root.querySelectorAll('tr').forEach((tr) => tr.classList.toggle('sel', tr.dataset.i === b.dataset.row));
      onRow(+b.dataset.row);
    }));
  }

  /* =====================================================================
     4.1  Income changes, income-expansion path and the Engel curve
     ===================================================================== */
  const INCOME = {
    normal: { label: 'Normal good: steaks', xname: 'Steaks', yname: 'Concert tickets', model: 'cdHalf', px: 4, py: 2, I0: 24, range: [12, 48], xmax: 14, ymax: 26 },
    inferior: { label: 'Inferior good: Kraft dinner', xname: 'Kraft dinners', yname: 'Steaks', model: 'inferior', px: 4, py: 2, I0: 24, range: [24, 56], xmax: 8, ymax: 30 },
  };
  reg('incomeEngel', (root, opts) => {
    const { plotEl, side } = shell(root, 'Raise income, watch X respond',
      'Income moves the budget line out in parallel. The dashed vertical line marks the starting amount of X. A normal good\'s new optimum lands to its right; an inferior good\'s lands to its left. The lower graph records each choice as an <b>Engel curve</b>.');
    const top = new Plot(plotEl, { h: 340, m: { b: 44 } });
    const bot = new Plot(plotEl, { h: 270, m: { t: 30, b: 46 } });
    bot.svg.classList.add('sub-plot');
    let cfg, I, cancel;
    const pc = chips(side, Object.values(INCOME).map((c) => c.label), (i) => load(Object.keys(INCOME)[i]));
    const box = mk('<div style="display:grid;gap:10px"></div>'); side.appendChild(box);
    const r = row(side);
    button(r, 'Animate income rising', () => {
      if (cancel) cancel();
      const [a, b] = cfg.range;
      cancel = tween(2600, (e) => { I = a + (b - a) * e; sl.set(I); draw(); }, () => { cancel = null; });
    }, true);
    button(r, 'Back to start', () => { if (cancel) cancel(); I = cfg.I0; sl.set(I); draw(); });
    const rd = readout(side), vd = verdict(side);
    let sl;
    function load(key) {
      if (cancel) cancel();
      cfg = INCOME[key]; I = cfg.I0;
      top.setDomain(cfg.xmax, cfg.ymax); top.setLabels(cfg.xname + ' (X)', cfg.yname + ' (Y)');
      bot.setDomain(cfg.xmax, niceCeil(cfg.range[1] * 1.1)); bot.setLabels(cfg.xname + ' (X)', 'Income, I ($)');
      box.innerHTML = '';
      sl = slider(box, { label: 'Income, I', min: cfg.range[0], max: cfg.range[1], step: 0.5, value: I, format: money, onInput: (v) => { if (cancel) cancel(); I = v; draw(); } });
      draw();
    }
    function draw() {
      const m = MODELS[cfg.model];
      const A = E.optimum(m, cfg.px, cfg.py, cfg.I0), P = E.optimum(m, cfg.px, cfg.py, I);
      const path = E.engel(m, cfg.px, cfg.py, cfg.range[0], cfg.range[1], 90);
      top.clear();
      top.path(path.map(([x], k) => [x, E.optimum(m, cfg.px, cfg.py, path[k][1])[1]]), 'curve ray');
      top.line(0, cfg.I0 / cfg.py, cfg.I0 / cfg.px, 0, 'bl-ghost');
      top.path([[0, 0], [I / cfg.px, 0], [0, I / cfg.py]], 'afford', true);
      top.line(0, I / cfg.py, I / cfg.px, 0, 'bl');
      top.line(A[0], 0, A[0], cfg.ymax, 'guide-v');
      drawIC(top, m, A, 'curve faint');
      drawIC(top, m, P, 'curve ic');
      top.dot(A[0], A[1], 5, 'pt'); top.text(A[0], A[1], 'A', 'lbl', -16, -8);
      top.dot(P[0], P[1], 7, 'pt-opt');
      if (Math.abs(I - cfg.I0) > 0.6) top.arrow(A[0], 0.6, P[0], 0.6, 'arr-ie');
      top.text(cfg.xmax, top.iy(top.m.t + 12), 'income-expansion path (dotted)', 'clabel', 0, 0, 'end');

      bot.clear();
      bot.path(path, 'curve c3');
      bot.line(0, I, P[0], I, 'guide-h');
      bot.line(P[0], 0, P[0], I, 'guide-h');
      bot.dot(A[0], cfg.I0, 5, 'pt');
      bot.dot(P[0], I, 7, 'pt-opt');
      bot.text(path[path.length - 1][0], path[path.length - 1][1], 'Engel curve', 'clabel', 8, 14);

      const dx = P[0] - A[0];
      rd.set([['Income', `${money(cfg.I0)} → ${money(I)}`], [`${cfg.xname} bought`, `${fmt(A[0])} → ${fmt(P[0])}`], ['Income effect on X', sgn(dx)], [`${cfg.yname} bought`, `${fmt(A[1])} → ${fmt(P[1])}`]]);
      if (Math.abs(I - cfg.I0) < 0.6) vd.set('', 'Move the income slider, or press <b>Animate income rising</b>.');
      else if (cfg.model === 'cdHalf') vd.set('good', `${cap(cfg.xname)} are a <b>normal good</b>: income ${I > cfg.I0 ? 'up' : 'down'}, consumption ${dx > 0 ? 'up' : 'down'} (${sgn(dx)}). The Engel curve slopes <b>upward</b>.`);
      else vd.set('ic', `${cap(cfg.xname)} are an <b>inferior good</b>: income ${I > cfg.I0 ? 'up' : 'down'}, consumption ${dx > 0 ? 'up' : 'down'} (${sgn(dx)}). The new optimum is on the ${dx < 0 ? 'left' : 'right'} of the dashed line, and the Engel curve slopes <b>downward</b>. ${cap(cfg.yname)} are still normal.`);
    }
    pc.setActive(opts.preset === 'inferior' ? 1 : 0);
    load(opts.preset === 'inferior' ? 'inferior' : 'normal');
  });

  /* =====================================================================
     4.1  Alice's Engel curve for books (Exercise 3)
     ===================================================================== */
  reg('engelData', (root) => {
    const data = [[5, 5], [10, 6], [15, 20], [20, 25], [25, 26], [30, 10], [35, 9], [40, 8], [45, 7], [50, 6]];
    const { plotEl, side } = shell(root, 'Alice\'s Engel curve for books',
      'Slide through Alice\'s income levels. Where the curve leans right as income rises, books are normal; where it leans left, they are inferior.');
    const p = new Plot(plotEl, { xmax: 30, ymax: 55, xlabel: 'Books purchased', ylabel: 'Income ($ thousands)' });
    let k = 3;
    slider(side, { label: 'Income', min: 0, max: data.length - 1, step: 1, value: k, format: (v) => '$' + data[v][0] + 'k', onInput: (v) => { k = v; draw(); } });
    const tb = mk(`<div class="table-wrap"><table><thead><tr><th class="num">Income ($k)</th><th class="num">Books</th><th>Books are…</th></tr></thead><tbody></tbody></table></div>`);
    side.appendChild(tb);
    const vd = verdict(side);
    const kind = (i) => (i === 0 ? '–' : data[i][1] > data[i - 1][1] ? 'Normal' : 'Inferior');
    function draw() {
      p.clear();
      for (let i = 1; i < data.length; i++) {
        const [I0, b0] = data[i - 1], [I1, b1] = data[i];
        p.line(b0, I0, b1, I1, b1 > b0 ? 'curve c4' : 'curve ic');
      }
      data.forEach(([I, b], i) => p.dot(b, I, i === k ? 7 : 4, i === k ? 'pt-opt' : 'pt'));
      p.line(0, data[k][0], data[k][1], data[k][0], 'guide-h');
      p.text(data[k][1], data[k][0], `${data[k][1]} books`, 'lbl', 10, -8);
      p.text(22, 14, 'normal (curve leans right)', 'clabel', 0, 0);
      p.text(12, 44, 'inferior (leans left)', 'clabel', 0, 0);
      tb.querySelector('tbody').innerHTML = data.map(([I, b], i) => `<tr${i === k ? ' class="sel"' : ''}><td class="num">${I}</td><td class="num">${b}</td><td>${kind(i)}</td></tr>`).join('');
      vd.set(k === 0 ? '' : kind(k) === 'Normal' ? 'good' : 'ic', k === 0 ? 'Move the slider up to compare income levels.'
        : `From $${data[k - 1][0]}k to $${data[k][0]}k, books go ${data[k - 1][1]} → ${data[k][1]}: <b>${kind(k).toLowerCase()}</b>. Overall, books are normal from $5k to $25k and inferior from $25k to $50k, like the hamburger example.`);
    }
    draw();
  });

  /* =====================================================================
     4.2  Deriving an individual demand curve (lecture + Tyler, Exercise 1)
     ===================================================================== */
  const DEMAND = {
    lecture: { xname: 'Beers', yname: 'Pizza slices', model: 'cdHalf', py: 2, I: 24, prange: [1, 8], px: 4, stops: [6, 4, 2], xmax: 14, ymax: 14, pmax: 9, taste: true },
    tyler: { xname: 'Movie tickets', yname: 'DVD rentals', model: 'tyler', py: 1, I: 100, prange: [6, 14], px: 10, stops: [12.5, 10, 7.5], xmax: 14, ymax: 125, pmax: 15 },
  };
  reg('demandDerive', (root, opts) => {
    const cfg = DEMAND[opts.preset || 'lecture'];
    const { plotEl, side } = shell(root, opts.preset === 'tyler' ? 'Tyler\'s demand for movie tickets' : 'From budget lines to a demand curve',
      `Change P<sub>X</sub> and the budget line pivots around the ${cfg.yname.toLowerCase()} intercept. Each new tangency gives one point on the demand curve below, at the same quantity of ${cfg.xname.toLowerCase()}.`);
    const top = new Plot(plotEl, { h: 330, xmax: cfg.xmax, ymax: cfg.ymax, xlabel: cfg.xname + ' (X)', ylabel: cfg.yname + ' (Y)' });
    const bot = new Plot(plotEl, { h: 270, xmax: cfg.xmax, ymax: cfg.pmax, xlabel: cfg.xname + ' (X)', ylabel: 'Price of X, P_X ($)', m: { t: 30 } });
    bot.svg.classList.add('sub-plot');
    let px = cfg.px, tasteLow = false, cancel;
    const sl = slider(side, { label: `Price of ${cfg.xname.toLowerCase()}, P<sub>X</sub>`, min: cfg.prange[0], max: cfg.prange[1], step: 0.1, value: px, format: money, onInput: (v) => { if (cancel) cancel(); px = v; draw(); } });
    chips(side, cfg.stops.map((s) => 'P<sub>X</sub> = ' + money(s)), (i) => {
      if (cancel) cancel();
      const from = px, to = cfg.stops[i];
      cancel = tween(600, (e) => { px = from + (to - from) * e; sl.set(px); draw(); });
    });
    if (cfg.taste) check(side, 'Joe wants to cut back on beer to lose weight (taste change)', false, (v) => { tasteLow = v; draw(); });
    const rd = readout(side), vd = verdict(side);
    function draw() {
      const m = MODELS[tasteLow ? 'cdLow' : cfg.model];
      const P = E.optimum(m, px, cfg.py, cfg.I);
      top.clear();
      cfg.stops.forEach((s) => { const q = E.optimum(m, s, cfg.py, cfg.I); top.line(0, cfg.I / cfg.py, cfg.I / s, 0, 'bl-ghost'); top.dot(q[0], q[1], 3.5, 'pt'); });
      top.path([[0, 0], [cfg.I / px, 0], [0, cfg.I / cfg.py]], 'afford', true);
      top.line(0, cfg.I / cfg.py, cfg.I / px, 0, 'bl');
      drawIC(top, m, P, 'curve ic');
      top.line(P[0], 0, P[0], P[1], 'guide-v');
      top.dot(P[0], P[1], 7, 'pt-opt');
      top.text(P[0], P[1], `(${fmt(P[0])}, ${fmt(P[1])})`, 'lbl', 12, -10);

      bot.clear();
      if (tasteLow) bot.path(E.demand(MODELS[cfg.model], cfg.py, cfg.I, cfg.prange[0], cfg.prange[1] + 1), 'curve faint');
      const dem = E.demand(m, cfg.py, cfg.I, cfg.prange[0], cfg.prange[1] + (cfg.taste ? 1 : 0));
      bot.path(dem, 'curve c3');
      cfg.stops.forEach((s) => bot.dot(E.optimum(m, s, cfg.py, cfg.I)[0], s, 3.5, 'pt'));
      bot.line(P[0], px, P[0], bot.o.ymax, 'guide-v');
      bot.line(0, px, P[0], px, 'guide-h');
      bot.dot(P[0], px, 7, 'pt-opt');
      const end = dem[dem.length - 1];
      bot.text(dem[0][0], dem[0][1], tasteLow ? 'D after taste change' : 'Demand', 'clabel', 8, -8);
      if (tasteLow) { const d0 = E.demand(MODELS[cfg.model], cfg.py, cfg.I, cfg.prange[0], cfg.prange[0]); bot.text(d0[0][0], d0[0][1], 'original D', 'clabel', 8, 16); }

      const mrs = m.m(P[0], P[1]);
      rd.set([['P<sub>X</sub>', money(px)], [`Quantity of ${cfg.xname.toLowerCase()} demanded`, fmt(P[0])], ['MRS at the optimum', fmt(mrs)], ['P<sub>X</sub>/P<sub>Y</sub>', fmt(px / cfg.py)]]);
      if (tasteLow) vd.set('ic', `With a weaker taste for beer, Joe's MRS is lower and his indifference curves are <b>flatter</b>. At every price he buys less beer, so his whole demand curve <b>shifts left</b> (the grey curve is the original).`);
      else vd.set('good', `At P<sub>X</sub> = ${money(px)} the tangency is at ${fmt(P[0])} ${cfg.xname.toLowerCase()}. Lower prices give tangencies further right, so the demand curve slopes <b>downward</b>.`);
    }
    draw();
  });

  /* =====================================================================
     4.3  Substitution and income effects (the decomposition)
     ===================================================================== */
  const SLUTSKY = {
    normal: { label: 'Normal · P<sub>X</sub> falls', model: 'cdHalf', px0: 4, px1: 2, py: 2, I: 24, xname: 'Good X', yname: 'Good Y', range: [1, 3.8], xmax: 14, ymax: 14 },
    inferior: { label: 'Inferior · P<sub>X</sub> falls', model: 'inferior', px0: 4, px1: 2, py: 2, I: 24, xname: 'Good X', yname: 'Good Y', range: [1.4, 3.8], xmax: 8, ymax: 14 },
    normalUp: { label: 'Normal · P<sub>X</sub> rises', model: 'cdHalf', px0: 2, px1: 4, py: 2, I: 24, xname: 'Good X', yname: 'Good Y', range: [2.2, 6], xmax: 14, ymax: 14 },
    inferiorUp: { label: 'Inferior · P<sub>X</sub> rises', model: 'inferior', px0: 2, px1: 4, py: 2, I: 24, xname: 'Good X', yname: 'Good Y', range: [2.2, 5], xmax: 8, ymax: 14 },
    pam: { label: 'Pam: Spam (Ex. 4)', model: 'pam', px0: 2, px1: 1, py: 2, I: 20, xname: 'Spam (cans)', yname: 'Bread (loaves)', range: [0.8, 1.9], xmax: 22, ymax: 12 },
    giffen: { label: 'Giffen: rice (optional)', model: 'giffen', px0: 2, px1: 1.5, py: 1, I: 30, xname: 'Rice', yname: 'Meat', range: [1.2, 1.95], xmax: 16, ymax: 32 },
  };
  reg('slutsky', (root, opts) => {
    const keys = (opts.presets || 'normal,inferior,normalUp,inferiorUp,giffen').split(',');
    const { plotEl, side } = shell(root, 'Substitution effect + income effect = total effect',
      'Step through the decomposition. D sits on the <b>original</b> indifference curve U₀ where it is tangent to a line parallel to the new budget line. A → D is the substitution effect; D → B is the income effect.');
    const p = new Plot(plotEl, { h: 450, m: { b: 118 } });
    const dp = new Plot(plotEl, { h: 250, m: { t: 30, b: 46 } });
    dp.svg.classList.add('sub-plot');
    let cfg, px1, stage = 3, timer = null;
    const pc = chips(side, keys.map((k) => SLUTSKY[k].label), (i) => load(keys[i]));
    const box = mk('<div style="display:grid;gap:10px"></div>'); side.appendChild(box);
    const stages = chips(side, ['1 · Start at A', '2 · New budget line', '3 · Substitution', '4 · Income'], (i) => { stopPlay(); stage = i; draw(); }, { active: [3] });
    const r = row(side);
    const playBtn = button(r, 'Play step by step', play, true);
    const rd = readout(side), vd = verdict(side);
    const legend = mk('<div class="legend"><span><i class="sw-opt"></i>Substitution effect / decomposition line</span><span><i class="sw-acc"></i>Income effect</span><span><i style="background:var(--bad)"></i>Total effect</span></div>');
    side.appendChild(legend);
    let sl;
    function stopPlay() { if (timer) clearTimeout(timer); timer = null; playBtn.disabled = false; }
    function play() {
      stopPlay(); playBtn.disabled = true; stage = 0; stages.setActive(0); draw();
      const next = () => { if (stage >= 3) { stopPlay(); return; } stage++; stages.setActive(stage); draw(); timer = setTimeout(next, 1500); };
      timer = setTimeout(next, 1200);
    }
    function load(key) {
      stopPlay();
      cfg = SLUTSKY[key]; px1 = cfg.px1; stage = 3; stages.setActive(3);
      p.setDomain(cfg.xmax, cfg.ymax); p.setLabels(cfg.xname, cfg.yname);
      box.innerHTML = '';
      sl = slider(box, { label: `New P<sub>X</sub> (was ${money(cfg.px0)})`, min: cfg.range[0], max: cfg.range[1], step: 0.05, value: px1, format: money, onInput: (v) => { px1 = v; draw(); } });
      draw();
    }
    function draw() {
      const m = MODELS[cfg.model];
      const res = E.decompose(m, cfg.px0, px1, cfg.py, cfg.I, cfg.xmax, cfg.ymax * 1.6);
      const { A, B, D } = res;
      const p1 = px1 / cfg.py;
      p.clear();
      p.line(0, cfg.I / cfg.py, cfg.I / cfg.px0, 0, stage >= 1 ? 'bl-ghost' : 'bl');
      p.path(res.icA, 'curve u0');
      const u0 = res.icA.find((q) => q[1] < p.o.ymax * 0.9) || res.icA[0];
      p.text(u0[0], u0[1], 'U₀', 'clabel', -8, 4, 'end');
      if (stage >= 1) p.line(0, cfg.I / cfg.py, cfg.I / px1, 0, 'bl');
      if (stage >= 2) {
        const Id = px1 * D[0] + cfg.py * D[1];
        p.line(0, Id / cfg.py, Id / px1, 0, 'decomp');
        p.line(D[0], 0, D[0], D[1], 'guide-se');
        p.dot(D[0], D[1], 7, 'pt-d'); p.text(D[0], D[1], 'D', 'lbl', 10, 16);
        p.arrow(A[0], below(p, 58), D[0], below(p, 58), 'arr-se');
        p.text(Math.min(A[0], D[0]), below(p, 58), 'Substitution ' + sgn(res.se), 'efflabel', 0, -6);
      }
      if (stage >= 3) {
        drawIC(p, m, B, 'curve ic');
        const ic1 = E.ic(m, B[0], B[1], p.o.xmax / 500, p.o.xmax, p.o.ymax * 1.6);
        p.text(ic1[ic1.length - 1][0], ic1[ic1.length - 1][1], 'U₁', 'clabel', -4, -8, 'end');
        p.line(B[0], 0, B[0], B[1], 'guide-ie');
        p.dot(B[0], B[1], 7, 'pt-b'); p.text(B[0], B[1], 'B', 'lbl', 10, -10);
        p.arrow(D[0], below(p, 80), B[0], below(p, 80), 'arr-ie');
        p.text(Math.min(D[0], B[0]), below(p, 80), 'Income ' + sgn(res.ie), 'efflabel', 0, -6);
        p.arrow(A[0], below(p, 104), B[0], below(p, 104), 'arr-tot');
        p.text(Math.min(A[0], B[0]), below(p, 104), 'Total ' + sgn(res.total), 'efflabel', 0, -6);
      }
      p.line(A[0], 0, A[0], A[1], 'guide-v');
      p.dot(A[0], A[1], 7, 'pt'); p.text(A[0], A[1], 'A', 'lbl', -18, -8);

      // demand panel
      const pmax = niceCeil(Math.max(cfg.px0, cfg.range[1]) * 1.25);
      dp.setDomain(cfg.xmax, pmax); dp.setLabels(cfg.xname, 'P_X ($)');
      dp.clear();
      dp.line(0, cfg.px0, A[0], cfg.px0, 'guide-h'); dp.line(0, px1, Math.max(B[0], D[0]), px1, 'guide-h');
      dp.dot(A[0], cfg.px0, 6, 'pt');
      if (stage >= 2) { dp.dot(D[0], px1, 6, 'pt-d'); dp.line(A[0], cfg.px0, D[0], px1, 'decomp'); }
      if (stage >= 3) { dp.line(A[0], cfg.px0, B[0], px1, 'curve c3'); dp.dot(B[0], px1, 6, 'pt-b'); dp.text(B[0], px1, 'demand', 'clabel', 10, px1 < cfg.px0 ? 16 : -8); }

      const down = px1 < cfg.px0;
      rd.set([['P<sub>X</sub>', `${money(cfg.px0)} → ${money(px1)}`], ['X at A → D → B', `${fmt(A[0])} → ${fmt(D[0])} → ${fmt(B[0])}`],
        ['Substitution effect (A→D)', sgn(res.se)], ['Income effect (D→B)', sgn(res.ie)], ['Total effect (A→B)', sgn(res.total)]]);
      const texts = [
        `Start at A = (${fmt(A[0])}, ${fmt(A[1])}), the tangency of U₀ with the original budget line.`,
        `P<sub>X</sub> ${down ? 'falls' : 'rises'} to ${money(px1)}: the budget line pivots ${down ? 'out' : 'in'} around the Y-intercept. The relative price of X is now ${fmt(p1)}.`,
        `Hold utility at U₀ and use the new relative price. The green line (parallel to the new budget line) touches U₀ at D. X is relatively ${down ? 'cheaper, so substitute X for Y' : 'dearer, so substitute Y for X'}: <b>substitution effect ${sgn(res.se)}</b>. This sign never depends on the type of good.`,
      ];
      if (stage < 3) { vd.set('', texts[stage]); return; }
      const same = Math.sign(res.se) === Math.sign(res.ie);
      const giffen = !same && Math.abs(res.ie) > Math.abs(res.se);
      const kind = same ? 'normal' : giffen ? 'Giffen' : 'inferior';
      vd.set(giffen ? 'bad' : same ? 'good' : 'ic', `The price ${down ? 'fall raises' : 'rise lowers'} purchasing power. X is <b>${kind}</b>, so going from D to B X ${res.ie > 0 ? 'rises' : 'falls'}: <b>income effect ${sgn(res.ie)}</b>. `
        + (same ? 'Both effects point the same way, so they add up. Demand slopes down.'
          : giffen ? '<b>The income effect is bigger than the substitution effect</b>, so X moves the "wrong" way: demand slopes <b>up</b>.'
            : 'The income effect partly offsets the substitution effect. Demand still slopes down, but more steeply.')
        + ` Total: ${sgn(res.se)} ${res.ie < 0 ? '−' : '+'} ${fmt(Math.abs(res.ie))} = <b>${sgn(res.total)}</b>.`);
    }
    const first = opts.preset && keys.includes(opts.preset) ? opts.preset : keys[0];
    pc.setActive(keys.indexOf(first));
    load(first);
  });

  reg('effectsTable', (root) => {
    const UD = ['Increase', 'Decrease'];
    quizTable(root, {
      title: 'Handout: signs of the effects on X', hint: 'Fill in whether each effect increases or decreases the quantity of X. Then check.',
      cols: ['Substitution effect', 'Income effect', 'Total effect'], options: [UD, UD, UD],
      rows: [
        ['P<sub>X</sub> ↓ · normal good', [0, 0, 0]],
        ['P<sub>X</sub> ↓ · inferior good', [0, 1, 0]],
        ['P<sub>X</sub> ↓ · Giffen good', [0, 1, 1]],
        ['P<sub>X</sub> ↑ · normal good', [1, 1, 1]],
        ['P<sub>X</sub> ↑ · inferior good', [1, 0, 1]],
        ['P<sub>X</sub> ↑ · Giffen good', [1, 0, 0]],
      ],
    });
  });

  /* =====================================================================
     4.3  Application: wages, leisure and the supply of labour
     ===================================================================== */
  reg('laborSupply', (root) => {
    root.classList.add('lab');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>Why labour supply bends backward</h4>
      <p>A higher wage makes leisure more expensive (substitution effect: less leisure, more work) but also raises income (income effect: leisure is normal, so more leisure). Drag the wage to see which effect wins. The curve is illustrative, shaped like the lecture diagram.</p></div>
      <div class="panels2"><div class="lab-plot"></div><div class="lab-plot"></div></div><div class="lab-side"></div>`;
    const [e1, e2] = root.querySelectorAll('.lab-plot');
    const hrs = (w) => 8 * Math.pow((w / 40) * Math.exp(1 - w / 40), 2);
    const L = new Plot(e1, { w: 360, h: 330, xmax: 12, ymax: 100, xlabel: 'Hours worked', ylabel: 'Wage ($/hr)' });
    const R = new Plot(e2, { w: 360, h: 330, xmax: 12, ymax: 100, xlabel: 'Hours of leisure', ylabel: 'Wage ($/hr)' });
    const side = root.querySelector('.lab-side');
    let w = 20;
    slider(side, { label: 'Wage rate', min: 5, max: 95, step: 1, value: w, format: (v) => '$' + v + '/hr', onInput: (v) => { w = v; draw(); } });
    const vd = verdict(side);
    const curve = Array.from({ length: 91 }, (_, i) => 5 + i);
    function draw() {
      L.clear(); R.clear();
      L.path(curve.map((v) => [hrs(v), v]), 'curve c3');
      R.path(curve.map((v) => [12 - hrs(v), v]), 'curve ic');
      L.line(0, 40, 12, 40, 'guide-h'); R.line(0, 40, 12, 40, 'guide-h');
      L.text(0.3, 40, 'turning point', 'clabel', 0, -6);
      const h = hrs(w);
      L.line(0, w, h, w, 'guide-v'); L.dot(h, w, 7, 'pt-opt'); L.text(h, w, fmt(h, 1) + ' hrs', 'lbl', 10, 4);
      R.line(0, w, 12 - h, w, 'guide-v'); R.dot(12 - h, w, 7, 'pt-opt'); R.text(12 - h, w, fmt(12 - h, 1) + ' hrs', 'lbl', 10, 4);
      L.text(11.8, 12, 'substitution', 'clabel', 0, 0, 'end'); L.text(11.8, 6, 'effect dominates', 'clabel', 0, 0, 'end');
      L.text(3, 88, 'income effect', 'clabel'); L.text(3, 82, 'dominates', 'clabel');
      vd.set(w < 40 ? 'good' : 'ic', w < 40
        ? `At $${w}/hr income is low and consumption matters a lot. The <b>substitution effect dominates</b>: a raise cuts leisure and the person works more (${fmt(h, 1)} hrs). This is China after wages rose from very low levels.`
        : `At $${w}/hr income is already high and leisure matters more. The <b>income effect dominates</b>: a raise buys more leisure and the person works less (${fmt(h, 1)} hrs). This is the OECD pattern: higher productivity, fewer hours.`);
    }
    draw();
  });

  /* =====================================================================
     4.4  Market demand = horizontal sum of individual demands
     ===================================================================== */
  reg('marketDemand', (root) => {
    root.classList.add('lab');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>Adding Joe's and Mary's demand</h4>
      <p>At each price, add the quantities <i>across</i>. Mary only starts buying below $6, so the market curve has a <b>kink</b> there.</p></div>
      <div class="panels3"><div><div class="cap">Joe</div><div class="lab-plot"></div></div><div><div class="cap">Mary</div><div class="lab-plot"></div></div><div><div class="cap">Market</div><div class="lab-plot"></div></div></div><div class="lab-side"></div>`;
    const els = root.querySelectorAll('.lab-plot');
    const mkp = (el, xmax) => new Plot(el, { w: 300, h: 280, xmax, ymax: 12, xlabel: 'Q', ylabel: 'P ($)', m: { l: 40, r: 14, t: 30, b: 44 } });
    const J = mkp(els[0], 6), M = mkp(els[1], 6), T = mkp(els[2], 10);
    const qJ = (P) => Math.max(0, (10 - P) / 2.5), qM = (P) => Math.max(0, (6 - P) / 2);
    const side = root.querySelector('.lab-side');
    let P = 4;
    slider(side, { label: 'Price', min: 0.5, max: 11, step: 0.1, value: P, format: money, onInput: (v) => { P = v; draw(); } });
    const rd = readout(side), vd = verdict(side);
    function draw() {
      [J, M, T].forEach((pl) => pl.clear());
      J.line(0, 10, 4, 0, 'curve ic'); M.line(0, 6, 3, 0, 'curve c3');
      T.path([[0, 10], [qJ(6), 6], [7, 0]], 'curve c4');
      T.dot(qJ(6), 6, 4, 'pt'); T.text(qJ(6), 6, 'kink', 'clabel', 8, -6);
      [[J, qJ(P)], [M, qM(P)], [T, qJ(P) + qM(P)]].forEach(([pl, q]) => {
        pl.line(0, P, pl.o.xmax, P, 'guide-h');
        if (q > 0) { pl.line(q, 0, q, P, 'guide-v'); pl.dot(q, P, 6, 'pt-opt'); }
        pl.text(q, P, fmt(q), 'lbl', 8, -8);
      });
      rd.set([['Joe', fmt(qJ(P))], ['Mary', fmt(qM(P))], ['Market = Joe + Mary', fmt(qJ(P) + qM(P))]]);
      vd.set(P >= 10 ? '' : P >= 6 ? 'ic' : 'good', P >= 10 ? 'Nobody buys at this price.'
        : P >= 6 ? `Above $6 only Joe buys, so market demand is just Joe's demand (the steep segment).`
          : `Below $6 both buy: the market quantity is ${fmt(qJ(P))} + ${fmt(qM(P))} = ${fmt(qJ(P) + qM(P))}. The market curve is flatter here because each price cut brings in two buyers.`);
    }
    draw();
  });

  /* =====================================================================
     4.5  Consumer surplus and a price change
     ===================================================================== */
  reg('consumerSurplus', (root) => {
    const { plotEl, side } = shell(root, 'Consumer surplus and a price change',
      'CS is the area under the demand curve and above the price. Move the new price: area A is the gain to people already buying; area B is the surplus of new buyers.');
    const p = new Plot(plotEl, { xmax: 10, ymax: 10, xlabel: 'Quantity (thousands)', ylabel: 'Price ($)' });
    const P1 = 6, Q = (P) => 10 - P;
    let P2 = 4;
    slider(side, { label: 'New price', min: 1, max: 9, step: 0.1, value: P2, format: money, onInput: (v) => { P2 = v; draw(); } });
    const rd = readout(side), vd = verdict(side);
    function draw() {
      p.clear();
      const lo = Math.min(P1, P2), hi = Math.max(P1, P2);
      p.path([[0, 10], [Q(hi), hi], [0, hi]], 'cs-base', true);
      if (Math.abs(P2 - P1) > 0.05) {
        p.path([[0, hi], [Q(hi), hi], [Q(hi), lo], [0, lo]], 'cs-a', true);
        p.path([[Q(hi), hi], [Q(lo), lo], [Q(hi), lo]], 'cs-b', true);
        p.text(Q(hi) / 2, (hi + lo) / 2, 'A', 'lbl', 0, 5, 'middle');
        p.text(Q(hi) + (Q(lo) - Q(hi)) / 3, lo + (hi - lo) / 3, 'B', 'lbl', 0, 5, 'middle');
      }
      p.text(Q(hi) / 3, hi + (10 - hi) / 3, 'CS₁', 'lbl', 0, 5, 'middle');
      p.line(0, 10, 10, 0, 'curve c3');
      p.line(0, P1, Q(P1), P1, 'guide-h'); p.line(0, P2, Q(P2), P2, 'bl');
      p.text(0, P1, 'P₁ = $6', 'ilabel', 6, -6); p.text(Q(P2), P2, 'P₂', 'ilabel', 8, 4);
      p.text(9.6, 0.4, 'Demand', 'clabel', 0, -10, 'end');
      const cs1 = (10 - P1) * Q(P1) / 2, cs2 = (10 - P2) * Q(P2) / 2;
      const A = (hi - lo) * Q(hi), B = (hi - lo) * (Q(lo) - Q(hi)) / 2;
      rd.set([['CS at $6', '$' + fmt(cs1) + 'k'], [`CS at ${money(P2)}`, '$' + fmt(cs2) + 'k'], ['Area A (existing buyers)', '$' + fmt(A) + 'k'], ['Area B (new buyers)', '$' + fmt(B) + 'k'], ['Change in CS', (cs2 >= cs1 ? '+' : '−') + '$' + fmt(Math.abs(cs2 - cs1)) + 'k']]);
      vd.set(P2 < P1 - 0.05 ? 'good' : P2 > P1 + 0.05 ? 'bad' : '', P2 < P1 - 0.05
        ? `Price falls from $6 to ${money(P2)}: CS rises by A + B = $${fmt(A + B)}k. Existing buyers pay less (A), and ${fmt(Q(P2) - Q(P1))}k new buyers enter (B).`
        : P2 > P1 + 0.05 ? `Price rises from $6 to ${money(P2)}: CS falls by A + B = $${fmt(A + B)}k. Remaining buyers pay more (A) and some stop buying (B).`
          : 'Move the price away from $6.');
    }
    draw();
  });

  /* =====================================================================
     4.5  Quality choice with individual consumer surplus
     ===================================================================== */
  reg('qualityChoice', (root) => {
    const { plotEl, side } = shell(root, 'Which quality maximizes consumer surplus?',
      'Each consumer picks the version with the largest gap between perceived benefit and price (CS = B − P). Change the price of A5 to see when Consumer 2 switches.');
    const p = new Plot(plotEl, { xmax: 5.5, ymax: 28, xlabel: 'Quality (A1 → A5)', ylabel: 'Benefit or price ($)' });
    const B1 = [10, 15, 18, 20, 21], B2 = [7, 13, 18, 22, 24];
    const prices = [9, 13, 17, 20, 21];
    let who = 0;
    chips(side, ['Consumer 1', 'Consumer 2 (loves quality)'], (i) => { who = i; draw(); }, { active: [0] });
    slider(side, { label: 'Price of A5', min: 18, max: 26, step: 0.5, value: 21, format: money, onInput: (v) => { prices[4] = v; draw(); } });
    const tb = mk('<div class="table-wrap"><table class="compact"><thead><tr><th></th><th class="num">A1</th><th class="num">A2</th><th class="num">A3</th><th class="num">A4</th><th class="num">A5</th></tr></thead><tbody></tbody></table></div>');
    side.appendChild(tb);
    const vd = verdict(side);
    function draw() {
      const B = who ? B2 : B1, cs = B.map((b, i) => b - prices[i]);
      const best = cs.indexOf(Math.max(...cs));
      p.clear();
      const pts = (arr) => arr.map((v, i) => [i + 1, v]);
      p.path(pts(who ? B1 : B2), 'curve faint');
      p.path(pts(B), 'curve c4');
      p.path(pts(prices), 'bl');
      B.forEach((b, i) => {
        if (b > prices[i]) p.line(i + 1, prices[i], i + 1, b, i === best ? 'cs-bar hot' : 'cs-bar');
        p.dot(i + 1, b, 4, 'pt-opt'); p.dot(i + 1, prices[i], 4, 'pt-bl');
      });
      p.text(best + 1, B[best], `CS $${fmt(cs[best])}`, 'lbl', 10, -10);
      p.text(5, B[4], who ? 'B₂' : 'B₁', 'clabel', 8, B[4] >= prices[4] ? -6 : 16); p.text(5, prices[4], 'Price', 'clabel', 8, B[4] >= prices[4] ? 16 : -6);
      tb.querySelector('tbody').innerHTML = `<tr><td>Benefit</td>${B.map((v) => `<td class="num">$${v}</td>`).join('')}</tr><tr><td>Price</td>${prices.map((v) => `<td class="num">$${fmt(v)}</td>`).join('')}</tr>
        <tr><td><b>CS</b></td>${cs.map((v, i) => `<td class="num"${i === best ? ' style="color:var(--opt);font-weight:700"' : ''}>${v < 0 ? '−' : ''}$${fmt(Math.abs(v))}</td>`).join('')}</tr>`;
      vd.set('good', `Consumer ${who + 1} buys <b>A${best + 1}</b> (CS = $${fmt(cs[best])}). ${who ? 'A stronger taste for quality makes the top model worth its price.' : 'Paying more for higher quality isn\'t worth it to her: benefits rise more slowly than prices.'}`);
    }
    draw();
  });

  /* =====================================================================
     4.6  Network externalities: bandwagon and snob effects
     ===================================================================== */
  reg('network', (root) => {
    const { plotEl, side } = shell(root, 'Bandwagon and snob effects',
      'A price cut first moves buyers along the original demand curve (pure price effect). Then expectations about how many people own the good shift demand: right for a bandwagon good, left for a snob good.');
    const p = new Plot(plotEl, { h: 440, xmax: 100, ymax: 12, xlabel: 'Quantity (thousands)', ylabel: 'Price ($)', m: { b: 96 } });
    let mode = 0, P2 = 4;
    const P1 = 8, D1 = (P) => 8 * (12 - P);
    chips(side, ['Bandwagon (Facebook, fax)', 'Snob (Rolex, LV)'], (i) => { mode = i; draw(); }, { active: [0] });
    slider(side, { label: 'New price', min: 3, max: 7.5, step: 0.1, value: P2, format: money, onInput: (v) => { P2 = v; draw(); } });
    const rd = readout(side), vd = verdict(side);
    function draw() {
      const Q1 = D1(P1), Qp = D1(P2), s = mode === 0 ? 0.9 * (Qp - Q1) : -0.55 * (Qp - Q1), Q2 = Qp + s;
      p.clear();
      p.line(0, 12, 96, 0, 'curve faint'); p.text(D1(1), 1, 'D (original expectations)', 'clabel', -4, -8, 'end');
      p.line(s, 12, Math.min(100, 96 + s), Math.max(0, s > 0 ? (96 + s - 100) / 8 : 0), 'curve ghost-ic');
      const ql = Math.max(6, Math.min(94, 36 + s)); p.text(ql, 12 - (ql - s) / 8, mode === 0 ? 'D after (more users expected)' : 'D after (less exclusive)', 'clabel', 8, -6);
      const slope = (Q2 - Q1) / (P2 - P1);
      const mk2 = (P) => Q1 + slope * (P - P1);
      const Pa = 11.5, Pb = Math.max(0.5, P1 + (100 - Q1) / slope);
      p.line(mk2(Pa), Pa, Math.min(100, mk2(Pb)), Pb, 'curve c3');
      p.text(Q1, P1, 'Market demand with the effect', 'clabel', 12, -12);
      p.line(0, P1, Q1, P1, 'guide-h'); p.line(0, P2, Math.max(Qp, Q2), P2, 'guide-h');
      p.dot(Q1, P1, 6, 'pt'); p.dot(Qp, P2, 5, 'pt'); p.dot(Q2, P2, 7, 'pt-opt');
      [Q1, Qp, Q2].forEach((q) => p.line(q, 0, q, P2, 'guide-v'));
      p.arrow(Q1, below(p, 56), Qp, below(p, 56), 'arr-se'); p.text(Q1, below(p, 56), 'Pure price effect', 'efflabel', 0, -6);
      p.arrow(Qp, below(p, 80), Q2, below(p, 80), mode === 0 ? 'arr-ie' : 'arr-tot'); p.text(Math.min(Qp, Q2), below(p, 80), mode === 0 ? 'Bandwagon effect' : 'Snob effect', 'efflabel', 0, -6);
      rd.set([['Price', `$${P1} → ${money(P2)}`], ['Pure price effect', sgn(Qp - Q1, 1) + 'k'], [mode === 0 ? 'Bandwagon effect' : 'Snob effect', sgn(s, 1) + 'k'], ['Total change in Q', sgn(Q2 - Q1, 1) + 'k']]);
      vd.set(mode === 0 ? 'good' : 'ic', mode === 0
        ? 'More buyers make the product more useful, so demand shifts right. The total response is <b>bigger</b> than the pure price effect: market demand is <b>flatter (more elastic)</b>.'
        : 'More owners make the product less exclusive, so some buyers drop out and demand shifts left. The total response is <b>smaller</b> than the pure price effect: market demand is <b>steeper (more inelastic)</b>.');
    }
    draw();
  });

  reg('networkSort', (root) => {
    const O = ['Bandwagon effect', 'Snob effect'];
    quizTable(root, {
      title: 'Bandwagon or snob?', hint: 'Exercise 8 plus a few more from lecture.', cols: ['Network externality'], options: [O],
      rows: [['LV bags', [1]], ['Microsoft Word', [0]], ['Fax machines', [0]], ['Rolex watches', [1]], ['Facebook', [0]], ['Exclusive golf club membership', [1]], ['Porsche', [1]], ['Computer software', [0]]],
    });
  });
})();
