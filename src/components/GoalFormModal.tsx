import { useState, type FormEvent } from 'react'
import { localDateKey } from '../goals/dates'
import {
  CATEGORY_DETAILS,
  PRIORITY_DETAILS,
  REMINDER_LABELS,
} from '../goals/labels'
import {
  getNotificationPermission,
  isNotificationSupported,
  requestNotificationPermission,
} from '../goals/notifications'
import {
  GOAL_CATEGORIES,
  GOAL_PRIORITIES,
  REMINDER_OPTIONS,
  type Goal,
  type GoalCategory,
  type GoalDraft,
  type GoalPriority,
  type ReminderOption,
} from '../goals/types'
import { Modal } from './Modal'

type GoalFormModalProps = {
  goal?: Goal
  onSave: (draft: GoalDraft) => void
  onClose: () => void
}

function defaultDraft(goal?: Goal): GoalDraft {
  const today = localDateKey()
  // Default end date to 30 days from today
  const defaultEnd = new Date()
  defaultEnd.setDate(defaultEnd.getDate() + 30)
  const defaultEndStr = localDateKey(defaultEnd)

  if (goal) {
    return {
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      startDate: goal.startDate,
      endDate: goal.endDate,
      targetValue:
        goal.targetValue !== null && goal.targetValue !== undefined
          ? String(goal.targetValue)
          : '',
      currentValue:
        goal.currentValue !== null && goal.currentValue !== undefined
          ? String(goal.currentValue)
          : '',
      unit: goal.unit,
      progressMode: goal.progressMode,
      manualProgress: goal.manualProgress,
      milestones: goal.milestones.map((m) => ({ ...m })),
      reminder: {
        enabled: goal.reminder.enabled,
        option: goal.reminder.option,
        customDate: goal.reminder.customDate || '',
        time: goal.reminder.time || '09:00',
        remindMilestones: Boolean(goal.reminder.remindMilestones),
      },
    }
  }

  return {
    title: '',
    description: '',
    category: 'Learning',
    priority: 'medium',
    startDate: today,
    endDate: defaultEndStr,
    targetValue: '',
    currentValue: '',
    unit: '',
    progressMode: 'target',
    manualProgress: 0,
    milestones: [],
    reminder: {
      enabled: false,
      option: '1_day_before',
      customDate: '',
      time: '09:00',
      remindMilestones: false,
    },
  }
}

