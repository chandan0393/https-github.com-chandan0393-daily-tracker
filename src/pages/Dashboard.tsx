import { useState, useMemo } from 'react'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  CheckSquare2,
  Droplets,
  Flame,
  Footprints,
  Plus,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react'
import { CircularProgress } from '../components/CircularProgress'
import {
  calculateGoalProgress,
  formatGoalDate,
  getGoalDurationInfo,
  getGoalStats,
  getNextDeadlineGoal,
} from '../goals/dates'
import { useGoals } from '../hooks/useGoals'
import { useTasks } from '../hooks/useTasks'
import { getTodayProgress } from '../tasks/dates'
import type { PageId } from '../types'

function getDashboardGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning, Chandan 👋'
  if (hour < 17) return 'Good Afternoon, Chandan ☀️'
  return 'Good Evening, Chandan 🌙'
}

type DashboardProps = {
  onNavigate: (page: PageId) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { tasks, toggleTask } = useTasks()
  const { goals } = useGoals()

  // Dynamic greeting
  const [greeting] = useState(getDashboardGreeting)

  // Local state for water & walking quick increments
  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      const stored = localStorage.getItem('lifeos.water')
      return stored !== null ? Number(stored) : 5
    } catch {
      return 5
    }
  })

  const [steps, setSteps] = useState(() => {
    try {
      const stored = localStorage.getItem('lifeos.walking')
      return stored !== null ? Number(stored) : 6420
    } catch {
      return 6420
    }
  })

  const [studyMin] = useState(() => {
    try {
      const stored = localStorage.getItem('lifeos.learning')
      return stored !== null ? Number(stored) : 45
    } catch {
      return 45
    }
  })

  const [expenseTotal] = useState(() => {
    try {
      const stored = localStorage.getItem('lifeos.expenses')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed.reduce((sum: number, it: { amount: number }) => sum + it.amount, 0)
        }
      }
      return 850
    } catch {
      return 850
    }
  })

  function handleAddWater(e: React.MouseEvent) {
    e.stopPropagation()
    if (waterGlasses < 8) {
      const next = waterGlasses + 1
      setWaterGlasses(next)
      try {
        localStorage.setItem('lifeos.water', String(next))
      } catch {
        // storage unavailable
      }
    }
  }

  function handleAddSteps(e: React.MouseEvent) {
    e.stopPropagation()
    const next = steps + 500
    setSteps(next)
    try {
      localStorage.setItem('lifeos.walking', String(next))
    } catch {
      // storage unavailable
    }
  }

  const todayTasksProgress = getTodayProgress(tasks)
  const goalStats = useMemo(() => getGoalStats(goals), [goals])
  const nextDeadline = useMemo(() => getNextDeadlineGoal(goals), [goals])
  const nextDeadlineInfo = useMemo(
    () => (nextDeadline ? getGoalDurationInfo(nextDeadline) : null),
    [nextDeadline],
  )

  // Overall today's progress score
  const todayScore = Math.round(
    ((todayTasksProgress.total > 0
      ? (todayTasksProgress.completed / todayTasksProgress.total) * 50
      : 30) +
      (waterGlasses / 8) * 25 +
      (steps / 8000) * 25),
  )

  const motivationalMessage =
    todayScore >= 80
      ? "You're crushing it today! 🔥"
      : todayScore >= 50
      ? 'Keep going! Almost there! 🚀'
      : "Let's make today count! 💪"

  // Top 3 actionable tasks
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 3)
  const completedTodayTasks = tasks.filter((t) => t.completed).slice(0, 2)
  const previewTasks = [...pendingTasks, ...completedTodayTasks].slice(0, 3)

  return (
    <section className="page dashboard-page">
      {/* Top Greeting */}
      <div className="dashboard-greeting-wrap">
        <h1 className="greeting-title">{greeting}</h1>
        <p className="greeting-subtitle">
          Ready to conquer today? Here is your daily mission control. ⚡
        </p>
      </div>

      {/* Hero Today's Progress Card */}
      <div className="fun-hero-card dashboard-hero-card">
        <div className="hero-progress-left">
          <div className="hero-progress-badge">
            <Sparkles size={18} />
            <span>Today's Progress</span>
          </div>
          <div className="hero-score-row">
            <span className="hero-score-val">{todayScore}%</span>
            <span className="hero-motivation">{motivationalMessage}</span>
          </div>
          <div className="fun-progress-track hero-track">
            <div
              className="fun-progress-fill hero-progress-fill"
              style={{ width: `${todayScore}%` }}
            />
          </div>
        </div>

        <div className="hero-circular-meter">
          <CircularProgress
            percent={todayScore}
            size={110}
            strokeWidth={10}
            color="var(--pastel-blue)"
          >
            <span className="meter-center-pct">{todayScore}%</span>
          </CircularProgress>
        </div>
      </div>

      {/* Tasks & Goals Split Row */}
      <div className="dashboard-main-columns">
        {/* Today's Tasks */}
        <div className="fun-card dashboard-tasks-card">
          <div className="card-header-row">
            <div className="card-header-left">
              <CheckSquare2 size={22} className="header-icon-green" />
              <h3>Today's Tasks</h3>
            </div>
            <button
              type="button"
              className="card-header-link"
              onClick={() => onNavigate('tasks')}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="dashboard-tasks-list">
            {previewTasks.length === 0 ? (
              <div className="empty-tasks-box">
                <span className="empty-emoji">🎉</span>
                <strong>All tasks completed!</strong>
                <p>Enjoy your free time or add a new challenge.</p>
                <button
                  type="button"
                  className="fun-btn fun-btn-soft btn-sm"
                  onClick={() => onNavigate('tasks')}
                >
                  <Plus size={15} />
                  <span>Add Task</span>
                </button>
              </div>
            ) : (
              previewTasks.map((t) => (
                <div
                  key={t.id}
                  className={`dash-task-item ${t.completed ? 'is-done' : ''}`}
                >
                  <button
                    type="button"
                    className={`dash-checkbox ${t.completed ? 'checked' : ''}`}
                    onClick={() => toggleTask(t.id)}
                    aria-label={`Toggle ${t.title}`}
                  >
                    {t.completed ? <CheckCircle2 size={16} /> : null}
                  </button>
                  <div className="dash-task-info">
                    <span className="dash-task-title">{t.title}</span>
                    {t.dueDate ? (
                      <span className="dash-task-due">
                        <Calendar size={12} /> {t.dueTime ? `${t.dueTime}` : 'Today'}
                      </span>
                    ) : null}
                  </div>
                  {t.priority === 'high' ? (
                    <span className="dash-priority-pill">High</span>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="fun-card dashboard-goals-card">
          <div className="card-header-row">
            <div className="card-header-left">
              <Target size={22} className="header-icon-pink" />
              <h3>Active Goals</h3>
            </div>
            <button
              type="button"
              className="card-header-link"
              onClick={() => onNavigate('goals')}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {nextDeadline ? (
            <div
              className="dash-goal-spotlight"
              onClick={() => onNavigate('goals')}
              role="button"
              tabIndex={0}
            >
              <div className="dash-goal-spotlight-top">
                <div className="dash-goal-titles">
                  <span className="dash-goal-category-tag">{nextDeadline.category}</span>
                  <strong className="dash-goal-name">{nextDeadline.title}</strong>
                </div>
                <span className="dash-goal-pct">
                  {calculateGoalProgress(nextDeadline)}%
                </span>
              </div>

              <div className="fun-progress-track">
                <div
                  className="fun-progress-fill goal-progress-fill"
                  style={{ width: `${calculateGoalProgress(nextDeadline)}%` }}
                />
              </div>

              <div className="dash-goal-footer">
                <span className="dash-goal-deadline">
                  📅 {nextDeadlineInfo?.statusText || formatGoalDate(nextDeadline.endDate)}
                </span>
                <span className="dash-goal-remaining">
                  {nextDeadlineInfo?.overdueDays ? '⚠️ Overdue' : '🚀 In Progress'}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-tasks-box">
              <span className="empty-emoji">🎯</span>
              <strong>No active goals</strong>
              <p>Set a goal to push your limits and level up!</p>
              <button
                type="button"
                className="fun-btn fun-btn-soft btn-sm"
                onClick={() => onNavigate('goals')}
              >
                <Plus size={15} />
                <span>+ Add Goal</span>
              </button>
            </div>
          )}

          <div className="dash-goals-summary-strip">
            <div className="mini-stat">
              <span className="mini-stat-val">{goalStats.active}</span>
              <span className="mini-stat-lbl">Active</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-val">{goalStats.completed}</span>
              <span className="mini-stat-lbl">Completed</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-val">{goalStats.total}</span>
              <span className="mini-stat-lbl">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Quick Trackers Row (Water, Walking, Learning, Expenses) */}
      <div className="dashboard-quick-grid">
        {/* 1. Water Widget */}
        <div
          className="fun-card quick-tracker-card water-quick-card"
          onClick={() => onNavigate('water')}
          role="button"
          tabIndex={0}
        >
          <div className="quick-tracker-top">
            <div className="quick-icon-circle icon-blue">
              <Droplets size={22} />
            </div>
            <button
              type="button"
              className="quick-add-btn"
              onClick={handleAddWater}
              title="Add 1 glass of water"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="quick-tracker-info">
            <span className="quick-val">{waterGlasses} / 8</span>
            <span className="quick-lbl">Water Glasses</span>
          </div>
          <div className="fun-progress-track mini-track">
            <div
              className="fun-progress-fill"
              style={{
                width: `${(waterGlasses / 8) * 100}%`,
                backgroundColor: 'var(--pastel-blue)',
              }}
            />
          </div>
        </div>

        {/* 2. Walking Widget */}
        <div
          className="fun-card quick-tracker-card"
          onClick={() => onNavigate('walking')}
          role="button"
          tabIndex={0}
        >
          <div className="quick-tracker-top">
            <div className="quick-icon-circle icon-green">
              <Footprints size={22} />
            </div>
            <button
              type="button"
              className="quick-add-btn"
              onClick={handleAddSteps}
              title="Add 500 steps"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="quick-tracker-info">
            <span className="quick-val">{steps.toLocaleString()}</span>
            <span className="quick-lbl">Walking Steps</span>
          </div>
          <div className="fun-progress-track mini-track">
            <div
              className="fun-progress-fill"
              style={{
                width: `${Math.min(100, (steps / 8000) * 100)}%`,
                backgroundColor: 'var(--pastel-green)',
              }}
            />
          </div>
        </div>

        {/* 3. Learning Widget */}
        <div
          className="fun-card quick-tracker-card"
          onClick={() => onNavigate('learning')}
          role="button"
          tabIndex={0}
        >
          <div className="quick-tracker-top">
            <div className="quick-icon-circle icon-lavender">
              <BookOpen size={22} />
            </div>
            <span className="quick-badge-pill streak-pill">
              <Flame size={12} /> 7d
            </span>
          </div>
          <div className="quick-tracker-info">
            <span className="quick-val">{studyMin} min</span>
            <span className="quick-lbl">Study Focus</span>
          </div>
          <div className="fun-progress-track mini-track">
            <div
              className="fun-progress-fill"
              style={{
                width: `${Math.min(100, (studyMin / 60) * 100)}%`,
                backgroundColor: 'var(--pastel-purple)',
              }}
            />
          </div>
        </div>

        {/* 4. Expense Widget */}
        <div
          className="fun-card quick-tracker-card"
          onClick={() => onNavigate('expenses')}
          role="button"
          tabIndex={0}
        >
          <div className="quick-tracker-top">
            <div className="quick-icon-circle icon-peach">
              <Wallet size={22} />
            </div>
            <span className="quick-badge-pill">Today</span>
          </div>
          <div className="quick-tracker-info">
            <span className="quick-val">₹{expenseTotal}</span>
            <span className="quick-lbl">Daily Expenses</span>
          </div>
          <div className="fun-progress-track mini-track">
            <div
              className="fun-progress-fill"
              style={{
                width: `${Math.min(100, (expenseTotal / 1500) * 100)}%`,
                backgroundColor: 'var(--pastel-orange)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
