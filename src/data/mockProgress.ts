export interface WeekDay {
  day: string
  height: number
  isToday?: boolean
}

export interface ActivityItem {
  id: number
  emoji: string
  name: string
  timeAgo: string
  language: string
  score: number
  status: 'completed' | 'in-progress'
}

export type StampState = 'done' | 'open' | 'locked'

export interface Stamp {
  id: string
  emoji: string
  label: string
  state: StampState
}

export interface Skill {
  label: string
  percent: number
  gradient: string
}

export const weeklyActivity: WeekDay[] = [
  { day: 'Mon', height: 35 },
  { day: 'Tue', height: 55 },
  { day: 'Wed', height: 20 },
  { day: 'Thu', height: 65 },
  { day: 'Fri', height: 45 },
  { day: 'Sat', height: 70 },
  { day: 'Sun', height: 40, isToday: true },
]

export const recentActivity: ActivityItem[] = [
  { id: 1, emoji: '☕', name: 'Café', timeAgo: '2 days ago', language: 'Italian', score: 74, status: 'completed' },
  { id: 2, emoji: '🛒', name: 'Market', timeAgo: '3 days ago', language: 'Italian', score: 81, status: 'completed' },
  { id: 3, emoji: '🚕', name: 'Taxi', timeAgo: '4 days ago', language: 'Italian', score: 66, status: 'completed' },
  { id: 4, emoji: '🏨', name: 'Hotel', timeAgo: '5 days ago', language: 'Italian', score: 88, status: 'completed' },
  { id: 5, emoji: '🏥', name: 'Doctor', timeAgo: 'Today', language: 'Italian', score: 0, status: 'in-progress' },
]

export const skills: Skill[] = [
  { label: 'Ordering & Requests', percent: 82, gradient: 'linear-gradient(90deg, #1b3a5c, #3a6abf)' },
  { label: 'Small Talk', percent: 68, gradient: 'linear-gradient(90deg, #2a3a4a, #5b8fd6)' },
  { label: 'Formal & Business', percent: 34, gradient: 'linear-gradient(90deg, #1a2a2a, #3a8a8a)' },
  { label: 'Emergency Situations', percent: 51, gradient: 'linear-gradient(90deg, #2a2a3a, #6a6ab0)' },
]

export const stamps: Stamp[] = [
  { id: 'cafe',       emoji: '☕',  label: 'Café',       state: 'done'   },
  { id: 'taxi',       emoji: '🚕',  label: 'Taxi',       state: 'done'   },
  { id: 'market',     emoji: '🛒',  label: 'Market',     state: 'done'   },
  { id: 'hotel',      emoji: '🏨',  label: 'Hotel',      state: 'done'   },
  { id: 'doctor',     emoji: '🏥',  label: 'Doctor',     state: 'done'   },
  { id: 'train',      emoji: '🚆',  label: 'Train',      state: 'done'   },
  { id: 'theatre',    emoji: '🎭',  label: 'Theatre',    state: 'done'   },
  { id: 'interview',  emoji: '💼',  label: 'Interview',  state: 'done'   },
  { id: 'airport',    emoji: '✈️',  label: 'Airport',    state: 'open'   },
  { id: 'bank',       emoji: '🏦',  label: 'Bank',       state: 'open'   },
  { id: 'restaurant', emoji: '🍽️', label: 'Restaurant', state: 'open'   },
  { id: 'pharmacy',   emoji: '💊',  label: 'Pharmacy',   state: 'open'   },
  { id: 'museum',     emoji: '🏛️', label: 'Museum',     state: 'locked' },
  { id: 'beach',      emoji: '🏖️', label: 'Beach',      state: 'locked' },
  { id: 'police',     emoji: '👮',  label: 'Police',     state: 'locked' },
  { id: 'school',     emoji: '🏫',  label: 'School',     state: 'locked' },
]
