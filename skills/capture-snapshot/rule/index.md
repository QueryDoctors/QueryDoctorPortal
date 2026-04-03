# Rules: capture-snapshot

## UX Constraints

- Button disabled while mutation is in-flight (`isPending`)
- Show spinner inside button — not a full-screen overlay
- On success: show toast "Snapshot captured" + invalidate snapshots list
- On error (404): "Database connection not active — reconnect first"
- On error (500): "Capture failed — check database connectivity"
- Never navigate away on success — stay on dashboard, list refreshes

## Severity Display

Backend returns: `high` | `medium` | `low`
Map in service before rendering: `critical` | `warning` | `info`
Apply severity color system from `/design` to recommendation cards.

## Type Constraints

- `db_id`: never null when button is rendered — gate rendering on active connection
- `connection_id`: never null — same gate
- `captured_at`: format as relative time ("2 mins ago") using date-fns or Intl.RelativeTimeFormat
