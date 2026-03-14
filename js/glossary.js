/* ===== Glossary Page ===== */
var glossaryFilter = 'all';
var glossarySearch = '';

// CATEGORY_LABELS is defined in utils.js

function renderGlossary() {
  var el = document.getElementById('glossary');
  var vocab = RESOURCES_DATA.technical_vocabulary;

  // Count per category
  var counts = {};
  vocab.forEach(function (v) {
    counts[v.category] = (counts[v.category] || 0) + 1;
  });

  var html = '<h1>Technical Vocabulary Glossary</h1>';
  html += '<p style="color:#9ca3af;margin-bottom:1rem">' + vocab.length + ' terms across ' + Object.keys(counts).length + ' categories</p>';

  // Search
  html += '<input class="search-input" id="glossarySearchInput" type="text" placeholder="Search words, meanings, or examples..." oninput="glossarySearch=this.value;filterGlossary()">';

  // Category filters
  html += '<div class="tag-bar" style="margin-top:.5rem">';
  html += '<button class="tag active" onclick="setGlossaryFilter(\'all\', this)">All (' + vocab.length + ')</button>';
  Object.keys(CATEGORY_LABELS).forEach(function (cat) {
    var label = CATEGORY_LABELS[cat];
    html += '<button class="tag" onclick="setGlossaryFilter(\'' + cat + '\', this)">' + label + ' (' + (counts[cat] || 0) + ')</button>';
  });
  html += '</div>';

  // Table
  html += '<div style="overflow-x:auto"><table class="vocab-table" id="glossaryTable"><thead><tr><th></th><th>Word</th><th>Meaning</th><th>Example</th><th></th></tr></thead><tbody>';
  vocab.forEach(function (v) {
    html += vocabRow(v, v.category, 'r');
  });
  html += '</tbody></table></div>';

  el.innerHTML = html;
}

function setGlossaryFilter(cat, btnEl) {
  glossaryFilter = cat;
  document.querySelectorAll('#glossary .tag').forEach(function (t) { t.classList.remove('active'); });
  if (btnEl) btnEl.classList.add('active');
  filterGlossary();
}

function filterGlossary() {
  var rows = document.querySelectorAll('#glossaryTable tbody tr');
  var q = glossarySearch.toLowerCase();
  rows.forEach(function (row) {
    var cat = row.getAttribute('data-cat');
    var text = row.textContent.toLowerCase();
    var matchCat = glossaryFilter === 'all' || cat === glossaryFilter;
    var matchSearch = !q || text.indexOf(q) !== -1;
    row.style.display = matchCat && matchSearch ? '' : 'none';
  });
}
