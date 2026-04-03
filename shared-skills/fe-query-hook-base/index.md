---
name: fe-query-hook-base
type: shared-skill
layer: frontend
version: 1.0
last_updated: 2026-04-03
used_by: [capture-snapshot]
---

# Shared Skill: fe-query-hook-base

Reusable pattern for every `useQuery` hook in the FE. All list/detail hooks follow this.

## Pattern: List Query Hook

```typescript
export function useXxxList(filters: XxxFilters) {
  return useQuery({
    queryKey: ['xxx', filters],          // ALL params in key — never bare ['xxx']
    queryFn: () => getXxxList(filters),
    refetchInterval: 5_000,              // adjust per feature
    staleTime: 4_000,
    select: (data) => [...data].sort(/* sorting logic */),  // transform here, not in component
  })
}
```

## Pattern: Detail Query Hook

```typescript
export function useXxxDetail(id: string | null) {
  return useQuery({
    queryKey: ['xxx', id],
    queryFn: () => getXxxById(id!),
    enabled: id !== null,                // never call conditionally — use enabled
    staleTime: Infinity,                 // historical records never change
  })
}
```

## Hook Return Contract

Every hook returns exactly:

```typescript
{ data: T | undefined, isLoading: boolean, error: Error | null }
```

Never return the raw `useQuery` result object. Destructure and re-export.

## Rules

- `queryKey` always includes all params that affect the result
- `select` for sorting/transforming — keeps raw data in cache
- `enabled: false` when id is null — no empty requests
- `staleTime` set deliberately per data volatility (alerts: 4s, snapshots: Infinity)
- File location: `features/<name>/hooks/use<Name>.ts`
