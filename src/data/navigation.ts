import type { NavItem, PageId } from '../types'

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Your daily overview and command center.',
  },
  {
    id: 'goals',
    label: 'Goals',
    description: 'Track the goals you want to achieve.',
  },
  {
    id: 'tasks',
    label: 'To-Do Tasks',
    description: 'Keep your daily tasks organized.',
  },
  {
    id: 'expenses',
    label: 'Expenses',
    description: 'Record and review daily spending.',
  },
  {
    id: 'learning',
    label: 'Learning',
    description: 'Log what you study and how long you learn.',
  },
  {
    id: 'walking',
    label: 'Walking',
    description: 'Track walking distance and movement.',
  },
  {
    id: 'water',
    label: 'Water Intake',
    description: 'Monitor how much water you drink.',
  },
  {
    id: 'activity',
    label: 'Physical Activity',
    description: 'Log workouts and physical activity.',
  },
  {
    id: 'journal',
    label: 'Daily Journal',
    description: 'Write a short reflection for each day.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'See patterns and progress over time.',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Customize how LifeOS works for you.',
  },
]

export const MOBILE_PRIMARY_IDS: PageId[] = [
  'dashboard',
  'goals',
  'tasks',
  'expenses',
]

export const PAGE_VARIANTS: Record<PageId, 'blue' | 'pink' | 'green' | 'lavender' | 'peach' | 'yellow' | 'cream' | 'slate'> = {
  dashboard: 'blue',
  goals: 'pink',
  tasks: 'green',
  expenses: 'peach',
  learning: 'lavender',
  walking: 'green',
  water: 'blue',
  activity: 'peach',
  journal: 'yellow',
  analytics: 'lavender',
  settings: 'slate',
}

export function getNavItem(id: PageId): NavItem {
  const item = NAV_ITEMS.find((navItem) => navItem.id === id)
  if (!item) {
    return NAV_ITEMS[0]
  }
  return item
}
