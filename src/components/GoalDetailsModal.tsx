import {
  calculateGoalProgress,
  formatGoalDate,
  formatGoalDateRange,
  getGoalDurationInfo,
} from '../goals/dates'
import {
  CATEGORY_DETAILS,
  PRIORITY_DETAILS,
  REMINDER_LABELS,
  STATUS_DETAILS,
} from '../goals/labels'
import type { Goal } from '../goals/types'
import { GoalMilestones } from './GoalMilestones'
import { Modal } from './Modal'

type GoalDetailsModalProps = {
  goal: Goal
  onClose: () => void
  onEdit: (goal: Goal) => void
  onOpenProgress: (goal: Goal) => void
  onTogglePause: (id: string) => void
  onToggleComplete: (id: string) => void
  onDelete: (goal: Goal) => void
  onToggleMilestone: (goalId: string, milestoneId: string) => void
  onAddMilestone: (goalId: string, title: string) => void
  onEditMilestone: (goalId: string, milestoneId: string, title: string) => void
  onDeleteMilestone: (goalId: string, milestoneId: string) => void
}

export function GoalDetailsModal({
  goal,
  onClose,
  onEdit,
  onOpenProgress,
  onTogglePause,
  onToggleComplete,
  onDelete,
  onToggleMilestone,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
}: GoalDetailsModalProps) {
  const progress = calculateGoalProgress(goal)
  const durationInfo = getGoalDurationInfo(goal)
  const statusConfig = STATUS_DETAILS[durationInfo.statusType]
  const categoryConfig = CATEGORY_DETAILS[goal.category] || CATEGORY_DETAILS.Other
  const priorityConfig = PRIORITY_DETAILS[goal.priority]

  const isOverdue = durationInfo.statusType === 'overdue'
  const isCompleted = durationInfo.statusType === 'completed'
  const isPaused = durationInfo.statusType === 'paused'

  const createdFormatted = new Date(goal.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const updatedFormatted = new Date(goal.updatedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <Modal title="Goal Details" onClose={onClose}>
      <div className="goal-details-content">
        {isOverdue ? (
          <div className="goal-overdue-banner neu-well" role="alert">
            <span className="overdue-icon">⚠️</span>
            <span>
              <strong>Overdue:</strong> This goal has passed its deadline of{' '}
              {formatGoalDate(goal.endDate)} by {durationInfo.overdueDays}{' '}
              {durationInfo.overdueDays === 1 ? 'day' : 'days'}.
            </span>
          </div>
        ) : null}

        <div className="details-header-row">
          <div>
            <div className="details-tag-row">
              <span
                className="category-pill"
                style={{
                  backgroundColor: categoryConfig.bg,
                  color: categoryConfig.color,
                }}
              >
                {categoryConfig.icon} {goal.category}
              </span>
              <span className={`meta-chip priority-${goal.priority}`}>
                {priorityConfig.label}
              </span>
              <span
                className={`status-pill ${statusConfig.badgeClass || ''}`}
                style={{
                  backgroundColor: statusConfig.bg,
                  color: statusConfig.color,
                }}
              >
                <span className="status-dot" aria-hidden="true" />
                {statusConfig.label}
              </span>
            </div>
            <h2 className="details-title">{goal.title}</h2>
          </div>
        </div>

        {goal.description ? (
          <div className="details-section neu-panel-inset">
            <h4>Description</h4>
            <p className="details-description">{goal.description}</p>
          </div>
        ) : null}

        <div className="details-section neu-panel-inset">
          <div className="details-progress-header">
            <h4>Progress</h4>
            <span className="details-progress-num">{progress}%</span>
          </div>
          <div className="progress-track neu-progress-track" aria-hidden="true">
            <div
              className={`progress-fill ${isCompleted ? 'fill-completed' : isOverdue ? 'fill-overdue' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {goal.progressMode === 'target' && goal.targetValue ? (
            <p className="details-subcopy">
              Current: <strong>{goal.currentValue ?? 0} {goal.unit}</strong> of{' '}
              <strong>{goal.targetValue} {goal.unit}</strong> target
            </p>
          ) : goal.progressMode === 'milestones' ? (
            <p className="details-subcopy">
              Progress derived from completed milestones.
            </p>
          ) : (
            <p className="details-subcopy">Manual percentage tracking.</p>
          )}
        </div>

        <div className="details-grid">
          <div className="details-item neu-item-card">
            <span className="item-label">Timeline</span>
            <span className="item-value">
              {formatGoalDateRange(goal.startDate, goal.endDate)}
            </span>
          </div>
          <div className="details-item neu-item-card">
            <span className="item-label">Status & Timing</span>
            <span className={`item-value ${isOverdue ? 'text-overdue' : ''}`}>
              {durationInfo.statusText}
            </span>
          </div>
          <div className="details-item neu-item-card">
            <span className="item-label">Total Duration</span>
            <span className="item-value">
              {durationInfo.totalDays} {durationInfo.totalDays === 1 ? 'day' : 'days'}
            </span>
          </div>
          <div className="details-item neu-item-card">
            <span className="item-label">Days Elapsed</span>
            <span className="item-value">
              {durationInfo.daysElapsed} {durationInfo.daysElapsed === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>

        <div className="details-section">
          <GoalMilestones
            milestones={goal.milestones}
            onToggle={(mId) => onToggleMilestone(goal.id, mId)}
            onAdd={(title) => onAddMilestone(goal.id, title)}
            onEdit={(mId, title) => onEditMilestone(goal.id, mId, title)}
            onDelete={(mId) => onDeleteMilestone(goal.id, mId)}
            showAdd={true}
          />
        </div>

        <div className="details-section">
          <h4>Reminder Settings</h4>
          {goal.reminder.enabled && goal.reminder.option !== 'none' ? (
            <div className="reminder-info-card neu-panel-inset">
              <span className="reminder-bell-icon">🔔</span>
              <div>
                <p>
                  <strong>{REMINDER_LABELS[goal.reminder.option]}</strong> at{' '}
                  <strong>{goal.reminder.time || '09:00'}</strong>
                </p>
                {goal.reminder.option === 'custom' && goal.reminder.customDate ? (
                  <p className="reminder-subtext">
                    Custom date: {formatGoalDate(goal.reminder.customDate)}
                  </p>
                ) : null}
                {goal.reminder.remindMilestones ? (
                  <p className="reminder-subtext">
                    Includes pending milestone warnings.
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="details-subcopy">No reminders enabled for this goal.</p>
          )}
        </div>

        <div className="details-meta-footer">
          <span>Created: {createdFormatted}</span>
          <span>Last Updated: {updatedFormatted}</span>
        </div>

        <div className="details-actions-bar">
          <div className="details-primary-actions">
            <button
              type="button"
              className="button-secondary neu-btn neu-btn-secondary"
              onClick={() => {
                onClose()
                onOpenProgress(goal)
              }}
            >
              Update Progress
            </button>
            <button
              type="button"
              className="button-primary neu-btn neu-btn-primary"
              onClick={() => {
                onClose()
                onEdit(goal)
              }}
            >
              Edit Goal
            </button>
          </div>

          <div className="details-secondary-actions">
            <button
              type="button"
              className="neu-btn-pill"
              onClick={() => onToggleComplete(goal.id)}
            >
              {isCompleted ? '↩ Reopen' : '✓ Complete'}
            </button>
            <button
              type="button"
              className="neu-btn-pill"
              onClick={() => onTogglePause(goal.id)}
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              type="button"
              className="neu-btn-pill neu-btn-danger-pill"
              onClick={() => {
                onClose()
                onDelete(goal)
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
