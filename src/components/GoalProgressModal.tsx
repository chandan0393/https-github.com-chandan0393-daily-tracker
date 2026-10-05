import { Check } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { calculateGoalProgress } from '../goals/dates'
import type { Goal } from '../goals/types'
import { Modal } from './Modal'

type GoalProgressModalProps = {
  goal: Goal
  onSave: (updates: {
    currentValue?: number | null
    manualProgress?: number
    completed?: boolean
  }) => void
  onToggleMilestone?: (goalId: string, milestoneId: string) => void
  onClose: () => void
}

export function GoalProgressModal({
  goal,
  onSave,
  onToggleMilestone,
  onClose,
}: GoalProgressModalProps) {
  const [currentVal, setCurrentVal] = useState<string>(
    goal.currentValue !== null && goal.currentValue !== undefined
      ? String(goal.currentValue)
      : '0',
  )
  const [manualProg, setManualProg] = useState<number>(goal.manualProgress || 0)
  const [isCompleted, setIsCompleted] = useState<boolean>(goal.completed)
  const [error, setError] = useState<string>('')

  // Compute preview progress
  let previewProgress = 0
  if (goal.progressMode === 'target' && goal.targetValue && goal.targetValue > 0) {
    const num = Math.max(0, Number(currentVal) || 0)
    previewProgress = Math.min(100, Math.round((num / goal.targetValue) * 100))
  } else if (goal.progressMode === 'milestones' && goal.milestones.length > 0) {
    previewProgress = calculateGoalProgress(goal)
  } else {
    previewProgress = Math.min(100, Math.max(0, manualProg))
  }

  function handleQuickAdd(amount: number) {
    const current = Math.max(0, Number(currentVal) || 0)
    const max = goal.targetValue || 100
    const next = Math.min(max, Math.max(0, current + amount))
    setCurrentVal(String(next))
    if (next >= max) {
      setIsCompleted(true)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (goal.progressMode === 'target') {
      const num = Number(currentVal)
      if (isNaN(num) || num < 0) {
        setError('Current value must be a valid non-negative number.')
        return
      }
      if (goal.targetValue && num > goal.targetValue) {
        setError(`Current value cannot exceed target (${goal.targetValue} ${goal.unit}).`)
        return
      }

      onSave({
        currentValue: num,
        completed: isCompleted || (goal.targetValue ? num >= goal.targetValue : false),
      })
    } else if (goal.progressMode === 'manual') {
      onSave({
        manualProgress: manualProg,
        completed: isCompleted || manualProg >= 100,
      })
    } else {
      // Milestone mode
      onSave({
        completed: isCompleted,
      })
    }

    onClose()
  }

  return (
    <Modal title={`Update Progress · ${goal.title}`} onClose={onClose}>
      <form className="task-form neu-form goal-progress-form" onSubmit={handleSubmit}>
        <div className="progress-preview-box neu-inset-well">
          <div className="progress-preview-top">
            <span className="progress-mode-badge">
              Mode: {goal.progressMode === 'target' ? 'Target Value' : goal.progressMode === 'milestones' ? 'Milestone Driven' : 'Manual %'}
            </span>
            <span className="progress-preview-number">{previewProgress}%</span>
          </div>

          <div className="neu-track-inset" aria-hidden="true">
            <div
              className="neu-fill-pastel-blue"
              style={{ width: `${previewProgress}%` }}
            />
          </div>
        </div>

        {goal.progressMode === 'target' && goal.targetValue ? (
          <div className="target-progress-control">
            <label>
              <span className="form-label-text">
                Current {goal.unit || 'Units'} (Target: {goal.targetValue} {goal.unit})
              </span>
              <input
                type="number"
                min="0"
                max={goal.targetValue}
                step="any"
                className="neu-input-inset"
                value={currentVal}
                onChange={(e) => {
                  setCurrentVal(e.target.value)
                  const n = Number(e.target.value)
                  if (goal.targetValue && n >= goal.targetValue) {
                    setIsCompleted(true)
                  }
                }}
                autoFocus
              />
            </label>

            <div className="quick-steppers">
              <span className="stepper-label">Quick adjust:</span>
              <button
                type="button"
                className="neu-stepper-btn"
                onClick={() => handleQuickAdd(-5)}
              >
                -5
              </button>
              <button
                type="button"
                className="neu-stepper-btn"
                onClick={() => handleQuickAdd(-1)}
              >
                -1
              </button>
              <button
                type="button"
                className="neu-stepper-btn"
                onClick={() => handleQuickAdd(1)}
              >
                +1
              </button>
              <button
                type="button"
                className="neu-stepper-btn"
                onClick={() => handleQuickAdd(5)}
              >
                +5
              </button>
              <button
                type="button"
                className="neu-stepper-btn primary"
                onClick={() => {
                  if (goal.targetValue) {
                    setCurrentVal(String(goal.targetValue))
                    setIsCompleted(true)
                  }
                }}
              >
                Max ({goal.targetValue})
              </button>
            </div>
          </div>
        ) : null}

        {goal.progressMode === 'manual' ? (
          <div className="manual-progress-control">
            <label>
              <span className="form-label-text">Progress Percentage: {manualProg}%</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                className="neu-range-slider"
                value={manualProg}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setManualProg(val)
                  if (val === 100) {
                    setIsCompleted(true)
                  }
                }}
              />
            </label>
            <div className="range-number-input-row">
              <input
                type="number"
                min="0"
                max="100"
                className="neu-input-inset"
                value={manualProg}
                onChange={(e) => {
                  const val = Math.min(100, Math.max(0, Number(e.target.value) || 0))
                  setManualProg(val)
                  if (val === 100) {
                    setIsCompleted(true)
                  }
                }}
              />
              <span className="unit-label">%</span>
            </div>
          </div>
        ) : null}

        {goal.progressMode === 'milestones' ? (
          <div className="milestones-progress-control">
            <p className="helper-text">
              Check off milestones below to advance progress:
            </p>
            <ul className="quick-milestone-list">
              {goal.milestones.map((m) => (
                <li key={m.id} className="quick-milestone-item neu-inset-well-sm">
                  <label className="neu-checkbox-wrap">
                    <input
                      type="checkbox"
                      checked={m.completed}
                      onChange={() => onToggleMilestone && onToggleMilestone(goal.id, m.id)}
                    />
                    <span className="neu-checkbox-custom" aria-hidden="true">
                      {m.completed ? <Check size={12} strokeWidth={3} /> : null}
                    </span>
                    <span className={m.completed ? 'is-done' : ''}>{m.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <label className="checkbox-row-label complete-checkbox-row neu-card">
          <span className="neu-checkbox-wrap">
            <input
              type="checkbox"
              checked={isCompleted || previewProgress >= 100}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
            <span className="neu-checkbox-custom" aria-hidden="true">
              {isCompleted || previewProgress >= 100 ? (
                <Check size={12} strokeWidth={3} />
              ) : null}
            </span>
          </span>
          <span className="complete-row-copy">Mark goal as Completed</span>
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
            Save Progress
          </button>
        </div>
      </form>
    </Modal>
  )
}