export function GoalFormModal({ goal, onSave, onClose }: GoalFormModalProps) {
  const [draft, setDraft] = useState<GoalDraft>(() => defaultDraft(goal))
  const [newMilestoneText, setNewMilestoneText] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notifPermission, setNotifPermission] = useState(getNotificationPermission())

  const notifSupported = isNotificationSupported()

  async function handleEnableReminders(enabled: boolean) {
    if (enabled && notifSupported && notifPermission !== 'granted') {
      const result = await requestNotificationPermission()
      setNotifPermission(result)
    }

    setDraft((prev) => ({
      ...prev,
      reminder: {
        ...prev.reminder,
        enabled,
      },
    }))
  }

  function handleAddMilestone() {
    if (!newMilestoneText.trim()) return
    setDraft((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          id: `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          title: newMilestoneText.trim(),
          completed: false,
        },
      ],
    }))
    setNewMilestoneText('')
  }

  function handleRemoveMilestone(index: number) {
    setDraft((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }))
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {}

    if (!draft.title.trim()) {
      nextErrors.title = 'Goal title cannot be empty.'
    }

    if (!draft.startDate) {
      nextErrors.startDate = 'Start date cannot be empty.'
    }

    if (!draft.endDate) {
      nextErrors.endDate = 'End date cannot be empty.'
    }

    if (draft.startDate && draft.endDate && draft.endDate < draft.startDate) {
      nextErrors.endDate = 'End date cannot be before start date.'
    }

    if (draft.progressMode === 'target') {
      if (draft.targetValue.trim()) {
        const targetNum = Number(draft.targetValue)
        if (isNaN(targetNum) || targetNum <= 0) {
          nextErrors.targetValue = 'Target value must be a valid positive number.'
        }

        if (draft.currentValue.trim()) {
          const currentNum = Number(draft.currentValue)
          if (isNaN(currentNum) || currentNum < 0) {
            nextErrors.currentValue = 'Current value must be a valid non-negative number.'
          } else if (!isNaN(targetNum) && currentNum > targetNum) {
            nextErrors.currentValue = 'Current value cannot be greater than target value.'
          }
        }
      } else if (draft.currentValue.trim()) {
        nextErrors.targetValue = 'Please specify a target value when providing current value.'
      }
    }

    if (
      draft.reminder.enabled &&
      draft.reminder.option === 'custom' &&
      !draft.reminder.customDate
    ) {
      nextErrors.customReminderDate = 'Please select a custom reminder date.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) {
      return
    }

    onSave(draft)
  }

  return (
    <Modal title={goal ? 'Edit Goal' : 'Create Goal'} onClose={onClose}>
      <form className="task-form goal-form" onSubmit={handleSubmit} noValidate>
        {Object.keys(errors).length > 0 ? (
          <div className="form-error-banner" role="alert">
            <p>Please fix the errors below before saving:</p>
            <ul>
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <label>
          Goal Title <span className="required-star">*</span>
          <input
            type="text"
            className="neu-input-inset"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g., Learn Java, Run a Marathon, Save $5,000"
            autoFocus
            aria-invalid={!!errors.title}
          />
          {errors.title ? <span className="field-error">{errors.title}</span> : null}
        </label>

        <div className="form-row">
          <label>
            Category
            <select
              className="neu-select-inset"
              value={draft.category}
              onChange={(e) =>
                setDraft({ ...draft, category: e.target.value as GoalCategory })
              }
            >
              {GOAL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_DETAILS[cat].icon} {cat}
                </option>
              ))}
            </select>
          </label>

          <label>
            Priority
            <select
              className="neu-select-inset"
              value={draft.priority}
              onChange={(e) =>
                setDraft({ ...draft, priority: e.target.value as GoalPriority })
              }
            >
              {GOAL_PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {PRIORITY_DETAILS[pri].label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Description
          <textarea
            className="neu-input-inset"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Why does this goal matter to you? Add key details, resources, or motivation."
            rows={2}
          />
        </label>

        <div className="form-row">
          <label>
            Start Date <span className="required-star">*</span>
            <input
              type="date"
              className="neu-input-inset"
              value={draft.startDate}
              onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
              aria-invalid={!!errors.startDate}
            />
            {errors.startDate ? (
              <span className="field-error">{errors.startDate}</span>
            ) : null}
          </label>

          <label>
            End Date <span className="required-star">*</span>
            <input
              type="date"
              className="neu-input-inset"
              value={draft.endDate}
              onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
              aria-invalid={!!errors.endDate}
            />
            {errors.endDate ? (
              <span className="field-error">{errors.endDate}</span>
            ) : null}
          </label>
        </div>

        <div className="form-fieldset">
          <span className="fieldset-title">Progress Tracking Method</span>
          <div className="progress-mode-selector" role="radiogroup" aria-label="Progress Mode">
            <button
              type="button"
              className={`mode-btn ${draft.progressMode === 'target' ? 'active' : ''}`}
              onClick={() => setDraft({ ...draft, progressMode: 'target' })}
            >
              <strong>Target & Unit</strong>
              <span>e.g., 25 / 100 Hours</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${draft.progressMode === 'milestones' ? 'active' : ''}`}
              onClick={() => setDraft({ ...draft, progressMode: 'milestones' })}
            >
              <strong>Milestones</strong>
              <span>Derived from checklist</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${draft.progressMode === 'manual' ? 'active' : ''}`}
              onClick={() => setDraft({ ...draft, progressMode: 'manual' })}
            >
              <strong>Manual %</strong>
              <span>0% to 100% slider</span>
            </button>
          </div>
        </div>

        {draft.progressMode === 'target' ? (
          <div className="target-fields-grid">
            <label>
              Target Value
              <input
                type="number"
                className="neu-input-inset"
                min="1"
                step="any"
                value={draft.targetValue}
                onChange={(e) => setDraft({ ...draft, targetValue: e.target.value })}
                placeholder="e.g., 100"
                aria-invalid={!!errors.targetValue}
              />
              {errors.targetValue ? (
                <span className="field-error">{errors.targetValue}</span>
              ) : null}
            </label>

            <label>
              Current Value
              <input
                type="number"
                className="neu-input-inset"
                min="0"
                step="any"
                value={draft.currentValue}
                onChange={(e) => setDraft({ ...draft, currentValue: e.target.value })}
                placeholder="e.g., 25"
                aria-invalid={!!errors.currentValue}
              />
              {errors.currentValue ? (
                <span className="field-error">{errors.currentValue}</span>
              ) : null}
            </label>

            <label>
              Unit
              <input
                type="text"
                className="neu-input-inset"
                value={draft.unit}
                onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                placeholder="e.g., Hours, Books, km, $"
              />
            </label>
          </div>
        ) : null}

        {draft.progressMode === 'manual' ? (
          <label>
            Initial Progress: {draft.manualProgress}%
            <input
              type="range"
              min="0"
              max="100"
              value={draft.manualProgress}
              onChange={(e) =>
                setDraft({ ...draft, manualProgress: Number(e.target.value) })
              }
            />
          </label>
        ) : null}

        <div className="form-fieldset">
          <span className="fieldset-title">Milestones (Optional)</span>
          <p className="fieldset-desc">
            Break this goal down into tangible stepping stones.
          </p>

          <div className="add-milestone-form">
            <input
              type="text"
              value={newMilestoneText}
              onChange={(e) => setNewMilestoneText(e.target.value)}
              placeholder="e.g., Learn Linux, Finish chapter 1..."
              className="add-milestone-input neu-input-inset"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddMilestone()
                }
              }}
            />
            <button
              type="button"
              className="button-secondary neu-btn neu-btn-secondary add-milestone-btn"
              onClick={handleAddMilestone}
              disabled={!newMilestoneText.trim()}
            >
              + Add
            </button>
          </div>

          {draft.milestones.length > 0 ? (
            <ul className="draft-milestones-list">
              {draft.milestones.map((m, idx) => (
                <li key={idx} className="draft-milestone-row">
                  <span>{m.title}</span>
                  <button
                    type="button"
                    className="text-button danger"
                    onClick={() => handleRemoveMilestone(idx)}
                    aria-label={`Remove milestone ${m.title}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="form-fieldset">
          <div className="reminder-toggle-row">
            <div>
              <span className="fieldset-title">Goal Reminders & Notifications</span>
              <p className="fieldset-desc">
                Get browser reminders on start date or approaching deadlines.
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={draft.reminder.enabled}
                onChange={(e) => handleEnableReminders(e.target.checked)}
              />
              <span className="toggle-slider" aria-hidden="true" />
            </label>
          </div>

          {draft.reminder.enabled ? (
            <div className="reminder-details-fields">
              <div className="form-row">
                <label>
                  Reminder Schedule
                  <select
                    className="neu-select-inset"
                    value={draft.reminder.option}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        reminder: {
                          ...draft.reminder,
                          option: e.target.value as ReminderOption,
                        },
                      })
                    }
                  >
                    {REMINDER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {REMINDER_LABELS[opt]}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Reminder Time
                  <input
                    type="time"
                    className="neu-input-inset"
                    value={draft.reminder.time}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        reminder: {
                          ...draft.reminder,
                          time: e.target.value,
                        },
                      })
                    }
                  />
                </label>
              </div>

              {draft.reminder.option === 'custom' ? (
                <label>
                  Custom Reminder Date
                  <input
                    type="date"
                    className="neu-input-inset"
                    value={draft.reminder.customDate || ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        reminder: {
                          ...draft.reminder,
                          customDate: e.target.value,
                        },
                      })
                    }
                    aria-invalid={!!errors.customReminderDate}
                  />
                  {errors.customReminderDate ? (
                    <span className="field-error">{errors.customReminderDate}</span>
                  ) : null}
                </label>
              ) : null}

              <label className="checkbox-row-label">
                <input
                  type="checkbox"
                  checked={draft.reminder.remindMilestones}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      reminder: {
                        ...draft.reminder,
                        remindMilestones: e.target.checked,
                      },
                    })
                  }
                />
                <span>Include reminder for pending milestones</span>
              </label>

              {notifSupported && notifPermission !== 'granted' ? (
                <div className="notification-warning-box">
                  <p>
                    <strong>Browser permission required:</strong> Notifications are{' '}
                    {notifPermission === 'denied' ? 'blocked' : 'not yet enabled'}.
                  </p>
                  {notifPermission === 'denied' ? (
                    <p className="notif-hint">
                      Please allow notifications in your browser's site settings or address bar icon.
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="button-secondary neu-btn neu-btn-secondary btn-sm"
                      onClick={async () => {
                        const res = await requestNotificationPermission()
                        setNotifPermission(res)
                      }}
                    >
                      Grant Notification Permission
                    </button>
                  )}
                </div>
              ) : !notifSupported ? (
                <div className="notification-warning-box">
                  <p>
                    Browser Notification API is not supported in this browser environment.
                  </p>
                </div>
              ) : null}

              <p className="notification-limitation-note">
                ℹ️ <strong>Client-side note:</strong> Since this app runs purely in your browser
                with local storage and no backend server, reminders are triggered while this tab or
                browser session is open.
              </p>
            </div>
          ) : null}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="button-secondary neu-btn neu-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button-primary neu-btn neu-btn-primary"
          >
            {goal ? 'Save Changes' : 'Create Goal'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
