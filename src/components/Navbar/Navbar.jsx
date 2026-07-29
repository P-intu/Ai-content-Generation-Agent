import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu, FiX, FiMoon, FiSun, FiPenTool } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext.jsx'
import Button from '../Button/Button.jsx'

const links = [
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/#testimonials', label: 'Testimonials' },
  { to: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/60 dark:border-ink-500/40 bg-paper/80 dark:bg-ink-800/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-signal text-white">
            <FiPenTool className="h-4 w-4" />
          </span>
          Inkwell
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="text-sm font-medium text-ink-600 dark:text-ink-100 hover:text-signal dark:hover:text-signal-400 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-700 dark:text-ink-100"
          >
            {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
          </button>
          <NavLink to="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </NavLink>
          <NavLink to="/register">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </NavLink>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-100 dark:border-ink-500 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.label} href={l.to} className="text-sm font-medium" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-3">
              <NavLink to="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </NavLink>
              <NavLink to="/register" className="flex-1">
                <Button variant="primary" className="w-full">
                  Get Started
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
