/**
 * generate-script-audio.js
 * Generates full-text MP3s for self-intro scripts and behavioral answers.
 * Uses OpenAI TTS HD with 'onyx' voice (deep male).
 *
 * Usage: node scripts/generate-script-audio.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const AUDIO_DIR = path.join(__dirname, '..', 'audio', 'scripts');
const DATA_DIR = path.join(__dirname, '..', 'data');
const ENV_FILE = path.join(__dirname, '..', '.env.local');

function loadApiKey() {
  const content = fs.readFileSync(ENV_FILE, 'utf8');
  const match = content.match(/^OPENAI_API_KEY=(.+)$/m);
  if (!match) { console.error('Missing OPENAI_API_KEY'); process.exit(1); }
  return match[1].trim();
}

function loadDataFile(filePath, varName) {
  const code = fs.readFileSync(filePath, 'utf8')
    .replace(new RegExp('const\\s+' + varName + '\\s*='), 'globalThis.' + varName + ' =');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return ctx[varName];
}

async function generateAudio(apiKey, text, destPath) {
  if (fs.existsSync(destPath)) {
    console.log(path.basename(destPath) + ' → skipped (exists)');
    return;
  }

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      voice: 'onyx',
      input: text,
      speed: 0.9,
      response_format: 'mp3'
    })
  });

  if (!res.ok) {
    throw new Error('HTTP ' + res.status + ' ' + res.statusText);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  console.log(path.basename(destPath) + ' → ' + buffer.length + ' bytes ✓');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const apiKey = loadApiKey();
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const prepData = loadDataFile(path.join(DATA_DIR, 'prep.js'), 'PREP_DATA');
  const intros = prepData.self_introductions;

  console.log('Generating self-intro audio (onyx / male / tts-1-hd)...');
  console.log('---');

  // Self-intro scripts
  await generateAudio(apiKey, intros.sixty_seconds, path.join(AUDIO_DIR, 'intro-60s.mp3'));
  await delay(1000);
  if (intros.ninety_seconds) {
    await generateAudio(apiKey, intros.ninety_seconds, path.join(AUDIO_DIR, 'intro-90s.mp3'));
    await delay(1000);
  }
  await generateAudio(apiKey, intros.two_minutes, path.join(AUDIO_DIR, 'intro-2min.mp3'));
  await delay(1000);
  if (intros.quick_intro) {
    await generateAudio(apiKey, intros.quick_intro, path.join(AUDIO_DIR, 'intro-quick.mp3'));
    await delay(1000);
  }
  if (intros.natural_delivery) {
    await generateAudio(apiKey, intros.natural_delivery, path.join(AUDIO_DIR, 'intro-natural.mp3'));
    await delay(1000);
  }
  await generateAudio(apiKey, intros.company_hooks.tsmc, path.join(AUDIO_DIR, 'intro-tsmc-hook.mp3'));
  await delay(1000);

  // Interview Q&A answers
  if (prepData.interview_qa) {
    console.log('\nGenerating interview Q&A audio...');
    console.log('---');
    for (const item of prepData.interview_qa) {
      await generateAudio(apiKey, item.answer, path.join(AUDIO_DIR, 'qa-' + item.id + '.mp3'));
      await delay(1000);
    }
  }

  // Behavioral answers
  console.log('\nGenerating behavioral answer audio...');
  console.log('---');
  for (const q of prepData.behavioral_questions) {
    await generateAudio(apiKey, q.full_answer, path.join(AUDIO_DIR, 'behavioral-q' + q.id + '.mp3'));
    await delay(1000);
  }

  console.log('\nAll done!');
}

main().catch(function (err) {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
