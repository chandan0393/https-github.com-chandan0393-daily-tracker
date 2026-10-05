import { useState } from 'react'
import { Layout } from './components/Layout'
import { PlaceholderPage } from './components/PlaceholderPage'
import { getNavItem } from './data/navigation'
import { Dashboard } from './pages/Dashboard'
import { Goals } from './pages/Goals'
import { Tasks } from './pages/Tasks'
import { Settings } from './pages/Settings'
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
