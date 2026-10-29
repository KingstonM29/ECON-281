/* Chapter 6 formulas with worked examples (shown in lessons and the Formulas tab) and drill generators. */
(function () {
  const F = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const r2 = (x) => Math.round(x * 100) / 100;

  (window.FORMULAS = window.FORMULAS || {}).ch6 = [
    {
      sec: 's61', name: 'Production function',
      formula: 'q = F(L, K) &nbsp;e.g.&nbsp; q = L<sup>0.5</sup>K<sup>0.5</sup> = √(L·K)',
      words: 'Plug in the amounts of labour and capital to get the quantity produced.',
      symbols: [['q', 'output (units produced)'], ['L', 'labour (workers or hours)'], ['K', 'capital (machines, buildings)']],
      example: { given: 'q = √(LK). The firm uses L = 16 workers and K = 4 machines.', steps: ['Multiply the inputs: L × K = 16 × 4 = 64.', 'Take the square root: √64 = 8.'], answer: 'q = <b>8 units</b>.' },
      mistake: 'L<sup>0.5</sup> means the square root of L, not L ÷ 2.',
    },
    {
      sec: 's62', name: 'Short-run production function',
      formula: 'Fix K = K̄, then q depends on L only',
      words: 'In the short run capital is stuck, so substitute its value into the production function.',
      symbols: [['K̄', 'the fixed amount of capital']],
      example: { given: 'q = √(LK) with capital fixed at K = 4. How much do 9 workers produce?', steps: ['Substitute K = 4: q = √(4L) = 2√L.', 'Plug in L = 9: q = 2 × √9 = 2 × 3.'], answer: 'q = <b>6 units</b>. (With K = 1 instead, q = √L = 3.)' },
    },
    {
      sec: 's62', name: 'Marginal product of labour (MPL)',
      formula: `MPL = ${F('Δq', 'ΔL')} = ${F('q<sub>new</sub> − q<sub>old</sub>', 'L<sub>new</sub> − L<sub>old</sub>')}`,
      words: 'Extra output from one more worker, holding capital fixed. With one worker added, it is just the change in q.',
      symbols: [['Δ', '"change in"'], ['Δq', 'change in output'], ['ΔL', 'change in labour (usually 1)']],
      example: { given: 'Table 6.1: 2 workers make 30 units, 3 workers make 60 units.', steps: ['Δq = 60 − 30 = 30.', 'ΔL = 3 − 2 = 1.', 'MPL = 30 ÷ 1.'], answer: 'MPL of the 3rd worker = <b>30 units</b>.' },
      mistake: 'MPL is the change in output, not output divided by workers (that\'s APL).',
    },
    {
      sec: 's62', name: 'Average product of labour (APL)',
      formula: `APL = ${F('q', 'L')}`,
      words: 'Output per worker.',
      example: { given: '3 workers make 60 units.', steps: ['APL = q ÷ L = 60 ÷ 3.'], answer: 'APL = <b>20 units per worker</b>.' },
    },
    {
      sec: 's62', name: 'Marginal vs average rule',
      formula: 'MPL > APL → APL rises &nbsp;·&nbsp; MPL = APL → APL unchanged &nbsp;·&nbsp; MPL < APL → APL falls',
      words: 'Like your GPA: a grade above your average raises it, a grade below lowers it.',
      example: { given: 'With 4 workers, q = 80 (APL = 20). The 5th worker adds MPL = 15.', steps: ['Compare: MPL = 15 < APL = 20, so APL should fall.', 'Check: new q = 80 + 15 = 95; new APL = 95 ÷ 5 = 19.'], answer: 'APL falls from 20 to <b>19</b>.' },
    },
    {
      sec: 's63', name: 'Marginal product of capital (MPK)',
      formula: `MPK = ${F('Δq', 'ΔK')}`,
      words: 'Extra output from one more unit of capital, holding labour fixed.',
      example: { given: 'q = √(LK) with L = 4. K goes from 1 to 2.', steps: ['q at K = 1: √(4 × 1) = 2.', 'q at K = 2: √(4 × 2) = √8 = 2.828.', 'MPK = 2.828 − 2 = 0.828.'], answer: 'MPK = <b>0.828</b>. It keeps shrinking as K rises (0.64, 0.54…): diminishing MPK.' },
    },
    {
      sec: 's63', name: 'MRTS of L for K',
      formula: `MRTS = −${F('ΔK', 'ΔL')} = ${F('MPL', 'MPK')}`,
      words: 'How many units of capital one more worker can replace while output stays the same. It equals the slope of the isoquant (as a positive number).',
      symbols: [['ΔK', 'change in capital (negative, because K is given up)'], ['ΔL', 'change in labour'], ['MPL, MPK', 'marginal products']],
      example: { given: 'Method 1: MPL = 4 and MPK = 1. Method 2: on the q = 5 isoquant, L goes 1 → 2 and K goes 25 → 12.5.', steps: ['Method 1: MRTS = MPL ÷ MPK = 4 ÷ 1 = 4.', 'Method 2: ΔK = 12.5 − 25 = −12.5 and ΔL = 1.', 'MRTS = −(−12.5) ÷ 1 = 12.5.'], answer: 'MRTS = <b>4</b> (method 1) and <b>12.5</b> (method 2). Both say how much K one worker replaces.' },
      mistake: 'The minus sign makes MRTS positive: ΔK is negative when you give up capital.',
    },
    {
      sec: 's63', name: 'Points on an isoquant',
      formula: 'For q = √(LK): &nbsp;K = q² ÷ L',
      words: 'Rearrange the production function to find how much capital is needed with each amount of labour.',
      example: { given: 'Which bundles make q = 5 with q = √(LK)?', steps: ['Square both sides: 25 = L × K.', 'So K = 25 ÷ L.', 'L = 1 → K = 25; L = 2 → K = 12.5; L = 5 → K = 5; L = 10 → K = 2.5.'], answer: 'All of these bundles are on the <b>q = 5 isoquant</b>.' },
    },
    {
      sec: 's63', name: 'Cobb–Douglas shortcut (optional)',
      formula: 'q = L<sup>a</sup>K<sup>b</sup>: &nbsp;MPL = a·q/L, &nbsp;MPK = b·q/K, &nbsp;MRTS = (a/b)·(K/L)',
      words: 'A shortcut for the MRTS at a single point. It gives the same idea as the table method; use whichever your question gives you.',
      example: { given: 'q = L<sup>0.5</sup>K<sup>0.5</sup> at L = 4, K = 16.', steps: ['q = √(4 × 16) = √64 = 8.', 'MPL = 0.5 × 8 ÷ 4 = 1.', 'MPK = 0.5 × 8 ÷ 16 = 0.25.', 'MRTS = 1 ÷ 0.25 = 4 (same as (0.5/0.5) × 16/4 = 4).'], answer: 'MRTS = <b>4</b>: one worker replaces 4 units of capital here.' },
    },
    {
      sec: 's64', name: 'Returns to scale test',
      formula: 'Double every input → compare new q with 2 × old q',
      words: 'More than double: IRTS. Exactly double: CRTS. Less than double: DRTS. For q = L<sup>a</sup>K<sup>b</sup>, output is multiplied by 2<sup>a+b</sup>, so compare a + b with 1.',
      example: { given: 'q = L<sup>0.25</sup>K<sup>0.25</sup>, starting at (5, 5).', steps: ['Old q = 5<sup>0.25</sup> × 5<sup>0.25</sup> = 5<sup>0.5</sup> = 2.236.', 'Double: (10, 10) → q = 10<sup>0.5</sup> = 3.162.', 'Twice the old output would be 2 × 2.236 = 4.472.', '3.162 < 4.472. (Shortcut: a + b = 0.5 < 1.)'], answer: '<b>Decreasing returns to scale</b>. Output only rises by 1.41×.' },
      mistake: 'Returns to scale changes ALL inputs together (long run). Diminishing MPL changes only L (short run).',
    },
    {
      sec: 's65', name: 'Technology in the production function',
      formula: 'q = A · L<sup>α</sup> · K<sup>1−α</sup>',
      words: 'A is productivity: a bigger A makes more output from the same inputs. A smaller α means capital-intensive production.',
      symbols: [['A', 'total factor productivity'], ['α', 'labour exponent (share)']],
      example: { given: 'Amazon after robots: q = 10 · L<sup>0.4</sup> · K<sup>0.6</sup> with L = K = 2.', steps: ['2<sup>0.4</sup> × 2<sup>0.6</sup> = 2<sup>0.4+0.6</sup> = 2<sup>1</sup> = 2.', 'q = 10 × 2.'], answer: 'q = <b>20</b> (it was 10 with A = 5). Or (1, 1) now makes 10.' },
    },
  ];

  (window.FORMULA_DRILLS = window.FORMULA_DRILLS || {}).ch6 = [
    { title: 'MPL', make() { const L = ri(2, 8), q0 = ri(20, 80), d = ri(4, 30); return { q: `With ${L - 1} workers the firm makes ${q0} units. With ${L} workers it makes ${q0 + d} units. What is the MPL of worker ${L}?`, answer: d, unit: 'units', formula: `MPL = ${F('Δq', 'ΔL')}`, steps: [`Δq = ${q0 + d} − ${q0} = ${d}.`, 'ΔL = 1.', `MPL = ${d} ÷ 1 = ${d}.`] }; } },
    { title: 'APL', make() { const L = ri(3, 12), apl = ri(5, 30); return { q: `${L} workers produce ${L * apl} units. What is the APL?`, answer: apl, unit: 'per worker', formula: `APL = ${F('q', 'L')}`, steps: [`APL = ${L * apl} ÷ ${L} = ${apl}.`] }; } },
    { title: 'APL after a new worker', make() { const L = ri(3, 8), apl = ri(10, 25), m = ri(5, 40); const q0 = L * apl, q1 = q0 + m, a1 = r2(q1 / (L + 1)); return { q: `${L} workers produce ${q0} units. Worker ${L + 1} has MPL = ${m}. What is the new APL? (2 decimals)`, answer: a1, unit: 'per worker', formula: `APL = ${F('q', 'L')}; MPL ${m > apl ? '>' : m < apl ? '<' : '='} old APL (${apl}) so APL ${m > apl ? 'rises' : m < apl ? 'falls' : 'stays'}`, steps: [`New q = ${q0} + ${m} = ${q1}.`, `New APL = ${q1} ÷ ${L + 1} = ${a1}.`, `Old APL was ${apl}; MPL ${m} is ${m > apl ? 'above' : m < apl ? 'below' : 'equal to'} it, so APL ${m > apl ? 'rose' : m < apl ? 'fell' : 'stayed the same'}.`] }; } },
    { title: 'MRTS = MPL/MPK', make() { const mpk = pick([1, 2, 4, 5]), mrts = pick([0.5, 1, 2, 3, 4]); const mpl = mpk * mrts; return { q: `MPL = ${mpl} and MPK = ${mpk}. What is the MRTS of L for K?`, answer: mrts, unit: 'units of K', formula: `MRTS = ${F('MPL', 'MPK')}`, steps: [`MRTS = ${mpl} ÷ ${mpk} = ${mrts}.`, `One more worker can replace ${mrts} units of capital.`] }; } },
    { title: 'MRTS on an isoquant', make() { const q = pick([4, 5, 6, 8]), L = ri(1, 5); const k0 = (q * q) / L, k1 = (q * q) / (L + 1), m = r2(k0 - k1); return { q: `Isoquant q = √(LK) = ${q}, so K = ${q * q}/L. What is the MRTS of L for K as L goes from ${L} to ${L + 1}? (2 decimals)`, answer: m, unit: 'units of K', formula: `MRTS = −${F('ΔK', 'ΔL')}`, steps: [`K at L = ${L}: ${q * q}/${L} = ${r2(k0)}.`, `K at L = ${L + 1}: ${q * q}/${L + 1} = ${r2(k1)}.`, `ΔK = ${r2(k1)} − ${r2(k0)} = −${m}; ΔL = 1.`, `MRTS = ${m}.`] }; } },
    { title: 'Output from q = √(LK)', make() { const s = pick([[4, 9], [16, 4], [25, 4], [9, 9], [2, 8], [36, 1], [12, 3]]); return { q: `q = √(LK). How much is produced with L = ${s[0]} and K = ${s[1]}?`, answer: Math.sqrt(s[0] * s[1]), unit: 'units', formula: 'q = √(L × K)', steps: [`L × K = ${s[0] * s[1]}.`, `√${s[0] * s[1]} = ${Math.sqrt(s[0] * s[1])}.`] }; } },
    { title: 'Returns to scale', make() { const a = pick([0.25, 0.3, 0.4, 0.5, 0.6, 0.75]), b = pick([0.25, 0.4, 0.5, 0.6, 0.75]); const m = r2(Math.pow(2, a + b)); const k = Math.abs(a + b - 1) < 1e-9 ? 'CRTS' : a + b > 1 ? 'IRTS' : 'DRTS'; return { q: `q = L<sup>${a}</sup>K<sup>${b}</sup>. If both inputs double, output is multiplied by what? (2 decimals)`, answer: m, unit: '×', formula: 'Output multiplier = 2<sup>a+b</sup>', steps: [`a + b = ${a} + ${b} = ${r2(a + b)}.`, `2<sup>${r2(a + b)}</sup> = ${m}.`, `${m} ${m > 2 ? '>' : m < 2 ? '<' : '='} 2, so this is <b>${k}</b>.`] }; } },
    { title: 'Technology: q = A·L^α·K^(1−α)', make() { const A = pick([2, 5, 10, 20]), L = pick([1, 2, 4]); return { q: `q = ${A}·L<sup>0.4</sup>K<sup>0.6</sup>. What is output when L = K = ${L}?`, answer: A * L, unit: 'units', formula: 'q = A · L<sup>α</sup> · K<sup>1−α</sup>', steps: [`With L = K = ${L}: L<sup>0.4</sup>K<sup>0.6</sup> = ${L}<sup>0.4+0.6</sup> = ${L}.`, `q = ${A} × ${L} = ${A * L}.`] }; } },
  ];
})();
