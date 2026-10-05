import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import {
  calculateGoalProgress,
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

type GoalCardProps = {
  goal: Goal
  onOpenDetails: (goal: Goal) => void
  onOpenProgress: (goal: Goal) => void
  onEdit: (goal: Goal) => void
  onTogglePause: (id: string) => void
  onToggleComplete: (id: string) => void
  onDelete: (goal: Goal) => void
}

export function GoalCard({
  goal,
  onOpenDetails,
  onOpenProgress,
  onEdit,
  onTogglePause,
  onToggleComplete,
  onDelete,
}: GoalCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const progress = calculateGoalProgress(goal)
  const durationInfo = getGoalDurationInfo(goal)
  const statusConfig = STATUS_DETAILS[durationInfo.statusType]
  const categoryConfig = CATEGORY_DETAILS[goal.category] || CATEGORY_DETAILS.Other
  const priorityConfig = PRIORITY_DETAILS[goal.priority]

  const isOverdue = durationInfo.statusType === 'overdue'
  const isCompleted = durationInfo.statusType === 'completed'
  const isPaused = durationInfo.statusType === 'paused'

  const completedMilestones = goal.milestones.filter((m) => m.completed).length
  const totalMilestones = goal.milestones.length

  const cardClasses = [
    'neu-goal-card',
    isOverdue ? 'is-overdue' : '',
    isCompleted ? 'is-completed' : '',
    isPaused ? 'is-paused' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClasses}>
      {isOverdue ? (
        <div className="goal-overdue-banner" role="alert">
          <span className="overdue-icon">⚠️</span>
          <span>
            <strong>Overdue:</strong> {durationInfo.overdueDays}{' '}
            {durationInfo.overdueDays === 1 ? 'day' : 'days'} past deadline.
          </span>
        </div>
      ) : null}

      <div className="goal-card-top">
        <div className="goal-title-group" onClick={() => onOpenDetails(goal)}>
          <span
            className="neu-category-tag"
            style={{
              backgroundColor: categoryConfig.bg,
              color: categoryConfig.color,
            }}
          >
            <span className="category-emoji">{categoryConfig.icon}</span>
            <span>{goal.category}</span>
          </span>
          <h3 className="goal-card-title">{goal.title}</h3>
        </div>

        <div className="goal-badges-group">
          <span
            className={`neu-priority-chip priority-${goal.priority}`}
            title={`Priority: ${priorityConfig.label}`}
          >
            {priorityConfig.label}
          </span>
          <span
            className={`neu-status-pill ${statusConfig.badgeClass || ''}`}
            style={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
            }}
          >
            <span className="status-dot" aria-hidden="true" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {goal.description ? (
        <p className="goal-description" onClick={() => onOpenDetails(goal)}>
          {goal.description}
        </p>
      ) : null}

      <div className="goal-progress-section" onClick={() => onOpenProgress(goal)}>
        <div className="goal-progress-numbers">
          <span className="progress-label">Progress</span>
          <span className="progress-percent-val">{progress}%</span>
        </div>
        <div className="neu-track-inset" aria-hidden="true">
          <div
            className={`neu-progress-fill-bar ${isCompleted ? 'fill-completed' : isOverdue ? 'fill-overdue' : 'fill-default'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {goal.progressMode === 'target' && goal.targetValue ? (
          <p className="target-units-copy">
            {goal.currentValue ?? 0} / {goal.targetValue} {goal.unit || 'units'}
          </p>
        ) : null}
      </div>

      <div className="goal-meta-grid neu-inset-well-sm" onClick={() => onOpenDetails(goal)}>
        <div className="meta-row">
          <span className="meta-icon" aria-hidden="true">
            📅
          </span>
          <span className="meta-text">
            {formatGoalDateRange(goal.startDate, goal.endDate)}
          </span>
        </div>

        <div className="meta-row">
          <span className="meta-icon" aria-hidden="true">
            {isOverdue ? '⚠️' : isCompleted ? '🏆' : '⏳'}
          </span>
          <span className={`meta-text ${isOverdue ? 'text-overdue' : ''}`}>
            {durationInfo.statusText}
          </span>
        </div>

        {totalMilestones > 0 ? (
          <div className="meta-row">
            <span className="meta-icon" aria-hidden="true">
              ☑️
            </span>
            <span className="meta-text">
              Milestones: {completedMilestones} / {totalMilestones}
            </span>
          </div>
        ) : null}

        {goal.reminder.enabled && goal.reminder.option !== 'none' ? (
          <div className="meta-row reminder-row">
            <span className="meta-icon" aria-hidden="true">
              🔔
            </span>
            <span className="meta-text">
              Reminder: {REMINDER_LABELS[goal.reminder.option]}
              {goal.reminder.time ? ` (${goal.reminder.time})` : ''}
            </span>
          </div>
        ) : null}
      </div>

      <div className="goal-card-actions">
        <button
          type="button"
          className="neu-pill-btn secondary btn-sm"
          onClick={() => onOpenProgress(goal)}
        >
          Update
        </button>

        <button
          type="button"
          className="neu-pill-btn ghost btn-sm"
          onClick={() => onOpenDetails(goal)}
        >
          Details
        </button>

        <button
          type="button"
          className="neu-pill-btn ghost btn-sm"
          onClick={() => onEdit(goal)}
        >
          Edit
        </button>

        <div className="more-actions-wrap">
          <button
            type="button"
            className="neu-icon-btn btn-sm"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="More actions"
            aria-expanded={menuOpen}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen ? (
            <div className="card-dropdown-menu neu-card-raised" role="menu">
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(false)
                  onToggleComplete(goal.id)
                }}
              >
                {isCompleted ? '↩ Mark Incomplete' : '✓ Mark Completed'}
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(false)
                  onTogglePause(goal.id)
                }}
              >
                {isPaused ? '▶ Resume Goal' : '⏸ Pause Goal'}
              </button>
              <button
                type="button"
                className="dropdown-item danger"
                onClick={() => {
                  setMenuOpen(false)
                  onDelete(goal)
                }}
              >
                🗑 Delete Goal
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
