import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PageHeader } from '../components/PageHeader'
import { TaskFormModal } from '../components/TaskFormModal'
import { TaskItem } from '../components/TaskItem'
import { useTasks } from '../hooks/useTasks'
import {
  getTaskStats,
  getTodayProgress,
  matchesFilter,
  matchesSearch,
  sortTasks,
} from '../tasks/dates'
import type { Task, TaskDraft, TaskFilter, TaskSort } from '../tasks/types'
import { TASK_FILTERS } from '../tasks/types'

const FILTER_LABELS: Record<TaskFilter, string> = {
  all: 'All',
  today: 'Today',
  upcoming: 'Upcoming',
  completed: 'Completed',
  pending: 'Pending',
  overdue: 'Overdue',
}

export function Tasks() {
  const { tasks, addTask, updateTask, toggleTask, deleteTask } = useTasks()
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [sort, setSort] = useState<TaskSort>('dueDate')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>()

  const stats = useMemo(() => getTaskStats(tasks), [tasks])
  const todayProgress = useMemo(() => getTodayProgress(tasks), [tasks])
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

  const emptyBecauseFilter = tasks.length > 0 && visibleTasks.length === 0

  return (
    <section className="page tasks-page">
      <div className="page-toolbar">
        <PageHeader
          title="To-Do Tasks"
          subtitle="Capture tasks, stay on schedule, and check things off mindfully."
        />
        <button
          type="button"
          className="neu-pill-btn primary add-task-button"
          onClick={openAddForm}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="stats-grid tasks-stats-grid">
        <article className="stat-card">
          <h2>Total Tasks</h2>
          <p className="card-value">{stats.total}</p>
        </article>
        <article className="stat-card">
          <h2>Completed</h2>
          <p className="card-value stat-value-completed">{stats.completed}</p>
        </article>
        <article className="stat-card">
          <h2>Pending</h2>
          <p className="card-value stat-value-active">{stats.pending}</p>
        </article>
        <article className="stat-card">
          <h2>Overdue</h2>
          <p className="card-value stat-value-overdue">{stats.overdue}</p>
        </article>
      </div>

      <article className="neu-widget-card tasks-progress-card">
        <div className="progress-copy">
          <h2>Today's Progress</h2>
          <p>
            {todayProgress.completed} / {todayProgress.total} completed
          </p>
        </div>
        <div className="neu-track-inset" aria-hidden="true">
          <div
            className="neu-fill-pastel-green"
            style={{ width: `${todayProgress.percent}%` }}
          />
        </div>
        <p className="progress-percent">{todayProgress.percent}%</p>
      </article>

      <div className="task-controls">
        <input
          className="search-input neu-input-inset"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
        <label className="sort-label">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as TaskSort)}
            className="neu-select-inset"
          >
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Recently created</option>
          </select>
        </label>
      </div>

      <div className="filter-row" role="tablist" aria-label="Task filters">
        {TASK_FILTERS.map((id) => (
          <button
            key={id}
            type="button"
            className={filter === id ? 'neu-filter-chip active' : 'neu-filter-chip'}
            onClick={() => setFilter(id)}
          >
            {FILTER_LABELS[id]}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state neu-card">
          <div className="empty-state-icon" aria-hidden="true">
            🌱
          </div>
          <h2>No tasks yet</h2>
          <p>Add your first task and enjoy the satisfaction of checking it off.</p>
          <button
            type="button"
            className="neu-pill-btn primary"
            onClick={openAddForm}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Task</span>
          </button>
        </div>
      ) : emptyBecauseFilter ? (
        <div className="empty-state neu-card">
          <h2>No matching tasks</h2>
          <p>Try a different filter or search.</p>
          <button
            type="button"
            className="neu-pill-btn secondary"
            onClick={() => {
              setFilter('all')
              setQuery('')
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="task-list">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onEdit={(selected) => {
                setEditingTask(selected)
                setFormOpen(true)
              }}
              onDelete={setTaskToDelete}
            />
          ))}
        </div>
      )}

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
          message="Are you sure you want to delete this task?"
          onCancel={() => setTaskToDelete(undefined)}
          onConfirm={() => {
            deleteTask(taskToDelete.id)
            setTaskToDelete(undefined)
          }}
        />
      ) : null}
    </section>
  )
}
