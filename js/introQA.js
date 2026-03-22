/* ===== Intro Q&A — PDC / Release / Customer Response ===== */
var INTROQA_PREFIX = "I'm practicing my interview answer for a TSMC AI Change Management role. Please give me feedback on fluency, grammar, structure, and persuasiveness:\n\nQuestion: ";

function toggleIntroQA(id) {
  var el = document.getElementById('introqa-answer-' + id);
  if (el) el.classList.toggle('show');
}

function renderIntroQA() {
  var el = document.getElementById('introQA');
  if (!el) return;
  var qa = PREP_DATA.intro_qa;

  var html = '<h1>Intro Q&amp;A</h1>';
  html += '<p style="color:#9ca3af;margin-bottom:1.5rem">PDC 具體貢獻、Release Throughput、客戶回應時間、AI 導入策略 — 深度追問與補充</p>';

  qa.forEach(function (item, idx) {
    var isFollowUp = (item.id === 'pdc-core' || item.id === '24h-meaning');
    var badge = isFollowUp
      ? ' <span style="background:#3b1f4a;color:#c084fc;font-size:.7rem;padding:.1rem .45rem;border-radius:10px;margin-left:.4rem">追問</span>'
      : '';

    html += '<div class="qa-card">';

    /* Question header */
    html += '<div class="qa-question" onclick="toggleIntroQA(\'' + item.id + '\')">';
    html += '<span class="qa-arrow">&#9654;</span> ';
    html += '<span style="color:#60a5fa;font-weight:600;margin-right:.3rem">' + (idx + 1) + '.</span>';
    html += esc(item.question_en) + badge;
    html += '</div>';

    /* Expandable answer area */
    html += '<div class="expandable" id="introqa-answer-' + item.id + '">';

    /* Chinese question */
    html += '<div style="padding:.75rem 1.2rem .25rem;color:#9ca3af;font-size:.88rem">';
    html += '<strong>中文題目：</strong>' + esc(item.question_zh);
    html += '</div>';

    /* Chinese answer */
    html += '<h3 style="padding:0 1.2rem;margin-top:.75rem">中文答案</h3>';
    html += '<div class="qa-answer-text">' + esc(item.answer_zh) + '</div>';
    html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;padding:.5rem 1.2rem">';
    html += '<button class="btn btn-sm" onclick="copyText(PREP_DATA.intro_qa[' + idx + '].answer_zh, this)">Copy 中文</button>';
    html += '</div>';

    /* English answer */
    html += '<h3 style="padding:0 1.2rem;margin-top:1rem">English Answer</h3>';
    html += '<div class="qa-answer-text">' + esc(item.answer_en) + '</div>';
    html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;padding:.5rem 1.2rem .75rem">';
    html += '<button class="btn btn-sm" onclick="copyText(INTROQA_PREFIX + ' + JSON.stringify(item.question_en) + ' + \'\\n\\nMy answer:\\n\' + PREP_DATA.intro_qa[' + idx + '].answer_en, this)">Copy for Feedback</button>';
    html += '<button class="btn btn-sm" onclick="playScript(\'introqa-' + item.id + '.mp3\', this)">Nova (Listen)</button>';
    html += '</div>';

    html += '</div>'; // expandable
    html += '</div>'; // qa-card
  });

  el.innerHTML = html;
}
