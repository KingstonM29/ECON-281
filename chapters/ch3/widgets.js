/* Chapter 3 interactive figures. Each widget is mounted on an element with
   data-widget="name" (plus optional data-* options) inside chapter content. */
(function () {
  const { Plot, fmt, tween, niceCeil, clamp } = Graph;
  const reg = Study.registerWidget;
  let wid = 0;

  /* ---------- small UI helpers ---------- */
  function mk(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function shell(root, title, hint, stack) {
    root.classList.add('lab');
    if (stack) root.classList.add('stack');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>${title}</h4>${hint ? `<p>${hint}</p>` : ''}</div>
      <div class="lab-body"><div class="lab-plot"></div><div class="lab-side"></div></div>`;
    return { plotEl: root.querySelector('.lab-plot'), side: root.querySelector('.lab-side') };
  }
  function slider(parent, { label, min, max, step, value, format = (v) => fmt(v), onInput }) {
    const id = 'ctl' + (++wid);
    const wrap = mk(`<div class="ctl"><div class="ctl-row"><label for="${id}">${label}</label><output for="${id}"></output></div>
      <input type="range" id="${id}" min="${min}" max="${max}" step="${step}"></div>`);
    parent.appendChild(wrap);
    const inp = wrap.querySelector('input'), out = wrap.querySelector('output');
    const api = {
      v: value, el: wrap,
      set(v) { api.v = v; inp.value = v; out.textContent = format(v); },
    };
    inp.addEventListener('input', () => { api.v = +inp.value; out.textContent = format(api.v); onInput(api.v); });
    api.set(value);
    return api;
  }
  function chips(parent, labels, onPick, { multi = false, active = [] } = {}) {
    const row = mk('<div class="chip-row"></div>');
    parent.appendChild(row);
    const btns = labels.map((l, i) => {
      const b = mk(`<button class="chip" aria-pressed="${active.includes(i)}"><span>${l}</span></button>`);
      b.addEventListener('click', () => {
        if (multi) b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
        else btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        onPick(i, b.getAttribute('aria-pressed') === 'true');
      });
      row.appendChild(b);
      return b;
    });
    return { row, btns, clear() { btns.forEach((b) => b.setAttribute('aria-pressed', 'false')); }, setActive(i) { btns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i))); } };
  }
  function check(parent, label, checked, onChange) {
    const id = 'chk' + (++wid);
    const w = mk(`<label class="check" for="${id}"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''}> ${label}</label>`);
    parent.appendChild(w);
    const inp = w.querySelector('input');
    inp.addEventListener('change', () => onChange(inp.checked));
    return inp;
  }
  function readout(parent) {
    const d = mk('<dl class="readout"></dl>');
    parent.appendChild(d);
    return { el: d, set(rows) { d.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join(''); } };
  }
  function verdict(parent) {
    const d = mk('<div class="verdict" aria-live="polite"></div>');
    parent.appendChild(d);
    return { el: d, set(kind, html) { d.className = 'verdict' + (kind ? ' v-' + kind : ''); d.innerHTML = html; d.hidden = !html; } };
  }
  function button(parent, label, onClick, primary) {
    const b = mk(`<button class="btn${primary ? ' primary' : ''}"><span>${label}</span></button>`);
    b.addEventListener('click', onClick);
    parent.appendChild(b);
    return b;
  }
  function row(parent) { const r = mk('<div class="btn-row"></div>'); parent.appendChild(r); return r; }
  function note(parent, html) { const n = mk(`<p class="lab-note">${html}</p>`); parent.appendChild(n); return n; }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- Cobb–Douglas preferences: U = x^a · y^(1−a) ---------- */
  const CD = {
    U: (a, x, y) => Math.pow(x, a) * Math.pow(y, 1 - a),
    icY: (a, U, x) => Math.pow(U / Math.pow(x, a), 1 / (1 - a)),
    mrs: (a, x, y) => (x <= 0 ? Infinity : (a * y) / ((1 - a) * x)),
    mux: (a, x, y) => (a * CD.U(a, x, y)) / x,
    muy: (a, x, y) => ((1 - a) * CD.U(a, x, y)) / y,
  };
  // Draw a short tangent segment of slope −m through (x, y), fixed pixel length.
  function tangent(p, x, y, m, cls = 'tangent', px = 70) {
    if (!isFinite(m)) return;
    const u = p.pxPerUnit();
    const L = Math.hypot(u.x, m * u.y);
    const d = px / L;
    p.line(x - d, y + m * d, x + d, y - m * d, cls);
  }

  /* =====================================================================
     3.1  Which bundles beat B?
     ===================================================================== */
  reg('prefZones', (root) => {
    const { plotEl, side } = shell(root, 'Which bundles beat B = (6, 6)?',
      'Drag point T or pick a bundle. "More is better" ranks two of the four zones right away. The other two depend on the consumer\'s tastes.');
    const p = new Plot(plotEl, { xmax: 12, ymax: 12, xlabel: 'Beers (X)', ylabel: 'Pizza slices (Y)' });
    let T = [9, 4], showIC = false;
    const presets = [['E (9, 9)', [9, 9]], ['D (3, 3)', [3, 3]], ['(9, 6)', [9, 6]], ['(6, 3)', [6, 3]], ['A (4, 9)', [4, 9]], ['C (9, 4)', [9, 4]], ['(10, 2)', [10, 2]]];
    const ch = chips(side, presets.map((x) => x[0]), (i) => {
      const from = [...T], to = presets[i][1];
      tween(450, (e) => { T = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e]; draw(); });
    });
    check(side, 'Show the indifference curve through B', false, (v) => { showIC = v; draw(); });
    const rd = readout(side), vd = verdict(side);
    const h = p.handle(T[0], T[1], { label: 'Bundle T', step: 0.5, onMove: (x, y) => { T = [Math.round(x * 2) / 2, Math.round(y * 2) / 2]; ch.clear(); draw(); } });

    function draw() {
      p.clear();
      p.rect(6, 6, 12, 12, 'zone-better'); p.rect(0, 0, 6, 6, 'zone-worse');
      p.rect(0, 6, 6, 12, 'zone-unknown'); p.rect(6, 0, 12, 6, 'zone-unknown');
      p.text(9, 11.3, 'Better than B', 'zlabel', 0, 0, 'middle');
      p.text(3, 0.6, 'Worse than B', 'zlabel', 0, 0, 'middle');
      p.text(3, 11.3, 'Depends on tastes', 'zlabel', 0, 0, 'middle');
      p.text(9, 0.6, 'Depends on tastes', 'zlabel', 0, 0, 'middle');
      if (showIC) {
        p.fn((x) => 36 / x, 2.8, 12, 'curve ic');
        p.text(12, 3, 'U = U(B)', 'clabel', -4, -8, 'end');
      }
      p.dot(6, 6, 6, 'pt');
      p.text(6, 6, 'B', 'lbl', -16, -8);
      p.text(T[0], T[1], 'T', 'lbl', 12, -12);
      h.set(T[0], T[1]);

      const [x, y] = T, dx = x - 6, dy = y - 6;
      const sgn = (v) => (v > 0 ? '+' : '') + fmt(v);
      rd.set([['Bundle T', `(${fmt(x)}, ${fmt(y)})`], ['Change vs B', `${sgn(dx)} beers, ${sgn(dy)} slices`], ['Utility x·y (if curve shown)', showIC ? `${fmt(x * y)} vs 36` : 'hidden']]);
      const eps = 1e-6;
      if (Math.abs(dx) < eps && Math.abs(dy) < eps) vd.set('', 'T is bundle B itself.');
      else if (dx >= -eps && dy >= -eps) vd.set('good', 'T has at least as much of both goods and more of one. <b>More is better</b>, so T is preferred to B for anyone.');
      else if (dx <= eps && dy <= eps) vd.set('bad', 'T has less of at least one good and no more of the other. <b>More is better</b>, so B is preferred to T.');
      else if (!showIC) vd.set('', 'T gives more of one good and less of the other. The three assumptions can\'t rank it against B. Turn on the indifference curve to see how <i>this</i> consumer ranks it.');
      else {
        const u = x * y;
        if (Math.abs(u - 36) < 0.05) vd.set('ic', 'T sits <b>on the indifference curve</b> through B, so the consumer is indifferent between T and B.');
        else if (u > 36) vd.set('good', 'T lies <b>above</b> the indifference curve through B: this consumer prefers T.');
        else vd.set('bad', 'T lies <b>below</b> the indifference curve through B: this consumer prefers B.');
      }
    }
    draw();
  });

  /* =====================================================================
     3.1  Indifference map + why curves can't cross
     ===================================================================== */
  reg('icMap', (root) => {
    const { plotEl, side } = shell(root, 'An indifference map',
      'Drag the bundle. Every point has a curve through it (U = x<sup>0.5</sup>y<sup>0.5</sup>). Curves farther from the origin mean higher utility.');
    const p = new Plot(plotEl, { xmax: 12, ymax: 12, xlabel: 'Beers (X)', ylabel: 'Pizza slices (Y)' });
    let P = [4, 5], cross = false;
    const levels = [2, 4, 6, 8];
    check(side, 'Show what goes wrong if two curves cross', false, (v) => { cross = v; draw(); });
    const rd = readout(side), vd = verdict(side);
    const h = p.handle(P[0], P[1], { label: 'Bundle', onMove: (x, y) => { P = [x, y]; draw(); } });
    function draw() {
      p.clear();
      h.show(!cross);
      if (!cross) {
        levels.forEach((U) => {
          p.fn((x) => (U * U) / x, (U * U) / 12, 12, 'curve faint');
          p.text(12, (U * U) / 12, 'U = ' + U, 'clabel', -4, -7, 'end');
        });
        const U = Math.sqrt(P[0] * P[1]);
        if (U > 0.05) p.fn((x) => (U * U) / x, Math.max(0.05, (U * U) / 12), 12, 'curve ic');
        h.set(P[0], P[1]);
        rd.set([['Bundle', `(${fmt(P[0], 1)}, ${fmt(P[1], 1)})`], ['Utility U', fmt(U) + ' utils']]);
        const above = levels.filter((l) => l < U - 1e-9).length;
        vd.set('ic', `The magenta curve is this bundle's indifference curve. It lies outside ${above} of the ${levels.length} grey curves, so it beats every bundle on those.`);
      } else {
        p.fn((x) => 36 / x, 3, 12, 'curve ic');
        p.fn((x) => 6 * Math.pow(6 / x, 2), 4.3, 12, 'curve c3');
        p.dot(6, 6, 6, 'pt'); p.text(6, 6, 'B', 'lbl', 10, -8);
        p.dot(9, 4, 6, 'pt-ic'); p.text(9, 4, 'C', 'lbl', 8, -8);
        p.dot(9, 6 * 36 / 81, 6, 'pt'); p.text(9, 6 * 36 / 81, 'F', 'lbl', 8, 14);
        p.text(11.8, 36 / 11.8, 'Curve 1', 'clabel', 0, -8, 'end');
        p.text(11.8, 6 * Math.pow(6 / 11.8, 2), 'Curve 2', 'clabel', 0, 16, 'end');
        rd.set([['C on curve 1', '(9, 4)'], ['F on curve 2', '(9, 2.67)']]);
        vd.set('bad', 'C ~ B (same curve 1) and F ~ B (same curve 2), so by <b>transitivity</b> C ~ F. But C has the same beer and more pizza than F, so <b>more is better</b> says C is preferred. Contradiction, so one person\'s curves can never cross.');
      }
    }
    draw();
  });

  /* =====================================================================
     3.1  MRS is the slope of the indifference curve
     ===================================================================== */
  reg('mrsSteps', (root) => {
    const { plotEl, side } = shell(root, 'MRS is the slope of the indifference curve',
      'Slide along the curve x·y = 24. The triangle shows the pizza given up for one more beer. The dashed tangent\'s slope is the MRS at that bundle.');
    const k = 24;
    const p = new Plot(plotEl, { xmax: 12, ymax: 14, xlabel: 'Beers (X)', ylabel: 'Pizza slices (Y)' });
    let x = 2;
    const s = slider(side, { label: 'Beers', min: 1.8, max: 10, step: 0.1, value: x, onInput: (v) => { x = v; draw(); } });
    const r = row(side);
    button(r, 'One more beer →', () => {
      const from = x, to = Math.min(10, Math.round(x) + 1);
      tween(500, (e) => { x = from + (to - from) * e; s.set(x); draw(); });
    }, true);
    button(r, 'Reset', () => { x = 2; s.set(x); draw(); });
    const cmp = mk('<div class="compare"></div>'); side.appendChild(cmp);
    const rd = readout(side), vd = verdict(side);
    function draw() {
      p.clear();
      p.fn((t) => k / t, 1.7, 12, 'curve ic');
      const y = k / x, y1 = k / (x + 1), mrs = y / x;
      p.line(x, y, x + 1, y, 'tri');
      p.line(x + 1, y, x + 1, y1, 'tri-rise');
      p.text(x + 0.5, y, '+1', 'ilabel', 0, -8, 'middle');
      p.text(x + 1, (y + y1) / 2, '−' + fmt(y - y1), 'ilabel', 8, 4);
      tangent(p, x, y, mrs, 'tangent', 90);
      p.dot(x, y, 6, 'pt-ic');
      const U = Math.sqrt(k), mux = 0.5 * U / x, muy = 0.5 * U / y;
      cmp.innerHTML = `<div><span class="big ic">${fmt(mrs)}</span><small>MRS at this bundle<br>(slope of tangent)</small></div><div class="sym">≈</div><div><span class="big">${fmt(y - y1)}</span><small>slices actually given up<br>for the next beer</small></div>`;
      rd.set([['Bundle', `(${fmt(x, 1)}, ${fmt(y, 1)})`], ['MU<sub>X</sub> = 0.5·U/x', fmt(mux, 3)], ['MU<sub>Y</sub> = 0.5·U/y', fmt(muy, 3)], ['MU<sub>X</sub> / MU<sub>Y</sub>', fmt(mux / muy)]]);
      vd.set('ic', `Moving right the curve flattens: MRS falls from <b>${fmt(mrs)}</b> here to <b>${fmt((k / (x + 1)) / (x + 1))}</b> one beer later. That is <b>diminishing MRS</b>, which makes the curve convex.`);
    }
    draw();
  });

  /* =====================================================================
     3.1  Same bundle, different tastes (Joe / first consumer / Mary)
     ===================================================================== */
  reg('whoLikesX', (root) => {
    const { plotEl, side } = shell(root, 'Same bundle, different tastes',
      'Each consumer holds M = (3 beers, 6 slices). A bigger MRS means a steeper curve through M, which means a stronger taste for beer. The dashed line has slope 2.');
    const p = new Plot(plotEl, { xmax: 8, ymax: 14, xlabel: 'Beers (X)', ylabel: 'Pizza slices (Y)' });
    const people = [
      { name: 'Joe', mrs: 3, cls: 'ic', sw: 'sw-ic', on: true },
      { name: 'First consumer', mrs: 2, cls: 'c2', sw: 'sw-ink', on: true },
      { name: 'Mary', mrs: 1, cls: 'c3', sw: 'sw-acc', on: true },
      { name: 'You', mrs: 4.5, cls: 'c4', sw: 'sw-opt', on: false },
    ];
    chips(side, people.map((q) => `<span class="sw ${q.sw}"></span>${q.name}`), (i, on) => { people[i].on = on; draw(); }, { multi: true, active: [0, 1, 2] });
    slider(side, { label: 'Your MRS at M', min: 0.2, max: 8, step: 0.1, value: 4.5, onInput: (v) => { people[3].mrs = v; draw(); } });
    const rd = readout(side), vd = verdict(side);
    function draw() {
      p.clear();
      p.line(0, 12, 6, 0, 'bl-ghost');
      p.text(5.2, 1.6, 'slope 2', 'clabel', 8, 0);
      const shown = people.filter((q) => q.on);
      shown.forEach((q) => {
        const a = q.mrs / (2 + q.mrs), U = CD.U(a, 3, 6);
        p.fn((x) => CD.icY(a, U, x), 0.3, 8, 'curve ' + q.cls);
      });
      p.dot(3, 6, 6, 'pt'); p.text(3, 6, 'M', 'lbl', 10, -10);
      rd.set(people.map((q) => [q.name, `MRS ${fmt(q.mrs)} · ${q.mrs > 2 ? 'steeper than' : q.mrs < 2 ? 'flatter than' : 'same slope as'} the line`]));
      if (!shown.length) { vd.set('', 'Pick at least one consumer.'); return; }
      const top = shown.reduce((a, b) => (b.mrs > a.mrs ? b : a));
      vd.set('ic', `<b>${top.name}</b> has the steepest curve at M: willing to give up ${fmt(top.mrs)} slices for one more beer. Curves of <i>different</i> people can cross. One person's curves cannot.`);
    }
    draw();
  });

  /* =====================================================================
     3.1  Special cases: imperfect / perfect substitutes / perfect complements
     ===================================================================== */
  reg('specialCases', (root) => {
    const { plotEl, side } = shell(root, 'Three shapes of indifference curves',
      'Switch between the cases and use the presets from lecture. The shape of the curve tells you how the MRS behaves.');
    const p = new Plot(plotEl, { xmax: 8, ymax: 8, xlabel: 'Good X', ylabel: 'Good Y' });
    let mode = 0, m = 1, r = 0.5;
    chips(side, ['Imperfect substitutes', 'Perfect substitutes', 'Perfect complements'], (i) => { mode = i; build(); }, { active: [0] });
    const box = mk('<div style="display:grid;gap:12px"></div>'); side.appendChild(box);
    const rd = readout(side), vd = verdict(side);
    function build() {
      box.innerHTML = '';
      if (mode === 1) {
        const sl = slider(box, { label: 'MRS (constant)', min: 0.2, max: 10, step: 0.1, value: m, onInput: (v) => { m = v; draw(); } });
        const pre = [['Coke &amp; Pepsi', 1, 'Coke', 'Pepsi'], ['Jennifer\'s cookies', 2, 'Chocolate chip', 'Peanut butter'], ['Loonies &amp; dimes', 10, 'Loonies', 'Dimes']];
        chips(box, pre.map((q) => `${q[0]} (${q[1]})`), (i) => { m = pre[i][1]; sl.set(m); p.setLabels(pre[i][2], pre[i][3]); draw(); });
        p.setLabels('Coke', 'Pepsi');
      } else if (mode === 2) {
        const sl = slider(box, { label: 'Units of Y needed per unit of X', min: 0.25, max: 3, step: 0.05, value: r, onInput: (v) => { r = v; draw(); } });
        const pre = [['Pasta &amp; sauce (2 : 1)', 0.5, 'Pasta', 'Sauce'], ['Screwdriver (1 : 1)', 1, 'Vodka', 'Orange juice'], ['Left &amp; right shoes', 1, 'Left shoes', 'Right shoes']];
        chips(box, pre.map((q) => q[0]), (i) => { r = pre[i][1]; sl.set(r); p.setLabels(pre[i][2], pre[i][3]); draw(); });
        p.setLabels('Pasta', 'Sauce');
      } else {
        p.setLabels('Beers', 'Pizza slices');
      }
      draw();
    }
    function draw() {
      p.clear();
      if (mode === 0) {
        p.setDomain(8, 8);
        [4, 9, 16].forEach((K, i) => p.fn((x) => K / x, K / 8, 8, i === 1 ? 'curve ic' : 'curve faint'));
        [[1.5, 6], [3, 3], [6, 1.5]].forEach(([x, y]) => { tangent(p, x, y, y / x, 'tangent', 55); p.dot(x, y, 5, 'pt-ic'); p.text(x, y, 'MRS ' + fmt(y / x), 'lbl', 10, -10); });
        rd.set([['Shape', 'Convex, bowed toward origin'], ['MRS', 'Falls as X rises'], ['Example', 'Beer and pizza']]);
        vd.set('ic', 'MRS is <b>not constant</b>: 4 → 1 → 0.25 along the middle curve. The goods substitute for each other, but imperfectly.');
      } else if (mode === 1) {
        const ymax = niceCeil(Math.max(4, m * 3.4));
        p.setDomain(4, ymax);
        [1, 2, 3].forEach((k) => {
          p.line(0, m * k, k, 0, k === 3 ? 'curve ic' : 'curve faint');
          p.dot(0, m * k, 4, 'pt'); p.text(0, m * k, fmt(m * k), 'ilabel', 8, -4);
        });
        rd.set([['Shape', 'Straight lines'], ['MRS', fmt(m) + ' everywhere'], ['Slope of each line', '−' + fmt(m)]]);
        vd.set('ic', `MRS is <b>constant</b>: the consumer always trades ${fmt(m)} units of Y for 1 X, no matter how much of each they hold. The line farthest out (magenta) gives the most utility.`);
      } else {
        p.setDomain(8, 8);
        p.path([[0, 0], [8, 8 * r]], 'curve ray');
        const base = r <= 1 ? 2 : 2 / r;
        [1, 2, 3].forEach((k) => {
          const cx = k * base, cy = k * base * r;
          p.path([[cx, 8], [cx, cy], [8, cy]], k === 3 ? 'curve ic' : 'curve faint');
          p.dot(cx, cy, 5, k === 3 ? 'pt-ic' : 'pt');
          p.text(cx, cy, `(${fmt(cx)}, ${fmt(cy)})`, 'ilabel', 8, 16);
        });
        rd.set([['Shape', 'L-shaped, corners on the ray'], ['Fixed ratio', `${fmt(r)} Y per X`], ['MRS', '0 on flat part, ∞ on vertical part']]);
        vd.set('ic', 'The goods are only useful together. Extra X without extra Y adds <b>no utility</b> (flat arm), and extra Y without X adds none either (vertical arm).');
      }
    }
    build();
  });

  /* =====================================================================
     3.1  Utility and diminishing marginal utility
     ===================================================================== */
  reg('muExplorer', (root) => {
    const { plotEl, side } = shell(root, 'Diminishing marginal utility',
      'U = x<sup>0.5</sup>y<sup>0.5</sup> with Y held fixed. Each coloured step is the extra utility from one more unit of X, which is MU<sub>X</sub>. Watch the steps shrink.');
    let x = 8, y = 5;
    const p = new Plot(plotEl, { xmax: 12, ymax: 12, xlabel: 'Quantity of X (Y held fixed)', ylabel: 'Utility (utils)' });
    slider(side, { label: 'Units of X', min: 1, max: 12, step: 1, value: x, onInput: (v) => { x = v; draw(); } });
    slider(side, { label: 'Y held fixed at', min: 1, max: 10, step: 1, value: y, onInput: (v) => { y = v; draw(); } });
    const tb = mk('<div class="table-wrap"><table><thead><tr><th>Bundle</th><th class="num">U</th><th class="num">ΔU = MU<sub>X</sub></th></tr></thead><tbody></tbody></table></div>');
    side.appendChild(tb);
    const vd = verdict(side);
    const U = (a) => Math.sqrt(a * y);
    function draw() {
      p.clear();
      p.fn(U, 0, 12, 'curve c3');
      for (let k = 1; k < x; k++) {
        p.line(k, U(k), k + 1, U(k), 'mu-step');
        p.line(k + 1, U(k), k + 1, U(k + 1), 'mu-bar' + (k === x - 1 ? ' hot' : ''));
      }
      p.dot(x, U(x), 6, 'pt-ic');
      p.text(x, U(x), fmt(U(x)) + ' utils', 'lbl', -8, -12, 'end');
      const rows = [];
      for (let k = Math.max(1, x - 4); k <= x; k++) rows.push(`<tr><td>(${k}, ${y})</td><td class="num">${fmt(U(k))}</td><td class="num">${k > 1 ? fmt(U(k) - U(k - 1)) : '–'}</td></tr>`);
      tb.querySelector('tbody').innerHTML = rows.join('');
      if (x > 2) vd.set('ic', `Unit ${x} of X adds <b>${fmt(U(x) - U(x - 1))}</b> utils, less than unit 2 added (${fmt(U(2) - U(1))}). Utility still rises (more is better), but by less each time.`);
      else vd.set('', 'Add more units of X to see marginal utility fall.');
    }
    draw();
  });

  /* =====================================================================
     3.2  Budget line lab
     ===================================================================== */
  const BUDGETS = {
    beer: {
      xname: 'Beers', yname: 'Pizza slices', px: 4, py: 2, I: 24,
      rx: [1, 10, 0.1], ry: [0.5, 6, 0.1], rI: [6, 48, 0.1],
      scen: [['P<sub>X</sub> ↑ $6', { px: 6 }], ['P<sub>X</sub> ↓ $2', { px: 2 }], ['P<sub>Y</sub> ↑ $4', { py: 4 }], ['P<sub>Y</sub> ↓ $1', { py: 1 }], ['I ↑ $28', { I: 28 }], ['I ↓ $20', { I: 20 }], ['All −10%', { px: 3.6, py: 1.8, I: 21.6 }]],
    },
    ex1: {
      xname: 'Entertainment', yname: 'Groceries', px: 40, py: 20, I: 200,
      rx: [10, 100, 1], ry: [5, 60, 1], rI: [50, 400, 5],
      scen: [['(c) P<sub>G</sub> ↑ $25', { py: 25 }], ['(d) I ↑ $320', { I: 320 }]],
    },
  };
  function describeChange(o, n) {
    const e = 1e-6, xi0 = o.I / o.px, yi0 = o.I / o.py, xi = n.I / n.px, yi = n.I / n.py;
    const rp0 = o.px / o.py, rp = n.px / n.py;
    const dx = xi - xi0, dy = yi - yi0;
    if (Math.abs(dx) < e && Math.abs(dy) < e) return ['', 'Same budget line as the original. (Scaling income and both prices by the same factor changes nothing.)'];
    if (Math.abs(rp - rp0) < e) return ['good', dx > 0 ? '<b>Parallel shift out.</b> Both intercepts rise, relative price and slope unchanged.' : '<b>Parallel shift in.</b> Both intercepts fall, relative price and slope unchanged.'];
    const steep = rp > rp0 ? 'steeper (relative price of X up)' : 'flatter (relative price of X down)';
    if (Math.abs(dy) < e) return ['ic', `<b>Pivots ${dx < 0 ? 'inward' : 'outward'} around the vertical intercept</b>, ${steep}. Only the X-intercept moved.`];
    if (Math.abs(dx) < e) return ['ic', `<b>Pivots ${dy > 0 ? 'upward' : 'downward'} around the horizontal intercept</b>, ${steep}. Only the Y-intercept moved.`];
    return ['ic', `Both intercepts moved (X-intercept ${dx > 0 ? 'up' : 'down'}, Y-intercept ${dy > 0 ? 'up' : 'down'}) and the line is ${steep}.`];
  }
  reg('budgetLab', (root, opts) => {
    const cfg = BUDGETS[opts.preset || 'beer'];
    const { plotEl, side } = shell(root, `Budget line: ${cfg.xname.toLowerCase()} and ${cfg.yname.toLowerCase()}`,
      'Move a price or income, or tap a change from lecture. The dashed line is the original budget; the shaded triangle is everything affordable.');
    const base = { px: cfg.px, py: cfg.py, I: cfg.I };
    const all = [base, ...cfg.scen.map((s) => Object.assign({}, base, s[1]))];
    const xmax = niceCeil(Math.max(...all.map((s) => s.I / s.px)) * 1.1);
    const ymax = niceCeil(Math.max(...all.map((s) => s.I / s.py)) * 1.08);
    const p = new Plot(plotEl, { xmax, ymax, xlabel: cfg.xname + ' (X)', ylabel: cfg.yname + ' (Y)' });
    const st = { ...base };
    const money = (v) => '$' + fmt(v);
    const sx = slider(side, { label: `Price of ${cfg.xname.toLowerCase()}, P<sub>X</sub>`, min: cfg.rx[0], max: cfg.rx[1], step: cfg.rx[2], value: st.px, format: money, onInput: (v) => { st.px = v; ch.clear(); draw(); } });
    const sy = slider(side, { label: `Price of ${cfg.yname.toLowerCase()}, P<sub>Y</sub>`, min: cfg.ry[0], max: cfg.ry[1], step: cfg.ry[2], value: st.py, format: money, onInput: (v) => { st.py = v; ch.clear(); draw(); } });
    const sI = slider(side, { label: 'Income, I', min: cfg.rI[0], max: cfg.rI[1], step: cfg.rI[2], value: st.I, format: money, onInput: (v) => { st.I = v; ch.clear(); draw(); } });
    const ch = chips(side, ['Original', ...cfg.scen.map((s) => s[0])], (i) => {
      const to = all[i], from = { ...st };
      tween(650, (e) => {
        for (const k of ['px', 'py', 'I']) st[k] = from[k] + (to[k] - from[k]) * e;
        sx.set(st.px); sy.set(st.py); sI.set(st.I); draw();
      });
    }, { active: [0] });
    const rd = readout(side), vd = verdict(side);
    function draw() {
      p.clear();
      const xi = st.I / st.px, yi = st.I / st.py, rp = st.px / st.py;
      p.path([[0, 0], [xi, 0], [0, yi]], 'afford', true);
      p.line(0, base.I / base.py, base.I / base.px, 0, 'bl-ghost');
      p.line(0, yi, xi, 0, 'bl');
      // slope triangle at the middle of the line: 1 more X costs rp units of Y
      const run = Math.max(1, Math.round(xi / 6)), ax = xi / 2 - run / 2, ay = yi - rp * ax;
      p.line(ax, ay, ax + run, ay, 'tri');
      p.line(ax + run, ay, ax + run, ay - rp * run, 'tri-rise');
      p.text(ax + run, ay - (rp * run) / 2, `−${fmt(rp * run)} Y per +${run} X`, 'ilabel', 8, 4);
      p.dot(xi, 0, 5, 'pt-bl'); p.dot(0, yi, 5, 'pt-bl');
      p.text(xi, 0, fmt(xi), 'ilabel', 0, -12, 'middle');
      p.text(0, yi, fmt(yi), 'ilabel', 10, 16);
      rd.set([
        ['Budget constraint', `${fmt(st.px)}x + ${fmt(st.py)}y = ${fmt(st.I)}`],
        ['X-intercept  I / P<sub>X</sub>', fmt(xi)],
        ['Y-intercept  I / P<sub>Y</sub>', fmt(yi)],
        ['Relative price of X  P<sub>X</sub> / P<sub>Y</sub>', fmt(rp) + '  (= slope)'],
      ]);
      const [kind, msg] = describeChange(base, st);
      vd.set(kind, msg + ` Buying 1 more ${cfg.xname.toLowerCase().replace(/s$/, '')} means giving up ${fmt(rp)} ${cfg.yname.toLowerCase()}.`);
    }
    draw();
  });

  /* =====================================================================
     3.2  Worksheet 3 table: predict how the budget line changes
     ===================================================================== */
  reg('blTable', (root) => {
    root.classList.add('lab', 'stack');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>Predict the change, then check</h4>
      <p>Start from P<sub>X</sub> = $4, P<sub>Y</sub> = $2, I = $24. Fill in each row, press <b>Check</b>, and tap a row to see it on the graph.</p></div>
      <div class="lab-plot"></div><div class="table-wrap bltable"><table><thead><tr><th>Change</th><th>Relative price of X</th><th>X-intercept</th><th>Y-intercept</th><th>Budget line</th></tr></thead><tbody></tbody></table></div><div class="lab-side"></div>`;
    const p = new Plot(root.querySelector('.lab-plot'), { xmax: 14, ymax: 26, xlabel: 'Beers (X)', ylabel: 'Pizza slices (Y)', h: 360 });
    const DIR = ['Increase', 'Decrease', 'No change'];
    const MOVE = ['Pivot left at vertical intercept, steeper', 'Pivot right at vertical intercept, flatter', 'Pivot down at horizontal intercept, flatter', 'Pivot up at horizontal intercept, steeper', 'Parallel shift right', 'Parallel shift left'];
    const rows = [
      ['P<sub>X</sub> ↑ to $6', { px: 6, py: 2, I: 24 }, [0, 1, 2, 0]],
      ['P<sub>X</sub> ↓ to $2', { px: 2, py: 2, I: 24 }, [1, 0, 2, 1]],
      ['P<sub>Y</sub> ↑ to $4', { px: 4, py: 4, I: 24 }, [1, 2, 1, 2]],
      ['P<sub>Y</sub> ↓ to $1', { px: 4, py: 1, I: 24 }, [0, 2, 0, 3]],
      ['I ↑ to $28', { px: 4, py: 2, I: 28 }, [2, 0, 0, 4]],
      ['I ↓ to $20', { px: 4, py: 2, I: 20 }, [2, 1, 1, 5]],
    ];
    const sel = (opts, id) => `<select id="${id}" aria-label="answer"><option value="">Choose…</option>${opts.map((o, i) => `<option value="${i}">${o}</option>`).join('')}</select>`;
    const tbody = root.querySelector('tbody');
    const base = 'bt' + (++wid);
    tbody.innerHTML = rows.map((r, i) => `<tr data-i="${i}"><td><button class="chip" data-show="${i}">${r[0]}</button></td>
      <td>${sel(DIR, `${base}-${i}-0`)}</td><td>${sel(DIR, `${base}-${i}-1`)}</td><td>${sel(DIR, `${base}-${i}-2`)}</td><td>${sel(MOVE, `${base}-${i}-3`)}</td></tr>`).join('');
    const side = root.querySelector('.lab-side');
    const r = row(side);
    const vd = verdict(side);
    button(r, 'Check my answers', () => {
      let right = 0, total = 0;
      rows.forEach((rw, i) => rw[2].forEach((ans, c) => {
        const s = root.querySelector(`#${base}-${i}-${c}`);
        total++;
        s.classList.remove('right', 'wrong');
        if (s.value === '') return;
        const ok = +s.value === ans;
        if (ok) right++;
        s.classList.add(ok ? 'right' : 'wrong');
      }));
      vd.set(right === total ? 'good' : '', `${right} of ${total} cells correct.${right < total ? ' Tip: recompute both intercepts, I/P<sub>X</sub> and I/P<sub>Y</sub>, for each row.' : ' Nice work.'}`);
    }, true);
    button(r, 'Reveal answers', () => {
      rows.forEach((rw, i) => rw[2].forEach((ans, c) => { const s = root.querySelector(`#${base}-${i}-${c}`); s.value = ans; s.classList.remove('wrong'); s.classList.add('right'); }));
      vd.set('good', 'All answers filled in. Tap each row to see the new budget line.');
    });
    button(r, 'Clear', () => { root.querySelectorAll('select').forEach((s) => { s.value = ''; s.classList.remove('right', 'wrong'); }); vd.set('', ''); });
    let shown = 0;
    function draw() {
      p.clear();
      const n = rows[shown][1];
      p.line(0, 12, 6, 0, 'bl-ghost');
      p.path([[0, 0], [n.I / n.px, 0], [0, n.I / n.py]], 'afford', true);
      p.line(0, n.I / n.py, n.I / n.px, 0, 'bl');
      p.dot(n.I / n.px, 0, 5, 'pt-bl'); p.dot(0, n.I / n.py, 5, 'pt-bl');
      p.text(n.I / n.px, 0, fmt(n.I / n.px), 'ilabel', 0, -12, 'middle');
      p.text(0, n.I / n.py, fmt(n.I / n.py), 'ilabel', 10, 16);
      p.text(6, 0, 'original', 'clabel', 4, -26);
      tbody.querySelectorAll('tr').forEach((tr) => tr.classList.toggle('sel', +tr.dataset.i === shown));
    }
    tbody.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => { shown = +b.dataset.show; draw(); }));
    vd.set('', '');
    draw();
  });

  /* =====================================================================
     3.3  Optimal bundle lab (interior solution, Cobb–Douglas preferences)
     ===================================================================== */
  const OPT = {
    joe: { label: 'Joe', xname: 'beers', yname: 'pizza slices', px: 4, py: 2, I: 24, a: 0.6, start: [3, 6], note: 'Joe starts at M = (3, 6), where his MRS is 3.' },
    mary: { label: 'Mary', xname: 'beers', yname: 'pizza slices', px: 4, py: 2, I: 24, a: 1 / 3, start: [3, 6], note: 'Mary starts at M = (3, 6), where her MRS is 1.' },
    mike: { label: 'Mike · Worksheet 4', xname: 'Cal Ripken cards', yname: 'Nolan Ryan cards', px: 24, py: 12, I: 120, a: 2 / 3, start: [4, 2], note: 'Mike holds 4 Cal and 2 Nolan cards. His MRS there is 1.' },
    jane: { label: 'Jane · Ex. 4', xname: 'hamburgers', yname: 'milkshakes', px: 3, py: 1, I: 12, a: 0.5, start: [3, 3], note: 'Jane starts at (3 burgers, 3 shakes) with MRS = 1.' },
    kory: { label: 'Kory · Ex. 3', xname: 'CDs', yname: 'cups of hot chocolate', px: 10, py: 2, I: 50, a: 0.4, start: [1, 10], note: 'Kory at (1 CD, 10 cups) spends $30 of her $50. The model\'s MRS values can differ from the numbers in the question.' },
    ex2: { label: 'Exercise 2', xname: 'movie tickets', yname: 'concert tickets', px: 20, py: 40, I: 280, a: 4 / 7, start: [2, 6], note: 'Budget line from (0, 7) to (14, 0), as in the Exercise 2 graph.' },
  };
  reg('optimumLab', (root, opts) => {
    const keys = (opts.presets || 'joe,mary').split(',');
    let cfg;
    const { plotEl, side } = shell(root, 'Find the optimal bundle',
      'Drag the bundle anywhere (it snaps to the budget line when close). Compare the MRS with the relative price, then press <b>Walk to the optimum</b> to watch the consumer trade toward the tangency.');
    const p = new Plot(plotEl, { xmax: 10, ymax: 16 });
    const top = mk('<div style="display:grid;gap:10px"></div>'); side.appendChild(top);
    const pc = keys.length > 1 ? chips(top, keys.map((k) => OPT[k].label), (i) => load(keys[i])) : null;
    const noteEl = note(top, '');
    const ctl = mk('<div style="display:grid;gap:10px"></div>'); side.appendChild(ctl);
    const cmp = mk('<div class="compare"></div>'); side.appendChild(cmp);
    const vd = verdict(side);
    const r = row(side);
    const walkBtn = button(r, 'Walk to the optimum', walk, true);
    button(r, 'Back to start', () => { stop(); trail = null; P = [...cfg.start]; draw(); });
    const showOpt = check(side, 'Show the optimal bundle', false, () => draw());
    const rd = readout(side);
    const legend = mk('<div class="legend"><span><i class="sw-bl"></i>Budget line</span><span><i class="sw-ic"></i>Indifference curve through bundle</span><span><i class="sw-opt"></i>Optimum</span></div>');
    side.appendChild(legend);

    let st, P, trail = null, cancel = null, sliders = {};
    const h = p.handle(0, 0, { label: 'Consumption bundle', onMove: (x, y) => { stop(); P = snap(x, y); draw(); } });

    function stop() { if (cancel) cancel(); cancel = null; walkBtn.disabled = false; }
    function fitDomain(force) {
      const xi = st.I / st.px, yi = st.I / st.py;
      if (force || xi > p.o.xmax * 0.98 || yi > p.o.ymax * 0.98) p.setDomain(niceCeil(xi * 1.4), niceCeil(yi * 1.25));
    }
    function snap(x, y) {
      const spend = st.px * x + st.py * y;
      if (Math.abs(spend - st.I) / st.I < 0.04) { x = Math.min(x, st.I / st.px); y = (st.I - st.px * x) / st.py; }
      return [x, Math.max(0, y)];
    }
    function load(key) {
      stop();
      cfg = OPT[key];
      st = { px: cfg.px, py: cfg.py, I: cfg.I, a: cfg.a };
      P = [...cfg.start]; trail = null;
      noteEl.textContent = cfg.note;
      p.setLabels(cap(cfg.xname) + ' (X)', cap(cfg.yname) + ' (Y)');
      fitDomain(true);
      ctl.innerHTML = '';
      const pstep = (v) => (v >= 10 ? 1 : 0.1);
      const money = (v) => '$' + fmt(v);
      sliders.px = slider(ctl, { label: `P<sub>X</sub>, price of ${cfg.xname}`, min: Math.max(pstep(cfg.px), cfg.px * 0.25), max: cfg.px * 3, step: pstep(cfg.px), value: st.px, format: money, onInput: (v) => { stop(); st.px = v; fitDomain(); draw(); } });
      sliders.py = slider(ctl, { label: `P<sub>Y</sub>, price of ${cfg.yname}`, min: Math.max(pstep(cfg.py), cfg.py * 0.25), max: cfg.py * 3, step: pstep(cfg.py), value: st.py, format: money, onInput: (v) => { stop(); st.py = v; fitDomain(); draw(); } });
      sliders.I = slider(ctl, { label: 'Income, I', min: cfg.I * 0.25, max: cfg.I * 2, step: cfg.I >= 100 ? 5 : cfg.I >= 20 ? 1 : 0.5, value: st.I, format: money, onInput: (v) => { stop(); st.I = v; fitDomain(); draw(); } });
      sliders.a = slider(ctl, { label: 'Taste for X (a in U = x<sup>a</sup>y<sup>1−a</sup>)', min: 0.1, max: 0.9, step: 0.01, value: st.a, onInput: (v) => { stop(); st.a = v; draw(); } });
      draw();
    }
    function walk() {
      stop();
      const { px, py, I, a } = st;
      const xs = (a * I) / px;
      const spend = px * P[0] + py * P[1];
      const startU = CD.U(a, P[0], P[1]);
      trail = startU > 0.01 ? startU : null;
      let Q = spend > 0 ? [P[0] * I / spend, P[1] * I / spend] : [I / px / 2, I / py / 2];
      const from = [...P];
      walkBtn.disabled = true;
      const along = () => {
        const x0 = P[0];
        cancel = tween(1600, (e) => { const x = x0 + (xs - x0) * e; P = [x, (I - px * x) / py]; draw(); }, () => { cancel = null; walkBtn.disabled = false; showOpt.checked = true; draw(); });
      };
      if (Math.abs(spend - I) / I > 0.005) {
        cancel = tween(700, (e) => { P = [from[0] + (Q[0] - from[0]) * e, from[1] + (Q[1] - from[1]) * e]; draw(); }, along);
      } else along();
    }
    function draw() {
      const { px, py, I, a } = st;
      const xi = I / px, yi = I / py, rp = px / py;
      const xs = (a * I) / px, ys = ((1 - a) * I) / py;
      const [x, y] = P;
      p.clear();
      p.path([[0, 0], [xi, 0], [0, yi]], 'afford', true);
      p.line(0, yi, xi, 0, 'bl');
      p.text(0, yi, fmt(yi), 'ilabel', 10, 16); p.text(xi, 0, fmt(xi), 'ilabel', 0, -12, 'middle');
      const x0 = p.o.xmax / 300;
      if (trail) {
        p.fn((t) => CD.icY(a, trail, t), x0, p.o.xmax, 'curve ghost-ic');
      }
      const Uo = CD.U(a, xs, ys);
      if (showOpt.checked) {
        p.fn((t) => CD.icY(a, Uo, t), x0, p.o.xmax, 'curve opt');
        p.dot(xs, ys, 11, 'ring-opt');
        p.text(xs, ys, `Optimum (${fmt(xs)}, ${fmt(ys)})`, 'lbl', 14, -14);
      }
      const U = x > 0 && y > 0 ? CD.U(a, x, y) : 0;
      if (U > 0.001) p.fn((t) => CD.icY(a, U, t), x0, p.o.xmax, 'curve ic');
      const mrs = CD.mrs(a, x, y);
      if (x > 0 && y > 0) tangent(p, x, y, mrs, 'tangent', 60);
      const spend = px * x + py * y, gap = I - spend;
      const onBL = Math.abs(gap) / I < 0.005;
      const tangency = onBL && isFinite(mrs) && Math.abs(mrs - rp) / rp < 0.03;
      if (onBL && !tangency) {
        const dir = Math.sign(xs - x), step = Math.min(Math.abs(xs - x), p.o.xmax * 0.14);
        p.arrow(x, y, x + dir * step, y - dir * step * rp, 'arr');
      } else if (gap > 0 && spend >= 0) {
        const k = spend > 0 ? I / spend : 1;
        const tx = spend > 0 ? x * k : xi / 2, ty = spend > 0 ? y * k : yi / 2;
        p.arrow(x, y, x + (tx - x) * 0.7, y + (ty - y) * 0.7, 'arr');
      }
      h.set(x, y);

      const X = cfg.xname, Y = cfg.yname;
      cmp.innerHTML = `<div><span class="big ic">${fmt(mrs)}</span><small>MRS of X for Y<br>(${Y} they'd give up per unit of X)</small></div>
        <div class="sym">${!isFinite(mrs) ? '>' : tangency ? '=' : mrs > rp ? '>' : '<'}</div>
        <div><span class="big bl">${fmt(rp)}</span><small>P<sub>X</sub>/P<sub>Y</sub><br>(${Y} the market charges per unit of X)</small></div>`;
      if (gap < -I * 0.005) vd.set('bad', `<b>Not affordable.</b> This bundle costs $${fmt(spend)}, which is $${fmt(-gap)} more than the budget.`);
      else if (!onBL) vd.set('', `<b>Money left over: $${fmt(gap)}.</b> More is better, so spending the rest on more of both goods raises utility. The optimum is always on the budget line.`);
      else if (tangency) vd.set('good', `<b>Tangency: MRS = P<sub>X</sub>/P<sub>Y</sub> = ${fmt(rp)}.</b> The indifference curve just touches the budget line. No trade along the line can raise utility, so this is the optimal bundle.`);
      else if (mrs > rp) vd.set('ic', `<b>X is a good deal for this consumer.</b> They would give up ${fmt(mrs)} ${Y} for one more unit of ${X}, but the market only asks ${fmt(rp)}. Buy more ${X} and fewer ${Y}. As they do, MU<sub>X</sub> falls, MU<sub>Y</sub> rises, and the MRS falls toward ${fmt(rp)}.`);
      else vd.set('ic', `<b>X is poor value for this consumer.</b> One more unit of ${X} is worth only ${fmt(mrs)} ${Y} to them, but costs ${fmt(rp)}. Buy fewer ${X} and more ${Y}. The MRS rises toward ${fmt(rp)} as they do.`);
      const bx = x > 0 ? CD.mux(a, x, y) / px : Infinity, by = y > 0 ? CD.muy(a, x, y) / py : Infinity;
      rd.set([
        ['Bundle (x, y)', `(${fmt(x)}, ${fmt(y)})`],
        ['Cost vs budget', `$${fmt(spend)} of $${fmt(I)}`],
        ['Utility U', fmt(U, 3)],
        ['Bang for the buck: MU<sub>X</sub>/P<sub>X</sub> vs MU<sub>Y</sub>/P<sub>Y</sub>', `${fmt(bx, 3)} vs ${fmt(by, 3)}`],
        ['Optimum (aI/P<sub>X</sub>, (1−a)I/P<sub>Y</sub>)', `(${fmt(xs)}, ${fmt(ys)})`],
      ]);
    }
    if (pc) pc.setActive(Math.max(0, keys.indexOf(opts.preset || keys[0])));
    load(opts.preset && OPT[opts.preset] ? opts.preset : keys[0]);
  });

  /* =====================================================================
     3.3  Corner solutions with perfect substitutes
     ===================================================================== */
  const CORNER = {
    apples1: { label: 'Apples: equal prices', xname: 'BC apples', yname: 'Washington apples', px: 0.4, py: 0.4, I: 2, mrs: 1 },
    apples2: { label: 'Apples: BC at $0.50', xname: 'BC apples', yname: 'Washington apples', px: 0.5, py: 0.4, I: 2, mrs: 1 },
    jen: { label: 'Jennifer (a–d)', xname: 'chocolate chip cookies', yname: 'peanut butter cookies', px: 1, py: 1, I: 10, mrs: 2 },
    jenE: { label: 'Jennifer (e): $2', xname: 'chocolate chip cookies', yname: 'peanut butter cookies', px: 2, py: 1, I: 10, mrs: 2 },
    jenF: { label: 'Jennifer (f): $2.50', xname: 'chocolate chip cookies', yname: 'peanut butter cookies', px: 2.5, py: 1, I: 10, mrs: 2 },
    donna: { label: 'Donna: Coke $1.50', xname: 'Coke', yname: 'Pepsi', px: 1.5, py: 1, I: 6, mrs: 1 },
    donnaD: { label: 'Donna (d): both $1', xname: 'Coke', yname: 'Pepsi', px: 1, py: 1, I: 6, mrs: 1 },
    john: { label: 'John: MRS 5', xname: 'beers', yname: 'pizza slices', px: 4, py: 2, I: 24, mrs: 5 },
    nancy: { label: 'Nancy: MRS 0.2', xname: 'beers', yname: 'pizza slices', px: 4, py: 2, I: 24, mrs: 0.2 },
  };
  reg('cornerLab', (root, opts) => {
    const keys = (opts.presets || 'apples1,apples2,john,nancy').split(',');
    const { plotEl, side } = shell(root, 'Corner solutions: perfect substitutes',
      'Indifference curves are straight lines with slope −MRS. Compare the curve through each end of the budget line: the one farther out wins. Press <b>Sweep P<sub>X</sub></b> to watch the choice jump.');
    const p = new Plot(plotEl, { xmax: 10, ymax: 10 });
    const pc = chips(side, keys.map((k) => CORNER[k].label), (i) => load(keys[i]));
    const ctl = mk('<div style="display:grid;gap:10px"></div>'); side.appendChild(ctl);
    const cmp = mk('<div class="compare"></div>'); side.appendChild(cmp);
    const vd = verdict(side);
    const r = row(side);
    const sweepBtn = button(r, 'Sweep P<sub>X</sub> from low to high', sweep, true);
    const rd = readout(side);
    let cfg, st, sl = {}, cancel = null;
    function stop() { if (cancel) cancel(); cancel = null; sweepBtn.disabled = false; }
    function fit() {
      const xi = st.I / st.px, yi = st.I / st.py;
      const m = niceCeil(Math.max(xi, yi) * 1.15);
      if (xi > p.o.xmax * 0.98 || yi > p.o.ymax * 0.98 || p.o.xmax !== m) p.setDomain(m, m);
    }
    function load(key) {
      stop();
      cfg = CORNER[key]; st = { px: cfg.px, py: cfg.py, I: cfg.I, mrs: cfg.mrs };
      p.setLabels(cap(cfg.xname) + ' (X)', cap(cfg.yname) + ' (Y)');
      ctl.innerHTML = '';
      const money = (v) => '$' + fmt(v);
      const ps = (v) => (v < 2 ? 0.05 : 0.1);
      sl.px = slider(ctl, { label: `P<sub>X</sub>, price of ${cfg.xname}`, min: ps(cfg.px), max: Math.max(cfg.px, cfg.py * cfg.mrs) * 2.5, step: ps(cfg.px), value: st.px, format: money, onInput: (v) => { stop(); st.px = v; fit(); draw(); } });
      sl.py = slider(ctl, { label: `P<sub>Y</sub>, price of ${cfg.yname}`, min: ps(cfg.py), max: cfg.py * 3, step: ps(cfg.py), value: st.py, format: money, onInput: (v) => { stop(); st.py = v; fit(); draw(); } });
      sl.mrs = slider(ctl, { label: 'MRS of X for Y (constant)', min: 0.1, max: Math.max(6, cfg.mrs * 1.5), step: 0.1, value: st.mrs, onInput: (v) => { stop(); st.mrs = v; draw(); } });
      fit(); draw();
    }
    function sweep() {
      stop();
      const lo = st.py * st.mrs * 0.4, hi = st.py * st.mrs * 1.8;
      sweepBtn.disabled = true;
      cancel = tween(4200, (e) => { st.px = lo + (hi - lo) * e; sl.px.set(st.px); fit(); draw(); }, () => { cancel = null; sweepBtn.disabled = false; });
    }
    function draw() {
      const { px, py, I, mrs } = st;
      const xi = I / px, yi = I / py, rp = px / py;
      const Ux = mrs * xi, Uy = yi; // utility measured in units of Y
      const equal = Math.abs(mrs - rp) / rp < 0.01;
      p.clear();
      p.path([[0, 0], [xi, 0], [0, yi]], 'afford', true);
      const ic = (L, cls) => p.line(0, L, L / mrs, 0, cls);
      ic(Math.min(Ux, Uy) * 0.45, 'curve faint');
      if (equal) {
        p.line(0, yi, xi, 0, 'bl');
        p.line(0, yi, xi, 0, 'curve opt-solid');
      } else {
        ic(Ux, Ux > Uy ? 'curve ic' : 'curve faint');
        ic(Uy, Uy > Ux ? 'curve ic' : 'curve faint');
        p.line(0, yi, xi, 0, 'bl');
        const [ox, oy] = Ux > Uy ? [xi, 0] : [0, yi];
        p.dot(ox, oy, 11, 'ring-opt');
        p.text(ox, oy, 'Optimum', 'lbl', Ux > Uy ? -8 : 16, Ux > Uy ? -18 : 4, Ux > Uy ? 'end' : 'start');
      }
      p.text(xi, 0, fmt(xi), 'ilabel', 0, 16, 'middle');
      p.text(0, yi, fmt(yi), 'ilabel', -8, 4, 'end');
      cmp.innerHTML = `<div><span class="big ic">${fmt(mrs)}</span><small>MRS of X for Y<br>(constant)</small></div><div class="sym">${equal ? '=' : mrs > rp ? '>' : '<'}</div><div><span class="big bl">${fmt(rp)}</span><small>Relative price<br>P<sub>X</sub>/P<sub>Y</sub></small></div>`;
      const X = cfg.xname, Y = cfg.yname;
      if (equal) vd.set('good', `<b>MRS = relative price.</b> The indifference curve lies on top of the budget line, so <b>any bundle on it is optimal</b>, including both corners.`);
      else if (mrs > rp) vd.set('good', `<b>Corner solution: spend it all on ${X}</b> (${fmt(xi)} units). ${cap(X)} is worth ${fmt(mrs)} ${Y} to them but costs only ${fmt(rp)}. They keep substituting until there is no ${Y} left to give up.`);
      else vd.set('good', `<b>Corner solution: spend it all on ${Y}</b> (${fmt(yi)} units). One ${X.replace(/s$/, '')} is worth ${fmt(mrs)} ${Y} to them but costs ${fmt(rp)}. They substitute ${Y} for ${X} until they hold no ${X}.`);
      rd.set([
        ['Budget', `$${fmt(I)}: ${fmt(px)}x + ${fmt(py)}y`],
        [`All ${X}`, `${fmt(xi)} units, worth ${fmt(Ux)} in ${Y}`],
        [`All ${Y}`, `${fmt(yi)} units`],
        ['Tangency holds?', equal ? 'Yes (whole line)' : 'No: corner solution'],
      ]);
    }
    const first = opts.preset && keys.includes(opts.preset) ? opts.preset : keys[0];
    pc.setActive(keys.indexOf(first));
    load(first);
  });

  /* =====================================================================
     3.4  Equal bangs for the buck with three goods
     ===================================================================== */
  reg('bangForBuck', (root) => {
    root.classList.add('lab');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>Spend $21 for the most utility</h4>
      <p>Each unit adds less utility than the one before. Buy units yourself, or press <b>Buy the best next unit</b> to always put the next dollars where MU/P is highest.</p></div><div class="bfb"></div><div class="lab-side"></div>`;
    const goods = [
      { name: 'Coffee', p: 2, mu: [20, 16, 12, 8, 6, 4] },
      { name: 'Sandwich', p: 4, mu: [40, 32, 24, 16, 8, 4] },
      { name: 'Chips', p: 1, mu: [9, 7, 6, 4, 3, 2, 1] },
    ];
    const BUDGET = 21;
    const q = goods.map(() => 0);
    const box = root.querySelector('.bfb'), side = root.querySelector('.lab-side');
    const r = row(side);
    button(r, 'Buy the best next unit', () => { const b = best(); if (b >= 0) { q[b]++; draw(); } }, true);
    button(r, 'Reset', () => { q.fill(0); draw(); });
    const rd = readout(side), vd = verdict(side);
    const left = () => BUDGET - goods.reduce((s, g, i) => s + g.p * q[i], 0);
    const nextMU = (i) => goods[i].mu[q[i]];
    const canBuy = (i) => nextMU(i) != null && goods[i].p <= left();
    function best() {
      let b = -1, v = -1;
      goods.forEach((g, i) => { if (canBuy(i) && nextMU(i) / g.p > v) { v = nextMU(i) / g.p; b = i; } });
      return b;
    }
    function draw() {
      const b = best();
      box.innerHTML = goods.map((g, i) => {
        const nm = nextMU(i), ratio = nm != null ? nm / g.p : 0;
        const last = q[i] > 0 ? g.mu[q[i] - 1] / g.p : null;
        return `<div class="bfb-row${i === b ? ' best' : ''}"><div class="bfb-name"><b>${g.name}</b><small>$${g.p} each</small></div>
          <div class="stepper"><button data-d="-1" data-i="${i}" aria-label="Buy one less ${g.name}" ${q[i] === 0 ? 'disabled' : ''}>−</button><span>${q[i]}</span><button data-d="1" data-i="${i}" aria-label="Buy one more ${g.name}" ${canBuy(i) ? '' : 'disabled'}>+</button></div>
          <div class="bfb-bar"><div class="bar-track"><div class="bar-fill" style="width:${(ratio / 10) * 100}%"></div></div>
          <div class="bfb-meta"><span>next unit: MU ${nm ?? '–'} → MU/P ${nm != null ? fmt(ratio) : '–'}</span><span>last unit MU/P ${last != null ? fmt(last) : '–'}</span></div></div></div>`;
      }).join('');
      box.querySelectorAll('[data-d]').forEach((btn) => btn.addEventListener('click', () => { const i = +btn.dataset.i; q[i] = Math.max(0, q[i] + +btn.dataset.d); draw(); }));
      const U = goods.reduce((s, g, i) => s + g.mu.slice(0, q[i]).reduce((a, c) => a + c, 0), 0);
      rd.set([['Money left', '$' + left()], ['Total utility', U + ' utils'], ['Best possible with $21', '166 utils']]);
      const lastR = goods.map((g, i) => (q[i] ? g.mu[q[i] - 1] / g.p : null));
      if (left() === 0 && lastR.every((v) => v != null && Math.abs(v - lastR[0]) < 1e-9)) vd.set('good', `<b>Equal bangs for the buck:</b> the last dollar on each good buys ${fmt(lastR[0])} utils (MU/P). Moving a dollar from one good to another can't raise utility. That is the optimum: ${U} utils.`);
      else if (b < 0) vd.set('', `Budget used up. Total utility: ${U} utils. ${U < 166 ? 'Compare the last-unit MU/P values: shifting dollars toward the good with the higher value would help.' : ''}`);
      else vd.set('ic', `Right now the next dollars do the most on <b>${goods[b].name.toLowerCase()}</b> (MU/P = ${fmt(nextMU(b) / goods[b].p)}). Spending where MU/P is highest keeps raising utility.`);
    }
    draw();
  });
})();
