import { Outlet } from 'react-router-dom'

import { BottomNav } from '@/components/layout/BottomNav'
import { Toaster } from '@/components/ui'

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6">
          <Outlet />
        </main>
        <BottomNav />
      </div>
      <Toaster />
    </div>
  )
}
