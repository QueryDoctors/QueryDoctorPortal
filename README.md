# PostgreSQL Performance Advisor - Frontend

Next.js 16 + TypeScript + Tailwind CSS dashboard for monitoring PostgreSQL performance.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **Server state**: TanStack Query 5
- **Client state**: Zustand 4.5
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library + MSW

## Architecture

Feature-Sliced Design (FSD) - each feature owns its API call, hook, components, and types.

```
app/           Route-level containers (thin, only compose features)
features/      Self-contained vertical slices
components/    Shared presentational UI primitives
lib/           API client, query client config
store/         Zustand stores (global client state)
```

### Features

| Feature | Description |
|---|---|
| `auth` | Login/register forms, JWT token management |
| `connection` | Database connection form + status |
| `metrics` | Live metrics grid (auto-refresh 10s) |
| `queries` | Slow, frequent, heaviest query tables |
| `recommendations` | Optimization suggestions with severity |
| `incidents` | Detected performance anomalies |
| `snapshots` | Manual latency snapshot capture |
| `logs` | Query log viewer |

### State Management

| State Type | Tool | Location |
|---|---|---|
| Server state | TanStack Query | `features/*/hooks/` |
| Client state | Zustand | `store/` |
| Form state | React Hook Form | Inside form components |
| URL state | Next.js App Router | `app/**/page.tsx` |

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8000`

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |

## Pages

| Route | Description |
|---|---|
| `/` | Landing / redirect |
| `/login` | Authentication |
| `/connect` | Database connection form |
| `/dashboard` | Main dashboard (metrics, queries, alerts) |

## Testing

All tests use MSW to mock API calls at the network level - never mock the API client directly.

```bash
# Watch mode
npm test

# Single run with coverage
npm run test:coverage
```

### Test Layers

| Layer | Tool | What |
|---|---|---|
| Unit - hooks | Vitest + RTL + MSW | Loading, success, error states |
| Unit - store | Vitest | State mutations, localStorage persistence |
| Component | RTL + MSW | Render, interaction, accessibility |
| Page | RTL + MSW | Full user flows |

## Key Patterns

- **Feature owns everything** - API, hook, components, types all inside `features/<name>/`
- **Pages are thin** - no business logic, only compose feature components
- **All API calls via `lib/api-client.ts`** - typed fetch wrapper with error handling
- **Zod validates forms and API responses** - fail fast at boundaries
- **Every hook returns `{ data, isLoading, error }`** - no raw query objects in components
- **Tailwind only** - no inline styles, no CSS modules
- **Severity colors**: critical = red-700 + pulse, high = red-500, medium = yellow-500, low = blue-500

## License

MIT
