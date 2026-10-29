/* Chapter 8 · Profit Maximization and Competitive Supply. Follows the Chapter 8 lecture slides. */
(function () {
  const s81 = `
    <div class="table-wrap"><table><thead><tr><th></th><th>Perfect competition (Ch 8)</th><th>Monopolistic competition (Ch 12)</th><th>Oligopoly (Ch 12)</th><th>Monopoly (Ch 10)</th></tr></thead><tbody>
      <tr><td>Number of firms</td><td>Many</td><td>Many</td><td>Few</td><td>One</td></tr>
      <tr><td>Product</td><td>Identical</td><td>Differentiated</td><td>Identical or differentiated</td><td>Unique</td></tr>
      <tr><td>Barriers to entry</td><td>None</td><td>None</td><td>Some</td><td>Many</td></tr>
    </tbody></table></div>
    <p>Example: eggs. Many farmers sell an identical product, each too small to affect the price, so each is a <b>price taker</b>, and anyone can enter. Why study it? Some markets are close to it, it's the simplest case (the only decision is quantity), and it gives the largest total surplus. It's the efficiency benchmark for the other structures.</p>
  `;

  const s82 = `
    <div class="eq"><span class="lbl">Profit</span> π = TR − TC = P·q − TC(q)</div>
    <p><b>Marginal revenue</b> MR = ΔTR from one more unit. A price taker sells every unit at the market price, so <b>MR = P</b>: at $4 a dozen, each extra dozen adds $4. The MR curve is a horizontal line at the market price, which is set in the market (supply and demand), not by the firm.</p>
    <div class="callout key"><span class="tag">Profit-maximizing rule</span><p>Produce where <b>MR = MC</b>. For a competitive firm that means <b>P = MC</b>. While MR &gt; MC, one more unit adds MR − MC to profit (e.g. $4 − $3.60 = $0.40). Stop when the next unit would cost more than it brings in.</p></div>
    <h3>Profit or loss: compare P with ATC</h3>
    <div class="eq"><span class="lbl">Profit</span> (P − ATC) × q &nbsp;= TR area − TC area</div>
    <div class="table-wrap"><table><thead><tr><th>Price</th><th>At the chosen q</th><th>Profit</th></tr></thead><tbody>
      <tr><td>P &gt; min ATC</td><td>P &gt; ATC</td><td>Positive</td></tr>
      <tr><td>P = min ATC</td><td>P = ATC</td><td>Zero: break even</td></tr>
      <tr><td>P &lt; min ATC</td><td>P &lt; ATC</td><td>Loss</td></tr>
    </tbody></table></div>
    <h3>Losing money: operate or shut down? Compare P with AVC</h3>
    <p>Profit = (TR − VC) − FC. Shutting down still costs FC. So keep operating if TR &gt; VC, i.e. <b>P &gt; AVC</b>: the operating profit covers part of FC and the loss is smaller than FC. Example with FC = $500: TR $1,000 and VC $800 → loss $300 &lt; $500, operate. TR $400 and VC $500 → loss $600 &gt; $500, shut down.</p>
    <div class="table-wrap"><table><thead><tr><th>Price</th><th>Decision</th><th>Loss</th></tr></thead><tbody>
      <tr><td>P ≥ min AVC</td><td>Operate, q from P = MC</td><td>≤ FC</td></tr>
      <tr><td>P &lt; min AVC</td><td><b>Shut down temporarily</b>, q = 0</td><td>= FC</td></tr>
    </tbody></table></div>
    <div data-widget="profitMax"></div>
    <div class="callout def"><span class="tag">SR individual supply curve</span><p>The portion of the <b>MC curve above min AVC</b>. Below min AVC the firm supplies 0.</p></div>
    <h3>Numerical problems (Table 7.1: min AVC = $25, min ATC = $31.75, FC = $50)</h3>
    <p>Step 1: produce while MR − MC ≥ 0 (the quantity where MR − MC = 0, or the last positive value). Step 2: profit = (P − ATC) × q.</p>
    <div class="table-wrap"><table><thead><tr><th>Price</th><th>q</th><th>Result</th></tr></thead><tbody>
      <tr><td>$60 &gt; min ATC</td><td>10 (MC = $58; next unit costs $85)</td><td>Profit = $600 − $350 = <b>$250</b></td></tr>
      <tr><td>$31.75 = min ATC</td><td>8</td><td>Profit = <b>$0</b></td></tr>
      <tr><td>$28 (between $25 and $31.75)</td><td>7 (MC = $25; next is $29)</td><td>Profit = $196 − $225 = <b>−$29</b>, less than FC: operate</td></tr>
      <tr><td>$19 &lt; min AVC</td><td>0</td><td>Shut down: loss = <b>FC = $50</b></td></tr>
    </tbody></table></div>
  `;

  const s83 = `
    <p>With identical firms, <b>market supply = (each firm's quantity) × (number of firms)</b>. At P₁ each of 1,000 firms makes 4 units → 4,000; at a higher P₂ each makes 6 → 6,000. Market supply slopes up because each firm's MC does. In the SR the number of firms is fixed; entry shifts supply right and exit shifts it left over time.</p>
    <p>The <b>SR market equilibrium</b> price is where market demand = market supply. The firm then takes that price as its MR.</p>
  `;

  const s84 = `
    <p>A market is in <b>long-run equilibrium</b> when nothing is changing: the price is stable, so the number of firms is stable, so <b>long-run economic profit is zero</b>. Otherwise firms enter (if profit &gt; 0) or exit (if loss).</p>
    <div class="callout key"><span class="tag">Two conditions for LR equilibrium</span><ol><li>Demand = supply.</li><li><b>P = min LRATC</b> (so profit = 0).</li></ol></div>
    <div class="table-wrap"><table><thead><tr><th>Starting from LR equilibrium</th><th>SR effect on a firm</th><th>Number of firms</th><th>Market supply</th><th>Price in the LR</th></tr></thead><tbody>
      <tr><td>Demand increases</td><td>P ↑ above min LRATC: profit</td><td>↑ (entry)</td><td>↑ (shifts right)</td><td>Falls back to min LRATC</td></tr>
      <tr><td>Demand decreases</td><td>P ↓ below min LRATC: loss</td><td>↓ (exit)</td><td>↓ (shifts left)</td><td>Rises back to min LRATC</td></tr>
    </tbody></table></div>
    <div data-widget="marketLR"></div>
    <p>Cost changes work the same way: a higher input price raises min LRATC, so P must end up higher (some firms exit); technological progress lowers min LRATC, so P ends up lower.</p>
    <p class="muted">Looking ahead: to earn profit in the long run a firm needs barriers to entry (e.g. Microsoft's copyright on Windows). That's monopoly (Ch 10) and oligopoly (Ch 12).</p>
  `;

  const practice = [
    {
      source: 'Worksheet 1', title: 'Profit, break-even and loss', short: 'P vs ATC',
      prompt: '<p>Use the profit-maximization graph. Try P above, at and below min ATC.</p>',
      widget: '<div data-widget="profitMax"></div>',
      parts: [
        { l: 'a', q: 'P₁ > min ATC. Quantity and profit?', a: '<p>Choose q₁ where P₁ = MC. Since P₁ &gt; ATC at q₁, profit = (P₁ − ATC) × q₁ &gt; 0.</p>' },
        { l: 'b', q: 'P₂ = min ATC.', a: '<p>P = MC exactly at the bottom of ATC. P = ATC, so profit = 0 (break even).</p>' },
        { l: 'c', q: 'P₃ < min ATC.', a: '<p>Produce q₃ &lt; q₂ where P₃ = MC (if operating). P₃ &lt; ATC: a loss. Whether to operate depends on P vs min AVC.</p>' },
      ],
    },
    {
      source: 'Worksheet 1 Q2', title: 'Operate or shut down?', short: 'Shutdown rule',
      prompt: '<p>FC = $500 in both cases.</p>',
      parts: [
        { l: 'a', q: 'TR = $1,000, VC = $800.', a: '<p>Operating: (1,000 − 800) − 500 = <b>−$300</b>. Shut down: −$500. <b>Operate</b>; TR &gt; VC means P &gt; AVC.</p>' },
        { l: 'b', q: 'TR = $400, VC = $500.', a: '<p>Operating: (400 − 500) − 500 = <b>−$600</b>. Shut down: −$500. <b>Shut down</b>; TR &lt; VC means P &lt; AVC.</p>' },
      ],
    },
    {
      source: 'Worksheet 2', title: 'Profit maximization with Table 7.1', short: 'Table 7.1',
      prompt: '<p>FC = $50. MC for units 1–11: 50, 28, 20, 14, 18, 20, 25, 29, 38, 58, 85. ATC at q = 7, 8, 10: $32.14, $31.75, $35. AVC at 7: $25.</p>',
      parts: [
        { l: 'a', q: 'P = $60.', a: '<p>MR − MC is positive up to unit 10 ($60 − $58) and negative for unit 11 ($60 − $85). q = <b>10</b>. Profit = (60 − 35) × 10 = <b>$250</b>.</p>' },
        { l: 'b', q: 'P = $28.', a: '<p>Unit 7: 28 − 25 &gt; 0; unit 8: 28 − 29 &lt; 0. q = <b>7</b>. Profit = 28 × 7 − 225 = <b>−$29</b>. Loss is less than FC ($50), so <b>operate</b>.</p>' },
        { l: 'c', q: 'P = $19.', a: '<p>$19 &lt; min AVC = $25: <b>shut down</b>, q = 0, loss = FC = <b>$50</b>.</p>' },
        { l: 'd', q: 'Describe the firm\'s SR supply curve.', a: '<p>The MC curve above min AVC ($25); zero below $25.</p>' },
      ],
    },
    {
      source: 'Worksheet 3', title: 'Long-run adjustment', short: 'LR equilibrium',
      prompt: '<p>A competitive market starts in long-run equilibrium.</p>',
      widget: '<div data-widget="marketLR"></div>',
      parts: [
        { l: 'a', q: 'Demand increases. SR and LR effects?', a: '<p>SR: P rises above min LRATC, each firm raises q (P = MC) and earns a profit. LR: profit attracts entry, market supply shifts right, P falls back to min LRATC and profit returns to 0, with more firms and a larger market Q.</p>' },
        { l: 'b', q: 'An input price rises (e.g. wages).', a: '<p>MC and ATC shift up: at the old price firms make losses. Some exit, supply shifts left, P rises to the new, higher min LRATC. Profit is back to 0.</p>' },
        { l: 'c', q: 'Technological progress.', a: '<p>Costs fall: firms profit at the old price, entry follows, P falls to the new, lower min LRATC.</p>' },
      ],
    },
  ];

  const quiz = [
    { q: 'For a perfectly competitive firm, MR equals…', options: ['Zero', 'The market price', 'ATC', 'Half the price'], answer: 1, why: 'A price taker sells each extra unit at the market price, so MR = P.' },
    { q: 'A competitive firm maximizes profit by producing where…', options: ['P = ATC', 'P = MC', 'P = AVC', 'TR is largest'], answer: 1, why: 'MR = MC, and MR = P.' },
    { q: 'P = $10, and at the profit-maximizing q = 100, ATC = $8. Profit is…', options: ['$200', '$800', '$1,000', '−$200'], answer: 0, why: '(P − ATC) × q = (10 − 8) × 100 = $200.' },
    { q: 'If P = min ATC, the firm…', options: ['Shuts down', 'Makes a profit', 'Breaks even', 'Makes a loss larger than FC'], answer: 2, why: 'At the bottom of ATC, P = MC = ATC, so profit = 0.' },
    { q: 'P is below min ATC but above min AVC. The firm should…', options: ['Shut down', 'Keep producing where P = MC: the loss is less than FC', 'Raise its price', 'Produce at min ATC'], answer: 1, why: 'TR covers all variable cost and part of FC, so operating loses less than shutting down.' },
    { q: 'FC = $300, TR = $500, VC = $700. The firm should…', options: ['Operate: loss $500', 'Shut down: loss $300', 'Operate: loss $300', 'Shut down: loss $0'], answer: 1, why: 'Operating loses (500 − 700) − 300 = $500; shutting down loses only FC = $300. TR < VC means P < AVC.' },
    { q: 'A competitive firm\'s SR supply curve is…', options: ['The ATC curve', 'The MC curve above min AVC', 'The MC curve above min ATC', 'Horizontal at the price'], answer: 1, why: 'Above min AVC the firm operates and sets P = MC; below it supplies zero.' },
    { q: '1,000 identical firms each supply 6 units at P = $12. Market quantity supplied is…', options: ['6', '1,006', '6,000', '12,000'], answer: 2, why: 'Market supply = q per firm × number of firms = 6 × 1,000.' },
    { q: 'In LR competitive equilibrium…', options: ['Firms earn positive economic profit', 'P = min LRATC and economic profit = 0', 'P > MC', 'Firms keep entering'], answer: 1, why: 'Any profit attracts entry and any loss causes exit, until P = min LRATC.' },
    { q: 'Starting in LR equilibrium, demand rises. In the long run…', options: ['Price stays higher', 'Firms enter until price returns to min LRATC', 'Firms exit', 'Each firm earns permanent profit'], answer: 1, why: 'SR profit attracts entry; supply shifts right until P = min LRATC again.' },
    { q: 'Starting in LR equilibrium, demand falls. In the short run firms…', options: ['Earn profit', 'Make losses; in the LR some exit', 'Enter', 'Raise prices'], answer: 1, why: 'P drops below min LRATC; exit shifts supply left until P recovers.' },
    { q: 'Using Table 7.1 (min AVC $25), at P = $19 the firm\'s loss is…', options: ['$0', '$29', '$50 (its fixed cost)', '$19'], answer: 2, why: 'P < min AVC: shut down and lose FC = $50.' },
    { q: 'Which is NOT a feature of perfect competition?', options: ['Many firms', 'Identical products', 'Significant barriers to entry', 'Price-taking firms'], answer: 2, why: 'Perfect competition has free entry and exit.' },
  ];

  const cards = [
    { term: 'Perfect competition', def: 'Many firms, identical product, no barriers to entry; firms and buyers are price takers.' },
    { term: 'Marginal revenue (competitive)', def: 'MR = ΔTR from one more unit = market price P. The MR curve is horizontal at P.' },
    { term: 'Profit-maximizing rule', def: 'Produce where MR = MC; for a competitive firm, P = MC.' },
    { term: 'Profit formula', def: 'π = TR − TC = (P − ATC) × q.' },
    { term: 'Profit, break-even, loss', def: 'P > min ATC: profit. P = min ATC: zero. P < min ATC: loss.' },
    { term: 'Shutdown rule', def: 'Operate if P ≥ min AVC (TR ≥ VC, loss ≤ FC). Shut down temporarily if P < min AVC (loss = FC).' },
    { term: 'SR firm supply curve', def: 'The MC curve above min AVC; zero below min AVC.' },
    { term: 'SR market supply', def: 'Sum of firm supplies: q per firm × number of firms. Slopes up; shifts with entry and exit.' },
    { term: 'SR market equilibrium', def: 'Price where market demand = market supply; firms take that price.' },
    { term: 'LR equilibrium conditions', def: '(1) Demand = supply. (2) P = min LRATC, so economic profit = 0.' },
    { term: 'Entry and exit', def: 'Profit → entry → supply right → P falls. Loss → exit → supply left → P rises. Until P = min LRATC.' },
  ];

  const sheet = [
    { h: 'Profit', f: 'π = P·q − TC = (P − ATC)·q', p: 'Use the quantity from P = MC.' },
    { h: 'Quantity rule', f: 'MR = MC → P = MC', p: 'Numerically: keep producing while MR − MC ≥ 0.' },
    { h: 'Profit sign', f: 'P vs min ATC', p: 'Above: profit · equal: break even · below: loss.' },
    { h: 'Shutdown', f: 'P < min AVC → q = 0, loss = FC', p: 'P ≥ min AVC: operate, loss ≤ FC.' },
    { h: 'Supply', f: 'Firm: MC above min AVC · Market: q × n', p: 'Entry shifts market supply right, exit left.' },
    { h: 'LR equilibrium', f: 'D = S and P = min LRATC', p: 'Zero economic profit; no entry or exit.' },
  ];

  Study.registerChapter({
    id: 'ch8', number: 8, title: 'Profit Maximization and Competitive Supply',
    blurb: 'Market structures, P = MC, profit and loss areas, the shutdown rule, supply curves and long-run equilibrium.',
    intro: 'How a price-taking firm picks its output, when it should shut down, how firm supply adds up to market supply, and why entry and exit drive long-run profit to zero.',
    sections: [
      { id: 's81', num: '8.1', title: 'Market Structures and Perfect Competition', html: s81, takeaways: ['Perfect competition: many firms, identical product, no entry barriers, price takers.'] },
      { id: 's82', num: '8.2', title: 'Short-Run Profit Maximization', html: s82, takeaways: ['MR = P; produce where P = MC.', 'Profit = (P − ATC) × q.', 'Shut down if P < min AVC; SR supply = MC above min AVC.'] },
      { id: 's83', num: '8.3', title: 'Market Supply and SR Equilibrium', html: s83, takeaways: ['Market supply = q per firm × number of firms.'] },
      { id: 's84', num: '8.4', title: 'The Long Run', html: s84, takeaways: ['LR equilibrium: D = S and P = min LRATC (zero profit).', 'Entry and exit move price back to min LRATC.'] },
    ],
    practice, quiz, cards, sheet,
  });
})();
