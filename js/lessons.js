/* ===== Lessons Page ===== */
var TIME_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

window.renderLessons = function renderLessons() {
  var el = document.getElementById('lessonList');
  var lessons = COURSE_DATA.lessons;
  var completed = getCompletedLessons();

  var html = '<h1>Lessons</h1>';
  html += '<div class="card-grid">';
  lessons.forEach(function (l) {
    var done = completed.indexOf(l.id) !== -1;
    html += '<div class="card" onclick="window.openLesson(' + l.id + ')">';
    html += '<div class="card-num">Day ' + l.day + ' — Lesson ' + l.id + '</div>';
    html += '<div class="card-title">' + esc(l.title_en) + '</div>';
    html += '<div class="card-sub">' + esc(l.title_zh) + '</div>';
    html += '<div class="card-meta">' + l.objectives.length + ' objectives &middot; ' + l.vocabulary.length + ' words</div>';
    html += '<span class="badge ' + (done ? 'badge-done' : 'badge-todo') + '">' + (done ? 'Completed' : 'Not started') + '</span>';
    html += '</div>';
  });
  html += '</div>';

  el.innerHTML = html;
};

window.openLesson = function (id) {
  var lesson = findById(COURSE_DATA.lessons, id);
  if (!lesson) {
    showSection('lessons');
    return;
  }
  document.getElementById('lessonList').style.display = 'none';
  var detail = document.getElementById('lessonDetail');
  detail.style.display = 'block';

  var completed = getCompletedLessons();
  var done = completed.indexOf(id) !== -1;

  var html = '<button class="back-link" onclick="closeLessonDetail()">&larr; Back to Lessons</button>';
  html += '<h1>Day ' + lesson.day + ' — Lesson ' + id + ': ' + esc(lesson.title_en) + '</h1>';
  html += '<p style="color:#9ca3af">' + esc(lesson.title_zh) + '</p>';

  // Objectives
  html += '<h2>Objectives</h2><ul style="margin-left:1.2rem;color:#d1d5db">';
  lesson.objectives.forEach(function (o) { html += '<li>' + esc(o) + '</li>'; });
  html += '</ul>';

  // Time allocation bar
  html += '<h2>30-Minute Plan</h2>';
  var totalMin = 0;
  lesson.duration_plan.forEach(function (d) { totalMin += d.minutes; });
  html += '<div class="time-bar">';
  lesson.duration_plan.forEach(function (d, i) {
    var w = (d.minutes / totalMin * 100).toFixed(1);
    html += '<div class="seg" style="width:' + w + '%;background:' + TIME_COLORS[i % TIME_COLORS.length] + '" title="' + escAttr(d.minutes + 'min: ' + d.activity) + '">' + d.minutes + 'm</div>';
  });
  html += '</div>';
  html += '<div style="font-size:.82rem;color:#9ca3af;margin-bottom:1rem">';
  lesson.duration_plan.forEach(function (d, i) {
    html += '<span style="display:inline-block;width:10px;height:10px;background:' + TIME_COLORS[i % TIME_COLORS.length] + ';border-radius:2px;margin-right:4px"></span>' + d.minutes + 'min: ' + esc(d.activity) + '<br>';
  });
  html += '</div>';

  // Vocabulary table
  html += '<h2>Vocabulary (' + lesson.vocabulary.length + ' words)</h2>';
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem">';
  html += '<button class="btn" onclick="copyLessonVocab(' + id + ', this)">Copy All Vocabulary</button>';
  html += '<button class="btn" id="playAllBtn" onclick="togglePlayAll(' + id + ', this)">Play All Vocabulary</button>';
  html += '</div>';
  html += '<div style="overflow-x:auto"><table class="vocab-table"><thead><tr><th></th><th>Word</th><th>Meaning</th><th>Example</th><th></th></tr></thead><tbody>';
  lesson.vocabulary.forEach(function (v) { html += vocabRow(v, null, 'l' + lesson.id); });
  html += '</tbody></table></div>';

  // Actions
  html += '<div style="margin-top:1rem;display:flex;gap:.5rem;flex-wrap:wrap">';
  html += '<button class="btn ' + (done ? 'btn-done' : 'btn-success') + '" onclick="toggleComplete(' + id + '); window.openLesson(' + id + ')">' + (done ? '&#x2714; Completed' : 'Mark Complete') + '</button>';
  html += '</div>';

  detail.innerHTML = html;
  window.scrollTo(0, 0);
};

