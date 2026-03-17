export const colors = {
  basalt:       '#181818',
  basaltMid:    '#212120',
  basaltRaised: '#2a2a28',
  basaltEdge:   '#333330',
  lapisDeep:    '#1b3a5c',
  lapis:        '#2a5298',
  lapisMid:     '#3a6abf',
  lapisBright:  '#5b8fd6',
  moon:         '#e8eef5',
  moonBright:   '#f4f7fa',
  moonDim:      '#9aaabb',
  muted:        '#5a5a58',
  faint:        '#3a3a38',
  papyrus:      '#f0ece4',
  papyrusDark:  '#e0d9ce',
} as const

export type ColorKey = keyof typeof colors
