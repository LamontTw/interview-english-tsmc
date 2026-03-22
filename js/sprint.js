/* ===== Sprint Cheat Sheet — 7 Core Questions + 3 Defensive Answers ===== */

function toggleSprint(id) {
  var el = document.getElementById('sprint-' + id);
  if (!el) return;
  el.classList.toggle('show');
}

function switchQ2Tab(tab, btnEl) {
  var tabs = ['full', 'spoken'];
  tabs.forEach(function (t) {
    var panel = document.getElementById('q2-tab-' + t);
    if (panel) panel.style.display = (t === tab) ? '' : 'none';
  });
  var bar = btnEl.parentElement;
  bar.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
  btnEl.classList.add('active');
}

function toggleSprintBQ(id, btnEl) {
  var el = document.getElementById('sprint-bq-' + id);
  if (!el) return;
  if (el.classList.contains('show')) {
    el.classList.remove('show');
    btnEl.textContent = 'Show Full Answer';
  } else {
    el.classList.add('show');
    btnEl.textContent = 'Hide Full Answer';
  }
}

/**
 * Split English text into blocks and render each with its own play button.
 * Splits by \n\n. Merges first block if it's very short (e.g. "Hi, I'm Lamont.").
 * @param {string} text - The full English text
 * @param {string} audioPrefix - e.g. 'sprint-q1-60s' → plays sprint-q1-60s-b1.mp3
 */
function sprintBlocks(text, audioPrefix) {
  var raw = text.split('\n\n').filter(function (b) { return b.trim(); });
  // Merge first block if very short (< 30 chars) with next
  var blocks = [];
  for (var i = 0; i < raw.length; i++) {
    if (i === 0 && raw[i].length < 30 && raw.length > 1) {
      blocks.push(raw[i] + '\n\n' + raw[i + 1]);
      i++; // skip next
    } else {
      blocks.push(raw[i]);
    }
  }
  var h = '';
  blocks.forEach(function (block, idx) {
    var n = idx + 1;
    h += '<div style="background:#1a1f2e;border-radius:8px;padding:.75rem 1rem;margin-bottom:.5rem;display:flex;align-items:flex-start;gap:.75rem">';
    h += '<div style="flex:1"><div style="color:#60a5fa;font-size:.75rem;font-weight:600;margin-bottom:.35rem">Block ' + n + '</div>';
    h += '<div class="tip-content" style="white-space:pre-wrap;line-height:1.7">' + esc(block) + '</div></div>';
    h += '<button class="btn btn-sm" style="flex-shrink:0;margin-top:1.2rem" onclick="playScript(\'' + escAttr(audioPrefix + '-b' + n + '.mp3') + '\', this)">&#9654;</button>';
    h += '</div>';
  });
  return h;
}

function sprintHeader(num, question, subtitle) {
  return '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">' +
    '<span style="background:#1e3a5f;color:#60a5fa;padding:.2rem .6rem;border-radius:4px;font-size:.85rem;margin-right:.5rem">' + num + '</span>' +
    esc(question) + '</h2>' +
    '<p style="color:#9ca3af;font-size:.85rem;margin-bottom:.75rem">' + esc(subtitle) + '</p>';
}

function sprintBQCard(q) {
  if (!q) return '';
  var h = '<div class="bq-card" style="border-left:3px solid #3b82f6">';

  h += '<div class="bq-section"><span class="star-tag star-s">S</span><strong>Situation:</strong><p>' + esc(q.situation) + '</p></div>';
  h += '<div class="bq-section"><span class="star-tag star-t">T</span><strong>Task:</strong><p>' + esc(q.task) + '</p></div>';
  h += '<div class="bq-section"><span class="star-tag star-a">A</span><strong>Action:</strong><p>' + esc(q.action) + '</p></div>';
  h += '<div class="bq-section"><span class="star-tag star-r">R</span><strong>Result:</strong><p>' + esc(q.result) + '</p></div>';

  h += '<div class="bq-phrases">';
  q.key_phrases.forEach(function (p) { h += '<span>' + esc(p) + '</span>'; });
  h += '</div>';

  h += '<div class="bq-actions">';
  h += '<button class="btn btn-sm" onclick="toggleSprintBQ(' + q.id + ', this)">Show Full Answer</button>';
  h += '<button class="btn btn-sm" onclick="playScript(\'behavioral-q' + q.id + '.mp3\', this)">Listen</button>';
  h += '</div>';

  h += '<div class="expandable" id="sprint-bq-' + q.id + '"><div class="bq-full-answer">' + esc(q.full_answer) + '</div></div>';
  h += '</div>';
  return h;
}

