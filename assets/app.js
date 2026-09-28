/* App shell: registry for chapters and interactive widgets, hash router, and the
   Lessons / Practice / Quiz / Flashcards / Formula sheet views. */
window.Study = (function () {
  const chapters = [];
  const widgets = {};
  const course = { code: 'ECON 281', title: 'Intermediate Microeconomics', exams: [], outline: [], plannedChapters: [] };

  const store = {
    get(k, d) { try { const v = localStorage.getItem('econ281:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('econ281:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const TABS = [['', 'Lessons'], ['practice', 'Practice'], ['quiz', 'Quiz'], ['cards', 'Flashcards'], ['sheet', 'Formula sheet']];

  function registerChapter(c) { chapters.push(c); chapters.sort((a, b) => a.number - b.number); }
  function registerWidget(name, fn) { widgets[name] = fn; }
  function setCourse(c) { Object.assign(course, c); }

  function mountWidgets(root) {
    root.querySelectorAll('[data-widget]').forEach((el) => {
      const fn = widgets[el.dataset.widget];
      if (!fn) { el.innerHTML = `<p class="muted">Interactive "${esc(el.dataset.widget)}" is not available.</p>`; return; }
      try { fn(el, Object.assign({}, el.dataset)); }
      catch (e) { console.error(e); el.innerHTML = '<p class="muted">This interactive figure failed to load. Reload the page to try again.</p>'; }
    });
  }

  /* ---------- Routing ---------- */
  function parse() {
    const h = decodeURIComponent((location.hash || '').slice(1));
    const m = /^(ch\d+)(?:-(practice|quiz|cards|sheet))?$/.exec(h);
    if (m && chapters.find((c) => c.id === m[1])) return { view: 'chapter', ch: m[1], tab: m[2] || '' };
    return { view: 'home' };
  }
  function render() {
    const r = parse();
    renderNav(r);
    const main = document.getElementById('main');
    main.innerHTML = '';
    if (r.view === 'home') renderHome(main);
    else renderChapter(main, chapters.find((c) => c.id === r.ch), r.tab);
    document.body.classList.remove('nav-open');
    window.scrollTo(0, 0);
  }

  function renderNav(r) {
    const nav = document.getElementById('nav');
    const cur = (href) => {
      const h = (location.hash || '#home');
      return (h === href || (href === '#home' && r.view === 'home')) ? ' aria-current="page"' : '';
    };
    let html = `<div class="nav-group"><a class="nav-link" href="#home"${cur('#home')}>Course home</a></div>`;
    html += `<div class="nav-group"><div class="nav-group-title">Chapters</div>`;
    for (const c of chapters) {
      html += `<a class="nav-link" href="#${c.id}"${r.view === 'chapter' && r.ch === c.id && !r.tab ? ' aria-current="page"' : ''}><span class="num">Ch ${c.number}</span>${esc(c.title)}</a>`;
      if (r.view === 'chapter' && r.ch === c.id) {
        html += '<div class="nav-sub">';
        for (const [t, name] of TABS.slice(1)) {
          html += `<a class="nav-link" href="#${c.id}-${t}"${r.tab === t ? ' aria-current="page"' : ''}>${name}</a>`;
        }
        html += '</div>';
      }
    }
    html += '</div>';
    nav.innerHTML = html;
  }

  /* ---------- Home ---------- */
  function daysUntil(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((d - now) / 86400000);
  }
  function renderHome(main) {
    const exams = [...course.exams].sort((a, b) => (a.date > b.date ? 1 : -1));
    const examHtml = exams.length
      ? exams.map((e) => {
          const n = daysUntil(e.date);
          const when = new Date(e.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
          const covers = (e.covers || []).map((id) => { const c = chapters.find((x) => x.id === id); return c ? `Ch ${c.number}` : id; }).join(', ');
          return `<div class="exam${n < 0 ? ' past' : ''}"><div class="days">${n < 0 ? '✓' : n}<small>${n < 0 ? 'done' : n === 1 ? 'day' : 'days'}</small></div>
            <div><b>${esc(e.name)}</b><div class="muted" style="font-size:14px">${when}${e.time ? ' · ' + esc(e.time) : ''}${e.location ? ' · ' + esc(e.location) : ''}</div>${covers ? `<div class="muted" style="font-size:14px">Covers ${covers}</div>` : ''}</div></div>`;
        }).join('')
      : `<div class="empty"><b>No exam dates yet.</b>Add them in <span class="mono">data/course.js</span> and a countdown appears here.</div>`;

    const outlineHtml = course.outline.length
      ? course.outline.map((o) => `<div class="outline-row"><div class="wk">${esc(o.week != null ? 'Wk ' + o.week : o.label || '')}</div><div>${esc(o.topic)}</div></div>`).join('')
      : `<div class="empty"><b>Course outline not added yet.</b>Weekly topics go in <span class="mono">data/course.js</span>.</div>`;

    const chCards = chapters.map((c) => {
      const best = store.get('quiz:' + c.id, null);
      const known = store.get('cards:' + c.id, []).length;
      return `<article class="chapter-card"><div class="big">${c.number}</div><div class="body">
        <p class="eyebrow">Chapter ${c.number}</p><h3>${esc(c.title)}</h3><p class="muted">${c.blurb}</p>
        <div class="secs">${c.sections.map((s) => `<span>${esc(s.num)} ${esc(s.title)}</span>`).join('')}</div>
        <div class="stat-row"><span class="stat"><b>${c.labCount || 0}</b> interactive graphs</span><span class="stat"><b>${c.practice.length}</b> practice problems</span>
        <span class="stat">Quiz best <b>${best == null ? '–' : best + '/' + c.quiz.length}</b></span><span class="stat">Cards known <b>${known}/${c.cards.length}</b></span></div>
        <div class="btn-row"><a class="btn primary" href="#${c.id}">Start the lessons</a><a class="btn" href="#${c.id}-practice">Practice</a><a class="btn" href="#${c.id}-quiz">Quiz</a><a class="btn" href="#${c.id}-cards">Flashcards</a></div>
      </div></article>`;
    }).join('');
    const soon = course.plannedChapters.length
      ? course.plannedChapters.map((p) => `<article class="chapter-card soon"><div class="big">${p.number}</div><div class="body"><p class="eyebrow">Chapter ${p.number}</p><h3>${esc(p.title)}</h3><p class="muted">Coming soon.</p></div></article>`).join('')
      : `<article class="chapter-card soon"><div class="big">+</div><div class="body"><h3>More chapters on the way</h3><p class="muted">New chapters appear here as the course slides are added.</p></div></article>`;

    main.innerHTML = `<div class="page">
      <header class="hero"><p class="eyebrow">${esc(course.code)} · ${esc(course.title)}</p>
        <h1>Study Lab<span class="axis-mark">.</span></h1>
        <p class="lede">Lecture notes organized by chapter, with graphs you can drag and change. Move a price, watch the budget line pivot. Drag a bundle, watch the indifference curve follow it to the optimum.</p></header>
      <div class="home-grid">
        <section class="panel"><h2>Upcoming exams</h2>${examHtml}</section>
        <section class="panel"><h2>Course outline</h2>${outlineHtml}</section>
      </div>
      <section style="display:grid;gap:14px"><h2 style="font-size:24px">Chapters</h2>${chCards}${soon}</section>
      <section class="panel"><h2>How to use this</h2>
        <div class="cards3">
          <div class="mini"><h4>1 · Read and play</h4><p>Each lesson follows the lecture order. Every graph with a blue handle can be dragged or changed with sliders.</p></div>
          <div class="mini"><h4>2 · Practice</h4><p>Worksheet and exercise questions with worked answers hidden until you want them.</p></div>
          <div class="mini"><h4>3 · Check yourself</h4><p>The quiz explains every answer. Flashcards track which terms you know on this device.</p></div>
        </div></section>
    </div>`;
  }

  /* ---------- Chapter ---------- */
  function renderChapter(main, ch, tab) {
    const tabs = TABS.map(([t, name]) => `<a href="#${ch.id}${t ? '-' + t : ''}"${t === tab ? ' aria-current="page"' : ''}>${name}</a>`).join('');
    main.innerHTML = `<div class="page"><header class="ch-head"><p class="eyebrow">Chapter ${ch.number}</p><h1>${esc(ch.title)}</h1></header>
      <nav class="tabs" aria-label="Chapter sections">${tabs}</nav><div id="view" style="display:grid;gap:28px"></div></div>`;
    const view = main.querySelector('#view');
    ({ '': lessons, practice, quiz, cards, sheet })[tab](view, ch);
  }

  function lessons(view, ch) {
    const toc = ch.sections.map((s) => `<button class="chip" data-jump="${ch.id}-${s.id}">${esc(s.num)} ${esc(s.title)}</button>`).join('');
    view.innerHTML = `<p class="lede">${ch.intro}</p><div class="toc">${toc}</div>` +
      ch.sections.map((s) => `<section class="lesson" id="${ch.id}-${s.id}"><h2><span class="sec">${esc(s.num)}</span>${esc(s.title)}</h2>
        <div class="prose">${s.html}</div>
        ${s.takeaways ? `<div class="takeaways"><h4>Takeaways</h4><ul>${s.takeaways.map((t) => `<li>${t}</li>`).join('')}</ul></div>` : ''}</section>`).join('') +
      `<div class="btn-row"><a class="btn primary" href="#${ch.id}-practice">Next: practice problems →</a></div>`;
    view.querySelectorAll('[data-jump]').forEach((b) => b.addEventListener('click', () => document.getElementById(b.dataset.jump).scrollIntoView()));
    mountWidgets(view);
  }

  function practice(view, ch) {
    view.innerHTML = `<p class="lede">Questions from the worksheets and the Chapter ${ch.number} exercises. Try each part first, then open the answer. Graphs are live, so you can test your reasoning.</p>
      <div class="toc">${ch.practice.map((p, i) => `<button class="chip" data-jump="${ch.id}-p${i}">${esc(p.short || p.title)}</button>`).join('')}</div>` +
      ch.practice.map((p, i) => `<article class="problem" id="${ch.id}-p${i}"><div class="problem-head"><span class="src">${esc(p.source)}</span><h3>${esc(p.title)}</h3></div>
        <div class="prose">${p.prompt}</div>
        ${p.widget || ''}
        ${p.parts ? `<ol class="parts">${p.parts.map((pt) => `<li class="part"><div class="q"><span class="l">${pt.l}.</span><div>${pt.q}</div></div>
          <details class="ans"><summary>Show answer</summary><div class="a">${pt.a}</div></details></li>`).join('')}</ol>` : ''}
      </article>`).join('');
    view.querySelectorAll('[data-jump]').forEach((b) => b.addEventListener('click', () => document.getElementById(b.dataset.jump).scrollIntoView()));
    mountWidgets(view);
  }

  function quiz(view, ch) {
    const key = 'quiz:' + ch.id;
    let order, i, score, missed;
    function start(indices) { order = indices; i = 0; score = 0; missed = []; show(); }
    function show() {
      if (i >= order.length) return finish();
      const q = ch.quiz[order[i]];
      view.innerHTML = `<div class="quiz"><div class="quiz-bar"><span>Question ${i + 1} of ${order.length}</span><div class="track"><div class="fill" style="width:${(i / order.length) * 100}%"></div></div><span>${score} correct</span></div>
        <div class="qcard"><h2>${q.q}</h2><div class="opts">${q.options.map((o, k) => `<button class="opt" data-k="${k}"><span class="k">${'ABCDE'[k]}</span><span>${o}</span></button>`).join('')}</div>
        <div id="after"></div></div></div>`;
      view.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => answer(+b.dataset.k)));
    }
    function answer(k) {
      const q = ch.quiz[order[i]];
      const ok = k === q.answer;
      if (ok) score++; else missed.push(order[i]);
      view.querySelectorAll('.opt').forEach((b) => {
        b.disabled = true;
        const bk = +b.dataset.k;
        if (bk === q.answer) b.classList.add('right'); else if (bk === k) b.classList.add('wrong');
      });
      view.querySelector('.quiz-bar span:last-child').textContent = score + ' correct';
      const after = view.querySelector('#after');
      after.innerHTML = `<div class="explain"><b>${ok ? 'Correct.' : 'Not quite.'}</b> ${q.why}</div>
        <div class="btn-row" style="margin-top:12px"><button class="btn primary" id="next">${i + 1 < order.length ? 'Next question →' : 'See my score'}</button></div>`;
      const nb = after.querySelector('#next');
      nb.addEventListener('click', () => { i++; show(); });
      nb.focus();
    }
    function finish() {
      if (order.length === ch.quiz.length) {
        const best = store.get(key, null);
        if (best == null || score > best) store.set(key, score);
      }
      const best = store.get(key, null);
      view.innerHTML = `<div class="quiz"><div class="qcard"><p class="eyebrow">Your score</p><div class="score-big">${score}/${order.length}</div>
        <p class="muted">${score === order.length ? 'Every question right.' : missed.length + ' to review below.'}${best != null ? ` Best full-quiz score on this device: ${best}/${ch.quiz.length}.` : ''}</p>
        <div class="btn-row"><button class="btn primary" id="again">Retake all ${ch.quiz.length}</button>${missed.length ? '<button class="btn" id="miss">Retry the ones I missed</button>' : ''}</div></div>
        ${missed.length ? `<div class="missed"><h3 style="font-size:18px">Review</h3>${missed.map((m) => { const q = ch.quiz[m]; return `<div class="item"><b>${q.q}</b><span>Answer: ${q.options[q.answer]}</span><span class="muted">${q.why}</span></div>`; }).join('')}</div>` : ''}</div>`;
      const m = [...missed];
      view.querySelector('#again').addEventListener('click', () => start(ch.quiz.map((_, k) => k)));
      const mb = view.querySelector('#miss');
      if (mb) mb.addEventListener('click', () => start(m));
    }
    start(ch.quiz.map((_, k) => k));
  }

  function cards(view, ch) {
    const key = 'cards:' + ch.id;
    let known = new Set(store.get(key, []));
    let onlyLearning = false, deck, i = 0, flipped = false;
    function build() {
      deck = ch.cards.map((_, k) => k).filter((k) => !onlyLearning || !known.has(k));
      i = Math.min(i, Math.max(0, deck.length - 1));
    }
    function save() { store.set(key, [...known]); }
    function draw() {
      if (!deck.length) {
        view.innerHTML = `<div class="fc-wrap"><div class="qcard"><h2>You marked every card as known.</h2><p class="muted">Show all cards again to keep reviewing.</p>
          <div class="btn-row"><button class="btn primary" id="all">Show all cards</button><button class="btn" id="resetk">Reset progress</button></div></div></div>`;
        view.querySelector('#all').onclick = () => { onlyLearning = false; build(); draw(); };
        view.querySelector('#resetk').onclick = () => { known = new Set(); save(); onlyLearning = false; build(); draw(); };
        return;
      }
      const c = ch.cards[deck[i]];
      const isKnown = known.has(deck[i]);
      view.innerHTML = `<div class="fc-wrap">
        <div class="fc-controls"><span class="muted tnum">Card ${i + 1} of ${deck.length} · ${known.size}/${ch.cards.length} known</span>
          <label class="check"><input type="checkbox" id="fc-only" ${onlyLearning ? 'checked' : ''}> Only cards I'm still learning</label></div>
        <button class="fc${flipped ? ' flipped' : ''}" id="fc" aria-label="Flashcard. Press to flip."><div class="fc-inner">
          <div class="fc-face front"><span class="hint">Term${isKnown ? ' · known' : ''}</span><div class="term">${c.term}</div><span class="hint">Tap or press space to flip</span></div>
          <div class="fc-face back"><span class="hint">${c.term}</span><div class="defn">${c.def}</div></div>
        </div></button>
        <div class="fc-controls"><div class="btn-row"><button class="btn" id="prev">← Prev</button><button class="btn" id="next">Next →</button><button class="btn" id="shuf">Shuffle</button></div>
          <div class="btn-row"><button class="btn" id="learn">Still learning</button><button class="btn primary" id="gotit">Got it</button></div></div></div>`;
      const fc = view.querySelector('#fc');
      fc.onclick = () => { flipped = !flipped; fc.classList.toggle('flipped', flipped); };
      view.querySelector('#prev').onclick = () => move(-1);
      view.querySelector('#next').onclick = () => move(1);
      view.querySelector('#shuf').onclick = () => { for (let k = deck.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [deck[k], deck[j]] = [deck[j], deck[k]]; } i = 0; flipped = false; draw(); };
      view.querySelector('#learn').onclick = () => { known.delete(deck[i]); save(); move(1); };
      view.querySelector('#gotit').onclick = () => {
        known.add(deck[i]); save();
        if (onlyLearning) { build(); flipped = false; draw(); } else move(1);
      };
      view.querySelector('#fc-only').onchange = (e) => { onlyLearning = e.target.checked; i = 0; build(); flipped = false; draw(); };
    }
    function move(d) { i = (i + d + deck.length) % deck.length; flipped = false; draw(); }
    const onKey = (e) => {
      if (!document.body.contains(view) || !view.querySelector('#fc')) { document.removeEventListener('keydown', onKey); return; }
      if (e.target.closest('input')) return;
      if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === ' ' && e.target.id !== 'fc') { e.preventDefault(); view.querySelector('#fc').click(); }
    };
    document.addEventListener('keydown', onKey);
    build(); draw();
  }

  function sheet(view, ch) {
    view.innerHTML = `<p class="lede">Everything in Chapter ${ch.number} you should be able to write from memory.</p><div class="sheet-grid">${ch.sheet.map((s) => `<div class="sheet-card"><h3>${s.h}</h3><div class="f">${s.f}</div>${s.p ? `<p>${s.p}</p>` : ''}</div>`).join('')}</div>`;
  }

  /* ---------- Boot ---------- */
  function initTheme() {
    const root = document.documentElement;
    const saved = store.get('theme', 'system');
    const apply = (t) => { if (t === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t); };
    apply(saved);
    document.querySelectorAll('[data-theme-set]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.themeSet === saved));
      b.addEventListener('click', () => {
        const t = b.dataset.themeSet; apply(t); store.set('theme', t);
        document.querySelectorAll('[data-theme-set]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      });
    });
  }
  function boot() {
    chapters.forEach((c) => {
      c.labCount = (c.sections.map((s) => s.html).join('').match(/data-widget=/g) || []).length;
    });
    initTheme();
    document.getElementById('menu').addEventListener('click', () => document.body.classList.toggle('nav-open'));
    document.getElementById('scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
    window.addEventListener('hashchange', render);
    render();
  }

  return { registerChapter, registerWidget, setCourse, store, mountWidgets, boot, esc };
})();
document.addEventListener('DOMContentLoaded', () => window.Study.boot());
