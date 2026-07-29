export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  textarea = false,
  rows = 4,
  ...props
}) {
  const Component = textarea ? 'textarea' : 'input'
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-100">{label}</span>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
        )}
        <Component
          rows={textarea ? rows : undefined}
          className={`w-full rounded-xl border bg-white/80 dark:bg-ink-700/60 px-4 py-2.5 text-sm text-ink-800 dark:text-paper placeholder:text-ink-300 dark:placeholder:text-ink-300/60 outline-none transition-colors focus:border-signal ${
            Icon ? 'pl-9' : ''
          } ${error ? 'border-coral' : 'border-ink-100 dark:border-ink-500'} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs text-coral-600 dark:text-coral">{error}</span>}
    </label>
  )
}
