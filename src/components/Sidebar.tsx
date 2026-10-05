import { Sparkles } from 'lucide-react'
import { NAV_ITEMS, PAGE_VARIANTS } from '../data/navigation'
import type { PageId } from '../types'
import { IconTile } from './IconTile'
import { NavIcon } from './NavIcon'

type SidebarProps = {
  currentPage: PageId
  onNavigate: (page: PageId) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fun-sidebar" aria-label="Main Navigation">
      <div
        className="sidebar-brand-card"
        onClick={() => onNavigate('dashboard')}
        role="button"
        tabIndex={0}
      >
        <div className="brand-icon-box">
          <Sparkles size={22} className="brand-sparkle" />
        </div>
        <div className="brand-text-col">
          <span className="brand-title">Daily Tracker</span>
          <span className="brand-tag">Level Up Mode 🎮</span>
        </div>
      </div>

      <nav className="sidebar-nav-list">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === currentPage
          const variant = PAGE_VARIANTS[item.id] || 'blue'

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconTile
                icon={<NavIcon id={item.id} size={18} />}
                variant={variant}
                size="sm"
                inset={isActive}
              />
              <span className="sidebar-nav-label">{item.label}</span>
              {isActive ? <span className="active-pill-badge">Active</span> : null}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
