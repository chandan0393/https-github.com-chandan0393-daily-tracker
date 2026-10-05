import { MOBILE_PRIMARY_IDS, NAV_ITEMS, PAGE_VARIANTS } from '../data/navigation'
import type { PageId } from '../types'
import { IconTile } from './IconTile'
import { NavIcon } from './NavIcon'

type MoreMenuProps = {
  currentPage: PageId
  onNavigate: (page: PageId) => void
}

export function MoreMenu({ currentPage, onNavigate }: MoreMenuProps) {
  const moreItems = NAV_ITEMS.filter(
    (item) => !MOBILE_PRIMARY_IDS.includes(item.id),
  )

  return (
    <div className="mobile-sheet-overlay" onClick={() => onNavigate(currentPage)}>
      <div
        className="mobile-sheet-card fun-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="More sections"
      >
        <div className="sheet-handle-bar" aria-hidden="true" />
        <div className="sheet-header">
          <h3>Explore More Trackers 🚀</h3>
        </div>
        <div className="sheet-grid">
          {moreItems.map((item) => {
            const isActive = item.id === currentPage
            const variant = PAGE_VARIANTS[item.id] || 'blue'

            return (
              <button
                key={item.id}
                type="button"
                className={`sheet-item-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <IconTile
                  icon={<NavIcon id={item.id} size={22} />}
                  variant={variant}
                  size="md"
                  inset={isActive}
                />
                <span className="sheet-item-label">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
