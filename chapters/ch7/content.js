/* Chapter 7 · The Cost of Production. Combines lecture Part 1 (7.1–7.2) and Part 2 (7.3). */
(function () {
  const F = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;

  const s71 = `
    <p>Profit = TR − TC, so minimizing cost is part of maximizing profit. (Apple out-earned Samsung in 2011–12 partly because it spent 3% of revenue on R&amp;D and marketing versus Samsung's 12%.)</p>
    <div class="table-wrap"><table><thead><tr><th>Explicit costs</th><th>Implicit (opportunity) costs</th></tr></thead><tbody>
      <tr><td>Need a money outlay: wages, rent, payments for inputs, interest paid on a loan</td><td>No money outlay: interest forgone on the owner's savings, salary the owner gives up, inputs in inventory that could have been sold</td></tr>
    </tbody></table></div>
    <div class="eq"><span class="lbl">Costs</span> Accounting cost = explicit · Economic cost = explicit + implicit</div>
    <div class="eq"><span class="lbl">Profits</span> Economic profit = accounting profit − implicit costs</div>
    <p>Wine bar example: $1M total; $400k borrowed at 4% and $600k of savings; owner quits a $90k job. Explicit = $1M + $16k interest = $1.016M. Implicit = $24k interest forgone + $90k salary = $114k. With accounting profit of $124k (boom), economic profit is $10k: open. With $80k (slump), economic profit is −$34k: don't. <b>This course uses economic profit.</b></p>
    <div data-widget="wineBar"></div>
    <h3>Short run vs long run total cost</h3>
    <div class="eq"><span class="lbl">TC</span> W·L + R·K &nbsp;(W = wage, R = rental price of capital)</div>
    <div class="table-wrap"><table><thead><tr><th>Short run</th><th>Long run</th></tr></thead><tbody>
      <tr><td>K fixed. TC(q) = W·L(q) + R·K̄ = VC(q) + FC</td><td>K varies with q. LRTC(q) = W·L(q) + R·K(q). <b>No fixed cost.</b></td></tr>
    </tbody></table></div>
    <h3>Rental price of capital</h3>
    <div class="eq"><span class="lbl">R per year</span> depreciation + interest forgone (or paid)</div>
    <p>A $150M plane lasting 30 years: depreciation $5M/year. At 4% interest, year 1 interest forgone = $6M, so R = $11M/year (≈ $30,137/day). Year 2: value $145M, interest $5.8M, R = $10.8M. Year 11: value $100M, R = $9M.</p>
    <div data-widget="rentalCapital"></div>
  `;

  const s72 = `
    <p>In the SR, TC = VC + FC and VC is the labour cost W·L(q). How fast labour cost rises with output depends on labour productivity.</p>
    <div class="eq"><span class="lbl">Key link</span> MC = ${F('W', 'MPL')} &nbsp;·&nbsp; labour time per unit = 1/MPL</div>
    <p>With W = $15: MPL = 3 units/hr → MC = $5; MPL = 5 → MC = $3. <b>Rising MPL makes MC fall; diminishing MPL makes MC rise.</b> Since diminishing MPL eventually happens in the SR (K fixed), MC eventually rises.</p>
    <div class="table-wrap"><table><thead><tr><th>Cost</th><th>Formula</th><th>Shape</th></tr></thead><tbody>
      <tr><td>Marginal cost</td><td>MC = ΔTC/Δq = ΔVC/Δq</td><td>Falls, then rises (mirror of MPL)</td></tr>
      <tr><td>Fixed cost / AFC</td><td>FC doesn't vary with q; AFC = FC/q</td><td>AFC always falls</td></tr>
      <tr><td>Average variable cost</td><td>AVC = VC/q</td><td>U-shaped</td></tr>
      <tr><td>Total cost / ATC</td><td>TC = VC + FC; ATC = TC/q = AVC + AFC</td><td>U-shaped, above AVC</td></tr>
    </tbody></table></div>
    <div class="callout key"><span class="tag">Marginal vs average again</span><p>MC &lt; AVC → AVC falls; MC &gt; AVC → AVC rises. Same for ATC. So <b>MC cuts AVC and ATC at their minimum points</b>. ATC lies above AVC because TC = VC + FC &gt; VC. TC = ATC × q, e.g. $40.50 × 4 = $162.</p></div>
    <div data-widget="srCosts"></div>
    <p><b>Aluminum smelting (Example 7.3):</b> MC = AVC = $1,140/ton up to 600 tons/day. Beyond that (overtime, maintenance) MC = $1,300 &gt; AVC, so AVC rises: $1,162.86 at 700, $1,180 at 800, $1,193.30 at 900 (AVC = $1,300 − $96,000/q).</p>
    <div class="cards3">
      <div class="mini"><h4>Diminishing MPL from the start</h4><p>AVC rises from the first unit (no U), so MC doesn't cut AVC at a minimum. ATC is still U-shaped.</p></div>
      <div class="mini"><h4>Constant MPL</h4><p>MC = W/MPL is constant (e.g. $15/3 = $5). VC = 5q is a straight line, and AVC = MC = $5.</p></div>
    </div>
  `;

  const s73 = `
    <p>In the LR the firm picks K too, so it chooses the input mix that makes q at the lowest cost. It's Chapter 3's consumer problem in reverse:</p>
    <div class="table-wrap"><table><thead><tr><th>Cost minimization (Ch 7)</th><th>Consumer choice (Ch 3)</th></tr></thead><tbody>
      <tr><td>Isoquant</td><td>Indifference curve</td></tr>
      <tr><td>Isocost line W·L + R·K = C</td><td>Budget line P<sub>X</sub>x + P<sub>Y</sub>y = I</td></tr>
      <tr><td>Tangency: MRTS = W/R</td><td>Tangency: MRS = P<sub>X</sub>/P<sub>Y</sub></td></tr>
    </tbody></table></div>
    <h3>Isocost lines</h3>
    <p>W = $20, R = $10, C = $40: 20L + 10K = 40. Intercepts: K = C/R = 4, L = C/W = 2. Slope = <b>relative price of labour W/R = 2</b> (labour costs 2 units of capital). W ↑ or R ↓: steeper. W ↓ or R ↑: flatter. C ↑: parallel shift out. Closer to the origin = lower cost.</p>
    <h3>The cost-minimizing bundle</h3>
    <div class="eq"><span class="lbl">Optimum</span> MRTS of L for K = ${F('W', 'R')} &nbsp;⇔&nbsp; ${F('MPL', 'W')} = ${F('MPK', 'R')}</div>
    <div class="table-wrap"><table><thead><tr><th>Comparison</th><th>Meaning</th><th>To cut cost</th></tr></thead><tbody>
      <tr><td>MRTS &gt; W/R</td><td>Labour gives good returns (e.g. MRTS 4 vs W/R 2: one worker replaces 4 K but costs only 2)</td><td>Substitute <b>L for K</b></td></tr>
      <tr><td>MRTS &lt; W/R</td><td>Labour is expensive relative to its productivity</td><td>Substitute <b>K for L</b></td></tr>
      <tr><td>MRTS = W/R</td><td>Tangency</td><td>Cost is minimized</td></tr>
    </tbody></table></div>
    <div data-widget="costMin"></div>
    <p><b>Wage increase:</b> the isocost gets steeper and the firm substitutes K for L (self-checkouts). LR cost still rises, but by less than if it kept the old bundle A. In the SR it can't substitute (K fixed), so SR cost rises more. This is the producer's substitution effect; there's no income effect because output is held fixed. Developing countries with low wages use labour-intensive methods; rich countries use more capital.</p>
    <p><b>Capital–labour ratio K/L:</b> capital-intensive goods (car batteries, q = L<sup>¼</sup>K<sup>¾</sup>) have flat isoquants and a high K/L; labour-intensive goods (clothing, q = L<sup>¾</sup>K<sup>¼</sup>) have steep isoquants and a low K/L, at the same input prices.</p>

    <h3>Costs at different outputs: returns to scale</h3>
    <p>Scale the optimal bundle up along the <b>expansion path</b>. Example: W = $12, R = $108, (L, K) = (9, 1) makes 3 units at LRTC = $216. Doubling inputs doubles LRTC to $432; whether LRATC = LRTC/q falls depends on how much output rises.</p>
    <div class="table-wrap"><table><thead><tr><th>Returns to scale</th><th>Economies of scale</th><th>LRATC as q ↑</th></tr></thead><tbody>
      <tr><td>IRTS</td><td>Economies of scale</td><td>Falls</td></tr>
      <tr><td>CRTS</td><td>None</td><td>Constant</td></tr>
      <tr><td>DRTS</td><td>Diseconomies of scale</td><td>Rises</td></tr>
    </tbody></table></div>
    <p>The usual case is IRTS then DRTS, which gives a <b>U-shaped LRATC</b>. Its minimum is the <b>minimum efficient scale (MES)</b>, and LRMC cuts LRATC there. Economies come from fixed R&amp;D, large plants (autos, refining), capital-intensive methods, and bulk input discounts. Diseconomies come from coordination problems and regulatory burden.</p>
    <p>Application: rising Chinese wages barely raised the LRATC of batteries (capital-intensive, big economies of scale), so China kept that market. Clothing is labour-intensive, so China's LRATC rose sharply and production moved to Bangladesh.</p>
    <h3>LRATC from short-run ATC curves</h3>
    <p>Each factory size has a SRATC curve. The LRATC is the lower envelope: the best factory for each planned output. <b>SRATC ≥ LRATC</b>: equal if actual output matches the plan, higher if the firm built the wrong size and can't change it in the SR.</p>
    <div data-widget="lratc"></div>
    <h3>Technological progress</h3>
    <p>Amazon's robots: a more capital-intensive method lowered LRATC a little; the productivity jump (A from 5 to 10) lowered it a lot, since fewer inputs make the same output. The LRATC curve shifts down.</p>
  `;

  const T = window.TABLE71;
  const practice = [
    {
      source: 'Lecture example', title: 'The wine bar', short: 'Economic profit',
      prompt: '<p>$1M to open: $400k bank loan at 4%, $600k from savings (which earn 4%). The owner quits a $90k job and takes no salary.</p>',
      widget: '<div data-widget="wineBar"></div>',
      parts: [
        { l: 'a', q: 'Explicit and implicit costs?', a: '<p>Explicit: $1,000,000 + $16,000 interest on the loan = <b>$1.016M</b>. Implicit: $600,000 × 4% = $24,000 + $90,000 salary = <b>$114,000</b>.</p>' },
        { l: 'b', q: 'Accounting profit is $124,000 (boom) or $80,000 (slump). Economic profit, and should it open?', a: '<p>Boom: $124,000 − $114,000 = <b>$10,000</b>, open. Slump: $80,000 − $114,000 = <b>−$34,000</b>, don\'t open (he\'d earn more keeping his job and savings).</p>' },
      ],
    },
    {
      source: 'Lecture example', title: 'Rental price of capital', short: 'Rental price',
      prompt: '<p>Air Canada buys a $150M plane that lasts 30 years, using retained earnings. The interest rate is 4%.</p>',
      parts: [
        { l: 'a', q: 'Rental price in year 1, per year and per day?', a: '<p>Depreciation $150M/30 = $5M; interest forgone 4% × $150M = $6M. R = <b>$11M/year</b> ≈ $30,137/day.</p>' },
        { l: 'b', q: 'Year 11?', a: '<p>Value $150M − 10 × $5M = $100M; interest $4M; R = $5M + $4M = <b>$9M</b> ≈ $24,658/day.</p>' },
      ],
    },
    {
      source: 'Worksheet 1', title: 'MPL and MC', short: 'MC = W/MPL',
      prompt: '<p>The wage is $15/hour.</p>',
      parts: [
        { l: 'a', q: 'MPL rises from 3 to 5 units per hour. What happens to MC?', a: '<p>MC = W/MPL: $15/3 = $5 → $15/5 = <b>$3</b>. Rising MPL lowers MC.</p>' },
        { l: 'b', q: 'Later MPL falls from 5 to 3. MC?', a: '<p>$3 → <b>$5</b>. Diminishing MPL raises MC. That is why the MC curve eventually slopes up.</p>' },
        { l: 'c', q: 'MPL is constant at 3. Find MC, VC and AVC.', a: '<p>MC = $5 every unit, VC = 5q (a straight line), AVC = 5q/q = <b>$5 = MC</b>.</p>' },
      ],
    },
    {
      source: 'Table 7.1', title: 'Short-run costs', short: 'Table 7.1',
      prompt: '<p>FC = $50. VC for q = 0…11 is 0, 50, 78, 98, 112, 130, 150, 175, 204, 242, 300, 385.</p>',
      widget: '<div data-widget="srCosts"></div>',
      parts: [
        { l: 'a', q: 'Find TC, MC, AVC and ATC at q = 4.', a: `<p>TC = 112 + 50 = <b>$162</b>; MC = 112 − 98 = <b>$14</b>; AVC = 112/4 = <b>$28</b>; ATC = 162/4 = <b>$40.50</b>.</p>` },
        { l: 'b', q: 'Where are AVC and ATC at their minimums?', a: '<p>AVC = $25 at q = 6 and 7. ATC = 254/8 = <b>$31.75</b> at q = 8. MC crosses each near its minimum.</p>' },
        { l: 'c', q: 'At q = 9, MC = $38 and ATC at q = 8 is $31.75. What happens to ATC?', a: '<p>MC &gt; ATC, so ATC rises: 292/9 = $32.44.</p>' },
      ],
    },
    {
      source: 'Example 7.3', title: 'Aluminum smelting', short: 'Aluminum',
      prompt: '<p>MC = $1,140/ton up to 600 tons/day. Beyond 600 tons, MC = $1,300 (overtime and maintenance).</p>',
      parts: [{ l: 'a', q: 'Find AVC at 700, 800 and 900 tons.', a: '<p>VC = 1,140(600) + 1,300(q − 600), so AVC = $1,300 − $96,000/q: <b>$1,162.86, $1,180, $1,193.33</b>. AVC rises because MC &gt; AVC.</p>' }],
    },
    {
      source: 'Handout / Worksheet 2', title: 'Isocost lines and cost minimization', short: 'Cost minimization',
      prompt: '<p>W = $20, R = $10.</p>',
      widget: '<div data-widget="costMin"></div>',
      parts: [
        { l: 'a', q: 'Draw the isocost line for C = $40. Intercepts and slope?', a: '<p>K-intercept 40/10 = <b>4</b>, L-intercept 40/20 = <b>2</b>, slope = W/R = <b>2</b>.</p>' },
        { l: 'b', q: 'At bundle B, MRTS = 4. What should the firm do?', a: '<p>MRTS 4 &gt; W/R 2: one worker replaces 4 units of K but costs only 2. <b>Substitute L for K</b> until MRTS = 2.</p>' },
        { l: 'c', q: 'The wage rises. What happens to the input mix and cost?', a: '<p>W/R rises and the isocost gets steeper. The firm <b>substitutes K for L</b>. LRTC rises, but by less than with the old bundle. In the SR (K fixed) cost rises more.</p>' },
      ],
    },
    {
      source: 'Worksheet 3', title: 'Returns to scale and LRATC', short: 'LRATC',
      prompt: '<p>W = $12, R = $108. The optimal bundle (9, 1) makes 3 units.</p>',
      widget: '<div data-widget="lratc"></div>',
      parts: [
        { l: 'a', q: 'LRTC and LRATC at q = 3?', a: '<p>LRTC = 12(9) + 108(1) = <b>$216</b>; LRATC = $72.</p>' },
        { l: 'b', q: 'The firm doubles to (18, 2), so LRTC = $432. Find LRATC if output becomes 6, 8, or 5.', a: '<p>CRTS (q = 6): $72, unchanged. IRTS (q = 8): $54, falls (economies of scale). DRTS (q = 5): $86.40, rises (diseconomies).</p>' },
        { l: 'c', q: 'Why is SRATC ≥ LRATC?', a: '<p>In the LR the firm picks the best factory for its planned output. If actual output differs, it is stuck with a factory that isn\'t the cheapest for that output, so SRATC &gt; LRATC. If the plan was right, they are equal.</p>' },
      ],
    },
  ];

  const quiz = [
    { q: 'An owner uses $100,000 of savings (could earn 5%) and gives up a $60,000 salary. Implicit costs are…', options: ['$5,000', '$60,000', '$65,000', '$105,000'], answer: 2, why: 'Interest forgone 5% × $100,000 = $5,000 + salary forgone $60,000 = $65,000.' },
    { q: 'Economic profit equals…', options: ['TR − explicit costs', 'Accounting profit + implicit costs', 'Accounting profit − implicit costs', 'TR − fixed costs'], answer: 2, why: 'Economic cost = explicit + implicit, so economic profit = accounting profit − implicit costs.' },
    { q: 'A $200M machine lasts 20 years; interest is 5%. Rental price in year 1 is…', options: ['$10M', '$20M', '$200M', '$15M'], answer: 1, why: 'Depreciation $10M + interest forgone 5% × $200M = $10M → $20M per year.' },
    { q: 'W = $20 and MPL = 4 units/hour. MC is…', options: ['$80', '$5', '$24', '$16'], answer: 1, why: 'MC = W/MPL = 20/4 = $5.' },
    { q: 'Diminishing MPL causes the MC curve to…', options: ['Fall', 'Rise', 'Stay flat', 'Become vertical'], answer: 1, why: 'Each unit needs more labour time, so MC = W/MPL rises.' },
    { q: 'MC is below ATC. As output increases, ATC…', options: ['Rises', 'Falls', 'Stays the same', 'Equals AVC'], answer: 1, why: 'A marginal below the average pulls the average down.' },
    { q: 'The MC curve crosses AVC and ATC…', options: ['At their maximums', 'At their minimums', 'Where AFC is lowest', 'Never'], answer: 1, why: 'MC below average pulls it down, above pushes it up, so it crosses at the bottom.' },
    { q: 'ATC = $40.50 at q = 4. TC is…', options: ['$10.13', '$44.50', '$162', '$81'], answer: 2, why: 'TC = ATC × q = 40.50 × 4 = $162.' },
    { q: 'Which cost curve always falls as output rises?', options: ['MC', 'AVC', 'ATC', 'AFC'], answer: 3, why: 'AFC = FC/q: a fixed amount spread over more units.' },
    { q: 'MPL is constant at 4 and W = $20. AVC is…', options: ['Rising', '$5, equal to MC', '$80', 'U-shaped'], answer: 1, why: 'MC = 20/4 = $5 every unit, VC = 5q, so AVC = $5 = MC.' },
    { q: 'W = $30, R = $10, C = $120. The isocost line\'s L-intercept and slope are…', options: ['4 and 3', '12 and 3', '4 and 1/3', '12 and 1/3'], answer: 0, why: 'L-intercept = C/W = 4, K-intercept = 12, slope = W/R = 3.' },
    { q: 'At the current bundle MRTS = 1 and W/R = 3. To cut cost the firm should…', options: ['Use more L, less K', 'Use more K, less L', 'Keep the bundle', 'Cut output'], answer: 1, why: 'Labour costs 3 units of K but only replaces 1, so it is expensive: substitute K for L.' },
    { q: 'The cost-minimizing condition can be written as…', options: ['MPL/W = MPK/R', 'MPL × W = MPK × R', 'MRTS = R/W', 'MPL = MPK'], answer: 0, why: 'MRTS = MPL/MPK = W/R rearranges to MPL/W = MPK/R: equal bang for the buck.' },
    { q: 'Wages rise. In the long run the firm…', options: ['Uses more labour', 'Substitutes capital for labour; cost rises, but less than without substituting', 'Cost falls', 'Cannot change inputs'], answer: 1, why: 'Steeper isocost → move along the isoquant toward more K. Cost still rises, but substitution limits the increase.' },
    { q: 'Inputs double and output triples. LRATC…', options: ['Rises: diseconomies', 'Falls: economies of scale', 'Stays the same', 'Doubles'], answer: 1, why: 'LRTC doubles but q triples, so LRATC = LRTC/q falls. IRTS means economies of scale.' },
    { q: 'The minimum efficient scale is…', options: ['Where SRATC is lowest', 'The output where LRATC is at its minimum', 'The smallest output a firm can make', 'Where MC = 0'], answer: 1, why: 'MES is the bottom of the U-shaped LRATC, where LRMC crosses it.' },
    { q: 'A firm built a factory for 1,000 units but produces 400. Its SRATC at 400 is…', options: ['Below LRATC', 'Equal to LRATC', 'Above LRATC', 'Zero'], answer: 2, why: 'The factory isn\'t the cheapest one for 400 units, and in the SR it can\'t change it.' },
    { q: 'Rising Chinese wages hurt China\'s cost advantage more in…', options: ['Batteries (capital-intensive)', 'Clothing (labour-intensive)', 'Both equally', 'Neither'], answer: 1, why: 'Clothing uses lots of labour, so higher wages push its LRATC up a lot. Production moved to Bangladesh.' },
  ];

  const cards = [
    { term: 'Explicit vs implicit costs', def: 'Explicit: money outlays (wages, rent, interest paid). Implicit: opportunity costs with no outlay (interest forgone, salary forgone).' },
    { term: 'Economic vs accounting profit', def: 'Accounting profit = TR − explicit. Economic profit = TR − explicit − implicit = accounting profit − implicit.' },
    { term: 'Rental price of capital', def: 'Per year: depreciation + interest forgone (or paid). $150M plane, 30 years, 4%: $5M + $6M = $11M in year 1.' },
    { term: 'SR vs LR total cost', def: 'SR: TC = W·L(q) + R·K̄ = VC + FC. LR: LRTC = W·L(q) + R·K(q), no fixed cost.' },
    { term: 'MC = W/MPL', def: 'Marginal cost is the labour cost of the next unit. Rising MPL lowers MC; diminishing MPL raises it.' },
    { term: 'AFC, AVC, ATC', def: 'AFC = FC/q (always falls). AVC = VC/q (U). ATC = TC/q = AVC + AFC (U, above AVC).' },
    { term: 'MC and averages', def: 'MC below the average pulls it down, above pushes it up. MC cuts AVC and ATC at their minimums.' },
    { term: 'Isocost line', def: 'W·L + R·K = C. Intercepts C/W and C/R. Slope = W/R, the relative price of labour.' },
    { term: 'Cost-minimizing rule', def: 'MRTS of L for K = W/R, or MPL/W = MPK/R. MRTS > W/R → use more L; MRTS < W/R → use more K.' },
    { term: 'Input price change', def: 'W ↑: substitute K for L. LR cost rises less than SR cost (K fixed in SR).' },
    { term: 'Expansion path', def: 'Curve joining cost-minimizing bundles as output grows.' },
    { term: 'Economies / diseconomies of scale', def: 'LRATC falls (IRTS) / rises (DRTS) as output grows. CRTS: LRATC constant.' },
    { term: 'Minimum efficient scale', def: 'Output where LRATC is lowest; LRMC crosses LRATC there.' },
    { term: 'LRATC envelope', def: 'Lowest SRATC for each output across factory sizes. SRATC ≥ LRATC, equal only if the factory suits actual output.' },
    { term: 'Technological progress', def: 'Fewer inputs per unit, so LRATC shifts down (Amazon\'s robots).' },
  ];

  const sheet = [
    { h: 'Profit & costs', f: 'Economic profit = accounting profit − implicit costs', p: 'Economic cost = explicit + implicit.' },
    { h: 'Rental price of capital', f: 'R = depreciation + interest forgone', p: 'Per day = R ÷ 365.' },
    { h: 'SR cost identities', f: `TC = VC + FC · ATC = AVC + AFC · MC = ${F('ΔTC', 'Δq')}`, p: 'TC = ATC × q.' },
    { h: 'Productivity → cost', f: `MC = ${F('W', 'MPL')}`, p: 'Constant MPL → MC = AVC constant.' },
    { h: 'MC vs averages', f: 'MC < ATC → ATC ↓ · MC > ATC → ATC ↑', p: 'MC cuts AVC and ATC at their minimums.' },
    { h: 'Isocost', f: 'W·L + R·K = C · slope W/R', p: 'Intercepts C/W (L) and C/R (K).' },
    { h: 'Cost minimization', f: `MRTS = ${F('W', 'R')} ⇔ ${F('MPL', 'W')} = ${F('MPK', 'R')}`, p: 'MRTS > W/R: more L. MRTS < W/R: more K.' },
    { h: 'Scale & LRATC', f: 'IRTS → LRATC ↓ · CRTS → flat · DRTS → LRATC ↑', p: 'U-shaped LRATC; bottom = minimum efficient scale.' },
    { h: 'SR vs LR', f: 'SRATC ≥ LRATC', p: 'Equal only when the factory fits actual output.' },
  ];

  Study.registerChapter({
    id: 'ch7', number: 7, title: 'The Cost of Production',
    blurb: 'Economic vs accounting cost, short-run cost curves, cost minimization with isocost lines, and long-run average cost.',
    intro: 'From production to costs: what counts as a cost, how labour productivity shapes short-run cost curves, how firms pick the cheapest input mix, and how scale shapes long-run average cost. Parts 1 and 2 of the lecture are combined here.',
    sections: [
      { id: 's71', num: '7.1', title: 'Measuring Cost', html: s71, takeaways: ['Economic profit = accounting profit − implicit costs; use economic profit for decisions.', 'R = depreciation + interest forgone.', 'SR has fixed cost; LR has none.'] },
      { id: 's72', num: '7.2', title: 'Short-Run Cost', html: s72, takeaways: ['MC = W/MPL: diminishing MPL makes MC rise.', 'AVC and ATC are U-shaped; MC cuts both at their minimums.', 'AFC always falls; ATC > AVC.'] },
      { id: 's73', num: '7.3', title: 'Long-Run Cost', html: s73, takeaways: ['Cost is minimized where MRTS = W/R (MPL/W = MPK/R).', 'Higher wages → substitute K for L.', 'IRTS then DRTS gives a U-shaped LRATC; minimum = MES.', 'SRATC ≥ LRATC.'] },
    ],
    practice, quiz, cards, sheet,
  });
})();
