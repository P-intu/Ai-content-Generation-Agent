import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import { features, howItWorks, testimonials, faqs, contentTypes } from '../../data/mockData.js'

function TypingHero() {
  const words = ['a blog post.', 'a LinkedIn post.', 'an email.', 'a product description.']
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index]
    const speed = deleting ? 35 : 65
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, display.length + 1))
        if (display.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1100)
        }
      } else {
        setDisplay(current.slice(0, display.length - 1))
        if (display.length - 1 === 0) {
          setDeleting(false)
          setIndex((i) => (i + 1) % words.length)
        }
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [display, deleting, index])

  return (
    <span className="text-signal dark:text-signal-400">
      {display}
      <span className="animate-blink border-r-2 border-signal ml-0.5" />
    </span>
  )
}

function FloatingTags() {
  const tags = contentTypes
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {tags.map((t, i) => (
        <span
          key={t.value}
          className={`absolute rounded-full border border-ink-100 dark:border-ink-500 bg-white/80 dark:bg-ink-700/80 px-3 py-1.5 text-xs font-medium text-ink-500 dark:text-ink-100 shadow-sm ${
            i % 2 === 0 ? 'animate-drift' : 'animate-drift-slow'
          }`}
          style={{
            top: `${10 + i * 14}%`,
            left: i % 2 === 0 ? `${2 + i * 2}%` : undefined,
            right: i % 2 !== 0 ? `${2 + i}%` : undefined,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          {t.label}
        </span>
      ))}
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper dark:bg-ink-800">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-20 pt-16 md:pt-24">
        <FloatingTags />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-block rounded-full border border-ink-100 dark:border-ink-500 bg-white/70 dark:bg-ink-700/70 px-4 py-1.5 text-xs font-medium text-ink-500 dark:text-ink-100">
            AI Content Creation Agent
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink-800 dark:text-paper md:text-6xl">
            Type one topic.
            <br />
            Get <TypingHero />
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-ink-500 dark:text-ink-100 md:text-lg">
            Inkwell drafts blog posts, social captions, emails, and scripts from a single idea — in the
            tone you choose, ready to edit in seconds.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button size="lg" icon={FiArrowRight}>
                Get Started
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-xl">
            <h2 className="font-display text-3xl font-semibold text-ink-800 dark:text-paper">
              Built for the whole content workflow
            </h2>
            <p className="mt-3 text-ink-500 dark:text-ink-100">
              Not just a generator — a working surface for drafting, editing, and keeping track of what
              you've made.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} hover>
                <h3 className="font-display text-base font-semibold text-ink-800 dark:text-paper">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-100">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white/40 dark:bg-ink-700/30 px-5 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold text-ink-800 dark:text-paper">
            Three steps, one draft
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-signal font-display text-lg font-semibold text-white">
                  {s.step}
                </div>
                <h3 className="font-display text-base font-semibold text-ink-800 dark:text-paper">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-100">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold text-ink-800 dark:text-paper">
            Teams already drafting faster
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <p className="text-sm text-ink-600 dark:text-ink-100">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-ink-800 dark:text-paper">{t.name}</p>
                  <p className="text-xs text-ink-400">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white/40 dark:bg-ink-700/30 px-5 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-display text-3xl font-semibold text-ink-800 dark:text-paper">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group card-surface rounded-2xl px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink-800 dark:text-paper">
                  {f.q}
                  <FiCheck className="h-4 w-4 shrink-0 text-signal opacity-0 transition-opacity group-open:opacity-100" />
                </summary>
                <p className="mt-3 text-sm text-ink-500 dark:text-ink-100">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
