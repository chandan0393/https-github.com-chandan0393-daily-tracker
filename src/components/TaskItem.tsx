import { Check, Calendar } from 'lucide-react'
import { formatDueDate, isTaskOverdue } from '../tasks/dates'
import { CATEGORY_LABELS, PRIORITY_LABELS } from '../tasks/labels'
import type { Task } from '../tasks/types'

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const PRIORITY_EMOJIS = {
  high: '🟠',
  medium: '🟡',
  low: '🟢',
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const overdue = isTaskOverdue(task)

  return (
    <article className={`fun-card task-card ${task.completed ? 'is-completed' : ''} ${overdue ? 'is-overdue' : ''}`}>
      <label className="fun-checkbox-label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="sr-only"
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className={`fun-checkbox-custom ${task.completed ? 'checked' : ''}`}>
          {task.completed ? <Check size={14} strokeWidth={3.5} className="check-icon-bounce" /> : null}
        </span>
      </label>

      <div className="task-card-content">
        <div className="task-card-header">
          <h3 className="task-title-text">{task.title}</h3>
          <div className="task-action-buttons">
            <button
              type="button"
              className="fun-mini-btn"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
            >
              Edit
            </button>
            <button
              type="button"
              className="fun-mini-btn danger"
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
            >
              ✕
            </button>
          </div>
        </div>

        {task.description ? (
          <p className="task-desc-text">{task.description}</p>
        ) : null}

        <div className="task-tags-row">
          {task.dueDate ? (
            <span className={`task-tag due-tag ${overdue ? 'tag-overdue' : ''}`}>
              <Calendar size={12} /> {formatDueDate(task.dueDate, task.dueTime)}
            </span>
          ) : null}

          <span className={`task-tag priority-tag priority-${task.priority}`}>
            <span>{PRIORITY_EMOJIS[task.priority]}</span>
            <span>{PRIORITY_LABELS[task.priority]}</span>
          </span>

          <span className="task-tag category-tag">
            {CATEGORY_LABELS[task.category]}
          </span>
        </div>
      </div>
    </article>
  )
}
