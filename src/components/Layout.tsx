import { useState, type ReactNode } from 'react'
import type { PageId } from '../types'
import { BottomNav } from './BottomNav'
import { MobileHeader } from './MobileHeader'
import { MoreMenu } from './MoreMenu'
import { Sidebar } from './Sidebar'

type LayoutProps = {
  currentPage: PageId
  onNavigate: (page: PageId) => void
  children: ReactNode
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const [moreOpen, setMoreOpen] = useState(false)

  function handleNavigate(page: PageId) {
    setMoreOpen(false)
    onNavigate(page)
  }

  return (
    <div className="app-shell">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="content-wrap">
        <MobileHeader currentPage={currentPage} onNavigate={handleNavigate} />
        {moreOpen ? (
          <MoreMenu currentPage={currentPage} onNavigate={handleNavigate} />
        ) : null}
        <main className="content">{children}</main>
      </div>
      <BottomNav
        currentPage={currentPage}
        moreOpen={moreOpen}
        onNavigate={handleNavigate}
        onToggleMore={() => setMoreOpen((open) => !open)}
      />
    </div>
  )
}
