/* Chapter 4 · Individual and Market Demands
   Content follows the Chapter 4 lecture slides and the Chapter 4 exercises. */
(function () {
  const F = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const PX = 'P<sub>X</sub>', PY = 'P<sub>Y</sub>';

  const s41 = `
    <p>Chapter 4 uses the Chapter 3 tools to derive demand curves. First, how does a change in <b>income</b> change what a consumer buys?</p>
    <div class="callout def"><span class="tag">Definition</span><p>The <b>income effect</b> is the change in a consumer's choices caused by a change in income. Its direction depends on the type of good.</p></div>
    <div class="table-wrap"><table><thead><tr><th></th><th>Normal goods</th><th>Inferior goods</th></tr></thead><tbody>
      <tr><td>Income ↑</td><td>Consumption ↑</td><td>Consumption ↓</td></tr>
      <tr><td>Income ↓</td><td>Consumption ↓</td><td>Consumption ↑</td></tr>
      <tr><td>Examples</td><td>Steaks, fruit, butter</td><td>Kraft dinner, margarine, bus rides</td></tr>
    </tbody></table></div>
    <p>An income increase shifts the budget line out in parallel. Draw a vertical line through the old optimum: for a <b>normal</b> good the new tangency is to its right; for an <b>inferior</b> good it is to its left. With two goods, both can be normal, but they can't both be inferior (the extra income has to go somewhere).</p>
    <div data-widget="incomeEngel" data-preset="normal"></div>

    <h3>Engel curves</h3>
    <p>An <b>Engel curve</b> plots income (vertical) against the quantity of a good consumed (horizontal).</p>
    <div class="cards3">
      <div class="mini"><h4>Normal good</h4><p>Upward sloping: more income, more of the good.</p></div>
      <div class="mini"><h4>Inferior good</h4><p>Downward sloping: more income, less of the good.</p></div>
      <div class="mini"><h4>Both (hamburgers)</h4><p>Normal at low incomes, inferior at high incomes: the curve bends back.</p></div>
    </div>
    <p>Application: in the US, rented dwellings behave as a normal good at low incomes and an inferior good at higher incomes (people switch to owning). Entertainment and health care stay normal.</p>
    <div data-widget="engelData"></div>
  `;

  const s42 = `
    <p><b>Individual demand</b> is the quantity an individual buys at each price. Vary ${PX} (holding ${PY}, income and tastes fixed), find the tangency each time, and plot price against quantity. The result slopes down: a lower price raises the quantity demanded.</p>
    <div data-widget="demandDerive" data-preset="lecture"></div>
    <h3>Shifts in the demand curve</h3>
    <p>A change in <b>preferences</b> shifts the whole curve. If Joe wants to cut back on beer (X) to lose weight, his MRS of beer for pizza falls and his indifference curves get <b>flatter</b>. At every price he now chooses less beer, so his demand curve shifts <b>left</b>. Tick the taste-change box above to see it.</p>
    <div class="callout trap"><span class="tag">Keep these apart</span><p>A change in the good's <b>own price</b> is a movement <i>along</i> the demand curve. A change in income, tastes or other prices <b>shifts</b> it.</p></div>
  `;

  const s43 = `
    <p>A price change has two effects on how much X a consumer buys. Separating them explains why demand slopes down, and also the odd cases.</p>
    <div class="cards3">
      <div class="mini"><h4>Substitution effect</h4><p>Change in X from the change in its <b>relative price</b>, holding <b>utility constant</b>. Always do it first.</p></div>
      <div class="mini"><h4>Income effect</h4><p>Change in X from the change in <b>purchasing power</b> caused by the price change.</p></div>
      <div class="mini"><h4>Total effect</h4><p>= substitution effect + income effect: the full change in quantity demanded.</p></div>
    </div>
    <h3>How to decompose (exam steps)</h3>
    <ol>
      <li>Locate the initial optimum <b>A</b> on indifference curve U₀.</li>
      <li>Draw the <b>new budget line</b>.</li>
      <li>Shift a line <b>parallel to the new budget line</b> until it is tangent to <b>U₀</b>. The tangency is the <b>decomposition bundle D</b>, and that line is the decomposition budget line.</li>
      <li><b>Substitution effect</b> = change in X from A to D.</li>
      <li>Draw the new indifference curve U₁ tangent to the new budget line at <b>B</b>, to the right or left of the vertical line through D depending on whether X is normal or inferior.</li>
      <li><b>Income effect</b> = change in X from D to B. <b>Total</b> = A to B.</li>
    </ol>
    <div class="callout key"><span class="tag">Why D, not A, for the income effect?</span><p>Going from the decomposition line to the new budget line is a pure parallel shift, like an income change. So apply what you learned in 4.1 at D: normal goods move right, inferior goods move left.</p></div>
    <div data-widget="slutsky" data-preset="normal"></div>
    <h3>Putting the signs together</h3>
    <p>The substitution effect is the same for every good: ${PX} ↓ makes X relatively cheaper, so the consumer substitutes X for Y (and the reverse for ${PX} ↑). The income effect depends on the good:</p>
    <div class="table-wrap"><table><thead><tr><th>${PX} ↓</th><th>Substitution</th><th>Income</th><th>Total</th><th>Demand curve</th></tr></thead><tbody>
      <tr><td>Normal</td><td>X ↑</td><td>X ↑ (reinforces)</td><td>X ↑</td><td>Downward sloping</td></tr>
      <tr><td>Inferior</td><td>X ↑</td><td>X ↓ (partly offsets)</td><td>X ↑, but less</td><td>Downward sloping, steeper</td></tr>
      <tr><td>Giffen (optional)</td><td>X ↑</td><td>X ↓, and larger</td><td>X ↓</td><td>Upward sloping</td></tr>
    </tbody></table></div>
    <div data-widget="effectsTable"></div>
    <div class="callout def"><span class="tag">Giffen good (optional)</span><p>An inferior good whose negative income effect is <b>larger</b> than the substitution effect, so demand slopes up. Evidence: in a poor region of China, people spent a large share of income on rice (inferior) and wanted meat (normal). A rice subsidy lowered the price, which freed up so much income that they bought <b>less</b> rice and more meat. Try the <b>Giffen: rice</b> preset in the graph above.</p></div>

    <h3>Application: wages, leisure and labour supply</h3>
    <p>Think of a worker choosing leisure and consumption (both normal). The price of an hour of leisure is the wage given up. With 12 available hours, labour supply = 12 − leisure. When the wage rises:</p>
    <div class="table-wrap"><table><thead><tr><th>Income level</th><th>Substitution effect on leisure</th><th>Income effect on leisure</th><th>Total effect on leisure</th><th>Labour supply</th></tr></thead><tbody>
      <tr><td>Low wages and income</td><td>Large decrease</td><td>Increase</td><td><b>Decrease</b></td><td><b>Increases</b></td></tr>
      <tr><td>Middle wages and income</td><td>Small decrease</td><td>Increase</td><td><b>Increase</b></td><td><b>Decreases</b></td></tr>
    </tbody></table></div>
    <p>At low incomes consumption matters most, so people give up a lot of leisure for a raise. Once income is higher, leisure becomes more important and a raise buys more time off. The labour supply curve <b>bends backward</b>. Evidence: across OECD countries, higher productivity and wages go with fewer hours worked; in China, when very low wages rose after 1978, people worked more.</p>
    <div data-widget="laborSupply"></div>
  `;

  const s44 = `
    <div class="eq"><span class="lbl">Market demand</span> sum of individual quantities demanded at each price</div>
    <p>Add individual demand curves <b>horizontally</b>: at each price, add up how much everyone buys. Because each individual curve slopes down, the market curve does too. This is the <b>law of demand</b>: other things equal, quantity demanded falls when the good's own price rises.</p>
    <p>The market curve can have a <b>kink</b>, because people start buying at different prices.</p>
    <div data-widget="marketDemand"></div>
    <p class="muted">Review: the short-run market equilibrium is the price where market demand equals short-run market supply. Chapter 8 derives the supply side.</p>
  `;

  const s45 = `
    <h3>Individual consumer surplus</h3>
    <div class="eq"><span class="lbl">Individual CS</span> = willingness to pay − price = perceived benefit − price</div>
    <p><b>Willingness to pay</b> is the most a consumer would pay and be no worse off. CS is positive when willingness to pay exceeds the price.</p>
    <h3>Consumer surplus in a market</h3>
    <p>Market CS is the sum across all consumers: the <b>area below the demand curve and above the price</b>.</p>
    <ul><li>A <b>price drop increases CS</b> (by A + B): existing buyers each gain (A), and new buyers enter (B).</li><li>A <b>price rise decreases CS</b> by the same kind of areas.</li></ul>
    <div data-widget="consumerSurplus"></div>
    <h3>Consumer surplus and quality choice</h3>
    <p>A product comes in five qualities, A1 (lowest) to A5 (highest). Each consumer picks the version with the highest <b>CS = B − P</b>, not the best quality.</p>
    <div class="table-wrap"><table><thead><tr><th></th><th class="num">A1</th><th class="num">A2</th><th class="num">A3</th><th class="num">A4</th><th class="num">A5</th></tr></thead><tbody>
      <tr><td>Price</td><td class="num">$9</td><td class="num">$13</td><td class="num">$17</td><td class="num">$20</td><td class="num">$21</td></tr>
      <tr><td>Consumer 1 benefit</td><td class="num">$10</td><td class="num">$15</td><td class="num">$18</td><td class="num">$20</td><td class="num">$21</td></tr>
      <tr><td>Consumer 1 CS</td><td class="num">$1</td><td class="num"><b>$2</b></td><td class="num">$1</td><td class="num">$0</td><td class="num">$0</td></tr>
      <tr><td>Consumer 2 benefit</td><td class="num">$7</td><td class="num">$13</td><td class="num">$18</td><td class="num">$22</td><td class="num">$24</td></tr>
      <tr><td>Consumer 2 CS</td><td class="num">−$2</td><td class="num">$0</td><td class="num">$1</td><td class="num">$2</td><td class="num"><b>$3</b></td></tr>
    </tbody></table></div>
    <div data-widget="qualityChoice"></div>
    <div class="callout key"><span class="tag">Takeaways</span><ul><li>Not everyone buys the highest quality.</li><li>Consumers who value quality more tend to choose higher-quality versions.</li><li>Individual CS balances perceived benefit against price.</li><li>Diminishing marginal utility of quality limits willingness to pay. Casual users buy a basic iPhone; enthusiasts pay for the Pro Max.</li></ul></div>
  `;

  const s46 = `
    <p>So far each person's demand ignored what others buy. For some goods, demand depends on <b>how many other people use them</b>: a <b>network externality</b>.</p>
    <div class="table-wrap"><table><thead><tr><th></th><th>Bandwagon effect</th><th>Snob effect</th></tr></thead><tbody>
      <tr><td>Type</td><td>Positive network externality</td><td>Negative network externality</td></tr>
      <tr><td>Idea</td><td>You want it partly <b>because others have it</b></td><td>You want it <b>because others don't</b>: exclusivity</td></tr>
      <tr><td>Examples</td><td>Facebook, fax machines, computer software, Microsoft Word</td><td>Exclusive golf clubs, LV bags, Rolex watches, Porsche</td></tr>
      <tr><td>Market demand</td><td>More price-responsive: <b>more elastic (flatter)</b></td><td>Less price-responsive: <b>more inelastic (steeper)</b></td></tr>
    </tbody></table></div>
    <p>After a price cut: <b>total effect = pure price effect + bandwagon (or snob) effect</b>. The bandwagon effect adds buyers; the snob effect removes some.</p>
    <div data-widget="network"></div>
    <div class="table-wrap"><table><thead><tr><th>Review</th><th>Response to a price change</th><th>Demand curve</th></tr></thead><tbody>
      <tr><td>More elastic</td><td>More responsive</td><td>Flatter</td></tr>
      <tr><td>More inelastic</td><td>Less responsive</td><td>Steeper</td></tr>
    </tbody></table></div>
  `;

  const practice = [
    {
      source: 'Lecture exercise', title: 'John and Kraft dinner', short: 'Income effect',
      prompt: '<p>Kraft dinner (X) is an inferior good for John. His income <b>decreases</b>. From his original bundle A, will he choose a bundle with more or less Kraft dinner?</p>',
      parts: [{ l: 'a', q: 'Which bundle does he choose, and why?', a: '<p>The one with <b>more</b> Kraft dinner: to the <b>right</b> of the vertical line through A on the new, lower budget line. For an inferior good, lower income raises consumption. (His other good, steak, is normal, so he buys less of it.)</p>' }],
    },
    {
      source: 'Exercise 1', title: 'Tyler\'s demand for movie tickets', short: 'Ex. 1 · Tyler',
      prompt: '<p>Tyler spends $100 a week on DVD rentals ($1 each) and movie tickets. Use the graph to find how many movies he sees at each ticket price, then plot his demand curve.</p>',
      widget: '<div data-widget="demandDerive" data-preset="tyler"></div>',
      parts: [
        { l: 'a', q: 'Ticket price $10: draw his budget line. How many movies does he see?', a: '<p>Budget line from 100 DVDs to 10 tickets. He sees <b>6 movies</b> (and rents 40 DVDs).</p>' },
        { l: 'b', q: 'Plot the point for a price of $10 on a second graph.', a: '<p>The point (6 tickets, $10) on the price–quantity graph.</p>' },
        { l: 'c', q: 'The price rises to $12.50. Repeat.', a: '<p>Budget line now ends at 8 tickets. He sees <b>4 movies</b>: point (4, $12.50).</p>' },
        { l: 'd', q: 'A discount card lets him buy tickets for $7.50. Repeat.', a: '<p>Budget line ends at 13.3 tickets. He sees <b>8 movies</b>: point (8, $7.50).</p>' },
        { l: 'e', q: 'Connect the points.', a: '<p>(4, $12.50), (6, $10) and (8, $7.50) form a downward-sloping demand curve.</p>' },
      ],
    },
    {
      source: 'Exercise 2', title: 'Josie: flan and tofu', short: 'Ex. 2 · Josie',
      prompt: '<p>Josie loves flan. She has $40 to spend on flan and tofu, and tofu costs $1. Her indifference curves are steep near 3 units of flan.</p>',
      parts: [
        { l: 'a', q: 'Draw her budget lines for flan prices of $5, $8 and $10.', a: '<p>All start at 40 tofu. They end at 8, 5 and 4 units of flan.</p>' },
        { l: 'b', q: 'Find her optimal flan consumption at each price.', a: '<p><b>3 units</b> of flan at every price in this range.</p>' },
        { l: 'c', q: 'What does her demand curve look like? (optional: elasticity)', a: '<p>A <b>vertical line</b> at 3 units. Demand is <b>perfectly inelastic</b>.</p>' },
        { l: 'd', q: 'What can you say about the income and substitution effects of a flan price change?', a: '<p>They are <b>equal in size and opposite in direction</b>, so they cancel and quantity doesn\'t change.</p>' },
      ],
    },
    {
      source: 'Exercise 3', title: 'Alice\'s Engel curve for books', short: 'Ex. 3 · Engel curve',
      prompt: '<p>Holding prices fixed, Alice\'s optimal number of books at each income is in the table in the graph. Sketch her Engel curve and mark where books are normal and where they are inferior.</p>',
      widget: '<div data-widget="engelData"></div>',
      parts: [{ l: 'a', q: 'Over which incomes are books normal? Inferior?', a: '<p><b>Normal from $5,000 to $25,000</b> (books rise from 5 to 26). <b>Inferior from $25,000 to $50,000</b> (books fall from 26 to 6). The Engel curve bends back, like the hamburger example.</p>' }],
    },
    {
      source: 'Exercise 4', title: 'Pam: bread and Spam', short: 'Ex. 4 · Pam',
      prompt: '<p>For Pam, Spam is inferior but not Giffen; bread is normal. Bread and Spam each cost $2 and she has $20. Spam is on the horizontal axis.</p>',
      widget: '<div data-widget="slutsky" data-presets="pam" data-preset="pam"></div>',
      parts: [
        { l: 'a', q: 'Draw her budget line; her optimum is 4 Spam and 6 bread. Draw its indifference curve.', a: '<p>Budget line from 10 bread to 10 Spam. A = (4, 6), with U₀ tangent there.</p>' },
        { l: 'b', q: 'Spam falls to $1. She now buys 7 bread and 6 Spam. Show the new budget line and optimum.', a: '<p>The budget line pivots out to 20 Spam (bread intercept stays at 10). B = (6, 7), with U₁ tangent there.</p>' },
        { l: 'c', q: 'Show the income and substitution effects.', a: '<p>Draw a line parallel to the new budget line (slope 1/2) tangent to U₀. That gives D at roughly 7.5–8 cans of Spam. <b>Substitution effect</b>: 4 → about 7.9 (increase). <b>Income effect</b>: about 7.9 → 6 (decrease, because Spam is inferior). <b>Total</b>: 4 → 6 = +2. The income effect partly offsets the substitution effect, so Spam is inferior but not Giffen.</p>' },
      ],
    },
    {
      source: 'Exercise 5 · Worksheet Q1–Q2', title: 'Price of X rises: normal vs inferior', short: 'Ex. 5 · P↑ decomposition',
      prompt: '<p>Decompose the total change in quantity demanded of X caused by an <b>increase</b> in its price, (1) when X is normal and (2) when X is inferior.</p>',
      widget: '<div data-widget="slutsky" data-presets="normalUp,inferiorUp" data-preset="normalUp"></div>',
      parts: [
        { l: '1', q: 'X is a normal good.', a: '<p>D is on U₀, up and to the left of A (parallel to the steeper new line). <b>Substitution effect: X decreases</b> (A → D). Lower purchasing power and X normal: B is left of D, so the <b>income effect decreases X too</b>. Both reinforce: total decrease.</p>' },
        { l: '2', q: 'X is an inferior good.', a: '<p>Substitution effect: <b>X decreases</b> (A → D), exactly as before. Lower purchasing power and X inferior: B is to the <b>right</b> of D, so the income effect <b>increases X</b>. It partly offsets the substitution effect; the total is still a decrease.</p>' },
      ],
    },
    {
      source: 'Handout', title: 'Signs of the effects', short: 'Handout table',
      prompt: '<p>Complete the handout tables for P<sub>X</sub> ↓ and P<sub>X</sub> ↑.</p>',
      widget: '<div data-widget="effectsTable"></div>',
    },
    {
      source: 'Exercise 7 · optional', title: 'Sonya: rice and pasta', short: 'Ex. 7 · Sonya',
      prompt: '<p>Sonya faces an <b>increase in the price of pasta</b> (on the vertical axis, so pasta is good Y here), moving her from optimum A to optimum B.</p>',
      parts: [
        { l: 'a', q: 'Show the substitution and income effects on pasta.', a: '<p>Draw a line parallel to the new budget line tangent to U₁ at D. Measure along the <b>vertical</b> axis: A → D is the substitution effect (pasta falls) and D → B is the income effect (pasta falls again).</p>' },
        { l: 'b', q: 'Which effect is strongest?', a: '<p>They look about equal: each cuts pasta by about 2 cups.</p>' },
      ],
    },
    {
      source: 'Exercise 8', title: 'Bandwagon or snob?', short: 'Ex. 8 · Network',
      prompt: '<p>Classify each product\'s network externality.</p>',
      widget: '<div data-widget="networkSort"></div>',
      parts: [{ l: 'a', q: 'Explain the pattern.', a: '<p><b>LV bags and Rolex watches</b>: some people don\'t want them if many others own them: <b>snob effect</b>. <b>Microsoft Word and fax machines</b>: the more people use them, the more useful they are (easier to work with others): <b>bandwagon effect</b>.</p>' }],
    },
  ];

  const quiz = [
    { q: 'Income rises and a consumer buys less of good X. X is…', options: ['A normal good', 'An inferior good', 'A Giffen good for sure', 'A perfect complement'], answer: 1, why: 'By definition, an inferior good\'s consumption moves opposite to income. (Giffen goods are inferior, but inferior doesn\'t mean Giffen.)' },
    { q: 'The Engel curve for a normal good is…', options: ['Upward sloping', 'Downward sloping', 'Vertical', 'Horizontal'], answer: 0, why: 'Income on the vertical axis, quantity on the horizontal: more income means more of a normal good.' },
    { q: 'With only two goods, which is impossible?', options: ['Both goods normal', 'X normal, Y inferior', 'Both goods inferior', 'X inferior, Y normal'], answer: 2, why: 'Extra income must be spent on something, so at least one good must rise when income rises.' },
    { q: 'Joe decides to cut back on beer to lose weight. His demand curve for beer…', options: ['Shifts right', 'Shifts left', 'Doesn\'t move; he moves along it', 'Becomes vertical'], answer: 1, why: 'A taste change lowers his MRS (flatter curves), so he buys less beer at every price.' },
    { q: 'The substitution effect of a price change is measured…', options: ['Holding income constant', 'Holding utility constant', 'Holding the quantity of Y constant', 'Holding both prices constant'], answer: 1, why: 'D lies on the original indifference curve: utility is held constant while the relative price changes.' },
    { q: 'P<sub>X</sub> falls. The substitution effect on X is…', options: ['Always positive (X increases)', 'Positive only for normal goods', 'Negative for inferior goods', 'Zero for Giffen goods'], answer: 0, why: 'The substitution effect always moves toward the good that became relatively cheaper, for any type of good.' },
    { q: 'P<sub>X</sub> falls and X is inferior (not Giffen). Then…', options: ['Both effects increase X', 'The income effect decreases X but is smaller than the substitution effect', 'The income effect decreases X and is larger', 'Both effects decrease X'], answer: 1, why: 'The income effect partly offsets the substitution effect, so quantity still rises and demand still slopes down, more steeply.' },
    { q: 'A Giffen good has…', options: ['An upward-sloping demand curve', 'A downward-sloping Engel curve and demand curve', 'No income effect', 'A positive income effect larger than the substitution effect'], answer: 0, why: 'For a Giffen good the negative income effect outweighs the substitution effect, so quantity falls when price falls.' },
    { q: 'The decomposition bundle D is found where…', options: ['The new budget line meets the old one', 'A line parallel to the new budget line is tangent to the original indifference curve', 'A line parallel to the old budget line is tangent to the new indifference curve', 'The two indifference curves cross'], answer: 1, why: 'D keeps utility at U₀ but uses the new relative price, the slope of the new budget line.' },
    { q: 'For Pam, Spam falls from $2 to $1 and she goes from 4 to 6 cans. D is at about 7.9 cans. The income effect is about…', options: ['+2', '+3.9', '−1.9', '−2'], answer: 2, why: 'Income effect = D → B = 6 − 7.9 ≈ −1.9. Negative, because Spam is inferior.' },
    { q: 'Low-income worker, wage rises. Most likely…', options: ['Works less: income effect dominates', 'Works more: substitution effect dominates', 'Hours don\'t change', 'Leisure increases'], answer: 1, why: 'At low incomes consumption matters most, so the large substitution effect dominates: less leisure, more work.' },
    { q: 'The labour supply curve bends backward because at higher wages…', options: ['Leisure becomes inferior', 'The income effect on leisure outweighs the substitution effect', 'The substitution effect gets larger', 'Workers are forced to work less'], answer: 1, why: 'Leisure is normal. Once income is high, the income effect (more leisure) beats the substitution effect (less leisure).' },
    { q: 'Market demand is found by…', options: ['Adding individual demand curves vertically', 'Adding individual quantities at each price (horizontally)', 'Averaging individual prices', 'Multiplying individual demands'], answer: 1, why: 'At each price, add up how much every consumer buys.' },
    { q: 'Why can a market demand curve have a kink?', options: ['Some goods are inferior', 'Consumers start buying at different prices', 'Income effects are large', 'Network externalities'], answer: 1, why: 'Below the price at which a new group starts buying, the market curve gets flatter.' },
    { q: 'Consumer surplus in a market is…', options: ['The area above the demand curve', 'The area below the demand curve and above the price', 'Price × quantity', 'Willingness to pay of the last buyer'], answer: 1, why: 'It adds up willingness to pay minus price across all buyers.' },
    { q: 'Price falls from P₁ to P₂. The increase in CS comes from…', options: ['Only new buyers', 'Only existing buyers paying less', 'Existing buyers paying less (A) and new buyers (B)', 'Producers'], answer: 2, why: 'Area A is the saving to existing buyers; area B is the surplus of those who now enter.' },
    { q: 'Consumer 2\'s benefits for A1–A5 are $7, $13, $18, $22, $24; prices are $9, $13, $17, $20, $21. She buys…', options: ['A2', 'A3', 'A4', 'A5'], answer: 3, why: 'CS values are −2, 0, 1, 2, 3. A5 gives the most: $24 − $21 = $3.' },
    { q: 'A bandwagon effect makes market demand…', options: ['More elastic (flatter)', 'More inelastic (steeper)', 'Vertical', 'Unchanged'], answer: 0, why: 'After a price cut, extra buyers join because others use the good, so quantity responds more.' },
    { q: 'Which product most likely has a snob effect?', options: ['Microsoft Word', 'Fax machines', 'Rolex watches', 'Facebook'], answer: 2, why: 'Its appeal comes partly from exclusivity; more owners makes some buyers want it less.' },
    { q: 'Josie buys 3 units of flan whether it costs $5, $8 or $10. Her demand for flan is…', options: ['Perfectly elastic', 'Perfectly inelastic', 'Upward sloping', 'Unit elastic'], answer: 1, why: 'A vertical demand curve: the income and substitution effects cancel exactly.' },
  ];

  const cards = [
    { term: 'Income effect (4.1)', def: 'The change in consumption caused by a change in income.' },
    { term: 'Normal good', def: 'Consumption rises when income rises. Upward-sloping Engel curve. E.g. steaks, fruit, butter.' },
    { term: 'Inferior good', def: 'Consumption falls when income rises. Downward-sloping Engel curve. E.g. Kraft dinner, margarine, bus rides.' },
    { term: 'Engel curve', def: 'Income (vertical axis) against the quantity of a good consumed (horizontal axis).' },
    { term: 'Individual demand', def: 'The quantity an individual buys at each price, found from the tangencies as P<sub>X</sub> changes.' },
    { term: 'Shift vs movement', def: 'Own-price change: movement along demand. Change in tastes, income or other prices: the curve shifts.' },
    { term: 'Substitution effect', def: 'Change in X from a change in its relative price, holding utility constant (A → D). Always opposite to the price change.' },
    { term: 'Income effect of a price change', def: 'Change in X from the change in purchasing power (D → B). Same direction as the purchasing-power change for normal goods, opposite for inferior goods.' },
    { term: 'Total effect', def: 'Substitution effect + income effect (A → B).' },
    { term: 'Decomposition bundle D', def: 'Point on the ORIGINAL indifference curve tangent to a line parallel to the NEW budget line.' },
    { term: 'Giffen good', def: 'An inferior good whose negative income effect exceeds the substitution effect. Upward-sloping demand. E.g. rice in a poor region of China.' },
    { term: 'Price of leisure', def: 'The wage rate given up for an hour of leisure.' },
    { term: 'Backward-bending labour supply', def: 'At low wages the substitution effect dominates (work more); at higher wages the income effect dominates (work less).' },
    { term: 'Market demand', def: 'Horizontal sum of individual demands: add quantities at each price.' },
    { term: 'Law of demand', def: 'Other things equal, quantity demanded falls when the good\'s own price rises.' },
    { term: 'Willingness to pay', def: 'The maximum price at which the consumer is no better or worse off buying the good.' },
    { term: 'Consumer surplus', def: 'Individual: willingness to pay − price. Market: area below demand and above price.' },
    { term: 'Quality choice', def: 'Choose the version that maximizes CS = perceived benefit − price, not necessarily the best one.' },
    { term: 'Network externality', def: 'One person\'s demand depends on how many others buy or use the good.' },
    { term: 'Bandwagon effect', def: 'Positive network externality: you want it because others have it. Market demand is more elastic.' },
    { term: 'Snob effect', def: 'Negative network externality: you want it because others don\'t. Market demand is more inelastic.' },
  ];

  const sheet = [
    { h: 'Income effect (4.1)', f: 'Normal: I↑ → X↑ · Inferior: I↑ → X↓', p: 'Engel curve up for normal, down for inferior, bends back for goods like hamburgers.' },
    { h: 'Deriving demand', f: `Vary ${PX} → new tangencies → (Q<sub>X</sub>, ${PX}) points`, p: 'Taste change: MRS ↓, flatter ICs, demand shifts left.' },
    { h: 'Decomposition', f: 'Total = Substitution (A→D) + Income (D→B)', p: 'D: on U₀, tangent to a line parallel to the new budget line.' },
    { h: 'Substitution effect', f: `${PX}↓ → X↑ · ${PX}↑ → X↓`, p: 'Same for every good. Utility held constant.' },
    { h: 'Income effect of a price change', f: `${PX}↓ ⇒ purchasing power ↑`, p: 'Normal: reinforces. Inferior: partly offsets. Giffen: outweighs (demand slopes up).' },
    { h: 'Labour supply', f: 'Labour = 12 − leisure · price of leisure = wage', p: 'Low income: SE dominates, work more. Higher income: IE dominates, work less.' },
    { h: 'Market demand', f: 'Q<sub>market</sub>(P) = Σ q<sub>i</sub>(P)', p: 'Horizontal sum; kinks where new buyers enter.' },
    { h: 'Consumer surplus', f: 'CS = WTP − P · market CS = area under D above P', p: 'P↓: CS ↑ by A (existing buyers) + B (new buyers).' },
    { h: 'Quality choice', f: 'Pick max (B − P)', p: 'Stronger taste for quality → higher-quality version.' },
    { h: 'Network externalities', f: 'Bandwagon → more elastic · Snob → more inelastic', p: 'Total effect = pure price effect ± network effect.' },
  ];

  Study.registerChapter({
    id: 'ch4', number: 4, title: 'Individual and Market Demand',
    blurb: 'Income and price changes, substitution and income effects, market demand, consumer surplus and network externalities.',
    intro: 'Use Chapter 3\'s consumer choice to explain why demand curves slope down: split a price change into substitution and income effects, add individuals up to a market, and measure what buyers gain.',
    sections: [
      { id: 's41', num: '4.1', title: 'Income Changes', html: s41, takeaways: ['Income effect: normal goods rise with income, inferior goods fall.', 'Engel curves slope up for normal goods and down for inferior goods; some goods switch as income grows.'] },
      { id: 's42', num: '4.2', title: 'Price Changes and Individual Demand', html: s42, takeaways: ['Tracing tangencies as P<sub>X</sub> changes gives a downward-sloping individual demand curve.', 'Changes in preferences shift the demand curve.'] },
      { id: 's43', num: '4.3', title: 'Substitution and Income Effects', html: s43, takeaways: ['Total effect = substitution effect (A→D, utility constant) + income effect (D→B).', 'The substitution effect always moves against the price; the income effect depends on normal vs inferior.', 'Giffen: income effect outweighs substitution effect, so demand slopes up (optional).', 'Labour supply bends backward once the income effect on leisure dominates.'] },
      { id: 's44', num: '4.4', title: 'Market Demand', html: s44, takeaways: ['Market demand = horizontal sum of individual demands; it can kink.'] },
      { id: 's45', num: '4.5', title: 'Consumer Surplus', html: s45, takeaways: ['CS = area below demand and above price; it rises when price falls.', 'People choose the quality that maximizes their own CS.'] },
      { id: 's46', num: '4.6', title: 'Network Externalities', html: s46, takeaways: ['Bandwagon effect makes market demand more elastic; snob effect makes it more inelastic.'] },
    ],
    practice, quiz, cards, sheet,
  });
})();
