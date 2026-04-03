---
name: fe-service-base
type: shared-skill
layer: frontend
version: 1.0
last_updated: 2026-04-03
used_by: [capture-snapshot]
---

# Shared Skill: fe-service-base

Reusable pattern for every feature service file. Any `features/*/services/*.service.ts` inherits this.

## Pattern: Two-Tier Types

```typescript
// Raw — matches API response exactly (never used in components)
interface RawXxx { severity: 'high' | 'medium' | 'low'; ... }

// Domain — what the UI uses (severity already mapped)
interface Xxx { severity: 'critical' | 'warning' | 'info'; ... }
```

Always define both. Import only domain types in components.

## Pattern: Severity Mapping

```typescript
const SEVERITY_MAP = { high: 'critical', medium: 'warning', low: 'info' } as const

function mapXxx(raw: RawXxx): Xxx {
  return { ...raw, severity: SEVERITY_MAP[raw.severity] }
}
```

This mapping lives here and ONLY here. Never in hooks, components, or store.

## Pattern: API Call via apiClient

```typescript
import { apiClient } from '@/lib/api-client'

export async function getXxx(params: XxxParams): Promise<Xxx[]> {
  const data = await apiClient.get<RawXxxResponse>('/xxx', { ...params })
  return data.items.map(mapXxx)
}

export async function createXxx(body: CreateXxxRequest): Promise<Xxx> {
  const data = await apiClient.post<RawXxx>('/xxx', body)
  return mapXxx(data)
}
```

## Rules

- Never call `fetch` directly — always `apiClient.get/post/delete`
- Never import raw types outside of the service file
- Never do severity mapping outside of the service file
- Service files have no React imports — pure async functions only
- File location: `features/<name>/services/<name>.service.ts`
