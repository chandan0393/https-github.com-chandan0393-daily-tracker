import type { TaskCategory, TaskPriority, TaskRecurrence } from '../tasks/types'

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  personal: 'Personal',
  work: 'Work',
  learning: 'Learning',
  health: 'Health',
  finance: 'Finance',
  other: 'Other',
}

export const RECURRENCE_LABELS: Record<TaskRecurrence, string> = {
  none: 'None',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}
