/* Quiz 2 prep (Ch 6–7) and Midterm 2 prep (Ch 6–8).
   Questions are original, written in the style of the lecture worksheets and examples. */
(function () {
  const Q67 = [
    { ch: 6, q: 'q = L²K². With K = 1, what is MPL when L goes from 3 to 4?', options: ['4', '7', '9', '16'], answer: 1, why: 'q goes 9 → 16, so MPL = 7.' },
    { ch: 6, q: 'Output for L = 1, 2, 3 is 10, 30, 60. APL at L = 3 is…', options: ['30', '20', '60', '10'], answer: 1, why: 'APL = q/L = 60/3 = 20.' },
    { ch: 6, q: 'Current APL is 20 and the next worker\'s MPL is 15. APL will…', options: ['Rise', 'Fall', 'Stay at 20', 'Become 15'], answer: 1, why: 'MPL below APL pulls the average down (Table 6.1: L = 5, APL falls 20 → 19).' },
    { ch: 6, q: 'The main reason MPL eventually diminishes in the short run is…', options: ['Workers get tired', 'Capital is fixed', 'Wages rise', 'Technology improves'], answer: 1, why: 'With K fixed, extra workers have less capital each.' },
    { ch: 6, q: 'MPL = 8 and MPK = 2. The MRTS of L for K is…', options: ['0.25', '4', '6', '16'], answer: 1, why: 'MRTS = MPL/MPK = 8/2 = 4.' },
    { ch: 6, q: 'On the q = 5 isoquant of q = √(LK), K = 25/L. MRTS as L goes 1 → 2 is…', options: ['12.5', '25', '4.17', '2'], answer: 0, why: 'K falls from 25 to 12.5, so −ΔK/ΔL = 12.5.' },
    { ch: 6, q: 'Diminishing MRTS implies isoquants are…', options: ['Straight', 'L-shaped', 'Convex to the origin', 'Upward sloping'], answer: 2, why: 'Each extra worker replaces less K, so the isoquant flattens.' },
    { ch: 6, q: 'Compared with clothing (q = L<sup>¾</sup>K<sup>¼</sup>), car production (q = L<sup>¼</sup>K<sup>¾</sup>) has…', options: ['Steeper isoquants', 'Flatter isoquants and a smaller MRTS', 'The same MRTS', 'L-shaped isoquants'], answer: 1, why: 'Capital-intensive: MPL is small relative to MPK, so isoquants are flat.' },
    { ch: 6, q: 'q = L<sup>0.3</sup>K<sup>0.3</sup> exhibits…', options: ['IRTS', 'CRTS', 'DRTS', 'Constant MPL'], answer: 2, why: 'Exponents sum to 0.6 < 1; doubling inputs multiplies output by 2<sup>0.6</sup> ≈ 1.52.' },
    { ch: 6, q: 'Doubling all inputs triples output. This is…', options: ['CRTS', 'IRTS', 'DRTS', 'Diminishing MPL'], answer: 1, why: 'Output more than doubles: increasing returns to scale.' },
    { ch: 6, q: 'q = 10L<sup>0.4</sup>K<sup>0.6</sup>. Output at L = K = 1 is…', options: ['1', '5', '10', '20'], answer: 2, why: '10 × 1 × 1 = 10. Higher A lets fewer inputs make the same output.' },
    { ch: 7, q: 'An owner uses $50,000 of savings (could earn 4%) and gives up a $70,000 salary. Implicit costs are…', options: ['$2,000', '$70,000', '$72,000', '$120,000'], answer: 2, why: '$50,000 × 4% = $2,000 + $70,000 = $72,000.' },
    { ch: 7, q: 'Accounting profit is $90,000 and implicit costs are $100,000. Economic profit is…', options: ['$190,000', '$90,000', '−$10,000', '$10,000'], answer: 2, why: 'Economic profit = accounting profit − implicit costs = −$10,000.' },
    { ch: 7, q: 'A $120M machine lasts 20 years; interest is 5%. Rental price in year 1 is…', options: ['$6M', '$12M', '$120M', '$11M'], answer: 1, why: 'Depreciation $6M + interest forgone 5% × $120M = $6M → $12M.' },
    { ch: 7, q: 'W = $24 and MPL = 6 units/hour. MC is…', options: ['$144', '$4', '$30', '$0.25'], answer: 1, why: 'MC = W/MPL = 24/6 = $4.' },
    { ch: 7, q: 'FC = $50 and VC at q = 4 is $112. ATC is…', options: ['$28', '$40.50', '$12.50', '$162'], answer: 1, why: 'TC = 162; ATC = 162/4 = $40.50.' },
    { ch: 7, q: 'VC at q = 7 is $175 and at q = 8 is $204. MC of the 8th unit is…', options: ['$25', '$29', '$25.50', '$204'], answer: 1, why: 'MC = ΔVC = 204 − 175 = $29.' },
    { ch: 7, q: 'MC is above AVC. As output rises, AVC…', options: ['Falls', 'Rises', 'Is unchanged', 'Equals AFC'], answer: 1, why: 'A marginal above the average pulls it up.' },
    { ch: 7, q: 'W = $25, R = $50, C = $500. The isocost line has…', options: ['L-intercept 20, slope 0.5', 'L-intercept 10, slope 2', 'L-intercept 20, slope 2', 'K-intercept 20, slope 0.5'], answer: 0, why: 'L-intercept C/W = 20, K-intercept C/R = 10, slope W/R = 0.5.' },
    { ch: 7, q: 'At the current input mix MRTS = 4 and W/R = 2. To minimize cost the firm should…', options: ['Use more L, less K', 'Use more K, less L', 'Stay', 'Raise output'], answer: 0, why: 'A worker replaces 4 units of K but costs only 2: labour is a bargain, so substitute L for K.' },
    { ch: 7, q: 'The cost-minimizing input mix satisfies…', options: ['MPL = MPK', 'MPL/W = MPK/R', 'W = R', 'MRTS = R/W'], answer: 1, why: 'MRTS = W/R ⇔ MPL/MPK = W/R ⇔ MPL/W = MPK/R.' },
    { ch: 7, q: 'Wages rise. In the long run a cost-minimizing firm…', options: ['Hires more workers', 'Substitutes capital for labour', 'Keeps the same inputs', 'Cuts capital'], answer: 1, why: 'The isocost gets steeper; the tangency moves to more K, less L.' },
    { ch: 7, q: 'Inputs double and output rises by 50%. LRATC…', options: ['Falls', 'Rises: diseconomies of scale', 'Stays the same', 'Halves'], answer: 1, why: 'Cost doubles but output only ×1.5, so cost per unit rises (DRTS).' },
    { ch: 7, q: 'A firm built a large plant but demand is small. Its SRATC is…', options: ['Below LRATC', 'Equal to LRATC', 'Above LRATC', 'Equal to MC'], answer: 2, why: 'The plant isn\'t the cheapest size for that output and can\'t be changed in the SR.' },
  ];
  const Q8 = [
    { ch: 8, q: 'For a competitive firm, MR equals…', options: ['ATC', 'The market price', 'MC always', 'Zero'], answer: 1, why: 'A price taker sells each extra unit at P.' },
    { ch: 8, q: 'P = $15. At the q where P = MC, ATC = $12 and q = 50. Profit is…', options: ['$750', '$150', '$600', '−$150'], answer: 1, why: '(15 − 12) × 50 = $150.' },
    { ch: 8, q: 'min ATC = $30, min AVC = $22, P = $26. The firm…', options: ['Makes a profit', 'Breaks even', 'Makes a loss but keeps operating', 'Shuts down'], answer: 2, why: 'P < min ATC means a loss; P > min AVC means TR covers VC, so operating loses less than FC.' },
    { ch: 8, q: 'min AVC = $22 and P = $18. The firm\'s loss equals…', options: ['$0', 'Its fixed cost', 'Its variable cost', 'TR'], answer: 1, why: 'P < min AVC: shut down; the loss is FC.' },
    { ch: 8, q: 'FC = $400, TR = $900, VC = $700. Should it operate?', options: ['Yes: loss $200 < $400', 'No: shut down', 'Yes: profit $200', 'No: loss $1,100'], answer: 0, why: '(900 − 700) − 400 = −$200, better than −$400 from shutting down.' },
    { ch: 8, q: 'Table 7.1, P = $60: MC of units 10 and 11 is $58 and $85. The firm produces…', options: ['8', '9', '10', '11'], answer: 2, why: 'Unit 10 adds $2 to profit (60 − 58); unit 11 would lose $25.' },
    { ch: 8, q: 'A competitive firm\'s SR supply curve is…', options: ['MC above min ATC', 'MC above min AVC', 'The ATC curve', 'Vertical'], answer: 1, why: 'It operates (P = MC) whenever P ≥ min AVC.' },
    { ch: 8, q: '500 identical firms each produce 8 units at P = $20. Market supply at $20 is…', options: ['8', '508', '4,000', '10,000'], answer: 2, why: '8 × 500 = 4,000.' },
    { ch: 8, q: 'Long-run competitive equilibrium requires…', options: ['P = min LRATC and D = S', 'P > ATC', 'Barriers to entry', 'P = MR > MC'], answer: 0, why: 'Zero economic profit (no entry or exit) and market clearing.' },
    { ch: 8, q: 'From LR equilibrium, demand increases. The LR result is…', options: ['Higher price, same number of firms', 'Same price (min LRATC), more firms', 'Lower price, fewer firms', 'Permanent profit'], answer: 1, why: 'SR profit draws entry until P returns to min LRATC.' },
    { ch: 8, q: 'Technological progress lowers costs in a competitive industry. In the LR the price…', options: ['Rises', 'Falls to the new min LRATC', 'Stays the same', 'Equals AFC'], answer: 1, why: 'Profit at the old price attracts entry until P = the new, lower min LRATC.' },
  ];
  const plan = (what, mins) => [
    ['10 min', 'Read the cram sheet: formulas and traps.'],
    [mins + ' min', `Take the practice ${what} with the timer on. No notes.`],
    ['20 min', 'Review every question you missed; each has a worked solution.'],
    ['Rest', 'Redo the chapter quizzes and drag the cost and profit graphs for the topics you missed.'],
  ];
  const F67 = [
    ['MPL, APL', 'MPL = Δq/ΔL · APL = q/L · MPL > APL → APL ↑'],
    ['MRTS of L for K', '−ΔK/ΔL = MPL/MPK = slope of isoquant (diminishing → convex)'],
    ['Cobb–Douglas q = L<sup>a</sup>K<sup>b</sup>', 'MRTS = (a/b)(K/L) · a + b vs 1 → returns to scale'],
    ['Economic profit', 'Accounting profit − implicit costs (interest forgone, salary forgone)'],
    ['Rental price of capital', 'Depreciation + interest forgone'],
    ['SR costs', 'TC = VC + FC · ATC = AVC + AFC · TC = ATC × q · MC = ΔTC/Δq'],
    ['Productivity → cost', 'MC = W/MPL · MC cuts AVC and ATC at their minimums'],
    ['Isocost', 'WL + RK = C · intercepts C/W, C/R · slope W/R'],
    ['Cost minimization', 'MRTS = W/R ⇔ MPL/W = MPK/R · MRTS > W/R → more L'],
    ['Scale', 'IRTS → LRATC ↓ · DRTS → LRATC ↑ · SRATC ≥ LRATC'],
  ];
  const F8 = [
    ['Profit maximization', 'MR = MC → P = MC · profit = (P − ATC) × q'],
    ['Shutdown', 'P < min AVC → q = 0, loss = FC · supply = MC above min AVC'],
    ['LR equilibrium', 'D = S and P = min LRATC (zero profit)'],
  ];
  const T67 = [
    'Diminishing MPL (SR, K fixed) is not the same as decreasing returns to scale (LR, all inputs scaled).',
    'MRTS of L for K = MPL/<b>MPK</b>, not the other way round; L is on the horizontal axis.',
    'Economic profit subtracts <b>implicit</b> costs too; it is smaller than accounting profit.',
    'The rental price of capital is not the purchase price: depreciation + interest forgone.',
    'MC = W/<b>MPL</b>: higher productivity means <b>lower</b> marginal cost.',
    'Isocost slope is W/R (labour on the horizontal axis). MRTS > W/R → use <b>more labour</b>.',
    'There is no fixed cost in the long run.',
  ];
  const T8 = [
    'Profit or loss: compare P with <b>ATC</b>. Operate or shut down: compare P with <b>AVC</b>.',
    'A firm making a loss can still be right to operate in the SR (if P ≥ min AVC).',
  ];
  Study.registerPrep({ id: 'q2', assessment: 'q2', title: 'Quiz 2 prep', minutes: 30, plan: plan('quiz', 30), formulas: F67, traps: T67, questions: Q67 });
  Study.registerPrep({ id: 'm2', assessment: 'm2', title: 'Midterm 2 prep', minutes: 50, plan: plan('midterm', 50), formulas: [...F67, ...F8], traps: [...T67, ...T8], questions: [...Q67, ...Q8] });
})();
