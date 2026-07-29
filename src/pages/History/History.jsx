import { useEffect, useMemo, useState } from 'react'
import { FiSearch, FiEye, FiTrash2, FiCopy, FiClock } from 'react-icons/fi'
import Card from '../../components/Card/Card.jsx'
import Input from '../../components/Input/Input.jsx'
import Dropdown from '../../components/Dropdown/Dropdown.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Button from '../../components/Button/Button.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import ErrorState from '../../components/ErrorState/ErrorState.jsx'
import { SkeletonCard } from '../../components/Loader/Skeleton.jsx'
import { contentTypes } from '../../data/mockData.js'
import { fetchHistory, deleteHistoryItem } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'

const typeLabel = (value) => contentTypes.find((c) => c.value === value)?.label ?? value

export default function History() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewing, setViewing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const { showToast } = useToast()

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await fetchHistory()
      setItems(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
      const itemType = item.contentType || item.type
      const matchesType = typeFilter === 'all' || itemType === typeFilter
      return matchesSearch && matchesType
    })
  }, [items, search, typeFilter])

  const handleDelete = async () => {
    await deleteHistoryItem(deletingId)
    setItems((prev) => prev.filter((i) => i.id !== deletingId))
    setDeletingId(null)
    showToast('Draft deleted.')
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    showToast('Copied to clipboard.')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">History</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-100">
            Every draft you've generated, searchable by title and type.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <Input
            icon={FiSearch}
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Dropdown
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[{ value: 'all', label: 'All types' }, ...contentTypes]}
          />
        </div>
      </Card>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState onRetry={load} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon={FiClock}
          title="No drafts found"
          description="Try a different search term or filter, or generate a new draft."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id} hover className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-signal-50 dark:bg-ink-600 px-2.5 py-0.5 text-xs font-medium text-signal">
                  {typeLabel(item.contentType || item.type)}
                </span>
                <span className="text-xs text-ink-400">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date}
                </span>
              </div>
              <h3 className="mb-1 font-display text-base font-semibold text-ink-800 dark:text-paper line-clamp-2">
                {item.title}
              </h3>
              <p className="mb-4 flex-1 text-sm text-ink-500 dark:text-ink-100 line-clamp-3">
                {item.snippet || item.preview || item.content}
              </p>
              <div className="flex items-center gap-2 border-t border-ink-100 dark:border-ink-500 pt-3">
                <button
                  onClick={() => setViewing(item)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-600"
                >
                  <FiEye className="h-3.5 w-3.5" /> View
                </button>
                <button
                  onClick={() => handleCopy(item.content || item.preview || item.snippet)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-600"
                >
                  <FiCopy className="h-3.5 w-3.5" /> Copy
                </button>
                <button
                  onClick={() => setDeletingId(item.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium text-coral hover:bg-coral/10"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title}>
        <p className="text-xs uppercase tracking-wide text-ink-400 mb-3">
          {viewing && typeLabel(viewing.contentType || viewing.type)} · {viewing?.tone} ·{' '}
          {viewing?.createdAt ? new Date(viewing.createdAt).toLocaleDateString() : viewing?.date}
        </p>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700 dark:text-paper">
          {viewing?.content || viewing?.preview}
        </div>
      </Modal>

      <Modal
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete this draft?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        This can't be undone. The draft will be permanently removed from your history.
      </Modal>
    </div>
  )
}
