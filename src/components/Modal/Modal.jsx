import { FiX } from 'react-icons/fi'

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-800/50 backdrop-blur-sm animate-[fadeIn_.15s_ease-out]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-ink-700 p-6 shadow-xl border border-ink-100 dark:border-ink-500">
        <div className="mb-4 flex items-center justify-between shrink-0">
          <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-paper">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm text-ink-600 dark:text-ink-100 overflow-y-auto flex-1 min-h-0">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3 shrink-0">{footer}</div>}
      </div>
    </div>
  )
}
