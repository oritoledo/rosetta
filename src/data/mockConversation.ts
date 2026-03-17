export type MessageRole = 'ai' | 'user' | 'hint'

export interface ChatMessage {
  id: number
  role: MessageRole
  text: string
  translation?: string
  errorWords?: string[]
}

export const mockConversation: ChatMessage[] = [
  {
    id: 1,
    role: 'ai',
    text: 'Buongiorno! Cosa prende?',
    translation: 'Good morning! What will you have?',
  },
  {
    id: 2,
    role: 'user',
    text: 'Vorrei un cappuccino, per favore.',
  },
  {
    id: 3,
    role: 'ai',
    text: 'Certo! Grande o normale? E mangia qualcosa?',
    translation: 'Of course! Large or regular? Eating anything?',
  },
  {
    id: 4,
    role: 'user',
    text: "Voglio anche un cornetto con la crema… come si dice 'on the side'?",
    errorWords: ['cornetto'],
  },
  {
    id: 5,
    role: 'hint',
    text: 'Tap the marked word for a hint',
  },
  {
    id: 6,
    role: 'ai',
    text: "Un cornetto alla crema! Si dice 'a parte.' Ottima scelta!",
    translation: "A cream croissant! You say 'a parte.' Wonderful choice!",
  },
  {
    id: 7,
    role: 'user',
    text: 'Quanto costa tutto?',
  },
  {
    id: 8,
    role: 'ai',
    text: 'Allora… un cappuccino e un cornetto, fa tre euro e cinquanta. Paga in contanti o con carta?',
    translation: 'So… a cappuccino and a croissant, that\'s three euros fifty. Cash or card?',
  },
]
