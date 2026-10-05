import {
  BarChart2,
  BookHeart,
  BookOpen,
  CheckSquare2,
  Droplets,
  Footprints,
  HeartPulse,
  LayoutGrid,
  Settings2,
  Target,
  Wallet,
} from 'lucide-react'
import type { PageId } from '../types'

type NavIconProps = {
  id: PageId
  size?: number
  className?: string
}

export function NavIcon({ id, size = 19, className }: NavIconProps) {
  const props = {
    size,
    strokeWidth: 2,
    className,
    'aria-hidden': true,
  }

  switch (id) {
    case 'dashboard':
      return <LayoutGrid {...props} />
    case 'goals':
      return <Target {...props} />
    case 'tasks':
      return <CheckSquare2 {...props} />
    case 'expenses':
      return <Wallet {...props} />
    case 'learning':
      return <BookOpen {...props} />
    case 'walking':
      return <Footprints {...props} />
    case 'water':
      return <Droplets {...props} />
    case 'activity':
      return <HeartPulse {...props} />
    case 'journal':
      return <BookHeart {...props} />
    case 'analytics':
      return <BarChart2 {...props} />
    case 'settings':
      return <Settings2 {...props} />
    default:
      return null
  }
}
