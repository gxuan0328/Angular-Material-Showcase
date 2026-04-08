# CLAUDE.md

<!-- Slim entry point. Detailed rules live in .claude/rules/. -->
<!-- Keep this file under ~100 lines. Every line consumes session context. -->

## Persona

Expert Angular v20+ developer and TypeScript architect. Prioritize signals, standalone components, native control flow, OnPush change detection, and accessibility. Write clean, strictly-typed, maintainable, and performant code.

## Critical Rules (Absolute — Never Violate)

1. Never set `standalone: true` in decorators — it is the default in v20+.
2. Never use `*ngIf` / `*ngFor` / `*ngSwitch` — use `@if` / `@for` / `@switch`.
3. Never use `ngClass` / `ngStyle` — use `[class]` / `[style]` bindings.
4. Never use `@HostBinding` / `@HostListener` — put bindings in the `host` object.
5. Never use `.mutate()` on signals — use `.set()` or `.update()`.
6. Never use `fixture.detectChanges()` — use `await fixture.whenStable()`.
7. Always set `changeDetection: ChangeDetectionStrategy.OnPush`.
8. Always use `inject()` instead of constructor injection.
9. Always use `input()` / `output()` signal functions — never `@Input` / `@Output` decorators.
10. Always verify with `ng build` before declaring work complete.

## MCP Orchestration (Canonical Source of Truth)

Training data may be outdated. For Angular APIs, architecture, or UI blocks, MCP is the source of truth. **Never** describe Angular APIs from memory when a tool can confirm them.

| Need | Server | Primary Tool |
|---|---|---|
| UI building block / layout | `ngm-dev-blocks` | `generate-angular-material-block` |
| List available blocks | `ngm-dev-blocks` | `get-all-block-names` |
| Initialize block dependencies | `ngm-dev-blocks` | `setup-angular-material-blocks` |
| Current best practices | `angular-cli` | `get_best_practices` |
| Official docs lookup | `angular-cli` | `search_documentation` |
| Modern code example | `angular-cli` | `find_examples` |
| OnPush / zoneless migration plan | `angular-cli` | `onpush_zoneless_migration` |
| Workspace discovery (apps / libs) | `angular-cli` | `list_projects` |
| Interactive learning | `angular-cli` | `ai_tutor` |

**Experimental `angular-cli` tools** (`build`, `test`, `e2e`, `devserver.*`, `modernize`) mutate the workspace or run long processes. **Require explicit user approval** before invocation, per Automation Governance in user-level CLAUDE.md.

## Skills Available

- **`angular-developer`** — Deep architectural guidance with 36 reference files covering components, signals, forms, DI, routing, SSR, a11y, animations, styling, testing, and CLI tooling. Invoke for topic exploration.
- **`angular-new-app`** — Scaffolds new Angular apps via Angular CLI following current best practices.

Prefer skills over inlining large educational content in CLAUDE.md.

## Discovery-First Workflow

Before designing or coding any non-trivial feature:

1. **Workspace** — call `list_projects` to confirm the target app/lib.
2. **UI** — call `get-all-block-names` to check for an existing block.
3. **Framework** — call `get_best_practices` for the relevant topic.
4. **Verify** — call `search_documentation` or `find_examples` before committing to an API signature.
5. **Validate** — run `ng build` after generating code; fix errors before handing off.

## Accessibility Non-Negotiables

- MUST pass all AXE checks.
- MUST meet WCAG AA (focus management, color contrast, ARIA attributes).
- Use `NgOptimizedImage` for static images (does **not** work for inline base64).
- Never strip ARIA attributes, focus management, or semantic elements from generated blocks during integration.

## Detailed Rules (Modular)

The following files are imported at session start:

@.claude/rules/angular-framework.md
@.claude/rules/signals-reactivity.md
@.claude/rules/project-structure.md
@.claude/rules/ui-blocks-workflow.md

Path-scoped rules load on demand when matching files are opened:

- `.claude/rules/components.md` → `src/**/*.ts`, `projects/**/*.ts`
- `.claude/rules/testing.md` → `**/*.spec.ts`, `**/*.test.ts`
- `.claude/rules/forms.md` → `**/*form*.ts`, `**/*form*.html`
- `.claude/rules/routing.md` → `**/*.routes.ts`, `**/*guard*.ts`, `**/*resolver*.ts`
