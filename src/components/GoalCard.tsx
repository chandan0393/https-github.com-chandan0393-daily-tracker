import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import {
  calculateGoalProgress,
  getGoalDurationInfo,
} from '../goals/dates'
import {
  CATEGORY_DETAILS,
  PRIORITY_DETAILS,
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
  const categoryConfig = CATEGORY_DETAILS[goal.category] || CATEGORY_DETAILS.Other
  const priorityConfig = PRIORITY_DETAILS[goal.priority]

  const isOverdue = durationInfo.statusType === 'overdue'
  const isCompleted = durationInfo.statusType === 'completed'
  const isPaused = durationInfo.statusType === 'paused'

  const completedMilestones = goal.milestones.filter((m) => m.completed).length
  const totalMilestones = goal.milestones.length

  // Friendly motivating message
  const motivationText = isCompleted
    ? 'Goal completed! 🎉'
    : isOverdue
    ? '⚠️ Past deadline! You got this!'
    : progress >= 75
    ? 'Almost there! 🚀'
    : progress >= 40
    ? "You're doing great! 🔥"
    : 'Keep going! 💪'

  return (
    <article className={`fun-card goal-card ${isOverdue ? 'is-overdue' : ''} ${isCompleted ? 'is-completed' : ''}`}>
      {isOverdue ? (
        <div className="goal-overdue-banner">
          <span>⚠️</span>
          <span><strong>Overdue:</strong> {durationInfo.overdueDays} days past deadline</span>
        </div>
      ) : null}

      <div className="goal-card-top">
        <div className="goal-title-group" onClick={() => onOpenDetails(goal)}>
          <span
            className="category-badge-pill"
            style={{ backgroundColor: categoryConfig.bg, color: categoryConfig.color }}
          >
            <span>{categoryConfig.icon}</span>
            <span>{goal.category}</span>
          </span>
          <h3 className="goal-card-title">{goal.title}</h3>
        </div>

        <div className="goal-badges-col">
          <span className={`priority-tag priority-${goal.priority}`}>
            {priorityConfig.label}
          </span>
        </div>
      </div>

      {goal.description ? (
        <p className="goal-card-desc" onClick={() => onOpenDetails(goal)}>
          {goal.description}
        </p>
      ) : null}

      <div className="goal-progress-section" onClick={() => onOpenProgress(goal)}>
        <div className="goal-progress-header">
          <span className="goal-motivation-tag">{motivationText}</span>
          <span className="goal-progress-percent">{progress}%</span>
        </div>

        <div className="fun-progress-track">
          <div
            className={`fun-progress-fill ${isCompleted ? 'fill-completed' : isOverdue ? 'fill-overdue' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="goal-progress-footer">
          <span className="goal-remaining-days">
            {durationInfo.statusType === 'active' && durationInfo.daysRemaining !== undefined
              ? `⏳ ${durationInfo.daysRemaining} days left`
              : durationInfo.statusText}
          </span>
          {totalMilestones > 0 ? (
            <span className="goal-milestones-count">
              ☑️ {completedMilestones}/{totalMilestones} milestones
            </span>
          ) : null}
        </div>
      </div>

      <div className="goal-card-actions">
        <div className="goal-actions-left">
          <button
            type="button"
            className="fun-btn fun-btn-soft btn-sm"
            onClick={() => onOpenProgress(goal)}
          >
            Progress
          </button>
          <button
            type="button"
            className="fun-btn fun-btn-ghost btn-sm"
            onClick={() => onOpenDetails(goal)}
          >
            Details
          </button>
          <button
            type="button"
            className="fun-btn fun-btn-ghost btn-sm"
            onClick={() => onEdit(goal)}
          >
            Edit
          </button>
        </div>

        <div className="more-actions-wrap">
          <button
            type="button"
            className="fun-icon-btn btn-sm"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="More actions"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen ? (
            <div className="fun-dropdown-menu">
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(false)
                  onToggleComplete(goal.id)
                }}
              >
                {isCompleted ? '↩ Reopen Goal' : '✓ Complete Goal'}
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
