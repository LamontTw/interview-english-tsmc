/* ===== Strengths & Weaknesses Q&A ===== */

var SW_DATA = {
  full: {
    zh: '我認為我一個比較獨特的優勢，是擅長把複雜的事情簡單化。\n這個能力讓我在複雜情境下推動執行，以及跨部門溝通與對齊上，都能發揮得比較好。因為很多時候，組織裡真正的挑戰不是事情本身太難，而是資訊太多、觀點太雜、優先順序不一致。我的角色通常就是把這些複雜因素整理清楚，幫助大家聚焦真正重要的目標，然後一步一步往前推進。\n\n如果說缺點的話，我覺得我有時候會太快進入解題模式。當我覺得方向已經很清楚時，我會傾向很快把答案收斂下來，直接往前推動。但這樣有時候會沒有留給團隊足夠的思考空間。長期來看，一方面可能讓我自己扛太多事情，另一方面也不一定有助於團隊的成長。\n\n這一點其實也是我過去在 CINNOX 很有感觸的一件事。特別是在組織變革的過程中，有些時候不能只是急著把答案給出來，而是要讓討論和調整有一些時間。因為只有這樣，團隊才會真正參與進來，組織也才有機會形成穩定的共識。後來當我更有意識地去調整這件事之後，不管是團隊成長還是整體運作效率，其實都有明顯改善。我們也更能在效率和團隊成長之間取得平衡。\n\n至於我現在想找新機會，主要是因為我希望進入一個更大規模、更具影響力，也更複雜的環境，去結合我在管理、變革推動，以及 AI 導入上的經驗。過去這些年，我累積了很多跨部門協作、組織對齊，以及新流程導入的實務經驗。看到 TSMC 這個職位時，我會覺得非常有吸引力，因為它不只是單純做專案管理，而是一個能夠真正推動組織改變、發揮更大價值的角色。',
    en: "One of my more distinctive strengths is that I'm good at making complex things simple.\nThis helps me both in driving execution under complex conditions and in aligning cross-functional stakeholders. In many organizations, the real challenge is not that the problem itself is too difficult, but that there is too much information, too many perspectives, and different priorities across teams. My role is often to bring clarity to that complexity, help people focus on what matters most, and move things forward step by step.\n\nIf I had to mention a weakness, I would say that I sometimes move into problem-solving mode too quickly. When I feel the direction is already clear, I tend to narrow down the answer and push forward quickly. However, the downside is that this can sometimes leave too little space for the team to think through the issue on their own. Over time, that may lead to me taking on too much personally, and it may not be the best approach for the team's long-term growth.\n\nThis is actually something I became very aware of during my time at CINNOX. Especially in organizational change, there are times when you cannot simply rush to provide the answer. You need to allow some space for discussion, adjustment, and participation. Only then can the team truly engage in the change, and the organization can build more stable alignment. After I became more intentional about adjusting this, I saw clear improvement in both team development and overall execution. We became much more capable of balancing efficiency with team growth.\n\nAs for why I'm looking for a new opportunity, it is because I hope to work in a larger-scale, more complex, and more impactful environment where I can combine my experience in management, change leadership, and AI adoption. Over the years, I have built strong practical experience in cross-functional collaboration, stakeholder alignment, and the implementation of new processes. When I saw this role at TSMC, I found it very attractive because it is not just about project management. It is a role where I can truly contribute to organizational change and create broader value."
  },
  short: {
    zh: '我覺得我一個比較獨特的優勢，是擅長把複雜的事情簡單化。\n所以不管是在複雜情境下推動執行，或是在跨部門溝通與對齊上，我都比較能快速抓到重點，幫助大家聚焦方向、往前推進。\n\n缺點的話，我有時候會太快進入解題模式。當我覺得方向已經很清楚時，會想很快把答案收斂下來，但這有時候會壓縮團隊思考和參與的空間。這幾年我也有刻意調整，提醒自己在效率和團隊成長之間取得更好的平衡。\n\n我現在想找新機會，是因為希望進入一個更大規模、更有影響力的環境，把我在管理、變革推動和 AI 導入上的經驗，放在更有價值的平台上發揮。而 TSMC 這個角色，正好很符合我想發展的方向。',
    en: "One of my more distinctive strengths is that I'm good at making complex things simple.\nThat helps me both in driving execution under complexity and in aligning cross-functional teams, because I can usually identify the key issue, create clarity, and help people move in the same direction.\n\nAs for my weakness, I sometimes move into problem-solving mode too quickly. When I feel the answer is already clear, I may push forward too fast, which can reduce the team's space to think and contribute. Over the years, I've become much more intentional about balancing efficiency with team growth.\n\nThe reason I'm looking for a new opportunity is that I want to work in a larger and more impactful environment where I can combine my experience in management, change leadership, and AI adoption. That is why I'm particularly interested in this role at TSMC."
  }
};

