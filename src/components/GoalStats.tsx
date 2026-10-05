import type { GoalStats as GoalStatsType } from '../goals/types'

type GoalStatsProps = {
  stats: GoalStatsType
}

export function GoalStats({ stats }: GoalStatsProps) {
  return (
    <div className="stats-grid goals-stats-grid">
      <article className="stat-card">
        <h2>Total Goals</h2>
        <p className="card-value">{stats.total}</p>
      </article>
      <article className="stat-card">
        <h2>Active Goals</h2>
        <p className="card-value stat-value-active">{stats.active}</p>
      </article>
      <article className="stat-card">
        <h2>Completed</h2>
        <p className="card-value stat-value-completed">{stats.completed}</p>
      </article>
      <article className="stat-card">
        <h2>Overdue</h2>
        <p className="card-value stat-value-overdue">{stats.overdue}</p>
      </article>
    </div>
  )
}
