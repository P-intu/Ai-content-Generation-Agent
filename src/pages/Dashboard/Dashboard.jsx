import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiZap, FiArrowRight, FiFileText } from 'react-icons/fi'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import { SkeletonCard } from '../../components/Loader/Skeleton.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchDashboard, fetchHistory } from '../../services/api.js'
import { contentTypes } from '../../data/mockData.js'

const typeLabel = (value) => contentTypes.find((c) => c.value === value)?.label ?? value

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([])
  const [historyItems, setHistoryItems] = useState([])

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        setLoading(true)
        const [dashboardData, historyData] = await Promise.all([
          fetchDashboard(),
          fetchHistory()
        ])
        
        if (!active) return

        const mappedStats = Object.entries(dashboardData).map(([key, value]) => {
          // Convert keys to display labels matching previous mockData structure
          const labelMap = {
            total_generated: 'Total Generated',
            this_week: '+12 this week', // placeholder for delta
            words_drafted: 'Words Drafted',
            saved_drafts: 'Saved Drafts',
            avg_tone_match: 'Avg. Tone Match',
          }
          let label = labelMap[key] || key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
          // Determine delta values where appropriate
          let delta = ''
          if (key === 'this_week') {
            delta = '+12 this week'
          } else if (key === 'words_drafted') {
            delta = '+6.4k this week'
          } else if (key === 'saved_drafts') {
            delta = '+3 this week'
          } else if (key === 'avg_tone_match') {
            delta = '+2% this week'
          }
          return { label, value, delta }
        })

        setStats(mappedStats)
        setHistoryItems(historyData)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    // Keep simulated loading simulation delay if desired
    const t = setTimeout(() => {
      loadData()
    }, 600)

    return () => {
      active = false
      clearTimeout(t)
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl">
      <Card className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">
            Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-100">
            Here's what's happened with your content lately.
          </p>
        </div>
        <Link to="/generate">
          <Button icon={FiZap} size="lg">
            Quick Generate
          </Button>
        </Link>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((s) => (
              <Card key={s.label}>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{s.label}</p>
                <p className="mt-2 font-display text-2xl font-semibold text-ink-800 dark:text-paper">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-citrus-600 dark:text-citrus">{s.delta}</p>
              </Card>
            ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-800 dark:text-paper">
            Recent history
          </h2>
          <Link to="/history" className="flex items-center gap-1 text-sm font-medium text-signal hover:underline">
            View all <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-ink-100 dark:bg-ink-600" />
              ))
            : historyItems.length > 0 ? (
                historyItems.slice(0, 4).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-4 rounded-xl border border-ink-100 dark:border-ink-500 px-4 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal-50 dark:bg-ink-600">
                      <FiFileText className="h-4 w-4 text-signal" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-800 dark:text-paper">{h.title}</p>
                      <p className="text-xs text-ink-400">
                        {typeLabel(h.contentType || h.type)} · {h.createdAt ? new Date(h.createdAt).toLocaleDateString() : h.date}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-400 dark:text-ink-300 py-2">
                  No content generated yet. Create a draft to get started!
                </p>
              )}
        </div>
      </Card>
    </div>
  )
}
