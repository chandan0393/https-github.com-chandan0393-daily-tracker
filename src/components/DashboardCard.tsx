import type { ReactNode } from 'react'
import { IconTile, type PastelVariant } from './IconTile'

type DashboardCardProps = {
  title: string
  value: string | ReactNode
  note: string | ReactNode
  icon?: ReactNode
  variant?: PastelVariant
  onClick?: () => void
  className?: string
}

export function DashboardCard({
  title,
  value,
  note,
  icon,
  variant = 'blue',
  onClick,
  className = '',
}: DashboardCardProps) {
  const isClickable = Boolean(onClick)
  const Tag = isClickable ? 'button' : 'article'

  return (
    <Tag
      className={`neu-widget-card ${isClickable ? 'is-clickable' : ''} ${className}`}
      onClick={onClick}
      type={isClickable ? 'button' : undefined}
    >
      <div className="neu-widget-top">
        <span className="neu-widget-title">{title}</span>
        {icon ? (
          <IconTile icon={icon} variant={variant} size="xs" />
        ) : null}
      </div>

      <div className="neu-widget-body">
        <div className="neu-widget-val">{value}</div>
        <div className="neu-widget-note">{note}</div>
      </div>
    </Tag>
  )
}
