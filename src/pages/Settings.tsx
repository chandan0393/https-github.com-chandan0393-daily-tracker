import { useState } from 'react'
import {
  Palette,
  Bell,
  HardDrive,
  Info,
  Check,
  Download,
  Upload,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

export function Settings() {
  const [appearance, setAppearance] = useState<'light' | 'soft'>('light')
  const [notifications, setNotifications] = useState<boolean>(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  function handleExportData() {
    try {
      const backup: Record<string, unknown> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('lifeos.') || key.startsWith('dailytracker.'))) {
          try {
            backup[key] = JSON.parse(localStorage.getItem(key) || '')
          } catch {
            backup[key] = localStorage.getItem(key)
          }
        }
      }
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', dataStr)
      downloadAnchor.setAttribute('download', `daily-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      showToast('Data exported successfully! 💾')
    } catch {
      showToast('Could not export data.')
    }
  }

  function handleImportData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (typeof parsed === 'object' && parsed !== null) {
          Object.entries(parsed).forEach(([k, v]) => {
            localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v))
          })
          showToast('Data imported! Reloading...')
          setTimeout(() => {
            window.location.reload()
          }, 800)
        }
      } catch {
        showToast('Invalid backup file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <section className="page settings-page">
      <PageHeader
        title="Settings ⚙️"
        subtitle="Customize your experience, preferences, and offline data."
      />

      {toastMessage ? (
        <div className="fun-toast-banner" role="status">
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      ) : null}

      <div className="settings-simple-container">
        {/* Appearance Row */}
        <div className="settings-simple-card">
          <div className="settings-card-head">
            <div className="settings-icon-bubble" style={{ background: '#E8D88B' }}>
              <Palette size={22} color="#5C4E10" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="settings-card-title">🎨 Appearance</h3>
              <p className="settings-card-desc">Choose your visual comfort theme</p>
            </div>
          </div>

          <div className="settings-pill-toggle">
            <button
              type="button"
              className={`settings-pill-btn ${appearance === 'light' ? 'active' : ''}`}
              onClick={() => {
                setAppearance('light')
                showToast('Light theme active ✨')
              }}
            >
              Light Cream
            </button>
            <button
              type="button"
              className={`settings-pill-btn ${appearance === 'soft' ? 'active' : ''}`}
              onClick={() => {
                setAppearance('soft')
                showToast('Soft Pastel mode active 🌸')
              }}
            >
              Soft Pastel
            </button>
          </div>
        </div>

        {/* Notifications Row */}
        <div className="settings-simple-card">
          <div className="settings-card-head">
            <div className="settings-icon-bubble" style={{ background: '#9DB7D5' }}>
              <Bell size={22} color="#1D3E61" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="settings-card-title">🔔 Notifications</h3>
              <p className="settings-card-desc">Daily habit reminders & task alerts</p>
            </div>
          </div>

          <div className="settings-pill-toggle">
            <button
              type="button"
              className={`settings-pill-btn ${notifications ? 'active' : ''}`}
              onClick={() => {
                setNotifications(true)
                showToast('Notifications enabled! 🔔')
              }}
            >
              On
            </button>
            <button
              type="button"
              className={`settings-pill-btn ${!notifications ? 'active' : ''}`}
              onClick={() => {
                setNotifications(false)
                showToast('Notifications muted 🔕')
              }}
            >
              Off
            </button>
          </div>
        </div>

        {/* Data Row */}
        <div className="settings-simple-card">
          <div className="settings-card-head">
            <div className="settings-icon-bubble" style={{ background: '#9BC2B4' }}>
              <HardDrive size={22} color="#184A3B" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="settings-card-title">💾 Data & Backup</h3>
              <p className="settings-card-desc">Safe local storage backup</p>
            </div>
          </div>

          <div className="settings-actions-group">
            <button
              type="button"
              className="fun-btn fun-btn-soft"
              onClick={handleExportData}
            >
              <Download size={16} /> Export
            </button>
            <label className="fun-btn fun-btn-ghost cursor-pointer" style={{ margin: 0 }}>
              <Upload size={16} /> Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* About Row */}
        <div className="settings-simple-card">
          <div className="settings-card-head">
            <div className="settings-icon-bubble" style={{ background: '#B9A9D6' }}>
              <Info size={22} color="#452775" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="settings-card-title">ℹ️ About Daily Tracker</h3>
              <p className="settings-card-desc">v2.5 · Fun Personal LifeOS</p>
            </div>
          </div>

          <div className="settings-badge-pill">
            <Sparkles size={14} /> Ready Offline
          </div>
        </div>

        {/* Privacy Note */}
        <div className="settings-privacy-banner">
          <ShieldCheck size={20} color="#2A6B53" />
          <p>
            <strong>100% Private:</strong> Your goals, steps, water, tasks, and journals stay safely in your browser. No cloud logins, no tracking.
          </p>
        </div>
      </div>
    </section>
  )
}
