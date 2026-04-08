---
paths:
  - "**/*.spec.ts"
  - "**/*.test.ts"
---

# Testing Rules

<!-- Loads when editing test files. -->
<!-- See angular-developer skill → testing-fundamentals.md, component-harnesses.md, router-testing.md -->

## Philosophy: Zoneless & Async-First

Angular v20+ moves toward zoneless change detection. Tests must be async-aware.

- **Never** call `fixture.detectChanges()` to manually trigger updates.
- **Always** follow the **Act → Wait → Assert** pattern.

## Act → Wait → Assert

```ts
it('should update the heading after a state change', async () => {
  // ACT
  component.title.set('New Title');

  // WAIT
  await fixture.whenStable();

  // ASSERT
  expect(h1.textContent).toContain('New Title');
});
```

## Test Setup

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent], // standalone components go in imports
  }).compileComponents();

  fixture = TestBed.createComponent(MyComponent);
  component = fixture.componentInstance;
});
```

## Fixture API

- `fixture.componentInstance` — the component class instance.
- `fixture.nativeElement` — the root DOM element.
- `fixture.debugElement.query(By.css(...))` — safer platform-agnostic queries.
- `await fixture.whenStable()` — wait for all scheduled updates to flush.

## Preferred Patterns

- **Component harnesses** for Material / CDK components — avoid raw DOM selectors.
- **`RouterTestingHarness`** for router-dependent navigation tests.
- **Signal inputs** set via `fixture.componentRef.setInput('name', value)`.
- **Mocks**: provide via `TestBed.configureTestingModule({ providers: [{ provide: Svc, useValue: mock }] })`.

## Do Not

- Do not use `fakeAsync` / `tick()` unless absolutely necessary — prefer native `async` / `await fixture.whenStable()`.
- Do not call `fixture.detectChanges()`.
- Do not test implementation details — test observable behavior.
- Do not skip `await fixture.whenStable()` between acts and asserts.

## Coverage Target

80% per user-level CLAUDE.md. Integration tests required for:

- External HTTP dependencies (mock at `HttpClient` level, not `fetch`).
- Critical data flows (auth, checkout, permissions).
- Route navigation with guards or resolvers.

## Test File Location

Co-locate tests next to the source: `feature.ts` ↔ `feature.spec.ts` in the same directory.
