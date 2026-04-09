# Rosetta — Claude Code Project Map

## Stack
React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router v6

## Key files
- Design tokens: index.css (:root CSS vars)
- Global state: src/store/userStore.ts + src/store/settingsStore.ts
- Routing: src/App.tsx
- All screens: src/screens/
- All agents: src/agents/
- All mock data: src/data/
- Shared types: src/types/

## Rules
- Never invent new CSS variables — use existing tokens from index.css
- Never install new npm packages without asking first
- Never modify files outside the scope of the current task
- Design system: basalt/lapis/moonstone palette, Cinzel + Crimson Pro fonts

## Current state
- 14 features complete, see Notion wiki for full feature list
- Actor API is mocked — do not enable real API calls without explicit instruction
- All screens exist and are wired via React Router