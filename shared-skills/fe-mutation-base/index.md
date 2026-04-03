---
name: fe-mutation-base
type: shared-skill
layer: frontend
version: 1.0
last_updated: 2026-04-03
used_by: [capture-snapshot]
---

# Shared Skill: fe-mutation-base

Reusable pattern for every `useMutation` hook (POST/DELETE actions).

## Pattern: Mutation Hook with Cache Invalidation

```typescript
export function useCreateXxx() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateXxxRequest) => createXxx(body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['xxx'] })  // invalidate list
      // optional: queryClient.setQueryData(['xxx', data.id], data)  // optimistic set
    },
  })
}

export function useDeleteXxx() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteXxx(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['xxx'] })
      queryClient.removeQueries({ queryKey: ['xxx', id] })
    },
  })
}
```

## Pattern: Component Wiring

```tsx
const { mutate, isPending, error } = useCreateXxx()

// Button: disabled while pending, spinner inside (not full-screen)
<button disabled={isPending} onClick={() => mutate(formData)}>
  {isPending ? <Spinner /> : 'Submit'}
</button>

// Error: inline below form/button — not toast
{error && <ErrorMessage message={error.message} />}
```

## Error UX by Status

| HTTP | UX Response |
|------|-------------|
| 404 | "Not found — check active connection" |
| 400 | Inline form error (field-level if possible) |
| 500 | "Request failed — retry" with retry button |
| network | "Cannot reach API server" |

## Rules

- `isPending` → disable trigger button, show inline spinner
- Success → `invalidateQueries` for affected list keys
- Error → inline message, never silent, always offer retry
- Toast only for success confirmation — error goes inline
- File location: `features/<name>/hooks/use<Action><Name>.ts`
