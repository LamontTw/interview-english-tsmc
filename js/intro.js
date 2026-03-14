/* ===== Self-Intro Page ===== */
var INTRO_PREFIX = "I'm practicing my interview self-introduction for a TSMC AI Change Management role. Please listen and give me feedback on fluency, grammar, and delivery:\n\n";

var _introAudio = null;
var _introLooping = false;

function playScript(audioFile, btnEl) {
  // If already playing this one, stop
  if (_introAudio && btnEl && btnEl.classList.contains('btn-done')) {
    stopScript(btnEl);
    return;
  }
  // Stop any previous
  stopScriptQuiet();
  _stopAll();

  _introLooping = true;
  _introAudio = new Audio('audio/scripts/' + audioFile);
  _introAudio.playbackRate = 1.0;

  // Loop infinitely
  _introAudio.onended = function () {
    if (_introLooping) {
      _introAudio.currentTime = 0;
      _introAudio.play().catch(function () {});
    }
  };

  _introAudio.play().catch(function () {
    // Fallback: won't loop but at least plays once
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

function renderIntro() {
  var el = document.getElementById('intro');
  var data = PREP_DATA.self_introductions;

  var html = '<h1>Self-Introduction Scripts</h1>';
  html += '<p style="color:#9ca3af;margin-bottom:1rem">Tailored for TSMC Manager, AI Change Management</p>';

  // 60-second version
  html += '<h2>60-Second Version</h2>';
  html += '<div class="script-block">' + esc(data.sixty_seconds) + '</div>';
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap">';
  html += '<button class="btn" onclick="copyText(INTRO_PREFIX + PREP_DATA.self_introductions.sixty_seconds, this)">Copy Script</button>';
  html += '<button class="btn" onclick="playScript(\'intro-60s.mp3\', this)">Listen (Loop)</button>';
  html += '</div>';

  // 2-minute version
  html += '<h2>2-Minute Version</h2>';
  html += '<div class="script-block">' + esc(data.two_minutes) + '</div>';
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap">';
  html += '<button class="btn" onclick="copyText(INTRO_PREFIX + PREP_DATA.self_introductions.two_minutes, this)">Copy Script</button>';
  html += '<button class="btn" onclick="playScript(\'intro-2min.mp3\', this)">Listen (Loop)</button>';
  html += '</div>';

  // Company hooks
  html += '<h2>TSMC-Specific Hook</h2>';
  var companies = Object.keys(data.company_hooks);
  companies.forEach(function (c) {
    html += '<div class="script-block">' + esc(data.company_hooks[c]) + '</div>';
    html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap">';
    html += '<button class="btn" onclick="copyText(INTRO_PREFIX + PREP_DATA.self_introductions.company_hooks[\'' + c + '\'], this)">Copy Hook</button>';
    html += '<button class="btn" onclick="playScript(\'intro-tsmc-hook.mp3\', this)">Listen (Loop)</button>';
    html += '</div>';
  });

  el.innerHTML = html;
}
