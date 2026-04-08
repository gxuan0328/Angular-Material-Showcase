---
paths:
  - "**/*form*.ts"
  - "**/*form*.html"
  - "**/*forms*.ts"
---

# Forms Rules

<!-- Loads when editing form-related files. -->
<!-- See angular-developer skill references: signal-forms.md, reactive-forms.md, template-driven-forms.md -->

## Decision Tree

```
New form in a project using Angular v21+?
├── Yes → Signal Forms (first choice)
└── No ↓
    Complex validation / dynamic fields / async validators?
    ├── Yes → Reactive Forms
    └── No (1–2 fields, trivial) → Template-driven Forms
```

When modifying an existing form, **always match the project's current form strategy** — do not mix paradigms within a single feature.

## Signal Forms (Angular v21+)

- Uses signals for field state, validation, and submission status.
- Integrates with `computed()` and `effect()` naturally.
- Call `find_examples` via the `angular-cli` MCP server to retrieve current API patterns — do not rely on memory.
- Full details: `angular-developer` skill → `signal-forms.md`.

## Reactive Forms

- Build with `FormGroup`, `FormControl`, `FormArray`.
- Use **typed forms**:

  ```ts
  new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });
  ```

- Validate via built-in `Validators` or pure functions.
- Convert observables to signals with `toSignal()` when consumed in templates, so templates stay signal-first.
- Track dirty / touched / pristine via signals where possible.

## Template-driven Forms

- Only for trivial cases (1–2 fields, no complex validation).
- Use `[(ngModel)]` sparingly.
- Always set a `name` attribute on every input inside a `<form>`.

## Accessibility Requirements

- Every input must have an associated `<label for="...">` or `aria-label`.
- Mark required fields with `required` attribute **and** `aria-required="true"`.
- Associate validation errors via `aria-describedby` and `role="alert"`.
- On submit failure, programmatically focus the first invalid field.
- Group related controls with `<fieldset>` / `<legend>`.
