import { useCallback, useState } from 'react'
import { loadTasks, saveTasks } from '../tasks/storage'
import type { Task, TaskDraft } from '../tasks/types'

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function toStoredFields(draft: TaskDraft) {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    dueDate: draft.dueDate || null,
    dueTime: draft.dueDate && draft.dueTime ? draft.dueTime : null,
    priority: draft.priority,
    category: draft.category,
    recurrence: draft.recurrence,
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  const persist = useCallback((nextTasks: Task[]) => {
    setTasks(nextTasks)
    saveTasks(nextTasks)
  }, [])

  const addTask = useCallback(
    (draft: TaskDraft) => {
      const now = new Date().toISOString()
      const task: Task = {
        id: createId(),
        ...toStoredFields(draft),
        completed: false,
        createdAt: now,
        updatedAt: now,
      }
      persist([task, ...tasks])
    },
    [persist, tasks],
  )

  const updateTask = useCallback(
    (id: string, draft: TaskDraft) => {
      const now = new Date().toISOString()
      persist(
        tasks.map((task) =>
          task.id === id
            ? { ...task, ...toStoredFields(draft), updatedAt: now }
            : task,
        ),
      )
    },
    [persist, tasks],
  )

  const toggleTask = useCallback(
    (id: string) => {
      const now = new Date().toISOString()
      persist(
        tasks.map((task) =>
          task.id === id
            ? { ...task, completed: !task.completed, updatedAt: now }
            : task,
        ),
      )
    },
    [persist, tasks],
  )

  const deleteTask = useCallback(
    (id: string) => {
      persist(tasks.filter((task) => task.id !== id))
    },
    [persist, tasks],
  )

  return { tasks, addTask, updateTask, toggleTask, deleteTask }
}
