import type { Goal } from './types'

const STORAGE_KEY = 'lifeos.goals'
const FIRED_REMINDERS_KEY = 'lifeos.goals.fired_reminders'

function isGoal(value: unknown): value is Goal {
  if (!value || typeof value !== 'object') {
    return false
  }

  const goal = value as Goal
  return (
    typeof goal.id === 'string' &&
    typeof goal.title === 'string' &&
    typeof goal.description === 'string' &&
    typeof goal.category === 'string' &&
    typeof goal.priority === 'string' &&
    typeof goal.startDate === 'string' &&
    typeof goal.endDate === 'string' &&
    (goal.targetValue === null || typeof goal.targetValue === 'number') &&
    (goal.currentValue === null || typeof goal.currentValue === 'number') &&
    typeof goal.unit === 'string' &&
    typeof goal.progressMode === 'string' &&
    typeof goal.manualProgress === 'number' &&
    Array.isArray(goal.milestones) &&
    typeof goal.reminder === 'object' &&
    goal.reminder !== null &&
    typeof goal.completed === 'boolean' &&
    typeof goal.isPaused === 'boolean' &&
    typeof goal.createdAt === 'string' &&
    typeof goal.updatedAt === 'string'
  )
}

export function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isGoal)
  } catch {
    return []
  }
}

export function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  } catch {
    // Gracefully handle storage quota or privacy mode errors
  }
}

export function loadFiredReminders(): Set<string> {
  try {
    const raw = localStorage.getItem(FIRED_REMINDERS_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return new Set(parsed)
    }
    return new Set()
  } catch {
    return new Set()
  }
}

export function saveFiredReminders(keys: Set<string>): void {
  try {
    localStorage.setItem(FIRED_REMINDERS_KEY, JSON.stringify(Array.from(keys)))
  } catch {
    // Ignore storage write errors
  }
}
