import { Plus, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PageHeader } from '../components/PageHeader'
import { TaskFormModal } from '../components/TaskFormModal'
import { TaskItem } from '../components/TaskItem'
import { useTasks } from '../hooks/useTasks'
import {
  getTaskStats,
  matchesFilter,
  matchesSearch,
  sortTasks,
} from '../tasks/dates'
import type { Task, TaskDraft, TaskFilter, TaskSort } from '../tasks/types'

const FILTER_OPTIONS: { id: TaskFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
]

export function Tasks() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask } = useTasks()
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [sort, setSort] = useState<TaskSort>('dueDate')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>()

  const stats = useMemo(() => getTaskStats(tasks), [tasks])
  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter(
      (task) => matchesFilter(task, filter) && matchesSearch(task, query),
    )
    return sortTasks(filtered, sort)
  }, [tasks, filter, query, sort])

  function openAddForm() {
    setEditingTask(undefined)
    setFormOpen(true)
  }

  function handleSave(draft: TaskDraft) {
    if (editingTask) {
      updateTask(editingTask.id, draft)
    } else {
      addTask(draft)
    }
    setFormOpen(false)
    setEditingTask(undefined)
  }

  return (
    <section className="page tasks-page">
      <div className="page-toolbar">
        <PageHeader
          title="My Tasks"
          subtitle="Get things done, level up your day, and check off your missions! ⚡"
        />
        <button
          type="button"
          className="fun-btn fun-btn-primary add-task-hero-btn"
          onClick={openAddForm}
        >
          <Sparkles size={18} />
          <span>+ Add Task</span>
        </button>
      </div>

      {/* Task Filters & Search Row */}
      <div className="tasks-controls-card fun-card">
        <div className="tasks-filter-pills">
          {FILTER_OPTIONS.map((f) => {
            const count =
              f.id === 'all'
                ? stats.total
                : f.id === 'completed'
                ? stats.completed
                : f.id === 'today'
                ? tasks.filter((t) => matchesFilter(t, 'today')).length
                : tasks.filter((t) => matchesFilter(t, 'upcoming')).length

            return (
              <button
                key={f.id}
                type="button"
                className={`filter-pill-btn ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                <span>{f.label}</span>
                <span className="pill-count-badge">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="tasks-search-sort-row">
          <div className="search-box-wrap">
            <Search size={16} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="fun-input search-input"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as TaskSort)}
            className="fun-select sort-select"
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Title</option>
            <option value="createdAt">Sort: Created</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="tasks-list-container">
        {visibleTasks.length === 0 ? (
          <div className="fun-card empty-state-card">
            <span className="empty-state-emoji">🎯</span>
            <h3>No tasks found!</h3>
            <p>
              {tasks.length === 0
                ? 'Your mission board is clear! Ready to plan something cool?'
                : 'No tasks match your selected filter or search.'}
            </p>
            <button
              type="button"
              className="fun-btn fun-btn-primary"
              onClick={openAddForm}
            >
              <Plus size={16} />
              <span>Create a Task</span>
            </button>
          </div>
        ) : (
          <div className="task-cards-column">
            {visibleTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={(t) => {
                  setEditingTask(t)
                  setFormOpen(true)
                }}
                onDelete={(t) => setTaskToDelete(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {formOpen ? (
        <TaskFormModal
          task={editingTask}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false)
            setEditingTask(undefined)
          }}
        />
      ) : null}

      {taskToDelete ? (
        <ConfirmDialog
          message={`Are you sure you want to delete "${taskToDelete.title}"?`}
          confirmLabel="Delete Task"
          onConfirm={() => {
            deleteTask(taskToDelete.id)
            setTaskToDelete(undefined)
          }}
          onCancel={() => setTaskToDelete(undefined)}
        />
      ) : null}
    </section>
  )
}
