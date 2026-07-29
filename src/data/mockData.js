export const mockUser = {
  name: 'Maya Alvarez',
  username: 'mayaalvarez',
  email: 'maya@inkwell.app',
  joinDate: '2025-02-14',
  avatar: null,
  totalGenerated: 128,
}

export const contentTypes = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'linkedin', label: 'LinkedIn Post' },
  { value: 'instagram', label: 'Instagram Caption' },
  { value: 'email', label: 'Email' },
  { value: 'youtube', label: 'YouTube Script' },
  { value: 'product', label: 'Product Description' },
]

export const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'funny', label: 'Funny' },
  { value: 'formal', label: 'Formal' },
]

export const lengths = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
]

export const dashboardStats = [
  { label: 'Total Generated', value: 128, delta: '+12 this week' },
  { label: 'Words Drafted', value: '84.2k', delta: '+6.4k this week' },
  { label: 'Saved Drafts', value: 34, delta: '+3 this week' },
  { label: 'Avg. Tone Match', value: '96%', delta: '+2% this week' },
]

export const mockHistory = [
  {
    id: 'h1',
    title: 'Why Async Standups Beat Daily Meetings',
    type: 'blog',
    tone: 'professional',
    date: '2026-07-20',
    preview:
      'Async standups respect focus time while keeping teams aligned. Here is how to run one that actually works...',
  },
  {
    id: 'h2',
    title: 'Launch week is here 🚀',
    type: 'linkedin',
    tone: 'friendly',
    date: '2026-07-18',
    preview:
      'Thrilled to share that our newest feature is live. It started as a scrappy prototype and became something our users ask for daily...',
  },
  {
    id: 'h3',
    title: 'Golden hour, new roast',
    type: 'instagram',
    tone: 'casual',
    date: '2026-07-16',
    preview: 'Sundays taste better with a slow pour and a warm playlist. New single-origin drops tomorrow ☕️',
  },
  {
    id: 'h4',
    title: 'Your invoice is ready',
    type: 'email',
    tone: 'formal',
    date: '2026-07-14',
    preview:
      'Hello, please find attached your invoice for the month of June. Payment is due within 14 days of receipt...',
  },
  {
    id: 'h5',
    title: 'Unboxing the Aria Desk Lamp',
    type: 'youtube',
    tone: 'funny',
    date: '2026-07-11',
    preview:
      'This lamp promised to change my desk setup forever, so naturally I unboxed it at 1am like a reasonable adult...',
  },
  {
    id: 'h6',
    title: 'Aria Desk Lamp — Product Copy',
    type: 'product',
    tone: 'professional',
    date: '2026-07-09',
    preview: 'A warm, dimmable desk lamp built for late nights and early drafts. Adjustable color temperature...',
  },
]

export const testimonials = [
  {
    name: 'Priya Natarajan',
    role: 'Content Lead, Fernweh Travel',
    quote:
      'Our blog cadence doubled without adding headcount. Inkwell drafts the first pass, we bring the polish.',
  },
  {
    name: 'Diego Ramírez',
    role: 'Founder, Loop Coffee Co.',
    quote: 'I use it every Sunday to plan a week of captions in fifteen minutes flat.',
  },
  {
    name: 'Sarah Kim',
    role: 'Marketing Manager, Northlight',
    quote: 'The tone control is the real unlock — funny for social, formal for client emails, same tool.',
  },
]

export const faqs = [
  {
    q: 'Is the generated content editable?',
    a: 'Yes. Every draft opens in an editable card so you can tweak tone, trim length, or rewrite sections before you publish.',
  },
  {
    q: 'Which content types are supported?',
    a: 'Blog posts, LinkedIn posts, Instagram captions, emails, YouTube scripts, and product descriptions today, with more on the roadmap.',
  },
  {
    q: 'Can I keep a history of past drafts?',
    a: 'Every generation is saved to your History page, searchable by title, type, and tone.',
  },
  {
    q: 'Do you support light and dark mode?',
    a: 'Both, with a single toggle in Settings that remembers your preference.',
  },
]

export const features = [
  {
    title: 'Six content formats, one input',
    description: 'Draft a blog post, a caption, and an email from the same topic without retyping context.',
  },
  {
    title: 'Tone that actually holds',
    description: 'Professional, friendly, casual, funny, or formal — consistently, sentence to sentence.',
  },
  {
    title: 'Edit in place',
    description: 'Every draft is editable the moment it lands. Copy, download, or regenerate in one click.',
  },
  {
    title: 'A history you can search',
    description: 'Every draft is saved automatically and filterable by type, tone, and date.',
  },
]

export const howItWorks = [
  { step: 1, title: 'Describe the topic', description: 'Tell Inkwell what you want to write about, in a sentence or two.' },
  { step: 2, title: 'Pick format and tone', description: 'Choose the content type, tone, and length that fit the moment.' },
  { step: 3, title: 'Generate and refine', description: 'Get a full draft in seconds, then edit, copy, or regenerate.' },
]
