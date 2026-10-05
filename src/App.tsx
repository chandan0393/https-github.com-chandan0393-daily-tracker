import { useState } from 'react'
import { Layout } from './components/Layout'
import { PlaceholderPage } from './components/PlaceholderPage'
import { getNavItem } from './data/navigation'
import { Dashboard } from './pages/Dashboard'
import { Goals } from './pages/Goals'
import { Tasks } from './pages/Tasks'
import { Settings } from './pages/Settings'
import { Water } from './pages/Water'
import { Walking } from './pages/Walking'
import { Expenses } from './pages/Expenses'
import { Learning } from './pages/Learning'
import { Journal } from './pages/Journal'
import { Analytics } from './pages/Analytics'
import type { PageId } from './types'

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard')
  const currentItem = getNavItem(currentPage)

  let page = (
    <PlaceholderPage
      title={currentItem.label}
      description={currentItem.description}
    />
  )

  if (currentPage === 'dashboard') {
    page = <Dashboard onNavigate={setCurrentPage} />
  } else if (currentPage === 'goals') {
    page = <Goals />
  } else if (currentPage === 'tasks') {
    page = <Tasks />
  } else if (currentPage === 'water') {
    page = <Water />
  } else if (currentPage === 'walking' || currentPage === 'activity') {
    page = <Walking />
  } else if (currentPage === 'expenses') {
    page = <Expenses />
  } else if (currentPage === 'learning') {
    page = <Learning />
  } else if (currentPage === 'journal') {
    page = <Journal />
  } else if (currentPage === 'analytics') {
    page = <Analytics />
  } else if (currentPage === 'settings') {
    page = <Settings />
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {page}
    </Layout>
  )
}

export default App
