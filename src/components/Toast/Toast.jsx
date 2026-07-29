import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi'

const styles = {
  success: 'bg-ink-800 text-paper border-citrus/40',
  error: 'bg-ink-800 text-paper border-coral/40',
}

export default function Toast({ message, variant = 'success', onClose }) {
  const Icon = variant === 'error' ? FiAlertCircle : FiCheckCircle
  return (
    <div
      className={`flex min-w-[240px] items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg animate-[slideIn_.2s_ease-out] ${styles[variant]}`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${variant === 'error' ? 'text-coral' : 'text-citrus'}`} />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} aria-label="Dismiss">
        <FiX className="h-4 w-4 opacity-60 hover:opacity-100" />
      </button>
    </div>
  )
}
