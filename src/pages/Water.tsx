import { useState, useEffect } from 'react'
import { Droplets, Plus, Minus, Trophy } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const STORAGE_KEY = 'lifeos.water'
const TARGET_GLASSES = 8

export function Water() {
  const [glasses, setGlasses] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored !== null ? Number(stored) : 5
    } catch {
      return 5
    }
  })

  const [animatingIdx, setAnimatingIdx] = useState<number | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(glasses))
    } catch {
      // storage unavailable
    }
  }, [glasses])

  function addGlass() {
    if (glasses < TARGET_GLASSES) {
      setAnimatingIdx(glasses)
      setGlasses((g) => g + 1)
      setTimeout(() => setAnimatingIdx(null), 500)
    }
  }

  function removeGlass() {
    if (glasses > 0) {
      setGlasses((g) => g - 1)
    }
  }

  function toggleGlass(idx: number) {
    setAnimatingIdx(idx)
    if (idx < glasses) {
      setGlasses(idx)
    } else {
      setGlasses(idx + 1)
    }
    setTimeout(() => setAnimatingIdx(null), 500)
  }

  const percent = Math.min(100, Math.round((glasses / TARGET_GLASSES) * 100))
  const isCompleted = glasses >= TARGET_GLASSES

  return (
    <section className="page water-page">
      <PageHeader
        title="Water Tracker"
        subtitle="Stay hydrated and energized all day! Tap glasses to log."
      />

      <div className="fun-hero-card water-hero-card">
        <div className="water-drop-badge">
          <Droplets size={48} className={`water-hero-icon ${isCompleted ? 'bounce-celebrate' : ''}`} />
          {isCompleted ? <span className="drop-sparkle">✨</span> : null}
        </div>

        <div className="water-count-wrap">
          <span className="water-main-number">{glasses} / {TARGET_GLASSES}</span>
          <span className="water-sub-label">glasses drank today</span>
        </div>

        <div className="water-progress-bar-wrap">
          <div className="fun-progress-track">
            <div
              className="fun-progress-fill water-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="water-progress-text">{percent}% of daily goal</span>
        </div>

        <div className="water-btn-row">
          <button
            type="button"
            className="fun-btn fun-btn-soft-danger"
            onClick={removeGlass}
            disabled={glasses <= 0}
            aria-label="Remove glass"
          >
            <Minus size={18} strokeWidth={2.5} />
            <span>Remove</span>
          </button>
          <button
            type="button"
            className="fun-btn fun-btn-primary fun-btn-water"
            onClick={addGlass}
            disabled={glasses >= TARGET_GLASSES}
            aria-label="Add glass"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>+ Add Glass</span>
          </button>
        </div>
      </div>

      <div className="fun-card glass-grid-card">
        <h3 className="fun-card-title">Tap a glass to toggle</h3>
        <div className="glasses-grid">
          {Array.from({ length: TARGET_GLASSES }).map((_, idx) => {
            const isFilled = idx < glasses
            const isBouncing = animatingIdx === idx

            return (
              <button
                key={idx}
                type="button"
                className={`glass-cell ${isFilled ? 'filled' : 'empty'} ${isBouncing ? 'cell-bounce' : ''}`}
                onClick={() => toggleGlass(idx)}
                aria-label={`Glass ${idx + 1}, ${isFilled ? 'filled' : 'empty'}`}
              >
                <div className="glass-icon-circle">
                  <Droplets size={24} strokeWidth={2.2} />
                </div>
                <span className="glass-num">#{idx + 1}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fun-card fun-tip-card">
        <div className="tip-icon-wrap">
          <Trophy size={24} className="trophy-icon" />
        </div>
        <div className="tip-content">
          <strong>🔥 4 Days Hydration Streak!</strong>
          <p>Drinking enough water improves concentration, memory, and sports performance!</p>
        </div>
      </div>
    </section>
  )
}