/* ===== Audio state for this section ===== */
var _swSpeaking = false;
var _swBtnEl = null;

function _swReset() {
  _swSpeaking = false;
  if (_swBtnEl) {
    _swBtnEl.textContent = _swBtnEl.dataset.origText || 'Listen';
    _swBtnEl.classList.remove('btn-done');
    _swBtnEl = null;
  }
}

function swReadAloud(text, lang, btnEl) {
  if (!hasSpeech()) { alert('您的瀏覽器不支援語音朗讀。'); return; }

  // Toggle off if already playing
  if (_swSpeaking && _swBtnEl === btnEl) {
    speechSynthesis.cancel();
    _swReset();
    return;
  }

  // Stop any previous
  speechSynthesis.cancel();
  _stopAll();
  stopScriptQuiet();
  _swReset();

  _swSpeaking = true;
  _swBtnEl = btnEl;
  if (btnEl) {
    btnEl.dataset.origText = btnEl.textContent;
    btnEl.textContent = '⏹ Stop';
    btnEl.classList.add('btn-done');
  }

  var u = new SpeechSynthesisUtterance(text);
  u.lang = lang || 'en-US';
  u.rate = 0.88;
  u.onend = function () { _swReset(); };
  u.onerror = function () { _swReset(); };
  speechSynthesis.speak(u);
}

