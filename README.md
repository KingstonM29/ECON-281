# ECON 281 Study Lab

An interactive study tool for ECON 281 (Intermediate Microeconomics), organized by chapter.
Each chapter has lessons with draggable graphs, practice problems with worked answers, a quiz, flashcards and a formula sheet.

## Using it

No build step. Open `index.html` in a browser, or turn on GitHub Pages for this repo (Settings → Pages → deploy from the default branch) to get a shareable link.

Quiz scores, flashcard progress and the theme choice are saved in the browser on each device.

## What's in Chapter 3 · Consumer Behavior

| Section | Interactive graphs |
|---|---|
| 3.1 Consumer Preferences | Which bundles beat B · indifference map (and why curves can't cross) · MRS as the slope · Joe vs Mary vs first consumer · substitutes and complements · diminishing marginal utility |
| 3.2 Budget Constraints | Budget line lab (prices, income, lecture scenarios) · Worksheet 3 prediction table |
| 3.3 Consumer Choice | Optimal bundle lab (Joe, Mary, Mike, Jane, Kory, Exercise 2) · corner solutions with perfect substitutes |
| 3.4 Extensions | Equal bangs for the buck with three goods |

Practice covers Worksheets 3 and 4, Exercises 1–5 and the Jennifer cookie problem.

## Adding exams and the course outline

Edit `data/course.js`:

```js
exams: [
  { name: 'Midterm 1', date: '2026-10-21', time: '10:00–11:20', location: 'Room 101', covers: ['ch3'] },
],
outline: [
  { week: 1, topic: 'Ch 3 · Consumer preferences' },
],
plannedChapters: [{ number: 4, title: 'Demand' }],
```

The home page shows a countdown for each exam.

## Adding a chapter

1. Create `chapters/chN/content.js` that calls `Study.registerChapter({ id: 'chN', number: N, title, blurb, intro, sections, practice, quiz, cards, sheet })`. Use `chapters/ch3/content.js` as the template.
2. Put any new interactive graphs in `chapters/chN/widgets.js` with `Study.registerWidget('name', (el, options) => { ... })`, and place them in lesson HTML with `<div data-widget="name" data-preset="..."></div>`. Ch 3 widgets can be reused in later chapters.
3. Add both files as `<script>` tags at the bottom of `index.html`, widgets first.

## Files

```
index.html              page shell
assets/styles.css       design tokens (light + dark) and layout
assets/graph.js         small SVG plotting helper (axes, curves, draggable points, animation)
assets/app.js           router, home page, lessons/practice/quiz/flashcards/formula views
data/course.js          exams, outline, planned chapters
chapters/ch3/           Chapter 3 content and interactive graphs
```
