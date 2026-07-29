import { useState } from 'react'
import { FiZap, FiCopy, FiDownload, FiRefreshCw, FiEdit2 } from 'react-icons/fi'
import Card from '../../components/Card/Card.jsx'
import Input from '../../components/Input/Input.jsx'
import Dropdown from '../../components/Dropdown/Dropdown.jsx'
import Button from '../../components/Button/Button.jsx'
import Spinner from '../../components/Loader/Spinner.jsx'
import { contentTypes, tones, lengths } from '../../data/mockData.js'
import { generateContent } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function Generate() {
  const [form, setForm] = useState({
    topic: '',
    contentType: contentTypes[0].value,
    tone: tones[0].value,
    length: lengths[1].value,
    instructions: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editedText, setEditedText] = useState('')
  const { showToast } = useToast()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGenerate = async (e) => {
    e?.preventDefault()
    if (!form.topic.trim()) {
      showToast('Add a topic before generating.', 'error')
      return
    }
    setLoading(true)
    setEditing(false)
    try {
      const res = await generateContent(form)
      setResult(res)
      setEditedText(res.content)
      showToast('Content generated successfully!')
    } catch (err) {
      showToast(err.message || 'Failed to generate content.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText)
    showToast('Copied to clipboard.')
  }

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.title.slice(0, 40).replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Draft downloaded.')
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <Card>
        <h1 className="font-display text-xl font-semibold text-ink-800 dark:text-paper">
          Generate content
        </h1>
        <p className="mt-1 mb-5 text-sm text-ink-500 dark:text-ink-100">
          Describe a topic, pick a format and tone, and get a full draft.
        </p>

        <form className="space-y-4" onSubmit={handleGenerate}>
          <Input
            label="Topic"
            name="topic"
            placeholder="e.g. Why async standups beat daily meetings"
            value={form.topic}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Content Type"
              name="contentType"
              value={form.contentType}
              onChange={handleChange}
              options={contentTypes}
            />
            <Dropdown label="Tone" name="tone" value={form.tone} onChange={handleChange} options={tones} />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-100">
              Content Length
            </span>
            <div className="flex gap-2">
              {lengths.map((l) => (
                <button
                  type="button"
                  key={l.value}
                  onClick={() => setForm({ ...form, length: l.value })}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                    form.length === l.value
                      ? 'border-signal bg-signal-50 text-signal dark:bg-ink-600'
                      : 'border-ink-100 dark:border-ink-500 text-ink-500 dark:text-ink-100'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Additional Instructions"
            name="instructions"
            textarea
            rows={3}
            placeholder="Anything specific to include or avoid?"
            value={form.instructions}
            onChange={handleChange}
          />
          <Button type="submit" size="lg" className="w-full" icon={FiZap} loading={loading}>
            Generate
          </Button>
        </form>
      </Card>

      <Card className="flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-800 dark:text-paper">Output</h2>
          {result && (
            <div className="flex gap-1.5">
              <button onClick={handleCopy} title="Copy" className="rounded-lg p-2 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-600">
                <FiCopy className="h-4 w-4" />
              </button>
              <button onClick={handleDownload} title="Download" className="rounded-lg p-2 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-600">
                <FiDownload className="h-4 w-4" />
              </button>
              <button onClick={handleGenerate} title="Regenerate" className="rounded-lg p-2 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-600">
                <FiRefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setEditing((e) => !e)}
                title="Edit"
                className={`rounded-lg p-2 hover:bg-ink-50 dark:hover:bg-ink-600 ${editing ? 'text-signal' : 'text-ink-400'}`}
              >
                <FiEdit2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1">
          {loading && (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-center">
              <Spinner size="lg" />
              <p className="text-sm text-ink-500 dark:text-ink-100">Drafting your {form.contentType}…</p>
            </div>
          )}

          {!loading && !result && (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 dark:border-ink-500 text-center px-6">
              <p className="text-sm text-ink-400">
                Your generated draft will appear here. Fill in the form and hit Generate.
              </p>
            </div>
          )}

          {!loading && result && (
            <div>
              <p className="mb-3 font-display text-base font-semibold text-ink-800 dark:text-paper">
                {result.title}
              </p>
              {editing ? (
                <textarea
                  className="w-full min-h-[260px] rounded-xl border border-signal bg-white/80 dark:bg-ink-700/60 p-4 text-sm leading-relaxed text-ink-700 dark:text-paper outline-none"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              ) : (
                <div className="whitespace-pre-wrap rounded-xl bg-paper-dim/60 dark:bg-ink-600/40 p-4 text-sm leading-relaxed text-ink-700 dark:text-paper max-h-[400px] overflow-y-auto">
                  {editedText}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
