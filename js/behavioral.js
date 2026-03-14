/* ===== Behavioral Q&A Page ===== */
var STAR_PREFIX = "I'm practicing this STAR behavioral interview answer for a TSMC AI Change Management role. After reading, ask me 2 follow-up questions:\n\n";

function renderBehavioral() {
  var el = document.getElementById('behavioral');
  var questions = PREP_DATA.behavioral_questions;

  var html = '<h1>Behavioral Interview Q&A (STAR Method)</h1>';
  html += '<p style="color:#9ca3af;margin-bottom:1rem">' + questions.length + ' questions with STAR-formatted answers — tailored for TSMC</p>';

  questions.forEach(function (q) {
    html += '<div class="bq-card">';
    html += '<div class="bq-question">Q' + q.id + ': ' + esc(q.question) + '</div>';

    // STAR sections
    html += starSection('S', 'Situation', q.situation);
    html += starSection('T', 'Task', q.task);
    html += starSection('A', 'Action', q.action);
    html += starSection('R', 'Result', q.result);

    // Key phrases
    html += '<div class="bq-phrases">';
    q.key_phrases.forEach(function (p) { html += '<span>' + esc(p) + '</span>'; });
    html += '</div>';

    // Tips
    html += '<div class="bq-tips">' + esc(q.tips) + '</div>';

    // Actions
    html += '<div class="bq-actions">';
    html += '<button class="btn btn-sm" onclick="toggleAnswer(' + q.id + ', this)">Show Full Answer</button>';
    html += '<button class="btn btn-sm" onclick="playScript(\'behavioral-q' + q.id + '.mp3\', this)">Listen (Loop)</button>';
    html += '<button class="btn btn-sm" onclick="copyBehavioral(' + q.id + ', this)">Copy</button>';
    html += '</div>';

    // Full answer (hidden)
    html += '<div class="expandable" id="bq-full-' + q.id + '"><div class="bq-full-answer">' + esc(q.full_answer) + '</div></div>';

    html += '</div>';
  });

  el.innerHTML = html;
}

function starSection(letter, label, text) {
  var cls = 'star-' + letter.toLowerCase();
  return '<div class="bq-section"><span class="star-tag ' + cls + '">' + letter + '</span><strong>' + label + ':</strong><p>' + esc(text) + '</p></div>';
}

function toggleAnswer(id, btnEl) {
  var el = document.getElementById('bq-full-' + id);
  if (el.classList.contains('show')) {
    el.classList.remove('show');
    btnEl.textContent = 'Show Full Answer';
  } else {
    el.classList.add('show');
    btnEl.textContent = 'Hide Full Answer';
  }
}

function copyBehavioral(id, btnEl) {
  var q = findById(PREP_DATA.behavioral_questions, id);
  if (!q) return;
  var text = STAR_PREFIX + 'Question: ' + q.question + '\n\n' + q.full_answer;
  copyText(text, btnEl);
}
