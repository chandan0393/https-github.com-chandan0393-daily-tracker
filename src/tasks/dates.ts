import type { Task, TaskFilter, TaskSort, TaskStats, TodayProgress } from './types'

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDueDate(dueDate: string | null, dueTime: string | null): string {
  if (!dueDate) {
    return 'No due date'
  }

  const [year, month, day] = dueDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  if (!dueTime) {
    return formattedDate
  }

  const [hours, minutes] = dueTime.split(':').map(Number)
  date.setHours(hours, minutes, 0, 0)
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  return `${formattedDate} · ${formattedTime}`
}

export function isTaskOverdue(task: Task, now = new Date()): boolean {
  if (task.completed || !task.dueDate) {
    return false
  }

  const today = localDateKey(now)
  if (task.dueDate < today) {
    return true
  }
  if (task.dueDate > today || !task.dueTime) {
    return false
  }

  const [hours, minutes] = task.dueTime.split(':').map(Number)
  const dueAt = new Date(now)
  dueAt.setHours(hours, minutes, 0, 0)
  return now.getTime() > dueAt.getTime()
}

export function isTaskDueToday(task: Task, now = new Date()): boolean {
  return task.dueDate === localDateKey(now)
}

export function matchesFilter(task: Task, filter: TaskFilter, now = new Date()): boolean {
  const today = localDateKey(now)

  switch (filter) {
    case 'today':
      return isTaskDueToday(task, now)
    case 'upcoming':
      return !task.completed && !!task.dueDate && task.dueDate > today
    case 'completed':
      return task.completed
    case 'pending':
      return !task.completed
    case 'overdue':
      return isTaskOverdue(task, now)
    default:
      return true
  }
}

export function getTaskStats(tasks: Task[], now = new Date()): TaskStats {
  return {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
    overdue: tasks.filter((task) => isTaskOverdue(task, now)).length,
  }
}

export function getTodayProgress(tasks: Task[], now = new Date()): TodayProgress {
  const todayTasks = tasks.filter((task) => isTaskDueToday(task, now))
  const completed = todayTasks.filter((task) => task.completed).length
  const total = todayTasks.length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { completed, total, percent }
}

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 }

function dueTimestamp(task: Task): number {
  if (!task.dueDate) {
    return Number.POSITIVE_INFINITY
  }

  const [year, month, day] = task.dueDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  if (task.dueTime) {
    const [hours, minutes] = task.dueTime.split(':').map(Number)
    date.setHours(hours, minutes, 0, 0)
  }
  return date.getTime()
}

export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  const sorted = [...tasks]

  sorted.sort((a, b) => {
    if (sort === 'priority') {
      const rankDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      if (rankDiff !== 0) {
        return rankDiff
      }
    }

    if (sort === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }

    const dueDiff = dueTimestamp(a) - dueTimestamp(b)
    if (dueDiff !== 0) {
      return dueDiff
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return sorted
}

export function matchesSearch(task: Task, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return true
  }

  return (
    task.title.toLowerCase().includes(needle) ||
    task.description.toLowerCase().includes(needle)
  )
}
