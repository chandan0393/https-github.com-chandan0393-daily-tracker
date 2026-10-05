import {
  FILTER_LABELS,
  SORT_LABELS,
} from '../goals/labels'
import {
  GOAL_CATEGORIES,
  GOAL_FILTERS,
  GOAL_SORTS,
  type GoalCategory,
  type GoalFilter,
  type GoalSort,
} from '../goals/types'

type GoalFiltersProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  currentFilter: GoalFilter
  onFilterChange: (filter: GoalFilter) => void
  currentCategory: string
  onCategoryChange: (category: string) => void
  currentSort: GoalSort
  onSortChange: (sort: GoalSort) => void
  countsByFilter?: Partial<Record<GoalFilter, number>>
}

export function GoalFilters({
  searchQuery,
  onSearchChange,
  currentFilter,
  onFilterChange,
  currentCategory,
  onCategoryChange,
  currentSort,
  onSortChange,
  countsByFilter,
}: GoalFiltersProps) {
  return (
    <div className="goal-controls-container">
      <div className="task-controls">
        <input
          className="search-input neu-input-inset"
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search goals by title, description, category, or milestone..."
          aria-label="Search goals"
        />

        <label className="sort-label">
          Category
          <select
            value={currentCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="neu-select-inset"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {GOAL_CATEGORIES.map((cat: GoalCategory) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="sort-label">
          Sort by
          <select
            value={currentSort}
            onChange={(event) => onSortChange(event.target.value as GoalSort)}
            className="neu-select-inset"
            aria-label="Sort goals"
          >
            {GOAL_SORTS.map((sortKey: GoalSort) => (
              <option key={sortKey} value={sortKey}>
                {SORT_LABELS[sortKey]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-row" role="tablist" aria-label="Goal status filters">
        {GOAL_FILTERS.map((filterId: GoalFilter) => {
          const count = countsByFilter?.[filterId]
          const label = FILTER_LABELS[filterId]
          const isActive = currentFilter === filterId

          return (
            <button
              key={filterId}
              type="button"
              className={isActive ? 'neu-filter-chip active' : 'neu-filter-chip'}
              onClick={() => onFilterChange(filterId)}
            >
              <span>{label}</span>
              {typeof count === 'number' ? (
                <span className="filter-count-badge">{count}</span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
