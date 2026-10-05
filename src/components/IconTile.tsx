import type { ReactNode } from 'react'

export type PastelVariant =
  | 'blue'
  | 'pink'
  | 'green'
  | 'lavender'
  | 'peach'
  | 'yellow'
  | 'cream'
  | 'slate'

type IconTileProps = {
  icon: ReactNode
  variant?: PastelVariant
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
  interactive?: boolean
  inset?: boolean
  'aria-label'?: string
}

export function IconTile({
  icon,
  variant = 'blue',
  size = 'md',
  className = '',
  onClick,
  interactive,
  inset = false,
  'aria-label': ariaLabel,
}: IconTileProps) {
  const isClickable = Boolean(onClick || interactive)
  const classes = [
    'neu-icon-tile',
    `neu-variant-${variant}`,
    `neu-size-${size}`,
    inset ? 'is-inset' : 'is-raised',
    isClickable ? 'is-interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <span className="neu-icon-inner">{icon}</span>
      </button>
    )
  }

  return (
    <div className={classes} aria-hidden={!ariaLabel} aria-label={ariaLabel}>
      <span className="neu-icon-inner">{icon}</span>
    </div>
  )
}
