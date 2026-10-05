export const GOAL_CATEGORIES = [
  'Personal',
  'Career',
  'Learning',
  'Health',
  'Finance',
  'Fitness',
  'Travel',
  'Other',
] as const

export type GoalCategory = (typeof GOAL_CATEGORIES)[number]

export const GOAL_PRIORITIES = ['low', 'medium', 'high'] as const
export type GoalPriority = (typeof GOAL_PRIORITIES)[number]

export const GOAL_STATUSES = [
  'not_started',
  'active',
  'completed',
  'overdue',
  'paused',
] as const
export type GoalStatus = (typeof GOAL_STATUSES)[number]

export const GOAL_FILTERS = [
  'all',
  'active',
  'not_started',
  'completed',
  'overdue',
  'paused',
] as const
export type GoalFilter = (typeof GOAL_FILTERS)[number]

export const GOAL_SORTS = [
  'default',
  'deadline',
  'startDate',
  'progress',
  'createdAt',
  'priority',
] as const
export type GoalSort = (typeof GOAL_SORTS)[number]

export const REMINDER_OPTIONS = [
  'none',
  'start_date',
  '1_day_before',
  '3_days_before',
  '7_days_before',
  'custom',
] as const
export type ReminderOption = (typeof REMINDER_OPTIONS)[number]

export type GoalMilestone = {
  id: string
  title: string
  completed: boolean
}

export type GoalProgressMode = 'target' | 'milestones' | 'manual'

export type GoalReminderSettings = {
  enabled: boolean
  option: ReminderOption
  customDate?: string // YYYY-MM-DD
  time: string // HH:mm, e.g. "09:00"
  remindMilestones?: boolean
}

export type Goal = {
  id: string
  title: string
  description: string
  category: GoalCategory
  priority: GoalPriority
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  targetValue: number | null
  currentValue: number | null
  unit: string // e.g. "Hours", "Books", "km"
  progressMode: GoalProgressMode
  manualProgress: number // 0-100
  milestones: GoalMilestone[]
  reminder: GoalReminderSettings
  completed: boolean
  isPaused: boolean
  createdAt: string
  updatedAt: string
}

export type GoalDraft = {
  title: string
  description: string
  category: GoalCategory
  priority: GoalPriority
  startDate: string
  endDate: string
  targetValue: string
  currentValue: string
  unit: string
  progressMode: GoalProgressMode
  manualProgress: number
  milestones: { id?: string; title: string; completed?: boolean }[]
  reminder: GoalReminderSettings
}

export type GoalStats = {
  total: number
  active: number
  completed: number
  overdue: number
  overallProgress: number
}

export type GoalDurationInfo = {
  totalDays: number
  daysElapsed: number
  daysRemaining: number
  overdueDays: number
  startsInDays: number
  statusText: string
  statusType: GoalStatus
}
