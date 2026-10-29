/* Chapter 8: alternative methods for each formula, plus multi-step word problems. */
(function () {
  const ALT = {
    'Total and marginal revenue': ['On a graph: the MR curve of a competitive firm is a horizontal line at the market price.'],
    'Profit-maximizing quantity': ['On a graph: where the price line crosses the <i>rising</i> part of the MC curve.', 'Brute force: compute π = TR − TC at every q and pick the biggest. Same answer, more work.'],
    'Profit': ['TR − TC directly: 600 − 350 = $250.', 'On a graph: a rectangle with height (P − ATC) and width q.'],
    'Loss and the shutdown rule': ['Per-unit test: at the chosen q, P > AVC is the same as TR > VC.', 'Quick test from a table: compare P with min AVC.'],
    'Reading the price against costs': ['Four cases: P > min ATC → profit. P = min ATC → break even. min AVC ≤ P < min ATC → loss, but operate. P < min AVC → shut down.'],
    'Market supply': ['On a graph: add every firm\'s supply curve sideways (horizontally) at each price.'],
    'Long-run equilibrium': ['Tell the story: profit → firms enter → supply shifts right → P falls until P = min LRATC. Losses run it in reverse.'],
  };
  (window.FORMULAS.ch8 || []).forEach((f) => { if (ALT[f.name]) f.alt = ALT[f.name]; });

  (window.WORD_PROBLEMS = window.WORD_PROBLEMS || {}).ch8 = [
    {
      source: 'Word problem', title: 'The strawberry farm', short: 'WP: Profit max',
      prompt: '<p>A small strawberry farm sells in a competitive market. FC = $20. Total cost for 0–6 boxes: $20, 26, 30, 36, 44, 56, 72.</p>',
      parts: [
        { l: 'a', q: 'Find MC, AVC and ATC for each box.', a: '<p>MC: 6, 4, 6, 8, 12, 16. VC = TC − 20: 6, 10, 16, 24, 36, 52, so AVC: 6, 5, 5.33, 6, 7.20, 8.67. ATC: 26, 15, 12, 11, 11.20, 12. Min AVC = <b>$5</b> (q = 2), min ATC = <b>$11</b> (q = 4).</p>' },
        { l: 'b', q: 'P = $8. How many boxes, and what is profit?', a: '<p>Produce while MC ≤ 8 on the rising part: q = <b>4</b> (box 5 costs $12). π = 8 × 4 − 44 = <b>−$12</b>. A loss, but P &gt; min AVC, and −$12 is better than −$20 from shutting down. <b>Operate.</b></p>' },
        { l: 'c', q: 'P = $12?', a: '<p>q = <b>5</b> (box 6 costs $16). π = 60 − 56 = <b>$4</b> profit.</p>' },
        { l: 'd', q: 'P = $4?', a: '<p>$4 &lt; min AVC $5: <b>shut down</b>, loss = FC = $20.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'Ski shop in the off-season', short: 'WP: Shutdown',
      prompt: '<p>A ski rental shop pays $3,000 a month in rent no matter what (FC). If it stays open in May, staff and utilities cost $6,500 (VC).</p>',
      parts: [
        { l: 'a', q: 'May revenue would be $5,000. Open or close?', a: '<p>Open: (5,000 − 6,500) − 3,000 = −$4,500. Closed: −$3,000. <b>Close</b>: revenue doesn\'t cover VC.</p>' },
        { l: 'b', q: 'What if revenue is $7,000?', a: '<p>Open: (7,000 − 6,500) − 3,000 = −$2,500, better than −$3,000. <b>Stay open</b>: the $500 operating profit chips away at the rent.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'The egg market, short run to long run', short: 'WP: Market & LR',
      prompt: '<p>200 identical egg farms each supply q = P − 2 (thousand dozen) when P ≥ $3. Market demand is Q = 2,000 − 100P.</p>',
      parts: [
        { l: 'a', q: 'Write market supply and find the SR equilibrium.', a: '<p>Q<sub>S</sub> = 200(P − 2) = 200P − 400. Set equal to demand: 200P − 400 = 2,000 − 100P, so 300P = 2,400, giving <b>P = $8</b>, Q = 1,200, and each farm makes 6.</p>' },
        { l: 'b', q: 'Each farm\'s min LRATC is $5 at q* = 3. Is the market in LR equilibrium?', a: '<p>No: P = $8 &gt; $5, so farms earn profit and new farms will enter.</p>' },
        { l: 'c', q: 'In the long run, what is P, market Q, and the number of farms?', a: '<p>P = min LRATC = <b>$5</b>. Demand at $5: 2,000 − 500 = <b>1,500</b>. Farms = 1,500 ÷ 3 = <b>500</b>, so 300 enter.</p>' },
      ],
    },
    {
      source: 'Word problem', title: 'Price drop at a T-shirt maker', short: 'WP: Profit area',
      prompt: '<p>A competitive T-shirt maker sells 200 shirts at $40 with ATC = $35. Then the price falls to $30; it now makes 160 shirts with ATC = $34 and AVC = $28.</p>',
      parts: [
        { l: 'a', q: 'Profit at $40?', a: '<p>(40 − 35) × 200 = <b>$1,000</b>.</p>' },
        { l: 'b', q: 'Profit at $30? Should it keep operating?', a: '<p>(30 − 34) × 160 = <b>−$640</b>. P = $30 &gt; AVC = $28, so TR covers VC: <b>keep operating</b> (FC = (34 − 28) × 160 = $960, a bigger loss if it shut down).</p>' },
      ],
    },
  ];
})();
