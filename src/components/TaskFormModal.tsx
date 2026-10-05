import { useState, type FormEvent } from 'react'
import { CATEGORY_LABELS, PRIORITY_LABELS, RECURRENCE_LABELS } from '../tasks/labels'
import {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_RECURRENCES,
  type Task,
  type TaskDraft,
} from '../tasks/types'
import { Modal } from './Modal'

type TaskFormModalProps = {
  task?: Task
  onSave: (draft: TaskDraft) => void
  onClose: () => void
}

function draftFromTask(task?: Task): TaskDraft {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    dueDate: task?.dueDate ?? '',
    dueTime: task?.dueTime ?? '',
    priority: task?.priority ?? 'medium',
    category: task?.category ?? 'personal',
    recurrence: task?.recurrence ?? 'none',
  }
}

export function TaskFormModal({ task, onSave, onClose }: TaskFormModalProps) {
  const [draft, setDraft] = useState<TaskDraft>(() => draftFromTask(task))
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.title.trim()) {
      setError('Task title is required.')
      return
    }
    onSave(draft)
  }

  return (
    <Modal title={task ? 'Edit Task' : 'Add New Task'} onClose={onClose}>
      <form className="task-form neu-form" onSubmit={handleSubmit}>
        <label>
          <span className="form-label-text">Task title</span>
          <input
            type="text"
            className="neu-input-inset"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="What needs to be done?"
            autoFocus
          />
        </label>

        <label>
          <span className="form-label-text">Description</span>
          <textarea
            className="neu-input-inset"
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            placeholder="Optional notes or details"
            rows={3}
          />
        </label>

        <div className="form-row">
          <label>
            <span className="form-label-text">Due date</span>
            <input
              type="date"
              className="neu-input-inset"
              value={draft.dueDate}
              onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
            />
          </label>
          <label>
            <span className="form-label-text">Due time</span>
            <input
              type="time"
              className="neu-input-inset"
              value={draft.dueTime}
              onChange={(event) => setDraft({ ...draft, dueTime: event.target.value })}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            <span className="form-label-text">Priority</span>
            <select
              className="neu-select-inset"
              value={draft.priority}
              onChange={(event) =>
                setDraft({ ...draft, priority: event.target.value as TaskDraft['priority'] })
              }
            >
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="form-label-text">Category</span>
            <select
              className="neu-select-inset"
              value={draft.category}
              onChange={(event) =>
                setDraft({ ...draft, category: event.target.value as TaskDraft['category'] })
              }
            >
              {TASK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          <span className="form-label-text">Recurring task</span>
          <select
            className="neu-select-inset"
            value={draft.recurrence}
            onChange={(event) =>
              setDraft({ ...draft, recurrence: event.target.value as TaskDraft['recurrence'] })
            }
          >
            {TASK_RECURRENCES.map((recurrence) => (
              <option key={recurrence} value={recurrence}>
                {RECURRENCE_LABELS[recurrence]}
              </option>
            ))}
          </select>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions">
          <button
            type="button"
            className="neu-pill-btn secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="neu-pill-btn primary"
          >
            {task ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
