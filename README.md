# Inkwell — AI Content Creation Agent (Frontend)

A frontend-only scaffold for an AI content creation app, built with React (Vite), Tailwind CSS,
React Router, and mock data. No backend or AI integration is wired up — every "generation" is a
local mock so the whole flow is demoable immediately.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## What's inside

- **Pages**: Landing, Login, Register, Dashboard, Generate, History, Profile, Settings — all
  routed with `react-router-dom` and wrapped in `ProtectedRoute` for the authenticated area.
- **Auth**: mocked in `src/context/AuthContext.jsx`. Logging in or registering with any values
  creates a local mock session (stored in `localStorage`) — swap in real API calls when the
  backend exists.
- **Content generation**: `src/services/api.js` exports a pre-wired Axios instance
  (`api`) plus mock functions (`generateContent`, `fetchHistory`, `deleteHistoryItem`).
  Replace the function bodies with real `api.get/post` calls — the signatures won't need to
  change, so no page code should need editing.
- **Theming**: light/dark mode via a `dark` class toggle, persisted to `localStorage`
  (`src/context/ThemeContext.jsx`). Toggle lives in the navbar, dashboard header, and Settings.
- **Design tokens**: see `tailwind.config.js` — an ink/paper palette with a signal-blue primary
  and citrus/coral accents, `Space Grotesk` for display type and `Inter` for body text.
- **Reusable components**: Button, Input, Dropdown, Card, Modal, Toast, Spinner, Skeleton,
  EmptyState, ErrorState, Navbar, Sidebar, Footer — all under `src/components/`.

## Connecting a real backend later

1. Set `VITE_API_BASE_URL` in a `.env` file to your API's base URL.
2. In `src/services/api.js`, replace the mock bodies of `generateContent`, `fetchHistory`, and
   `deleteHistoryItem` with real `api.post` / `api.get` / `api.delete` calls.
3. In `src/context/AuthContext.jsx`, replace the mock `login` / `register` bodies with real
   requests, and consider storing a token instead of the full user object.

No component or page code needs to change — everything already consumes these functions through
their existing signatures.
