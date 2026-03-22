/**
 * Generate TTS audio for Sprint Q2 (PDC transformation) — nova (female) voice
 * Usage: node scripts/generate-sprint-q2-audio.js
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
    console.log(path.basename(destPath) + ' → skipped (exists)');
    return;
  }

  console.log('Generating ' + path.basename(destPath) + '...');
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      voice: voice,
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
  console.log(path.basename(destPath) + ' → ' + buffer.length + ' bytes done');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Q2_FULL_EN = `If I had to choose one of the most complete transformations I led, I would use the Project Delivery Committee, or PDC, at CINNOX.

Before PDC was established, product delivery was quite chaotic.
On the surface, the problems looked like missed deadlines and inconsistent quality, but the deeper issue was that each function operated in its own way, without a unified cross-functional delivery mechanism. Engineering, QA, DevOps, Product, Business, and Operations all had different priorities, rhythms, and KPIs. So even when each team was working hard, the overall delivery system still kept getting stuck.

At that time, I was already managing around 30 RDs, but I gradually realized that the real bottleneck was no longer inside one engineering team. It was in cross-functional collaboration, decision rhythm, and unclear ownership boundaries.
So my task was not just to push projects faster. It was to build a cross-departmental delivery mechanism from scratch, so different functions could collaborate, make decisions, and deliver in a more consistent way.

The first thing I did was establish PDC.
But I did not treat it as just another management layer. I designed it as a change mechanism.
I shifted the organization from a more siloed functional management model to a more project-oriented operating model, so people stopped looking only at their own function and started working toward end-to-end delivery.

Concretely, I did a few things.
First, I redesigned the cross-functional governance model, including project pipeline alignment, decision cadence, and clearer ownership boundaries through RACI.
Second, I led cross-functional workshops, not just to announce a new process, but to surface the concerns, constraints, and definitions of success from different functions and build real alignment.
Third, I turned the new working model into executable standard processes and supported it with manager training, so new leaders could actually operate within the new model.

The biggest resistance early on was not the process itself, but the department heads.
The original release rhythm was actually comfortable for many of them. It was not ideal, but it was familiar and predictable from their point of view. What I was proposing meant a new rhythm, new ownership, and new risk.
So the hardest part in the beginning was not whether the change was logically right, but that people did not fully understand my reasoning yet, and I did not fully understand theirs. In that situation, communication gets stuck very easily.

What I learned later was that buy-in is not only about rational alignment. It is also about making people feel heard, respected, and supported.
So I spent a lot of time in one-on-one conversations, understanding each leader's concerns, constraints, and pressures, and then translating the change into a shared goal they were willing to own, rather than something being imposed on them.
Together with early wins that showed delivery becoming more stable and predictable, that is how buy-in gradually formed.

In the end, the transformation delivered several concrete outcomes.
First, major release cadence improved to about 2.5 times the previous level, which made delivery not only faster, but also more stable and predictable.
Second, customer response time improved from more than two weeks to within 24 hours.
Third, the framework supported a much larger cross-site delivery organization across Taipei and Hong Kong, covering more than 90 people in Taipei and around 60 in Hong Kong, while maintaining a much more consistent delivery rhythm.
Most importantly, PDC did not remain a one-time initiative. It became the company's standard operating model.`;

const Q2_SPOKEN_EN = `If I had to choose one transformation example, I would use the PDC story at CINNOX.
The real problem at that time was not that one team was not working hard enough. It was that each function operated in its own way, without a unified cross-functional delivery mechanism, so execution kept getting stuck and delivery was inconsistent.

What I did was not just push projects harder. I built PDC from scratch and redesigned the cross-functional operating model.
I shifted the organization from a more siloed functional structure to a more project-oriented way of working, and supported that change through pipeline alignment, RACI, decision cadence, and governance redesign.
I also used cross-functional workshops and manager training to make sure the new model was actually adopted, instead of only looking good on paper.

The hardest part was really buy-in.
The original rhythm was not ideal, but for many department heads it was familiar and predictable.
What I learned was that change is not driven by logic alone. People also need to feel heard, respected, and supported.
So I spent a lot of time in one-on-one conversations, together with early wins, to gradually build alignment.

In the end, major release cadence improved to about 2.5 times the previous level, customer response time improved from more than two weeks to within 24 hours, and the framework supported a much larger cross-site organization across Taipei and Hong Kong, with more than 90 people in Taipei and around 60 in Hong Kong. Most importantly, it became the company's standard operating model.`;

const Q3_FULL_EN = `At AirAI, we worked with a global relocation service provider to improve part of their finance and operations workflow.
They had to handle estimates, invoices, expense processing, and settlement information coming from different countries and vendors. Originally, that information was scattered across multiple systems and communication channels, which created a lot of manual data entry, checking, and coordination. It was time-consuming and also error-prone.

So what we did was not just introduce one isolated AI feature. We first looked at the workflow end to end and redesigned the information flow.
We consolidated fragmented steps into Teams as a primary collaboration layer, and then identified which parts were suitable for AI and which parts were better solved with automation.
One clear example was invoice processing. Users could upload an invoice image or photo, and the AI would extract the fields, perform an initial interpretation, and write the information into the system. The user only needed to do a quick review and approve it, which removed a large amount of manual typing and repetitive data handling.

For other steps such as order creation, settlement, and notifications — where the rules were more fixed and repetitive — we used workflow automation rather than forcing AI into everything.
So the real value of the project was not that we built one AI feature, but that we placed AI and automation in the right parts of the process and redesigned the whole flow into an executable end-to-end business workflow.

As a result, end-to-end processing efficiency improved by more than 80 percent, while manual effort and error risk were significantly reduced.
For me, the most important lesson from this project is that successful AI deployment is usually not just about connecting a model. It depends on understanding the workflow first, deciding where AI adds value, where automation is enough, and then making sure the solution is actually adopted in day-to-day operations.`;

async function main() {
  const apiKey = loadApiKey();
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  console.log('Generating Sprint Q2 & Q3 audio (nova / female / tts-1-hd)...');
  console.log('---');

  await generateAudio(apiKey, Q2_FULL_EN, path.join(AUDIO_DIR, 'sprint-q2-full.mp3'), 'nova');
  await delay(1500);
  await generateAudio(apiKey, Q2_SPOKEN_EN, path.join(AUDIO_DIR, 'sprint-q2-spoken.mp3'), 'nova');
  await delay(1500);
  await generateAudio(apiKey, Q3_FULL_EN, path.join(AUDIO_DIR, 'sprint-q3-full.mp3'), 'nova');

  console.log('\nAll done!');
}

main().catch(function (err) {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
