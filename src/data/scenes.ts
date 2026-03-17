export interface SceneGuide {
  name: string
  description: string
  emoji: string
}

export interface Scene {
  id: string
  emoji: string
  title: string
  location: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  category: string
  language: string
  brief: string[]
  guide: SceneGuide
  progress?: number  // 0–100, undefined = not started
  bgGradient: string
  emojiShadow: string
}

export const scenes: Record<string, Scene> = {
  cafe: {
    id: 'cafe',
    emoji: '☕',
    title: 'Ordering at a Café',
    location: 'Milan, Italy',
    level: 'Intermediate',
    duration: '~8 min',
    category: 'Food · Social',
    language: 'Italian',
    bgGradient: 'linear-gradient(135deg, #0e1e30, #1b3a5c)',
    emojiShadow: 'rgba(91,143,214,0.5)',
    progress: 45,
    brief: [
      'Milanese cafés serve espresso standing at the bar — sitting costs extra',
      'Address strangers as "Lei" (formal you) unless invited to use "tu"',
      'Pastries are typically ordered alongside your coffee, not separately',
    ],
    guide: {
      name: 'Sofia — Barista',
      description: 'Fast-talking · Warm · Roman accent',
      emoji: '👩‍🦰',
    },
  },
  doctor: {
    id: 'doctor',
    emoji: '🏥',
    title: 'Doctor Visit',
    location: 'Rome, Italy',
    level: 'Advanced',
    duration: '~12 min',
    category: 'Health · Formal',
    language: 'Italian',
    bgGradient: 'linear-gradient(135deg, #1a1230, #2d1b69)',
    emojiShadow: 'rgba(130,80,220,0.4)',
    brief: [
      'Always use "Lei" (formal) when speaking with medical professionals',
      'Italian public health clinics are called "ASL" — appointments are standard',
      'Describe symptoms precisely; vague language can lead to misunderstandings',
    ],
    guide: {
      name: 'Dr. Marco — Physician',
      description: 'Patient · Precise · Northern accent',
      emoji: '👨‍⚕️',
    },
  },
  train: {
    id: 'train',
    emoji: '🚆',
    title: 'Train Station',
    location: 'Florence, Italy',
    level: 'Beginner',
    duration: '~6 min',
    category: 'Travel · Practical',
    language: 'Italian',
    bgGradient: 'linear-gradient(135deg, #0d1f1a, #1a3d32)',
    emojiShadow: 'rgba(40,160,100,0.4)',
    brief: [
      'Trenitalia and Italo are the two main rail operators in Italy',
      'Tickets must be validated (obliterato) before boarding regional trains',
      'Track numbers (binario) are announced close to departure time',
    ],
    guide: {
      name: 'Lucia — Ticket Agent',
      description: 'Brisk · Helpful · Florentine accent',
      emoji: '👩‍💼',
    },
  },
  market: {
    id: 'market',
    emoji: '🛒',
    title: 'Market Haggling',
    location: 'Naples, Italy',
    level: 'Advanced',
    duration: '~10 min',
    category: 'Commerce · Social',
    language: 'Italian',
    bgGradient: 'linear-gradient(135deg, #1f1a0d, #3d3219)',
    emojiShadow: 'rgba(200,160,40,0.4)',
    brief: [
      'Neapolitan markets (mercati) welcome spirited price negotiation',
      'Complimenting the quality of goods before haggling is good etiquette',
      'Cash is preferred and often earns a better deal than card payments',
    ],
    guide: {
      name: 'Gennaro — Market Vendor',
      description: 'Animated · Jovial · Neapolitan dialect',
      emoji: '👨‍🌾',
    },
  },
}

export const sceneList = Object.values(scenes)
