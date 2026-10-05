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
    <nav className="bottom-nav-dock" aria-label="Mobile Navigation">
      <div className="bottom-nav-inner">
        {MOBILE_PRIMARY_IDS.map((id) => {
          const item = NAV_ITEMS.find((navItem) => navItem.id === id)
          if (!item) return null

          const isActive = item.id === currentPage && !moreOpen
          const variant = PAGE_VARIANTS[item.id] || 'blue'

          return (
            <button
              key={item.id}
              type="button"
              className={`bottom-nav-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconTile
                icon={<NavIcon id={item.id} size={20} />}
                variant={variant}
                size="md"
                inset={isActive}
              />
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          )
        })}

        <button
          type="button"
          className={`bottom-nav-btn ${isMoreActive ? 'is-active' : ''}`}
          onClick={onToggleMore}
          aria-expanded={moreOpen}
          aria-label="More sections"
        >
          <IconTile
            icon={<MoreHorizontal size={20} strokeWidth={2.2} />}
            variant="slate"
            size="md"
            inset={isMoreActive}
          />
          <span className="bottom-nav-label">More</span>
        </button>
      </div>
    </nav>
  )
}
