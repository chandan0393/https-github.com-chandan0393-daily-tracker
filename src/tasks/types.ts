export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const
export const TASK_CATEGORIES = [
  'personal',
  'work',
  'learning',
  'health',
  'finance',
  'other',
] as const
export const TASK_RECURRENCES = ['none', 'daily', 'weekly', 'monthly'] as const
export const TASK_FILTERS = [
  'all',
  'today',
  'upcoming',
  'completed',
  'pending',
  'overdue',
] as const
export const TASK_SORTS = ['dueDate', 'priority', 'createdAt'] as const

export type TaskPriority = (typeof TASK_PRIORITIES)[number]
export type TaskCategory = (typeof TASK_CATEGORIES)[number]
export type TaskRecurrence = (typeof TASK_RECURRENCES)[number]
export type TaskFilter = (typeof TASK_FILTERS)[number]
export type TaskSort = (typeof TASK_SORTS)[number]

export type Task = {
  id: string
  title: string
  description: string
  dueDate: string | null
  dueTime: string | null
  priority: TaskPriority
  category: TaskCategory
  recurrence: TaskRecurrence
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type TaskDraft = {
  title: string
  description: string
  dueDate: string
  dueTime: string
  priority: TaskPriority
  category: TaskCategory
  recurrence: TaskRecurrence
}

export type TaskStats = {
  total: number
  completed: number
  pending: number
  overdue: number
}

export type TodayProgress = {
  completed: number
  total: number
  percent: number
}
