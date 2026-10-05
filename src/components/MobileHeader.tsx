import { useState } from 'react'
import { Bell, Settings2, Sparkles } from 'lucide-react'
import type { PageId } from '../types'
import { sendTestNotification } from '../goals/notifications'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning 👋'
  if (hour < 17) return 'Good Afternoon ☀️'
  return 'Good Evening 🌙'
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

type MobileHeaderProps = {
  currentPage: PageId
  onNavigate: (page: PageId) => void
}

export function MobileHeader({ onNavigate }: MobileHeaderProps) {
  const [greeting] = useState(getGreeting)
  const [dateStr] = useState(getFormattedDate)

  async function handleNotificationClick() {
    await sendTestNotification()
  }

  return (
    <header className="mobile-app-header">
      <div className="mobile-header-user">
        <div className="mobile-avatar">
          <Sparkles size={18} strokeWidth={2.5} />
        </div>
        <div className="mobile-header-text">
          <span className="mobile-greeting">{greeting}</span>
          <span className="mobile-date">{dateStr}</span>
        </div>
      </div>

      <div className="mobile-header-actions">
        <button
          type="button"
          className="mobile-header-btn"
          onClick={handleNotificationClick}
          aria-label="Test Notification"
          title="Test notification"
        >
          <Bell size={20} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          className="mobile-header-btn"
          onClick={() => onNavigate('settings')}
          aria-label="Settings"
          title="Settings"
        >
          <Settings2 size={20} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  )
}
