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
    <aside className="sidebar">
      <div className="brand" onClick={() => onNavigate('dashboard')} role="button" tabIndex={0}>
        <div className="brand-mark-tile">
          <Sparkles size={20} strokeWidth={2.2} />
        </div>
        <div className="brand-copy">
          <span className="brand-name">Daily Tracker</span>
          <span className="brand-tagline">Mindful LifeOS</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === currentPage
          const variant = PAGE_VARIANTS[item.id] || 'blue'

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconTile
                icon={<NavIcon id={item.id} size={17} />}
                variant={variant}
                size="xs"
                inset={isActive}
              />
              <span className="nav-label">{item.label}</span>
              {isActive ? <span className="active-dot" aria-hidden="true" /> : null}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
