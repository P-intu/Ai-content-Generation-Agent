import { FiAlertTriangle } from 'react-icons/fi'
import Button from '../Button/Button.jsx'

export default function ErrorState({
  title = 'Something went wrong',
  description = 'That request failed to complete. Try again in a moment.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-coral/30 bg-coral-500/5 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/10">
        <FiAlertTriangle className="h-6 w-6 text-coral" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-paper">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500 dark:text-ink-100">{description}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}