function closeLessonDetail() {
  // Stop playback if running
  if (_playAllState && !_playAllState.stopped) {
    _playAllState.stopped = true;
    _stopAll();
  }
  document.getElementById('lessonDetail').style.display = 'none';
  document.getElementById('lessonList').style.display = '';
}

/* ===== Play All Vocabulary (loop) ===== */
var _playAllState = null; // { lessonId, index, stopped, loopCount }

function togglePlayAll(lessonId, btnEl) {
  if (_playAllState && !_playAllState.stopped) {
    // Stop
    _playAllState.stopped = true;
    _stopAll();
    btnEl.textContent = 'Play All Vocabulary';
    btnEl.classList.remove('btn-done');
    return;
  }

  // Start
  _playAllState = { lessonId: lessonId, index: 0, stopped: false, loopCount: 1 };
  btnEl.textContent = 'Stop';
  btnEl.classList.add('btn-done');
  _playNext();
}

function _playNext() {
  var s = _playAllState;
  if (!s || s.stopped) return;

  var lesson = findById(COURSE_DATA.lessons, s.lessonId);
  if (!lesson) return;

  // Wrap around for infinite loop
  if (s.index >= lesson.vocabulary.length) {
    s.index = 0;
    s.loopCount++;
  }

  var v = lesson.vocabulary[s.index];
  var sourceId = 'l' + lesson.id;

  // Update button text with progress
  var btn = document.getElementById('playAllBtn');
  if (btn && !s.stopped) {
    btn.textContent = 'Stop (' + (s.index + 1) + '/' + lesson.vocabulary.length + ' · Loop ' + s.loopCount + ')';
  }

  // Highlight current row
  _highlightRow(s.index);

  // Play word audio, then after a pause play sentence audio, then move to next
  var wordPath = wordAudioPath(v.word);
  var sentencePath = sentenceAudioPath(v.word, sourceId);

  _playSequence([
    { type: 'audio', path: wordPath, fallback: v.word, rate: 0.9 },
    { type: 'pause', ms: 600 },
    { type: 'audio', path: sentencePath, fallback: v.example, rate: 0.85 },
    { type: 'pause', ms: 1000 }
  ], function () {
    if (!s.stopped) {
      s.index++;
      _playNext();
    }
  });
}

function _highlightRow(idx) {
  var table = document.querySelector('#lessonDetail .vocab-table');
  if (!table) return;
  var rows = table.querySelectorAll('tbody tr');
  rows.forEach(function (r, i) {
    r.style.background = i === idx ? '#1e3a5f' : '';
  });
}

function _playSequence(steps, done) {
  var i = 0;
  function next() {
    if (_playAllState && _playAllState.stopped) return;
    if (i >= steps.length) { done(); return; }
    var step = steps[i++];
    if (step.type === 'pause') {
      setTimeout(next, step.ms);
    } else {
      _stopAll();
      var audio = new Audio(step.path);
      var handled = false;
      _currentAudio = audio;

      function onEnd() {
        if (handled) return;
        handled = true;
        if (_currentAudio === audio) _currentAudio = null;
        next();
      }
      function onFail() {
        if (handled) return;
        handled = true;
        if (_currentAudio === audio) _currentAudio = null;
        // Fallback to TTS
        if (hasSpeech()) {
          var u = new SpeechSynthesisUtterance(step.fallback);
          u.lang = 'en-US';
          u.rate = step.rate || 0.9;
          u.onend = next;
          u.onerror = next;
          speechSynthesis.speak(u);
        } else {
          next();
        }
      }

      audio.onended = onEnd;
      audio.onerror = onFail;
      audio.play().catch(onFail);
    }
  }
  next();
}

function copyLessonVocab(id, btnEl) {
  var lesson = findById(COURSE_DATA.lessons, id);
  if (!lesson) return;
  var prefix = "Here are vocabulary words I'm studying for a TSMC AI Change Management interview. Please quiz me on 5 random words:\n\n";
  var lines = lesson.vocabulary.map(function (v) {
    return v.word + ' | ' + v.meaning_zh + ' | ' + v.example;
  });
  copyText(prefix + lines.join('\n'), btnEl);
}
