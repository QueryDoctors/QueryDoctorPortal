# Memory: capture-snapshot (Frontend)

## Design Tokens Used

- Trigger button: `bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100`
- Disabled: `opacity-50 cursor-not-allowed`
- Spinner: inline, same size as button text
- Recommendation cards in snapshot detail: use SeverityBadge + left border accent from `/design`

## Edge Cases

- `dbId` null → component renders nothing (no button shown)
- `connectionId` null → component renders nothing
- Empty `queries[]` → snapshot still valid, show "No query data available"
- Empty `recommendations[]` → show "No issues detected" (positive state, green-400)
- `rows` null on query → display "—" not 0
- `captured_at` must be formatted as relative time for display, absolute for tooltip

## Cache Behavior

- Snapshot detail is NOT refetched on interval — it's a historical record, immutable after capture
- Snapshot list IS refetched when `useCaptureSnapshot` succeeds (cache invalidation)
- `staleTime: Infinity` on individual snapshot detail queries — they never change
