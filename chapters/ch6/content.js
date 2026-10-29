/* Chapter 6 · Production. Follows the Chapter 6 lecture slides. */
(function () {
  const F = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;

  const s61 = `
    <p>Chapters 6–8 study the firm. Chapter 6 is about <b>technology</b>: how inputs become output. Chapter 7 turns that into costs, and Chapter 8 uses costs to choose the profit-maximizing quantity (Profit = TR − TC).</p>
    <div class="callout def"><span class="tag">Definition</span><p>A <b>production function</b> gives the most output a firm can make from given inputs with current technology: <span class="mono">q = F(L, K)</span>. Labour (L) and capital (K) are the two inputs every firm needs, and one can substitute for the other.</p></div>
    <p>Examples: q = L²K², q = √(LK) = L<sup>½</sup>K<sup>½</sup>, q = 2LK. With L = 4 and K = 1, q = L²K² gives 4² × 1² = 16 units.</p>
    <div class="table-wrap"><table><thead><tr><th></th><th>Long run (planning phase)</th><th>Short run (production phase)</th></tr></thead><tbody>
      <tr><td>Inputs</td><td>All inputs can be chosen, including the size of K</td><td>At least one input is fixed, usually K</td></tr>
      <tr><td>To change output</td><td>Change L and K</td><td>Change L only</td></tr>
    </tbody></table></div>
    <p class="muted">How long is the short run? Until the firm changes its capital. Like a phone: you're in a short run until you upgrade.</p>
  `;

  const s62 = `
    <p>In the short run K is fixed, so the SR production function depends on L only. With K = 1: q = L²K² becomes <b>q = L²</b>; q = √(LK) becomes <b>q = √L</b>; q = 2LK becomes <b>q = 2L</b>. (With K = 2 they become 4L², √(2L) and 4L.)</p>
    <div class="cards3">
      <div class="mini"><h4>Marginal product of labour</h4><p>MPL = ${F('Δq', 'ΔL')}: extra output from one more unit of labour.</p></div>
      <div class="mini"><h4>Average product of labour</h4><p>APL = ${F('q', 'L')}: output per worker.</p></div>
      <div class="mini"><h4>Marginal vs average</h4><p>MPL &gt; APL → APL rises. MPL = APL → APL constant. MPL &lt; APL → APL falls.</p></div>
    </div>
    <div class="table-wrap"><table><thead><tr><th>MPL</th><th>Output</th><th>Example</th><th>Why</th></tr></thead><tbody>
      <tr><td>Increasing</td><td>Rises at an increasing rate</td><td>q = L²: MPL = 1, 3, 5, 7</td><td>Division of labour</td></tr>
      <tr><td>Diminishing</td><td>Rises at a decreasing rate</td><td>q = √L</td><td>K is fixed, so workers crowd it</td></tr>
      <tr><td>Constant</td><td>Rises at a constant rate</td><td>q = 2L: MPL = APL = 2</td><td>—</td></tr>
    </tbody></table></div>
    <div data-widget="tpCurve" data-preset="table"></div>
    <div class="callout key"><span class="tag">Key fact</span><p><b>Diminishing MPL eventually happens in the short run</b> because K is fixed. A kitchen of fixed size can't keep getting more productive as you add chefs. This drives the shape of short-run costs in Chapter 7.</p></div>
    <p class="muted">GPA analogy for marginal vs average: if your GPA over 4 courses is 3.0, a 4.0 in the 5th course raises it, a 2.0 lowers it, and a 3.0 leaves it unchanged. Application: health care spending has diminishing returns. Each extra $10,000 per person adds fewer years of life expectancy, and medical technology shifts the whole curve up over time.</p>
  `;

  const s63 = `
    <p>In the long run K can vary too, so the firm can substitute between L and K to make the same output. The tools mirror consumer theory:</p>
    <div class="table-wrap"><table><thead><tr><th>Production (Ch 6)</th><th>Consumers (Ch 3)</th></tr></thead><tbody>
      <tr><td>Inputs L and K</td><td>Goods X and Y</td></tr>
      <tr><td>Production function</td><td>Utility function</td></tr>
      <tr><td>Isoquant</td><td>Indifference curve</td></tr>
      <tr><td>MPL, MPK diminishing</td><td>MU<sub>X</sub>, MU<sub>Y</sub> diminishing</td></tr>
      <tr><td>MRTS of L for K = MPL/MPK</td><td>MRS of X for Y = MU<sub>X</sub>/MU<sub>Y</sub></td></tr>
      <tr><td>Labour-intensive good: steep isoquants</td><td>Strong preference for X: steep ICs</td></tr>
    </tbody></table></div>
    <div class="callout def"><span class="tag">Definitions</span>
      <p>An <b>isoquant</b> shows all combinations of (L, K) that produce the same output. Farther from the origin means more output. L goes on the horizontal axis.</p>
      <p><b>MPK</b> = ${F('Δq', 'ΔK')}, holding L fixed. With q = √(LK) and L = 4: MPK = 2, 0.83, 0.64, 0.54, 0.47 as K goes 1 → 5. It diminishes.</p>
      <div class="eq"><span class="lbl">MRTS of L for K</span> = units of K given up for one more L, output constant = −${F('ΔK', 'ΔL')} = ${F('MPL', 'MPK')} = slope of the isoquant</div>
    </div>
    <p><b>Diminishing marginal products imply diminishing MRTS</b>, so isoquants are convex: L and K are imperfect substitutes (Cobb–Douglas). At A (low L, high K): MPL = 4, MPK = 1, so MRTS = 4. At B (high L, low K): MPL = 2, MPK = 2, so MRTS = 1.</p>
    <p>Calculating MRTS from bundles on the q = 5 isoquant of q = √(LK) (K = 25/L): going from L = 1 to 2, K falls from 25 to 12.5, so MRTS ≈ 12.5; from L = 2 to 3, MRTS ≈ 4.17; from 3 to 4, ≈ 2.08; from 4 to 5, 1.25. It keeps diminishing.</p>
    <div data-widget="isoquantLab"></div>
    <div class="cards3">
      <div class="mini"><h4>Labour-intensive (clothing)</h4><p>q = L<sup>¾</sup>K<sup>¼</sup>: MPL high relative to MPK, large MRTS, steep isoquants.</p></div>
      <div class="mini"><h4>Capital-intensive (cars)</h4><p>q = L<sup>¼</sup>K<sup>¾</sup>: MPL low relative to MPK, small MRTS, flat isoquants.</p></div>
      <div class="mini"><h4>Special cases</h4><p>Perfect substitutes (1 TB vs 10 TB drives, MRTS = 10): straight lines. Perfect complements (cereal bags and boxes): L-shapes.</p></div>
    </div>
  `;

  const s64 = `
    <p><b>Returns to scale</b>: how much output rises when <b>all</b> inputs rise in the same proportion. Test: double every input and compare output.</p>
    <div class="table-wrap"><table><thead><tr><th></th><th>Double all inputs →</th><th>Why / example</th></tr></thead><tbody>
      <tr><td><b>CRTS</b> constant</td><td>Output exactly doubles</td><td>The firm replicates what it was doing (growing oranges)</td></tr>
      <tr><td><b>IRTS</b> increasing</td><td>Output more than doubles</td><td>Fixed inputs such as R&amp;D and assembly-line design (new iPhone)</td></tr>
      <tr><td><b>DRTS</b> decreasing</td><td>Output less than doubles</td><td>Coordinating large teams; regulatory burden grows faster than the firm</td></tr>
    </tbody></table></div>
    <p>Lecture example, q = L<sup>¼</sup>K<sup>¼</sup>: (5, 5) → q = 2.236. (10, 10) → q = 3.16, less than double. The firm needs (20, 20), four times the inputs, to reach 4.472 = 2 × 2.236. That's DRTS.</p>
    <div data-widget="returnsScale"></div>
    <div class="callout key"><span class="tag">Shortcut</span><p>For q = L<sup>a</sup>K<sup>b</sup>: a + b = 1 → CRTS, a + b &gt; 1 → IRTS, a + b &lt; 1 → DRTS. Doubling inputs multiplies output by 2<sup>a+b</sup>.</p></div>
  `;

  const s65 = `
    <p>Write the production function as <b>q = A·L<sup>α</sup>K<sup>1−α</sup></b>. Technology enters in two ways:</p>
    <ul>
      <li><b>Capital-intensive methods</b> (robots): α falls, MRTS falls, isoquants get flatter. Amazon went from q = 5L<sup>0.5</sup>K<sup>0.5</sup> to q = 5L<sup>0.4</sup>K<sup>0.6</sup>.</li>
      <li><b>Productivity</b>: A rises. With A = 10, the same inputs (2, 2) make 20 units instead of 10, or (1, 1) is enough to make 10. Amazon's costs fell by an estimated 48%.</li>
    </ul>
    <div data-widget="techChange"></div>
    <p class="muted">Optional link to macro: Y = A·L<sup>⅔</sup>K<sup>⅓</sup> becomes y = A·k<sup>⅓</sup> per worker. More capital per worker raises output per worker, but with diminishing returns, so long-run growth needs continual increases in A (technological progress).</p>
  `;

  const practice = [
    {
      source: 'Worksheet 1', title: 'MPL and APL from Table 6.1', short: 'MPL & APL',
      prompt: '<p>K is fixed at 10. Output for L = 0…10 workers is 0, 10, 30, 60, 80, 95, 108, 112, 112, 108, 100.</p>',
      widget: '<div data-widget="tpCurve" data-preset="table"></div>',
      parts: [
        { l: 'a', q: 'Calculate MPL for each worker.', a: '<p>10, 20, 30, 20, 15, 13, 4, 0, −4, −8. MPL rises for the first 3 workers (division of labour), then diminishes because K is fixed.</p>' },
        { l: 'b', q: 'Calculate APL.', a: '<p>10, 15, 20, 20, 19, 18, 16, 14, 12, 10.</p>' },
        { l: 'c', q: 'Explain what happens to APL when MPL > APL, and when MPL < APL.', a: '<p>Worker 3: MPL = 30 &gt; previous APL = 15, so APL rises to 20. Worker 5: MPL = 15 &lt; APL = 20, so APL falls to 19. Worker 4: MPL = 20 = APL, so APL stays at 20.</p>' },
      ],
    },
    {
      source: 'Worksheet 2', title: 'MRTS on the q = 5 isoquant', short: 'MRTS',
      prompt: '<p>q = √(LK) = 5, so bundles on the isoquant satisfy K = 25/L.</p>',
      parts: [
        { l: 'a', q: 'Find MRTS of L for K as L goes from 1 to 2, 2 to 3, and 3 to 4.', a: '<p>−ΔK/ΔL: 25 − 12.5 = <b>12.5</b>; 12.5 − 8.33 = <b>4.17</b>; 8.33 − 6.25 = <b>2.08</b>.</p>' },
        { l: 'b', q: 'What does the pattern tell you?', a: '<p>MRTS is <b>diminishing</b>: as the firm uses more L and less K, each worker replaces less capital (MPL falls, MPK rises). The isoquant is convex; L and K are imperfect substitutes.</p>' },
        { l: 'c', q: 'At bundle A, MPL = 4 and MPK = 1. At B, MPL = 2 and MPK = 2. Find MRTS at each.', a: '<p>A: 4/1 = <b>4</b> (steep). B: 2/2 = <b>1</b> (flatter).</p>' },
      ],
    },
    {
      source: 'Worksheet 3', title: 'Returns to scale', short: 'Returns to scale',
      prompt: '<p>Decide the returns to scale by doubling all inputs.</p>',
      widget: '<div data-widget="returnsScale"></div>',
      parts: [
        { l: 'a', q: 'q = L<sup>¼</sup>K<sup>¼</sup>, starting at (5, 5).', a: '<p>q(5,5) = 2.236, q(10,10) = 3.162 &lt; 4.472. <b>DRTS</b>. The firm needs (20, 20) to double output.</p>' },
        { l: 'b', q: 'q = √(LK).', a: '<p>√(2L·2K) = 2√(LK): exactly doubles, <b>CRTS</b>.</p>' },
        { l: 'c', q: 'q = 2LK.', a: '<p>2(2L)(2K) = 4 × 2LK: output quadruples, <b>IRTS</b>.</p>' },
      ],
    },
    {
      source: 'Lecture example', title: 'Amazon and robots', short: 'Tech change',
      prompt: '<p>Before robots: q = 5L<sup>0.5</sup>K<sup>0.5</sup> with (L, K) = (2, 2).</p>',
      widget: '<div data-widget="techChange"></div>',
      parts: [
        { l: 'a', q: 'Output before robots?', a: '<p>5 × 2<sup>0.5</sup> × 2<sup>0.5</sup> = 5 × 2 = <b>10</b>.</p>' },
        { l: 'b', q: 'After robots, q = 5L<sup>0.4</sup>K<sup>0.6</sup>. What changes?', a: '<p>Output at (2, 2) is still 10, but production is more capital-intensive: MRTS falls (0.4/0.6 × K/L) and the isoquant gets flatter.</p>' },
        { l: 'c', q: 'Then A rises to 10. Effect?', a: '<p>(2, 2) now makes <b>20</b> units, or only (1, 1) is needed for 10. Higher productivity means fewer inputs per unit and lower costs.</p>' },
      ],
    },
  ];

  const quiz = [
    { q: 'In the short run…', options: ['All inputs are variable', 'Capital is fixed and labour is variable', 'Labour is fixed', 'Technology is fixed but inputs are not'], answer: 1, why: 'The SR is the production phase: at least one input (usually K) is fixed, so the firm changes output with L.' },
    { q: 'q = L²K². If K = 1 and L goes from 2 to 3, MPL is…', options: ['3', '5', '9', '1'], answer: 1, why: 'q goes 4 → 9, so MPL = 5. MPL is increasing (1, 3, 5, 7…).' },
    { q: 'If MPL > APL, then as L rises…', options: ['APL falls', 'APL rises', 'APL is constant', 'Output falls'], answer: 1, why: 'A marginal above the average pulls the average up (like a high grade raising your GPA).' },
    { q: 'Why does diminishing MPL eventually happen in the short run?', options: ['Workers get lazy', 'Capital is fixed, so extra workers have less K each', 'Wages rise', 'Technology falls'], answer: 1, why: 'With a fixed kitchen or factory, extra workers eventually crowd the fixed capital.' },
    { q: 'q = 2L. APL is…', options: ['Rising', 'Falling', 'Equal to MPL = 2', 'Zero'], answer: 2, why: 'Constant MPL: every worker adds 2, so q/L = 2 too.' },
    { q: 'An isoquant shows…', options: ['Combinations of L and K with the same cost', 'Combinations of L and K producing the same output', 'Output at each wage', 'Output as labour varies with K fixed'], answer: 1, why: 'Iso-quant = same quantity. (Same cost is an isocost line, Ch 7.)' },
    { q: 'MPL = 6 and MPK = 2. MRTS of L for K is…', options: ['1/3', '3', '4', '12'], answer: 1, why: 'MRTS = MPL/MPK = 6/2 = 3: one more worker replaces 3 units of capital.' },
    { q: 'Diminishing MRTS means isoquants are…', options: ['Straight lines', 'L-shaped', 'Convex to the origin', 'Upward sloping'], answer: 2, why: 'As L replaces K, each extra worker replaces less K, so the isoquant flattens: convex.' },
    { q: 'Compared with car production (capital-intensive), clothing production (labour-intensive) has…', options: ['Flatter isoquants and a smaller MRTS', 'Steeper isoquants and a larger MRTS', 'L-shaped isoquants', 'The same MRTS'], answer: 1, why: 'Labour is productive relative to capital, so MPL/MPK is large and isoquants are steep.' },
    { q: 'A 10 TB drive always replaces ten 1 TB drives. Isoquants are…', options: ['Straight lines (MRTS = 10)', 'L-shaped', 'Convex', 'Vertical'], answer: 0, why: 'Perfect substitutes: constant MRTS, straight-line isoquants.' },
    { q: 'q = L<sup>¼</sup>K<sup>¼</sup>. Doubling both inputs…', options: ['Doubles output: CRTS', 'More than doubles output: IRTS', 'Less than doubles output: DRTS', 'Leaves output unchanged'], answer: 2, why: 'Output is multiplied by 2<sup>0.5</sup> ≈ 1.41 < 2. Exponents sum to 0.5 < 1.' },
    { q: 'Which is a reason for decreasing returns to scale?', options: ['Division of labour', 'Fixed R&D spending', 'Coordination problems in very large firms', 'Replicating plants'], answer: 2, why: 'Managing and coordinating very large teams, and growing regulatory burden, mean output rises less than inputs.' },
    { q: 'q = 2LK has…', options: ['CRTS', 'IRTS', 'DRTS', 'Diminishing returns to scale only in the LR'], answer: 1, why: 'Doubling both: 2(2L)(2K) = 4·2LK, so output quadruples.' },
    { q: 'Amazon goes from q = 5L<sup>0.4</sup>K<sup>0.6</sup> to q = 10L<sup>0.4</sup>K<sup>0.6</sup>. At (2, 2) output goes from…', options: ['10 to 20', '10 to 10', '5 to 10', '20 to 40'], answer: 0, why: '5 × 2<sup>0.4</sup> × 2<sup>0.6</sup> = 5 × 2 = 10; with A = 10 it becomes 20.' },
    { q: 'Diminishing marginal returns to labour and decreasing returns to scale are…', options: ['The same thing', 'Different: one varies L only (SR), the other varies all inputs proportionally (LR)', 'Both about capital only', 'Both caused by technology'], answer: 1, why: 'Diminishing MPL holds K fixed; returns to scale scale every input together.' },
  ];

  const cards = [
    { term: 'Production function', def: 'q = F(L, K): maximum output from given inputs with current technology.' },
    { term: 'Short run vs long run', def: 'SR: at least one input (K) fixed, change output with L. LR: all inputs, including K, can vary.' },
    { term: 'MPL', def: 'Δq/ΔL: extra output from one more unit of labour, K fixed.' },
    { term: 'APL', def: 'q/L: output per worker.' },
    { term: 'MPL vs APL', def: 'MPL > APL → APL rises; MPL = APL → constant; MPL < APL → APL falls.' },
    { term: 'Diminishing MPL', def: 'Each extra worker adds less output. Eventually happens in the SR because K is fixed.' },
    { term: 'Isoquant', def: 'All (L, K) bundles producing the same output. Farther out = more output.' },
    { term: 'MPK', def: 'Δq/ΔK: extra output from one more unit of capital, L fixed.' },
    { term: 'MRTS of L for K', def: 'Units of K given up for one more L, output constant = −ΔK/ΔL = MPL/MPK = slope of the isoquant.' },
    { term: 'Diminishing MRTS', def: 'Follows from diminishing MPL and MPK; makes isoquants convex (imperfect substitutes).' },
    { term: 'Labour- vs capital-intensive', def: 'Labour-intensive (clothing): large MRTS, steep isoquants. Capital-intensive (cars): small MRTS, flat isoquants.' },
    { term: 'Perfect substitutes / complements (inputs)', def: 'Substitutes: constant MRTS, straight isoquants (hard drives). Complements: fixed proportions, L-shaped (cereal & boxes).' },
    { term: 'Returns to scale', def: 'How output changes when all inputs change proportionally. CRTS doubles, IRTS more than doubles, DRTS less than doubles.' },
    { term: 'Reasons for IRTS / DRTS', def: 'IRTS: fixed inputs like R&D/design. DRTS: coordination problems and regulatory burden in very large firms.' },
    { term: 'Technological change', def: 'q = A·L<sup>α</sup>K<sup>1−α</sup>. Higher A: more output from the same inputs. Lower α: more capital-intensive, flatter isoquants.' },
  ];

  const sheet = [
    { h: 'SR production', f: 'q = F(L, K̄)', p: 'K fixed; change output with L.' },
    { h: 'Marginal & average product', f: `MPL = ${F('Δq', 'ΔL')} · APL = ${F('q', 'L')}`, p: 'MPL > APL → APL ↑; MPL < APL → APL ↓.' },
    { h: 'MPL patterns', f: 'q = L² ↑ · q = √L ↓ · q = 2L constant', p: 'Diminishing MPL eventually because K is fixed.' },
    { h: 'MRTS of L for K', f: `−${F('ΔK', 'ΔL')} = ${F('MPL', 'MPK')} = slope of isoquant`, p: 'Diminishing MRTS → convex isoquants.' },
    { h: 'Cobb–Douglas q = L<sup>a</sup>K<sup>b</sup>', f: 'MPL = a·q/L · MPK = b·q/K · MRTS = (a/b)(K/L)', p: 'Larger a: labour-intensive, steeper isoquants.' },
    { h: 'Returns to scale', f: 'a + b = 1 CRTS · > 1 IRTS · < 1 DRTS', p: 'Doubling inputs multiplies output by 2<sup>a+b</sup>.' },
    { h: 'Technology', f: 'q = A·L<sup>α</sup>K<sup>1−α</sup>', p: 'A ↑: more output from same inputs. α ↓: more capital-intensive.' },
  ];

  Study.registerChapter({
    id: 'ch6', number: 6, title: 'Production',
    blurb: 'Production functions, MPL and APL in the short run, isoquants and MRTS, returns to scale, and technological change.',
    intro: 'How a firm turns labour and capital into output: the short run with fixed capital, the long run where inputs substitute for each other, returns to scale, and technology.',
    sections: [
      { id: 's61', num: '6.1', title: 'Production Functions', html: s61, takeaways: ['q = F(L, K). SR: K fixed. LR: everything variable.'] },
      { id: 's62', num: '6.2', title: 'Short-Run Production', html: s62, takeaways: ['MPL = Δq/ΔL, APL = q/L.', 'MPL > APL pulls APL up; MPL < APL pulls it down.', 'Diminishing MPL eventually happens because K is fixed.'] },
      { id: 's63', num: '6.3', title: 'Long-Run Production', html: s63, takeaways: ['Isoquants are like indifference curves; MRTS = MPL/MPK = slope.', 'Diminishing marginal products → diminishing MRTS → convex isoquants.', 'Labour-intensive goods: steep isoquants; capital-intensive: flat.'] },
      { id: 's64', num: '6.4', title: 'Returns to Scale', html: s64, takeaways: ['Double all inputs: output doubles (CRTS), more (IRTS), less (DRTS).'] },
      { id: 's65', num: '6.5', title: 'Technological Change', html: s65, takeaways: ['Higher A means more output from the same inputs and lower costs.'] },
    ],
    practice, quiz, cards, sheet,
  });
})();
