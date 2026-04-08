---
paths:
  - "src/**/*.ts"
  - "projects/**/*.ts"
---

# Component Implementation Rules

<!-- Loads when editing component source files. -->

## Class Structure Order

Organize every component class in this exact order so reviewers can scan quickly:

1. **DI** via `inject()` field initializers
2. **Inputs** (`input()`, `input.required()`)
3. **Outputs** (`output()`)
4. **Queries** (`viewChild()`, `contentChild()`, `viewChildren()`)
5. **Local state** (`signal()`, `computed()`, `linkedSignal()`)
6. **Lifecycle hooks** (`ngOnInit`, `ngOnDestroy`, ...)
7. **Public methods**
8. **Private helpers**

Example:

```ts
export class Checkout implements OnInit {
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  readonly userId = input.required<string>();
  readonly saved = output<Order>();

  readonly formRef = viewChild<ElementRef<HTMLFormElement>>('form');

  protected readonly total = computed(() =>
    this.cart.items().reduce((sum, i) => sum + i.price, 0),
  );
  protected readonly isValid = signal(false);

  ngOnInit(): void {
    this.loadDraft();
  }

  submit(): void {
    /* ... */
  }

  private loadDraft(): void {
    /* ... */
  }
}
```

## Visibility

- `private` — internal implementation only.
- `protected` — used by the template but not externally.
- `public` (implicit) — component's external API only.
- `readonly` — always on inputs, outputs, queries, and injected services.

## Event Handler Naming

Name methods by the **action performed**, not by the event type.

- ✅ `saveUser()`, `deleteItem()`, `navigateToDetail()`
- ❌ `onClick()`, `handleSubmit()`, `clickHandler()`

## Business Logic Separation

Components focus on **presentation** only. Push business logic, data access, and complex transformations into services. Components orchestrate; services execute.

## Lifecycle Hooks

- Implement the interface (`implements OnInit`, `implements OnDestroy`).
- Keep hook bodies short — delegate to named methods.
- Prefer signals / `computed()` over `ngOnChanges`.
- Use `takeUntilDestroyed()` for observable cleanup instead of manual `ngOnDestroy` bookkeeping.

## Reactive vs Signal Forms

- v21+ new forms → Signal Forms (first choice).
- Complex existing forms → Reactive Forms.
- Trivial inputs → Template-driven Forms.
- Details: `.claude/rules/forms.md`.

## Accessibility Checklist (per component)

- Every interactive element has a focusable role and keyboard handler.
- Images use `NgOptimizedImage` (except inline base64).
- Buttons and links have discernible text (visible or `aria-label`).
- Color contrast meets WCAG AA.
- Focus management preserved on route transitions and dialog open/close.
