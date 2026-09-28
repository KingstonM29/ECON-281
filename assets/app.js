/* App shell: registries for chapters and interactive widgets, hash router, and the views:
   Dashboard, Calendar, Course & grades, and per chapter Lessons / Practice / Quiz / Flashcards / Formula sheet.
   All personal data lives in this browser's localStorage under "econ281:" keys. Nothing is sent anywhere. */
window.Study = (function () {
  const chapters = [];
  const widgets = {};
  const course = { code: 'ECON 281', title: '', term: '', assessments: [], schedule: [], chapterPlan: [], gradeScale: [], policies: [] };

  /* ---------- Local storage (per browser, per person) ---------- */
  const PREFIX = 'econ281:';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(PREFIX + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    clearAll() {
      try { Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k)); } catch (e) { /* ignore */ }
    },
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
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

  /* ---------- Dates ---------- */
  const D = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const iso = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  const today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
  const daysFrom = (s) => Math.round((D(s) - today()) / 86400000);
  const fmtDay = (s, o = { weekday: 'short', month: 'short', day: 'numeric' }) => D(s).toLocaleDateString(undefined, o);
  const plan = (id) => course.chapterPlan.find((c) => c.id === id);
  const chName = (id) => { const p = plan(id); return p ? `Ch ${p.number} · ${p.title}` : id; };
  const hasNotes = (id) => chapters.some((c) => c.id === id);
  const inDays = (n) => (n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n > 1 ? `In ${n} days` : n === -1 ? 'Yesterday' : `${-n} days ago`);

  // Every dated item in the course plus this person's own entries.
  function events() {
    const out = [];
    for (const s of course.schedule) {
      if (s.type === 'lecture') {
        const p = plan(s.ch), q = s.also ? plan(s.also) : null;
        out.push({ date: s.date, type: 'lecture', ch: s.ch, short: `Ch ${p.number}${q ? '→' + q.number : ''}`,
          title: `Lecture: ${chName(s.ch)}${q ? ', then ' + chName(s.also) : ''}`, sub: `${course.lectures.time} · Room ${course.lectures.room}${s.note ? ' · ' + s.note : ''}` });
      } else {
        out.push({ date: s.date, end: s.end, type: 'off', short: 'No class', title: s.title, sub: '' });
      }
    }
    const fin = store.get('finalDate', null);
    for (const a of course.assessments) {
      const date = a.id === 'final' ? fin && fin.date : a.date;
      if (!date) continue;
      const time = a.id === 'final' ? (fin.time || '') : a.time;
      out.push({ date, type: a.id === 'final' ? 'final' : a.id.startsWith('q') ? 'quiz' : 'midterm', id: a.id, short: a.short,
        title: a.name, sub: [time, a.duration, a.weight + '%', a.covers ? 'covers ' + a.covers.map((c) => 'Ch ' + plan(c).number).join(', ') : 'cumulative'].filter(Boolean).join(' · '), covers: a.covers, weight: a.weight });
    }
    for (const m of store.get('myEvents', [])) out.push({ date: m.date, type: 'mine', short: m.title, title: m.title, sub: [m.time, 'Your event'].filter(Boolean).join(' · '), mineId: m.id });
    return out.sort((a, b) => (a.date === b.date ? typeOrder(a) - typeOrder(b) : a.date < b.date ? -1 : 1));
  }
  const typeOrder = (e) => ['final', 'midterm', 'quiz', 'off', 'lecture', 'mine'].indexOf(e.type);
  const onDay = (e, s) => (e.end ? s >= e.date && s <= e.end : e.date === s);
  const TYPE_LABEL = { lecture: 'Lecture', quiz: 'Quiz', midterm: 'Midterm', final: 'Final exam', off: 'No class', mine: 'My event' };

  /* ---------- Routing ---------- */
  function parse() {
    const h = decodeURIComponent((location.hash || '').slice(1));
    if (h === 'calendar' || h === 'course') return { view: h };
    const m = /^(ch\d+)(?:-(practice|quiz|cards|sheet))?$/.exec(h);
    if (m && chapters.find((c) => c.id === m[1])) return { view: 'chapter', ch: m[1], tab: m[2] || '' };
    return { view: 'home' };
  }
  function render() {
    const r = parse();
    renderNav(r);
    const main = document.getElementById('main');
    main.innerHTML = '';
    ({ home: renderHome, calendar: renderCalendar, course: renderCourse })[r.view]?.(main);
    if (r.view === 'chapter') renderChapter(main, chapters.find((c) => c.id === r.ch), r.tab);
    document.body.classList.remove('nav-open');
    window.scrollTo(0, 0);
  }

  function renderNav(r) {
    const nav = document.getElementById('nav');
    const cur = (on) => (on ? ' aria-current="page"' : '');
    let html = `<div class="nav-group">
      <a class="nav-link" href="#home"${cur(r.view === 'home')}><span class="ico">◧</span>Dashboard</a>
      <a class="nav-link" href="#calendar"${cur(r.view === 'calendar')}><span class="ico">▦</span>Calendar</a>
      <a class="nav-link" href="#course"${cur(r.view === 'course')}><span class="ico">≡</span>Course &amp; grades</a></div>`;
    html += `<div class="nav-group"><div class="nav-group-title">Chapters</div>`;
    for (const p of course.chapterPlan) {
      const c = chapters.find((x) => x.id === p.id);
      if (!c) { html += `<span class="nav-link soon"><span class="num">Ch ${p.number}</span>${esc(p.title)}</span>`; continue; }
      html += `<a class="nav-link" href="#${c.id}"${cur(r.view === 'chapter' && r.ch === c.id && !r.tab)}><span class="num">Ch ${c.number}</span>${esc(c.title)}</a>`;
      if (r.view === 'chapter' && r.ch === c.id) {
        html += '<div class="nav-sub">' + TABS.slice(1).map(([t, name]) => `<a class="nav-link" href="#${c.id}-${t}"${cur(r.tab === t)}>${name}</a>`).join('') + '</div>';
      }
    }
    nav.innerHTML = html + '</div>';
  }

  /* ---------- Progress helpers ---------- */
  function progress(c) {
    const best = store.get('quiz:' + c.id, null);
    const known = store.get('cards:' + c.id, []).length;
    const done = store.get('done:' + c.id, []).length;
    const parts = [best == null ? 0 : best / c.quiz.length, known / c.cards.length, done / c.practice.length];
    return { best, known, done, pct: Math.round((parts.reduce((a, b) => a + b, 0) / 3) * 100) };
  }

  /* ---------- Grades (local only) ---------- */
  function gradeSummary() {
    const g = store.get('grades', {});
    let earned = 0, weightDone = 0;
    for (const a of course.assessments) {
      if (a.id === 'ica') {
        const s = (g.ica || []).filter((v) => v !== '' && v != null && isFinite(v)).map(Number).sort((x, y) => y - x).slice(0, a.best);
        const each = a.weight / a.best;
        s.forEach((v) => { earned += (v / 100) * each; weightDone += each; });
      } else if (g[a.id] !== '' && g[a.id] != null && isFinite(g[a.id])) {
        earned += (Number(g[a.id]) / 100) * a.weight; weightDone += a.weight;
      }
    }
    const avg = weightDone ? (earned / weightDone) * 100 : null;
    return { earned, weightDone, avg, letter: avg == null ? null : letterFor(avg) };
  }
  const letterFor = (pct) => (course.gradeScale.find((r) => Math.round(pct) >= r[1]) || course.gradeScale[course.gradeScale.length - 1])[0];

  /* ---------- Dashboard ---------- */
  function renderHome(main) {
    const all = events();
    const t = iso(today());
    const exams = all.filter((e) => ['quiz', 'midterm', 'final'].includes(e.type) && e.date >= t);
    const next = exams[0];
    const upcoming = all.filter((e) => (e.end || e.date) >= t).slice(0, 7);
    const gs = gradeSummary();
    const finalSet = !!store.get('finalDate', null);

    const nextHtml = next ? `
      <div class="countdown"><span class="n">${Math.max(0, daysFrom(next.date))}</span><span class="u">${daysFrom(next.date) === 1 ? 'day' : 'days'}</span></div>
      <div class="next-body"><p class="eyebrow">Next assessment</p><h2>${esc(next.title)}</h2>
        <p>${fmtDay(next.date, { weekday: 'long', month: 'long', day: 'numeric' })} · ${esc(next.sub)}</p>
        <div class="btn-row">${(next.covers || []).filter(hasNotes).map((c) => `<a class="btn primary" href="#${c}">Study ${chName(c).split(' · ')[0]}</a><a class="btn" href="#${c}-quiz">Ch ${plan(c).number} quiz</a>`).join('')}<a class="btn ghost" href="#calendar">Open calendar</a></div></div>`
      : `<div class="next-body"><p class="eyebrow">Next assessment</p><h2>Nothing scheduled</h2><p>${finalSet ? 'All term assessments are done.' : 'Add your final exam date on the Course page to count down to it.'}</p></div>`;

    const upHtml = upcoming.map((e) => {
      const n = daysFrom(e.date);
      return `<li class="up up-${e.type}"><div class="up-date"><b>${D(e.date).getDate()}</b><span>${fmtDay(e.date, { month: 'short' })}</span></div>
        <div class="up-main"><span class="pill p-${e.type}">${TYPE_LABEL[e.type]}</span><b>${esc(e.title)}</b><small>${esc(e.sub || '')}</small></div>
        <span class="up-when">${inDays(n)}</span></li>`;
    }).join('') || '<li class="muted">No upcoming dates.</li>';

    const chCards = course.chapterPlan.map((p) => {
      const c = chapters.find((x) => x.id === p.id);
      const lect = course.schedule.filter((s) => s.ch === p.id || s.also === p.id).map((s) => s.date);
      const when = lect.length ? `${fmtDay(lect[0], { month: 'short', day: 'numeric' })} – ${fmtDay(lect[lect.length - 1], { month: 'short', day: 'numeric' })}` : '';
      if (!c) return `<article class="ch-tile soon"><div class="ch-num">${p.number}</div><div><p class="eyebrow">${esc(p.part)}</p><h3>${esc(p.title)}</h3><p class="muted small">Lectures ${when} · study notes coming soon</p></div></article>`;
      const pr = progress(c);
      return `<a class="ch-tile" href="#${c.id}"><div class="ch-num">${c.number}</div><div class="ch-tile-body"><p class="eyebrow">${esc(p.part)}</p><h3>${esc(c.title)}</h3>
        <p class="muted small">Lectures ${when}</p>
        <div class="meter" role="img" aria-label="${pr.pct}% studied"><i style="width:${pr.pct}%"></i></div>
        <div class="stat-row"><span class="stat">Quiz best <b>${pr.best == null ? '–' : pr.best + '/' + c.quiz.length}</b></span><span class="stat">Cards <b>${pr.known}/${c.cards.length}</b></span><span class="stat">Practice <b>${pr.done}/${c.practice.length}</b></span></div></div></a>`;
    }).join('');

    const weights = course.assessments.map((a, i) => `<i class="w w${i}" style="flex:${a.weight}" title="${esc(a.name)} ${a.weight}%"></i>`).join('');
    const wlegend = course.assessments.map((a, i) => `<span><i class="w w${i}"></i>${esc(a.short)} ${a.weight}%</span>`).join('');

    main.innerHTML = `<div class="page">
      <header class="hero"><p class="eyebrow">${esc(course.code)} · ${esc(course.title)} · ${esc(course.term)}</p><h1>Study Lab<span class="dot">.</span></h1></header>
      <section class="next-card">${nextHtml}</section>
      <div class="dash-grid">
        <section class="panel"><div class="panel-head"><h2>Coming up</h2><a href="#calendar">Full calendar →</a></div><ul class="up-list">${upHtml}</ul></section>
        <section class="panel"><div class="panel-head"><h2>Grade weights</h2><a href="#course">My grades →</a></div>
          <div class="wbar">${weights}</div><div class="wlegend">${wlegend}</div>
          <div class="grade-now">${gs.avg == null ? '<p class="muted">Enter your marks on the Course page to track your running grade. They stay on this device.</p>'
            : `<div class="gbig">${gs.avg.toFixed(1)}%<span>${gs.letter}</span></div><p class="muted small">Running average over the ${+gs.weightDone.toFixed(1)}% of the course you've entered.</p>`}</div></section>
      </div>
      <section class="stack-sec"><div class="panel-head"><h2>Chapters</h2></div><div class="ch-grid">${chCards}</div></section>
      <p class="local-note">Your quiz scores, flashcards, practice checkmarks, grades and calendar events are saved only in this browser. Other people using this site see their own.</p>
    </div>`;
  }

  /* ---------- Calendar ---------- */
  let calMonth = null, calSel = null;
  function renderCalendar(main) {
    const all = events();
    const t = iso(today());
    if (!calMonth) {
      const first = D(course.schedule[0].date), last = D(course.schedule[course.schedule.length - 1].date);
      const now = today();
      const base = now < first ? first : now > last ? last : now;
      calMonth = new Date(base.getFullYear(), base.getMonth(), 1);
      calSel = iso(now < first || now > last ? first : now);
    }
    main.innerHTML = `<div class="page"><header class="ch-head"><p class="eyebrow">${esc(course.code)} · ${esc(course.term)}</p><h1>Calendar</h1></header>
      <div class="cal-wrap"><section class="panel cal-panel">
        <div class="cal-top"><button class="icon-btn" id="cal-prev" aria-label="Previous month">‹</button><h2 id="cal-title"></h2><button class="icon-btn" id="cal-next" aria-label="Next month">›</button><button class="btn small" id="cal-today">Today</button></div>
        <div class="cal-legend">${['lecture', 'quiz', 'midterm', 'final', 'off', 'mine'].map((k) => `<span><i class="dotk k-${k}"></i>${TYPE_LABEL[k]}</span>`).join('')}</div>
        <div class="cal-grid" id="cal-grid" role="grid"></div></section>
        <aside class="panel day-panel" id="day-panel" aria-live="polite"></aside></div>
      <section class="panel"><div class="panel-head"><h2>All course dates</h2></div><div id="agenda"></div></section></div>`;

    const grid = main.querySelector('#cal-grid');
    function drawMonth() {
      main.querySelector('#cal-title').textContent = calMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      const start = new Date(calMonth); start.setDate(1 - start.getDay());
      let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<div class="cal-dow">${d}</div>`).join('');
      for (let i = 0; i < 42; i++) {
        const d = new Date(start); d.setDate(start.getDate() + i);
        const s = iso(d), evs = all.filter((e) => onDay(e, s));
        const out = d.getMonth() !== calMonth.getMonth();
        if (i >= 35 && out && d.getDate() > 7) break;
        html += `<button class="cal-day${out ? ' out' : ''}${s === t ? ' today' : ''}${s === calSel ? ' sel' : ''}" data-d="${s}" aria-label="${fmtDay(s, { weekday: 'long', month: 'long', day: 'numeric' })}${evs.length ? ', ' + evs.map((e) => e.short).join(', ') : ''}">
          <span class="dn">${d.getDate()}</span><span class="evs">${evs.slice(0, 3).map((e) => `<span class="ev k-${e.type}">${esc(e.short)}</span>`).join('')}${evs.length > 3 ? `<span class="more">+${evs.length - 3}</span>` : ''}</span></button>`;
      }
      grid.innerHTML = html;
      grid.querySelectorAll('.cal-day').forEach((b) => b.addEventListener('click', () => { calSel = b.dataset.d; drawMonth(); drawDay(); }));
    }
    function drawDay() {
      const panel = main.querySelector('#day-panel');
      const evs = all.filter((e) => onDay(e, calSel));
      const n = daysFrom(calSel);
      panel.innerHTML = `<p class="eyebrow">${inDays(n)}</p><h2>${fmtDay(calSel, { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
        <ul class="day-list">${evs.map((e) => `<li class="k-border-${e.type}"><span class="pill p-${e.type}">${TYPE_LABEL[e.type]}</span><b>${esc(e.title)}</b>${e.sub ? `<small>${esc(e.sub)}</small>` : ''}
          ${e.ch && hasNotes(e.ch) ? `<a href="#${e.ch}">Open the ${esc(chName(e.ch).split(' · ')[0])} notes →</a>` : ''}
          ${(e.covers || []).filter(hasNotes).map((c) => `<a href="#${c}-quiz">Practice: ${esc(chName(c).split(' · ')[0])} quiz →</a>`).join('')}
          ${e.mineId ? `<button class="linkish" data-del="${e.mineId}">Remove this event</button>` : ''}</li>`).join('') || '<li class="muted">Nothing scheduled.</li>'}</ul>
        <form class="add-ev" id="add-ev"><h3>Add your own event</h3>
          <label for="ev-title">What</label><input id="ev-title" required maxlength="60" placeholder="e.g. Study group, review Ch 4">
          <div class="two"><div><label for="ev-date">Date</label><input id="ev-date" type="date" required value="${calSel}"></div>
          <div><label for="ev-time">Time (optional)</label><input id="ev-time" type="time"></div></div>
          <button class="btn primary" type="submit">Add to my calendar</button><p class="muted small">Saved only in this browser.</p></form>`;
      panel.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
        store.set('myEvents', store.get('myEvents', []).filter((m) => m.id !== b.dataset.del)); renderCalendar(main);
      }));
      panel.querySelector('#add-ev').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const title = panel.querySelector('#ev-title').value.trim(), date = panel.querySelector('#ev-date').value, time = panel.querySelector('#ev-time').value;
        if (!title || !date) return;
        const tm = time ? new Date('1970-01-01T' + time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';
        store.set('myEvents', [...store.get('myEvents', []), { id: 'e' + Date.now(), title, date, time: tm }]);
        calSel = date; calMonth = new Date(D(date).getFullYear(), D(date).getMonth(), 1);
        renderCalendar(main);
      });
    }
    function drawAgenda() {
      const byMonth = {};
      all.forEach((e) => { const k = e.date.slice(0, 7); (byMonth[k] = byMonth[k] || []).push(e); });
      main.querySelector('#agenda').innerHTML = Object.entries(byMonth).map(([k, evs]) => `<div class="ag-month"><h3>${D(k + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
        <ul>${evs.map((e) => `<li class="${(e.end || e.date) < t ? 'past' : ''}"><span class="ag-d">${fmtDay(e.date)}${e.end ? ' – ' + fmtDay(e.end, { month: 'short', day: 'numeric' }) : ''}</span><i class="dotk k-${e.type}"></i><span class="ag-t"><b>${esc(e.title)}</b>${e.sub ? ` <small>${esc(e.sub)}</small>` : ''}</span></li>`).join('')}</ul></div>`).join('')
        + `<div class="ag-month"><h3>Final exam</h3><ul><li><span class="ag-d">${store.get('finalDate', null) ? fmtDay(store.get('finalDate').date) : 'Date TBA'}</span><i class="dotk k-final"></i><span class="ag-t"><b>Final exam</b> <small>120 min · 40% · cumulative · ${store.get('finalDate', null) ? 'your date' : 'check myStudentSystem, then add it on the Course page'}</small></span></li></ul></div>`;
    }
    main.querySelector('#cal-prev').onclick = () => { calMonth.setMonth(calMonth.getMonth() - 1); drawMonth(); };
    main.querySelector('#cal-next').onclick = () => { calMonth.setMonth(calMonth.getMonth() + 1); drawMonth(); };
    main.querySelector('#cal-today').onclick = () => { const n = today(); calMonth = new Date(n.getFullYear(), n.getMonth(), 1); calSel = iso(n); drawMonth(); drawDay(); };
    drawMonth(); drawDay(); drawAgenda();
  }

  /* ---------- Course & grades ---------- */
  function renderCourse(main) {
    const c = course, g = store.get('grades', {}), fin = store.get('finalDate', null) || {};
    const covers = (a) => (a.covers ? a.covers.map((id) => hasNotes(id) ? `<a href="#${id}">Ch ${plan(id).number}</a>` : `Ch ${plan(id).number}`).join(', ') : a.id === 'final' ? 'Everything' : 'Recent lectures');
    const rows = c.assessments.map((a) => `<tr><td><b>${esc(a.name)}</b>${a.note ? `<div class="muted small">${esc(a.note)}</div>` : ''}</td><td class="num">${a.weight}%</td>
      <td>${a.date ? fmtDay(a.date, { weekday: 'short', month: 'short', day: 'numeric' }) + (a.time ? ', ' + a.time : '') : a.id === 'final' ? (fin.date ? fmtDay(fin.date) + ' (yours)' : 'Exam week, TBA') : 'Unannounced'}</td>
      <td>${esc(a.duration || '')}${a.duration ? ' · ' : ''}${esc(a.format)}</td><td>${covers(a)}</td></tr>`).join('');
    const inputs = c.assessments.map((a) => a.id === 'ica'
      ? `<div class="g-row"><label>${esc(a.name)} <small>best ${a.best} of ${a.count}</small></label><div class="g-multi">${Array.from({ length: a.count }, (_, i) => `<input type="number" min="0" max="100" step="0.1" inputmode="decimal" id="g-ica-${i}" data-ica="${i}" value="${esc((g.ica || [])[i] ?? '')}" placeholder="#${i + 1}" aria-label="In-class assignment ${i + 1} (%)">`).join('')}</div></div>`
      : `<div class="g-row"><label for="g-${a.id}">${esc(a.name)} <small>${a.weight}%</small></label><input type="number" min="0" max="100" step="0.1" inputmode="decimal" id="g-${a.id}" data-g="${a.id}" value="${esc(g[a.id] ?? '')}" placeholder="%"></div>`).join('');

    main.innerHTML = `<div class="page"><header class="ch-head"><p class="eyebrow">${esc(c.code)} · ${esc(c.term)} · ${esc(c.school)}</p><h1>Course &amp; grades</h1></header>
      <div class="info-grid">
        <section class="panel"><h2>Instructor</h2><dl class="kv"><dt>Name</dt><dd>${esc(c.instructor.name)}</dd><dt>Office</dt><dd>${esc(c.instructor.office)}</dd><dt>Office hours</dt><dd>${esc(c.instructor.hours)}</dd><dt>Email</dt><dd><span class="mono sel-all">${esc(c.instructor.email)}</span> <button class="btn small" id="copy-email">Copy</button></dd></dl><p class="muted small">Use your myMacEwan email.</p></section>
        <section class="panel"><h2>Lectures</h2><dl class="kv"><dt>When</dt><dd>${esc(c.lectures.days)}, ${esc(c.lectures.time)}</dd><dt>Room</dt><dd>${esc(c.lectures.room)}</dd><dt>Format</dt><dd>${esc(c.lectures.format)}</dd><dt>Textbook</dt><dd>${esc(c.textbook)}</dd><dt>Prerequisite</dt><dd>${esc(c.prerequisite)}</dd></dl></section>
      </div>
      <section class="panel"><h2>Assessments</h2><div class="table-wrap"><table><thead><tr><th>What</th><th class="num">Weight</th><th>When</th><th>Format</th><th>Covers</th></tr></thead><tbody>${rows}</tbody></table></div></section>
      <div class="info-grid">
        <section class="panel grades"><div class="panel-head"><h2>My grades</h2><span class="pill p-mine">Only on this device</span></div>
          <p class="muted small">Type your percentage for each piece as marks come back. Your running grade updates as you type.</p>
          <div class="g-form">${inputs}</div><div id="g-out"></div>
          <div class="g-row"><label for="g-target">Target final letter</label><select id="g-target">${c.gradeScale.filter((r) => r[1] > 0).map((r) => `<option value="${r[1]}"${(g.target ?? 70) == r[1] ? ' selected' : ''}>${r[0]} (${r[1]}%+)</option>`).join('')}</select></div>
          <div id="g-need"></div></section>
        <section class="panel"><h2>My final exam date</h2><p class="muted small">Your personal final schedule is in myStudentSystem. Add it here and it shows up on your calendar and countdown.</p>
          <form id="fin-form" class="add-ev"><div class="two"><div><label for="fin-date">Date</label><input id="fin-date" type="date" value="${esc(fin.date || '')}"></div><div><label for="fin-time">Time</label><input id="fin-time" type="time" value="${esc(fin.time24 || '')}"></div></div>
          <div class="btn-row"><button class="btn primary" type="submit">Save my final date</button>${fin.date ? '<button class="btn" type="button" id="fin-clear">Remove</button>' : ''}</div><p class="muted small" id="fin-msg"></p></form>
          <h2 style="margin-top:12px">Grading scale</h2><div class="table-wrap"><table class="scale"><thead><tr><th>Grade</th><th class="num">%</th><th class="num">Points</th><th>Descriptor</th></tr></thead><tbody>
          ${c.gradeScale.map((r, i) => `<tr><td><b>${r[0]}</b></td><td class="num">${r[1]}${i ? '–' + (c.gradeScale[i - 1][1] - 1) : '–100'}</td><td class="num">${r[2].toFixed(1)}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div></section>
      </div>
      <section class="panel"><h2>Rules worth remembering</h2><ul class="rules">${c.policies.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></section>
      <section class="panel"><h2>Your saved data</h2><p class="muted">Quiz scores, flashcards, practice checkmarks, grades, your final date, calendar events and the theme are stored in this browser only. Nothing is uploaded, and nobody else can see them. Clearing your browser data also clears them.</p>
        <div class="btn-row" id="clear-row"><button class="btn danger" id="clear-all">Clear all my saved data</button></div></section></div>`;

    const out = main.querySelector('#g-out'), need = main.querySelector('#g-need');
    function save() {
      const ng = { ica: [], target: +main.querySelector('#g-target').value };
      main.querySelectorAll('[data-ica]').forEach((i) => { ng.ica[+i.dataset.ica] = i.value === '' ? '' : clampPct(i.value); });
      main.querySelectorAll('[data-g]').forEach((i) => { ng[i.dataset.g] = i.value === '' ? '' : clampPct(i.value); });
      store.set('grades', ng);
      const s = gradeSummary();
      out.innerHTML = s.avg == null ? '<p class="muted">No marks entered yet.</p>'
        : `<div class="gbig">${s.avg.toFixed(1)}%<span>${s.letter}</span></div><p class="muted small">Running average over the ${+s.weightDone.toFixed(1)}% of the course entered. You've banked ${s.earned.toFixed(1)} of 100 course points.</p>`;
      const finalDone = ng.final !== '' && ng.final != null;
      if (s.avg == null || finalDone) { need.innerHTML = ''; return; }
      const nonFinal = 100 - 40;
      const projected = s.earned + (s.avg / 100) * (nonFinal - s.weightDone);
      const req = ((ng.target - projected) / 40) * 100;
      need.innerHTML = `<div class="verdict ${req > 100 ? 'v-bad' : 'v-good'}">${req <= 0 ? `If you keep averaging ${s.avg.toFixed(1)}% on the rest of the term work, you reach your target even with 0% on the final.`
        : req > 100 ? `Keeping your current average, you'd need ${req.toFixed(0)}% on the final, which isn't possible. Raising your remaining term marks is the way there.`
        : `Keep averaging ${s.avg.toFixed(1)}% on the remaining term work and you need about <b>${req.toFixed(0)}%</b> on the final to reach your target.`}</div>`;
    }
    const clampPct = (v) => Math.max(0, Math.min(100, Number(v)));
    main.querySelectorAll('.g-form input, #g-target').forEach((i) => i.addEventListener('input', save));
    save();
    main.querySelector('#copy-email').onclick = (e) => {
      const b = e.currentTarget;
      navigator.clipboard?.writeText(c.instructor.email).then(() => { b.textContent = 'Copied'; }, () => { selectText(main.querySelector('.sel-all')); b.textContent = 'Press Ctrl/⌘ C'; });
    };
    main.querySelector('#fin-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const date = main.querySelector('#fin-date').value, t24 = main.querySelector('#fin-time').value;
      if (!date) { main.querySelector('#fin-msg').textContent = 'Pick a date first.'; return; }
      store.set('finalDate', { date, time24: t24, time: t24 ? new Date('1970-01-01T' + t24).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '' });
      renderCourse(main); main.querySelector('#fin-msg').textContent = 'Saved. It now appears on your calendar and dashboard.';
    });
    const fc = main.querySelector('#fin-clear');
    if (fc) fc.onclick = () => { store.set('finalDate', null); renderCourse(main); };
    main.querySelector('#clear-all').onclick = () => {
      const row = main.querySelector('#clear-row');
      row.innerHTML = '<span>This removes all your progress, grades and events from this browser. Continue?</span><button class="btn danger" id="clear-yes">Yes, clear everything</button><button class="btn" id="clear-no">Cancel</button>';
      row.querySelector('#clear-yes').onclick = () => { store.clearAll(); applyTheme('dark'); render(); };
      row.querySelector('#clear-no').onclick = () => renderCourse(main);
    };
  }
  function selectText(el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }

  /* ---------- Chapter ---------- */
  function renderChapter(main, ch, tab) {
    const tabs = TABS.map(([t, name]) => `<a href="#${ch.id}${t ? '-' + t : ''}"${t === tab ? ' aria-current="page"' : ''}>${name}</a>`).join('');
    const p = plan(ch.id) || {};
    const lect = course.schedule.filter((s) => s.ch === ch.id || s.also === ch.id).map((s) => fmtDay(s.date, { month: 'short', day: 'numeric' }));
    const tests = course.assessments.filter((a) => (a.covers || []).includes(ch.id));
    main.innerHTML = `<div class="page"><header class="ch-head"><p class="eyebrow">Chapter ${ch.number}${p.part ? ' · ' + esc(p.part) : ''}</p><h1>${esc(ch.title)}</h1>
      <p class="ch-meta">${lect.length ? `<span>Lectures ${lect.join(', ')}</span>` : ''}${p.pages ? `<span>Textbook ${esc(p.pages)}</span>` : ''}${tests.map((a) => `<span class="pill p-${a.id.startsWith('q') ? 'quiz' : 'midterm'}">On ${esc(a.name)} · ${fmtDay(a.date, { month: 'short', day: 'numeric' })}</span>`).join('')}</p></header>
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
    const key = 'done:' + ch.id;
    const done = new Set(store.get(key, []));
    view.innerHTML = `<p class="lede">Questions from the worksheets and the Chapter ${ch.number} exercises. Try each part first, then open the answer. Tick a problem off when you've done it; the tick is saved on this device.</p>
      <div class="toc">${ch.practice.map((p, i) => `<button class="chip${done.has(i) ? ' done' : ''}" data-jump="${ch.id}-p${i}">${done.has(i) ? '✓ ' : ''}${esc(p.short || p.title)}</button>`).join('')}</div>` +
      ch.practice.map((p, i) => `<article class="problem" id="${ch.id}-p${i}"><div class="problem-head"><span class="src">${esc(p.source)}</span><h3>${esc(p.title)}</h3>
        <label class="check done-check"><input type="checkbox" data-done="${i}" ${done.has(i) ? 'checked' : ''}> Done</label></div>
        <div class="prose">${p.prompt}</div>
        ${p.widget || ''}
        ${p.parts ? `<ol class="parts">${p.parts.map((pt) => `<li class="part"><div class="q"><span class="l">${pt.l}.</span><div>${pt.q}</div></div>
          <details class="ans"><summary>Show answer</summary><div class="a">${pt.a}</div></details></li>`).join('')}</ol>` : ''}
      </article>`).join('');
    view.querySelectorAll('[data-jump]').forEach((b) => b.addEventListener('click', () => document.getElementById(b.dataset.jump).scrollIntoView()));
    view.querySelectorAll('[data-done]').forEach((c) => c.addEventListener('change', () => {
      const i = +c.dataset.done; if (c.checked) done.add(i); else done.delete(i);
      store.set(key, [...done]);
      const chip = view.querySelector(`[data-jump="${ch.id}-p${i}"]`);
      chip.classList.toggle('done', c.checked); chip.textContent = (c.checked ? '✓ ' : '') + (ch.practice[i].short || ch.practice[i].title);
    }));
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

  /* ---------- Theme & boot ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('[data-theme-set]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.themeSet === t)));
  }
  function boot() {
    applyTheme(store.get('theme', 'dark') === 'light' ? 'light' : 'dark');
    document.querySelectorAll('[data-theme-set]').forEach((b) => b.addEventListener('click', () => { store.set('theme', b.dataset.themeSet); applyTheme(b.dataset.themeSet); }));
    document.getElementById('menu').addEventListener('click', () => document.body.classList.toggle('nav-open'));
    document.getElementById('scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
    window.addEventListener('hashchange', render);
    render();
  }

  return { registerChapter, registerWidget, setCourse, store, mountWidgets, boot, esc };
})();
document.addEventListener('DOMContentLoaded', () => window.Study.boot());
