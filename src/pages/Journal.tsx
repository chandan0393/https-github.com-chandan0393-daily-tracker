import { useState, useEffect } from 'react'
import { BookHeart, Check, Sparkles } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const STORAGE_KEY = 'lifeos.journal'

type Mood = {
  id: string
  label: string
  emoji: string
}

const MOODS: Mood[] = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'hyped', label: 'Hyped', emoji: '🤩' },
  { id: 'chill', label: 'Chill', emoji: '😴' },
  { id: 'focused', label: 'Focused', emoji: '🧘' },
  { id: 'tired', label: 'Tired', emoji: '😤' },
]

export function Journal() {
  const [content, setContent] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored || ''
    } catch {
      return ''
    }
  })

  const [selectedMood, setSelectedMood] = useState('happy')
  const [savedBadge, setSavedBadge] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, content)
    } catch {
      // storage unavailable
    }
  }, [content])

  function handleSave() {
    try {
      localStorage.setItem(STORAGE_KEY, content)
      setSavedBadge(true)
      setTimeout(() => setSavedBadge(false), 2500)
    } catch {
      // storage unavailable
    }
  }

  return (
    <section className="page journal-page">
      <PageHeader
        title="Daily Journal"
        subtitle="Your private personal notebook for thoughts and reflection."
      />

      <div className="fun-card mood-selector-card">
        <h3 className="mood-card-title">How was your vibe today?</h3>
        <div className="mood-buttons-row">
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mood-btn ${selectedMood === m.id ? 'active' : ''}`}
              onClick={() => setSelectedMood(m.id)}
            >
              <span className="mood-btn-emoji">{m.emoji}</span>
              <span className="mood-btn-label">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="fun-card journal-editor-card">
        <div className="journal-header-row">
          <div className="journal-brand-tag">
            <BookHeart size={20} className="journal-tag-icon" />
            <span>Today's Entry</span>
          </div>
          {savedBadge ? (
            <div className="journal-saved-badge">
              <Check size={14} />
              <span>Saved! ✨</span>
            </div>
          ) : null}
        </div>

        <textarea
          rows={8}
          className="journal-textarea"
          placeholder="What happened today? ✍️ Log your wins, challenges, thoughts, or funny moments..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="journal-bottom-actions">
          <span className="char-count-lbl">{content.length} characters</span>
          <button
            type="button"
            className="fun-btn fun-btn-primary"
            onClick={handleSave}
          >
            <Sparkles size={16} />
            <span>Save Entry</span>
          </button>
        </div>
      </div>
    </section>
  )
}
