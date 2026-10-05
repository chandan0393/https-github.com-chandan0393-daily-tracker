import type { ReactNode } from 'react'
import type { PastelVariant } from './IconTile'

type CapsuleWidgetProps = {
  icon: ReactNode
  percent: number
  label: string
  sublabel?: string
  variant?: PastelVariant
  onClick?: () => void
}

export function CapsuleWidget({
  icon,
  percent,
  label,
  sublabel,
  variant = 'blue',
  onClick,
}: CapsuleWidgetProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  const isClickable = Boolean(onClick)

  const Tag = isClickable ? 'button' : 'div'

  return (
    <Tag
      className={`capsule-widget neu-variant-${variant} ${isClickable ? 'is-clickable' : ''}`}
      onClick={onClick}
      type={isClickable ? 'button' : undefined}
    >
      <div className="capsule-track">
        {/* Fill from bottom */}
        <div
          className="capsule-fill"
          style={{ height: `${clamped}%` }}
          aria-hidden="true"
        />

        <div className="capsule-content">
          <div className="capsule-icon-top">{icon}</div>

          <div className="capsule-info-bottom">
            <span className="capsule-percent">{clamped}%</span>
            <span className="capsule-label">{label}</span>
            {sublabel ? <span className="capsule-sublabel">{sublabel}</span> : null}
          </div>
        </div>
      </div>
    </Tag>
  )
}