function renderSprint() {
  var el = document.getElementById('sprint');
  if (!el) return;

  var intro = PREP_DATA.self_introductions;
  var qa = PREP_DATA.interview_qa;
  var bq = PREP_DATA.behavioral_questions;
  var iqa = PREP_DATA.intro_qa;
  var qta = PREP_DATA.questions_to_ask;

  var html = '';

  /* ========== Header ========== */
  html += '<h1>Sprint Cheat Sheet</h1>';
  html += '<p style="color:#9ca3af;margin-bottom:.25rem">第二關：Ricky Ou 區海鷹 — VP / Head of Digital (DEID)</p>';
  html += '<p style="color:#6b7280;font-size:.82rem;margin-bottom:.25rem">McKinsey 出身，用數字說話，會層層追問，重視 personal impact</p>';
  html += '<p style="color:#6b7280;font-size:.82rem;margin-bottom:1.5rem">7 核心問題 + 3 防禦速答 | Q2 和 Q5 是同一個 PDC 故事的不同角度</p>';

  /* ========== Key Numbers ========== */
  html += '<h2 style="color:#fbbf24;border-bottom:1px solid #2d3148;padding-bottom:.5rem">背熟這些數字</h2>';
  html += '<div class="stat-grid">';
  [
    { num: '250%', label: 'Release 效率提升' },
    { num: '2wk→24hr', label: '客戶回應時間' },
    { num: '6s→1.8s', label: 'VoIP 延遲' },
    { num: '50%', label: 'AI 客服回應降幅' },
    { num: '95%', label: 'Release 可預測性' }
  ].forEach(function (s) {
    html += '<div class="stat-card"><div class="stat-num">' + s.num + '</div><div class="stat-label">' + s.label + '</div></div>';
  });
  html += '</div>';

  /* ========== Q1: Tell me about yourself ========== */
  html += sprintHeader('Q1', 'Tell me about yourself', '60 秒版：數字開場，CINNOX PDC + AirAI');

  html += '<div class="qa-card" style="border-left:3px solid #3b82f6">';
  html += '<h4 style="color:#9ca3af;margin:.5rem 1.2rem">中文口語版</h4>';
  html += '<div class="qa-answer-text">' + esc(intro.sixty_seconds_zh) + '</div>';
  html += '<h4 style="color:#9ca3af;margin:.75rem 1.2rem .25rem">English</h4>';
  html += '<div style="padding:0 1.2rem">' + sprintBlocks(intro.sixty_seconds, 'sprint-q1-60s') + '</div>';
  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;padding:.75rem 1.2rem">';
  html += '<button class="btn btn-sm" onclick="playScript(\'intro-60s.mp3\', this)">Listen 完整版</button>';
  html += '<button class="btn btn-sm" onclick="copyText(PREP_DATA.self_introductions.sixty_seconds, this)">Copy EN</button>';
  html += '<button class="btn btn-sm" onclick="copyText(PREP_DATA.self_introductions.sixty_seconds_zh, this)">Copy 中文</button>';
  html += '</div>';
  html += '</div>';

  /* ========== Q2: Walk me through a transformation ========== */
  html += sprintHeader('Q2', 'Can you walk me through a transformation you led?', 'CINNOX PDC — 衝突→轉折→buy-in→結果');

  html += '<div class="qa-card" style="border-left:3px solid #3b82f6">';

  // Tabs
  html += '<div class="tab-bar" style="padding:.75rem 1.2rem 0">';
  html += '<button class="tab-btn active" onclick="switchQ2Tab(\'full\', this)">完整版 Full</button>';
  html += '<button class="tab-btn" onclick="switchQ2Tab(\'spoken\', this)">口語版 Spoken</button>';
  html += '</div>';

  // === Full version tab ===
  html += '<div id="q2-tab-full">';

  html += '<h4 style="color:#9ca3af;margin:.75rem 1.2rem .25rem">中文答案（完整版）</h4>';
  html += '<div class="qa-answer-text">如果要講一個我主導過、最完整的 transformation，我會講 CINNOX 的 Project Delivery Committee，也就是 PDC。\n\n在 PDC 成立之前，整個 product delivery 的狀態其實很混亂。\n表面上看起來是進度延誤、品質不穩，但更深層的問題是，每個單位都用自己的方式在運作，缺乏統一的 cross-functional delivery mechanism。Engineering、QA、DevOps、Product、Business、Operations 之間各自有自己的優先順序、節奏和 KPI，所以即使每個團隊都很努力，整體交付還是常常卡住。\n\n那時我原本已經在管理大概 30 位 RD，但我後來慢慢發現，真正限制交付效率的瓶頸，已經不在單一 engineering team 內，而是在跨部門協作、決策節奏，以及 ownership 邊界不清楚。\n所以我的任務不只是把專案推快，而是從零建立一個跨部門 delivery mechanism，讓不同部門可以用更一致的方式協作、決策與交付。\n\n我當時做的第一件事，就是成立 PDC。\n但我不是把它當成多一層管理，而是把它設計成一個推動 change 的機制。\n我把原本比較 siloed 的 functional management，轉成更 project-oriented 的 operating model，讓大家不是只看自己部門，而是看 end-to-end delivery。\n\n具體來說，我做了幾件事。\n第一，我重新設計了 cross-functional governance，包括 project pipeline alignment、decision cadence，以及透過 RACI 釐清 ownership 和責任邊界。\n第二，我主持 cross-functional workshops，不只是宣導新流程，而是讓不同部門把各自的顧慮、限制和成功定義攤開來談，建立真正的 alignment。\n第三，我把新的 working model 變成可執行的標準流程，並搭配 manager training，讓新主管知道怎麼在這個 operating model 下帶團隊和做決策。\n\n前期其實最大的阻力，不是流程本身，而是各單位主管原本都在自己熟悉的節奏裡運作。\n對他們來說，原有方式雖然不完美，但至少是熟悉而可控的；而我推動的新機制，代表新的節奏、新的責任分工，也代表新的風險。\n所以前期最困難的地方，不是事情本身對不對，而是大家彼此都還看不到對方的思考邏輯，在這種情況下，溝通非常容易卡住。\n\n我後來真正學到的是，buy-in 不只是靠理性說服，也要先讓對方感受到他被聽見、被尊重、被支持。\n所以我花了很多時間做一對一溝通，先理解各部門主管真正的顧慮、限制和壓力，再把原本屬於「我要推的改變」，翻成他們也願意一起承擔的共同目標。\n再加上 early wins，讓大家實際看到 delivery 變得更穩定、更可預測，buy-in 才慢慢建立起來。\n\n最後，這個 transformation 帶來幾個很具體的成果。\n第一，major release cadence 提升到原本的 2.5 倍，delivery 不只是變快，也變得更穩定、更可預測。\n第二，客戶問題的初步有效回應時間，從原本兩週以上縮短到 24 小時內。\n第三，這套 framework 支撐了台北與香港的 cross-site delivery organization，涵蓋台北 90 多人、香港約 60 人，在整體規模擴大到 150 人以上的情況下，仍然能維持比較一致的 delivery rhythm。\n最重要的是，PDC 最後不只是一次性專案，而是變成公司的標準 operating model。</div>';

  html += '<h4 style="color:#9ca3af;margin:.75rem 1.2rem .25rem">English Answer (full version)</h4>';
  var q2FullText = "If I had to choose one of the most complete transformations I led, I would use the Project Delivery Committee, or PDC, at CINNOX.\n\nBefore PDC was established, product delivery was quite chaotic.\nOn the surface, the problems looked like missed deadlines and inconsistent quality, but the deeper issue was that each function operated in its own way, without a unified cross-functional delivery mechanism. Engineering, QA, DevOps, Product, Business, and Operations all had different priorities, rhythms, and KPIs. So even when each team was working hard, the overall delivery system still kept getting stuck.\n\nAt that time, I was already managing around 30 RDs, but I gradually realized that the real bottleneck was no longer inside one engineering team. It was in cross-functional collaboration, decision rhythm, and unclear ownership boundaries.\nSo my task was not just to push projects faster. It was to build a cross-departmental delivery mechanism from scratch, so different functions could collaborate, make decisions, and deliver in a more consistent way.\n\nThe first thing I did was establish PDC.\nBut I did not treat it as just another management layer. I designed it as a change mechanism.\nI shifted the organization from a more siloed functional management model to a more project-oriented operating model, so people stopped looking only at their own function and started working toward end-to-end delivery.\n\nConcretely, I did a few things.\nFirst, I redesigned the cross-functional governance model, including project pipeline alignment, decision cadence, and clearer ownership boundaries through RACI.\nSecond, I led cross-functional workshops, not just to announce a new process, but to surface the concerns, constraints, and definitions of success from different functions and build real alignment.\nThird, I turned the new working model into executable standard processes and supported it with manager training, so new leaders could actually operate within the new model.\n\nThe biggest resistance early on was not the process itself, but the department heads.\nThe original release rhythm was actually comfortable for many of them. It was not ideal, but it was familiar and predictable from their point of view. What I was proposing meant a new rhythm, new ownership, and new risk.\nSo the hardest part in the beginning was not whether the change was logically right, but that people did not fully understand my reasoning yet, and I did not fully understand theirs. In that situation, communication gets stuck very easily.\n\nWhat I learned later was that buy-in is not only about rational alignment. It is also about making people feel heard, respected, and supported.\nSo I spent a lot of time in one-on-one conversations, understanding each leader's concerns, constraints, and pressures, and then translating the change into a shared goal they were willing to own, rather than something being imposed on them.\nTogether with early wins that showed delivery becoming more stable and predictable, that is how buy-in gradually formed.\n\nIn the end, the transformation delivered several concrete outcomes.\nFirst, major release cadence improved to about 2.5 times the previous level, which made delivery not only faster, but also more stable and predictable.\nSecond, customer response time improved from more than two weeks to within 24 hours.\nThird, the framework supported a much larger cross-site delivery organization across Taipei and Hong Kong, covering more than 90 people in Taipei and around 60 in Hong Kong, while maintaining a much more consistent delivery rhythm.\nMost importantly, PDC did not remain a one-time initiative. It became the company's standard operating model.";
  html += '<div style="padding:0 1.2rem">' + sprintBlocks(q2FullText, 'sprint-q2-full') + '</div>';

  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;padding:.75rem 1.2rem">';
  html += '<button class="btn btn-sm" onclick="playScript(\'sprint-q2-full.mp3\', this)">Listen 完整版</button>';
  html += '</div>';

  html += '</div>'; // q2-tab-full

  // === Spoken version tab ===
  html += '<div id="q2-tab-spoken" style="display:none">';

  html += '<h4 style="color:#9ca3af;margin:.75rem 1.2rem .25rem">中文口語版（比較好背）</h4>';
  html += '<div class="qa-answer-text">如果要講一個我主導過的 transformation，我會講 CINNOX 的 PDC。\n那時真正的問題不是單一團隊不夠努力，而是各部門各自運作，沒有統一的 cross-functional delivery mechanism，所以跨部門合作常常卡住，進度跟品質也不穩。\n\n所以我後來做的，不只是推專案，而是從零建立 PDC，重新設計整個跨部門的 operating model。\n我把原本比較 siloed 的 functional management，轉成更 project-oriented 的方式，並透過 pipeline alignment、RACI、decision cadence 跟 governance redesign，把責任邊界和協作節奏拉清楚。\n我也透過 cross-functional workshop 跟 manager training，讓這套新做法真的被採納，而不是只有流程圖好看。\n\n這裡面最難的其實是 buy-in。\n原本的節奏對很多主管來說雖然不理想，但至少熟悉，也比較可控。\n我後來學到，要推動 change，不能只講邏輯，也要先讓對方感受到他被聽見、被尊重、被支持。\n所以我花了很多時間做一對一溝通，再加上 early wins，讓大家慢慢看到新機制的價值。\n\n最後 major release cadence 提升到原本的 2.5 倍，客戶問題回應時間從兩週以上縮短到 24 小時內，而且這套 framework 也支撐了台北 90 多人、香港約 60 人的 cross-site delivery organization，最後成為公司的標準 operating model。</div>';

  html += '<h4 style="color:#9ca3af;margin:.75rem 1.2rem .25rem">English spoken version</h4>';
  var q2SpokenText = "If I had to choose one transformation example, I would use the PDC story at CINNOX.\nThe real problem at that time was not that one team was not working hard enough. It was that each function operated in its own way, without a unified cross-functional delivery mechanism, so execution kept getting stuck and delivery was inconsistent.\n\nWhat I did was not just push projects harder. I built PDC from scratch and redesigned the cross-functional operating model.\nI shifted the organization from a more siloed functional structure to a more project-oriented way of working, and supported that change through pipeline alignment, RACI, decision cadence, and governance redesign.\nI also used cross-functional workshops and manager training to make sure the new model was actually adopted, instead of only looking good on paper.\n\nThe hardest part was really buy-in.\nThe original rhythm was not ideal, but for many department heads it was familiar and predictable.\nWhat I learned was that change is not driven by logic alone. People also need to feel heard, respected, and supported.\nSo I spent a lot of time in one-on-one conversations, together with early wins, to gradually build alignment.\n\nIn the end, major release cadence improved to about 2.5 times the previous level, customer response time improved from more than two weeks to within 24 hours, and the framework supported a much larger cross-site organization across Taipei and Hong Kong, with more than 90 people in Taipei and around 60 in Hong Kong. Most importantly, it became the company's standard operating model.";
  html += '<div style="padding:0 1.2rem">' + sprintBlocks(q2SpokenText, 'sprint-q2-spoken') + '</div>';

  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;padding:.75rem 1.2rem">';
  html += '<button class="btn btn-sm" onclick="playScript(\'sprint-q2-spoken.mp3\', this)">Listen 完整版</button>';
  html += '</div>';

  html += '</div>'; // q2-tab-spoken

  // Follow-up questions
  html += '<div class="qa-question" onclick="toggleSprint(\'q2-hardest\')">';
  html += '<span class="qa-arrow">&#9654;</span> 追問：What was the hardest part of that transformation?';
  html += '</div>';
  html += '<div class="expandable" id="sprint-q2-hardest">';
  html += '<div class="qa-answer-text" style="border-top:1px solid #2d3148">The hardest part was not the process design itself. It was buy-in.\nEach leader had different priorities, risk concerns, and definitions of success, so the real challenge was turning "the change I wanted to push" into a shared goal that different functions were willing to commit to.</div>';
  html += '<div style="padding:0 1.2rem .75rem"><button class="btn btn-sm" onclick="playScript(\'sprint-q2-followup-hardest.mp3\', this)">&#9654; Listen</button></div>';
  html += '</div>';

  html += '<div class="qa-question" onclick="toggleSprint(\'q2-buyin\')">';
  html += '<span class="qa-arrow">&#9654;</span> 追問：How did you get buy-in from different department heads?';
  html += '</div>';
  html += '<div class="expandable" id="sprint-q2-buyin">';
  html += '<div class="qa-answer-text" style="border-top:1px solid #2d3148">I learned that buy-in is not only about rational alignment. It is also about making people feel heard, respected, and supported.\nSo I spent a lot of time in one-on-one conversations, understanding each leader\'s concerns, constraints, and pressures, and then translating the change into a shared goal they were willing to own.\nTogether with early wins that showed delivery becoming more stable and predictable, that is how buy-in gradually formed.</div>';
  html += '<div style="padding:0 1.2rem .75rem"><button class="btn btn-sm" onclick="playScript(\'sprint-q2-followup-buyin.mp3\', this)">&#9654; Listen</button></div>';
  html += '</div>';

  html += '<div class="bq-phrases">';
  ['cross-functional delivery mechanism', 'project-oriented operating model', 'buy-in through 1-on-1', '2.5x release cadence', '2wk→24hr', '150+ people cross-site'].forEach(function (p) { html += '<span>' + esc(p) + '</span>'; });
  html += '</div>';

  html += '</div>'; // qa-card

  /* ========== Q3: AI deployment example ========== */
  html += sprintHeader('Q3', 'Can you give me an example of an AI deployment you actually led?', 'AirAI × Relocation Provider — workflow redesign + AI + automation');

  html += '<div class="qa-card" style="border-left:3px solid #3b82f6">';
  html += '<h4 style="color:#9ca3af;margin:.5rem 1.2rem">中文答案</h4>';
  html += '<div class="qa-answer-text">在 AirAI，我們曾經協助一家跨國 relocation service provider 改善他們的財務與營運流程。\n這家公司需要處理來自不同國家與供應商的預估、發票、報帳與結算資訊，原本這些資料散落在不同系統和溝通渠道裡，導致大量人工輸入、核對和搬運資料，不但耗時，也容易出錯。\n\n所以我們做的，不是只導入一個單點 AI 功能，而是先從 workflow 角度重新整理整個資訊流。\n我們先把零散的流程整合到 Teams 作為主要協作入口，再判斷哪些環節適合用 AI，哪些環節更適合用 automation。\n其中一個很直接的例子是發票處理：使用者只需要把 invoice 影像或照片上傳，AI 會先做欄位擷取、初步判讀，並把資料寫入系統。使用者只需要快速檢查、確認、approve，就能省去大量原本人工打字和搬運資料的工作。\n\n另外，像開單、結單、通知等比較固定規則、重複性高的流程，我們就用 automation 去串接，而不是所有東西都硬套 AI。\n所以這個案子的重點不是「我們做了一個 AI feature」，而是把 AI 跟 automation 放在最適合的位置，重新設計成一條 end-to-end 的 business workflow。\n\n最後整體 end-to-end 的處理效率提升了 80% 以上，也顯著降低了人工操作和出錯的風險。\n對我來說，這個案例最重要的價值是，它證明了 AI deployment 要成功，關鍵通常不只是技術接得起來，而是你能不能先看懂流程，再決定哪一段該用 AI、哪一段該用 automation，最後讓它真的被業務接受並持續使用。</div>';

  html += '<h4 style="color:#9ca3af;margin:.75rem 1.2rem .25rem">English Answer</h4>';
  var q3Text = "At AirAI, we worked with a global relocation service provider to improve part of their finance and operations workflow.\nThey had to handle estimates, invoices, expense processing, and settlement information coming from different countries and vendors. Originally, that information was scattered across multiple systems and communication channels, which created a lot of manual data entry, checking, and coordination. It was time-consuming and also error-prone.\n\nSo what we did was not just introduce one isolated AI feature. We first looked at the workflow end to end and redesigned the information flow.\nWe consolidated fragmented steps into Teams as a primary collaboration layer, and then identified which parts were suitable for AI and which parts were better solved with automation.\nOne clear example was invoice processing. Users could upload an invoice image or photo, and the AI would extract the fields, perform an initial interpretation, and write the information into the system. The user only needed to do a quick review and approve it, which removed a large amount of manual typing and repetitive data handling.\n\nFor other steps such as order creation, settlement, and notifications — where the rules were more fixed and repetitive — we used workflow automation rather than forcing AI into everything.\nSo the real value of the project was not that we built one AI feature, but that we placed AI and automation in the right parts of the process and redesigned the whole flow into an executable end-to-end business workflow.\n\nAs a result, end-to-end processing efficiency improved by more than 80 percent, while manual effort and error risk were significantly reduced.\nFor me, the most important lesson from this project is that successful AI deployment is usually not just about connecting a model. It depends on understanding the workflow first, deciding where AI adds value, where automation is enough, and then making sure the solution is actually adopted in day-to-day operations.";
  html += '<div style="padding:0 1.2rem">' + sprintBlocks(q3Text, 'sprint-q3') + '</div>';

  // Follow-up: relevance to this role
  html += '<div class="qa-question" onclick="toggleSprint(\'q3-relevance\')">';
  html += '<span class="qa-arrow">&#9654;</span> 追問：How is this relevant to the AI Change Manager role?';
  html += '</div>';
  html += '<div class="expandable" id="sprint-q3-relevance">';
  html += '<div class="qa-answer-text" style="border-top:1px solid #2d3148">Because this project was not just a technical implementation. It was really a combination of workflow redesign, role redefinition, and AI adoption.\nThe real challenge was not whether the model could run, but whether the business process could actually change, whether users would accept it, and whether the outcome could be measured.\nThat is why I think it is highly relevant to an AI Change Manager role.</div>';
  html += '<div style="padding:0 1.2rem .75rem"><button class="btn btn-sm" onclick="playScript(\'sprint-q3-followup-relevance.mp3\', this)">&#9654; Listen</button></div>';
  html += '</div>';

  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;padding:.75rem 1.2rem">';
  html += '<button class="btn btn-sm" onclick="playScript(\'sprint-q3-full.mp3\', this)">Listen 完整版</button>';
  html += '</div>';

  html += '<div class="bq-phrases">';
  ['workflow redesign', 'AI + automation placement', '80% efficiency gain', 'end-to-end business workflow', 'adoption in daily operations'].forEach(function (p) { html += '<span>' + esc(p) + '</span>'; });
  html += '</div>';
  html += '</div>';

  /* ========== Q4: AI adoption at TSMC ========== */
  html += sprintHeader('Q4', 'How would you drive AI adoption?', 'Right use case → early wins → training & reinforcement');

  var qaAdopt = findById(qa, 'ai-adoption');
  var iqaStrategy = findById(iqa, 'ai-adoption-strategy');

  html += '<div class="qa-card" style="border-left:3px solid #3b82f6">';

  // One-liner highlight
  if (iqaStrategy) {
    html += '<div style="background:#1e293b;padding:1rem 1.2rem;border-bottom:1px solid #2d3148;font-size:.92rem;color:#fbbf24;line-height:1.7">';
    html += '<strong>One-liner:</strong> I wouldn\'t ask engineers to change — I\'d start by eliminating their most annoying busywork, prove the value with data, let early adopters influence their peers, and then deepen into core processes on a foundation of trust.';
    html += '</div>';
  }

  // 4 strategies summary
  html += '<div style="padding:.75rem 1.2rem">';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.75rem">';
  [
    { n: '1', t: "Don't say \"change\" — say \"upgrade\"", c: '從工程師痛點切入' },
    { n: '2', t: 'Dual-track: rigorous + agile', c: '分三層，先從自動化雜事開始' },
    { n: '3', t: 'Find internal champions', c: '用同儕影響力擴散' },
    { n: '4', t: 'Feedback loop with data', c: '用數據讓工程師自己說服自己' }
  ].forEach(function (s) {
    html += '<div style="background:#111318;border-radius:6px;padding:.6rem .8rem">';
    html += '<div style="color:#60a5fa;font-weight:600;font-size:.85rem">Strategy ' + s.n + '</div>';
    html += '<div style="color:#e0e0e0;font-size:.85rem">' + s.t + '</div>';
    html += '<div style="color:#6b7280;font-size:.78rem">' + s.c + '</div>';
    html += '</div>';
  });
  html += '</div>';
  html += '</div>';

  // Full AirAI example answer
  html += '<div class="qa-question" onclick="toggleSprint(\'q4-full\')">';
  html += '<span class="qa-arrow">&#9654;</span> AirAI 具體案例回答';
  html += '</div>';
  html += '<div class="expandable" id="sprint-q4-full">';
  html += '<div class="qa-answer-text">' + esc(qaAdopt.answer) + '</div>';
  html += '</div>';

  html += '</div>';

  /* ========== Q5: Biggest failure ========== */
  html += sprintHeader('Q5', 'What is your biggest failure?', 'PDC 初期推不動 → 對的方案用錯方式 = 錯的方案');

  html += '<div class="qa-card" style="border-left:3px solid #ef4444">';
  html += '<div style="padding:.75rem 1.2rem;color:#fbbf24;font-size:.85rem">與 Q2 同一個 PDC 故事，聚焦初期失敗與學習</div>';

  // Key learning
  html += '<h4 style="color:#9ca3af;margin:.25rem 1.2rem">核心教訓</h4>';
  html += '<div class="qa-answer-text">';
  html += '變革管理最難的不是看出問題，而是怎麼把原本屬於「我要推的改變」，變成各部門願意一起承擔的共同目標。\n';
  html += '如果不能做到這一點，再好的設計也推不動。\n\n';
  html += '對的方案 + 錯的推法 = 錯的方案';
  html += '</div>';

  html += '<h4 style="color:#9ca3af;margin:.75rem 1.2rem .25rem">English Key Learning</h4>';
  html += '<div class="qa-answer-text">';
  html += 'Change management is rarely just about seeing the right answer. The harder part is turning "the change I want to push" into a shared goal that different functions are willing to commit to.\n\n';
  html += 'If I could not turn my proposed change into a shared goal people were willing to commit to, even a good design would not move.\n\n';
  html += 'Right solution + wrong approach = wrong solution.';
  html += '</div>';

  // Answer strategy
  html += '<h4 style="color:#9ca3af;margin:.75rem 1.2rem .25rem">回答架構</h4>';
  html += '<div style="padding:.5rem 1.2rem .75rem;color:#d1d5db;font-size:.88rem;line-height:1.8">';
  html += '1. PDC 初期：看出問題、設計方案，但用「我要推的改變」去溝通<br>';
  html += '2. 碰壁：各部門優先順序、風險考量、成功定義都不同<br>';
  html += '3. 調整：改成 pilot first + 用結果說話 + 讓各部門共同定義成功<br>';
  html += '4. 結論：對的方案用錯方式 = 錯的方案<br>';
  html += '5. 帶出 Q2 的成功結果 — 250% 提升';
  html += '</div>';
  html += '</div>';

  /* ========== Q6: Why TSMC ========== */
  html += sprintHeader('Q6', 'Why TSMC?', 'Impact at scale + timing + personal mission');

  var qWhyTsmc = findById(qa, 'why-tsmc');
  var qWhyRole = findById(qa, 'why-role');

  html += '<div class="qa-card" style="border-left:3px solid #3b82f6">';

  // TSMC Hook highlight
  html += '<div style="background:#1e293b;padding:1rem 1.2rem;border-bottom:1px solid #2d3148;font-size:.92rem;color:#fbbf24;line-height:1.7">';
  html += '<strong>Hook:</strong> ' + esc(intro.company_hooks.tsmc);
  html += '</div>';

  // Why TSMC
  html += '<div class="qa-question" onclick="toggleSprint(\'q6-tsmc\')">';
  html += '<span class="qa-arrow">&#9654;</span> Why TSMC — Full Answer';
  html += '</div>';
  html += '<div class="expandable" id="sprint-q6-tsmc">';
  html += '<div class="qa-answer-text">' + esc(qWhyTsmc.answer) + '</div>';
  html += '</div>';

  // Why this role
  html += '<div class="qa-question" onclick="toggleSprint(\'q6-role\')">';
  html += '<span class="qa-arrow">&#9654;</span> Why This Role — Full Answer';
  html += '</div>';
  html += '<div class="expandable" id="sprint-q6-role">';
  html += '<div class="qa-answer-text">' + esc(qWhyRole.answer) + '</div>';
  html += '</div>';

  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;padding:.75rem 1.2rem">';
  html += '<button class="btn btn-sm" onclick="copyText(findById(PREP_DATA.interview_qa, \'why-tsmc\').answer, this)">Copy Why TSMC</button>';
  html += '<button class="btn btn-sm" onclick="copyText(findById(PREP_DATA.interview_qa, \'why-role\').answer, this)">Copy Why Role</button>';
  html += '</div>';
  html += '</div>';

  /* ========== Q7: Questions for Ricky ========== */
  html += sprintHeader('Q7', 'Questions to Ask Ricky', '準備 3 題問 2 題 — 針對 Ricky 背景的高品質反問');

  var rickyQuestions = [
    {
      q: "DEID has been established for almost a year now. What has been the most unexpected challenge so far?",
      why: "讓他說故事，展示你對 DEID 做了功課（知道它是新部門）。他的回答也會透露真實的工作挑戰。"
    },
    {
      q: "Coming from fintech to semiconductor, what would you say is the biggest difference in driving AI transformation?",
      why: "直接連結他的經歷（平安科技 → TSMC），展示你研究過他的背景。個人化問題讓面試從「考試」變成「對話」。"
    },
    {
      q: "For this role, what outcome would you most like to see in the first 90 days?",
      why: "展示 execution mindset 和 bias for action，同時了解他的真實期望。"
    },
    {
      q: "How is the collaboration model between DEID and the other five divisions designed? Are there examples that are working well?",
      why: "備用 — 了解組織政治和協作實況。如果前面已經聊過就跳過。"
    }
  ];

  html += '<div class="qa-list">';
  rickyQuestions.forEach(function (item, i) {
    html += '<div class="qa-item" style="flex-direction:column;align-items:flex-start;gap:.4rem">';
    html += '<div style="display:flex;align-items:center;gap:.5rem;width:100%">';
    html += '<span style="color:#60a5fa;font-weight:600">' + (i + 1) + '.</span>';
    html += '<span style="flex:1">' + esc(item.q) + '</span>';
    html += '<button class="btn btn-sm" style="flex-shrink:0" onclick="readAloud(\'' + escAttr(item.q) + '\', this)">Practice</button>';
    html += '</div>';
    html += '<div style="color:#6b7280;font-size:.8rem;padding-left:1.5rem">' + esc(item.why) + '</div>';
    html += '</div>';
  });
  html += '</div>';


  /* ========== Defensive Quick Answer ========== */
  html += '<h2 style="color:#ef4444;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">防禦速答</h2>';

  html += '<div class="tip-card" style="border-left-color:#ef4444">';
  html += '<div class="tip-title">「來到這樣的大公司，你是怎麼想的？」</div>';
  html += '<h4 style="color:#9ca3af;margin:.5rem 0 .25rem">中文</h4>';
  html += '<div class="tip-content" style="white-space:pre-wrap">我覺得這個機會吸引我的地方，是它把我過去最擅長的事情，放到一個更成熟、更複雜的平台上。\n過去我累積了很多從零建立機制、推動 change、做流程重整和 adoption 的實戰經驗。\n而現在我很希望把這些經驗放到一個 stakeholder 更多、治理更完整、影響力也更大的環境裡，看看怎麼把 change 做得更系統化、更可擴散。\n我會把這看成是很自然的下一步。</div>';
  html += '<h4 style="color:#9ca3af;margin:.75rem 0 .25rem">English</h4>';
  var defenseText = "What attracts me about this opportunity is that it places the kind of work I do best into a more mature and complex platform.\n\nI've built a lot of hands-on experience in creating mechanisms from scratch, driving change, redesigning processes, and making adoption happen.\n\nNow I want to bring that experience into an environment with more stakeholders, stronger governance, and greater organizational impact, and learn how to make change happen in an even more systematic and scalable way.\n\nTo me, that feels like a very natural next step.";
  html += '<div style="padding:0">' + sprintBlocks(defenseText, 'sprint-defense-bigco') + '</div>';

  html += '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem">';
  html += '<button class="btn btn-sm" onclick="playScript(\'sprint-defense-bigco.mp3\', this)">Listen 完整版</button>';
  html += '</div>';
  html += '</div>';

  /* ========== Sprint Tips ========== */
  html += '<h2 style="color:#10b981;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">衝刺建議</h2>';

  html += '<div class="tip-card" style="border-left-color:#10b981">';
  html += '<div class="tip-content" style="white-space:pre-wrap">';
  html += '1. Q1 練到 60 秒內自然講完 — 這是第一印象\n';
  html += '2. Q2 和 Q5 是同一個故事的不同角度，練熟一個兩個都能用\n';
  html += '3. 關鍵數字背熟 — 250%, 2wk→24hr, 6s→1.8s, 50%, 95%\n';
  html += '4. 對著鏡子或錄音講，確保不是在「念稿」而是在「對話」';
  html += '</div>';
  html += '</div>';

  /* ========== Opening & Closing ========== */
  html += '<h2 style="color:#60a5fa;border-bottom:1px solid #2d3148;padding-bottom:.5rem;margin-top:2.5rem">開場 & 收尾</h2>';
  html += '<p style="color:#9ca3af;font-size:.85rem;margin-bottom:1rem">第二關 — 面試官：Ricky Ou 區海鷹（VP / Head of Digital, DEID）<br>McKinsey EM → Microsoft Azure → 平安科技 CPO → AmEx China GM → TSMC</p>';

  html += '<div class="tip-card" style="border-left-color:#fbbf24">';
  html += '<div class="tip-title">Opening — 直接進入</div>';
  html += '<div class="tip-content" style="white-space:pre-wrap">Hi Ricky, thank you for your time today. Over the past several years, my work has mainly focused on change management and AI solution deployment. What I do best is turn complex technology and process problems into practical ways of working that people can actually adopt, with measurable results.</div>';
  html += '</div>';

  html += '<div class="tip-card" style="border-left-color:#fbbf24">';
  html += '<div class="tip-title">Ricky 的評判標準（McKinsey 四大）</div>';
  html += '<div class="tip-content" style="white-space:pre-wrap">1. Problem Solving — 能把複雜問題拆成可執行框架嗎？\n2. Leadership — 能帶多元團隊朝共同目標前進嗎？\n3. Personal Impact — 你個人的貢獻是什麼？用「I」不是「we」\n4. Entrepreneurial Drive — 主動創造價值的驅動力</div>';
  html += '</div>';

  html += '<div class="tip-card" style="border-left-color:#fbbf24">';
  html += '<div class="tip-title">Answer Structure — McKinsey 風格</div>';
  html += '<div class="tip-content" style="white-space:pre-wrap">框架先行：「I see this from three dimensions...」\n→ 逐一展開，每個帶數字\n→ 收束連結角色</div>';
  html += '</div>';

  html += '<div class="tip-card" style="border-left-color:#ef4444">';
  html += '<div class="tip-title">Red Flags — 不要踩的雷</div>';
  html += '<div class="tip-content" style="white-space:pre-wrap">1. 模糊數字 — 不要說「大幅提升」，要說「250%」\n2. 只講策略不講執行 — 他每一站都是「落地」的人\n3. 把一切都講得完美 — 他知道真正的變革一定有失敗\n4. AI 術語吹牛 — 他工程出身 + 平安 AI，會看穿\n5. 對 TSMC/DEID 沒做功課 — 他會認為你不夠認真\n6. 被動等指令 — 「老闆叫我做X」= 出局</div>';
  html += '</div>';

  html += '<div class="tip-card">';
  html += '<div class="tip-title">Delivery</div>';
  html += '<div class="tip-content">Short sentences. Calm pace. No rushing. Confident eye contact. He may switch to English mid-conversation.</div>';
  html += '</div>';

  html += '<div class="tip-card">';
  html += '<div class="tip-title">Personal Touch（自然帶到就好，不用刻意）</div>';
  html += '<div class="tip-content">I can see why this role is important, because this kind of transformation is not just about technology. It\'s really about how to make it work in real operations. That\'s also the part I\'m most interested in.</div>';
  html += '</div>';

  el.innerHTML = html;
}
