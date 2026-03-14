/* ===== Flashcard Page ===== */
var fcDeck = [];
var fcIndex = 0;
var fcFilter = 'all';

function initFlashcards() {
  filterDeck('all');
}

function filterDeck(filter) {
  fcFilter = filter;
  var all = [];
  if (filter === 'all' || filter.indexOf('lesson-') === 0) {
    COURSE_DATA.lessons.forEach(function (l) {
      if (filter !== 'all' && 'lesson-' + l.id !== filter) return;
      l.vocabulary.forEach(function (v) {
        all.push({ word: v.word, phonetic: v.phonetic || '', meaning: v.meaning_zh, example: v.example, source: 'lesson-' + l.id });
      });
    });
  }
  if (filter === 'all' || ['semiconductor', 'ai_tech', 'change_mgmt'].indexOf(filter) !== -1) {
    RESOURCES_DATA.technical_vocabulary.forEach(function (v) {
      if (filter !== 'all' && v.category !== filter) return;
      all.push({ word: v.word, phonetic: v.phonetic || '', meaning: v.meaning_zh, example: v.example, source: v.category });
    });
  }
  fcDeck = all;
  fcIndex = 0;
  renderFlashcardPage();
}

function shuffleDeck() {
  for (var i = fcDeck.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = fcDeck[i]; fcDeck[i] = fcDeck[j]; fcDeck[j] = t;
  }
  fcIndex = 0;
  renderFlashcardPage();
}

function fcPrev() {
  if (fcIndex > 0) fcIndex--;
  renderFlashcardPage();
}

function fcNext() {
  if (fcIndex < fcDeck.length - 1) fcIndex++;
  renderFlashcardPage();
}

function renderFlashcardPage() {
  var el = document.getElementById('flashcards');
  var card = fcDeck[fcIndex];

  var html = '<h1>Flashcard Practice</h1>';

  // Category filters
  html += '<div class="tag-bar">';
  html += fcTag('all', 'All');
  COURSE_DATA.lessons.forEach(function (l) {
    html += fcTag('lesson-' + l.id, 'Day ' + l.day);
  });
  Object.keys(CATEGORY_LABELS).forEach(function (k) {
    html += fcTag(k, CATEGORY_LABELS[k]);
  });
  html += '</div>';

  if (!card) {
    html += '<p style="color:#9ca3af;margin-top:2rem">No cards in this category.</p>';
    el.innerHTML = html;
    return;
  }

  // Card
  html += '<div class="flashcard-container">';
  html += '<div class="flashcard" id="fcCard" onclick="flipCard(event)">';
  html += '<div class="flashcard-inner">';
  html += '<div class="flashcard-front">';
  html += '<div class="flashcard-word">' + esc(card.word) + '</div>';
  html += '<div class="flashcard-phonetic">' + esc(card.phonetic) + '</div>';
  html += '<div class="flashcard-actions">';
  html += '<button class="icon-btn" onclick="event.stopPropagation(); speak(\'' + escAttr(card.word) + '\', 0.9, true)" title="Speak" style="font-size:1.3rem">&#x1F50A;</button>';
  html += '<a href="' + dictUrl(card.word) + '" target="_blank" rel="noopener" class="icon-btn" onclick="event.stopPropagation()" title="Dictionary" style="font-size:1.3rem">&#x1F4D6;</a>';
  html += '</div>';
  html += '<div style="font-size:.75rem;color:#6b7280;margin-top:.5rem">Click to reveal</div>';
  html += '</div>';
  html += '<div class="flashcard-back">';
  html += '<div class="flashcard-meaning">' + esc(card.meaning) + '</div>';
  html += '<div class="flashcard-example">' + esc(card.example) + '</div>';
  html += '</div>';
  html += '</div></div>';

  // Nav
  html += '<div class="flashcard-nav">';
  html += '<button class="btn btn-sm" onclick="fcPrev()" ' + (fcIndex === 0 ? 'disabled' : '') + '>&larr; Prev</button>';
  html += '<span class="flashcard-counter">' + (fcIndex + 1) + ' / ' + fcDeck.length + '</span>';
  html += '<button class="btn btn-sm" onclick="fcNext()" ' + (fcIndex >= fcDeck.length - 1 ? 'disabled' : '') + '>Next &rarr;</button>';
  html += '<button class="btn btn-sm" onclick="shuffleDeck()">Shuffle</button>';
  html += '</div>';
  html += '</div>';

  el.innerHTML = html;

  // Highlight active filter
  document.querySelectorAll('#flashcards .tag').forEach(function (t) {
    if (t.getAttribute('data-filter') === fcFilter) t.classList.add('active');
  });
}

function fcTag(value, label) {
  return '<button class="tag" data-filter="' + value + '" onclick="filterDeck(\'' + value + '\')">' + label + '</button>';
}

function flipCard(e) {
  var card = document.getElementById('fcCard');
  if (card) card.classList.toggle('flipped');
}
