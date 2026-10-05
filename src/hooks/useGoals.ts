import { useCallback, useEffect, useState } from 'react'
import {
  checkAndDispatchGoalReminders,
  getNotificationPermission,
  requestNotificationPermission,
} from '../goals/notifications'
import { loadGoals, saveGoals } from '../goals/storage'
import type { Goal, GoalDraft } from '../goals/types'

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `goal-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function toStoredGoalFields(draft: GoalDraft) {
  const targetVal = draft.targetValue.trim() ? Number(draft.targetValue) : null
  const currentVal = draft.currentValue.trim() ? Number(draft.currentValue) : null

  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    category: draft.category,
    priority: draft.priority,
    startDate: draft.startDate,
    endDate: draft.endDate,
    targetValue: targetVal !== null && !isNaN(targetVal) ? targetVal : null,
    currentValue: currentVal !== null && !isNaN(currentVal) ? currentVal : null,
    unit: draft.unit.trim(),
    progressMode: draft.progressMode,
    manualProgress: Math.min(100, Math.max(0, draft.manualProgress || 0)),
    milestones: draft.milestones
      .filter((m) => m.title && m.title.trim().length > 0)
      .map((m) => ({
        id: m.id || createId(),
        title: m.title.trim(),
        completed: Boolean(m.completed),
      })),
    reminder: {
      enabled: draft.reminder.enabled,
      option: draft.reminder.option,
      customDate: draft.reminder.customDate || '',
      time: draft.reminder.time || '09:00',
      remindMilestones: Boolean(draft.reminder.remindMilestones),
    },
  }
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals())
  const [notificationPermission, setNotificationPermission] = useState(
    getNotificationPermission(),
  )

  const persist = useCallback((nextGoals: Goal[]) => {
    setGoals(nextGoals)
    saveGoals(nextGoals)
  }, [])

  // Check reminders on mount and every 30 seconds while the app is active
  useEffect(() => {
    checkAndDispatchGoalReminders(goals)
    const interval = setInterval(() => {
      checkAndDispatchGoalReminders(goals)
    }, 30000)

    return () => clearInterval(interval)
  }, [goals])

  const requestPermission = useCallback(async () => {
    const perm = await requestNotificationPermission()
    setNotificationPermission(perm)
    return perm
  }, [])

  const addGoal = useCallback(
    (draft: GoalDraft): Goal => {
      const now = new Date().toISOString()
      const newGoal: Goal = {
        id: createId(),
        ...toStoredGoalFields(draft),
        completed: false,
        isPaused: false,
        createdAt: now,
        updatedAt: now,
      }

      const nextGoals = [newGoal, ...goals]
      persist(nextGoals)
      return newGoal
    },
    [goals, persist],
  )

  const updateGoal = useCallback(
    (id: string, draft: GoalDraft) => {
      const now = new Date().toISOString()
      const nextGoals = goals.map((goal) => {
        if (goal.id !== id) return goal
        return {
          ...goal,
          ...toStoredGoalFields(draft),
          updatedAt: now,
        }
      })
      persist(nextGoals)
    },
    [goals, persist],
  )

  const deleteGoal = useCallback(
    (id: string) => {
      const nextGoals = goals.filter((g) => g.id !== id)
      persist(nextGoals)
    },
    [goals, persist],
  )

  const toggleComplete = useCallback(
    (id: string) => {
      const now = new Date().toISOString()
      const nextGoals = goals.map((goal) => {
        if (goal.id !== id) return goal
        const nextCompleted = !goal.completed
        return {
          ...goal,
          completed: nextCompleted,
          // If marking completed and was paused, unpause
          isPaused: nextCompleted ? false : goal.isPaused,
          updatedAt: now,
        }
      })
      persist(nextGoals)
    },
    [goals, persist],
  )

  const togglePause = useCallback(
    (id: string) => {
      const now = new Date().toISOString()
      const nextGoals = goals.map((goal) => {
        if (goal.id !== id) return goal
        return {
          ...goal,
          isPaused: !goal.isPaused,
          updatedAt: now,
        }
      })
      persist(nextGoals)
    },
    [goals, persist],
  )

  const updateGoalProgress = useCallback(
    (
      id: string,
      updates: {
        currentValue?: number | null
        manualProgress?: number
        completed?: boolean
      },
    ) => {
      const now = new Date().toISOString()
      const nextGoals = goals.map((goal) => {
        if (goal.id !== id) return goal
        return {
          ...goal,
          ...(updates.currentValue !== undefined
            ? { currentValue: updates.currentValue }
            : {}),
          ...(updates.manualProgress !== undefined
            ? { manualProgress: updates.manualProgress }
            : {}),
          ...(updates.completed !== undefined
            ? { completed: updates.completed }
            : {}),
          updatedAt: now,
        }
      })
      persist(nextGoals)
    },
    [goals, persist],
  )

  const toggleMilestone = useCallback(
    (goalId: string, milestoneId: string) => {
      const now = new Date().toISOString()
      const nextGoals = goals.map((goal) => {
        if (goal.id !== goalId) return goal
        const updatedMilestones = goal.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m,
        )
        return {
          ...goal,
          milestones: updatedMilestones,
          updatedAt: now,
        }
      })
      persist(nextGoals)
    },
    [goals, persist],
  )

  const addMilestone = useCallback(
    (goalId: string, title: string) => {
      if (!title.trim()) return
      const now = new Date().toISOString()
      const nextGoals = goals.map((goal) => {
        if (goal.id !== goalId) return goal
        const newMilestone = {
          id: createId(),
          title: title.trim(),
          completed: false,
        }
        return {
          ...goal,
          milestones: [...goal.milestones, newMilestone],
          updatedAt: now,
        }
      })
      persist(nextGoals)
    },
    [goals, persist],
  )

  const editMilestone = useCallback(
    (goalId: string, milestoneId: string, title: string) => {
      if (!title.trim()) return
      const now = new Date().toISOString()
      const nextGoals = goals.map((goal) => {
        if (goal.id !== goalId) return goal
        return {
          ...goal,
          milestones: goal.milestones.map((m) =>
            m.id === milestoneId ? { ...m, title: title.trim() } : m,
          ),
          updatedAt: now,
        }
      })
      persist(nextGoals)
    },
    [goals, persist],
  )

  const deleteMilestone = useCallback(
    (goalId: string, milestoneId: string) => {
      const now = new Date().toISOString()
      const nextGoals = goals.map((goal) => {
        if (goal.id !== goalId) return goal
        return {
          ...goal,
          milestones: goal.milestones.filter((m) => m.id !== milestoneId),
          updatedAt: now,
        }
      })
      persist(nextGoals)
    },
    [goals, persist],
  )

  return {
    goals,
    notificationPermission,
    requestPermission,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleComplete,
    togglePause,
    updateGoalProgress,
    toggleMilestone,
    addMilestone,
    editMilestone,
    deleteMilestone,
  }
}
