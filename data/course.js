/* Course-level info shown on the home page.
   Fill these in as the term goes on; the home page updates automatically. */
Study.setCourse({
  code: 'ECON 281',
  title: 'Intermediate Microeconomics',

  // Exams get a live countdown on the home page. Dates are YYYY-MM-DD.
  // Example: { name: 'Midterm 1', date: '2026-10-21', time: '10:00–11:20', location: 'Room 101', covers: ['ch3'] }
  exams: [],

  // Weekly course outline. Example: { week: 1, topic: 'Ch 3 · Consumer preferences' }
  // Use `label` instead of `week` for rows like { label: 'Reading week', topic: 'No class' }.
  outline: [],

  // Chapters you plan to add, shown as "coming soon" cards. Example: { number: 4, title: 'Demand' }
  plannedChapters: [],
});
