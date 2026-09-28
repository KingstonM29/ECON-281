/* Course information from the ECON 281 course outline (Fall 2026).
   Everything here is the same for every student. Personal data (grades, your own calendar
   events, your final exam date, quiz scores) is saved only in each student's own browser. */
Study.setCourse({
  code: 'ECON 281',
  title: 'Intermediate Microeconomics',
  term: 'Fall 2026',
  school: 'MacEwan University',

  instructor: {
    name: 'Joseph Fong, PhD',
    office: '7-368J, CCC',
    email: 'fongj@macewan.ca',
    hours: 'Wednesdays 11 AM – 12 PM, or by appointment',
  },
  lectures: { days: 'Wednesday & Friday', time: '9:30 – 10:50 AM', room: '7-146', format: 'Face-to-face, on campus' },
  textbook: 'Pindyck & Rubinfeld, Microeconomics, 9th ed. (Pearson, 2018). Older editions are fine; you find the matching pages.',
  prerequisite: 'ECON 101 with a minimum grade of C−',

  // Graded work. `date` is YYYY-MM-DD; null means no fixed date.
  assessments: [
    { id: 'ica', name: 'In-class assignments', short: 'In-class', weight: 8, count: 5, best: 4, date: null, format: 'Open book · 15–20 min · unannounced', note: 'Best 4 of 5 count, 2% each.' },
    { id: 'q1', name: 'Quiz 1', short: 'Quiz 1', weight: 8, date: '2026-09-18', time: '9:30 AM', duration: '30 min', format: 'Closed book', covers: ['ch3'] },
    { id: 'm1', name: 'Midterm 1', short: 'Midterm 1', weight: 18, date: '2026-10-07', time: '9:30 AM', duration: '50 min', format: 'Closed book', covers: ['ch3', 'ch4'] },
    { id: 'q2', name: 'Quiz 2', short: 'Quiz 2', weight: 8, date: '2026-10-30', time: '9:30 AM', duration: '30 min', format: 'Closed book', covers: ['ch6', 'ch7'] },
    { id: 'm2', name: 'Midterm 2', short: 'Midterm 2', weight: 18, date: '2026-11-18', time: '9:30 AM', duration: '50 min', format: 'Closed book', covers: ['ch6', 'ch7', 'ch8'] },
    { id: 'final', name: 'Final exam', short: 'Final', weight: 40, date: null, duration: '120 min', format: 'Closed book · cumulative', note: 'Date is on your personal schedule in myStudentSystem. Add yours under My final exam date and it appears in your calendar.' },
  ],

  // Lecture schedule (subject to change, per the outline).
  schedule: [
    { date: '2026-09-02', type: 'lecture', ch: 'ch3' },
    { date: '2026-09-04', type: 'lecture', ch: 'ch3', note: 'Outline lists "Sept 5", a Saturday; shown on Friday Sept 4.' },
    { date: '2026-09-09', type: 'lecture', ch: 'ch3' },
    { date: '2026-09-11', type: 'lecture', ch: 'ch3' },
    { date: '2026-09-16', type: 'lecture', ch: 'ch3' },
    { date: '2026-09-18', type: 'lecture', ch: 'ch4', note: 'After Quiz 1.' },
    { date: '2026-09-25', type: 'lecture', ch: 'ch4' },
    { date: '2026-09-30', type: 'off', title: 'National Day for Truth and Reconciliation · no lecture' },
    { date: '2026-10-02', type: 'lecture', ch: 'ch4' },
    { date: '2026-10-09', type: 'lecture', ch: 'ch6' },
    { date: '2026-10-14', type: 'lecture', ch: 'ch6' },
    { date: '2026-10-16', type: 'lecture', ch: 'ch6' },
    { date: '2026-10-21', type: 'lecture', ch: 'ch7' },
    { date: '2026-10-23', type: 'lecture', ch: 'ch7' },
    { date: '2026-10-28', type: 'lecture', ch: 'ch7' },
    { date: '2026-11-04', type: 'lecture', ch: 'ch8' },
    { date: '2026-11-06', type: 'lecture', ch: 'ch8' },
    { date: '2026-11-09', end: '2026-11-13', type: 'off', title: 'Reading Break & Remembrance Day · no lectures' },
    { date: '2026-11-20', type: 'lecture', ch: 'ch10' },
    { date: '2026-11-25', type: 'lecture', ch: 'ch10', also: 'ch12' },
    { date: '2026-11-27', type: 'lecture', ch: 'ch12' },
    { date: '2026-12-02', type: 'lecture', ch: 'ch12' },
    { date: '2026-12-04', type: 'lecture', ch: 'ch12' },
  ],

  // Every chapter in the course. Chapters with study notes register themselves in chapters/.
  chapterPlan: [
    { id: 'ch3', number: 3, title: 'Consumer Choice', part: 'Consumer Theory', pages: 'pp. 67–92, 95–100' },
    { id: 'ch4', number: 4, title: 'Individual and Market Demand', part: 'Consumer Theory', pages: 'pp. 109–137' },
    { id: 'ch6', number: 6, title: 'Production', part: 'Theory of the Firm' },
    { id: 'ch7', number: 7, title: 'The Cost of Production', part: 'Theory of the Firm', pages: 'pp. 215–245' },
    { id: 'ch8', number: 8, title: 'Profit Maximization and Competitive Supply', part: 'Markets and Prices' },
    { id: 'ch10', number: 10, title: 'Monopoly', part: 'Markets and Prices' },
    { id: 'ch12', number: 12, title: 'Oligopoly', part: 'Markets and Prices' },
  ],

  gradeScale: [
    ['A+', 95, 4.0, 'Outstanding'], ['A', 90, 4.0, 'Excellent'], ['A−', 85, 3.7, 'Excellent'],
    ['B+', 80, 3.3, 'Good'], ['B', 75, 3.0, 'Good'], ['B−', 70, 2.7, 'Good'],
    ['C+', 65, 2.3, 'Satisfactory'], ['C', 61, 2.0, 'Satisfactory'], ['C−', 57, 1.7, 'Satisfactory'],
    ['D+', 53, 1.3, 'Poor'], ['D', 50, 1.0, 'Poor'], ['F', 0, 0, 'Fail'],
  ],

  policies: [
    'All quizzes and exams are multiple choice, on paper, in class. The final is cumulative.',
    'Missed an assessment? Tell the instructor within 48 hours, with documentation. Approved absences move the weight to the final (max 70%); unapproved absences score 0%.',
    'Grade review requests: within 4 business days of the grade being posted.',
    'No smartphones or programmable calculators during quizzes and exams. Bring photo ID.',
    'In-class exercises are handed out in class only and are not posted. Get them from a classmate if you miss a class.',
    'Generative AI tools are not allowed on assessments.',
  ],
});
