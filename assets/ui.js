/* Shared controls for interactive figures: a lab shell, sliders, chips, readouts, verdicts. */
window.UI = (function () {
  const { fmt } = Graph;
  let wid = 0;
  const nextId = (p) => p + (++wid);
  function mk(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function shell(root, title, hint, stack) {
    root.classList.add('lab');
    if (stack) root.classList.add('stack');
    root.innerHTML = `<div class="lab-head"><span class="lab-tag">Interactive</span><h4>${title}</h4>${hint ? `<p>${hint}</p>` : ''}</div>
      <div class="lab-body"><div class="lab-plot"></div><div class="lab-side"></div></div>`;
    return { plotEl: root.querySelector('.lab-plot'), side: root.querySelector('.lab-side') };
  }
  function slider(parent, { label, min, max, step, value, format = (v) => fmt(v), onInput }) {
    const id = nextId('ctl');
    const wrap = mk(`<div class="ctl"><div class="ctl-row"><label for="${id}">${label}</label><output for="${id}"></output></div>
      <input type="range" id="${id}" min="${min}" max="${max}" step="${step}"></div>`);
    parent.appendChild(wrap);
    const inp = wrap.querySelector('input'), out = wrap.querySelector('output');
    const api = {
      v: value, el: wrap,
      set(v) { api.v = v; inp.value = v; out.textContent = format(v); },
    };
    inp.addEventListener('input', () => { api.v = +inp.value; out.textContent = format(api.v); onInput(api.v); });
    api.set(value);
    return api;
  }
  function chips(parent, labels, onPick, { multi = false, active = [] } = {}) {
    const row = mk('<div class="chip-row"></div>');
    parent.appendChild(row);
    const btns = labels.map((l, i) => {
      const b = mk(`<button class="chip" aria-pressed="${active.includes(i)}"><span>${l}</span></button>`);
      b.addEventListener('click', () => {
        if (multi) b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
        else btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        onPick(i, b.getAttribute('aria-pressed') === 'true');
      });
      row.appendChild(b);
      return b;
    });
    return { row, btns, clear() { btns.forEach((b) => b.setAttribute('aria-pressed', 'false')); }, setActive(i) { btns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i))); } };
  }
  function check(parent, label, checked, onChange) {
    const id = nextId('chk');
    const w = mk(`<label class="check" for="${id}"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''}> ${label}</label>`);
    parent.appendChild(w);
    const inp = w.querySelector('input');
    inp.addEventListener('change', () => onChange(inp.checked));
    return inp;
  }
  function readout(parent) {
    const d = mk('<dl class="readout"></dl>');
    parent.appendChild(d);
    return { el: d, set(rows) { d.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join(''); } };
  }
  function verdict(parent) {
    const d = mk('<div class="verdict" aria-live="polite"></div>');
    parent.appendChild(d);
    return { el: d, set(kind, html) { d.className = 'verdict' + (kind ? ' v-' + kind : ''); d.innerHTML = html; d.hidden = !html; } };
  }
  function button(parent, label, onClick, primary) {
    const b = mk(`<button class="btn${primary ? ' primary' : ''}"><span>${label}</span></button>`);
    b.addEventListener('click', onClick);
    parent.appendChild(b);
    return b;
  }
  function row(parent) { const r = mk('<div class="btn-row"></div>'); parent.appendChild(r); return r; }
  function note(parent, html) { const n = mk(`<p class="lab-note">${html}</p>`); parent.appendChild(n); return n; }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return { mk, shell, slider, chips, check, readout, verdict, button, row, note, cap, nextId };
})();