/* ===== Render ===== */
function renderStrengths() {
  var el = document.getElementById('strengths');
  if (!el) return;

  function scriptBlock(text) {
    return '<div class="script-block" style="white-space:pre-wrap">' + esc(text) + '</div>';
  }

  function listenBtn(text, lang, label) {
    var safeText = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    return '<button class="btn" onclick="swReadAloud(\'' + safeText + '\', \'' + lang + '\', this)">' + (label || '&#x1F50A; Listen') + '</button>';
  }

  function copyBtn(text, label) {
    var safeText = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    return '<button class="btn" onclick="copyText(\'' + safeText + '\', this)">' + (label || 'Copy') + '</button>';
  }

  var html = '<h1>優缺點 Q&amp;A</h1>';
  html += '<p style="color:#9ca3af;margin-bottom:1.5rem">Strengths &amp; Weaknesses — TSMC Manager, AI Change Management</p>';

  /* ===== Full Version ===== */
  html += '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem">完整版 Full Version</h2>';
  html += '<p style="color:#9ca3af;font-size:.9rem;margin-bottom:1rem">適合對方問「Tell me about your strengths and weaknesses」且有充裕時間時使用</p>';

  // Chinese full
  html += '<h3>中文 <span style="color:#6b7280;font-size:.85rem;font-weight:400">— 完整中文版</span></h3>';
  html += scriptBlock(SW_DATA.full.zh);
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem">';
  html += copyBtn(SW_DATA.full.zh, 'Copy 中文');
  html += listenBtn(SW_DATA.full.zh, 'zh-TW', '&#x1F50A; 朗讀中文');
  html += '</div>';

  // English full
  html += '<h3 style="margin-top:1.5rem">English <span style="color:#6b7280;font-size:.85rem;font-weight:400">— Full version</span></h3>';
  html += scriptBlock(SW_DATA.full.en);
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem">';
  html += copyBtn(SW_DATA.full.en, 'Copy English');
  html += listenBtn(SW_DATA.full.en, 'en-US', '&#x1F50A; Listen (EN)');
  html += '</div>';

  /* ===== Short Version ===== */
  html += '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">精簡版 Short Version</h2>';
  html += '<p style="color:#9ca3af;font-size:.9rem;margin-bottom:1rem">適合對方不想聽太長，或快速帶過時使用</p>';

  // Chinese short
  html += '<h3>中文 <span style="color:#6b7280;font-size:.85rem;font-weight:400">— 精簡中文版</span></h3>';
  html += scriptBlock(SW_DATA.short.zh);
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem">';
  html += copyBtn(SW_DATA.short.zh, 'Copy 中文');
  html += listenBtn(SW_DATA.short.zh, 'zh-TW', '&#x1F50A; 朗讀中文');
  html += '</div>';

  // English short
  html += '<h3 style="margin-top:1.5rem">English <span style="color:#6b7280;font-size:.85rem;font-weight:400">— Short version</span></h3>';
  html += scriptBlock(SW_DATA.short.en);
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem">';
  html += copyBtn(SW_DATA.short.en, 'Copy English');
  html += listenBtn(SW_DATA.short.en, 'en-US', '&#x1F50A; Listen (EN)');
  html += '</div>';

  /* ===== Key Phrases ===== */
  html += '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">關鍵句 Key Phrases</h2>';
  html += '<p style="color:#9ca3af;font-size:.9rem;margin-bottom:1rem">點擊朗讀，練習個別關鍵句的發音與語氣</p>';

  var phrases = [
    { zh: '擅長把複雜的事情簡單化', en: "I'm good at making complex things simple." },
    { zh: '幫助大家聚焦真正重要的目標', en: 'Help people focus on what matters most.' },
    { zh: '太快進入解題模式', en: 'I sometimes move into problem-solving mode too quickly.' },
    { zh: '壓縮團隊思考和參與的空間', en: "This can reduce the team's space to think and contribute." },
    { zh: '在效率和團隊成長之間取得平衡', en: 'Balancing efficiency with team growth.' },
    { zh: '讓討論和調整有一些時間', en: 'Allow some space for discussion, adjustment, and participation.' },
    { zh: '真正推動組織改變、發揮更大價值', en: 'Truly contribute to organizational change and create broader value.' }
  ];

  html += '<div class="qa-list">';
  phrases.forEach(function (p, i) {
    var safeEn = p.en.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    var safeZh = p.zh.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    html += '<div class="qa-item" style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap">';
    html += '<span style="color:#60a5fa;font-weight:600;min-width:1.5rem">' + (i + 1) + '.</span>';
    html += '<span style="color:#9ca3af;font-size:.85rem">' + esc(p.zh) + '</span>';
    html += '<span style="flex:1;min-width:200px">' + esc(p.en) + '</span>';
    html += '<button class="btn btn-sm" onclick="swReadAloud(\'' + safeEn + '\', \'en-US\', this)">&#x1F50A; EN</button>';
    html += '<button class="btn btn-sm" onclick="swReadAloud(\'' + safeZh + '\', \'zh-TW\', this)">&#x1F50A; 中</button>';
    html += '</div>';
  });
  html += '</div>';

  /* ===== Vocabulary Practice ===== */
  var swVocab = [
    {
      word: 'distinctive',
      phonetic: '/dɪˈstɪŋktɪv/',
      pos: 'adj.',
      meaning_zh: '獨特的、有辨識度的',
      example: 'One of my more distinctive strengths is that I can simplify complex situations.'
    },
    {
      word: 'clarity',
      phonetic: '/ˈklærəti/',
      pos: 'n.',
      meaning_zh: '清晰度、明確性',
      example: 'My role is often to bring clarity to that complexity and help people focus.'
    },
    {
      word: 'intentional',
      phonetic: '/ɪnˈtenʃənl/',
      pos: 'adj.',
      meaning_zh: '刻意的、有意識的',
      example: 'I became more intentional about balancing efficiency with team growth.'
    },
    {
      word: 'efficiency',
      phonetic: '/ɪˈfɪʃənsi/',
      pos: 'n.',
      meaning_zh: '效率',
      example: 'We became much more capable of balancing efficiency with team growth.'
    },
    {
      word: 'particularly',
      phonetic: '/pəˈtɪkjələrli/',
      pos: 'adv.',
      meaning_zh: '特別地、尤其',
      example: 'That is why I am particularly interested in this role at TSMC.'
    }
  ];

  html += '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">單字練習 Vocabulary</h2>';
  html += '<p style="color:#9ca3af;font-size:.9rem;margin-bottom:1rem">本篇答案中的關鍵單字</p>';
  html += '<div style="overflow-x:auto"><table class="vocab-table"><thead><tr><th></th><th>Word</th><th>意思</th><th>Example</th><th></th></tr></thead><tbody>';
  swVocab.forEach(function (v) {
    html += vocabRow(v, null, 'sw');
  });
  html += '</tbody></table></div>';

  el.innerHTML = html;
}
