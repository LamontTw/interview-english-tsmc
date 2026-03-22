/**
 * Generate TTS audio for Sprint follow-up questions
 * Usage: node scripts/generate-sprint-followup-audio.js
 */

const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '..', 'audio', 'scripts');
const ENV_FILE = path.join(__dirname, '..', '.env.local');

function loadApiKey() {
  const content = fs.readFileSync(ENV_FILE, 'utf8');
  const match = content.match(/^OPENAI_API_KEY=(.+)$/m);
  if (!match) { console.error('Missing OPENAI_API_KEY'); process.exit(1); }
  return match[1].trim();
}

async function generateAudio(apiKey, text, destPath, voice) {
  if (fs.existsSync(destPath)) {
    console.log('  ' + path.basename(destPath) + ' → skipped (exists)');
    return;
  }

  console.log('  Generating ' + path.basename(destPath) + '...');
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      voice: 'nova',
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
  console.log('  ' + path.basename(destPath) + ' → ' + buffer.length + ' bytes done');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const FOLLOWUPS = [
  {
    file: 'sprint-q2-followup-hardest.mp3',
    text: 'The hardest part was not the process design itself. It was buy-in.\nEach leader had different priorities, risk concerns, and definitions of success, so the real challenge was turning "the change I wanted to push" into a shared goal that different functions were willing to commit to.'
  },
  {
    file: 'sprint-q2-followup-buyin.mp3',
    text: "I learned that buy-in is not only about rational alignment. It is also about making people feel heard, respected, and supported.\nSo I spent a lot of time in one-on-one conversations, understanding each leader's concerns, constraints, and pressures, and then translating the change into a shared goal they were willing to own.\nTogether with early wins that showed delivery becoming more stable and predictable, that is how buy-in gradually formed."
  },
  {
    file: 'sprint-q3-followup-relevance.mp3',
    text: 'Because this project was not just a technical implementation. It was really a combination of workflow redesign, role redefinition, and AI adoption.\nThe real challenge was not whether the model could run, but whether the business process could actually change, whether users would accept it, and whether the outcome could be measured.\nThat is why I think it is highly relevant to an AI Change Manager role.'
  }
];

async function main() {
  const apiKey = loadApiKey();
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  console.log('=== Generating Sprint follow-up audio (nova / tts-1-hd) ===\n');

  for (var i = 0; i < FOLLOWUPS.length; i++) {
    await generateAudio(apiKey, FOLLOWUPS[i].text, path.join(AUDIO_DIR, FOLLOWUPS[i].file));
    if (i < FOLLOWUPS.length - 1) await delay(1000);
  }

  console.log('\n=== All done! ===');
}

main().catch(function (err) {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
