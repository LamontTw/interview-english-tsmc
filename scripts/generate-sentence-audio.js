/**
 * generate-sentence-audio.js
 * Generates sentence pronunciation MP3s using OpenAI TTS API.
 * Requires Node 18+ (uses built-in fetch). Zero external dependencies.
 *
 * Usage: node scripts/generate-sentence-audio.js
 *
 * Reads OPENAI_API_KEY from .env.local in project root.
 * Outputs MP3 files to audio/sentences/{cleanWord}--{sourceId}.mp3
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ===== Config =====
const AUDIO_DIR = path.join(__dirname, '..', 'audio', 'sentences');
const DATA_DIR = path.join(__dirname, '..', 'data');
const ENV_FILE = path.join(__dirname, '..', '.env.local');

// ===== Load API key from .env.local =====
function loadApiKey() {
  if (!fs.existsSync(ENV_FILE)) {
    console.error('Missing OPENAI_API_KEY in .env.local');
    process.exit(1);
  }
  const content = fs.readFileSync(ENV_FILE, 'utf8');
  const match = content.match(/^OPENAI_API_KEY=(.+)$/m);
  if (!match || !match[1].trim()) {
    console.error('Missing OPENAI_API_KEY in .env.local');
    process.exit(1);
  }
  return match[1].trim();
}

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

// ===== Collect all entries with word + example + sourceId =====
function collectEntries() {
  const courseData = loadDataFile(path.join(DATA_DIR, 'course.js'), 'COURSE_DATA');
  const resourcesData = loadDataFile(path.join(DATA_DIR, 'resources.js'), 'RESOURCES_DATA');

  const entries = [];

  for (const lesson of courseData.lessons) {
    for (const v of lesson.vocabulary) {
      entries.push({
        word: v.word,
        example: v.example,
        sourceId: 'l' + lesson.id,
        cleaned: cleanWordName(v.word)
      });
    }
  }

  for (const v of resourcesData.technical_vocabulary) {
    entries.push({
      word: v.word,
      example: v.example,
      sourceId: 'r',
      cleaned: cleanWordName(v.word)
    });
  }

  return entries;
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

// ===== Generate MP3 via OpenAI TTS API =====
async function generateAudio(apiKey, sentence, destPath) {
  const res = await fetchWithTimeout('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: 'alloy',
      input: sentence,
      speed: 0.9,
      response_format: 'mp3'
    })
  }, 15000);

  if (!res.ok) {
    throw new Error('HTTP ' + res.status + ' ' + res.statusText);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  // Validate MP3 magic bytes: ID3 tag (0x49 0x44 0x33) or MPEG sync (0xFF 0xE0+)
  if (buffer.length < 100) throw new Error('File too small: ' + buffer.length + ' bytes');
  const isID3 = buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33;
  const isMPEG = buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0;
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
  const apiKey = loadApiKey();

  // Ensure audio directory exists
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const entries = collectEntries();
  console.log('Total entries: ' + entries.length);
  console.log('Audio directory: ' + AUDIO_DIR);
  console.log('---');

  let success = 0;
  let skipped = 0;
  let failed = 0;
  const failedEntries = [];

  for (let i = 0; i < entries.length; i++) {
    const { word, example, sourceId, cleaned } = entries[i];
    const filename = cleaned + '--' + sourceId + '.mp3';
    const destPath = path.join(AUDIO_DIR, filename);
    const progress = '[' + (i + 1) + '/' + entries.length + ']';

    // Skip if already exists
    if (fs.existsSync(destPath)) {
      console.log(progress + ' ' + word + ' (' + sourceId + ') → skipped (exists)');
      skipped++;
      continue;
    }

    try {
      await generateAudio(apiKey, example, destPath);
      console.log(progress + ' ' + word + ' (' + sourceId + ') → ' + filename + ' ✓');
      success++;
    } catch (err) {
      console.log(progress + ' ' + word + ' (' + sourceId + ') → FAILED (' + err.message + ')');
      failed++;
      failedEntries.push({ word, sourceId, filename });

      // Delete partial file if exists
      try { fs.unlinkSync(destPath); } catch (_) {}
    }

    await randomDelay();
  }

  // Summary
  console.log('\n===== SUMMARY =====');
  console.log('Total entries: ' + entries.length);
  console.log('Success:       ' + success);
  console.log('Skipped:       ' + skipped);
  console.log('Failed:        ' + failed);

  if (failedEntries.length > 0) {
    console.log('\nFailed entries:');
    failedEntries.forEach(function (e) {
      console.log('  - ' + e.word + ' (' + e.sourceId + ') → ' + e.filename);
    });
  }
}

main().catch(function (err) {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
