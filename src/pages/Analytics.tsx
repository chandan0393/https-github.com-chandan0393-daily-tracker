import { BarChart2, Flame, Award, CheckCircle2, Droplets, Footprints, BookOpen } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const TASK_BARS = [
  { day: 'Mon', count: 4, height: 65 },
  { day: 'Tue', count: 6, height: 100 },
  { day: 'Wed', count: 3, height: 50 },
  { day: 'Thu', count: 7, height: 110 },
  { day: 'Fri', count: 5, height: 80 },
  { day: 'Sat', count: 6, height: 95 },
  { day: 'Sun', count: 4, height: 60 },
]

const WATER_BARS = [
  { day: 'Mon', count: 6, height: 75 },
  { day: 'Tue', count: 8, height: 100 },
  { day: 'Wed', count: 7, height: 88 },
  { day: 'Thu', count: 8, height: 100 },
  { day: 'Fri', count: 6, height: 75 },
  { day: 'Sat', count: 7, height: 88 },
  { day: 'Sun', count: 5, height: 62 },
]

export function Analytics() {
  return (
    <section className="page analytics-page">
      <PageHeader
        title="Weekly Analytics"
        subtitle="See your consistency, stats, and how much you've leveled up! 🏆"
      />

      <div className="fun-hero-card analytics-hero-card">
        <div className="analytics-hero-top">
          <div className="analytics-badge">
            <Award size={36} />
          </div>
          <span className="analytics-level-tag">Level 7 Achiever</span>
        </div>
        <div className="analytics-score-display">
          <span className="analytics-score-num">88%</span>
          <span className="analytics-score-lbl">Weekly Habit Consistency</span>
        </div>
        <div className="fun-highlight-pill">
          <Flame size={16} />
          <span>Best Day: Thursday (7 tasks & 8 glasses water) 🔥</span>
        </div>
      </div>

      <div className="analytics-charts-grid">
        <div className="fun-card chart-card">
          <div className="chart-card-header">
            <div className="chart-title-left">
              <CheckCircle2 size={20} className="chart-icon-green" />
              <strong>Tasks Completed</strong>
            </div>
            <span className="chart-total-tag">35 tasks</span>
          </div>

          <div className="bars-container">
            {TASK_BARS.map((b) => (
              <div key={b.day} className="bar-column">
                <span className="bar-val-label">{b.count}</span>
                <div className="bar-pill-track">
                  <div
                    className="bar-pill-fill bar-fill-green"
                    style={{ height: `${b.height}%` }}
                  />
                </div>
                <span className="bar-day-label">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fun-card chart-card">
          <div className="chart-card-header">
            <div className="chart-title-left">
              <Droplets size={20} className="chart-icon-blue" />
              <strong>Hydration Intake</strong>
            </div>
            <span className="chart-total-tag">47 glasses</span>
          </div>

          <div className="bars-container">
            {WATER_BARS.map((b) => (
              <div key={b.day} className="bar-column">
                <span className="bar-val-label">{b.count}</span>
                <div className="bar-pill-track">
                  <div
                    className="bar-pill-fill bar-fill-blue"
                    style={{ height: `${b.height}%` }}
                  />
                </div>
                <span className="bar-day-label">{b.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-summary-grid">
        <div className="fun-card summary-card">
          <Footprints size={22} className="summary-icon icon-green" />
          <span className="summary-val">42,850</span>
          <span className="summary-lbl">Total Steps this week</span>
        </div>

        <div className="fun-card summary-card">
          <BookOpen size={22} className="summary-icon icon-lavender" />
          <span className="summary-val">5.2 hrs</span>
          <span className="summary-lbl">Study Time this week</span>
        </div>

        <div className="fun-card summary-card">
          <BarChart2 size={22} className="summary-icon icon-peach" />
          <span className="summary-val">₹3,420</span>
          <span className="summary-lbl">Total Expenses this week</span>
        </div>
      </div>
    </section>
  )
}
