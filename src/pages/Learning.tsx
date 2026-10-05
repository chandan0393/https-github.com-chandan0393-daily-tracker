import { useState, useEffect } from 'react'
import { BookOpen, Flame, Plus, CheckCircle2, Timer } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const STORAGE_KEY = 'lifeos.learning'

type Subject = {
  id: string
  name: string
  progress: number
  color: string
}

const DEFAULT_SUBJECTS: Subject[] = [
  { id: '1', name: 'C++ Programming', progress: 75, color: '#9DB7D5' },
  { id: '2', name: 'Java Core & OOP', progress: 40, color: '#E4A6B0' },
  { id: '3', name: 'Testing & VectorCAST', progress: 90, color: '#9BC2B4' },
  { id: '4', name: 'DevOps & Git Workflow', progress: 25, color: '#B9A9D6' },
]

export function Learning() {
  const [minutes, setMinutes] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored !== null ? Number(stored) : 45
    } catch {
      return 45
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(minutes))
    } catch {
      // storage unavailable
    }
  }, [minutes])

  return (
    <section className="page learning-page">
      <PageHeader
        title="Learning & Study"
        subtitle="Track your focus time, subjects, and study streak! 💡"
      />

      <div className="fun-hero-card learning-hero-card">
        <div className="learning-hero-top">
          <div className="learning-book-badge">
            <BookOpen size={36} />
          </div>
          <div className="streak-badge">
            <Flame size={18} className="flame-icon-pulse" />
            <span>7 Day Streak!</span>
          </div>
        </div>

        <div className="learning-time-display">
          <span className="learning-main-minutes">{minutes}</span>
          <span className="learning-minutes-lbl">minutes studied today</span>
        </div>

        <div className="learning-quick-timers">
          <button
            type="button"
            className="fun-btn fun-btn-soft"
            onClick={() => setMinutes((m) => m + 15)}
          >
            <Timer size={16} />
            <span>+15 min</span>
          </button>
          <button
            type="button"
            className="fun-btn fun-btn-primary"
            onClick={() => setMinutes((m) => m + 30)}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>+30 min (Pomodoro)</span>
          </button>
        </div>
      </div>

      <div className="fun-card subjects-card">
        <h3 className="fun-card-title">Current Subjects & Skills</h3>
        <div className="subjects-grid">
          {DEFAULT_SUBJECTS.map((sub) => (
            <div key={sub.id} className="subject-box">
              <div className="subject-box-header">
                <strong>{sub.name}</strong>
                <span className="subject-pct-pill">{sub.progress}%</span>
              </div>
              <div className="fun-progress-track">
                <div
                  className="fun-progress-fill"
                  style={{ width: `${sub.progress}%`, backgroundColor: sub.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fun-card achievement-banner-card">
        <CheckCircle2 size={24} className="check-achieve-icon" />
        <div>
          <strong>Brain power level up!</strong>
          <p>Consistent daily 30-minute sessions build deep mastery over time.</p>
        </div>
      </div>
    </section>
  )
}
