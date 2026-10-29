/* Chapter 7 formulas with worked examples and drill generators. */
(function () {
  const F = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const r2 = (x) => Math.round(x * 100) / 100;
  const $ = (v) => (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: 2 });

  (window.FORMULAS = window.FORMULAS || {}).ch7 = [
    {
      sec: 's71', name: 'Implicit (opportunity) costs',
      formula: 'Implicit costs = interest forgone on own money + salary forgone + …',
      words: 'Costs with no money paid out: what the owner\'s money and time could have earned elsewhere.',
      example: { given: 'Wine bar: owner puts in $600,000 of savings (could earn 4%) and quits a $90,000 job.', steps: ['Interest forgone = $600,000 × 0.04 = $24,000.', 'Salary forgone = $90,000.', 'Implicit costs = $24,000 + $90,000.'], answer: 'Implicit costs = <b>$114,000</b>.' },
      mistake: 'Interest actually paid on a bank loan is <i>explicit</i>; interest you give up on your own savings is <i>implicit</i>.',
    },
    {
      sec: 's71', name: 'Accounting vs economic profit',
      formula: 'Accounting profit = TR − explicit costs<br>Economic profit = TR − explicit − implicit = accounting profit − implicit',
      symbols: [['TR', 'total revenue'], ['Explicit', 'money actually paid out'], ['Implicit', 'opportunity costs']],
      example: { given: 'Wine bar: explicit costs $1,016,000 ($1M + $16,000 interest on the $400,000 loan), implicit costs $114,000, TR = $1,140,000.', steps: ['Accounting profit = $1,140,000 − $1,016,000 = $124,000.', 'Economic profit = $124,000 − $114,000.'], answer: 'Economic profit = <b>$10,000</b> &gt; 0, so opening is worth it. (If accounting profit were $80,000, economic profit would be −$34,000.)' },
    },
    {
      sec: 's71', name: 'Rental price of capital',
      formula: 'R (per year) = depreciation + interest forgone<br>depreciation = price ÷ years of use &nbsp;·&nbsp; interest = interest rate × current value',
      symbols: [['R', 'cost of using one unit of capital for a year']],
      example: { given: 'A $150M plane lasts 30 years; interest rate 4%. Find R in year 1 and year 2.', steps: ['Depreciation = $150M ÷ 30 = $5M per year.', 'Year 1 interest = 0.04 × $150M = $6M, so R = $5M + $6M = $11M.', 'Year 2 value = $150M − $5M = $145M; interest = 0.04 × $145M = $5.8M.', 'Year 2 R = $5M + $5.8M = $10.8M.'], answer: 'R = <b>$11M</b> in year 1 (≈ $30,137/day) and <b>$10.8M</b> in year 2.' },
      mistake: 'R is not the purchase price.',
    },
    {
      sec: 's71', name: 'Total cost with two inputs',
      formula: 'TC = W·L + R·K &nbsp;(SR: TC = VC + FC, with FC = R·K̄)',
      symbols: [['W', 'wage per unit of labour'], ['R', 'rental price per unit of capital']],
      example: { given: 'W = $20, L = 5; R = $10, K = 8 (fixed in the SR).', steps: ['Labour cost (VC) = 20 × 5 = $100.', 'Capital cost (FC) = 10 × 8 = $80.', 'TC = $100 + $80.'], answer: 'TC = <b>$180</b> (VC = $100, FC = $80).' },
    },
    {
      sec: 's72', name: 'Marginal cost',
      formula: `MC = ${F('ΔTC', 'Δq')} = ${F('ΔVC', 'Δq')}`,
      words: 'Cost of producing one more unit. FC doesn\'t change, so only VC matters.',
      example: { given: 'Table 7.1: VC is $175 at q = 7 and $204 at q = 8.', steps: ['ΔVC = 204 − 175 = 29; Δq = 1.', 'MC = 29 ÷ 1.'], answer: 'MC of the 8th unit = <b>$29</b>.' },
    },
    {
      sec: 's72', name: 'MC from productivity',
      formula: `MC = ${F('W', 'MPL')}`,
      words: 'Each unit takes 1/MPL hours of labour, and each hour costs W.',
      symbols: [['W', 'wage per hour'], ['MPL', 'units produced per extra hour']],
      example: { given: 'W = $15 per hour. MPL rises from 3 to 5 units per hour.', steps: ['At MPL = 3: MC = 15 ÷ 3 = $5.', 'At MPL = 5: MC = 15 ÷ 5 = $3.'], answer: 'MC falls from <b>$5 to $3</b>. Higher productivity, lower marginal cost (and diminishing MPL raises MC).' },
    },
    {
      sec: 's72', name: 'Average costs',
      formula: `AFC = ${F('FC', 'q')} · AVC = ${F('VC', 'q')} · ATC = ${F('TC', 'q')} = AVC + AFC`,
      example: { given: 'Table 7.1 at q = 4: FC = $50, VC = $112.', steps: ['TC = 112 + 50 = $162.', 'AFC = 50 ÷ 4 = $12.50.', 'AVC = 112 ÷ 4 = $28.', 'ATC = 162 ÷ 4 = $40.50 (check: 28 + 12.50 = 40.50).'], answer: 'AFC = <b>$12.50</b>, AVC = <b>$28</b>, ATC = <b>$40.50</b>.' },
    },
    {
      sec: 's72', name: 'Total cost from ATC',
      formula: 'TC = ATC × q',
      words: 'On a graph, TC is the rectangle with height ATC and width q.',
      example: { given: 'ATC = $40.50 at q = 4.', steps: ['TC = 40.50 × 4.'], answer: 'TC = <b>$162</b>.' },
    },
    {
      sec: 's72', name: 'Marginal vs average costs',
      formula: 'MC < ATC → ATC falls · MC > ATC → ATC rises (same for AVC)',
      words: 'So MC crosses AVC and ATC at their lowest points.',
      example: { given: 'At q = 8, ATC = $31.75. The 9th unit has MC = $38.', steps: ['MC $38 > ATC $31.75, so ATC must rise.', 'Check: TC at 9 = 292; ATC = 292 ÷ 9 = $32.44.'], answer: 'ATC rises to <b>$32.44</b>.' },
    },
    {
      sec: 's73', name: 'Isocost line',
      formula: `W·L + R·K = C &nbsp;·&nbsp; L-intercept = ${F('C', 'W')} · K-intercept = ${F('C', 'R')} · slope = ${F('W', 'R')}`,
      words: 'All input bundles that cost the same total amount C. The slope is the relative price of labour.',
      example: { given: 'W = $20, R = $10, C = $40.', steps: ['L-intercept = 40 ÷ 20 = 2 (spend it all on labour).', 'K-intercept = 40 ÷ 10 = 4 (spend it all on capital).', 'Slope = W ÷ R = 20 ÷ 10 = 2.'], answer: 'Line from (0, 4) to (2, 0) with slope <b>2</b>: one worker costs as much as 2 units of capital.' },
    },
    {
      sec: 's73', name: 'Cost-minimizing rule',
      formula: `MRTS = ${F('W', 'R')} &nbsp;⇔&nbsp; ${F('MPL', 'W')} = ${F('MPK', 'R')}`,
      words: 'If MRTS > W/R, labour is a bargain: use more L. If MRTS < W/R, use more K.',
      example: { given: 'MPL = 8, MPK = 2, W = $20, R = $10.', steps: ['MRTS = 8 ÷ 2 = 4.', 'W/R = 20 ÷ 10 = 2.', 'Bang for the buck: MPL/W = 8/20 = 0.4 and MPK/R = 2/10 = 0.2.', 'MRTS 4 > 2 (and 0.4 > 0.2): a dollar on labour produces more.'], answer: '<b>Substitute L for K</b> until MRTS = 2.' },
    },
    {
      sec: 's73', name: 'Solving for the cheapest bundle (q = √(LK))',
      formula: 'MRTS = K/L = W/R &nbsp;→&nbsp; L* = q·√(R/W), &nbsp;K* = q·√(W/R)',
      words: 'For q = √(LK), MRTS = K/L. Set it equal to W/R, then plug into the production function.',
      example: { given: 'Make q = 4 with W = $20 and R = $10.', steps: ['Tangency: K/L = 20/10 = 2, so K = 2L.', 'Plug in: 4 = √(L × 2L) = L√2, so L = 4/√2 = 2.83.', 'K = 2 × 2.83 = 5.66.', 'Cost = 20 × 2.83 + 10 × 5.66 = 56.6 + 56.6.'], answer: '(L, K) = <b>(2.83, 5.66)</b>, cost ≈ <b>$113.14</b>.' },
    },
    {
      sec: 's73', name: 'Long-run average cost and scale',
      formula: `LRATC = ${F('LRTC', 'q')}`,
      words: 'Double all inputs and LRTC doubles. LRATC falls if output more than doubles (IRTS), stays the same under CRTS, and rises under DRTS.',
      example: { given: 'W = $12, R = $108. (L, K) = (9, 1) makes 3 units. The firm doubles to (18, 2).', steps: ['LRTC = 12 × 9 + 108 × 1 = $216, so LRATC = 216 ÷ 3 = $72.', 'Doubling inputs: LRTC = $432.', 'If q = 6 (CRTS): 432 ÷ 6 = $72. If q = 8 (IRTS): $54. If q = 5 (DRTS): $86.40.'], answer: 'IRTS → LRATC <b>falls</b>; DRTS → LRATC <b>rises</b>.' },
    },
  ];

  (window.FORMULA_DRILLS = window.FORMULA_DRILLS || {}).ch7 = [
    { title: 'Implicit costs', make() { const s = ri(5, 30) * 10000, r = pick([3, 4, 5, 6]), sal = ri(4, 12) * 10000, ans = s * r / 100 + sal; return { q: `An owner puts ${$(s)} of savings (could earn ${r}%) into the business and gives up a ${$(sal)} salary. What are the implicit costs?`, answer: ans, prefix: '$', formula: 'Implicit = interest forgone + salary forgone', steps: [`Interest forgone = ${$(s)} × ${r / 100} = ${$(s * r / 100)}.`, `Implicit = ${$(s * r / 100)} + ${$(sal)} = ${$(ans)}.`] }; } },
    { title: 'Economic profit', make() { const acc = ri(4, 20) * 10000, imp = ri(4, 20) * 10000; return { q: `Accounting profit is ${$(acc)} and implicit costs are ${$(imp)}. What is economic profit?`, answer: acc - imp, prefix: '$', tol: 1, formula: 'Economic profit = accounting profit − implicit costs', steps: [`${$(acc)} − ${$(imp)} = ${$(acc - imp)}.`, acc - imp >= 0 ? 'Positive: the business beats the owner\'s next-best option.' : 'Negative: the owner would do better elsewhere.'] }; } },
    { title: 'Rental price of capital', make() { const life = pick([10, 20, 25, 30]), dep = ri(2, 10), price = dep * life, r = pick([2, 4, 5, 8]), yr = ri(1, 3); const val = price - dep * (yr - 1), R = r2(dep + val * r / 100); return { q: `A $${price}M machine lasts ${life} years and the interest rate is ${r}%. What is its rental price in year ${yr}? (in $M)`, answer: R, prefix: '$', unit: 'M', formula: 'R = depreciation + interest × current value', steps: [`Depreciation = ${price} ÷ ${life} = $${dep}M.`, `Value at start of year ${yr} = ${price} − ${dep} × ${yr - 1} = $${val}M.`, `Interest forgone = ${r / 100} × ${val} = $${r2(val * r / 100)}M.`, `R = ${dep} + ${r2(val * r / 100)} = $${R}M.`] }; } },
    { title: 'MC = W / MPL', make() { const mpl = pick([2, 3, 4, 5, 6, 8]), mc = pick([2, 3, 4, 5, 6]), W = mpl * mc; return { q: `The wage is $${W} per hour and MPL is ${mpl} units per hour. What is MC?`, answer: mc, prefix: '$', formula: `MC = ${F('W', 'MPL')}`, steps: [`MC = ${W} ÷ ${mpl} = $${mc}.`] }; } },
    { title: 'MC from a cost table', make() { const q = ri(3, 9), v0 = ri(60, 200), d = ri(10, 60); return { q: `VC is $${v0} at q = ${q} and $${v0 + d} at q = ${q + 1}. What is the MC of unit ${q + 1}?`, answer: d, prefix: '$', formula: `MC = ${F('ΔVC', 'Δq')}`, steps: [`ΔVC = ${v0 + d} − ${v0} = ${d}; Δq = 1.`, `MC = $${d}.`] }; } },
    { title: 'ATC', make() { const q = ri(2, 10), fc = pick([40, 50, 60, 80, 100]), vc = ri(10, 40) * q; const atc = r2((vc + fc) / q); return { q: `FC = $${fc} and VC = $${vc} at q = ${q}. What is ATC? (2 decimals)`, answer: atc, prefix: '$', formula: `ATC = ${F('TC', 'q')} = ${F('VC + FC', 'q')}`, steps: [`TC = ${vc} + ${fc} = $${vc + fc}.`, `ATC = ${vc + fc} ÷ ${q} = $${atc}.`] }; } },
    { title: 'AVC', make() { const q = ri(2, 10), avc = ri(10, 40), vc = avc * q; return { q: `VC = $${vc} at q = ${q}. What is AVC?`, answer: avc, prefix: '$', formula: `AVC = ${F('VC', 'q')}`, steps: [`AVC = ${vc} ÷ ${q} = $${avc}.`] }; } },
    { title: 'TC = ATC × q', make() { const q = ri(3, 20), atc = ri(10, 60) + pick([0, 0.5, 0.25]); return { q: `ATC = $${atc} at q = ${q}. What is TC?`, answer: r2(atc * q), prefix: '$', formula: 'TC = ATC × q', steps: [`TC = ${atc} × ${q} = $${r2(atc * q)}.`] }; } },
    { title: 'Isocost intercept', make() { const W = pick([10, 20, 25, 40]), R = pick([5, 10, 20, 50]), C = W * R * pick([1, 2]) ; const ask = pick(['L', 'K']); const ans = ask === 'L' ? C / W : C / R; return { q: `W = $${W}, R = $${R}, total cost C = $${C}. What is the ${ask}-intercept of the isocost line?`, answer: ans, unit: ask === 'L' ? 'workers' : 'units of K', formula: `L-intercept = ${F('C', 'W')} · K-intercept = ${F('C', 'R')}`, steps: [ask === 'L' ? `All on labour: ${C} ÷ ${W} = ${ans}.` : `All on capital: ${C} ÷ ${R} = ${ans}.`, `(Slope = W/R = ${r2(W / R)}.)`] }; } },
    { title: 'Cost minimization: MRTS vs W/R', make() { const mpk = pick([1, 2, 4]), mrts = pick([1, 2, 3, 4, 6]), mpl = mpk * mrts, R = pick([5, 10, 20]), rp = pick([1, 2, 3, 4, 6].filter((x) => x !== mrts)), W = R * rp; return { q: `MPL = ${mpl}, MPK = ${mpk}, W = $${W}, R = $${R}. What is the MRTS of L for K? (Then decide which input to use more of.)`, answer: mrts, formula: `MRTS = ${F('MPL', 'MPK')} vs ${F('W', 'R')}`, steps: [`MRTS = ${mpl} ÷ ${mpk} = ${mrts}.`, `W/R = ${W} ÷ ${R} = ${rp}.`, mrts > rp ? `${mrts} > ${rp}: labour is a bargain, so <b>substitute L for K</b>.` : `${mrts} < ${rp}: labour is expensive for what it replaces, so <b>substitute K for L</b>.`] }; } },
    { title: 'Cheapest bundle for q = √(LK)', make() { const s = pick([[20, 5, 4], [18, 2, 3], [8, 2, 4], [50, 2, 6], [12, 3, 5]]); const [W, R, q] = s; const L = r2(q * Math.sqrt(R / W)), K = r2(q * Math.sqrt(W / R)); return { q: `q = √(LK). To make q = ${q} with W = $${W} and R = $${R}, how much labour L should the firm use?`, answer: L, unit: 'units of L', formula: 'K/L = W/R, then q = √(LK)', steps: [`Tangency: K/L = ${W}/${R} = ${r2(W / R)}, so K = ${r2(W / R)}L.`, `${q} = √(L × ${r2(W / R)}L) = L × √${r2(W / R)} = L × ${r2(Math.sqrt(W / R))}.`, `L = ${q} ÷ ${r2(Math.sqrt(W / R))} = ${L}; K = ${K}.`, `Cost = ${W}×${L} + ${R}×${K} = $${r2(W * L + R * K)}.`] }; } },
  ];
})();
