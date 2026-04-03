# Agent: capture-snapshot (Frontend)

## Data Flow

```
User clicks "Capture Snapshot"
  → read dbId + connectionId from Zustand
  → useMutation fires captureSnapshot(dbId, connectionId)
    → snapshot.service.ts → POST /snapshots/{dbId}?connection_id={connectionId}
      ← SnapshotResponse (raw)
    ← mapSnapshot(raw) → Snapshot (domain)
  ← React Query caches result
  → invalidate ['snapshots', connectionId] → useSnapshots refetches
  → toast "Snapshot captured"
```

## State Wiring

| State | Source |
| ----- | ------ |
| `dbId` | Zustand — active monitored connection |
| `connectionId` | Zustand — active saved connection |
| Captured snapshots list | React Query — `['snapshots', connectionId]` |
| `isPending` | useMutation — disables button |

## Error Paths

| HTTP | Condition | FE response |
| ---- | --------- | ----------- |
| 404 | dbId not in active pool | "Database not connected — reconnect first" |
| 500 | asyncpg / DB error | "Capture failed — check connection" |
| network | No response | "Request failed — check API server" |
