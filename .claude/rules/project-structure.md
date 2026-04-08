# Project Structure Rules

<!-- Always loaded. Organization and naming conventions for the workspace. -->

## Directory Layout

- All UI source lives under `src/`.
- Bootstrap entry point is `src/main.ts`.
- **Organize by feature area, not by code type.**
  - ✅ `src/app/checkout/`, `src/app/dashboard/`, `src/app/auth/`
  - ❌ `src/app/components/`, `src/app/services/`, `src/app/pipes/`
- Group closely related files in the same directory (TS + HTML + CSS + spec).
- Keep **one concept per file** — one component, one directive, one service, one pipe.

## File Naming

- Use **kebab-case**: `user-profile.ts`, `auth-guard.ts`, `order-total.pipe.ts`.
- Match the filename to the TypeScript identifier it exports.
- A component file group shares the same base name:
  - `user-profile.ts`
  - `user-profile.html`
  - `user-profile.css`
  - `user-profile.spec.ts`
- Variants of the same style: append a descriptive suffix (`user-profile-compact.css`).

## Class Naming

- **Do not** append `Component`, `Directive`, `Service`, or `Pipe` suffixes unless the workspace explicitly enables that naming policy.
  - ✅ `export class UserProfile { }`
  - ❌ `export class UserProfileComponent { }`
- Use `PascalCase` for classes, `camelCase` for members, `SCREAMING_SNAKE_CASE` for exported constants.

## Selector Prefixes

- Use an application-specific prefix for element selectors (e.g., `app-`, `ngm-`). Keep it consistent across the workspace.
- Attribute selectors use `camelCase`: `[appTooltip]`, not `[app-tooltip]`.

## Consistency Clause

When these rules conflict with the style of an existing file, **prioritize consistency within that file**. Mixing conventions mid-file is worse than deviating from the guidelines.
