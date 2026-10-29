/* Chapter 6: alternative methods for each formula, plus multi-step word problems. */
(function () {
  const ALT = {
    'Production function': ['Root each input first: √16 × √4 = 4 × 2 = 8. Same answer, smaller numbers.', 'Exponent rule: L<sup>0.5</sup>K<sup>0.5</sup> = (L·K)<sup>0.5</sup>, so multiply then square-root.'],
    'Short-run production function': ['Skip the simplifying: plug both numbers into the original. q = √(9 × 4) = √36 = 6.'],
    'Marginal product of labour (MPL)': ['On a graph: MPL is how far the total product curve rises over one extra worker.', 'If L changes by more than 1, divide: L 2 → 4 and q 30 → 80 gives MPL = 50 ÷ 2 = 25 per worker.'],
    'Average product of labour (APL)': ['On a graph: APL is the slope of a straight line from the origin to that point on the total product curve.', 'Backwards: q = APL × L (20 × 3 = 60).'],
    'Marginal vs average rule': ['Compute it directly: new APL = (old q + MPL) ÷ (L + 1) = (80 + 15) ÷ 5 = 19.', 'GPA check: MPL is your next grade, APL is your GPA.'],
    'Marginal product of capital (MPK)': ['Same method as MPL: hold L fixed and change K by one unit.'],
    'MRTS of L for K': ['From the isoquant\'s slope: rise ÷ run of the tangent line, as a positive number.', 'For q = √(LK) only: MRTS = K/L. At (3, 12): 12 ÷ 3 = 4.', 'Meaning check: MRTS = 4 means one worker can replace 4 machines and output stays the same.'],
    'Points on an isoquant': ['Plug and check: is (4, 6.25) on q = 5? √(4 × 6.25) = √25 = 5. Yes.'],
    'Cobb–Douglas shortcut (optional)': ['Table method instead: pick two nearby bundles on the isoquant and use MRTS = −ΔK/ΔL.'],
    'Returns to scale test': ['Exponent shortcut: add the exponents. a + b = 1 → CRTS, > 1 → IRTS, < 1 → DRTS.', 'Any multiple t: output multiplies by t<sup>a+b</sup>. Tripling inputs with a + b = 0.5 → ×3<sup>0.5</sup> = 1.73.', 'Constant out front (e.g. q = 4·L<sup>0.5</sup>K<sup>0.5</sup>) doesn\'t change returns to scale; only the exponents do.'],
    'Technology in the production function': ['Ratio method: output changes by the same percentage as A. A from 5 to 10 doubles output for any bundle.'],
  };
  (window.FORMULAS.ch6 || []).forEach((f) => { if (ALT[f.name]) f.alt = ALT[f.name]; });

  (window.WORD_PROBLEMS = window.WORD_PROBLEMS || {}).ch6 = [
    {
      source: 'Word problem', title: 'The bakery with one oven', short: 'WP: Bakery',
      prompt: '<p>A bakery has one oven (fixed in the short run). Daily output with 0–6 bakers is 0, 40, 100, 150, 180, 200, 210 loaves.</p>',
      parts: [
        { l: 'a', q: 'Find the MPL of each baker.', a: '<p>MPL = Δq/ΔL: 40, <b>60</b>, 50, 30, 20, 10.</p>' },
        { l: 'b', q: 'Find the APL with 1–6 bakers.', a: '<p>APL = q/L: 40, 50, 50, 45, 40, 35.</p>' },
        { l: 'c', q: 'When do diminishing marginal returns start, and why?', a: '<p>With the 3rd baker: MPL drops from 60 to 50. The oven is fixed, so extra bakers have less oven time each.</p>' },
        { l: 'd', q: 'The 4th baker\'s MPL is 30. Use the marginal–average rule to predict APL, then check.', a: '<p>MPL 30 &lt; APL 50, so APL falls. Check: 150 + 30 = 180, and 180 ÷ 4 = <b>45</b>.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'Café: baristas and espresso machines', short: 'WP: Isoquant',
      prompt: '<p>A café makes q = √(L·K) drinks per minute, where L = baristas and K = machines. The manager wants q = 6.</p>',
      parts: [
        { l: 'a', q: 'How many machines are needed with 1, 2, 3, 4 and 6 baristas?', a: '<p>K = 36 ÷ L: <b>36, 18, 12, 9, 6</b>.</p>' },
        { l: 'b', q: 'MRTS as L goes 2 → 3, then 3 → 4.', a: '<p>−ΔK/ΔL: 18 − 12 = <b>6</b>, then 12 − 9 = <b>3</b>. Diminishing: each extra barista replaces fewer machines.</p>' },
        { l: 'c', q: 'At (3, 12), find MPL, MPK and MRTS another way.', a: '<p>Shortcut: MPL = 0.5 × 6 ÷ 3 = 1; MPK = 0.5 × 6 ÷ 12 = 0.25; MRTS = 1 ÷ 0.25 = <b>4</b> (= K/L = 12/3). This is the slope at the point; the table answers (6 and 3) are averages over a step on either side.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'Two factories double in size', short: 'WP: Returns to scale',
      prompt: '<p>Factory A: q = 4·L<sup>0.5</sup>K<sup>0.5</sup>, using L = 25, K = 16. Factory B: q = L<sup>0.6</sup>K<sup>0.6</sup>, using L = K = 10.</p>',
      parts: [
        { l: 'a', q: 'Output of A, and output after doubling its inputs.', a: '<p>q = 4 × 5 × 4 = <b>80</b>. Doubled (50, 32): 4 × √1600 = 4 × 40 = <b>160</b>, exactly double: CRTS.</p>' },
        { l: 'b', q: 'By what factor does B\'s output rise if it doubles inputs? Returns to scale?', a: '<p>2<sup>0.6+0.6</sup> = 2<sup>1.2</sup> ≈ <b>2.30</b> &gt; 2: <b>IRTS</b>. (Check: 10<sup>1.2</sup> ≈ 15.85 → 20<sup>1.2</sup> ≈ 36.41.)</p>' },
        { l: 'c', q: 'Does the 4 in front of A\'s function affect returns to scale?', a: '<p>No. It scales output up but doesn\'t change how output responds to doubling; only the exponents (sum = 1) matter.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'Better seeds on the farm', short: 'WP: Technology',
      prompt: '<p>A farm produces q = A·L<sup>0.5</sup>K<sup>0.5</sup> tonnes with A = 3, using L = 4 workers and K = 4 hectares. New seeds raise A to 4.5.</p>',
      parts: [
        { l: 'a', q: 'Output before and after the new seeds?', a: '<p>Before: 3 × 2 × 2 = <b>12</b>. After: 4.5 × 4 = <b>18</b>, up 50% (same % as A).</p>' },
        { l: 'b', q: 'With the new seeds, how many workers and hectares (equal amounts) are needed to make the old 12 tonnes?', a: '<p>4.5 × x = 12 (since √(x·x) = x), so x = <b>2.67</b> each. Fewer inputs for the same output means lower costs.</p>' },
      ],
    },
  ];
})();
