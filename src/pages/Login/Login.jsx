import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../../services/api.js'
import { FiMail, FiLock, FiPenTool } from 'react-icons/fi'
import Input from '../../components/Input/Input.jsx'
import Button from '../../components/Button/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { validateLogin } from '../../utils/validators.js'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validateLogin(form)
    setErrors(validation)
    if (Object.keys(validation).length) return
    setLoading(true)
    try {
      await login(form.email, form.password)
      showToast('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      showToast(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-ink-800 px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold text-ink-800 dark:text-paper">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-signal text-white">
            <FiPenTool className="h-4 w-4" />
          </span>
          Inkwell
        </Link>
        <div className="card-surface rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Log in</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-100">
            Welcome back — pick up where you left off.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email"
              name="email"
              type="email"
              icon={FiMail}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              icon={FiLock}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-xs font-medium text-signal hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-signal hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Reset your password"
        footer={
          <>
            <Button variant="ghost" onClick={() => setForgotOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  await api.post('/api/forgot-password/', { email: form.email })
                  showToast('Password reset email sent.')
                } catch (err) {
                  showToast(err.message || 'Failed to send reset email', 'error')
                } finally {
                  setForgotOpen(false)
                }
              }}
            >
              Send reset link
            </Button>
          </>
        }
      >
        Enter the email tied to your account and we'll send a reset link.
      </Modal>
    </div>
  )
}
