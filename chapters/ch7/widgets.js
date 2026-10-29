/* Chapter 7 interactive figures: economic vs accounting cost, rental price of capital,
   SR cost curves (Table 7.1), LR cost minimization (isocost + isoquant), LRATC envelope. */
(function () {
  const { Plot, fmt, tween, niceCeil } = Graph;
  const { mk, shell, slider, chips, check, readout, verdict, button, row } = UI;
  const reg = Study.registerWidget;
  const $ = (v, d = 0) => (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d });

  /* ---------- 7.1 Wine bar: explicit vs implicit costs ---------- */
  reg('wineBar', (root) => {
    root.classList.add('lab');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>Should the wine bar open? Accounting vs economic profit</h4>
      <p>$1 million to open: $400,000 borrowed and $600,000 from savings. The owner quits a job to run it and takes no salary. Change the numbers and watch the two profits.</p></div><div class="lab-side"></div>`;
    const side = root.querySelector('.lab-side');
    const st = { rev: 1140000, salary: 90000, rate: 4 };
    slider(side, { label: 'Total revenue in year 1', min: 900000, max: 1300000, step: 2000, value: st.rev, format: (v) => $(v), onInput: (v) => { st.rev = v; draw(); } });
    slider(side, { label: 'Salary given up', min: 0, max: 150000, step: 5000, value: st.salary, format: (v) => $(v), onInput: (v) => { st.salary = v; draw(); } });
    slider(side, { label: 'Interest rate', min: 0, max: 10, step: 0.5, value: st.rate, format: (v) => v + '%', onInput: (v) => { st.rate = v; draw(); } });
    const r = row(side);
    button(r, 'Boom: accounting profit $124k', () => { st.rev = 1016000 + 124000; draw(true); });
    button(r, 'Slump: accounting profit $80k', () => { st.rev = 1016000 + 80000; draw(true); });
    const rd = readout(side), vd = verdict(side);
    const sliders = side.querySelectorAll('input[type=range]');
    function draw(sync) {
      if (sync) { sliders[0].value = st.rev; sliders[0].dispatchEvent(new Event('input')); return; }
      const interestPaid = 400000 * st.rate / 100, explicit = 1000000 + interestPaid;
      const interestForgone = 600000 * st.rate / 100, implicit = interestForgone + st.salary;
      const acc = st.rev - explicit, eco = acc - implicit;
      rd.set([['Explicit costs: $1M spending + interest on the loan', $(explicit)], ['Implicit costs: interest forgone on savings + salary forgone', `${$(interestForgone)} + ${$(st.salary)} = ${$(implicit)}`],
        ['Accounting cost = explicit', $(explicit)], ['Economic cost = explicit + implicit', $(explicit + implicit)],
        ['Accounting profit = TR − explicit', $(acc)], ['Economic profit = accounting profit − implicit', $(eco)]]);
      vd.set(eco >= 0 ? 'good' : 'bad', eco >= 0 ? `Economic profit is ${$(eco)}: the bar beats the owner's next-best use of money and time. <b>Open it.</b>`
        : `Accounting profit is ${$(acc)}, but economic profit is ${$(eco)}: the owner would do better keeping the job and the savings. <b>Don't open it.</b> Economic profit is what guides the decision.`);
    }
    draw();
  });

  /* ---------- 7.1 Rental price of capital (Air Canada plane) ---------- */
  reg('rentalCapital', (root) => {
    root.classList.add('lab');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>The rental price of a $150M airplane</h4>
      <p>A plane lasts 30 years. Its yearly cost isn't $150M: it's the depreciation for the year plus the interest given up on the money tied up in it.</p></div><div class="lab-side"></div>`;
    const side = root.querySelector('.lab-side');
    const st = { price: 150, life: 30, rate: 4, year: 1 };
    slider(side, { label: 'Year of use', min: 1, max: 30, step: 1, value: 1, onInput: (v) => { st.year = v; draw(); } });
    slider(side, { label: 'Interest rate', min: 1, max: 10, step: 0.5, value: 4, format: (v) => v + '%', onInput: (v) => { st.rate = v; draw(); } });
    const rd = readout(side), vd = verdict(side);
    function draw() {
      const dep = st.price / st.life, value = st.price - dep * (st.year - 1), interest = value * st.rate / 100, R = dep + interest;
      rd.set([['Value at start of year ' + st.year, '$' + fmt(value) + 'M'], ['Depreciation = $150M ÷ 30', '$' + fmt(dep) + 'M'], [`Interest forgone = ${st.rate}% × value`, '$' + fmt(interest) + 'M'],
        ['Rental price per year', '$' + fmt(R) + 'M'], ['Rental price per day', $(R * 1e6 / 365)]]);
      vd.set('ic', `Rental price of capital = depreciation + interest forgone = $${fmt(dep)}M + $${fmt(interest)}M = <b>$${fmt(R)}M</b> in year ${st.year}. If Air Canada borrowed the money, the interest would be an explicit cost; using its own cash, it's implicit.`);
    }
    draw();
  });

  /* ---------- 7.2 SR cost curves from Table 7.1 ---------- */
  const FC = 50, VC = [0, 50, 78, 98, 112, 130, 150, 175, 204, 242, 300, 385];
  const T71 = VC.map((v, q) => ({ q, vc: v, tc: v + FC, mc: q ? v - VC[q - 1] : null, afc: q ? FC / q : null, avc: q ? v / q : null, atc: q ? (v + FC) / q : null }));
  window.TABLE71 = T71;
  reg('srCosts', (root) => {
    const { plotEl, side } = shell(root, 'Short-run costs (Table 7.1)',
      'FC = $50. Move along output to see each cost. MC cuts AVC and ATC at their minimums. Tick the box to see total cost as the area ATC × q.');
    const p = new Plot(plotEl, { xmax: 11.5, ymax: 110, xlabel: 'Output, q', ylabel: 'Cost per unit ($)' });
    let q = 4, showArea = true;
    slider(side, { label: 'Output, q', min: 1, max: 11, step: 1, value: q, onInput: (v) => { q = v; draw(); } });
    check(side, 'Show TC = ATC × q as an area', true, (v) => { showArea = v; draw(); });
    const legend = mk('<div class="legend"><span><i class="sw-ic"></i>MC</span><span><i class="sw-acc"></i>ATC</span><span><i class="sw-opt"></i>AVC</span><span><i class="sw-ink"></i>AFC</span></div>');
    side.appendChild(legend);
    const tb = mk('<div class="table-wrap"><table class="compact"><thead><tr><th class="num">q</th><th class="num">VC</th><th class="num">TC</th><th class="num">MC</th><th class="num">AVC</th><th class="num">ATC</th></tr></thead><tbody></tbody></table></div>');
    side.appendChild(tb);
    const vd = verdict(side);
    const pts = (k) => T71.slice(1).map((r) => [r.q, r[k]]);
    function draw() {
      p.clear();
      const r = T71[q];
      if (showArea) { p.rect(0, 0, q, r.atc, 'cs-base'); p.text(q / 2, r.atc / 2, `TC = $${fmt(r.atc)} × ${q} = $${r.tc}`, 'lbl', 0, 4, 'middle'); }
      p.path(pts('afc'), 'curve faint'); p.path(pts('avc'), 'curve c4'); p.path(pts('atc'), 'curve c3'); p.path(pts('mc'), 'curve ic');
      p.text(11, T71[11].mc, 'MC', 'clabel', 6, 4); p.text(11, T71[11].atc, 'ATC', 'clabel', 6, 4); p.text(11, T71[11].avc, 'AVC', 'clabel', 6, 4); p.text(11, T71[11].afc, 'AFC', 'clabel', 6, 4);
      p.line(q, 0, q, 110, 'guide-v');
      ['mc', 'avc', 'atc'].forEach((k) => p.dot(q, r[k], 5, k === 'mc' ? 'pt-ic' : k === 'avc' ? 'pt-opt' : 'pt'));
      p.dot(7, T71[7].avc, 4, 'ring-opt'); p.dot(8, T71[8].atc, 4, 'ring-opt');
      tb.querySelector('tbody').innerHTML = T71.slice(1).filter((x) => Math.abs(x.q - q) <= 2).map((x) => `<tr${x.q === q ? ' class="sel"' : ''}><td class="num">${x.q}</td><td class="num">${x.vc}</td><td class="num">${x.tc}</td><td class="num">${x.mc}</td><td class="num">${fmt(x.avc, 1)}</td><td class="num">${fmt(x.atc, 1)}</td></tr>`).join('');
      const rel = (a, b, name) => (a < b - 0.01 ? `MC ($${fmt(a)}) &lt; ${name} so ${name} is falling` : a > b + 0.01 ? `MC ($${fmt(a)}) &gt; ${name} so ${name} is rising` : `MC = ${name}`);
      const nxt = T71[Math.min(11, q + 1)];
      vd.set('ic', `At q = ${q}: TC = $${r.tc}, ATC = $${fmt(r.atc)}, AVC = $${fmt(r.avc)}. Next unit costs MC = $${nxt.mc}. ${q < 11 ? rel(nxt.mc, r.avc, 'AVC') + '; ' + rel(nxt.mc, r.atc, 'ATC') + '.' : ''} Min AVC ≈ $25 (q = 6–7); min ATC ≈ $31.75 (q = 8). MC falls while MPL rises, then rises once MPL diminishes (MC = W/MPL).`);
    }
    draw();
  });

  /* ---------- 7.3 LR cost minimization: isoquant + isocost ---------- */
  reg('costMin', (root) => {
    const { plotEl, side } = shell(root, 'Cheapest way to make q units',
      'Production q = √(LK). Drag the bundle along the isoquant. The orange isocost line through it shows what it costs. The cheapest bundle is where the isocost is tangent: MRTS = W/R.');
    const p = new Plot(plotEl, { xmax: 12, ymax: 12, xlabel: 'Labour, L', ylabel: 'Capital, K' });
    const st = { q: 4, W: 20, R: 10, L: 1.6 };
    let cancel;
    const sW = slider(side, { label: 'Wage, W', min: 5, max: 60, step: 1, value: st.W, format: (v) => '$' + v, onInput: (v) => { st.W = v; draw(); } });
    slider(side, { label: 'Rental price of capital, R', min: 5, max: 60, step: 1, value: st.R, format: (v) => '$' + v, onInput: (v) => { st.R = v; draw(); } });
    slider(side, { label: 'Output to produce, q', min: 2, max: 7, step: 0.5, value: st.q, onInput: (v) => { st.q = v; draw(); } });
    const r = row(side);
    button(r, 'Walk to the cheapest bundle', () => { if (cancel) cancel(); const from = st.L, to = st.q * Math.sqrt(st.R / st.W); cancel = tween(1100, (e) => { st.L = from + (to - from) * e; draw(); }); }, true);
    button(r, 'Wage doubles', () => { st.L = st.q * Math.sqrt(st.R / st.W); st.W = Math.min(60, st.W * 2); sW.set(st.W); draw(); });
    const rd = readout(side), vd = verdict(side);
    const h = p.handle(st.L, 0, { label: 'Input bundle on the isoquant', onMove: (x) => { if (cancel) cancel(); st.L = Math.max(0.4, Math.min(11.5, x)); draw(); } });
    function draw() {
      p.clear();
      const { q, W, R } = st, K = (L) => (q * q) / L;
      const L = st.L, Kb = K(L), C = W * L + R * Kb;
      const Lo = q * Math.sqrt(R / W), Ko = q * Math.sqrt(W / R), Co = W * Lo + R * Ko;
      p.line(0, Co / R, Co / W, 0, 'bl-ghost');
      p.line(0, C / R, C / W, 0, 'bl');
      p.fn(K, 0.3, 12, 'curve ic');
      p.text(11.5, K(11.5), `q = ${q}`, 'clabel', 0, -8, 'end');
      p.dot(Lo, Ko, 10, 'ring-opt');
      h.set(L, Kb);
      const mrts = Kb / L, rp = W / R;
      rd.set([['Bundle (L, K)', `(${fmt(L)}, ${fmt(Kb)})`], ['Total cost W·L + R·K', '$' + fmt(C)], ['MRTS of L for K = K/L', fmt(mrts)], ['Relative price of labour W/R', fmt(rp)],
        ['Cheapest bundle', `(${fmt(Lo)}, ${fmt(Ko)}) costs $${fmt(Co)}`], ['MPL/W vs MPK/R', `${fmt(0.5 * q / L / W, 4)} vs ${fmt(0.5 * q / Kb / R, 4)}`]]);
      if (Math.abs(mrts - rp) / rp < 0.04) vd.set('good', `<b>Tangency: MRTS = W/R = ${fmt(rp)}.</b> The isocost line is as close to the origin as it can get while still reaching q = ${q}. Bang for the buck is equal: MPL/W = MPK/R.`);
      else if (mrts > rp) vd.set('ic', `MRTS = ${fmt(mrts)} &gt; W/R = ${fmt(rp)}. One worker replaces ${fmt(mrts)} units of capital but costs only ${fmt(rp)} units: <b>labour is cheap relative to its productivity. Substitute L for K</b> to cut cost.`);
      else vd.set('ic', `MRTS = ${fmt(mrts)} &lt; W/R = ${fmt(rp)}. Labour is expensive relative to what it replaces: <b>substitute K for L</b> to cut cost.`);
    }
    draw();
  });

  /* ---------- 7.3 LRATC as the envelope of SRATC curves ---------- */
  reg('lratc', (root) => {
    const { plotEl, side } = shell(root, 'Long-run ATC: the best factory for each output',
      'In the planning stage the firm can pick any factory size. The LRATC (blue curve) traces the lowest ATC for each output. Once a factory is built, the firm is stuck on its short-run ATC.');
    const p = new Plot(plotEl, { xmax: 120, ymax: 60, xlabel: 'Output, q', ylabel: 'Average cost ($)' });
    const LR = (q) => 20 + 0.006 * (q - 60) * (q - 60);
    const SIZES = [['Small factory', 25], ['Medium factory', 60], ['Large factory', 95]];
    const SR = (k) => (q) => LR(q) + 0.012 * (q - SIZES[k][1]) * (q - SIZES[k][1]);
    let built = 1, q = 30;
    chips(side, SIZES.map((s) => 'Built: ' + s[0]), (i) => { built = i; draw(); }, { active: [1] });
    slider(side, { label: 'Actual output, q', min: 5, max: 115, step: 1, value: q, onInput: (v) => { q = v; draw(); } });
    const rd = readout(side), vd = verdict(side);
    function draw() {
      p.clear();
      p.rect(0, 0, 60, 60, 'zone-better'); p.rect(60, 0, 120, 60, 'zone-worse');
      p.text(30, 56, 'Economies of scale (IRTS)', 'zlabel', 0, 0, 'middle'); p.text(90, 56, 'Diseconomies (DRTS)', 'zlabel', 0, 0, 'middle');
      SIZES.forEach((s, k) => p.fn(SR(k), Math.max(2, s[1] - 45), Math.min(120, s[1] + 45), k === built ? 'curve ic' : 'curve faint'));
      p.fn(LR, 2, 118, 'curve c3');
      p.dot(60, 20, 5, 'ring-opt'); p.text(60, 20, 'MES', 'lbl', 0, 20, 'middle');
      const a = SR(built)(q), l = LR(q);
      p.line(q, 0, q, a, 'guide-v'); p.dot(q, a, 6, 'pt-ic'); p.dot(q, l, 5, 'pt-opt');
      const bestK = SIZES.map((s, k) => SR(k)(q)).reduce((bi, v, k, arr) => (v < arr[bi] ? k : bi), 0);
      rd.set([['SRATC with ' + SIZES[built][0].toLowerCase(), '$' + fmt(a)], ['LRATC (best possible)', '$' + fmt(l)], ['Best of the three for this q', SIZES[bestK][0]], ['Minimum efficient scale', 'q = 60, LRATC = $20']]);
      vd.set(a - l < 0.05 ? 'good' : 'bad', a - l < 0.05 ? `The ${SIZES[built][0].toLowerCase()} is the right size for q = ${q}: <b>SRATC = LRATC</b>. No planning mistake.`
        : `Producing ${q} units with a ${SIZES[built][0].toLowerCase()} costs $${fmt(a)} per unit, above the LRATC of $${fmt(l)}. The factory doesn't match actual output, and it can't be changed in the SR, so <b>SRATC &gt; LRATC</b>.`);
    }
    draw();
  });
})();
