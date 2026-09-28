/* Chapter 3 · Consumer Behavior
   Content follows the lecture slides (Parts 1 & 2), Worksheet 4 and the Chapter 3 exercises.
   Interactive figures are placed with <div data-widget="name" data-...></div>; see widgets.js. */
(function () {
  const F = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const PX = 'P<sub>X</sub>', PY = 'P<sub>Y</sub>', MUX = 'MU<sub>X</sub>', MUY = 'MU<sub>Y</sub>';

  const s31 = `
    <p>Chapters 3 and 4 explain why individual and market demand curves slope down. Chapter 3 builds the tool: how a consumer chooses the <b>consumption bundle</b> (a combination of quantities of goods) that maximizes utility given a budget. Every "how much" decision depends on three things: <b>preferences</b>, <b>income</b>, and <b>prices</b>. This section covers preferences.</p>

    <h3>Three assumptions about preferences</h3>
    <div class="cards3">
      <div class="mini"><h4>Completeness &amp; rankability</h4><p>Offered bundles A and B, the consumer can say: prefer A, prefer B, or indifferent. Every pair can be ranked.</p></div>
      <div class="mini"><h4>Transitivity</h4><p>A ≻ B and B ≻ C means A ≻ C. The same holds for indifference: A ~ B and B ~ C means A ~ C.</p></div>
      <div class="mini"><h4>More is better</h4><p>More of a good raises satisfaction. In this course we ignore satiation.</p></div>
    </div>

    <h3>Deriving an indifference curve</h3>
    <p>Take B = (6 beers, 6 pizza slices). <b>More is better</b> rules out two zones at once: bundles to the northeast are better than B, bundles to the southwest are worse. So bundles that leave the consumer <i>equally</i> well off must sit to the northwest or southeast, such as A and C. Joining them gives an <b>indifference curve</b>: every bundle on it gives the same satisfaction.</p>
    <div data-widget="prefZones"></div>

    <h3>Five properties of indifference curves</h3>
    <ol class="props">
      <li><div><b>Usually downward sloping.</b> To stay equally happy, getting more X means giving up some Y. <span class="muted">(More is better.)</span></div></li>
      <li><div><b>One curve through every bundle.</b> Any bundle can be compared with others. A diagram of many curves is an <b>indifference map</b>. <span class="muted">(Completeness.)</span></div></li>
      <li><div><b>Farther from the origin means higher satisfaction.</b> <span class="muted">(More is better.)</span></div></li>
      <li><div><b>Curves can't cross for the same person.</b> If they did, more is better would be violated. <span class="muted">(More is better + transitivity.)</span></div></li>
      <li><div><b>Usually convex to the origin.</b> The more beer you have, the less another beer is worth, so you give up less pizza for it.</div></li>
    </ol>
    <div data-widget="icMap"></div>

    <h3>Marginal rate of substitution (MRS)</h3>
    <div class="callout def"><span class="tag">Definition</span>
      <p><b>MRS of X for Y</b> = units of Y a consumer is willing to give up to get one more unit of X, leaving them equally well off.</p>
      <div class="eq"><span class="lbl">MRS</span> = −${F('ΔY', 'ΔX')} = (value of the) slope of the indifference curve = ${F(MUX, MUY)}</div>
    </div>
    <p>If you like X and Y equally, MRS = 1. If X gives 3 times the satisfaction of Y, you give up 3 Y for 1 X, so MRS = 3. At a particular bundle, the MRS equals the slope of the <b>tangent line</b> there. The drop over one extra unit (the "rise") is a close approximation.</p>
    <div class="callout trap"><span class="tag">Exam trap</span>
      <p>The first good named is X (horizontal axis). "MRS of steaks for fish" = <b>fish pieces</b> given up for <b>one more steak</b>. Steak is X, fish is Y.</p>
    </div>
    <div data-widget="mrsSteps"></div>
    <p><b>Diminishing MRS</b> (3, then 2, then 1 as X rises) means the curve gets flatter, which makes it convex. Why? As you consume more X, one more unit of X is worth less to you, so you give up less Y for it.</p>

    <h3>Preferences set the steepness</h3>
    <p>MRS depends <b>only on preferences</b>, not on prices or income. At the same bundle M = (3, 6), a consumer with a stronger preference for X has a <b>larger MRS</b> and a <b>steeper indifference curve</b>. This lets us predict who spends more on X in Section 3.3.</p>
    <div class="table-wrap"><table><thead><tr><th>Consumer</th><th>Another beer at M gives…</th><th class="num">MRS of beer for pizza</th><th>Curve at M</th></tr></thead><tbody>
      <tr><td>Joe</td><td>3 times the satisfaction of a slice</td><td class="num">3</td><td>Steepest</td></tr>
      <tr><td>First consumer</td><td>2 times the satisfaction of a slice</td><td class="num">2</td><td>Middle</td></tr>
      <tr><td>Mary</td><td>The same satisfaction as a slice</td><td class="num">1</td><td>Flattest</td></tr>
    </tbody></table></div>
    <div data-widget="whoLikesX"></div>
    <p class="muted">Car-shopping version from lecture: a student with a larger MRS of horsepower for space has a steeper curve and picks the BMW (more horsepower). A student with a smaller MRS picks the Camry (more space).</p>

    <h3>Special cases</h3>
    <div class="cards3">
      <div class="mini"><h4>Imperfect substitutes</h4><p>MRS is <b>not constant</b>; it diminishes. Convex curves. Beer and pizza.</p></div>
      <div class="mini"><h4>Perfect substitutes</h4><p>MRS is <b>constant</b> (not necessarily 1). Straight downward lines. Coke &amp; Pepsi (1), loonies &amp; dimes (10).</p></div>
      <div class="mini"><h4>Perfect complements</h4><p>Always consumed in <b>fixed proportions</b>. L-shaped curves. Pasta &amp; sauce (2 : 1), left &amp; right shoes.</p></div>
    </div>
    <div data-widget="specialCases"></div>

    <h3>Utility functions and marginal utility</h3>
    <p>A <b>utility function</b> U(x, y) assigns a number (utils) to each bundle. It ranks bundles: A ≻ B means U(A) &gt; U(B), and A ~ C means U(A) = U(C). A common form is the <b>Cobb–Douglas</b> function U = x<sup>0.5</sup>y<sup>0.5</sup>. Bundles like (5, 5), (6, 25/6), (7, 25/7) and (8, 25/8) all give 5 utils, so they lie on one indifference curve.</p>
    <p><b>Marginal utility</b> of a good is the extra utility from one more unit of it, <b>holding the other good fixed</b>. It is usually <b>diminishing</b>.</p>
    <div class="table-wrap"><table><thead><tr><th>Bundle (x, y)</th><th class="num">U = x<sup>0.5</sup>y<sup>0.5</sup></th><th class="num">ΔU = ${MUX}</th></tr></thead><tbody>
      <tr><td>(5, 5)</td><td class="num">5</td><td class="num">–</td></tr>
      <tr><td>(6, 5)</td><td class="num">5.48</td><td class="num">0.48</td></tr>
      <tr><td>(7, 5)</td><td class="num">5.92</td><td class="num">0.44</td></tr>
      <tr><td>(8, 5)</td><td class="num">6.32</td><td class="num">0.40</td></tr>
    </tbody></table></div>
    <div data-widget="muExplorer"></div>

    <h3>Marginal utilities and the MRS</h3>
    <div class="eq"><span class="lbl">Key link</span> MRS of X for Y = ${F(MUX, MUY)}</div>
    <p>The ratio says how many times more satisfying one unit of X is than one unit of Y. In the steak (X) and fish (Y) example:</p>
    <div class="table-wrap"><table><thead><tr><th>Bundle</th><th class="num">${MUX} (another steak)</th><th class="num">${MUY} (a fish piece)</th><th class="num">MRS = ${MUX}/${MUY}</th></tr></thead><tbody>
      <tr><td>(2 steaks, 6 fish)</td><td class="num">6 utils</td><td class="num">2 utils</td><td class="num">3</td></tr>
      <tr><td>(3 steaks, 3 fish)</td><td class="num">3 utils ↓</td><td class="num">3 utils ↑</td><td class="num">1</td></tr>
    </tbody></table></div>
    <p>More steak lowers ${MUX}; less fish raises ${MUY}. So <b>diminishing marginal utilities imply a diminishing MRS and convex indifference curves.</b></p>
    <div class="callout key"><span class="tag">Application</span><p>Life satisfaction rises with income, but not linearly. A $10,000 raise adds a lot of utility at $30,000 and much less at $90,000. The marginal utility of income diminishes, which is one reason some high earners choose to work less.</p></div>
  `;

  const s32 = `
    <p>A budget limits how much of X and Y a consumer can buy. Assume the whole budget is spent on the two goods.</p>
    <div class="eq"><span class="lbl">Budget constraint</span> ${PX}·x + ${PY}·y = I</div>
    <p>Example: I = $24 on beers (X, $4) and pizza slices (Y, $2): <span class="mono">4x + 2y = 24</span>.</p>
    <div class="cards3">
      <div class="mini"><h4>Vertical intercept</h4><p>${F('I', PY)} = ${F('$24', '$2')} = 12 slices. Spend everything on Y.</p></div>
      <div class="mini"><h4>Horizontal intercept</h4><p>${F('I', PX)} = ${F('$24', '$4')} = 6 beers. Spend everything on X.</p></div>
      <div class="mini"><h4>Relative price of X</h4><p>${F(PX, PY)} = 2 = slope of the budget line. One beer costs 2 slices.</p></div>
    </div>
    <p>The <b>budget line</b> joins the two intercepts. Every bundle on it costs exactly $24. Its slope is the <b>relative price of X</b>: how much Y you must give up to buy one more X.</p>
    <div class="callout trap"><span class="tag">Keep these apart</span>
      <p>The <b>relative price of X</b> depends only on market prices. The <b>MRS</b> depends only on preferences. Always compute the relative price <i>of X</i> (${PX}/${PY}), since you will compare it with the MRS of X for Y.</p>
    </div>
    <div data-widget="budgetLab" data-preset="beer"></div>
    <h3>How the budget line moves</h3>
    <p>Recompute both intercepts, then join them. Starting from ${PX} = $4, ${PY} = $2, I = $24:</p>
    <div class="table-wrap"><table><thead><tr><th>Change</th><th>Relative price of X</th><th>X-intercept</th><th>Y-intercept</th><th>Budget line</th></tr></thead><tbody>
      <tr><td>${PX} ↑ to $6</td><td>Increase</td><td>6 → 4</td><td>No change</td><td>Pivots in at vertical intercept, steeper</td></tr>
      <tr><td>${PX} ↓ to $2</td><td>Decrease</td><td>6 → 12</td><td>No change</td><td>Pivots out at vertical intercept, flatter</td></tr>
      <tr><td>${PY} ↑ to $4</td><td>Decrease</td><td>No change</td><td>12 → 6</td><td>Pivots down at horizontal intercept, flatter</td></tr>
      <tr><td>${PY} ↓ to $1</td><td>Increase</td><td>No change</td><td>12 → 24</td><td>Pivots up at horizontal intercept, steeper</td></tr>
      <tr><td>I ↑ to $28</td><td>No change</td><td>6 → 7</td><td>12 → 14</td><td>Parallel shift right</td></tr>
      <tr><td>I ↓ to $20</td><td>No change</td><td>6 → 5</td><td>12 → 10</td><td>Parallel shift left</td></tr>
    </tbody></table></div>
    <p class="muted">Rule of thumb: ${PX} ↑ or ${PY} ↓ makes the line steeper; ${PX} ↓ or ${PY} ↑ makes it flatter. Income changes shift it without changing the slope. Scaling income and both prices by the same percentage leaves it unchanged.</p>
  `;

  const s33 = `
    <p>The consumer picks a bundle to <b>maximize U(x, y) subject to ${PX}x + ${PY}y = I</b>. Since the whole budget is spent, the choice is one of the bundles on the budget line. Which one gives the highest utility?</p>

    <h3>The tangency condition</h3>
    <p>The best bundle (for an <b>interior solution</b>) is where an indifference curve just touches the budget line. It is the farthest curve the consumer can reach while staying on budget. At that point the two slopes match:</p>
    <div class="eq"><span class="lbl">Relative price rule</span> MRS of X for Y = ${F(PX, PY)} &nbsp;⇔&nbsp; ${F(MUX, MUY)} = ${F(PX, PY)}</div>

    <h3>If you're not there yet: compare MRS with the relative price</h3>
    <div class="table-wrap"><table><thead><tr><th>Comparison</th><th>Meaning</th><th>Do this to raise utility</th></tr></thead><tbody>
      <tr><td><b>MRS &gt; ${PX}/${PY}</b></td><td>X gives good value. You would pay more Y for it than the market charges.</td><td>Buy <b>more X</b>, less Y</td></tr>
      <tr><td><b>MRS &lt; ${PX}/${PY}</b></td><td>X gives poor value. The market charges more Y than it's worth to you.</td><td>Buy <b>less X</b>, more Y</td></tr>
      <tr><td><b>MRS = ${PX}/${PY}</b></td><td>Tangency.</td><td>Stay. This is the optimum.</td></tr>
    </tbody></table></div>
    <p><b>Joe at M = (3, 6)</b>, with ${PX} = $4, ${PY} = $2: his MRS = 3 &gt; relative price = 2. Buying one more beer costs him 2 slices, but he would have given up 3 and felt the same. He comes out 1 slice ahead, so by more is better his utility rises. As he keeps substituting beer for pizza, ${MUX} falls and ${MUY} rises, so his MRS falls from 3 toward 2. He stops when MRS = 2.</p>
    <p><b>Mary at M</b>: MRS = 1 &lt; 2. Beer is poor value to her, so she buys fewer beers and more pizza. Same income, same prices, different choices: <b>preferences matter</b>.</p>
    <div data-widget="optimumLab" data-presets="joe,mary,mike,jane,kory,ex2" data-preset="joe"></div>
    <div class="callout key"><span class="tag">Exam recipe: interior solution</span>
      <ol>
        <li>Draw the budget line from its two intercepts.</li>
        <li>Use the given MRS to draw the initial indifference curve through the starting bundle. It cuts the budget line if MRS ≠ relative price.</li>
        <li>Shift the curve to the northeast until one is tangent to the budget line. The tangency point is the optimal bundle.</li>
        <li>Explain with the comparison: MRS vs ${PX}/${PY} tells you which direction to trade.</li>
      </ol>
    </div>

    <h3>Corner solutions</h3>
    <p>With a very strong preference for one good, the consumer spends the <b>entire budget on that good</b>, and the optimum sits at a corner (intercept) of the budget line. John (MRS = 5 at the given prices) buys only beer; Nancy (MRS = 0.2) buys only pizza. They'd like to keep substituting but have nothing left to give up.</p>
    <div class="callout trap"><span class="tag">Exam trap</span><p>A corner solution does <b>not</b> satisfy the tangency condition or the relative price rule. MRS ≠ ${PX}/${PY} at the optimum.</p></div>
    <p>Corners are typical with <b>perfect substitutes</b>. BC and Washington apples, MRS = 1, budget $2:</p>
    <div class="table-wrap"><table><thead><tr><th></th><th>Case 1</th><th>Case 2</th></tr></thead><tbody>
      <tr><td>Price of a BC apple</td><td class="num">$0.40</td><td class="num">$0.50</td></tr>
      <tr><td>Price of a Washington apple</td><td class="num">$0.40</td><td class="num">$0.40</td></tr>
      <tr><td>Relative price of BC apples</td><td class="num">1</td><td class="num">1.25</td></tr>
      <tr><td>Choice</td><td>Any bundle on the budget line</td><td>Only Washington apples (5)</td></tr>
    </tbody></table></div>
    <div class="callout key"><span class="tag">Drawing tip: perfect substitutes</span>
      <ol><li>Draw the first straight indifference curve near the origin using the MRS.</li><li>Draw parallel curves through the vertical and horizontal intercepts of the budget line.</li><li>Whichever intercept has the curve farther from the origin is the optimum. If the curve lies on the budget line, any bundle on it is optimal.</li></ol>
    </div>
    <div data-widget="cornerLab" data-presets="apples1,apples2,john,nancy,jen,jenE,jenF"></div>
  `;

  const s34 = `
    <p>Rewrite the relative price rule by rearranging:</p>
    <div class="eq">${F(MUX, MUY)} = ${F(PX, PY)} &nbsp;⇔&nbsp; <b>${F(MUX, PX)} = ${F(MUY, PY)}</b></div>
    <p>This is <b>equating the bangs for the buck</b>: the extra utility from the last dollar spent on each good is the same. If ${MUX}/${PX} &gt; ${MUY}/${PY}, a dollar spent on X does more than a dollar on Y, so the consumer shifts spending toward X until the two are equal.</p>
    <p>It extends to any number of goods:</p>
    <div class="eq"><span class="lbl">n goods</span> ${F('MU<sub>1</sub>', 'P<sub>1</sub>')} = ${F('MU<sub>2</sub>', 'P<sub>2</sub>')} = ⋯ = ${F('MU<sub>n</sub>', 'P<sub>n</sub>')}</div>
    <div data-widget="bangForBuck"></div>
    <p class="muted">Per the lecture, textbook Sections 3.4 and 3.6 are skipped.</p>
  `;

  const practice = [
    {
      source: 'Worksheet 3', title: 'Budget line changes', short: 'Worksheet 3',
      prompt: `<p>Initial values: P<sub>X</sub> = $4, P<sub>Y</sub> = $2, I = $24. For each change, decide what happens to the relative price of X, the two intercepts, and the budget line.</p>`,
      widget: '<div data-widget="blTable"></div>',
    },
    {
      source: 'Exercise 1', title: 'Entertainment and groceries', short: 'Ex. 1 · Budget',
      prompt: `<p>A consumer has $200 to spend on entertainment (E) and bags of groceries (G). Entertainment costs $40 and groceries $20.</p>`,
      widget: '<div data-widget="budgetLab" data-preset="ex1"></div>',
      parts: [
        { l: 'a', q: 'Write the budget constraint.', a: '<p><span class="mono">40E + 20G = 200</span></p>' },
        { l: 'b', q: 'Graph the budget line.', a: '<p>With entertainment on the horizontal axis: E-intercept = 200/40 = <b>5</b>, G-intercept = 200/20 = <b>10</b>. Join them. Slope (relative price of E) = 40/20 = 2.</p>' },
        { l: 'c', q: 'The price of groceries rises to $25. Graph the new budget line.', a: '<p>G-intercept falls to 200/25 = <b>8</b>; E-intercept stays at 5. The line pivots <b>down around the horizontal intercept</b> and becomes flatter (relative price of E falls to 40/25 = 1.6).</p>' },
        { l: 'd', q: 'Starting from the original line, income rises to $320.', a: '<p>Intercepts become 320/40 = <b>8</b> and 320/20 = <b>16</b>. A <b>parallel shift out</b>; slope stays 2.</p>' },
      ],
    },
    {
      source: 'Worksheet 4', title: 'Mike\'s baseball cards', short: 'Worksheet 4 · Mike',
      prompt: `<p>Mike has 4 Cal Ripken and 2 Nolan Ryan cards. Cal cards sell for $24 and Nolan cards for $12. At his current holding, Mike is willing to exchange 1 Cal card for 1 Nolan card. He treats the cards as imperfect substitutes. (Cal = X, Nolan = Y.)</p>`,
      widget: '<div data-widget="optimumLab" data-presets="mike" data-preset="mike"></div>',
      parts: [
        { l: 'a', q: 'What is Mike\'s MRS of Cal Ripken cards for Nolan Ryan cards?', a: '<p><b>MRS = 1.</b> He gives up 1 Nolan card for 1 more Cal card and feels equally well off.</p>' },
        { l: 'b', q: 'Calculate the relative price of a Cal Ripken card.', a: '<p>P<sub>Cal</sub>/P<sub>Nolan</sub> = $24/$12 = <b>2</b>. One Cal card trades for 2 Nolan cards in the market.</p>' },
        { l: 'c', q: 'Compare the MRS with the relative price to explain how Mike trades to make himself better off.', a: '<p>MRS = 1 &lt; relative price = 2. A Cal card is worth only 1 Nolan card to Mike, but the market will give him 2 Nolan cards for it. Cal cards are relatively expensive for him, so he should <b>sell Cal cards and buy Nolan cards</b>. Selling one Cal card and buying two Nolan cards leaves him 1 Nolan card ahead of what he needs to feel equally well off, so by more is better his utility rises.</p>' },
        { l: 'd', q: 'After trading, Mike no longer wants to make any trades. What is his MRS now?', a: '<p>At his optimum, MRS = relative price, so <b>MRS = 2</b>. (Selling Cal raised his MU<sub>Cal</sub>; buying Nolan lowered MU<sub>Nolan</sub>; the MRS rose from 1 to 2.)</p>' },
        { l: 'e', q: 'Calculate his budget from his initial holding, and draw the budget line and indifference curves.', a: '<p>Budget = $24 × 4 + $12 × 2 = <b>$120</b>. Intercepts: 120/24 = <b>5 Cal cards</b>, 120/12 = <b>10 Nolan cards</b>. His initial curve through (4, 2) has slope 1, flatter than the budget line (slope 2), so it cuts the line. The optimum is up and to the left on the line: fewer Cal cards, more Nolan cards, where a higher curve is tangent. Use <b>Walk to the optimum</b> above to see it.</p>' },
      ],
    },
    {
      source: 'Exercise 2', title: 'Movies and concerts', short: 'Ex. 2 · Tangency',
      prompt: `<p>The consumer's optimum is 8 movie tickets (X) and 3 concert tickets (Y). The budget line runs from 7 concert tickets to 14 movie tickets, and an indifference curve is tangent at (8, 3).</p>`,
      widget: '<div data-widget="optimumLab" data-presets="ex2" data-preset="ex2"></div>',
      parts: [
        { l: 'a', q: 'What is the MRS at 3 concert tickets and 8 movie tickets?', a: `<p>(8, 3) is the tangency point, so MRS = relative price of movie tickets = slope of the budget line = rise/run = 7/14 = <b>1/2</b>.</p>` },
        { l: 'b', q: 'Income falls 10% and both prices fall 10%. What does the consumer buy?', a: `<p>The <b>same bundle</b>, (8, 3). Suppose P<sub>movie</sub> = $20 and P<sub>concert</sub> = $40, so I = 20·8 + 40·3 = $280. After the cuts: I = $252, prices $18 and $36. Intercepts: 252/18 = 14 and 252/36 = 7, unchanged. In general, (0.9P<sub>X</sub>)x + (0.9P<sub>Y</sub>)y = 0.9I divides back to the original constraint.</p>` },
        { l: 'c', q: 'The price of movie tickets doubles. What is the MRS at the new optimum?', a: `<p>The relative price of movie tickets doubles from 1/2 to <b>1</b> ($40/$40). At the new interior optimum MRS = relative price, so <b>MRS = 1</b>. The X-intercept falls to 280/40 = 7. Try it: set P<sub>X</sub> to $40 in the graph above.</p>` },
      ],
    },
    {
      source: 'Exercise 3', title: 'Kory: CDs and hot chocolate', short: 'Ex. 3 · Kory',
      prompt: `<p>Kory has $50 to spend on CDs ($10 each) and cups of hot chocolate ($2 each). Both are normal goods. Decide whether each bundle is optimal; if not, what should she do? (CD = X, hot chocolate = Y.)</p>`,
      widget: '<div data-widget="optimumLab" data-presets="kory" data-preset="kory"></div>',
      parts: [
        { l: 'a', q: '4 CDs and 5 cups of hot chocolate, with MRS of CDs for hot chocolate = 1.', a: '<p>Not optimal. MRS = 1 &lt; relative price of a CD = $10/$2 = 5. At this bundle a CD and a cup give her equal satisfaction, yet a CD costs five times as much. CDs are poor value, so she should <b>buy fewer CDs and more hot chocolate</b>.</p>' },
        { l: 'b', q: '2 CDs and 15 cups; MU of the 2nd CD = 25 utils, MU of the 15th cup = 5 utils.', a: '<p><b>Optimal.</b> It costs $10·2 + $2·15 = $50, so it is on her budget line. MRS = MU<sub>CD</sub>/MU<sub>HC</sub> = 25/5 = 5 = relative price of a CD. Equivalently, 25/$10 = 5/$2 = 2.5 utils per dollar.</p>' },
        { l: 'c', q: '1 CD and 10 cups, with MRS = 5.', a: '<p>Not optimal. It costs only $30, so $20 is left over. Although MRS = relative price, the bundle is <b>inside</b> the budget line. Since both goods are normal, she should buy more of both until she is on the line with MRS = 5.</p>' },
      ],
    },
    {
      source: 'Exercise 4', title: 'Jane: hamburgers and milkshakes', short: 'Ex. 4 · Jane',
      prompt: `<p>Jane treats hamburgers (X) and milkshakes (Y) as imperfect substitutes. At her current bundle of 3 burgers and 3 shakes, her MRS of hamburgers for milkshakes is 1. A milkshake costs $1 and a hamburger $3.</p>`,
      widget: '<div data-widget="optimumLab" data-presets="jane" data-preset="jane"></div>',
      parts: [
        { l: 'a', q: 'Compare her MRS with the relative price. What should she do?', a: '<p>MRS = 1 &lt; relative price of a hamburger = 3. Burgers are expensive for her, so she should <b>substitute milkshakes for hamburgers</b>: fewer burgers, more shakes.</p>' },
        { l: 'b', q: 'Find her income and draw her budget line and indifference curves.', a: '<p>Income = $3·3 + $1·3 = <b>$12</b>. Intercepts: 4 burgers, 12 shakes. Her initial curve through (3, 3) has slope 1, flatter than the budget line (slope 3), so it cuts the line. It also passes through (4, 2). The optimum has fewer burgers and more shakes, where a higher curve U<sub>1</sub> is tangent. This is the same picture as Mary\'s in lecture.</p>' },
        { l: 'c', q: 'Starting from her optimum, her income falls. What happens?', a: '<p>The budget line <b>shifts in, parallel</b>. Her old optimum is now outside the line and unaffordable, so it is no longer optimal. Try lowering Income above.</p>' },
        { l: 'd', q: 'Starting from her optimum, the price of a milkshake falls.', a: '<p>The budget line <b>pivots up around the horizontal intercept</b> (it gets steeper). Her old optimum is now <b>inside</b> the new line, with money left over, so it is no longer optimal. With normal goods she buys more of both. Try lowering P<sub>Y</sub> above.</p>' },
      ],
    },
    {
      source: 'Exercise 5', title: 'Donna: Coke and Pepsi', short: 'Ex. 5 · Donna',
      prompt: `<p>Donna can't tell Coke from Pepsi. She has $6 to spend on cola. Coke (X) costs $1.50 and Pepsi (Y) $1.</p>`,
      widget: '<div data-widget="cornerLab" data-presets="donna,donnaD" data-preset="donna"></div>',
      parts: [
        { l: 'a', q: 'What is Donna\'s MRS of Coke for Pepsi?', a: '<p><b>1</b>. They are perfect substitutes that she likes equally.</p>' },
        { l: 'b', q: 'Draw her budget line.', a: '<p>Coke-intercept = 6/1.5 = <b>4</b>; Pepsi-intercept = 6/1 = <b>6</b>.</p>' },
        { l: 'c', q: 'What is her optimal bundle?', a: '<p><b>6 Pepsi, 0 Coke</b>, a corner solution. MRS = 1 &lt; relative price of Coke = 1.5. She likes both equally but Pepsi is cheaper, so she substitutes Pepsi for Coke until she reaches the Pepsi intercept.</p>' },
        { l: 'd', q: 'If both cost $1, what does she buy?', a: '<p>MRS = 1 = relative price. Her indifference curve lies on top of the budget line, so <b>any combination</b> costing $6 is optimal: (6, 0), (3, 3), (0, 6), and so on.</p>' },
      ],
    },
    {
      source: 'Lecture practice', title: 'Jennifer\'s cookies (corner solution)', short: 'Jennifer · Corners',
      prompt: `<p>Jennifer is always willing to give up two peanut butter cookies (Y) for one chocolate chip cookie (X). Both cost $1 and she spends $10 a week on cookies.</p>`,
      widget: '<div data-widget="cornerLab" data-presets="jen,jenE,jenF" data-preset="jen"></div>',
      parts: [
        { l: 'a', q: 'Draw her budget line.', a: '<p>Intercepts at 10 chocolate chip and 10 peanut butter cookies; slope 1.</p>' },
        { l: 'b', q: 'What is her MRS of chocolate chip cookies for peanut butter cookies?', a: '<p><b>MRS = 2</b>, constant: they are perfect substitutes for her.</p>' },
        { l: 'c–d', q: 'Show and explain her optimal bundle.', a: '<p>MRS = 2 &gt; relative price of chocolate chip = 1. Chocolate chip cookies are a bargain for her, so she spends the whole $10 on them: <b>10 chocolate chip, 0 peanut butter</b>.</p>' },
        { l: 'e', q: 'A chocolate chip cookie now costs $2.', a: '<p>MRS = 2 = relative price. An indifference curve lies on the budget line, so <b>any bundle on the line</b> is optimal.</p>' },
        { l: 'f', q: 'A chocolate chip cookie costs $2.50.', a: '<p>MRS = 2 &lt; 2.5. Chocolate chip is now too expensive for her, so she spends all $10 on <b>peanut butter cookies (10)</b>.</p>' },
      ],
    },
  ];

  const quiz = [
    { q: '“The MRS of steaks for fish is 3” means…', options: ['The consumer would give up 3 fish pieces for one more steak and feel equally well off', 'The consumer would give up 3 steaks for one more fish piece', 'A steak costs 3 times as much as a fish piece', 'One steak gives 3 utils'], answer: 0, why: 'MRS of X for Y = units of Y given up for one more X. Steak is named first, so steak is X and fish is Y.' },
    { q: 'P<sub>X</sub> = $4, P<sub>Y</sub> = $2, I = $24. What is the relative price of X?', options: ['0.5', '2', '6', '12'], answer: 1, why: 'Relative price of X = P<sub>X</sub>/P<sub>Y</sub> = 4/2 = 2, which is also the slope of the budget line (12/6).' },
    { q: 'Starting from P<sub>X</sub> = $4, P<sub>Y</sub> = $2, I = $24, P<sub>X</sub> rises to $6. The budget line…', options: ['Shifts in parallel', 'Pivots in around the vertical intercept and gets steeper', 'Pivots down around the horizontal intercept and gets flatter', 'Does not change'], answer: 1, why: 'The X-intercept falls from 6 to 4 while the Y-intercept stays at 12. The relative price of X rises to 3, so the line is steeper.' },
    { q: 'Income rises while both prices stay the same. The budget line…', options: ['Pivots outward', 'Gets steeper', 'Shifts out parallel', 'Gets flatter'], answer: 2, why: 'Both intercepts rise by the same proportion and the slope P<sub>X</sub>/P<sub>Y</sub> is unchanged.' },
    { q: 'At a bundle on the budget line, MRS of X for Y = 3 and P<sub>X</sub>/P<sub>Y</sub> = 2. To raise utility the consumer should…', options: ['Buy more X and less Y', 'Buy less X and more Y', 'Stay put', 'Spend less in total'], answer: 0, why: 'X is worth 3 Y to them but costs only 2 Y. Buying more X leaves them 1 Y ahead per unit, so utility rises (Joe\'s case).' },
    { q: 'Jane\'s MRS of hamburgers for milkshakes is 1; hamburgers cost $3 and shakes $1. Jane should…', options: ['Buy more hamburgers', 'Buy fewer hamburgers and more milkshakes', 'Buy only hamburgers', 'Change nothing'], answer: 1, why: 'MRS = 1 < relative price = 3, so hamburgers are poor value to her. Substitute milkshakes for hamburgers.' },
    { q: 'Why can\'t one person\'s indifference curves cross?', options: ['It would break the budget constraint', 'It would contradict more-is-better (combined with transitivity)', 'MRS would have to be constant', 'Utility functions can\'t be graphed'], answer: 1, why: 'Two bundles on different curves through the crossing point would be ranked equal by transitivity, even though one has more of a good than the other.' },
    { q: 'Indifference curves for perfect substitutes are…', options: ['L-shaped', 'Convex curves', 'Downward-sloping straight lines', 'Vertical lines'], answer: 2, why: 'Perfect substitutes have a constant MRS, so the slope never changes.' },
    { q: 'Pasta and sauce always eaten in a 2 : 1 ratio are…', options: ['Perfect substitutes', 'Perfect complements with L-shaped curves', 'Imperfect substitutes', 'Not goods'], answer: 1, why: 'Fixed-proportion goods are perfect complements; extra pasta without extra sauce adds nothing.' },
    { q: 'With U = x<sup>0.5</sup>y<sup>0.5</sup>, moving from (5, 5) to (6, 5) gives MU<sub>X</sub> of about…', options: ['1', '0.48', '5.48', '0.40'], answer: 1, why: 'U(6, 5) = √30 ≈ 5.48 and U(5, 5) = 5, so ΔU ≈ 0.48.' },
    { q: 'MU<sub>X</sub> = 6 utils and MU<sub>Y</sub> = 2 utils. The MRS of X for Y is…', options: ['1/3', '3', '4', '12'], answer: 1, why: 'MRS = MU<sub>X</sub>/MU<sub>Y</sub> = 6/2 = 3.' },
    { q: 'Donna likes Coke and Pepsi equally. Coke is $1.50, Pepsi $1, budget $6. She buys…', options: ['4 Coke', '3 Coke and 3 Pepsi', '6 Pepsi', 'Any bundle on the budget line'], answer: 2, why: 'MRS = 1 < relative price of Coke = 1.5, so this is a corner solution at the Pepsi intercept: 6/1 = 6 cans.' },
    { q: 'Income and both prices all fall by 10%. The optimal bundle…', options: ['Rises', 'Falls', 'Stays the same', 'Moves to a corner'], answer: 2, why: 'Both intercepts (I/P) are unchanged, so the budget line and the optimum don\'t move.' },
    { q: 'Which is true of a corner solution?', options: ['MRS = P<sub>X</sub>/P<sub>Y</sub>', 'MRS generally does not equal P<sub>X</sub>/P<sub>Y</sub>', 'The consumer has money left over', 'It only happens with complements'], answer: 1, why: 'At a corner the consumer would like to keep substituting but can\'t, so tangency does not hold.' },
    { q: 'If MU<sub>X</sub>/P<sub>X</sub> > MU<sub>Y</sub>/P<sub>Y</sub>, the consumer should…', options: ['Spend more on X', 'Spend more on Y', 'Spend less in total', 'Do nothing'], answer: 0, why: 'The last dollar on X buys more utility than the last dollar on Y. Shift spending to X until the bangs for the buck are equal.' },
    { q: 'The MRS depends on…', options: ['Prices only', 'Income only', 'Preferences only', 'Prices and income'], answer: 2, why: 'MRS is about willingness to trade, so it depends only on preferences. The relative price depends only on market prices.' },
    { q: 'Compared at the same bundle, a consumer with a stronger preference for X has…', options: ['A flatter indifference curve and smaller MRS', 'A steeper indifference curve and larger MRS', 'A steeper budget line', 'The same indifference curve'], answer: 1, why: 'A stronger preference for X means giving up more Y per unit of X: bigger MRS, steeper curve.' },
    { q: 'Jennifer\'s MRS of chocolate chip for peanut butter cookies is 2. Chocolate chip costs $2.50, peanut butter $1, budget $10. She buys…', options: ['4 chocolate chip', '10 peanut butter', '5 of each', 'Any bundle on the line'], answer: 1, why: 'MRS = 2 < relative price = 2.5, so chocolate chip is too expensive for her. She spends everything on peanut butter.' },
  ];

  const cards = [
    { term: 'Consumption bundle', def: 'A combination of quantities of goods, e.g. (x, y) = (3 beers, 6 pizza slices).' },
    { term: 'Completeness & rankability', def: 'A consumer can compare any two bundles: prefers A, prefers B, or is indifferent.' },
    { term: 'Transitivity', def: 'If A ≻ B and B ≻ C, then A ≻ C. Same for indifference.' },
    { term: 'More is better', def: 'More of a good increases satisfaction (no satiation in this course).' },
    { term: 'Indifference curve', def: 'All bundles that give the consumer the same satisfaction (utility).' },
    { term: 'Indifference map', def: 'A set of indifference curves. Curves farther from the origin represent higher utility.' },
    { term: 'MRS of X for Y', def: 'Units of Y given up for one more unit of X, leaving the consumer equally well off. = −ΔY/ΔX = slope of the IC = MU<sub>X</sub>/MU<sub>Y</sub>.' },
    { term: 'Diminishing MRS', def: 'MRS falls as X increases and Y decreases along a curve, which makes indifference curves convex. Caused by diminishing marginal utilities.' },
    { term: 'Imperfect substitutes', def: 'Goods whose MRS is not constant. Convex indifference curves.' },
    { term: 'Perfect substitutes', def: 'Goods with a constant MRS (not necessarily 1). Straight-line indifference curves.' },
    { term: 'Perfect complements', def: 'Goods consumed in fixed proportions. L-shaped indifference curves.' },
    { term: 'Utility function', def: 'Assigns a number (utils) to each bundle so that preferred bundles get higher numbers. E.g. U = x<sup>0.5</sup>y<sup>0.5</sup> (Cobb–Douglas).' },
    { term: 'Marginal utility', def: 'Extra utility from one more unit of a good, holding the other good fixed. Usually diminishing.' },
    { term: 'Budget constraint', def: 'P<sub>X</sub>x + P<sub>Y</sub>y = I.' },
    { term: 'Budget line', def: 'All bundles that cost exactly I. Intercepts I/P<sub>X</sub> and I/P<sub>Y</sub>; slope P<sub>X</sub>/P<sub>Y</sub>.' },
    { term: 'Relative price of X', def: 'P<sub>X</sub>/P<sub>Y</sub>: units of Y given up to buy one unit of X = slope of the budget line. Depends only on prices.' },
    { term: 'Tangency condition', def: 'At an interior optimum, an indifference curve just touches the budget line.' },
    { term: 'Relative price rule', def: 'MRS of X for Y = P<sub>X</sub>/P<sub>Y</sub> at an interior optimum.' },
    { term: 'Interior solution', def: 'The optimum is a point on the budget line with positive amounts of both goods.' },
    { term: 'Corner solution', def: 'The optimum is at an intercept: the whole budget goes to one good. Tangency does not hold.' },
    { term: 'Equal bangs for the buck', def: 'MU<sub>X</sub>/P<sub>X</sub> = MU<sub>Y</sub>/P<sub>Y</sub> (= … = MU<sub>n</sub>/P<sub>n</sub>): the last dollar spent on each good adds the same utility.' },
  ];

  const sheet = [
    { h: 'MRS of X for Y', f: `MRS = −${F('ΔY', 'ΔX')} = ${F(MUX, MUY)}`, p: 'Units of Y given up for one more X, utility constant. = slope of the indifference curve.' },
    { h: 'Budget constraint', f: `${PX}x + ${PY}y = I`, p: 'Every bundle on the budget line costs exactly I.' },
    { h: 'Intercepts', f: `X: ${F('I', PX)} &nbsp;&nbsp; Y: ${F('I', PY)}`, p: 'Recompute both whenever a price or income changes.' },
    { h: 'Relative price of X', f: `${F(PX, PY)} = slope of budget line`, p: 'Units of Y the market charges for one X.' },
    { h: 'Interior optimum', f: `MRS = ${F(PX, PY)} &nbsp;⇔&nbsp; ${F(MUX, PX)} = ${F(MUY, PY)}`, p: 'Tangency, and equal bangs for the buck.' },
    { h: 'Which way to trade', f: `MRS &gt; ${F(PX, PY)} → more X &nbsp;·&nbsp; MRS &lt; ${F(PX, PY)} → more Y`, p: 'Keep trading until they are equal (or you hit a corner).' },
    { h: 'Marginal utility', f: `${MUX} = ΔU for one more X, y fixed`, p: 'Diminishing MU → diminishing MRS → convex curves.' },
    { h: 'Cobb–Douglas example', f: 'U = x<sup>0.5</sup>y<sup>0.5</sup> &nbsp;→&nbsp; MRS = y / x', p: 'In general U = x<sup>a</sup>y<sup>1−a</sup> gives MRS = (a/(1−a))·(y/x) and optimum x = aI/P<sub>X</sub>, y = (1−a)I/P<sub>Y</sub>.' },
    { h: 'Perfect substitutes', f: 'MRS constant → straight-line ICs', p: 'MRS &gt; P<sub>X</sub>/P<sub>Y</sub>: all X. MRS &lt; P<sub>X</sub>/P<sub>Y</sub>: all Y. Equal: any bundle on the line.' },
    { h: 'Perfect complements', f: 'Fixed ratio → L-shaped ICs', p: 'Optimum at a corner of the L, on the ray of the fixed proportion.' },
    { h: 'Budget line moves', f: `${PX}↑ or ${PY}↓ → steeper · ${PX}↓ or ${PY}↑ → flatter`, p: 'Income changes: parallel shift. Scale I and all prices equally: no change.' },
    { h: 'n goods', f: `${F('MU<sub>1</sub>', 'P<sub>1</sub>')} = ${F('MU<sub>2</sub>', 'P<sub>2</sub>')} = ⋯ = ${F('MU<sub>n</sub>', 'P<sub>n</sub>')}`, p: 'The multi-good version of the relative price rule.' },
  ];

  Study.registerChapter({
    id: 'ch3', number: 3, title: 'Consumer Choice',
    blurb: 'Preferences, budget constraints, and how a consumer picks the bundle that maximizes utility.',
    intro: 'How does a consumer split a budget between goods? Preferences (indifference curves), prices and income (the budget line) together pick the best bundle.',
    sections: [
      { id: 's31', num: '3.1', title: 'Consumer Preferences', html: s31, takeaways: [
        'Three assumptions (completeness, transitivity, more is better) give downward-sloping, non-crossing indifference curves; farther out means higher utility.',
        'MRS of X for Y = Y given up for one more X = slope of the IC = MU<sub>X</sub>/MU<sub>Y</sub>. It depends only on preferences.',
        'Diminishing marginal utilities → diminishing MRS → convex curves (imperfect substitutes).',
        'Special cases: perfect substitutes (constant MRS, straight lines) and perfect complements (fixed proportions, L-shapes).',
      ] },
      { id: 's32', num: '3.2', title: 'Budget Constraints', html: s32, takeaways: [
        'Budget line: P<sub>X</sub>x + P<sub>Y</sub>y = I, intercepts I/P<sub>X</sub> and I/P<sub>Y</sub>.',
        'Slope = relative price of X = P<sub>X</sub>/P<sub>Y</sub>. It depends only on prices.',
        'A price change pivots the line; an income change shifts it parallel.',
      ] },
      { id: 's33', num: '3.3', title: 'Consumer Choice', html: s33, takeaways: [
        'Interior optimum: tangency, MRS = P<sub>X</sub>/P<sub>Y</sub>.',
        'MRS > P<sub>X</sub>/P<sub>Y</sub>: buy more X. MRS < P<sub>X</sub>/P<sub>Y</sub>: buy more Y.',
        'Same prices and income, different preferences → different choices.',
        'Corner solutions (strong preferences or perfect substitutes) don\'t satisfy tangency.',
      ] },
      { id: 's34', num: '3.4', title: 'Extensions', html: s34, takeaways: [
        'Equal bangs for the buck: MU<sub>X</sub>/P<sub>X</sub> = MU<sub>Y</sub>/P<sub>Y</sub>, and likewise for n goods.',
      ] },
    ],
    practice, quiz, cards, sheet,
  });
})();
