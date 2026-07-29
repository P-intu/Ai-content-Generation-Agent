const variants = {
  primary:
    'bg-signal text-white hover:bg-signal-600 shadow-sm shadow-signal-500/20 focus-visible:outline-signal',
  secondary:
    'bg-ink-800 text-paper hover:bg-ink-700 dark:bg-paper dark:text-ink-800 dark:hover:bg-paper-dim',
  outline:
    'border border-ink-200 dark:border-ink-500 text-ink-800 dark:text-paper hover:bg-ink-50 dark:hover:bg-ink-700',
  ghost: 'text-ink-600 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-700',
  danger: 'bg-coral text-white hover:bg-coral-600',
  citrus: 'bg-citrus text-ink-800 hover:bg-citrus-600',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  loading = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      {children}
    </button>
  )
}
