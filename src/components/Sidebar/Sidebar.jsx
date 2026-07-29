import { NavLink } from 'react-router-dom'
import {
  FiGrid,
  FiEdit3,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPenTool,
  FiX,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext.jsx'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/generate', label: 'Generate Content', icon: FiEdit3 },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/profile', label: 'Profile', icon: FiUser },
  { to: '/settings', label: 'Settings', icon: FiSettings },
]

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-ink-800/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink-100 dark:border-ink-500 bg-white dark:bg-ink-700 px-4 py-6 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink-800 dark:text-paper">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-signal text-white">
              <FiPenTool className="h-4 w-4" />
            </span>
            Inkwell
          </div>
          <button onClick={onClose} className="lg:hidden">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-signal-50 text-signal dark:bg-ink-600 dark:text-signal-400'
                    : 'text-ink-500 hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-ink-600'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-coral/10 hover:text-coral dark:text-ink-100"
        >
          <FiLogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
    </>
  )
}
