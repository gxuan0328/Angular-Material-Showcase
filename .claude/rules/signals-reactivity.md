# Signals & Reactivity Rules

<!-- Always loaded. Signal-based state management for Angular v20+. -->
<!-- See angular-developer skill references: signals-overview, linked-signal, resource, effects. -->

## Core Signal Primitives

| Primitive | Purpose |
|---|---|
| `signal(initial)` | Writable reactive state |
| `computed(() => ...)` | Derived, memoized, lazy |
| `effect(() => ...)` | Side effects (logging, DOM, third-party integration) |
| `linkedSignal({ source, computation })` | Writable state linked to a source signal |
| `resource({ request, loader })` | Async data materialized as signal state |
| `input()` / `input.required()` | Signal-based component inputs |
| `output()` | Signal-based component outputs |
| `model()` | Two-way bindable signal input |
| `viewChild()` / `contentChild()` | Signal-based element queries |

## Mutation Rules

- **Never** call `.mutate()` on a signal (the API was removed).
- Use `.set(value)` for direct replacement.
- Use `.update(prev => next)` for transformations.
- For arrays and objects, return a **new** reference — do not mutate in place.

```ts
// ❌ Bad — in-place mutation breaks change detection
items().push(newItem);

// ✅ Good — new reference
items.update(list => [...list, newItem]);
```

## Exposing State from Services

Expose writable state as `readonly` to prevent external mutation:

```ts
@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  setUser(user: User): void {
    this._user.set(user);
  }
}
```

## Reactive Context Is Synchronous Only

Reactive contexts (`computed`, `effect`, `linkedSignal`, templates) track
signal reads **synchronously**. Reads after `await` are **not** tracked.
Always capture signal values **before** async boundaries.

```ts
// ❌ Wrong — theme() is read after await and not tracked
effect(async () => {
  const data = await fetchUser();
  console.log(theme());
});

// ✅ Correct — capture theme() before the await
effect(async () => {
  const currentTheme = theme();
  const data = await fetchUser();
  console.log(currentTheme);
});
```

Use `untracked(() => signal())` when you must read without creating a dependency.

## When NOT to Use `effect()`

- **Never** use `effect()` to sync one signal to another → use `computed()` or `linkedSignal()`.
- **Never** use `effect()` for async data fetching → use `resource()`.
- Reserve `effect()` for: logging, telemetry, `localStorage` persistence, third-party DOM integration.
- For DOM writes that must run after rendering, use `afterRenderEffect()`.

## `linkedSignal` — Dependent Writable State

Use when state derives from a source signal but must remain independently
writable (e.g., a draft form that resets when the source record id changes).

## `resource()` — Async State

Prefer `resource()` over manually combining `effect()` + `fetch()` + `set()`.
It exposes `value()`, `status()`, `error()`, and `isLoading()` as signals.

## Signal Inputs & Outputs (Required in v20+)

```ts
// ✅ Required — signal functions
readonly userId = input.required<string>();
readonly count = input(0, { transform: numberAttribute });
readonly saved = output<User>();

// ❌ Forbidden — legacy decorators
@Input() userId!: string;
@Output() saved = new EventEmitter<User>();
```
