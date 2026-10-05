import { useState, useEffect } from 'react'
import { Footprints, Flame, Timer, MapPin, Plus, RotateCcw, Award } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const STORAGE_KEY = 'lifeos.walking'
const GOAL_STEPS = 8000

export function Walking() {
  const [steps, setSteps] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored !== null ? Number(stored) : 6420
    } catch {
      return 6420
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(steps))
    } catch {
      // storage unavailable
    }
  }, [steps])

  const km = (steps * 0.00075).toFixed(1)
  const calories = Math.round(steps * 0.04)
  const activeMin = Math.round(steps / 120)
  const percent = Math.min(100, Math.round((steps / GOAL_STEPS) * 100))

  return (
    <section className="page walking-page">
      <PageHeader
        title="Walking & Movement"
        subtitle="Level up your daily activity and fitness stats! 🏃"
      />

      <div className="fun-hero-card walking-hero-card">
        <div className="walking-hero-top">
          <div className="walking-badge">
            <Footprints size={40} className="walking-icon-animated" />
          </div>
          <div className="walking-level-badge">
            <Award size={16} />
            <span>Level 5 Explorer</span>
          </div>
        </div>

        <div className="walking-step-display">
          <span className="step-main-num">{steps.toLocaleString()}</span>
          <span className="step-goal-label">Goal: {GOAL_STEPS.toLocaleString()} steps</span>
        </div>

        <div className="fun-progress-track">
          <div
            className="fun-progress-fill walking-progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="progress-labels-row">
          <span>{percent}% Completed</span>
          <span>{Math.max(0, GOAL_STEPS - steps).toLocaleString()} steps left</span>
        </div>

        <div className="walking-quick-actions">
          <button
            type="button"
            className="fun-btn fun-btn-soft"
            onClick={() => setSteps((s) => s + 500)}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>+500 Steps</span>
          </button>
          <button
            type="button"
            className="fun-btn fun-btn-primary"
            onClick={() => setSteps((s) => s + 1000)}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>+1,000 Steps</span>
          </button>
          <button
            type="button"
            className="fun-btn fun-btn-ghost"
            onClick={() => setSteps(0)}
            title="Reset steps"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="walking-stats-grid">
        <div className="fun-card walking-stat-card">
          <div className="stat-card-icon icon-blue">
            <MapPin size={22} />
          </div>
          <span className="stat-card-val">{km} km</span>
          <span className="stat-card-lbl">Distance</span>
        </div>

        <div className="fun-card walking-stat-card">
          <div className="stat-card-icon icon-peach">
            <Flame size={22} />
          </div>
          <span className="stat-card-val">{calories} kcal</span>
          <span className="stat-card-lbl">Burned</span>
        </div>

        <div className="fun-card walking-stat-card">
          <div className="stat-card-icon icon-yellow">
            <Timer size={22} />
          </div>
          <span className="stat-card-val">{activeMin} min</span>
          <span className="stat-card-lbl">Active Time</span>
        </div>
      </div>
    </section>
  )
}
