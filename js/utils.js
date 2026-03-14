/* ===== Copy to Clipboard ===== */
function copyText(text, btnEl) {
  function onSuccess() {
    if (!btnEl) return;
    var orig = btnEl.textContent;
    btnEl.textContent = 'Copied!';
    btnEl.classList.add('btn-copied');
    setTimeout(function () {
      btnEl.textContent = orig;
      btnEl.classList.remove('btn-copied');
    }, 2000);
  }
  function onFail() {
    if (!btnEl) return;
    var orig = btnEl.textContent;
    btnEl.textContent = 'Failed';
    btnEl.classList.add('btn-failed');
    setTimeout(function () {
      btnEl.textContent = orig;
      btnEl.classList.remove('btn-failed');
    }, 2000);
  }
  // Try Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
      // Fallback to execCommand
      fallbackCopy(text) ? onSuccess() : onFail();
    });
  } else {
    fallbackCopy(text) ? onSuccess() : onFail();
  }
}

function fallbackCopy(text) {
  try {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    var ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}

/* ===== Speech / Audio Playback ===== */
function hasSpeech() {
  return 'speechSynthesis' in window;
}

var _currentAudio = null;

function _stopAll() {
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.currentTime = 0;
    _currentAudio = null;
  }
  if (hasSpeech()) speechSynthesis.cancel();
}

function _speakTTS(text, rate) {
  if (!hasSpeech()) return;
  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate || 0.9;
  speechSynthesis.speak(u);
}

function _playWithFallback(audioPath, fallbackText, rate) {
  _stopAll();
  var audio = new Audio(audioPath);
  var handled = false;
  _currentAudio = audio;
  function onFail() {
    if (handled) return;
    handled = true;
    if (_currentAudio === audio) _currentAudio = null;
    _speakTTS(fallbackText, rate);
  }
  audio.onerror = onFail;
  audio.play().catch(onFail);
}

function speak(text, rate, isWord) {
  if (isWord) {
    _playWithFallback(wordAudioPath(text), text, rate);
  } else {
    _stopAll();
    _speakTTS(text, rate);
  }
}

function speakSentence(word, sentence, rate, sourceId) {
  _playWithFallback(sentenceAudioPath(word, sourceId), sentence, rate);
}

/* ===== Word Cleaning (shared by dictUrl + wordAudioPath) ===== */
function cleanWord(word) {
  return word
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-zA-Z\s-]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join('-')
    .toLowerCase();
}

/* ===== Cambridge Dictionary URL ===== */
function dictUrl(word) {
  return 'https://dictionary.cambridge.org/dictionary/english/' + cleanWord(word);
}

/* ===== Local Word Audio Path ===== */
function wordAudioPath(word) {
  return 'audio/words/' + cleanWord(word) + '.mp3';
}

/* ===== Local Sentence Audio Path ===== */
function sentenceAudioPath(word, sourceId) {
  return 'audio/sentences/' + cleanWord(word) + '--' + sourceId + '.mp3';
}

/* ===== Section Navigation ===== */
function showSection(id) {
  document.querySelectorAll('.section').forEach(function (s) {
    s.classList.remove('active');
  });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');

  document.querySelectorAll('nav button').forEach(function (b) {
    b.classList.remove('active');
  });
  var navBtn = document.querySelector('nav button[data-section="' + id + '"]');
  if (navBtn) navBtn.classList.add('active');

  // Reset lesson detail state when switching away
  var detail = document.getElementById('lessonDetail');
  if (detail) detail.style.display = 'none';
  var list = document.getElementById('lessonList');
  if (list) list.style.display = '';

  window.scrollTo(0, 0);
}

/* ===== Shared Vocab Row Renderer ===== */
function vocabRow(v, dataCat, sourceId) {
  return '<tr' + (dataCat ? ' data-cat="' + dataCat + '"' : '') + '>' +
    '<td>' +
      '<button class="icon-btn" onclick="speak(\'' + escAttr(v.word) + '\', 0.9, true)" title="Speak word">&#x1F50A;</button> ' +
      '<a href="' + dictUrl(v.word) + '" target="_blank" rel="noopener" class="icon-btn" title="Dictionary">&#x1F4D6;</a>' +
    '</td>' +
    '<td><strong>' + esc(v.word) + '</strong>' +
      (v.phonetic ? ' <span style="color:#9ca3af;font-size:.8rem">' + esc(v.phonetic) + '</span>' : '') +
      (v.pos ? ' <span style="color:#6b7280;font-size:.78rem">' + esc(v.pos) + '</span>' : '') +
    '</td>' +
    '<td>' + esc(v.meaning_zh) + '</td>' +
    '<td style="font-size:.85rem;color:#d1d5db">' + esc(v.example) +
      '<button class="icon-btn" onclick="speakSentence(\'' + escAttr(v.word) + '\', \'' + escAttr(v.example) + '\', 0.85, \'' + escAttr(sourceId) + '\')" title="Speak example" style="margin-left:.3rem">&#x1F50A;</button>' +
    '</td>' +
    '<td><button class="btn btn-sm" onclick="copyText(\'' + escAttr(v.word + ' — ' + v.meaning_zh + ' — ' + v.example) + '\', this)">Copy</button></td>' +
    '</tr>';
}

/* ===== Progress Tracking (shared) ===== */
function getCompletedLessons() {
  try {
    var data = localStorage.getItem('tsmcCompletedLessons');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveCompletedLessons(arr) {
  try { localStorage.setItem('tsmcCompletedLessons', JSON.stringify(arr)); } catch (e) {}
}

function toggleComplete(lessonId) {
  var completed = getCompletedLessons();
  var idx = completed.indexOf(lessonId);
  if (idx === -1) {
    completed.push(lessonId);
  } else {
    completed.splice(idx, 1);
  }
  saveCompletedLessons(completed);
  if (window.renderHome) window.renderHome();
  if (window.renderLessons) window.renderLessons();
}

function resetProgress() {
  try { localStorage.removeItem('tsmcCompletedLessons'); } catch (e) {}
  if (window.renderHome) window.renderHome();
  if (window.renderLessons) window.renderLessons();
}

/* ===== Cached Constants ===== */
var HAS_SPEECH = hasSpeech();
var CATEGORY_LABELS = {
  semiconductor: 'Semi',
  ai_tech: 'AI',
  change_mgmt: 'Change'
};

/* ===== Shared Lookup Helper ===== */
function findById(arr, id) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return arr[i];
  }
  return null;
}

/* ===== HTML Escape Helpers ===== */
var _escDiv = document.createElement('div');
function esc(s) {
  if (!s) return '';
  _escDiv.textContent = s;
  return _escDiv.innerHTML;
}

function escAttr(s) {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}
