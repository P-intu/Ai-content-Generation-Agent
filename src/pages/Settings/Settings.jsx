import { FiMoon, FiSun, FiShield } from 'react-icons/fi'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-signal' : 'bg-ink-200 dark:bg-ink-500'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">Settings</h1>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-50 dark:bg-ink-600">
              {theme === 'dark' ? <FiMoon className="h-4 w-4 text-signal" /> : <FiSun className="h-4 w-4 text-signal" />}
            </div>
            <div>
              <p className="font-medium text-ink-800 dark:text-paper">Dark Mode</p>
              <p className="text-sm text-ink-400">Switch between light and dark themes.</p>
            </div>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-50 dark:bg-ink-600">
            <FiShield className="h-4 w-4 text-signal" />
          </div>
          <div>
            <p className="font-medium text-ink-800 dark:text-paper">Account Settings</p>
            <p className="text-sm text-ink-400">Manage your account and connected data.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => showToast('Export started (mock).')}>
            Export my data
          </Button>
          <Button variant="danger" onClick={() => showToast('Account deletion requires confirmation.', 'error')}>
            Delete account
          </Button>
        </div>
      </Card>
    </div>
  )
}

