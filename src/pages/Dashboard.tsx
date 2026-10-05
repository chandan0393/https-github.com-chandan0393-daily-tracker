import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Calendar,
  CheckSquare2,
  Droplets,
  Flame,
  Footprints,
  HeartPulse,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { CapsuleWidget } from '../components/CapsuleWidget'
import { CircularProgress } from '../components/CircularProgress'
import { IconTile } from '../components/IconTile'
import { PageHeader } from '../components/PageHeader'
import {
  calculateGoalProgress,
  formatGoalDate,
  getGoalDurationInfo,
  getGoalStats,
  getNextDeadlineGoal,
  getUpcomingGoals,
} from '../goals/dates'
import { CATEGORY_DETAILS } from '../goals/labels'
import { useGoals } from '../hooks/useGoals'
import { useTasks } from '../hooks/useTasks'
import { getTodayProgress } from '../tasks/dates'
import type { PageId } from '../types'

type DashboardProps = {
  onNavigate: (page: PageId) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { tasks } = useTasks()
  const { goals } = useGoals()

  // Live time for the cute digital clock widget
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      )
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  const [currentDate] = useState(() => new Date())
  const dayName = currentDate.toLocaleDateString(undefined, { weekday: 'long' })
  const dateFormatted = currentDate.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const todayProgress = getTodayProgress(tasks)
  const goalStats = useMemo(() => getGoalStats(goals), [goals])
  const nextDeadline = useMemo(() => getNextDeadlineGoal(goals), [goals])
  const nextDeadlineInfo = useMemo(
    () => (nextDeadline ? getGoalDurationInfo(nextDeadline) : null),
    [nextDeadline],
  )
  const upcomingGoals = useMemo(() => getUpcomingGoals(goals, 4), [goals])

  return (
    <section className="page dashboard-page">
      <PageHeader
        title="Dashboard"
        subtitle={`Your calm overview for ${dayName}, ${dateFormatted}.`}
      />

      {/* Hero Widgets Row (Styled directly after the reference image) */}
      <div className="dashboard-hero-grid">
        {/* 1. Digital Clock & Date Widget (Top-Left in reference image) */}
        <div className="hero-clock-widget">
          <div className="clock-recessed-display">
            <span className="clock-digits">{currentTime}</span>
            <div className="clock-live-dot" aria-hidden="true" />
          </div>

          <div className="clock-meta">
            <span className="clock-date-line">
              <Calendar size={13} className="clock-cal-icon" /> {dateFormatted}
            </span>
            <span className="clock-day-pill">{dayName}</span>
          </div>
        </div>

        {/* 2. Goals Circular Progress Widget (Inspired by circular gauge in reference) */}
        <div
          className="hero-goals-widget neu-card-interactive"
          onClick={() => onNavigate('goals')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onNavigate('goals')
            }
          }}
          aria-label="Goals Overview Widget. Click to view goals."
        >
          <div className="widget-header-row">
            <div className="widget-title-group">
              <span className="widget-subtitle-eyebrow">GOAL PROGRESS</span>
              <h3 className="widget-heading">Today's Goals</h3>
            </div>
            <IconTile icon={<Sparkles size={16} />} variant="pink" size="xs" />
          </div>

          <div className="goals-circular-body">
            <CircularProgress
              percent={goalStats.overallProgress}
              size={96}
              strokeWidth={8}
              color="var(--pastel-pink-dark)"
            >
              <div className="circular-center-text">
                <span className="center-percent">{goalStats.overallProgress}%</span>
                <span className="center-sublabel">Done</span>
              </div>
            </CircularProgress>

            <div className="goals-mini-stat-col">
              <div className="mini-stat-row">
                <span className="stat-bullet bullet-active" />
                <span className="mini-stat-label">Active:</span>
                <strong>{goalStats.active}</strong>
              </div>
              <div className="mini-stat-row">
                <span className="stat-bullet bullet-done" />
                <span className="mini-stat-label">Done:</span>
                <strong>{goalStats.completed}</strong>
              </div>
              <div className="mini-stat-row">
                <span className="stat-bullet bullet-overdue" />
                <span className="mini-stat-label">Overdue:</span>
                <strong className={goalStats.overdue > 0 ? 'text-danger' : ''}>
                  {goalStats.overdue}
                </strong>
              </div>
            </div>
          </div>

          {nextDeadline && nextDeadlineInfo ? (
            <div className="widget-next-deadline-row">
              <span className="next-label">Next:</span>
              <span className="next-goal-name">
                {CATEGORY_DETAILS[nextDeadline.category]?.icon} {nextDeadline.title}
              </span>
              <span className="next-goal-due">({nextDeadlineInfo.statusText})</span>
            </div>
          ) : (
            <div className="widget-next-deadline-row is-empty">
              <span>All goals on track</span>
            </div>
          )}
        </div>

        {/* 3. Two Vertical Capsule Widgets (Directly matching middle-left pills in reference) */}
        <div className="hero-capsules-group">
          {/* Water Capsule */}
          <CapsuleWidget
            icon={<Droplets size={16} />}
            percent={75}
            label="Water"
            sublabel="6 / 8 glasses"
            variant="blue"
            onClick={() => onNavigate('water')}
          />

          {/* Activity / Battery Streak Capsule */}
          <CapsuleWidget
            icon={<HeartPulse size={16} />}
            percent={85}
            label="Energy"
            sublabel="Active Streak"
            variant="green"
            onClick={() => onNavigate('activity')}
          />
        </div>
      </div>

      {/* Secondary Widgets Grid */}
      <div className="dashboard-widgets-grid">
        {/* Today's Tasks Widget */}
        <article
          className="neu-widget-card is-clickable"
          onClick={() => onNavigate('tasks')}
          role="button"
          tabIndex={0}
        >
          <div className="neu-widget-top">
            <span className="neu-widget-title">TODAY'S TASKS</span>
            <IconTile icon={<CheckSquare2 size={16} />} variant="green" size="xs" />
          </div>

          <div className="neu-widget-body">
            <div className="neu-widget-val">
              {todayProgress.completed} / {todayProgress.total} completed
            </div>

            <div className="neu-track-inset" aria-hidden="true">
              <div
                className="neu-fill-pastel-green"
                style={{ width: `${todayProgress.percent}%` }}
              />
            </div>

            <div className="neu-widget-note">
              {todayProgress.total === 0
                ? 'No tasks due today. Tap to add one.'
                : `${todayProgress.percent}% completed`}
            </div>
          </div>
        </article>

        {/* Walking Widget */}
        <article
          className="neu-widget-card is-clickable"
          onClick={() => onNavigate('walking')}
          role="button"
          tabIndex={0}
        >
          <div className="neu-widget-top">
            <span className="neu-widget-title">WALKING</span>
            <IconTile icon={<Footprints size={16} />} variant="yellow" size="xs" />
          </div>

          <div className="neu-widget-body">
            <div className="neu-widget-val">6,420 steps</div>
            <div className="neu-widget-note">4.8 km · 80% of daily goal</div>
          </div>
        </article>

        {/* Expenses Widget */}
        <article
          className="neu-widget-card is-clickable"
          onClick={() => onNavigate('expenses')}
          role="button"
          tabIndex={0}
        >
          <div className="neu-widget-top">
            <span className="neu-widget-title">TODAY'S EXPENSE</span>
            <IconTile icon={<Wallet size={16} />} variant="peach" size="xs" />
          </div>

          <div className="neu-widget-body">
            <div className="neu-widget-val">₹850</div>
            <div className="neu-widget-note">Within mindful budget</div>
          </div>
        </article>

        {/* Learning Widget */}
        <article
          className="neu-widget-card is-clickable"
          onClick={() => onNavigate('learning')}
          role="button"
          tabIndex={0}
        >
          <div className="neu-widget-top">
            <span className="neu-widget-title">LEARNING</span>
            <IconTile icon={<BookOpen size={16} />} variant="lavender" size="xs" />
          </div>

          <div className="neu-widget-body">
            <div className="neu-widget-val">45 min</div>
            <div className="neu-widget-note">Focused study session</div>
          </div>
        </article>

        {/* Current Streak Widget */}
        <article
          className="neu-widget-card is-clickable"
          onClick={() => onNavigate('activity')}
          role="button"
          tabIndex={0}
        >
          <div className="neu-widget-top">
            <span className="neu-widget-title">CONSISTENCY</span>
            <IconTile icon={<Flame size={16} />} variant="pink" size="xs" />
          </div>

          <div className="neu-widget-body">
            <div className="neu-widget-val">5 Days</div>
            <div className="neu-widget-note">Consistency streak active</div>
          </div>
        </article>

        {/* Cute Companion Widget (Inspired by (> . <) in the reference image) */}
        <article className="neu-widget-card cute-companion-widget">
          <div className="cute-face-display">
            <span className="cute-eyes">&gt;</span>
            <span className="cute-nose">◡</span>
            <span className="cute-eyes">&lt;</span>
            <span className="cute-blush left" />
            <span className="cute-blush right" />
          </div>
          <p className="cute-copy">You're doing wonderful today!</p>
        </article>
      </div>

      {/* Upcoming Goals Section */}
      <section className="dashboard-section upcoming-goals-section">
        <div className="section-toolbar">
          <div>
            <span className="widget-subtitle-eyebrow">UPCOMING DEADLINES</span>
            <h2 className="section-heading">Upcoming Goals</h2>
          </div>
          <button
            type="button"
            className="neu-pill-btn secondary"
            onClick={() => onNavigate('goals')}
          >
            View all goals →
          </button>
        </div>

        {upcomingGoals.length === 0 ? (
          <div className="empty-upcoming-goals-card neu-inset-well">
            <p>No upcoming goal deadlines right now.</p>
            <button
              type="button"
              className="neu-pill-btn primary"
              onClick={() => onNavigate('goals')}
            >
              + Create Goal
            </button>
          </div>
        ) : (
          <div className="upcoming-goals-grid">
            {upcomingGoals.map((goal) => {
              const duration = getGoalDurationInfo(goal)
              const categoryConfig = CATEGORY_DETAILS[goal.category] || CATEGORY_DETAILS.Other
              const progress = calculateGoalProgress(goal)

              return (
                <article
                  key={goal.id}
                  className="upcoming-goal-card neu-card-interactive"
                  onClick={() => onNavigate('goals')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onNavigate('goals')
                    }
                  }}
                >
                  <div className="upcoming-card-top">
                    <span className="upcoming-category-icon">
                      {categoryConfig.icon}
                    </span>
                    <div className="upcoming-card-titles">
                      <h3>{goal.title}</h3>
                      <p className="upcoming-deadline-copy">
                        {formatGoalDate(goal.endDate)} ·{' '}
                        <span
                          className={
                            duration.statusType === 'overdue' ? 'text-danger' : 'text-accent'
                          }
                        >
                          {duration.statusText}
                        </span>
                      </p>
                    </div>
                    <span className="upcoming-percent-badge">{progress}%</span>
                  </div>

                  <div className="neu-track-inset" aria-hidden="true">
                    <div
                      className="neu-fill-pastel-blue"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </section>
  )
}
