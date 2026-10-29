/* Formula drill: numeric questions with fresh random numbers, instant checking and
   step-by-step solutions. Generators live in chapters/chN/formulas.js as FORMULA_DRILLS[chId]. */
(function () {
  const { mk, verdict } = UI;
  Study.registerWidget('formulaDrill', (root, opts) => {
    const gens = (window.FORMULA_DRILLS || {})[opts.ch] || [];
    root.classList.add('lab', 'drill');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Practice</span><h4>Formula drill: new numbers every time</h4>
      <p>Type your answer and press <b>Check</b>. You'll see the formula and every step. <b>New question</b> gives fresh numbers. Pick a topic to focus on one formula.</p></div>
      <div class="chip-row drill-topics"></div><div class="drill-card"></div><p class="lab-note drill-score"></p>`;
    const topics = root.querySelector('.drill-topics'), card = root.querySelector('.drill-card'), scoreEl = root.querySelector('.drill-score');
    let topic = -1, prob, gen, right = 0, tries = 0, answered = false;
    const labels = ['All topics', ...gens.map((g) => g.title)];
    labels.forEach((l, i) => {
      const b = mk(`<button class="chip" aria-pressed="${i === 0}">${l}</button>`);
      b.onclick = () => { topic = i - 1; topics.querySelectorAll('.chip').forEach((x, k) => x.setAttribute('aria-pressed', String(k === i))); next(); };
      topics.appendChild(b);
    });
    function next() {
      gen = topic >= 0 ? gens[topic] : gens[Math.floor(Math.random() * gens.length)];
      prob = gen.make();
      answered = false;
      const id = UI.nextId('drill');
      card.innerHTML = `<p class="eyebrow">${gen.title}</p><p class="drill-q">${prob.q}</p>
        <div class="drill-in"><label for="${id}" class="sr">Your answer</label>${prob.prefix ? `<span>${prob.prefix}</span>` : ''}<input id="${id}" type="number" step="any" inputmode="decimal" placeholder="Your answer">${prob.unit ? `<span>${prob.unit}</span>` : ''}
        <button class="btn primary" data-a="check">Check</button><button class="btn" data-a="show">Show solution</button><button class="btn" data-a="new">New question</button></div><div class="drill-out"></div>`;
      const inp = card.querySelector('input');
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      card.querySelector('[data-a=check]').onclick = check;
      card.querySelector('[data-a=show]').onclick = () => reveal(null);
      card.querySelector('[data-a=new]').onclick = next;
    }
    function check() {
      const v = parseFloat(card.querySelector('input').value);
      if (!isFinite(v)) { card.querySelector('.drill-out').innerHTML = '<p class="lab-note">Type a number first.</p>'; return; }
      reveal(v);
    }
    function reveal(v) {
      const tol = Math.max(prob.tol ?? 0.011, Math.abs(prob.answer) * 0.01);
      const ok = v != null && Math.abs(v - prob.answer) <= tol;
      if (v != null && !answered) { tries++; if (ok) right++; answered = true; }
      const out = card.querySelector('.drill-out');
      out.innerHTML = '';
      const vd = verdict(out);
      vd.set(v == null ? '' : ok ? 'good' : 'bad', `${v == null ? '' : ok ? '<b>Correct.</b> ' : `<b>Not quite</b> (you entered ${v}). `}Answer: <b>${prob.show ?? prob.answer}</b>
        <div class="drill-formula">${prob.formula}</div><ol class="fx-steps">${prob.steps.map((s) => `<li>${s}</li>`).join('')}</ol>`);
      scoreEl.textContent = tries ? `This session: ${right} of ${tries} correct.` : '';
    }
    if (gens.length) next(); else card.innerHTML = '<p class="muted">No drill questions for this chapter yet.</p>';
  });
})();
