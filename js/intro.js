/* ===== Self-Intro & Interview Prep Page ===== */
var INTRO_PREFIX = "I'm practicing my interview self-introduction for a TSMC AI Change Management role. Please listen and give me feedback on fluency, grammar, and delivery:\n\n";
var QA_PREFIX = "I'm practicing my interview answer for a TSMC AI Change Management role. Please give me feedback on fluency, grammar, structure, and persuasiveness:\n\nQuestion: ";

var _introAudio = null;
var _introLooping = false;

function playScript(audioFile, btnEl) {
  if (_introAudio && btnEl && btnEl.classList.contains('btn-done')) {
    stopScript(btnEl);
    return;
  }
  stopScriptQuiet();
  _stopAll();

  _introLooping = true;
  _introAudio = new Audio('audio/scripts/' + audioFile);
  _introAudio.playbackRate = 1.0;

  _introAudio.onended = function () {
    if (_introLooping) {
      _introAudio.currentTime = 0;
      _introAudio.play().catch(function () {});
    }
  };

  _introAudio.play().catch(function () {
    _introLooping = false;
  });

  if (btnEl) {
    btnEl.dataset.origText = btnEl.textContent;
    btnEl.textContent = 'Stop Looping';
    btnEl.classList.add('btn-done');
  }
}

function stopScript(btnEl) {
  stopScriptQuiet();
  if (btnEl) {
    btnEl.textContent = btnEl.dataset.origText || 'Listen (Loop)';
    btnEl.classList.remove('btn-done');
  }
}

function stopScriptQuiet() {
  _introLooping = false;
  if (_introAudio) {
    _introAudio.pause();
    _introAudio.currentTime = 0;
    _introAudio.onended = null;
    _introAudio = null;
  }
}

/* Play MP3 if available, otherwise fallback to TTS */
function playScriptOrTTS(audioFile, text, btnEl) {
  // If already playing, stop
  if (btnEl && btnEl.classList.contains('btn-done')) {
    stopScript(btnEl);
    if (hasSpeech()) speechSynthesis.cancel();
    return;
  }
  stopScriptQuiet();
  _stopAll();

  // Try MP3 first
  var audio = new Audio('audio/scripts/' + audioFile);
  var usedTTS = false;

  audio.onerror = function () {
    // MP3 not found, fallback to TTS
    if (usedTTS) return;
    usedTTS = true;
    _readAloudTTS(text, btnEl);
  };

  _introLooping = true;
  _introAudio = audio;
  audio.playbackRate = 1.0;

  audio.onended = function () {
    if (_introLooping) {
      audio.currentTime = 0;
      audio.play().catch(function () {});
    }
  };

  audio.play().catch(function () {
    if (!usedTTS) {
      usedTTS = true;
      _readAloudTTS(text, btnEl);
    }
  });

  if (btnEl) {
    btnEl.dataset.origText = btnEl.textContent;
    btnEl.textContent = 'Stop';
    btnEl.classList.add('btn-done');
  }
}

/* TTS-only reading (internal helper) */
function _readAloudTTS(text, btnEl) {
  if (!hasSpeech()) return;
  _introLooping = false;
  _introAudio = null;

  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  u.onend = function () {
    if (btnEl) {
      btnEl.textContent = btnEl.dataset.origText || 'Listen';
      btnEl.classList.remove('btn-done');
    }
  };
  speechSynthesis.speak(u);

  if (btnEl) {
    if (!btnEl.dataset.origText) btnEl.dataset.origText = btnEl.textContent;
    btnEl.textContent = 'Stop';
    btnEl.classList.add('btn-done');
  }
}

/* Simple TTS read aloud (for short texts) */
function readAloud(text, btnEl) {
  if (!hasSpeech()) return;
  if (btnEl && btnEl.classList.contains('btn-done')) {
    speechSynthesis.cancel();
    btnEl.textContent = btnEl.dataset.origText || 'Read Aloud';
    btnEl.classList.remove('btn-done');
    return;
  }
  _stopAll();
  stopScriptQuiet();
  _readAloudTTS(text, btnEl);
}

/* Toggle Q&A answer visibility */
function toggleQA(id) {
  var el = document.getElementById('qa-answer-' + id);
  if (el) el.classList.toggle('show');
}

