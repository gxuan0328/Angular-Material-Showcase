# Angular Framework Rules

<!-- Always loaded. Framework-wide v20+ rules. -->
<!-- See angular-developer skill for deeper references on each topic. -->

## Components

- Prefer inline `template` for small components; use `templateUrl` / `styleUrl` (paths relative to the TS file) for larger ones.
- Split a component into `.ts`, `.html`, `.css` when logic or template become non-trivial.
- Do **not** append `Component` suffix to class names unless the workspace explicitly configures that naming policy.
- Declare used components, directives, and pipes via the `imports` array.
- Use `protected` access for members referenced only in templates.
- Mark `input()`, `output()`, and `viewChild` / `contentChild` queries as `readonly`.

## Component Metadata

Every component must set `changeDetection: ChangeDetectionStrategy.OnPush`.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.html',
  styleUrl: './feature.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feature { /* ... */ }
```

## Template Control Flow

- Use `@if` / `@else if` / `@else` — never `*ngIf`.
- Use `@for (item of items(); track item.id)` — the `track` expression is **required**.
- Use `@switch` / `@case` / `@default`; add `@default never;` for exhaustive union-type checks.
- `@for` implicit variables: `$index`, `$count`, `$first`, `$last`, `$even`, `$odd`.
- Use `@if (expr(); as alias)` to reuse the resolved value.

## Template Bindings

- Use `[class.active]="isActive()"` or `[class]="classObj()"` — never `ngClass`.
- Use `[style.color]="color()"` or `[style]="styleObj()"` — never `ngStyle`.
- Use the `async` pipe only when an observable cannot be converted to a signal; prefer signals.
- Import pipes explicitly in the component's `imports` array.
- Keep templates simple — move calculations into `computed()` signals.

## Host Element Bindings

Put host bindings in the `host` metadata object. Never use `@HostBinding` or `@HostListener` decorators.

```ts
@Component({
  selector: 'app-button',
  host: {
    '[class.disabled]': 'isDisabled()',
    '[attr.aria-pressed]': 'isPressed()',
    '(click)': 'onActivate()',
    'role': 'button',
  },
})
export class Button { /* ... */ }
```

## Dependency Injection

- Use `inject()` in class field initializers:

  ```ts
  private readonly router = inject(Router);
  ```

- Never use constructor parameter injection in new code.
- Services are singletons by default: `@Injectable({ providedIn: 'root' })`.
- Functional guards and resolvers run in injection context — call `inject()` directly.
- For dynamic injection outside a context, wrap with `runInInjectionContext()`.

## Forms Quick Reference

- Angular v21+ with a new form → **Signal Forms**.
- Complex existing form → **Reactive Forms**.
- Trivial existing form → **Template-driven Forms**.
- Full rules: `.claude/rules/forms.md`.

## TypeScript Discipline

- Strict type checking is always on.
- Prefer type inference for obvious locals; annotate every public API.
- Never use `any` — use `unknown` when the type is genuinely uncertain.
- Provide explicit return types on every public method.
- Never suppress errors with `// @ts-ignore` — fix the underlying type.
