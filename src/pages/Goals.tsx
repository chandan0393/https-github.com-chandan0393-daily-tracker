import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { GoalCard } from '../components/GoalCard'
import { GoalDetailsModal } from '../components/GoalDetailsModal'
import { GoalFilters } from '../components/GoalFilters'
import { GoalFormModal } from '../components/GoalFormModal'
import { GoalProgressModal } from '../components/GoalProgressModal'
import { GoalStats } from '../components/GoalStats'
import { PageHeader } from '../components/PageHeader'
import {
  getGoalStats,
  matchesGoalCategory,
  matchesGoalFilter,
  matchesGoalSearch,
  sortGoals,
} from '../goals/dates'
import { sendTestNotification } from '../goals/notifications'
import type { Goal, GoalDraft, GoalFilter, GoalSort } from '../goals/types'
import { useGoals } from '../hooks/useGoals'

export function Goals() {
  const {
    goals,
    notificationPermission,
    requestPermission,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleComplete,
    togglePause,
    updateGoalProgress,
    toggleMilestone,
    addMilestone,
    editMilestone,
    deleteMilestone,
  } = useGoals()

  const [filter, setFilter] = useState<GoalFilter>('all')
  const [category, setCategory] = useState<string>('all')
  const [sort, setSort] = useState<GoalSort>('default')
  const [query, setQuery] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined)
  const [detailsGoal, setDetailsGoal] = useState<Goal | undefined>(undefined)
  const [progressGoal, setProgressGoal] = useState<Goal | undefined>(undefined)
  const [goalToDelete, setGoalToDelete] = useState<Goal | undefined>(undefined)

  const [testNotifResult, setTestNotifResult] = useState<string | null>(null)

  // Memoized stats
  const stats = useMemo(() => getGoalStats(goals), [goals])

  // Count by filter
  const countsByFilter = useMemo(() => {
    return {
      all: goals.length,
      active: stats.active,
      completed: stats.completed,
      overdue: stats.overdue,
      not_started: goals.filter((g) => matchesGoalFilter(g, 'not_started')).length,
      paused: goals.filter((g) => matchesGoalFilter(g, 'paused')).length,
    }
  }, [goals, stats])

  // Filtered and sorted goals
  const visibleGoals = useMemo(() => {
    const filtered = goals.filter(
      (g) =>
        matchesGoalFilter(g, filter) &&
        matchesGoalCategory(g, category) &&
        matchesGoalSearch(g, query),
    )
    return sortGoals(filtered, sort)
  }, [goals, filter, category, query, sort])

  // Keep details and progress modals updated with active goal state if goals mutate
  const activeDetailsGoal = useMemo(() => {
    if (!detailsGoal) return undefined
    return goals.find((g) => g.id === detailsGoal.id)
  }, [goals, detailsGoal])

  const activeProgressGoal = useMemo(() => {
    if (!progressGoal) return undefined
    return goals.find((g) => g.id === progressGoal.id)
  }, [goals, progressGoal])

  function handleOpenAdd() {
    setEditingGoal(undefined)
    setFormOpen(true)
  }

  function handleSaveForm(draft: GoalDraft) {
    if (editingGoal) {
      updateGoal(editingGoal.id, draft)
    } else {
      addGoal(draft)
    }
    setFormOpen(false)
    setEditingGoal(undefined)
  }

  async function handleTestNotification() {
    const res = await sendTestNotification()
    setTestNotifResult(res.message)
    setTimeout(() => {
      setTestNotifResult(null)
    }, 6000)
  }

  const isFiltering = filter !== 'all' || category !== 'all' || query.trim() !== ''
  const hasGoals = goals.length > 0

  return (
    <section className="page goals-page">
      <div className="page-toolbar">
        <PageHeader
          title="My Goals"
          subtitle="Set ambitious targets, break them into milestones, and track your achievements."
        />
        <div className="page-toolbar-actions">
          <button
            type="button"
            className="button-secondary test-notif-btn"
            onClick={handleTestNotification}
            title="Test desktop notifications"
          >
            🔔 Test Notification
          </button>
          <button
            type="button"
            className="button-primary add-goal-btn"
            onClick={handleOpenAdd}
          >
            + Add Goal
          </button>
        </div>
      </div>

      {testNotifResult ? (
        <div className="notification-toast-banner" role="status">
          <span>{testNotifResult}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setTestNotifResult(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      ) : null}

      {notificationPermission === 'denied' ? (
        <div className="notification-warning-box" role="alert">
          <p>
            ⚠️ <strong>Browser notifications are disabled:</strong> You have blocked notifications
            for this site. To receive goal start & deadline reminders, please allow notifications in
            your browser address bar / site settings.
          </p>
        </div>
      ) : notificationPermission === 'default' ? (
        <div className="notification-warning-box" style={{ background: '#eff4ff', borderColor: '#bfdbfe', color: '#1e40af' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <span>
              🔔 <strong>Stay on track:</strong> Enable browser notifications to receive deadline and milestone reminders.
            </span>
            <button
              type="button"
              className="button-secondary btn-sm"
              onClick={requestPermission}
            >
              Enable Notifications
            </button>
          </div>
        </div>
      ) : null}

      {/* Summary Statistics */}
      <GoalStats stats={stats} />

      {/* Filter and Search Controls */}
      <GoalFilters
        searchQuery={query}
        onSearchChange={setQuery}
        currentFilter={filter}
        onFilterChange={setFilter}
        currentCategory={category}
        onCategoryChange={setCategory}
        currentSort={sort}
        onSortChange={setSort}
        countsByFilter={countsByFilter}
      />

      {/* Goals Content / Empty States */}
      {!hasGoals ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            🎯
          </div>
          <h2>No goals yet</h2>
          <p>Create your first goal and start tracking your progress.</p>
          <button
            type="button"
            className="button-primary"
            onClick={handleOpenAdd}
          >
            + Create Goal
          </button>
        </div>
      ) : visibleGoals.length === 0 ? (
        filter === 'overdue' ? (
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              🎉
            </div>
            <h2>No overdue goals</h2>
            <p>Great job! All your deadlines are on track or completed.</p>
            <button
              type="button"
              className="button-secondary"
              onClick={() => setFilter('all')}
            >
              View All Goals
            </button>
          </div>
        ) : filter === 'completed' ? (
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              🏆
            </div>
            <h2>No completed goals yet</h2>
            <p>Keep working on your active goals and check off milestones!</p>
            <button
              type="button"
              className="button-secondary"
              onClick={() => setFilter('all')}
            >
              View All Goals
            </button>
          </div>
        ) : stats.completed === stats.total && filter === 'active' ? (
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              🏆
            </div>
            <h2>All goals completed!</h2>
            <p>Incredible achievement! You have completed every goal you set.</p>
            <button
              type="button"
              className="button-primary"
              onClick={handleOpenAdd}
            >
              + Set A New Goal
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <h2>No matching goals</h2>
            <p>Try adjusting your search query, filter tabs, or category.</p>
            {isFiltering ? (
              <button
                type="button"
                className="button-secondary"
                onClick={() => {
                  setFilter('all')
                  setCategory('all')
                  setQuery('')
                }}
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        )
      ) : (
        <div className="goals-grid">
          {visibleGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onOpenDetails={(selected) => setDetailsGoal(selected)}
              onOpenProgress={(selected) => setProgressGoal(selected)}
              onEdit={(selected) => {
                setEditingGoal(selected)
                setFormOpen(true)
              }}
              onTogglePause={togglePause}
              onToggleComplete={toggleComplete}
              onDelete={(selected) => setGoalToDelete(selected)}
            />
          ))}
        </div>
      )}

      {/* Goal Form Modal (Add / Edit) */}
      {formOpen ? (
        <GoalFormModal
          goal={editingGoal}
          onSave={handleSaveForm}
          onClose={() => {
            setFormOpen(false)
            setEditingGoal(undefined)
          }}
        />
      ) : null}

      {/* Goal Details Modal */}
      {activeDetailsGoal ? (
        <GoalDetailsModal
          goal={activeDetailsGoal}
          onClose={() => setDetailsGoal(undefined)}
          onEdit={(selected) => {
            setDetailsGoal(undefined)
            setEditingGoal(selected)
            setFormOpen(true)
          }}
          onOpenProgress={(selected) => {
            setDetailsGoal(undefined)
            setProgressGoal(selected)
          }}
          onTogglePause={togglePause}
          onToggleComplete={toggleComplete}
          onDelete={(selected) => {
            setDetailsGoal(undefined)
            setGoalToDelete(selected)
          }}
          onToggleMilestone={toggleMilestone}
          onAddMilestone={addMilestone}
          onEditMilestone={editMilestone}
          onDeleteMilestone={deleteMilestone}
        />
      ) : null}

      {/* Goal Progress Quick Modal */}
      {activeProgressGoal ? (
        <GoalProgressModal
          goal={activeProgressGoal}
          onSave={(updates) => updateGoalProgress(activeProgressGoal.id, updates)}
          onToggleMilestone={toggleMilestone}
          onClose={() => setProgressGoal(undefined)}
        />
      ) : null}

      {/* Confirm Delete Dialog */}
      {goalToDelete ? (
        <ConfirmDialog
          message={`Are you sure you want to delete "${goalToDelete.title}"? This action cannot be undone.`}
          confirmLabel="Delete Goal"
          onCancel={() => setGoalToDelete(undefined)}
          onConfirm={() => {
            deleteGoal(goalToDelete.id)
            setGoalToDelete(undefined)
          }}
        />
      ) : null}
    </section>
  )
}
