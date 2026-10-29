/* Chapter 7: alternative methods for each formula, plus multi-step word problems. */
(function () {
  const ALT = {
    'Implicit (opportunity) costs': ['Ask "what does the owner give up?" List every income the owner forgoes (interest, salary, rent on their own building) and add them up.'],
    'Accounting vs economic profit': ['In one line: economic profit = TR − (explicit + implicit) = 1,140,000 − (1,016,000 + 114,000) = $10,000.', 'Decision shortcut: open if accounting profit > implicit costs ($124k > $114k).'],
    'Rental price of capital': ['Per day: R ÷ 365 ($11M ÷ 365 ≈ $30,137). Per month: R ÷ 12.', 'Any year n: value = price − depreciation × (n − 1); interest = rate × value. Year 11: value $100M, so R = $5M + $4M = $9M.'],
    'Total cost with two inputs': ['Short run: TC = VC + FC (labour is VC, fixed capital is FC). Long run: no fixed cost, both inputs vary.'],
    'Marginal cost': ['Use TC instead of VC: TC goes 225 → 254, so MC = $29. FC cancels out, so you get the same answer.', 'From productivity: MC = W ÷ MPL.'],
    'MC from productivity': ['Time per unit = 1 ÷ MPL hours; cost per unit = time × wage. MPL = 3 means 1/3 hour × $15 = $5.'],
    'Average costs': ['ATC = AVC + AFC: 28 + 12.50 = 40.50.', 'Rearranged: AFC = ATC − AVC and AVC = ATC − AFC. Handy when a table leaves one column blank.'],
    'Total cost from ATC': ['Split it: VC = AVC × q and FC = AFC × q, then TC = VC + FC (28 × 4 + 12.50 × 4 = 112 + 50 = 162).'],
    'Marginal vs average costs': ['Compute the new average directly: new ATC = (old TC + MC) ÷ (q + 1) = (254 + 38) ÷ 9 = 32.44.'],
    'Isocost line': ['Slope from the intercepts: K-intercept ÷ L-intercept = 4 ÷ 2 = 2 = W/R.', 'Solved for K: K = C/R − (W/R)·L = 4 − 2L.'],
    'Cost-minimizing rule': ['Bang for the buck: compare MPL/W with MPK/R and put the next dollar where it buys more output.', 'Graph: find the isocost line closest to the origin that still touches the isoquant.'],
    'Solving for the cheapest bundle (q = √(LK))': ['Bang-for-the-buck route: MPL/W = MPK/R with MPL = 0.5q/L and MPK = 0.5q/K simplifies to K/L = W/R, the same equation.', 'Cost check formula for √(LK): minimum cost = 2q√(W·R) = 2 × 4 × √200 = $113.14.'],
    'Long-run average cost and scale': ['Ratio shortcut: LRATC changes by (cost factor ÷ output factor). Cost ×2 and output ×2.67 gives LRATC × 0.75: $72 → $54.'],
  };
  (window.FORMULAS.ch7 || []).forEach((f) => { if (ALT[f.name]) f.alt = ALT[f.name]; });

  (window.WORD_PROBLEMS = window.WORD_PROBLEMS || {}).ch7 = [
    {
      source: 'Word problem', title: 'Maya\'s food truck', short: 'WP: Economic profit',
      prompt: '<p>Maya quits a $50,000 job to run a food truck. She uses $40,000 of savings (which earn 5%) and borrows $20,000 at 6%. Ingredients, gas, permits and a helper cost $70,000 a year. Revenue is $140,000.</p>',
      parts: [
        { l: 'a', q: 'Explicit costs?', a: '<p>$70,000 + interest paid on the loan $20,000 × 0.06 = $1,200 → <b>$71,200</b>.</p>' },
        { l: 'b', q: 'Implicit costs?', a: '<p>Interest forgone $40,000 × 0.05 = $2,000 + salary forgone $50,000 → <b>$52,000</b>.</p>' },
        { l: 'c', q: 'Accounting and economic profit. Should she keep the truck?', a: '<p>Accounting: 140,000 − 71,200 = <b>$68,800</b>. Economic: 68,800 − 52,000 = <b>$16,800</b> &gt; 0, so yes, it beats her old job and savings.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'The delivery van', short: 'WP: Rental price',
      prompt: '<p>A courier buys a $60,000 van that lasts 6 years. The interest rate is 5%.</p>',
      parts: [
        { l: 'a', q: 'Annual depreciation?', a: '<p>60,000 ÷ 6 = <b>$10,000</b>.</p>' },
        { l: 'b', q: 'Rental price in year 1 (per year and per month)?', a: '<p>Interest forgone 0.05 × 60,000 = $3,000. R = 10,000 + 3,000 = <b>$13,000</b>/year ≈ <b>$1,083</b>/month.</p>' },
        { l: 'c', q: 'Rental price in year 3?', a: '<p>Value = 60,000 − 2 × 10,000 = $40,000; interest $2,000; R = <b>$12,000</b>.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'Pizza shop cost table', short: 'WP: SR costs',
      prompt: '<p>Rent is $100 a day (FC). VC for 0–6 pizzas an hour: $0, 30, 50, 66, 88, 120, 168.</p>',
      parts: [
        { l: 'a', q: 'Find MC for each pizza.', a: '<p>ΔVC: 30, 20, 16, 22, 32, 48. It falls then rises: MPL first rises, then diminishes.</p>' },
        { l: 'b', q: 'Find AVC and ATC at q = 4.', a: '<p>AVC = 88 ÷ 4 = <b>$22</b>. TC = 188, ATC = 188 ÷ 4 = <b>$47</b> (or AVC + AFC = 22 + 25).</p>' },
        { l: 'c', q: 'Will ATC rise or fall with the 5th pizza? With the 6th?', a: '<p>5th: MC $32 &lt; ATC $47, so ATC falls to 220 ÷ 5 = <b>$44</b>. 6th: MC $48 &gt; $44, so ATC rises to 268 ÷ 6 = <b>$44.67</b>. Min ATC is at q = 5.</p>' },
        { l: 'd', q: 'Where is min AVC?', a: '<p>AVC: 30, 25, 22, 22, 24, 28. Minimum <b>$22</b> at q = 3–4.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'Call centre: wages and productivity', short: 'WP: MC = W/MPL',
      prompt: '<p>Agents earn $18 an hour. The first agent handles 6 calls an hour; as more agents crowd the phone lines, the extra calls per agent hour fall to 4, then 3.</p>',
      parts: [
        { l: 'a', q: 'MC per call at each stage?', a: '<p>MC = W/MPL: 18/6 = <b>$3</b>, 18/4 = <b>$4.50</b>, 18/3 = <b>$6</b>.</p>' },
        { l: 'b', q: 'What happens to MC if the wage rises to $24 and MPL is 4?', a: '<p>24/4 = <b>$6</b>. Higher wages or lower productivity both raise MC.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'Car wash: workers or machines?', short: 'WP: Cost minimization',
      prompt: '<p>A car wash makes q = √(L·K) washes an hour. Workers cost W = $16/hr, machines rent for R = $4/hr. The target is q = 8. Right now it uses 8 workers and 8 machines.</p>',
      parts: [
        { l: 'a', q: 'Current cost, MRTS and W/R. Is this cheapest?', a: '<p>Cost = 16 × 8 + 4 × 8 = <b>$160</b>. MRTS = K/L = 1; W/R = 4. MRTS &lt; W/R: labour is expensive for what it replaces, so <b>substitute machines for workers</b>.</p>' },
        { l: 'b', q: 'Find the cheapest bundle and its cost.', a: '<p>K/L = 4, so K = 4L; 8 = √(4L²) = 2L, giving L = <b>4</b>, K = <b>16</b>. Cost = 64 + 64 = <b>$128</b>, saving $32 an hour.</p>' },
        { l: 'c', q: 'Check with bang for the buck at the optimum.', a: '<p>MPL = 0.5 × 8/4 = 1, so MPL/W = 1/16. MPK = 0.5 × 8/16 = 0.25, so MPK/R = 0.25/4 = 1/16. Equal. ✓</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'Expanding the bakery chain', short: 'WP: LRATC',
      prompt: '<p>A bakery spends $2,000 a day and makes 500 loaves. It doubles every input (cost $4,000).</p>',
      parts: [
        { l: 'a', q: 'LRATC before?', a: '<p>2,000 ÷ 500 = <b>$4</b> per loaf.</p>' },
        { l: 'b', q: 'If output becomes 1,200 loaves: LRATC and returns to scale?', a: '<p>4,000 ÷ 1,200 = <b>$3.33</b>: falls, so economies of scale (IRTS).</p>' },
        { l: 'c', q: 'If output becomes 900 loaves?', a: '<p>4,000 ÷ 900 = <b>$4.44</b>: rises, so diseconomies of scale (DRTS).</p>' },
      ],
    },
  ];
})();
