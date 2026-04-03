---
version: 1.0
last_updated: 2026-04-03
extends:
  - frontend/shared-skills/fe-service-base    ← two-tier types, severity mapping, apiClient pattern
  - frontend/shared-skills/fe-mutation-base   ← useMutation, cache invalidation, error UX, isPending
note: Do NOT duplicate patterns from extended shared-skills. Only document what is unique to this feature.
---

# Skill: capture-snapshot

**Capability**: Trigger a performance snapshot capture for the active connected database and display the result in the alert feed.

**Consumes**: `POST /snapshots/{db_id}?connection_id={connection_id}`

**Hook**: `useCaptureSnapshot`

**Component**: `SnapshotCapture` (trigger button) + `SnapshotCard` (result display)

**Store**: reads `db_id` and `connection_id` from `alert.store.ts` (or dedicated `connection.store.ts`)

**Cache Invalidation**: on success → invalidate `['snapshots', connection_id]`
