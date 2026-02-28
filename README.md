# HyperFounder

HyperFounder is a premium web app MVP that helps early-stage founders get an edge in the moments that matter: pitching their idea to investors, customers, mentors, or advisors in realistic, high-pressure contexts.

Building an MVP is getting easier every day. The bottleneck is problem discovery + communication: can you clearly explain what you're building, handle pushback, and extract truth (not compliments) when you get a chance conversation, warm intro, or quick meeting?

HyperFounder turns those rare, high-stakes interactions into repeatable reps with realistic AI personas, voice + chat interaction, and structured post-session feedback.

## What You Can Do

- Generate a detailed roleplay scenario (persona + environment) with difficulty levels (friendly -> skeptical -> shark).
- Enter your own startup idea or generate a random, challenging idea to pitch on the spot.
- Run a live simulation via text chat and/or microphone input.
- Hear the persona speak back using ElevenLabs TTS (with browser fallback).
- End the session and get a "Mission Report" scored with actionable feedback grounded in frameworks like The Mom Test.

## How The App Works (User Flow)

1. Landing page -> Start Simulation
2. Setup -> enter founder name, idea (or random idea), optional custom persona + environment, choose difficulty
3. Simulation room -> AI opens the conversation, you respond, AI pushes back in character
4. Feedback room -> score + strengths + improvements + key takeaway

## Tech Stack

- Frontend: React + Vite, React Router
- UI: Vanilla CSS design system (dark mode, glassmorphism, gradients, micro-animations)
- AI (text): Google Gemini API via `@google/genai`
  - Scenario generation / random idea / evaluation: `gemini-2.5-flash`
  - Live roleplay chat: `gemini-2.5-pro`
- Voice (TTS): ElevenLabs Text-to-Speech API (optional), with Web Speech API fallback
- Voice (input): Browser SpeechRecognition (when supported)

## Code Map (Where To Look)

- Core UI + routing: `src/App.jsx`
- Gemini + ElevenLabs integration: `src/services/gemini.js`

## Running Locally

Prereqs: Node.js + npm.

```bash
npm install
npm run dev
```

Create a `.env` file (do not commit it):

```bash
VITE_GEMINI_API_KEY="your_gemini_key"
VITE_ELEVENLABS_API_KEY="your_elevenlabs_key" # optional; app falls back to browser speech
```

## Notes / Limitations (MVP)

- No persistence yet: scenarios + chat history live in memory for the session.
- API keys are currently used from the client. For production, put Gemini/ElevenLabs behind a backend/proxy to protect keys and enforce rate limits.
- "Establishing shot" generated video (Veo) is part of the roadmap but not implemented in this repo yet.

## Roadmap Ideas (From The Implementation Plan)

- "User memory": track recurring weaknesses and personalize training over time
- Asynchronous establishing-shot video generation for the persona/environment (Veo)
- More scenario packs: customer discovery calls, enterprise procurement, technical advisor grilling, demo-day VC, etc.
- Secure backend/proxy for AI calls + optional persistence

## License

To Be Decided.
