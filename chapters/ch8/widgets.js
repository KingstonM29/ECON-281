/* Chapter 8 interactive figures: competitive firm profit maximization (P = MC, profit area,
   shutdown rule, supply curve) and SR → LR market adjustment with entry/exit. */
(function () {
  const { Plot, fmt, tween } = Graph;
  const { mk, shell, slider, chips, readout, verdict, button, row } = UI;
  const reg = Study.registerWidget;

  // Smooth costs that track Table 7.1: FC = 50, VC = 50q − 7q² + 0.5q³.
  const FC = 50;
  const VC = (q) => 50 * q - 7 * q * q + 0.5 * q * q * q;
  const MC = (q) => 50 - 14 * q + 1.5 * q * q;
  const AVC = (q) => 50 - 7 * q + 0.5 * q * q;
  const ATC = (q) => AVC(q) + FC / q;
  const qMinAVC = 7, minAVC = AVC(7);
  let qMinATC = 7, minATC = Infinity;
  for (let q = 5; q <= 10; q += 0.001) { const a = ATC(q); if (a < minATC) { minATC = a; qMinATC = q; } }
  const supplyQ = (P) => (P < minAVC ? 0 : (14 + Math.sqrt(Math.max(0, 6 * P - 104))) / 3); // MC = P on rising branch
  window.FIRM8 = { MC, AVC, ATC, supplyQ, minAVC, minATC, qMinATC };

  reg('profitMax', (root) => {
    const { plotEl, side } = shell(root, 'Profit maximization for a competitive firm',
      'The firm takes the market price as given (MR = P). It produces where P = MC, then compares P with ATC (profit or loss) and with AVC (operate or shut down). The thick part of MC is the firm\'s supply curve.');
    const p = new Plot(plotEl, { xmax: 12, ymax: 80, xlabel: 'Output, q', ylabel: 'Price and cost ($)' });
    let P = 60, cancel;
    const presets = [['P = $60', 60], ['P = min ATC', +minATC.toFixed(2)], ['P = $28', 28], ['P = $19', 19]];
    const sl = slider(side, { label: 'Market price, P', min: 10, max: 75, step: 0.25, value: P, format: (v) => '$' + fmt(v), onInput: (v) => { if (cancel) cancel(); P = v; draw(); } });
    chips(side, presets.map((x) => x[0]), (i) => { if (cancel) cancel(); const from = P, to = presets[i][1]; cancel = tween(600, (e) => { P = from + (to - from) * e; sl.set(P); draw(); }); });
    const legend = mk('<div class="legend"><span><i class="sw-ic"></i>MC</span><span><i class="sw-acc"></i>ATC</span><span><i class="sw-opt"></i>AVC</span><span><i class="sw-bl"></i>Price = MR</span></div>');
    side.appendChild(legend);
    const rd = readout(side), vd = verdict(side);
    function draw() {
      p.clear();
      const q = supplyQ(P), produce = q > 0;
      if (produce) {
        const a = ATC(q);
        p.rect(0, Math.min(P, a), q, Math.max(P, a), P >= a ? 'zone-better' : 'zone-worse');
        p.text(q / 2, (P + a) / 2, P >= a ? `Profit $${fmt((P - a) * q)}` : `Loss $${fmt((a - P) * q)}`, 'lbl', 0, 5, 'middle');
        p.line(q, 0, q, Math.max(P, a), 'guide-v'); p.dot(q, a, 5, 'pt');
      }
      p.fn(ATC, 1.2, 12, 'curve c3'); p.fn(AVC, 0.5, 12, 'curve c4'); p.fn(MC, 0.5, 12, 'curve ic');
      p.fn(MC, qMinAVC, 12, 'curve opt-solid');
      p.text(11.6, ATC(11.6), 'ATC', 'clabel', 6, 12); p.text(11.6, AVC(11.6), 'AVC', 'clabel', 6, 14); p.text(10.9, MC(10.9), 'MC', 'clabel', -10, 0, 'end');
      p.line(0, P, 12, P, 'bl'); p.text(0.2, P, `P = MR = $${fmt(P)}`, 'ilabel', 4, -6);
      p.dot(qMinATC, minATC, 4, 'ring-opt'); p.dot(qMinAVC, minAVC, 4, 'ring-opt');
      if (produce) p.dot(q, P, 7, 'pt-opt');
      const a = produce ? ATC(q) : null, tr = P * q, tc = produce ? a * q : FC, profit = produce ? tr - tc : -FC;
      rd.set([['Quantity (P = MC)', produce ? fmt(q) : '0 (shut down)'], ['TR = P × q', '$' + fmt(tr)], ['TC = ATC × q', '$' + fmt(tc)], ['Profit = (P − ATC) × q', (profit < 0 ? '−$' : '$') + fmt(Math.abs(profit))],
        ['min ATC / min AVC', `$${fmt(minATC)} / $${fmt(minAVC)}`]]);
      if (!produce) vd.set('bad', `P = $${fmt(P)} &lt; min AVC = $${fmt(minAVC)}: revenue can't even cover variable cost. <b>Shut down temporarily</b> (q = 0). The loss is just FC = $${FC}; operating would lose more.`);
      else if (P > minATC + 0.05) vd.set('good', `P &gt; min ATC: at q = ${fmt(q)}, P = $${fmt(P)} &gt; ATC = $${fmt(a)}, so the firm makes a <b>profit</b> of $${fmt(profit)}.`);
      else if (P >= minATC - 0.05) vd.set('ic', `P = min ATC: the firm <b>breaks even</b> (profit = 0, a normal return). This is the long-run equilibrium price.`);
      else vd.set('ic', `min AVC ≤ P &lt; min ATC: the firm makes a <b>loss</b> of $${fmt(-profit)}, but TR covers VC and the loss is less than FC = $${FC}. <b>Keep operating</b> in the SR to minimize the loss.`);
    }
    draw();
  });

  /* ---------- 8.3–8.4 Market and firm: SR equilibrium and LR adjustment ---------- */
  reg('marketLR', (root) => {
    root.classList.add('lab');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>From short-run profit to long-run equilibrium</h4>
      <p>The market sets the price (left); each identical firm takes it (right). Start in LR equilibrium at P = min ATC. Shift demand, then let firms enter or exit until profit is back to zero.</p></div>
      <div class="panels2"><div><div class="cap">Market</div><div class="lab-plot"></div></div><div><div class="cap">Typical firm</div><div class="lab-plot"></div></div></div><div class="lab-side"></div>`;
    const [e1, e2] = root.querySelectorAll('.lab-plot');
    const M = new Plot(e1, { w: 360, h: 320, xmax: 1600, ymax: 60, xlabel: 'Market Q', ylabel: 'P ($)', m: { l: 44 } });
    const Fp = new Plot(e2, { w: 360, h: 320, xmax: 12, ymax: 60, xlabel: 'Firm q', ylabel: 'P ($)', m: { l: 44 } });
    const side = root.querySelector('.lab-side');
    const Pstar = minATC, qstar = qMinATC, n0 = 100;
    const A0 = n0 * qstar + 10 * Pstar;
    const st = { A: A0, n: n0, step: 'Long-run equilibrium' };
    let cancel;
    const solveP = (A, n) => { let lo = 0, hi = 100; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (n * supplyQ(m) > A - 10 * m) hi = m; else lo = m; } return (lo + hi) / 2; };
    const r = row(side);
    const animate = (to, label, ms = 900) => { if (cancel) cancel(); const from = { ...st }; st.step = label; cancel = tween(ms, (e) => { st.A = from.A + (to.A - from.A) * e; st.n = from.n + (to.n - from.n) * e; draw(); }); };
    button(r, 'Demand rises', () => animate({ A: st.A + 300, n: st.n }, 'Short run: demand rose, number of firms fixed'), true);
    button(r, 'Demand falls', () => animate({ A: st.A - 300, n: st.n }, 'Short run: demand fell, number of firms fixed'));
    button(r, 'Let firms enter / exit', () => animate({ A: st.A, n: (st.A - 10 * Pstar) / qstar }, 'Long run: entry/exit until P = min ATC', 1800));
    button(r, 'Reset', () => animate({ A: A0, n: n0 }, 'Long-run equilibrium', 500));
    const rd = readout(side), vd = verdict(side);
    function draw() {
      const P = solveP(st.A, st.n), q = supplyQ(P), Q = st.n * q, a = ATC(q);
      M.clear(); Fp.clear();
      M.line(Math.max(0, A0 - 10 * 60), 60, A0, 0, 'curve faint');
      M.line(Math.max(0, st.A - 600), Math.min(60, st.A / 10), st.A, 0, 'curve c3');
      const S = []; for (let pp = minAVC; pp <= 60; pp += 0.5) S.push([st.n * supplyQ(pp), pp]);
      M.path(S, 'curve ic');
      M.line(0, Pstar, 1600, Pstar, 'guide-h'); M.text(1580, Pstar, 'min ATC', 'clabel', 0, -6, 'end');
      M.line(0, P, Q, P, 'bl'); M.dot(Q, P, 6, 'pt-opt');
      M.text(st.A, 0, 'D', 'clabel', -8, -8, 'end'); M.text(S[S.length - 1][0], 60, 'S', 'clabel', 8, 14);
      Fp.fn(ATC, 1.5, 12, 'curve c3'); Fp.fn(MC, 3, 12, 'curve ic');
      if (Math.abs(P - a) > 0.05) Fp.rect(0, Math.min(P, a), q, Math.max(P, a), P > a ? 'zone-better' : 'zone-worse');
      Fp.line(0, P, 12, P, 'bl'); Fp.dot(q, P, 6, 'pt-opt'); Fp.line(q, 0, q, P, 'guide-v');
      Fp.text(11.5, ATC(11.5), 'ATC', 'clabel', 0, 14, 'end'); Fp.text(9.7, MC(9.7), 'MC', 'clabel', -8, 0, 'end');
      const profit = (P - a) * q;
      rd.set([['Stage', st.step], ['Price', '$' + fmt(P)], ['Number of firms', fmt(st.n, 0)], ['Each firm\'s q / market Q', `${fmt(q)} / ${fmt(Q, 0)}`], ['Profit per firm', (profit < -0.005 ? '−$' : '$') + fmt(Math.abs(profit))]]);
      if (Math.abs(P - Pstar) < 0.1) vd.set('good', '<b>Long-run equilibrium:</b> demand = supply and P = min ATC, so every firm earns zero economic profit. No one wants to enter or exit.');
      else if (P > Pstar) vd.set('ic', `P &gt; min ATC: firms earn a <b>profit</b>. In the SR the number of firms is fixed, but in the LR the profit attracts <b>entry</b>, supply shifts right and P falls back to min ATC. Press <b>Let firms enter / exit</b>.`);
      else vd.set('bad', `P &lt; min ATC: firms make <b>losses</b>. In the LR some <b>exit</b>, supply shifts left and P rises back to min ATC. Press <b>Let firms enter / exit</b>.`);
    }
    draw();
  });
})();
