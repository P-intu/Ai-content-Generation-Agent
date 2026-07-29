import { useState } from 'react'
import { FiEdit2, FiLock } from 'react-icons/fi'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import Input from '../../components/Input/Input.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function Profile() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [pwOpen, setPwOpen] = useState(false)
  const [form, setForm] = useState({ name: user?.name ?? '', username: user?.username ?? '' })

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">Profile</h1>

      <Card>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-signal-50 dark:bg-ink-600 font-display text-2xl font-semibold text-signal">
            {user?.name?.[0] ?? 'U'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-xl font-semibold text-ink-800 dark:text-paper">
              {user?.name}
            </h2>
            <p className="text-sm text-ink-400">@{user?.username}</p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-100">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={FiEdit2} onClick={() => setEditOpen(true)}>
              Edit Profile
            </Button>
            <Button variant="ghost" size="sm" icon={FiLock} onClick={() => setPwOpen(true)}>
              Change Password
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-ink-100 dark:border-ink-500 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400">Total Generated</p>
            <p className="mt-1 font-display text-xl font-semibold text-ink-800 dark:text-paper">
              {user?.totalGenerated}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400">Joined</p>
            <p className="mt-1 font-display text-xl font-semibold text-ink-800 dark:text-paper">
              {user?.joinDate}
            </p>
          </div>
        </div>
      </Card>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setEditOpen(false)
                showToast('Profile updated.')
              }}
            >
              Save changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
      </Modal>

      <Modal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        title="Change password"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPwOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPwOpen(false)
                showToast('Password updated.')
              }}
            >
              Update password
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Current Password" type="password" />
          <Input label="New Password" type="password" />
        </div>
      </Modal>
    </div>
  )
}
