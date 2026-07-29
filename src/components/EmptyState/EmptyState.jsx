export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 dark:border-ink-500 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-signal-50 dark:bg-ink-600">
          <Icon className="h-6 w-6 text-signal" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-paper">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-ink-500 dark:text-ink-100">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
