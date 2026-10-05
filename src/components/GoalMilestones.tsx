import { Check } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { GoalMilestone } from '../goals/types'

type GoalMilestonesProps = {
  milestones: GoalMilestone[]
  onToggle?: (id: string) => void
  onAdd?: (title: string) => void
  onEdit?: (id: string, newTitle: string) => void
  onDelete?: (id: string) => void
  readOnly?: boolean
  showAdd?: boolean
}

export function GoalMilestones({
  milestones,
  onToggle,
  onAdd,
  onEdit,
  onDelete,
  readOnly = false,
  showAdd = true,
}: GoalMilestonesProps) {
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const completedCount = milestones.filter((m) => m.completed).length
  const totalCount = milestones.length
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !onAdd) return
    onAdd(newTitle.trim())
    setNewTitle('')
  }

  function startEditing(m: GoalMilestone) {
    setEditingId(m.id)
    setEditingText(m.title)
  }

  function handleSaveEdit(id: string) {
    if (!editingText.trim() || !onEdit) return
    onEdit(id, editingText.trim())
    setEditingId(null)
  }

  return (
    <div className="goal-milestones-block neu-card">
      <div className="milestones-header">
        <div className="milestones-title-row">
          <h4 className="milestones-heading">Milestones</h4>
          <span className="milestones-badge">
            {completedCount} / {totalCount} completed ({percent}%)
          </span>
        </div>
        {totalCount > 0 ? (
          <div className="neu-track-inset-sm" aria-hidden="true">
            <div
              className="neu-fill-pastel-blue"
              style={{ width: `${percent}%` }}
            />
          </div>
        ) : null}
      </div>

      {totalCount === 0 ? (
        <p className="milestones-empty-text">No milestones added yet.</p>
      ) : (
        <ul className="milestones-list" role="list">
          {milestones.map((milestone) => (
            <li
              key={milestone.id}
              className={`milestone-item ${milestone.completed ? 'is-completed' : ''}`}
            >
              <label className="neu-checkbox-wrap">
                <input
                  type="checkbox"
                  checked={milestone.completed}
                  onChange={() => onToggle && onToggle(milestone.id)}
                  disabled={readOnly || !onToggle}
                  aria-label={`Mark milestone "${milestone.title}" as ${milestone.completed ? 'incomplete' : 'complete'}`}
                />
                <span className="neu-checkbox-custom" aria-hidden="true">
                  {milestone.completed ? <Check size={12} strokeWidth={3} /> : null}
                </span>
              </label>

              {editingId === milestone.id ? (
                <div className="milestone-edit-form">
                  <input
                    type="text"
                    className="milestone-edit-input neu-input-inset"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(milestone.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                  <button
                    type="button"
                    className="neu-pill-btn text-btn-sm"
                    onClick={() => handleSaveEdit(milestone.id)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="neu-pill-btn text-btn-sm"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span
                  className="milestone-title"
                  onClick={() => !readOnly && onToggle && onToggle(milestone.id)}
                >
                  {milestone.title}
                </span>
              )}

              {!readOnly && editingId !== milestone.id ? (
                <div className="milestone-actions">
                  {onEdit ? (
                    <button
                      type="button"
                      className="neu-pill-btn text-btn-sm"
                      onClick={() => startEditing(milestone)}
                      title="Edit milestone"
                      aria-label={`Edit ${milestone.title}`}
                    >
                      Edit
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      type="button"
                      className="neu-pill-btn text-btn-sm danger"
                      onClick={() => onDelete(milestone.id)}
                      title="Delete milestone"
                      aria-label={`Delete ${milestone.title}`}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {showAdd && !readOnly && onAdd ? (
        <form className="add-milestone-form" onSubmit={handleAdd}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new milestone..."
            className="add-milestone-input neu-input-inset"
          />
          <button
            type="submit"
            className="neu-pill-btn secondary add-milestone-btn"
            disabled={!newTitle.trim()}
          >
            + Add
          </button>
        </form>
      ) : null}
    </div>
  )
}
