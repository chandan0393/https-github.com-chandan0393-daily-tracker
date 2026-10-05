import { useState } from 'react'
import {
  Palette,
  Bell,
  HardDrive,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { IconTile } from '../components/IconTile'
import { PageHeader } from '../components/PageHeader'

type SettingItem = {
  id: string
  title: string
  description: string
  icon: typeof Palette
  variant: 'pink' | 'blue' | 'green' | 'lavender' | 'peach' | 'yellow'
  badge?: string
}

const SETTINGS_SECTIONS: SettingItem[] = [
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Soft pastel neumorphism, rounded curves & calm tones',
    icon: Palette,
    variant: 'pink',
    badge: 'Soft Pastel',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Goal start dates, approaching deadlines & milestone reminders',
    icon: Bell,
    variant: 'blue',
    badge: 'Enabled',
  },
  {
    id: 'storage',
    title: 'Data & Storage',
    description: 'Local-first persistence stored safely inside your browser',
    icon: HardDrive,
    variant: 'green',
    badge: 'Local',
  },
  {
    id: 'theme',
    title: 'Theme',
    description: 'Warm cream aesthetic (#F4F0EC) with soft raised dual shadows',
    icon: Sparkles,
    variant: 'lavender',
    badge: 'Neumorphic',
  },
  {
    id: 'about',
    title: 'About Daily Tracker',
    description: 'Version 2.0.0 • Offline-ready aesthetic personal companion',
    icon: Info,
    variant: 'peach',
    badge: 'v2.0',
  },
]

export function Settings() {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  function handleClick(item: SettingItem) {
    setActiveItem(item.id)
    setSavedMessage(`Opened ${item.title} preferences.`)
    setTimeout(() => {
      setSavedMessage(null)
    }, 3000)
  }

  return (
    <section className="page settings-page">
      <PageHeader
        title="Settings"
        subtitle="Manage your aesthetic preferences, notifications, and local storage data."
      />

      {savedMessage ? (
        <div className="notification-toast-banner neu-card-raised" role="status">
          <Check size={16} />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <div className="settings-container neu-card-raised">
        <div className="settings-list">
          {SETTINGS_SECTIONS.map((item) => {
            const IconComponent = item.icon
            const isSelected = activeItem === item.id

            return (
              <button
                key={item.id}
                type="button"
                className={`settings-row ${isSelected ? 'active' : ''}`}
                onClick={() => handleClick(item)}
              >
                <div className="settings-row-left">
                  <IconTile
                    icon={<IconComponent size={20} strokeWidth={2.2} />}
                    variant={item.variant}
                    size="md"
                    interactive={false}
                  />
                  <div className="settings-row-text">
                    <div className="settings-title-row">
                      <span className="settings-row-title">{item.title}</span>
                      {item.badge ? (
                        <span className="settings-row-badge">{item.badge}</span>
                      ) : null}
                    </div>
                    <p className="settings-row-desc">{item.description}</p>
                  </div>
                </div>

                <div className="settings-row-right" aria-hidden="true">
                  <ChevronRight size={18} className="settings-chevron" />
                </div>
              </button>
            )
          })}
        </div>

        <div className="settings-footer-info neu-well">
          <ShieldCheck size={18} className="settings-shield-icon" />
          <p>
            <strong>100% Privacy Focused:</strong> All tasks, goals, habits, and preferences are kept
            exclusively on your local machine using browser localStorage. No tracking, no external accounts.
          </p>
        </div>
      </div>
    </section>
  )
}
