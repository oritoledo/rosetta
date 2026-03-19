export const colors = {
  // Obsidian surfaces
  basalt:       '#0d1117',
  basaltMid:    '#161b27',
  basaltRaised: '#1a1f2e',
  basaltEdge:   '#1e2d3d',
  // Emerald accents
  lapisDeep:    '#064e3b',
  lapis:        '#059669',
  lapisMid:     '#10b981',
  lapisBright:  '#34d399',
  // Text
  moon:         '#e2e8f0',
  moonBright:   '#f1f5f9',
  moonDim:      '#94a3b8',
  muted:        '#475569',
  faint:        '#1e2d3d',
  // Surfaces (formerly papyrus)
  papyrus:      '#0d1117',
  papyrusDark:  '#1a1f2e',
} as const

export type ColorKey = keyof typeof colors
