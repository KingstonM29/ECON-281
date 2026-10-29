/* Chapter 8 formulas with worked examples and drill generators. */
(function () {
  const F = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const r2 = (x) => Math.round(x * 100) / 100;
  const $ = (v) => (v < 0 ? '−$' : '$') + Math.abs(r2(v)).toLocaleString();

  (window.FORMULAS = window.FORMULAS || {}).ch8 = [
    {
      sec: 's82', name: 'Total and marginal revenue',
      formula: `TR = P × q &nbsp;·&nbsp; MR = ${F('ΔTR', 'Δq')} = P (competitive firm)`,
      words: 'A price taker sells every unit at the market price, so each extra unit adds exactly P.',
      example: { given: 'Eggs sell for $4 a dozen. The farm sells 1,000 dozen, then 1,001.', steps: ['TR = 4 × 1,000 = $4,000.', 'TR = 4 × 1,001 = $4,004.', 'MR = 4,004 − 4,000 = $4.'], answer: 'MR = <b>$4 = P</b>.' },
    },
    {
      sec: 's82', name: 'Profit-maximizing quantity',
      formula: 'MR = MC &nbsp;→&nbsp; for a competitive firm: P = MC',
      words: 'In a table: keep producing while MR − MC ≥ 0. The answer is where MR − MC = 0, or the last unit with a positive MR − MC.',
      example: { given: 'P = $60. Table 7.1 MC of units 9, 10, 11: $38, $58, $85.', steps: ['Unit 9: 60 − 38 = +22, produce.', 'Unit 10: 60 − 58 = +2, produce.', 'Unit 11: 60 − 85 = −25, stop.'], answer: 'q = <b>10</b>.' },
      mistake: 'Don\'t pick the q where ATC is lowest. Quantity comes from P = MC.',
    },
    {
      sec: 's82', name: 'Profit',
      formula: 'π = TR − TC = P·q − ATC·q = (P − ATC) × q',
      words: '(P − ATC) is profit per unit. Positive if P > ATC, zero if P = ATC, a loss if P < ATC.',
      example: { given: 'P = $60, q = 10, ATC at q = 10 is $35 (TC = $350).', steps: ['TR = 60 × 10 = $600.', 'TC = 35 × 10 = $350.', 'π = 600 − 350 = $250 (or (60 − 35) × 10).'], answer: 'Profit = <b>$250</b>.' },
    },
    {
      sec: 's82', name: 'Loss and the shutdown rule',
      formula: 'π = (TR − VC) − FC &nbsp;·&nbsp; Operate if P ≥ min AVC (TR ≥ VC); shut down if P < min AVC',
      words: 'Shutting down still costs FC. Keep operating if revenue at least covers variable cost, because then the loss is no bigger than FC.',
      example: { given: 'FC = $500. Case A: TR = $1,000, VC = $800. Case B: TR = $400, VC = $500.', steps: ['A: operate → (1,000 − 800) − 500 = −$300. Shut down → −$500. Operate.', 'B: operate → (400 − 500) − 500 = −$600. Shut down → −$500. Shut down.'], answer: 'A: <b>operate</b> (lose $300). B: <b>shut down</b> (lose $500).' },
    },
    {
      sec: 's82', name: 'Reading the price against costs',
      formula: 'P vs min ATC → profit or loss &nbsp;·&nbsp; P vs min AVC → operate or shut down',
      example: { given: 'Table 7.1: min AVC = $25, min ATC = $31.75, FC = $50. Price = $28.', steps: ['P = $28 < min ATC = $31.75: a loss.', 'P = $28 > min AVC = $25: TR covers VC, so operate.', 'q = 7 (MC of unit 7 is $25 < 28, unit 8 is $29 > 28).', 'π = 28 × 7 − TC(7) = 196 − 225 = −$29.'], answer: 'Loss of <b>$29</b>, less than FC = $50, so <b>keep operating</b>.' },
    },
    {
      sec: 's83', name: 'Market supply',
      formula: 'Q<sub>market</sub> = q (per firm) × n (number of firms)',
      example: { given: '1,000 identical firms; at P₁ each supplies 4 units, at P₂ each supplies 6.', steps: ['At P₁: 4 × 1,000 = 4,000.', 'At P₂: 6 × 1,000 = 6,000.'], answer: 'Market supply rises from <b>4,000 to 6,000</b>: it slopes up.' },
    },
    {
      sec: 's84', name: 'Long-run equilibrium',
      formula: 'P = min LRATC (profit = 0) and Q<sub>D</sub> = Q<sub>S</sub> &nbsp;→&nbsp; n = Q ÷ q*',
      words: 'In the LR each firm produces at the bottom of its LRATC (q*). The number of firms adjusts until total supply meets demand at that price.',
      example: { given: 'min LRATC = $32 at q* = 8 per firm. At P = $32, buyers want Q = 1,400.', steps: ['Each firm makes q* = 8.', 'n = 1,400 ÷ 8 = 175 firms.', 'If demand rises to 1,600 at $32, n = 1,600 ÷ 8 = 200: 25 firms enter.'], answer: '<b>175 firms</b> in LR equilibrium; demand growth adds firms, not profit.' },
    },
  ];

  (window.FORMULA_DRILLS = window.FORMULA_DRILLS || {}).ch8 = [
    { title: 'Profit = (P − ATC) × q', make() { const P = ri(15, 60), atc = P + pick([-12, -8, -5, -3, 2, 4, 6]), q = ri(5, 40); const pi = (P - atc) * q; return { q: `P = $${P}. At the profit-maximizing q = ${q}, ATC = $${atc}. What is profit? (negative for a loss)`, answer: pi, prefix: '$', tol: 0.5, formula: 'π = (P − ATC) × q', steps: [`P − ATC = ${P} − ${atc} = ${P - atc} per unit.`, `π = ${P - atc} × ${q} = ${$(pi)}.`, pi >= 0 ? 'Positive: P > ATC.' : 'Negative: P < ATC, a loss.'] }; } },
    { title: 'Loss if it keeps operating', make() { const fc = pick([200, 300, 400, 500]), vc = ri(4, 12) * 100, tr = vc + pick([-300, -200, -100, 100, 200]); const op = tr - vc - fc; return { q: `FC = $${fc}, TR = $${tr}, VC = $${vc}. What is the profit (negative = loss) if the firm keeps operating? (Then decide: operate or shut down?)`, answer: op, prefix: '$', tol: 0.5, formula: 'π = (TR − VC) − FC; shutting down gives −FC', steps: [`TR − VC = ${tr} − ${vc} = ${tr - vc}.`, `π = ${tr - vc} − ${fc} = ${$(op)}.`, `Shutting down loses ${$(fc)}.`, op > -fc ? '<b>Operate</b>: the loss is smaller than FC (TR > VC).' : '<b>Shut down</b>: operating loses more than FC (TR < VC).'] }; } },
    { title: 'Quantity from P = MC', make() { const mcs = [50, 28, 20, 14, 18, 20, 25, 29, 38, 58, 85]; const P = pick([27, 32, 45, 60, 70]); let q = 0; for (let i = 0; i < mcs.length; i++) if (P - mcs[i] >= 0) q = i + 1; else if (i > 3) break; return { q: `Table 7.1 MC for units 1–11: ${mcs.join(', ')}. The price is $${P} and the firm operates. How many units maximize profit?`, answer: q, unit: 'units', formula: 'Produce while P − MC ≥ 0 (on the rising part of MC)', steps: [`Units with MC ≤ ${P} on the rising part: up to unit ${q} (MC = $${mcs[q - 1]}).`, q < 11 ? `Unit ${q + 1} costs $${mcs[q]} > $${P}: stop.` : 'Every unit is profitable.', `q = ${q}.`] }; } },
    { title: 'Market supply', make() { const n = pick([100, 250, 500, 1000, 2000]), q = ri(2, 12); return { q: `${n} identical firms each supply ${q} units at the current price. What is market quantity supplied?`, answer: n * q, unit: 'units', formula: 'Q = q × n', steps: [`${q} × ${n} = ${n * q}.`] }; } },
    { title: 'Number of firms in LR equilibrium', make() { const qs = pick([4, 5, 8, 10]), n = ri(5, 30) * 10; return { q: `In LR equilibrium each firm produces q* = ${qs} (bottom of LRATC). Market demand at that price is ${qs * n} units. How many firms are in the market?`, answer: n, unit: 'firms', formula: 'n = Q ÷ q*', steps: [`n = ${qs * n} ÷ ${qs} = ${n}.`] }; } },
    { title: 'TR and MR', make() { const P = ri(3, 25), q = ri(10, 500); return { q: `A competitive firm sells ${q} units at $${P} each. What is TR?`, answer: P * q, prefix: '$', formula: 'TR = P × q (and MR = P)', steps: [`TR = ${P} × ${q} = $${P * q}.`, `Each extra unit adds MR = P = $${P}.`] }; } },
  ];
})();
