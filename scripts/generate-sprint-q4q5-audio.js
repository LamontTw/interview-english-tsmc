/**
 * Generate per-block TTS audio for Sprint Q4 + Q5
 * Usage: node scripts/generate-sprint-q4q5-audio.js
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

async function generateAudio(apiKey, text, destPath) {
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

async function generateBlocks(apiKey, blocks, prefix) {
  console.log('\n' + prefix + ' (' + blocks.length + ' blocks)');
  for (var i = 0; i < blocks.length; i++) {
    var filename = prefix + '-b' + (i + 1) + '.mp3';
    await generateAudio(apiKey, blocks[i], path.join(AUDIO_DIR, filename));
    if (i < blocks.length - 1) await delay(1000);
  }
}

/* ===== Q4 ===== */

const Q4_ONELINER = "I wouldn't ask engineers to change — I'd start by eliminating their most annoying busywork, prove the value with data, let early adopters influence their peers, and then deepen into core processes on a foundation of trust.";

const Q4_BLOCKS = [
  "I believe AI adoption should start with business value and user needs, not the technology itself.",

  "At AirAI, I followed exactly this approach. For a fitness chain client overwhelmed by customer service volume, I first identified the highest-impact use case — automating repetitive queries through a GenAI-powered system on LINE. I defined success metrics with the client, then deployed a manageable pilot.",

  "But the technology was only half the challenge. I conducted hands-on training with staff, created documentation, and built a feedback loop for continuous improvement. The result was a 50 percent reduction in response time, and the client expanded the solution to additional locations.",

  "In my view, sustainable AI adoption depends on three things: choosing the right use case, proving value through early wins, and investing in training and reinforcement so people understand not just how to use the solution, but why it matters."
];

/* ===== Q5 ===== */

const Q5_BLOCKS = [
  'Change management is rarely just about seeing the right answer. The harder part is turning "the change I want to push" into a shared goal that different functions are willing to commit to.',

  "If I could not turn my proposed change into a shared goal people were willing to commit to, even a good design would not move.",

  "Right solution + wrong approach = wrong solution."
];

/* ===== Main ===== */

async function main() {
  const apiKey = loadApiKey();
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  console.log('=== Generating Sprint Q4 & Q5 block audio (nova / tts-1-hd) ===');

  // Q4 one-liner
  console.log('\nsprint-q4-oneliner');
  await generateAudio(apiKey, Q4_ONELINER, path.join(AUDIO_DIR, 'sprint-q4-oneliner.mp3'));
  await delay(1000);

  // Q4 blocks
  await generateBlocks(apiKey, Q4_BLOCKS, 'sprint-q4');

  // Q5 blocks
  await generateBlocks(apiKey, Q5_BLOCKS, 'sprint-q5');

  console.log('\n=== All done! ===');
}

main().catch(function (err) {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
