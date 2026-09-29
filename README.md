# ECON 281 Study Lab

Made by [KingstonM29](https://github.com/KingstonM29).

An interactive study site for ECON 281 (Intermediate Microeconomics, MacEwan University, Fall 2026), organized by chapter.

- **Dashboard**: countdown to the next quiz or midterm, the next week of classes, grade weights and your running grade.
- **Calendar**: every lecture, quiz, midterm and no-class day from the course outline. Click a day for details, and add your own study sessions.
- **Course & grades**: instructor info, assessment table, grading scale and key policies. There's also a grade tracker that works out what you need on the final, and a place to enter your personal final exam date.
- **Chapters 3 and 4**: lessons with interactive graphs, practice problems with worked answers, a quiz, flashcards and a formula sheet.

Dark (blue and black) is the default theme. Switch to light mode at the bottom of the sidebar.

## Your data stays on your computer

Everything a student does is saved in their own browser's `localStorage`: quiz scores, flashcards, practice checkmarks, grades, the final exam date, calendar events and the theme. Nothing is uploaded, and there is no server or account. If two people use the same link, each sees only their own progress. Clearing browser data (or **Course & grades → Clear all my saved data**) removes it.

## Running it

There's no build step.

- **Locally:** open `index.html` in a browser.
- **On GitHub Pages:** in the repo go to *Settings → Pages*, choose *Deploy from a branch*, pick the branch and `/ (root)`, and save. Share the `https://<user>.github.io/ECON-281/` link.

## Updating course info

Everything shared by all students is in `data/course.js`: the instructor, the lecture schedule, assessments (dates, weights, which chapters they cover), the chapter list, the grading scale and policies. Edit it and the dashboard, calendar and course page all update.

## Adding a chapter (e.g. Chapter 6)

1. The chapter is already listed in `chapterPlan` in `data/course.js` (it shows as "coming soon").
2. Create `chapters/ch6/content.js` that calls `Study.registerChapter({ id: 'ch6', number: 6, title, blurb, intro, sections, practice, quiz, cards, sheet })`. Copy `chapters/ch4/content.js` as a template.
3. Put new interactive graphs in `chapters/ch6/widgets.js` with `Study.registerWidget('name', (el, options) => { ... })`, and place them in lesson HTML with `<div data-widget="name" data-preset="..."></div>`. Widgets from earlier chapters can be reused.
4. Add the new files as `<script>` tags at the bottom of `index.html`, widgets before content.

## Files

```
index.html               page shell
assets/styles.css        theme tokens (dark default, light option) and layout
assets/graph.js          SVG plotting helper: axes, curves, draggable points, animation
assets/ui.js             shared controls for interactive graphs (sliders, chips, readouts)
assets/app.js            router, dashboard, calendar, course page, chapter views, local storage
data/course.js           course outline data
chapters/ch3/            Chapter 3 · Consumer Choice
chapters/ch4/econ.js     preference engine: traces indifference curves from the MRS (normal, inferior, Giffen)
chapters/ch4/            Chapter 4 · Individual and Market Demand
```
