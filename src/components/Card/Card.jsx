export default function Card({ children, className = '', hover = false, as: As = 'div', ...props }) {
  return (
    <As
      className={`card-surface rounded-2xl p-6 shadow-sm shadow-ink-800/[0.03] ${
        hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-ink-800/[0.06]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </As>
  )
}
