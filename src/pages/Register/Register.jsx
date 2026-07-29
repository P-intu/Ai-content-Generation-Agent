import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiAtSign, FiMail, FiLock, FiPenTool } from 'react-icons/fi'
import Input from '../../components/Input/Input.jsx'
import Button from '../../components/Button/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { validateRegister } from '../../utils/validators.js'

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validateRegister(form)
    setErrors(validation)
    if (Object.keys(validation).length) return
    setLoading(true)
    try {
      await register(form)
      showToast('Account created — welcome to Inkwell!')
      navigate('/dashboard')
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error')
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
          <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-100">
            Start drafting in every format, in minutes.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <Input
              label="Full Name"
              name="fullName"
              icon={FiUser}
              placeholder="Jordan Lee"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <Input
              label="Username"
              name="username"
              icon={FiAtSign}
              placeholder="jordanlee"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
            />
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
            <div className="grid grid-cols-2 gap-3">
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
              <Input
                label="Confirm"
                name="confirmPassword"
                type="password"
                icon={FiLock}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-100">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-signal hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
