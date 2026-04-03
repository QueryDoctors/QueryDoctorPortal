# Command: capture-snapshot (Frontend)

## Files to Create

```
features/snapshots/
├── types/
│   └── snapshot.types.md     ← RawSnapshot (API) + Snapshot (domain)
├── services/
│   └── snapshot.service.md   ← captureSnapshot(dbId, connectionId), getSnapshots(connectionId)
├── hooks/
│   └── useCaptureSnapshot.md ← useMutation → POST /snapshots/{db_id}
└── components/
    └── SnapshotCapture.md    ← trigger button, disabled while pending
```

## Types Layer

Two tiers — raw API shape and domain model. Never use raw in components.

**Raw (API)**
- `id`, `connection_id`, `captured_at` (ISO string)
- `active_connections?`, `qps?`, `avg_query_time_ms?`, `total_queries?`
- `queries[]` → `{ id, category, query, mean_time_ms?, calls?, total_time_ms?, rows? }`
- `recommendations[]` → `{ id, problem, impact, suggestion, severity: 'high'|'medium'|'low' }`

**Domain (UI)**
- Same fields, except:
- `capturedAt: Date` (parsed from ISO string)
- `recommendations[].severity: 'critical'|'warning'|'info'` (mapped from raw)

## Service Layer

`captureSnapshot(dbId: string, connectionId: string): Promise<Snapshot>`
- POST `/snapshots/${dbId}?connection_id=${connectionId}`
- Maps raw → domain (severity mapping, capturedAt parsing)

`getSnapshots(connectionId: string): Promise<Snapshot[]>`
- GET `/snapshots?connection_id=${connectionId}`
- Maps each raw item → domain

## Hook

`useCaptureSnapshot()`
- `useMutation` wrapping `captureSnapshot`
- On success: invalidate `['snapshots', connectionId]`
- Returns `{ mutate, isPending, error }`

## Component: SnapshotCapture

- `'use client'`
- Reads `dbId` and `connectionId` from Zustand store
- Renders nothing if either is null (gated)
- Button: "Capture Snapshot"
  - Disabled + spinner when `isPending`
  - Calls `mutate({ dbId, connectionId })` on click
- Shows success toast on `onSuccess`
- Shows error message on `onError` (inline, not toast)
