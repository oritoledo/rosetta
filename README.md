# Rosetta

A language learning app built with React 18, Vite, and Tailwind CSS.

## Setup

```bash
npm install
cp .env.example .env   # then add your Anthropic API key
npm run dev
```

Opens at **http://localhost:5173**

## API Key

Get your key at https://console.anthropic.com and add it to `.env`:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

## Screens

| Route | Screen |
|---|---|
| `/` | Home |
| `/scene/:id` | Scene Intro |
| `/conversation/:id` | Live Conversation |
| `/debrief` | Post-session Debrief |
| `/scroll` | Progress Scroll |

Scene IDs: `cafe`, `doctor`, `train`, `market`
