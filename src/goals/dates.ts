import type {
  Goal,
  GoalDurationInfo,
  GoalFilter,
  GoalSort,
  GoalStats,
  GoalStatus,
} from './types'

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

export function diffInDays(startStr: string, endStr: string): number {
  const start = parseLocalDate(startStr)
  const end = parseLocalDate(endStr)
  const diffMs = end.getTime() - start.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function subtractDays(dateStr: string, days: number): string {
  const date = parseLocalDate(dateStr)
  date.setDate(date.getDate() - days)
  return localDateKey(date)
}

export function formatGoalDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = parseLocalDate(dateStr)
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatGoalDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return ''
  return `${formatGoalDate(startDate)} → ${formatGoalDate(endDate)}`
}

export function calculateGoalProgress(goal: Goal): number {
  if (goal.completed) {
    return 100
  }

  if (goal.progressMode === 'target' && goal.targetValue && goal.targetValue > 0) {
    const current = Math.max(0, goal.currentValue ?? 0)
    const ratio = (current / goal.targetValue) * 100
    return Math.min(100, Math.round(ratio))
  }

  if (goal.progressMode === 'milestones' && goal.milestones.length > 0) {
    const completedCount = goal.milestones.filter((m) => m.completed).length
    const ratio = (completedCount / goal.milestones.length) * 100
    return Math.min(100, Math.round(ratio))
  }

  return Math.min(100, Math.max(0, Math.round(goal.manualProgress ?? 0)))
}

export function getGoalStatus(goal: Goal, now = new Date()): GoalStatus {
  if (goal.completed) {
    return 'completed'
  }

  const progress = calculateGoalProgress(goal)
  if (progress >= 100) {
    return 'completed'
  }

  if (goal.isPaused) {
    return 'paused'
  }

  const today = localDateKey(now)
  if (today < goal.startDate) {
    return 'not_started'
  }

  if (today > goal.endDate) {
    return 'overdue'
  }

  return 'active'
}

export function getGoalDurationInfo(goal: Goal, now = new Date()): GoalDurationInfo {
  const today = localDateKey(now)
  const totalDays = Math.max(1, diffInDays(goal.startDate, goal.endDate))
  const statusType = getGoalStatus(goal, now)

  let daysElapsed = 0
  if (today >= goal.startDate) {
    daysElapsed = Math.max(0, diffInDays(goal.startDate, today))
  }

  let daysRemaining = 0
  let overdueDays = 0
  let startsInDays = 0
  let statusText = ''

  if (statusType === 'completed') {
    statusText = 'Completed'
  } else if (statusType === 'paused') {
    statusText = 'Paused'
  } else if (today < goal.startDate) {
    startsInDays = Math.max(1, diffInDays(today, goal.startDate))
    statusText =
      startsInDays === 1 ? 'Starts tomorrow' : `Starts in ${startsInDays} days`
  } else if (today > goal.endDate) {
    overdueDays = Math.max(1, diffInDays(goal.endDate, today))
    statusText =
      overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`
  } else {
    daysRemaining = Math.max(0, diffInDays(today, goal.endDate))
    if (daysRemaining === 0) {
      statusText = 'Due today'
    } else if (daysRemaining === 1) {
      statusText = '1 day remaining'
    } else {
      statusText = `${daysRemaining} days remaining`
    }
  }

  return {
    totalDays,
    daysElapsed,
    daysRemaining,
    overdueDays,
    startsInDays,
    statusText,
    statusType,
  }
}

export function matchesGoalFilter(
  goal: Goal,
  filter: GoalFilter,
  now = new Date(),
): boolean {
  if (filter === 'all') return true
  const status = getGoalStatus(goal, now)
  return status === filter
}

export function matchesGoalCategory(goal: Goal, category: string): boolean {
  if (!category || category === 'all') return true
  return goal.category === category
}

export function matchesGoalSearch(goal: Goal, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true

  return (
    goal.title.toLowerCase().includes(needle) ||
    goal.description.toLowerCase().includes(needle) ||
    goal.category.toLowerCase().includes(needle) ||
    goal.milestones.some((m) => m.title.toLowerCase().includes(needle))
  )
}

export function getGoalStats(goals: Goal[], now = new Date()): GoalStats {
  const total = goals.length
  let active = 0
  let completed = 0
  let overdue = 0
  let totalProgress = 0

  for (const goal of goals) {
    const status = getGoalStatus(goal, now)
    const progress = calculateGoalProgress(goal)
    totalProgress += progress

    if (status === 'active') {
      active++
    } else if (status === 'completed') {
      completed++
    } else if (status === 'overdue') {
      overdue++
    }
  }

  const overallProgress = total === 0 ? 0 : Math.round(totalProgress / total)

  return {
    total,
    active,
    completed,
    overdue,
    overallProgress,
  }
}

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 }

export function sortGoals(goals: Goal[], sort: GoalSort, now = new Date()): Goal[] {
  const sorted = [...goals]

  sorted.sort((a, b) => {
    const statusA = getGoalStatus(a, now)
    const statusB = getGoalStatus(b, now)

    if (sort === 'default') {
      // Active goals first, sorted by nearest deadline
      if (statusA === 'active' && statusB !== 'active') return -1
      if (statusB === 'active' && statusA !== 'active') return 1

      // If both active or neither active:
      // Put completed at the end
      if (statusA === 'completed' && statusB !== 'completed') return 1
      if (statusB === 'completed' && statusA !== 'completed') return -1

      // Sort by nearest deadline (endDate)
      const dateDiff = a.endDate.localeCompare(b.endDate)
      if (dateDiff !== 0) return dateDiff

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }

    if (sort === 'deadline') {
      const dateDiff = a.endDate.localeCompare(b.endDate)
      if (dateDiff !== 0) return dateDiff
      return a.title.localeCompare(b.title)
    }

    if (sort === 'startDate') {
      const dateDiff = a.startDate.localeCompare(b.startDate)
      if (dateDiff !== 0) return dateDiff
      return a.endDate.localeCompare(b.endDate)
    }

    if (sort === 'progress') {
      const progDiff = calculateGoalProgress(b) - calculateGoalProgress(a)
      if (progDiff !== 0) return progDiff
      return a.endDate.localeCompare(b.endDate)
    }

    if (sort === 'priority') {
      const pDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      if (pDiff !== 0) return pDiff
      return a.endDate.localeCompare(b.endDate)
    }

    if (sort === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }

    return 0
  })

  return sorted
}

export function getNextDeadlineGoal(goals: Goal[], now = new Date()): Goal | null {
  const candidateGoals = goals
    .filter((g) => {
      const status = getGoalStatus(g, now)
      return status === 'active' || status === 'not_started'
    })
    .sort((a, b) => a.endDate.localeCompare(b.endDate))

  return candidateGoals[0] ?? null
}

export function getUpcomingGoals(goals: Goal[], limit = 4, now = new Date()): Goal[] {
  return goals
    .filter((g) => {
      const status = getGoalStatus(g, now)
      return status === 'active' || status === 'not_started'
    })
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
    .slice(0, limit)
}
