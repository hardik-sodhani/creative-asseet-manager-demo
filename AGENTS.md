# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Creative Asset Manager — a React + Express monorepo-style app (single `package.json`). No external services, databases, or Docker required. Data is stored in `data/assets.json` (flat JSON file).

### Services

| Service | Port | Command |
|---------|------|---------|
| React frontend (CRA) | 3000 | `npm run client` |
| Express API | 3001 | `npm run server` |
| Both (recommended) | 3000 + 3001 | `npm run dev` |

### Running

- `npm run dev` starts both frontend and API concurrently via the `concurrently` package.
- `npm run seed` populates `data/assets.json` with 8 sample assets. Run once after a fresh clone; re-running duplicates entries.
- The React dev server proxies are not configured in `package.json`; the frontend uses `REACT_APP_API_URL` (defaults to `http://localhost:3001/api`) via `src/api/assetClient.js`.

### Testing

- `npm test` uses `react-scripts test`. The repo currently has **no test files**; use `CI=true npm test -- --watchAll=false --passWithNoTests` to exit cleanly.

### Build

- `npm run build` produces a production build in `build/`.

### Gotchas

- The seed script appends to `data/assets.json` without deduplication. If you run `npm run seed` multiple times, you'll get duplicate assets.
- CRA dev server shows deprecation warnings for `onAfterSetupMiddleware`/`onBeforeSetupMiddleware` — these are harmless and come from `react-scripts 5.0.1`.
- No ESLint config, Prettier, or TypeScript. Linting is handled internally by CRA's built-in ESLint (runs during `npm run build` and `npm run client`).
