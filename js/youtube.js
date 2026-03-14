/* ===== YouTube Resources Page ===== */
function renderYoutube() {
  var el = document.getElementById('youtube');
  var categories = RESOURCES_DATA.youtube_resources;

  var html = '<h1>YouTube Learning Resources</h1>';
  html += '<p style="color:#9ca3af;margin-bottom:1rem">Curated video resources for TSMC interview preparation</p>';

  categories.forEach(function (cat) {
    html += '<h2>' + esc(cat.category) + '</h2>';
    html += '<p style="color:#9ca3af;font-size:.85rem;margin-bottom:.5rem">' + esc(cat.description) + '</p>';

    cat.videos.forEach(function (v) {
      html += '<div class="yt-card">';
      html += '<div class="yt-title"><a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.title) + ' &rarr;</a></div>';
      html += '<div class="yt-channel">' + esc(v.channel);
      if (v.suggested_lesson) html += ' &middot; Suggested for Day ' + v.suggested_lesson;
      html += '</div>';
      html += '<div class="yt-reason">' + esc(v.reason) + '</div>';
      html += '</div>';
    });
  });

  el.innerHTML = html;
}
