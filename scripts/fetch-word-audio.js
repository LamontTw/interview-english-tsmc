/**
 * fetch-word-audio.js
 * Downloads word pronunciation MP3s from Cambridge Dictionary.
 * Requires Node 18+ (uses built-in fetch). Zero external dependencies.
 *
 * Usage: node scripts/fetch-word-audio.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ===== Config =====
const AUDIO_DIR = path.join(__dirname, '..', 'audio', 'words');
const DATA_DIR = path.join(__dirname, '..', 'data');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// ===== Load data files (browser global → Node) =====
function loadDataFile(filePath, varName) {
  const code = fs.readFileSync(filePath, 'utf8')
    .replace(new RegExp('const\\s+' + varName + '\\s*='), 'globalThis.' + varName + ' =');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return ctx[varName];
}

// ===== cleanWordName — must match frontend cleanWord() exactly =====
function cleanWordName(word) {
  return word
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-zA-Z\s-]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join('-')
    .toLowerCase();
}

// ===== Collect all unique words (dedup by cleaned-name) =====
function collectWords() {
  const courseData = loadDataFile(path.join(DATA_DIR, 'course.js'), 'COURSE_DATA');
  const resourcesData = loadDataFile(path.join(DATA_DIR, 'resources.js'), 'RESOURCES_DATA');

  const seen = new Map(); // cleanedName → original word
  const words = [];

  for (const lesson of courseData.lessons) {
    for (const v of lesson.vocabulary) {
      const cleaned = cleanWordName(v.word);
      if (!seen.has(cleaned)) {
        seen.set(cleaned, v.word);
        words.push({ original: v.word, cleaned });
      }
    }
  }

  for (const v of resourcesData.technical_vocabulary) {
    const cleaned = cleanWordName(v.word);
    if (!seen.has(cleaned)) {
      seen.set(cleaned, v.word);
      words.push({ original: v.word, cleaned });
    }
  }

  return words;
}

// ===== Resolve potentially relative URL to absolute =====
function toAbsoluteUrl(src) {
  return src.startsWith('http') ? src : 'https://dictionary.cambridge.org' + src;
}

// ===== Fetch audio URL from a specific Cambridge Dictionary page =====
async function fetchAudioFromPage(slug) {
  const url = 'https://dictionary.cambridge.org/dictionary/english/' + slug;

  const res = await fetchWithTimeout(url, {
    headers: { 'User-Agent': USER_AGENT }
  }, 15000);

  if (!res.ok) return null;

  const html = await res.text();

  // Verify we landed on an actual dictionary entry, not a search/spellcheck page
  // Dictionary entries have <div class="entry-body"> or <div class="di-body">
  const isEntry = /class="[^"]*(?:entry-body|di-body|pos-header)/.test(html);
  if (!isEntry) return null;

  // Try US pronunciation first
  const usMatch = html.match(/src="([^"]*us_pron[^"]*\.mp3)"/);
  if (usMatch) return toAbsoluteUrl(usMatch[1]);

  // Fallback to UK pronunciation
  const ukMatch = html.match(/src="([^"]*uk_pron[^"]*\.mp3)"/);
  if (ukMatch) return toAbsoluteUrl(ukMatch[1]);

  return null;
}

// ===== Pick the longest word from a phrase =====
function longestWord(phrase) {
  const words = phrase
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-zA-Z\s-]/g, '')
    .trim()
    .split(/\s+/);
  if (words.length <= 1) return null;
  let best = '';
  for (const w of words) {
    if (w.length > best.length) best = w;
  }
  return best.toLowerCase();
}

// ===== Fetch audio URL — try compound first, fallback to longest word =====
async function fetchAudioUrl(word) {
  const cleanedForUrl = cleanWordName(word);

  // 1) Try the full compound slug
  const url1 = await fetchAudioFromPage(cleanedForUrl);
  if (url1) return { audioUrl: url1, via: cleanedForUrl };

  // 2) Fallback: try the longest individual word
  const fallback = longestWord(word);
  if (fallback && fallback !== cleanedForUrl) {
    await delay(500);
    const url2 = await fetchAudioFromPage(fallback);
    if (url2) return { audioUrl: url2, via: fallback };
  }

  return null;
}

// ===== Fetch with timeout =====
async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs || 15000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// ===== Download MP3 =====
async function downloadMp3(url, destPath) {
  const res = await fetchWithTimeout(url, {
    headers: { 'User-Agent': USER_AGENT }
  }, 15000);

  if (!res.ok) throw new Error('HTTP ' + res.status);

  const buffer = Buffer.from(await res.arrayBuffer());

  // Validate MP3 magic bytes: ID3 tag (0x49 0x44 0x33) or MPEG sync (0xFF 0xFB/0xFF 0xF3/0xFF 0xF2)
  if (buffer.length < 100) throw new Error('File too small: ' + buffer.length + ' bytes');
  const isID3 = buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33;
  var isMPEG = buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0;
  if (!isID3 && !isMPEG) throw new Error('Not a valid MP3 file (bad magic bytes)');

  fs.writeFileSync(destPath, buffer);
}

// ===== Random delay =====
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay() {
  return delay(1000 + Math.random() * 1000); // 1-2 seconds
}

// ===== Main =====
async function main() {
  // Ensure audio directory exists
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const words = collectWords();
  console.log('Total unique words (by cleaned-name): ' + words.length);
  console.log('Audio directory: ' + AUDIO_DIR);
  console.log('---');

  let success = 0;
  let skipped = 0;
  let failed = 0;
  const failedWords = [];

  for (let i = 0; i < words.length; i++) {
    const { original, cleaned } = words[i];
    const destPath = path.join(AUDIO_DIR, cleaned + '.mp3');
    const progress = '[' + (i + 1) + '/' + words.length + ']';

    // Skip if already exists
    if (fs.existsSync(destPath)) {
      console.log(progress + ' ' + original + ' → skipped (exists)');
      skipped++;
      continue;
    }

    try {
      // Fetch dictionary page
      const result = await fetchAudioUrl(original);

      if (!result) {
        console.log(progress + ' ' + original + ' → FAILED (no audio found)');
        failed++;
        failedWords.push(original);
        await randomDelay();
        continue;
      }

      // Download MP3
      await downloadMp3(result.audioUrl, destPath);
      const viaNote = result.via !== cleaned ? ' (via "' + result.via + '")' : '';
      console.log(progress + ' ' + original + ' → ' + cleaned + '.mp3 ✓' + viaNote);
      success++;
    } catch (err) {
      console.log(progress + ' ' + original + ' → FAILED (' + err.message + ')');
      failed++;
      failedWords.push(original);

      // Delete partial file if exists
      try { fs.unlinkSync(destPath); } catch (_) {}
    }

    await randomDelay();
  }

  // Summary
  console.log('\n===== SUMMARY =====');
  console.log('Total words:  ' + words.length);
  console.log('Success:      ' + success);
  console.log('Skipped:      ' + skipped);
  console.log('Failed:       ' + failed);

  if (failedWords.length > 0) {
    console.log('\nFailed words:');
    failedWords.forEach(function (w) { console.log('  - ' + w); });
  }
}

main().catch(function (err) {
  console.error('Fatal error:', err);
  process.exit(1);
});
