export type PageId =
  | 'dashboard'
  | 'goals'
  | 'tasks'
  | 'expenses'
  | 'learning'
  | 'walking'
  | 'water'
  | 'activity'
  | 'journal'
  | 'analytics'
  | 'settings'

export type NavItem = {
  id: PageId
  label: string
  description: string
}
