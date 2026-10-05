import type { ReactNode } from 'react'

type CircularProgressProps = {
  percent: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  children?: ReactNode
}

export function CircularProgress({
  percent,
  size = 110,
  strokeWidth = 9,
  color = 'var(--pastel-blue-dark)',
  trackColor = 'rgba(180, 168, 155, 0.2)',
  children,
}: CircularProgressProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference

  return (
    <div
      className="circular-progress-wrap"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedPercent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        className="circular-progress-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track circle */}
        <circle
          className="circular-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Fill arc */}
        <circle
          className="circular-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {children ? <div className="circular-content">{children}</div> : null}
    </div>
  )
}
