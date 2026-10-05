import { Check } from 'lucide-react'
import { formatDueDate, isTaskOverdue } from '../tasks/dates'
import { CATEGORY_LABELS, PRIORITY_LABELS, RECURRENCE_LABELS } from '../tasks/labels'
import type { Task } from '../tasks/types'

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const overdue = isTaskOverdue(task)
  const className = [
    'neu-task-widget',
    task.completed ? 'is-completed' : '',
    overdue ? 'is-overdue' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={className}>
      <label className="neu-checkbox-wrap">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="neu-checkbox-custom" aria-hidden="true">
          {task.completed ? <Check size={13} strokeWidth={3} /> : null}
        </span>
      </label>

      <div className="task-body">
        <div className="task-top">
          <h3 className="task-item-title">{task.title}</h3>
          <div className="task-actions">
            <button
              type="button"
              className="neu-pill-btn text-btn-sm"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
            >
              Edit
            </button>
            <button
              type="button"
              className="neu-pill-btn text-btn-sm danger"
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
            >
              Delete
            </button>
          </div>
        </div>

        {task.description ? (
          <p className="task-description">{task.description}</p>
        ) : null}

        <div className="task-meta">
          <span className={`neu-meta-pill ${overdue ? 'pill-overdue' : ''}`}>
            {formatDueDate(task.dueDate, task.dueTime)}
          </span>
          <span className={`neu-meta-pill priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="neu-meta-pill category-pill-tag">
            {CATEGORY_LABELS[task.category]}
          </span>
          {task.recurrence !== 'none' ? (
            <span className="neu-meta-pill recurring">
              Repeats {RECURRENCE_LABELS[task.recurrence].toLowerCase()}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
