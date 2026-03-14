/* ===== Home Dashboard ===== */
window.renderHome = function renderHome() {
  var el = document.getElementById('home');
  var lessons = COURSE_DATA.lessons;
  var completed = getCompletedLessons();
  var totalVocab = 0;
  lessons.forEach(function (l) { totalVocab += l.vocabulary.length; });
  var starCount = PREP_DATA.behavioral_questions.length;
  var techVocab = RESOURCES_DATA.technical_vocabulary.length;
  var ytCount = 0;
  RESOURCES_DATA.youtube_resources.forEach(function (cat) { ytCount += cat.videos.length; });
  var pct = Math.round((completed.length / lessons.length) * 100);

  var html = '<h1>TSMC AI Change Management – Interview English</h1>';
  html += '<p style="color:#9ca3af;margin-bottom:.5rem">3-Day Intensive Preparation Course</p>';
  html += '<p style="color:#6b7280;font-size:.85rem;margin-bottom:1rem">Target: Manager, AI Change Management (Job ID: 19421)</p>';

  // Stats
  html += '<div class="stat-grid">';
  html += statCard(lessons.length, 'Days / Lessons');
  html += statCard(totalVocab, 'Lesson Vocab');
  html += statCard(starCount, 'STAR Q&A');
  html += statCard(techVocab, 'Tech Vocab');
  html += statCard(ytCount, 'YouTube Resources');
  html += '</div>';

  // Progress
  html += '<h2>Learning Progress</h2>';
  html += '<div class="progress-wrap"><div class="progress-fill" style="width:' + pct + '%"></div>';
  html += '<div class="progress-text">' + completed.length + ' / ' + lessons.length + '</div></div>';
  html += '<button class="btn btn-danger btn-sm" onclick="resetProgress()" style="margin-top:.5rem">Reset Progress</button>';

  // Course Map
  html += '<h2>3-Day Course Map</h2>';
  html += '<div class="card-grid">';
  lessons.forEach(function (l) {
    var done = completed.indexOf(l.id) !== -1;
    html += '<div class="card" onclick="showSection(\'lessons\'); window.openLesson(' + l.id + ')">';
    html += '<div class="card-num">Day ' + l.day + ' — Lesson ' + l.id + '</div>';
    html += '<div class="card-title">' + esc(l.title_en) + '</div>';
    html += '<div class="card-sub">' + esc(l.title_zh) + '</div>';
    html += '<div class="card-meta">' + l.vocabulary.length + ' words</div>';
    html += '<span class="badge ' + (done ? 'badge-done' : 'badge-todo') + '">' + (done ? 'Completed' : 'Not started') + '</span>';
    html += '</div>';
  });
  html += '</div>';

  el.innerHTML = html;
};

function statCard(num, label) {
  return '<div class="stat-card"><div class="stat-num">' + num + '</div><div class="stat-label">' + label + '</div></div>';
}
