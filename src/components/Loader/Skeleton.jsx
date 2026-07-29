export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-ink-100 dark:bg-ink-600 ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card-surface rounded-2xl p-6">
      <Skeleton className="mb-3 h-4 w-1/3" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="mb-2 h-3 w-5/6" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}