function renderIntro() {
  var el = document.getElementById('intro');
  var data = PREP_DATA.self_introductions;
  var qa = PREP_DATA.interview_qa;
  var questions = PREP_DATA.questions_to_ask;
  var tips = PREP_DATA.interview_tips;

  var html = '<h1>Interview Prep</h1>';
  html += '<p style="color:#9ca3af;margin-bottom:1rem">Tailored for TSMC Manager, AI Change Management</p>';

  /* ===== Section 1: Self-Introduction Scripts ===== */
  html += '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem">Self-Introduction Scripts</h2>';

  // 60-second version
  html += '<h3>60-Second Version <span style="color:#6b7280;font-size:.85rem;font-weight:400">— Punchy, metric-heavy</span></h3>';
  html += '<div class="script-block">' + esc(data.sixty_seconds) + '</div>';
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap">';
  html += '<button class="btn" onclick="copyText(INTRO_PREFIX + PREP_DATA.self_introductions.sixty_seconds, this)">Copy Script</button>';
  html += '<button class="btn" onclick="playScript(\'intro-60s.mp3\', this)">Listen (Loop)</button>';
  html += '</div>';

  // 90-second version
  html += '<h3>90-Second Version <span style="color:#6b7280;font-size:.85rem;font-weight:400">— Leadership framing + metrics</span></h3>';
  html += '<div class="script-block">' + esc(data.ninety_seconds) + '</div>';
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap">';
  html += '<button class="btn" onclick="copyText(INTRO_PREFIX + PREP_DATA.self_introductions.ninety_seconds, this)">Copy Script</button>';
  html += '<button class="btn" onclick="playScript(\'intro-90s.mp3\', this)">Listen (Loop)</button>';
  html += '</div>';

  // 2-minute version
  html += '<h3>2-Minute Version <span style="color:#6b7280;font-size:.85rem;font-weight:400">— Full career arc</span></h3>';
  html += '<div class="script-block">' + esc(data.two_minutes) + '</div>';
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap">';
  html += '<button class="btn" onclick="copyText(INTRO_PREFIX + PREP_DATA.self_introductions.two_minutes, this)">Copy Script</button>';
  html += '<button class="btn" onclick="playScript(\'intro-2min.mp3\', this)">Listen (Loop)</button>';
  html += '</div>';

  // Quick intro (30s)
  html += '<h3>Quick Version <span style="color:#6b7280;font-size:.85rem;font-weight:400">— "Please briefly introduce yourself"</span></h3>';
  html += '<div class="script-block">' + esc(data.quick_intro) + '</div>';
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap">';
  html += '<button class="btn" onclick="copyText(INTRO_PREFIX + PREP_DATA.self_introductions.quick_intro, this)">Copy Script</button>';
  html += '<button class="btn" onclick="playScript(\'intro-quick.mp3\', this)">Listen (Loop)</button>';
  html += '</div>';

  // Natural delivery version
  html += '<h3>Natural Delivery <span style="color:#6b7280;font-size:.85rem;font-weight:400">— Conversational, relaxed tone</span></h3>';
  html += '<div class="script-block">' + esc(data.natural_delivery) + '</div>';
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap">';
  html += '<button class="btn" onclick="copyText(INTRO_PREFIX + PREP_DATA.self_introductions.natural_delivery, this)">Copy Script</button>';
  html += '<button class="btn" onclick="playScript(\'intro-natural.mp3\', this)">Listen (Loop)</button>';
  html += '</div>';

  // Company hooks
  html += '<h3>TSMC-Specific Hook</h3>';
  var companies = Object.keys(data.company_hooks);
  companies.forEach(function (c) {
    html += '<div class="script-block">' + esc(data.company_hooks[c]) + '</div>';
    html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap">';
    html += '<button class="btn" onclick="copyText(INTRO_PREFIX + PREP_DATA.self_introductions.company_hooks[\'' + c + '\'], this)">Copy Hook</button>';
    html += '<button class="btn" onclick="playScript(\'intro-tsmc-hook.mp3\', this)">Listen (Loop)</button>';
    html += '</div>';
  });

  /* ===== Section 2: Common Interview Q&A ===== */
  html += '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">Common Interview Q&A</h2>';
  html += '<p style="color:#9ca3af;margin-bottom:1rem">Click a question to expand the answer. Answers include specific examples from your experience.</p>';

  qa.forEach(function (item) {
    html += '<div class="qa-card">';
    html += '<div class="qa-question" onclick="toggleQA(\'' + item.id + '\')">';
    html += '<span class="qa-arrow" id="qa-arrow-' + item.id + '">&#9654;</span> ' + esc(item.question);
    html += '</div>';
    html += '<div class="expandable" id="qa-answer-' + item.id + '">';
    html += '<div class="qa-answer-text">' + esc(item.answer) + '</div>';
    html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem">';
    html += '<button class="btn btn-sm" onclick="copyText(QA_PREFIX + ' + JSON.stringify(item.question) + ' + \'\\n\\nMy answer:\\n\' + PREP_DATA.interview_qa[' + qa.indexOf(item) + '].answer, this)">Copy for Feedback</button>';
    html += '<button class="btn btn-sm" onclick="playScript(\'qa-' + item.id + '.mp3\', this)">Onyx</button>';
    html += '<button class="btn btn-sm" onclick="playScript(\'qa-' + item.id + '-echo.mp3\', this)">Echo</button>';
    html += '<button class="btn btn-sm" onclick="playScript(\'qa-' + item.id + '-nova.mp3\', this)">Nova</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
  });

  /* ===== Section 3: Questions to Ask ===== */
  html += '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">Questions to Ask Jean</h2>';
  html += '<p style="color:#9ca3af;margin-bottom:1rem">Pick 2-3 at the end of the interview.</p>';

  html += '<div class="qa-list">';
  questions.forEach(function (q, i) {
    html += '<div class="qa-item">';
    html += '<span style="color:#60a5fa;font-weight:600">' + (i + 1) + '.</span> ' + esc(q);
    html += ' <button class="btn btn-sm" style="margin-left:.5rem" onclick="readAloud(\'' + escAttr(q) + '\', this)">Practice</button>';
    html += '</div>';
  });
  html += '</div>';

  /* ===== Section 4: Interview Tips ===== */
  html += '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">Interview Tips</h2>';

  tips.forEach(function (tip) {
    html += '<div class="tip-card">';
    html += '<div class="tip-title">' + esc(tip.title) + '</div>';
    html += '<div class="tip-content">' + esc(tip.content) + '</div>';
    html += '</div>';
  });

  el.innerHTML = html;
}
