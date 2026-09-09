# Training Dashboard

Personal strength-training dashboard. Pulls workout data from the
[Push](https://www.pushapp.co.uk/) app, stores it in MongoDB, shows personal
bests, estimated 1RM progress, and workout frequency.

## Stack

- Next.js (Pages Router) + React 19
- TanStack Query (data fetching) + TanStack Table (workout log)
- Chart.js
- MongoDB / Mongoose
- Tailwind CSS v4
- Vitest + Testing Library + MSW

## Structure

```
src/
  components/
    charts/     # generic chart primitives + chart widgets
    tables/     # table widgets
    dashboard/  # Dashboard.tsx, composes everything above
  hooks/        # derived-data hooks (usePersonalBests, useLiftProgress, useWorkoutFrequency)
  lib/
    workouts/   # useWorkouts + pure transform functions (transforms.ts)
    db/         # Mongoose connection
  models/       # Mongoose schemas
  pages/        # routes + API routes
  testing/      # test utilities (render, renderHook, MSW setup, fixtures)
scripts/        # data pipeline scripts, run via tsx
```

Components are presentational only. Data shaping lives in
`lib/workouts/transforms.ts` as plain functions, each wrapped by a hook in
`hooks/`.

## Setup

```bash
npm install
```

`.env.local`:

```bash
MONGODB_URI="mongodb+srv://..."
```

```bash
npm run dev
```

## Data pipeline

The app only reads from MongoDB, it never calls the Push API itself.

1. Pull the latest export from Push into `data/push-raw/` (done externally, not
   part of this repo)
2. `npm run build-workouts`, merges the raw calendar + exercise history into
   `data/push-workouts-full.json`
3. `npm run seed`, upserts that file into MongoDB

`data/` is gitignored, it's real personal training data.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / start |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:watch` | Run tests once / in watch mode |
| `npm run build-workouts` | Merge raw Push export into one file |
| `npm run seed` | Upsert workouts into MongoDB |

## Testing

- `lib/workouts/transforms.ts` is pure, tested directly, no mocking
- `useWorkouts` (the only hook that hits the network) is tested against a
  mocked `/api/workouts` via MSW
- Components are tested by mocking the hook they depend on and rendering with
  Testing Library

Shared test setup is in `src/testing/`: `render.tsx` / `renderHook.tsx` wrap
things in a `QueryClientProvider`, `fixtures/workouts.ts` has builders for
`IWorkout` test data.

## Deploying

Standard Next.js app, deploys to Vercel with no config. Set `MONGODB_URI` as
an env var on the project, done. Vercel free tier + MongoDB Atlas free (M0)
tier covers this at no cost.

For a private version with your real data and a public version with
placeholder data: deploy the repo twice on Vercel, each with its own
`MONGODB_URI` pointing at a different database. Seed the placeholder one with:

```bash
MONGODB_URI="<placeholder-db-uri>" npx tsx scripts/seed.ts data/placeholder-workouts.json
```
