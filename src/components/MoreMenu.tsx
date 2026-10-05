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
    <div className="more-menu-panel" role="dialog" aria-label="More sections">
      <div className="more-menu-header">
        <span>More Pages</span>
      </div>
      <div className="more-menu-grid">
        {moreItems.map((item) => {
          const isActive = item.id === currentPage
          const variant = PAGE_VARIANTS[item.id] || 'blue'

          return (
            <button
              key={item.id}
              type="button"
              className={`more-menu-item ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <IconTile
                icon={<NavIcon id={item.id} size={18} />}
                variant={variant}
                size="sm"
                inset={isActive}
              />
              <span className="more-item-label">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
