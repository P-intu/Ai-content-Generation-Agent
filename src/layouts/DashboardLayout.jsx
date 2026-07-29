import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-paper dark:bg-ink-800">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-100 dark:border-ink-500 bg-paper/80 dark:bg-ink-800/80 px-5 py-4 backdrop-blur-md">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <FiMenu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-700 dark:text-ink-100"
            >
              {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-signal-50 dark:bg-ink-600 font-display text-xs font-semibold text-signal">
                {user?.name?.[0] ?? 'U'}
              </div>
              <span className="hidden text-sm font-medium text-ink-700 dark:text-paper sm:block">
                {user?.name ?? 'User'}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
