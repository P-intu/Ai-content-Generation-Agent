import { FiPenTool, FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 dark:border-ink-500 bg-white/40 dark:bg-ink-700/40">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink-800 dark:text-paper">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-signal text-white">
                <FiPenTool className="h-4 w-4" />
              </span>
              Inkwell
            </div>
            <p className="mt-3 text-sm text-ink-500 dark:text-ink-100">
              One topic, six formats, a tone that holds.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-ink-800 dark:text-paper">Product</h4>
            <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-100">
              <li><a href="/#features" className="hover:text-signal">Features</a></li>
              <li><a href="/#how-it-works" className="hover:text-signal">How It Works</a></li>
              <li><a href="/#faq" className="hover:text-signal">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-ink-800 dark:text-paper">Company</h4>
            <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-100">
              <li><a href="#" className="hover:text-signal">About</a></li>
              <li><a href="#" className="hover:text-signal">Careers</a></li>
              <li><a href="#" className="hover:text-signal">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-ink-800 dark:text-paper">Follow</h4>
            <div className="flex gap-3">
              <a href="#" className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-600"><FiTwitter className="h-4 w-4" /></a>
              <a href="#" className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-600"><FiGithub className="h-4 w-4" /></a>
              <a href="#" className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-600"><FiLinkedin className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-ink-100 dark:border-ink-500 pt-6 text-center text-xs text-ink-400">
          © {new Date().getFullYear()} Inkwell. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
