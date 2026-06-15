# AGENTS Guide for sakny-frontend

## Scope and current state
- This frontend is a Vite + React SPA with Redux Toolkit; routing is in `sakny-frontend/App.jsx`.
- It is currently mock-first: no HTTP client usage was found in source (`axios`/`fetch` absent).
- Backend integration is planned but not wired; most user/roommate/notification data is local state or static mocks.

## Routing and auth flow
- Router is `HashRouter` (`App.jsx`), so route behavior depends on hash-based URLs.
- Route guard uses `state.auth.isAuthenticated` via `ProtectedRoute` in `App.jsx`.
- Signup writes `localStorage['sakny_user']` and dispatches `mockSignup` (`pages/Auth/Signup.jsx`).
- Login reads `sakny_user`; if not matched, it falls back to `mockLogin` (`pages/Auth/Login.jsx`).

## State conventions
- Store composition is fixed in `sakny-frontend/store.js`: `auth`, `roommates`, `notifications`.
- `authSlice` tracks `profileCompleted` and `showWelcomeMessage`; wizard completion dispatches `completeProfile`.
- `roommateSlice` is seeded from `MOCK_ROOMMATES` and only mutates local filters/saved IDs.
- `notificationSlice` ships with pre-seeded notifications/messages and explicit unread counters.

## Profile setup and location patterns
- Profile wizard is a 6-step flow in `pages/ProfileSetup.jsx` with per-step validation in `validateStep`.
- Final submit enriches payload with `roommateGender: profileData.gender` (same-gender matching default).
- Location selection uses static Egypt datasets (`data/egyptLocations.js`) via `components/profile-setup/LocationSelector.jsx`.

## Build and dev workflow (Windows PowerShell)
- Install and run: `cd sakny-frontend ; npm install ; npm run dev`
- Vite dev server is configured for port `3000` and host `0.0.0.0` (`vite.config.js`).
- Available scripts are `dev`, `build`, and `preview` (`package.json`).

## Environment and integration touchpoints
- `vite.config.js` exposes `GEMINI_API_KEY` as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.
- If introducing real APIs, align calls to backend `/api/v1/...` routes and update slices to async thunks or equivalent.
- Keep current UI behavior parity when migrating: preserve local auth gating and wizard completion transitions.

## Project-specific gotchas
- Because routing uses `HashRouter`, do not assume server-side route handling like BrowserRouter setups.
- Existing pages/components expect mock shape fields (for example `profileCompletion`, `matchPercentage`, `verified`).
- There are no frontend tests/configured test scripts in `package.json`; manual page-path verification is currently the practical check.

