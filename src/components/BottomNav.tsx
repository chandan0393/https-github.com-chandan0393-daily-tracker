import { MoreHorizontal } from 'lucide-react'
import { MOBILE_PRIMARY_IDS, NAV_ITEMS, PAGE_VARIANTS } from '../data/navigation'
import type { PageId } from '../types'
import { IconTile } from './IconTile'
import { NavIcon } from './NavIcon'

type BottomNavProps = {
  currentPage: PageId
  moreOpen: boolean
  onNavigate: (page: PageId) => void
  onToggleMore: () => void
}

const MOBILE_LABELS: Record<string, string> = {
  dashboard: 'Home',
  goals: 'Goals',
  tasks: 'Tasks',
  analytics: 'Stats',
}

export function BottomNav({
  currentPage,
  moreOpen,
  onNavigate,
  onToggleMore,
}: BottomNavProps) {
  const moreItems = NAV_ITEMS.filter(
    (item) => !MOBILE_PRIMARY_IDS.includes(item.id),
  )
  const isMoreActive =
    moreOpen || moreItems.some((item) => item.id === currentPage)

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      <div className="mobile-bottom-inner">
        {MOBILE_PRIMARY_IDS.map((id) => {
          const item = NAV_ITEMS.find((navItem) => navItem.id === id)
          if (!item) return null

          const isActive = item.id === currentPage && !moreOpen
          const variant = PAGE_VARIANTS[item.id] || 'blue'
          const label = MOBILE_LABELS[item.id] || item.label

          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="tab-icon-wrap">
                <IconTile
                  icon={<NavIcon id={item.id} size={22} />}
                  variant={variant}
                  size="sm"
                  inset={isActive}
                />
              </div>
              <span className="mobile-tab-label">{label}</span>
            </button>
          )
        })}

        <button
          type="button"
          className={`mobile-tab-btn ${isMoreActive ? 'is-active' : ''}`}
          onClick={onToggleMore}
          aria-expanded={moreOpen}
          aria-label="More sections"
        >
          <div className="tab-icon-wrap">
            <IconTile
              icon={<MoreHorizontal size={22} strokeWidth={2.5} />}
              variant="slate"
              size="sm"
              inset={isMoreActive}
            />
          </div>
          <span className="mobile-tab-label">More</span>
        </button>
      </div>
    </nav>
  )
}
