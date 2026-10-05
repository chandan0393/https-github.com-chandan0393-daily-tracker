import type {
  GoalCategory,
  GoalFilter,
  GoalPriority,
  GoalSort,
  GoalStatus,
  ReminderOption,
} from './types'

export const CATEGORY_DETAILS: Record<
  GoalCategory,
  { label: string; icon: string; color: string; bg: string }
> = {
  Personal: { label: 'Personal', icon: '🌟', color: '#7c3aed', bg: '#f5f3ff' },
  Career: { label: 'Career', icon: '💼', color: '#0284c7', bg: '#f0f9ff' },
  Learning: { label: 'Learning', icon: '📚', color: '#2563eb', bg: '#eff4ff' },
  Health: { label: 'Health', icon: '🩺', color: '#059669', bg: '#ecfdf5' },
  Finance: { label: 'Finance', icon: '💰', color: '#d97706', bg: '#fffbeb' },
  Fitness: { label: 'Fitness', icon: '🏃', color: '#db2777', bg: '#fdf2f8' },
  Travel: { label: 'Travel', icon: '✈️', color: '#0891b2', bg: '#ecfeff' },
  Other: { label: 'Other', icon: '🎯', color: '#475467', bg: '#f8fafc' },
}

export const PRIORITY_DETAILS: Record<
  GoalPriority,
  { label: string; color: string; bg: string }
> = {
  low: { label: 'Low Priority', color: '#027a48', bg: '#d1fadf' },
  medium: { label: 'Medium Priority', color: '#b54708', bg: '#fef0c7' },
  high: { label: 'High Priority', color: '#b42318', bg: '#fee4e2' },
}

export const STATUS_DETAILS: Record<
  GoalStatus,
  { label: string; icon: string; color: string; bg: string; badgeClass: string }
> = {
  active: {
    label: 'Active',
    icon: '⚡',
    color: '#2563eb',
    bg: '#eff4ff',
    badgeClass: 'status-active',
  },
  not_started: {
    label: 'Not Started',
    icon: '⏳',
    color: '#475467',
    bg: '#f2f4f7',
    badgeClass: 'status-not-started',
  },
  completed: {
    label: 'Completed',
    icon: '✓',
    color: '#027a48',
    bg: '#d1fadf',
    badgeClass: 'status-completed',
  },
  overdue: {
    label: 'Overdue',
    icon: '⚠️',
    color: '#b42318',
    bg: '#fee4e2',
    badgeClass: 'status-overdue',
  },
  paused: {
    label: 'Paused',
    icon: '⏸',
    color: '#b54708',
    bg: '#fef0c7',
    badgeClass: 'status-paused',
  },
}

export const FILTER_LABELS: Record<GoalFilter, string> = {
  all: 'All',
  active: 'Active',
  not_started: 'Not Started',
  completed: 'Completed',
  overdue: 'Overdue',
  paused: 'Paused',
}

export const SORT_LABELS: Record<GoalSort, string> = {
  default: 'Default (Active & nearest deadline)',
  deadline: 'Nearest deadline',
  startDate: 'Start date',
  progress: 'Highest progress',
  createdAt: 'Recently created',
  priority: 'Priority (High to Low)',
}

export const REMINDER_LABELS: Record<ReminderOption, string> = {
  none: 'No reminder',
  start_date: 'On start date',
  '1_day_before': '1 day before deadline',
  '3_days_before': '3 days before deadline',
  '7_days_before': '7 days before deadline',
  custom: 'Custom date & time',
}
