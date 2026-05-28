import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { EntryPage } from '@/pages/EntryPage'
import { TimelinePage } from '@/pages/TimelinePage'

import '@/styles/globals.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- standard React bootstrap
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route element={<EntryPage />} path="/" />
          <Route element={<EntryPage />} path="/entry/:dateKey" />
          <Route element={<TimelinePage />} path="/timeline" />
          <Route element={<AnalyticsPage />} path="/analytics" />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
