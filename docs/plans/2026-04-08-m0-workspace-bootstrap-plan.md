# Milestone M0 — Workspace Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec reference:** `docs/2026-04-08-material-block-showcase-design.md` §13 (M0) and §4 (architecture).

**Goal:** Bootstrap a clean Angular 20 zoneless workspace with Angular Material 20.2.5 + Tailwind 4.1.12, four empty layout shells, a signal-based ThemeStore/AuthStore/authMatchGuard, a block source bake script, and a verified `@ngm-dev/cli` pipeline that can download free **and** paid blocks — ready for M1 to start shipping Catalog pages.

**Architecture:** Single Angular application organised by feature area (no Nx). Top-level routing splits into four lazy-loaded shells: Landing / Catalog / Admin / Auth. State management uses signal-based singleton stores. Block source comes from `@ngm-dev/cli add` into `src/app/blocks/<registry-category>/<variant>/`, then a build-time Node script bakes those files into `src/assets/block-sources/<registry-category>__<variant>.json` for Catalog pages to inline. No runtime MCP dependency.

**Tech Stack:** Angular 20 (zoneless) · Angular Material 20.2.5 · Angular CDK 20.2.5 · Tailwind CSS 4.1.12 · PostCSS 8.5.6 · `@ngm-dev/cli` 2.0.2 · `ng2-charts` ^8 · `chart.js` ^4 · Karma + Jasmine · ESLint + angular-eslint + Prettier · TypeScript strict.

---

## Known Environment Constraint (revision to spec R3)

**Spec §16 R3 states:** "Host the working copy under `/home/gxuan/workspace/angular-material-block-showcase` (native Linux filesystem)".

**Reality (verified 2026-04-08):** `/home/gxuan/workspace/Project/angular-material-block` is a **symlink** to `/mnt/c/Users/gxuan/OneDrive/桌面/Project/angular-material-block` — both paths resolve to the same Windows-mounted NTFS location. Creating a truly native Linux directory (e.g., `/home/gxuan/workspace/angular-material-block-showcase`) would put the code outside the agent's configured working directories and break tool access.

**M0 decision:** the Angular workspace lives at the **existing project root** (`/mnt/c/Users/gxuan/OneDrive/桌面/Project/angular-material-block/`) alongside `CLAUDE.md`, `.claude/`, `.mcp.json`, and `docs/`. WSL-mount latency (≈3–5× slower `ng serve` and `ng build` compared to native Linux) is **accepted** for M0–M4. If this becomes a blocker in later milestones, a follow-up task can re-host the repo under a native Linux path once the agent's working directory allowlist is expanded.

---

## File Structure

### Created by `ng new`

These files are produced by the Angular CLI and merged into the project root:

- `package.json`, `package-lock.json`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`
- `karma.conf.js`
- `.gitignore`, `.editorconfig`, `.vscode/` (if present)
- `src/main.ts`, `src/index.html`, `src/styles.css`, `src/favicon.ico`
- `src/app/app.ts`, `src/app/app.html`, `src/app/app.css`, `src/app/app.spec.ts`
- `src/app/app.config.ts`, `src/app/app.routes.ts`
- `public/favicon.ico`

### Created by `@ngm-dev/cli init`

- `ngm-dev-cli.json` — project config
- `.postcssrc.json` — PostCSS + Tailwind config
- Modifications to `angular.json` (style entries), `package.json` (tailwindcss, @angular/material, @angular/cdk, @tailwindcss/postcss, postcss peer deps)

### Authored in this plan

| Path | Responsibility |
| --- | --- |
| `src/app/core/layout/models.ts` | Shared types: `ShellLink`, `NavItem`, `Breadcrumb`, `Category` enums |
| `src/app/core/theme/theme-store.ts` | Signal-based `ThemeStore` (light/dark/system + localStorage) |
| `src/app/core/theme/theme-store.spec.ts` | Unit tests |
| `src/app/core/auth/auth-store.ts` | Signal-based `AuthStore` (mock JWT, localStorage persistence) |
| `src/app/core/auth/auth-store.spec.ts` | Unit tests |
| `src/app/core/auth/auth-match.guard.ts` | Functional `CanMatchFn` redirecting to `/auth/sign-in` |
| `src/app/core/auth/auth-match.guard.spec.ts` | Unit tests |
| `src/app/core/mock-api/index.ts` | Barrel file (empty for now; populated in M2) |
| `src/app/core/i18n/i18n-store.ts` | Stub `I18nStore` (zh-TW dictionary loader; empty for now) |
| `src/app/layouts/landing-layout/landing-layout.ts` | Landing shell (marketing frame) |
| `src/app/layouts/landing-layout/landing-layout.html` | Template (header + `<router-outlet/>` + footer placeholder) |
| `src/app/layouts/landing-layout/landing-layout.css` | Minimal CSS |
| `src/app/layouts/landing-layout/landing-layout.spec.ts` | Smoke test |
| `src/app/layouts/catalog-layout/catalog-layout.{ts,html,css,spec.ts}` | Docs-style shell (left tree placeholder + `<router-outlet/>`) |
| `src/app/layouts/admin-layout/admin-layout.{ts,html,css,spec.ts}` | SaaS admin shell (top bar + side nav placeholder + `<router-outlet/>`) |
| `src/app/layouts/auth-layout/auth-layout.{ts,html,css,spec.ts}` | Minimal centered card |
| `src/app/landing/landing-page.ts` | Placeholder "Landing" component |
| `src/app/landing/landing.routes.ts` | `LANDING_ROUTES` |
| `src/app/catalog/catalog-index.ts` | Placeholder "Catalog" component |
| `src/app/catalog/catalog.routes.ts` | `CATALOG_ROUTES` |
| `src/app/app-shell/dashboard/dashboard.ts` | Placeholder "Dashboard" component |
| `src/app/app-shell/app-shell.routes.ts` | `APP_SHELL_ROUTES` |
| `src/app/auth/sign-in/sign-in.ts` | Placeholder "Sign In" component |
| `src/app/auth/auth.routes.ts` | `AUTH_ROUTES` |
| `src/assets/mock-data/.gitkeep` | Holds the directory in git |
| `src/assets/block-sources/.gitkeep` | Holds the directory in git |
| `src/assets/i18n/zh-TW.json` | Empty dictionary `{}` for M0 |
| `scripts/bake-block-sources.ts` | Node script walking `src/app/blocks/` → `src/assets/block-sources/*.json` |
| `scripts/bake-block-sources.spec.ts` | Jasmine-compatible spec (run via `node --test` wrapper or `karma` if we wire it) — **runs standalone via `tsx`** |
| `.eslintrc.json` | ESLint config (angular-eslint + prettier) |
| `.prettierrc.json` | Prettier config |
| `docs/CHANGELOG.md` | Milestone changelog — M0 entry |
| `.gitignore` (patched) | Add `src/assets/block-sources/*.json` (baked artefacts) if desired; keep block source subdirs tracked |

### Produced by `@ngm-dev/cli add` during smoke test

- `src/app/blocks/free-page-shells/page-shell-1/page-shell-1.component.html`
- `src/app/blocks/free-page-shells/page-shell-1/page-shell-1.component.ts`
- `src/app/blocks/page-shells/page-shell-2/page-shell-2.component.html`
- `src/app/blocks/page-shells/page-shell-2/page-shell-2.component.ts`

---

## Pre-Flight Environment

The plan assumes:

- Node 20+ and npm 10+ installed (verified: `node v22.22.0`, `npm 10.9.4`)
- `npx` ≥ 10
- WSL Ubuntu with access to `/mnt/c/Users/gxuan/OneDrive/桌面/Project/angular-material-block`
- Current directory `/mnt/c/Users/gxuan/OneDrive/桌面/Project/angular-material-block` contains only:
  - `.claude/`, `.mcp.json`, `CLAUDE.md`, `CLAUDE.md.v1.bak`, `docs/`, `tmp/`
  - **No** `package.json`, `angular.json`, or `src/`
- `~/.config/@ngm-dev/cli-nodejs/config.json` contains a refreshed token bound to this machine (R2 mitigation executed by user before M0 starts)

---

## Task 1 — Pre-Flight Verification

**Goal:** Confirm the environment is in the expected state before any code changes.

**Files:** _(none — read-only checks)_

- [ ] **Step 1: Verify Node, npm, npx versions**

Run:
```bash
node --version && npm --version && npx --version
```
Expected: node ≥ v20, npm ≥ 10, npx ≥ 10.

- [ ] **Step 2: Verify working directory contents**

Run:
```bash
cd "/mnt/c/Users/gxuan/OneDrive/桌面/Project/angular-material-block"
ls -A
```
Expected output (order may vary):
```
.claude  .mcp.json  CLAUDE.md  CLAUDE.md.v1.bak  docs  tmp
```
If any of `package.json`, `angular.json`, `node_modules`, `src` is present, **STOP** and ask the user how to proceed — this plan assumes a clean workspace.

- [ ] **Step 3: Verify `@ngm-dev/cli` auth token is present and bound**

Run:
```bash
cat ~/.config/@ngm-dev/cli-nodejs/config.json
```
Expected: JSON with `http-https://ui → angular-material → dev-token` populated and `http-username-https://ui → angular-material → dev-token` set to the account email.

- [ ] **Step 4: Verify paid block download works end-to-end**

Run in a scratch directory:
```bash
mkdir -p /tmp/m0-preflight && cd /tmp/m0-preflight
cat > package.json <<'EOF'
{"name":"m0-preflight","version":"0.0.0","private":true}
EOF
cat > ngm-dev-cli.json <<'EOF'
{
  "$schema": "https://unpkg.com/@ngm-dev/cli/schemas/project-config.json",
  "repos": ["https://ui.angular-material.dev/api/registry"],
  "includeTests": false,
  "watermark": true,
  "paths": { "*": "./src/app/blocks" },
  "configFiles": {}
}
EOF
npx -y @ngm-dev/cli add page-shells/page-shell-2 \
  --angular-version 20 --allow --yes \
  --skip-installing-dependencies --skip-asking-for-dependencies
```
Expected: final line `All done!`, and `ls src/app/blocks/page-shells/page-shell-2/` lists `page-shell-2.component.html` and `page-shell-2.component.ts`.
If the command returns `401 Unauthorized — Token is bound to a different machine`, **STOP**. Execute the R2 auth-refresh procedure from the spec (run `npx @ngm-dev/cli auth --force`, regenerate a fresh token at `https://ui.angular-material.dev/account/tokens`, then `npx @ngm-dev/cli auth http --username <email> --token <new-token>`) and re-run this step.

- [ ] **Step 5: Clean up scratch directory**

Run:
```bash
rm -rf /tmp/m0-preflight
```

No commit for this task.

---

## Task 2 — Create the Angular Workspace

**Goal:** Produce a fresh Angular 20 zoneless workspace and lift its files into the project root so the Angular workspace sits alongside `CLAUDE.md` and `docs/`.

**Files:**
- Create (via `ng new`): `package.json`, `package-lock.json`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`, `karma.conf.js`, `.gitignore`, `.editorconfig`, `.vscode/extensions.json`, `src/*`, `public/favicon.ico`

- [ ] **Step 1: Confirm `ng` binary availability via `npx`**

Run:
```bash
npx -y @angular/cli@20 version 2>&1 | head -20
```
Expected: Angular CLI version 20.x reported.

- [ ] **Step 2: Create a throwaway workspace in `/tmp`**

Run:
```bash
rm -rf /tmp/ng-scaffold && mkdir -p /tmp/ng-scaffold && cd /tmp/ng-scaffold
npx -y @angular/cli@20 new angular-material-block-showcase \
  --directory . \
  --routing \
  --style=css \
  --strict \
  --zoneless \
  --package-manager=npm \
  --test-runner=karma \
  --skip-install \
  --skip-git
```
Expected: workspace files generated in `/tmp/ng-scaffold/` with zero errors. `--skip-install` defers `npm install` until after files are merged into the real project root.

- [ ] **Step 3: Verify scaffold structure**

Run:
```bash
ls -A /tmp/ng-scaffold
test -f /tmp/ng-scaffold/package.json && \
  test -f /tmp/ng-scaffold/angular.json && \
  test -f /tmp/ng-scaffold/src/main.ts && \
  test -f /tmp/ng-scaffold/src/app/app.config.ts && \
  echo "SCAFFOLD OK"
```
Expected: `SCAFFOLD OK`.

- [ ] **Step 4: Merge scaffold into project root**

Run:
```bash
cd "/mnt/c/Users/gxuan/OneDrive/桌面/Project/angular-material-block"
# Copy every file, including dotfiles, from scaffold into root.
# Fail loudly on any path collision.
shopt -s dotglob
for entry in /tmp/ng-scaffold/*; do
  name="$(basename "$entry")"
  if [ -e "./$name" ]; then
    echo "COLLISION: $name already exists"
    exit 1
  fi
  cp -R "$entry" "./$name"
done
shopt -u dotglob
rm -rf /tmp/ng-scaffold
ls -A
```
Expected: no `COLLISION` output. Project root now lists the original files (`.claude`, `.mcp.json`, `CLAUDE.md`, `CLAUDE.md.v1.bak`, `docs`, `tmp`) plus all files produced by `ng new` (`.editorconfig`, `.gitignore`, `angular.json`, `package.json`, `src`, etc.).

- [ ] **Step 5: Install npm dependencies**

Run:
```bash
npm install
```
Expected: dependencies install without errors. `node_modules/` appears. `package-lock.json` is created.

- [ ] **Step 6: Verify the baseline build is green**

Run:
```bash
npm run build -- --configuration development
```
Expected: build succeeds. Output goes to `dist/angular-material-block-showcase/`.

- [ ] **Step 7: Verify the baseline test run is green**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless
```
Expected: 1 default test (the `ng new`-generated `app.spec.ts`) passes.

- [ ] **Step 8: Commit the scaffold**

Run:
```bash
git init -q
git add -A
git commit -m "feat(m0): scaffold Angular 20 zoneless workspace

Generated via:
  ng new angular-material-block-showcase --directory . --routing --style=css \\
    --strict --zoneless --package-manager=npm --test-runner=karma

Baseline ng build and ng test pass."
```

If git was already initialised (unlikely since the spec repo has no .git), reuse the existing repo and omit `git init`.

---

## Task 3 — Tune Angular Config for Feature-Area Layout

**Goal:** Adjust `angular.json`, `tsconfig.json`, and `src/app/app.config.ts` to match the rules in `.claude/rules/*` — OnPush-friendly, strict templates, path aliases, and the `app-` selector prefix already matches Angular CLI default so no change needed.

**Files:**
- Modify: `tsconfig.json`
- Modify: `src/app/app.config.ts`
- Modify: `src/app/app.ts`, `src/app/app.html` (remove default hello world)

- [ ] **Step 1: Read current `tsconfig.json`**

Run:
```bash
cat tsconfig.json
```
Verify it has `"strict": true` (from `--strict`). Verify `"experimentalDecorators"` is **not** present. Verify `"moduleResolution": "bundler"`.

- [ ] **Step 2: Add path alias for `@core` and `@layouts`**

Edit `tsconfig.json` `compilerOptions` to add:
```jsonc
{
  "compilerOptions": {
    // ... existing options ...
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@layouts/*": ["src/app/layouts/*"]
    }
  }
}
```

Expected: the file parses as valid JSON with comments (`tsconfig` allows comments).

- [ ] **Step 3: Inspect `src/app/app.config.ts`**

Run:
```bash
cat src/app/app.config.ts
```
Expected: file already imports `provideZonelessChangeDetection` (or equivalent) because `--zoneless` was passed. Note the exact import.

- [ ] **Step 4: Replace `src/app/app.config.ts` content**

Write:
```ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
  ],
};
```

If `provideBrowserGlobalErrorListeners` is not exported in the installed Angular version, remove that line and the import (Angular 20.0 vs 20.2 vary). Run `npm ls @angular/core | head -5` to confirm the installed minor version if needed.

- [ ] **Step 5: Replace `src/app/app.ts` content**

Write:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
```

- [ ] **Step 6: Replace `src/app/app.html` content**

Write:
```html
<router-outlet />
```

- [ ] **Step 7: Verify build and tests still pass**

Run:
```bash
npm run build -- --configuration development
npm test -- --watch=false --browsers=ChromeHeadless
```
Expected: both pass.

- [ ] **Step 8: Commit**

Run:
```bash
git add tsconfig.json src/app/app.config.ts src/app/app.ts src/app/app.html
git commit -m "feat(m0): tune app shell for zoneless + feature-area layout

- Add @core/* and @layouts/* path aliases
- Trim app.ts to router-outlet host
- Wire HttpClient (fetch), async animations, component input binding"
```

---

## Task 4 — Initialise `@ngm-dev/cli` Project Config

**Goal:** Run `@ngm-dev/cli init` to install Tailwind + Angular Material peer deps, create `postcssrc.json`, patch `angular.json`, and create `ngm-dev-cli.json`. Then edit `ngm-dev-cli.json` so that blocks install to `src/app/blocks/` as per the spec.

**Files:**
- Create: `ngm-dev-cli.json`, `.postcssrc.json`
- Modify: `package.json` (dependencies), `angular.json` (styles entry), `src/styles.css` (Tailwind directives)

- [ ] **Step 1: Run `@ngm-dev/cli init`**

Run:
```bash
npx -y @ngm-dev/cli init --angular-version 20 --yes
```
Expected: non-interactive run that
- creates `ngm-dev-cli.json`
- creates `.postcssrc.json`
- installs `tailwindcss@4.1.12`, `@tailwindcss/postcss@4.1.12`, `postcss@8.5.6`, `@angular/material@20.2.5`, `@angular/cdk@20.2.5`
- patches `angular.json` to include `./node_modules/@angular/material/prebuilt-themes/*.css` or a custom theme entry
- configures Material Symbols (link tag in `src/index.html`)

If `--yes` is not supported, re-run without it and answer prompts with the defaults.

- [ ] **Step 2: Verify peer dep versions**

Run:
```bash
node -e "const p=require('./package.json');const deps={...p.dependencies,...p.devDependencies};console.log(JSON.stringify({tailwindcss:deps.tailwindcss,postcss:deps.postcss,'@tailwindcss/postcss':deps['@tailwindcss/postcss'],'@angular/material':deps['@angular/material'],'@angular/cdk':deps['@angular/cdk']},null,2));"
```
Expected:
```
{
  "tailwindcss": "4.1.12",
  "postcss": "8.5.6",
  "@tailwindcss/postcss": "4.1.12",
  "@angular/material": "20.2.5",
  "@angular/cdk": "20.2.5"
}
```
If any version differs, **STOP** and escalate — the spec §4.3 locks these versions.

- [ ] **Step 3: Overwrite `ngm-dev-cli.json` to match spec §4.4**

Write the file exactly:
```json
{
  "$schema": "https://unpkg.com/@ngm-dev/cli/schemas/project-config.json",
  "repos": ["https://ui.angular-material.dev/api/registry"],
  "includeTests": false,
  "watermark": true,
  "formatter": "prettier",
  "paths": {
    "*": "./src/app/blocks"
  },
  "configFiles": {}
}
```

- [ ] **Step 4: Confirm `src/styles.css` has Tailwind + Material Symbols bootstrap**

Run:
```bash
cat src/styles.css
```
Expected: at minimum an `@import "tailwindcss";` line (Tailwind 4 syntax) and whatever Material theme import `@ngm-dev/cli init` added. If `src/styles.css` is empty, append:
```css
@import "tailwindcss";
@import "@angular/material/core/tokens/m3-theme.css";
```
(adjust the Material import path to whatever the installed Angular Material version uses).

- [ ] **Step 5: Run build to verify the integration is healthy**

Run:
```bash
npm run build -- --configuration development
```
Expected: build succeeds. Any Tailwind or PostCSS error here must be fixed before continuing.

- [ ] **Step 6: Commit**

Run:
```bash
git add package.json package-lock.json angular.json ngm-dev-cli.json .postcssrc.json src/styles.css src/index.html
git commit -m "feat(m0): initialise ngm-dev cli + install Material 20.2.5 + Tailwind 4.1.12

- Run @ngm-dev/cli init --angular-version 20
- Install locked peer deps (material, cdk, tailwindcss, postcss)
- Configure ngm-dev-cli.json paths to src/app/blocks
- Bootstrap Material Symbols and Tailwind directives in styles.css"
```

---

## Task 5 — Install Runtime Runtime Dependencies

**Goal:** Install the remaining runtime libraries the showcase needs: `ng2-charts` + `chart.js` for chart blocks, `@axe-core/angular` for a11y tests, Inter + JetBrains Mono font packages, and `tsx` for running TS scripts in Node.

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install chart libraries**

Run:
```bash
npm install ng2-charts@^8.0.0 chart.js@^4.3.0
```
Expected: both packages added to `dependencies` with the requested version ranges.

- [ ] **Step 2: Install font packages**

Run:
```bash
npm install @fontsource/inter @fontsource/jetbrains-mono
```
Expected: both packages added to `dependencies`.

- [ ] **Step 3: Install dev dependencies**

Run:
```bash
npm install --save-dev tsx @axe-core/playwright @types/node
```
Expected: added to `devDependencies`. `@axe-core/playwright` is for future e2e tests (not used in M0); `tsx` is used to run `scripts/bake-block-sources.ts`.

- [ ] **Step 4: Wire fonts into `src/styles.css`**

Prepend to `src/styles.css`:
```css
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/inter/700.css";
@import "@fontsource/jetbrains-mono/400.css";
```

- [ ] **Step 5: Run build to confirm fonts resolve**

Run:
```bash
npm run build -- --configuration development
```
Expected: build succeeds.

- [ ] **Step 6: Commit**

Run:
```bash
git add package.json package-lock.json src/styles.css
git commit -m "feat(m0): install chart, font, a11y, and script dependencies

- ng2-charts ^8, chart.js ^4 (for chart blocks)
- @fontsource/inter, @fontsource/jetbrains-mono
- tsx (for bake script), @axe-core/playwright, @types/node"
```

---

## Task 6 — Configure ESLint + Prettier

**Goal:** Add angular-eslint with the rules from `.claude/rules/*` (no `standalone:true`, no `ngClass`/`ngStyle`, kebab-case selectors, signal inputs/outputs) plus Prettier. Verify `npm run lint` passes on the generated scaffold.

**Files:**
- Create: `.prettierrc.json`
- Create (or modify): `eslint.config.js` OR `.eslintrc.json` (depends on ng-eslint schematic output)
- Modify: `package.json` (add `lint` script)

- [ ] **Step 1: Add angular-eslint via schematic**

Run:
```bash
npx ng add @angular-eslint/schematics@20 --skip-confirmation
```
Expected: installs `@angular-eslint/*` + `@typescript-eslint/*`, adds `eslint.config.js` (flat config), adds a `lint` target in `angular.json`, updates `package.json` with a `lint` script.

- [ ] **Step 2: Verify `npm run lint` runs**

Run:
```bash
npm run lint
```
Expected: either "All files pass linting" (on the skeleton) or a short list of auto-fixable warnings.

- [ ] **Step 3: Write `.prettierrc.json`**

Create with:
```json
{
  "$schema": "https://json.schemastore.org/prettierrc.json",
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

- [ ] **Step 4: Install Prettier and eslint-config-prettier**

Run:
```bash
npm install --save-dev prettier eslint-config-prettier
```

- [ ] **Step 5: Read existing `eslint.config.js`**

Run:
```bash
cat eslint.config.js
```
Note the current structure (the `@angular-eslint/schematics` generates a flat config array).

- [ ] **Step 6: Extend `eslint.config.js` to integrate Prettier and project rules**

Append to the `eslint.config.js` exported array (keep what angular-eslint generated, then add):
```js
// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/no-host-metadata-property": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
```
If `eslint.config.js` already has a similar structure from the schematic, merge the new rules into the existing config rather than overwriting it wholesale.

- [ ] **Step 7: Add `format` script to `package.json`**

Open `package.json` and add to `"scripts"`:
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,html,css,json}\" \"scripts/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,css,json}\" \"scripts/**/*.ts\""
  }
}
```

- [ ] **Step 8: Run format + lint**

Run:
```bash
npm run format
npm run lint
npm run build -- --configuration development
```
Expected: all three succeed.

- [ ] **Step 9: Commit**

Run:
```bash
git add .
git commit -m "feat(m0): configure ESLint (angular-eslint) + Prettier

- Install @angular-eslint/schematics + eslint-config-prettier
- Enforce app- selector prefix (kebab element / camel attribute)
- Disable prefer-standalone (default in v20+) and no-host-metadata-property
- Add format / format:check scripts"
```

---

## Task 7 — Core Types (`src/app/core/layout/models.ts`)

**Goal:** Define shared types used by all four layouts and future feature modules.

**Files:**
- Create: `src/app/core/layout/models.ts`
- Create: `src/app/core/layout/models.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/core/layout/models.spec.ts`:
```ts
import { NavItem, Breadcrumb, ShellLink, BlockDisplayCategory } from './models';

describe('core/layout/models', () => {
  it('NavItem carries a label, path, icon, and optional children', () => {
    const item: NavItem = {
      label: '儀表板',
      path: '/app/dashboard',
      icon: 'dashboard',
      children: [],
    };
    expect(item.label).toBe('儀表板');
    expect(item.path).toBe('/app/dashboard');
    expect(item.icon).toBe('dashboard');
    expect(item.children).toEqual([]);
  });

  it('Breadcrumb requires label and optional href', () => {
    const crumb: Breadcrumb = { label: '使用者', href: '/app/users' };
    expect(crumb.label).toBe('使用者');
    expect(crumb.href).toBe('/app/users');
  });

  it('ShellLink has label + external flag', () => {
    const link: ShellLink = { label: 'Docs', href: 'https://angular.dev', external: true };
    expect(link.external).toBe(true);
  });

  it('BlockDisplayCategory enumerates the three families', () => {
    const a: BlockDisplayCategory = 'application';
    const b: BlockDisplayCategory = 'marketing';
    const c: BlockDisplayCategory = 'enhanced';
    expect([a, b, c]).toEqual(['application', 'marketing', 'enhanced']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/core/layout/models.spec.ts"
```
Expected: compilation error ("cannot find module './models'") or test failures.

- [ ] **Step 3: Write the implementation**

Create `src/app/core/layout/models.ts`:
```ts
/**
 * Layout primitive types shared across the four shells (landing, catalog, admin, auth).
 * Keep this file free of runtime logic — types only.
 */

export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon?: string;
  readonly badge?: string;
  readonly children?: readonly NavItem[];
}

export interface Breadcrumb {
  readonly label: string;
  readonly href?: string;
}

export interface ShellLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export type BlockDisplayCategory = 'application' | 'marketing' | 'enhanced';
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/core/layout/models.spec.ts"
```
Expected: 4 passing tests.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/app/core/layout/
git commit -m "feat(m0): add shared layout type models (NavItem, Breadcrumb, ShellLink)"
```

---

## Task 8 — `ThemeStore` (TDD)

**Goal:** Build a signal-based theme store that supports `'light' | 'dark' | 'system'`, persists to `localStorage`, reacts to OS-level `prefers-color-scheme` changes, and toggles `document.documentElement.classList` as a side effect. Full unit coverage.

**Files:**
- Create: `src/app/core/theme/theme-store.ts`
- Create: `src/app/core/theme/theme-store.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/core/theme/theme-store.spec.ts`:
```ts
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ThemeStore, ThemeMode } from './theme-store';

describe('ThemeStore', () => {
  let store: ThemeStore;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ThemeStore],
    });
  });

  function create(): ThemeStore {
    return TestBed.inject(ThemeStore);
  }

  it('defaults to system mode when localStorage is empty', () => {
    store = create();
    expect(store.mode()).toBe<ThemeMode>('system');
  });

  it('restores previously saved mode from localStorage', () => {
    localStorage.setItem('theme-mode', 'dark');
    store = create();
    expect(store.mode()).toBe<ThemeMode>('dark');
    expect(store.isDark()).toBe(true);
  });

  it('writes to localStorage when setMode is called', () => {
    store = create();
    store.setMode('light');
    expect(localStorage.getItem('theme-mode')).toBe('light');
    expect(store.mode()).toBe<ThemeMode>('light');
    expect(store.isDark()).toBe(false);
  });

  it('toggles the document root `dark` class when effective mode is dark', async () => {
    store = create();
    store.setMode('dark');
    await TestBed.inject(TestBed.constructor.prototype.constructor)?.whenStable?.();
    // Flush signal effect by awaiting a microtask:
    await Promise.resolve();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('ignores corrupt localStorage values and falls back to system', () => {
    localStorage.setItem('theme-mode', 'neon');
    store = create();
    expect(store.mode()).toBe<ThemeMode>('system');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/core/theme/theme-store.spec.ts"
```
Expected: module-not-found error on `./theme-store`.

- [ ] **Step 3: Write the implementation**

Create `src/app/core/theme/theme-store.ts`:
```ts
import {
  computed,
  effect,
  Injectable,
  signal,
  Signal,
} from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme-mode';
const VALID_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly _mode = signal<ThemeMode>(this.readFromStorage());
  private readonly _systemPrefers = signal<EffectiveTheme>(this.readSystemPreference());

  readonly mode: Signal<ThemeMode> = this._mode.asReadonly();

  readonly effectiveMode = computed<EffectiveTheme>(() =>
    this._mode() === 'system' ? this._systemPrefers() : (this._mode() as EffectiveTheme),
  );

  readonly isDark = computed<boolean>(() => this.effectiveMode() === 'dark');

  constructor() {
    this.watchSystemPreference();

    effect(() => {
      const dark = this.isDark();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', dark);
      }
    });
  }

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // localStorage unavailable (private mode) — ignore
    }
  }

  private readFromStorage(): ThemeMode {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return VALID_MODES.includes(raw as ThemeMode) ? (raw as ThemeMode) : 'system';
    } catch {
      return 'system';
    }
  }

  private readSystemPreference(): EffectiveTheme {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private watchSystemPreference(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent): void => {
      this._systemPrefers.set(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/core/theme/theme-store.spec.ts"
```
Expected: 5 passing tests.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/app/core/theme/
git commit -m "feat(m0): add signal-based ThemeStore (light/dark/system + storage + dom sync)"
```

---

## Task 9 — `AuthStore` (TDD)

**Goal:** Signal-based mock auth store. Supports `signIn(email, password)`, `signOut()`, `restore()`, and exposes `user`, `isAuthenticated` as signals. Writes to `localStorage` under key `auth`. Password length ≥ 6 is the only validation.

**Files:**
- Create: `src/app/core/auth/auth-store.ts`
- Create: `src/app/core/auth/auth-store.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/core/auth/auth-store.spec.ts`:
```ts
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { AuthStore } from './auth-store';

describe('AuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), AuthStore],
    });
  });

  function create(): AuthStore {
    return TestBed.inject(AuthStore);
  }

  it('starts unauthenticated with null user', () => {
    const store = create();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
  });

  it('signIn with a valid email and a ≥6-char password authenticates', async () => {
    const store = create();
    await store.signIn('alice@example.com', 'secret-password');
    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()?.email).toBe('alice@example.com');
    expect(store.user()?.id).toBeTruthy();
  });

  it('signIn rejects passwords shorter than 6 characters', async () => {
    const store = create();
    await expectAsync(store.signIn('alice@example.com', 'short'))
      .toBeRejectedWithError(/at least 6/i);
    expect(store.isAuthenticated()).toBe(false);
  });

  it('signOut clears state and localStorage', async () => {
    const store = create();
    await store.signIn('bob@example.com', 'secret-password');
    store.signOut();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
    expect(localStorage.getItem('auth')).toBeNull();
  });

  it('restore() rehydrates a non-expired session from localStorage', () => {
    const future = Date.now() + 60_000;
    localStorage.setItem(
      'auth',
      JSON.stringify({
        user: { id: 'u1', email: 'carol@example.com', displayName: 'Carol' },
        token: 'mock-token',
        expiresAt: future,
      }),
    );
    const store = create();
    store.restore();
    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()?.email).toBe('carol@example.com');
  });

  it('restore() ignores an expired session', () => {
    const past = Date.now() - 60_000;
    localStorage.setItem(
      'auth',
      JSON.stringify({
        user: { id: 'u1', email: 'dave@example.com', displayName: 'Dave' },
        token: 'mock-token',
        expiresAt: past,
      }),
    );
    const store = create();
    store.restore();
    expect(store.isAuthenticated()).toBe(false);
  });

  it('restore() ignores corrupt JSON', () => {
    localStorage.setItem('auth', '{not-json');
    const store = create();
    expect(() => store.restore()).not.toThrow();
    expect(store.isAuthenticated()).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/core/auth/auth-store.spec.ts"
```
Expected: module-not-found error on `./auth-store`.

- [ ] **Step 3: Write the implementation**

Create `src/app/core/auth/auth-store.ts`:
```ts
import { computed, Injectable, signal, Signal } from '@angular/core';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
}

export interface AuthState {
  readonly user: AuthUser | null;
  readonly token: string | null;
  readonly expiresAt: number | null;
}

const STORAGE_KEY = 'auth';
const EIGHT_HOURS_MS = 1000 * 60 * 60 * 8;

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `u_${Math.random().toString(36).slice(2, 11)}`;
}

function generateMockJwt(user: AuthUser): string {
  const payload = { sub: user.id, email: user.email, iat: Date.now() };
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _state = signal<AuthState>({
    user: null,
    token: null,
    expiresAt: null,
  });

  readonly state: Signal<AuthState> = this._state.asReadonly();
  readonly user = computed<AuthUser | null>(() => this._state().user);
  readonly isAuthenticated = computed<boolean>(() => {
    const s = this._state();
    return !!s.token && (s.expiresAt ?? 0) > Date.now();
  });

  async signIn(email: string, password: string): Promise<void> {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const user: AuthUser = {
      id: createId(),
      email,
      displayName: email.split('@')[0] ?? email,
    };
    const next: AuthState = {
      user,
      token: generateMockJwt(user),
      expiresAt: Date.now() + EIGHT_HOURS_MS,
    };
    this._state.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }

  signOut(): void {
    this._state.set({ user: null, token: null, expiresAt: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  restore(): void {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    let parsed: AuthState;
    try {
      parsed = JSON.parse(raw) as AuthState;
    } catch {
      return;
    }
    if (!parsed?.token || !parsed.user || (parsed.expiresAt ?? 0) <= Date.now()) {
      return;
    }
    this._state.set(parsed);
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/core/auth/auth-store.spec.ts"
```
Expected: 7 passing tests.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/app/core/auth/
git commit -m "feat(m0): add signal-based AuthStore (mock JWT, storage, restore)"
```

---

## Task 10 — `authMatchGuard` (TDD)

**Goal:** Implement a functional `CanMatchFn` that returns `true` when authenticated and otherwise a `UrlTree` redirect to `/auth/sign-in`.

**Files:**
- Create: `src/app/core/auth/auth-match.guard.ts`
- Create: `src/app/core/auth/auth-match.guard.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/core/auth/auth-match.guard.spec.ts`:
```ts
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, runInInjectionContext } from '@angular/core';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { AuthStore } from './auth-store';
import { authMatchGuard } from './auth-match.guard';

describe('authMatchGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        AuthStore,
      ],
    });
  });

  it('returns true when authenticated', async () => {
    const store = TestBed.inject(AuthStore);
    await store.signIn('user@example.com', 'secret-password');

    const result = runInInjectionContext(TestBed.inject(TestBed.constructor.prototype.constructor) ?? TestBed, () =>
      authMatchGuard(null as unknown as never, []),
    );

    expect(result).toBe(true);
  });

  it('redirects to /auth/sign-in when not authenticated', () => {
    const router = TestBed.inject(Router);
    const expected = router.createUrlTree(['/auth/sign-in']);

    const result = runInInjectionContext(TestBed, () =>
      authMatchGuard(null as unknown as never, []),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe(expected.toString());
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/core/auth/auth-match.guard.spec.ts"
```
Expected: module-not-found error on `./auth-match.guard`.

- [ ] **Step 3: Write the implementation**

Create `src/app/core/auth/auth-match.guard.ts`:
```ts
import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';

import { AuthStore } from './auth-store';

export const authMatchGuard: CanMatchFn = (): boolean | UrlTree => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/auth/sign-in']);
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/core/auth/auth-match.guard.spec.ts"
```
Expected: 2 passing tests.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/app/core/auth/auth-match.guard.ts src/app/core/auth/auth-match.guard.spec.ts
git commit -m "feat(m0): add functional authMatchGuard (redirects to /auth/sign-in)"
```

---

## Task 11 — Four Layout Shells

**Goal:** Create the four layout components — each is a minimal skeleton with `<router-outlet/>`. M1 will enrich them; M0 just needs them compilable and testable.

**Files:**
- Create: `src/app/layouts/landing-layout/landing-layout.{ts,html,css,spec.ts}`
- Create: `src/app/layouts/catalog-layout/catalog-layout.{ts,html,css,spec.ts}`
- Create: `src/app/layouts/admin-layout/admin-layout.{ts,html,css,spec.ts}`
- Create: `src/app/layouts/auth-layout/auth-layout.{ts,html,css,spec.ts}`

### 11a — LandingLayout

- [ ] **Step 1: Write the failing test**

Create `src/app/layouts/landing-layout/landing-layout.spec.ts`:
```ts
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { LandingLayout } from './landing-layout';

describe('LandingLayout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [LandingLayout],
    });
  });

  it('creates and renders a router-outlet', async () => {
    const fixture = TestBed.createComponent(LandingLayout);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });
});
```

- [ ] **Step 2: Write the implementation**

Create `src/app/layouts/landing-layout/landing-layout.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-layout',
  imports: [RouterOutlet],
  templateUrl: './landing-layout.html',
  styleUrl: './landing-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'landing-layout' },
})
export class LandingLayout {}
```

Create `src/app/layouts/landing-layout/landing-layout.html`:
```html
<header class="landing-layout__header">
  <span class="landing-layout__brand">Glacier Analytics</span>
</header>
<main class="landing-layout__main">
  <router-outlet />
</main>
<footer class="landing-layout__footer">© 2026 Glacier Analytics</footer>
```

Create `src/app/layouts/landing-layout/landing-layout.css`:
```css
:host { display: flex; flex-direction: column; min-height: 100vh; }
.landing-layout__header,
.landing-layout__footer { padding: 1rem 2rem; }
.landing-layout__main { flex: 1; }
```

- [ ] **Step 3: Run the test to verify it passes**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/landing-layout.spec.ts"
```
Expected: 1 passing test.

### 11b — CatalogLayout

- [ ] **Step 4: Write the failing test**

Create `src/app/layouts/catalog-layout/catalog-layout.spec.ts` — same shape as LandingLayout, importing `CatalogLayout`:
```ts
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { CatalogLayout } from './catalog-layout';

describe('CatalogLayout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [CatalogLayout],
    });
  });

  it('creates with a sidenav container and router-outlet', async () => {
    const fixture = TestBed.createComponent(CatalogLayout);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('aside')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
```

- [ ] **Step 5: Write the implementation**

Create `src/app/layouts/catalog-layout/catalog-layout.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-catalog-layout',
  imports: [RouterOutlet],
  templateUrl: './catalog-layout.html',
  styleUrl: './catalog-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'catalog-layout' },
})
export class CatalogLayout {}
```

Create `src/app/layouts/catalog-layout/catalog-layout.html`:
```html
<aside class="catalog-layout__nav" aria-label="元件目錄導覽">
  <!-- M1 populates the tree -->
</aside>
<section class="catalog-layout__body">
  <router-outlet />
</section>
```

Create `src/app/layouts/catalog-layout/catalog-layout.css`:
```css
:host { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
.catalog-layout__nav { border-right: 1px solid var(--mat-sys-outline-variant, #e0e0e0); }
.catalog-layout__body { padding: 1.5rem 2rem; }
```

- [ ] **Step 6: Run the test to verify it passes**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/catalog-layout.spec.ts"
```
Expected: 1 passing test.

### 11c — AdminLayout

- [ ] **Step 7: Write the failing test**

Create `src/app/layouts/admin-layout/admin-layout.spec.ts`:
```ts
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AdminLayout } from './admin-layout';

describe('AdminLayout', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [AdminLayout],
    });
  });

  it('renders topbar, sidenav, and main outlet', async () => {
    const fixture = TestBed.createComponent(AdminLayout);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('header')).toBeTruthy();
    expect(el.querySelector('nav')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
```

- [ ] **Step 8: Write the implementation**

Create `src/app/layouts/admin-layout/admin-layout.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'admin-layout' },
})
export class AdminLayout {}
```

Create `src/app/layouts/admin-layout/admin-layout.html`:
```html
<header class="admin-layout__topbar" aria-label="應用程式工具列">
  Glacier Analytics
</header>
<nav class="admin-layout__sidenav" aria-label="主功能導覽">
  <!-- M1 populates -->
</nav>
<main class="admin-layout__main">
  <router-outlet />
</main>
```

Create `src/app/layouts/admin-layout/admin-layout.css`:
```css
:host {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 56px 1fr;
  min-height: 100vh;
}
.admin-layout__topbar {
  grid-column: 1 / span 2;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  background: var(--mat-sys-surface-container, #fafafa);
}
.admin-layout__sidenav {
  border-right: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
}
.admin-layout__main { padding: 1.5rem; }
```

- [ ] **Step 9: Run the test to verify it passes**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/admin-layout.spec.ts"
```
Expected: 1 passing test.

### 11d — AuthLayout

- [ ] **Step 10: Write the failing test**

Create `src/app/layouts/auth-layout/auth-layout.spec.ts`:
```ts
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AuthLayout } from './auth-layout';

describe('AuthLayout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [AuthLayout],
    });
  });

  it('renders a centered card with router-outlet', async () => {
    const fixture = TestBed.createComponent(AuthLayout);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.auth-layout__card')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
```

- [ ] **Step 11: Write the implementation**

Create `src/app/layouts/auth-layout/auth-layout.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'auth-layout' },
})
export class AuthLayout {}
```

Create `src/app/layouts/auth-layout/auth-layout.html`:
```html
<div class="auth-layout__card" role="main">
  <router-outlet />
</div>
```

Create `src/app/layouts/auth-layout/auth-layout.css`:
```css
:host {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: var(--mat-sys-surface-container-lowest, #f5f5f5);
}
.auth-layout__card {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  background: var(--mat-sys-surface, #fff);
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}
```

- [ ] **Step 12: Run the test to verify it passes**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/auth-layout.spec.ts"
```
Expected: 1 passing test.

- [ ] **Step 13: Commit**

Run:
```bash
git add src/app/layouts/
git commit -m "feat(m0): add four layout shells (landing, catalog, admin, auth)

Each shell is a standalone OnPush component with a <router-outlet/>.
M1 will populate chrome and navigation."
```

---

## Task 12 — Feature Route Stubs

**Goal:** Create minimal placeholder components and `*.routes.ts` files for each of the four feature areas, so the top-level router has something to lazy-load.

**Files:**
- Create: `src/app/landing/landing-page.ts`
- Create: `src/app/landing/landing.routes.ts`
- Create: `src/app/catalog/catalog-index.ts`
- Create: `src/app/catalog/catalog.routes.ts`
- Create: `src/app/app-shell/dashboard/dashboard.ts`
- Create: `src/app/app-shell/app-shell.routes.ts`
- Create: `src/app/auth/sign-in/sign-in.ts`
- Create: `src/app/auth/auth.routes.ts`

- [ ] **Step 1: Write landing placeholder**

Create `src/app/landing/landing-page.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  template: `
    <section class="landing-page">
      <h1>Glacier Analytics</h1>
      <p>M0 placeholder — landing page content lands in M2.</p>
    </section>
  `,
  styles: `
    .landing-page { max-width: 960px; margin: 0 auto; padding: 4rem 1rem; }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {}
```

- [ ] **Step 2: Write landing routes**

Create `src/app/landing/landing.routes.ts`:
```ts
import { Routes } from '@angular/router';

import { LandingPage } from './landing-page';

export const LANDING_ROUTES: Routes = [
  { path: '', component: LandingPage, title: 'Glacier Analytics' },
];
```

- [ ] **Step 3: Write catalog placeholder**

Create `src/app/catalog/catalog-index.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-catalog-index',
  template: `
    <h1>Catalog</h1>
    <p>M0 placeholder — category pages land in M1.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogIndex {}
```

- [ ] **Step 4: Write catalog routes**

Create `src/app/catalog/catalog.routes.ts`:
```ts
import { Routes } from '@angular/router';

import { CatalogIndex } from './catalog-index';

export const CATALOG_ROUTES: Routes = [
  { path: '', component: CatalogIndex, title: 'Catalog' },
];
```

- [ ] **Step 5: Write dashboard placeholder**

Create `src/app/app-shell/dashboard/dashboard.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>儀表板</h1>
    <p>M0 placeholder — dashboard content lands in M2.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
```

- [ ] **Step 6: Write app-shell routes**

Create `src/app/app-shell/app-shell.routes.ts`:
```ts
import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';

export const APP_SHELL_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: Dashboard, title: '儀表板' },
];
```

- [ ] **Step 7: Write sign-in placeholder**

Create `src/app/auth/sign-in/sign-in.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  template: `
    <h1>登入</h1>
    <p>M0 placeholder — real form lands in M2.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn {}
```

- [ ] **Step 8: Write auth routes**

Create `src/app/auth/auth.routes.ts`:
```ts
import { Routes } from '@angular/router';

import { SignIn } from './sign-in/sign-in';

export const AUTH_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
  { path: 'sign-in', component: SignIn, title: '登入' },
];
```

- [ ] **Step 9: Build to confirm everything compiles**

Run:
```bash
npm run build -- --configuration development
```
Expected: build succeeds.

- [ ] **Step 10: Commit**

Run:
```bash
git add src/app/landing/ src/app/catalog/ src/app/app-shell/ src/app/auth/
git commit -m "feat(m0): add feature route stubs (landing/catalog/app-shell/auth)

Each feature exports its *_ROUTES const with a single placeholder page.
M1-M2 will replace the placeholders with real content."
```

---

## Task 13 — Wire Top-Level Routing

**Goal:** Replace the generated `src/app/app.routes.ts` with the four-shell split routing and attach `authMatchGuard` to `/app/**`.

**Files:**
- Modify: `src/app/app.routes.ts`
- Create: `src/app/app.routes.spec.ts` (integration smoke test)

- [ ] **Step 1: Write the failing integration test**

Create `src/app/app.routes.spec.ts`:
```ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { Location } from '@angular/common';

import { routes } from './app.routes';
import { AuthStore } from './core/auth/auth-store';

describe('Top-level routing', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
      ],
    });
  });

  it('navigates to /catalog without auth', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    await router.navigateByUrl('/catalog');
    expect(location.path()).toBe('/catalog');
  });

  it('navigates to /auth/sign-in without auth', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    await router.navigateByUrl('/auth/sign-in');
    expect(location.path()).toBe('/auth/sign-in');
  });

  it('redirects /app/dashboard to /auth/sign-in when unauthenticated', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    await router.navigateByUrl('/app/dashboard');
    expect(location.path()).toBe('/auth/sign-in');
  });

  it('allows /app/dashboard when authenticated', async () => {
    const store = TestBed.inject(AuthStore);
    await store.signIn('tester@example.com', 'secret-password');

    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    await router.navigateByUrl('/app/dashboard');
    expect(location.path()).toBe('/app/dashboard');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/app.routes.spec.ts"
```
Expected: compilation errors (routes file still has the scaffold version).

- [ ] **Step 3: Overwrite `src/app/app.routes.ts`**

Write:
```ts
import { Routes } from '@angular/router';

import { authMatchGuard } from './core/auth/auth-match.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/landing-layout/landing-layout').then(m => m.LandingLayout),
    loadChildren: () =>
      import('./landing/landing.routes').then(m => m.LANDING_ROUTES),
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./layouts/catalog-layout/catalog-layout').then(m => m.CatalogLayout),
    loadChildren: () =>
      import('./catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
  },
  {
    path: 'app',
    canMatch: [authMatchGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    loadChildren: () =>
      import('./app-shell/app-shell.routes').then(m => m.APP_SHELL_ROUTES),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/app.routes.spec.ts"
```
Expected: 4 passing tests.

- [ ] **Step 5: Run the full test suite**

Run:
```bash
npm test -- --watch=false --browsers=ChromeHeadless
```
Expected: all tests from Tasks 7–13 pass.

- [ ] **Step 6: Commit**

Run:
```bash
git add src/app/app.routes.ts src/app/app.routes.spec.ts
git commit -m "feat(m0): wire split-shell routing with authMatchGuard

Top-level routes lazy-load four layout shells:
  /         -> LandingLayout
  /catalog  -> CatalogLayout
  /app/**   -> AdminLayout (guarded by authMatchGuard)
  /auth/**  -> AuthLayout
Integration tests cover the happy path and the auth redirect."
```

---

## Task 14 — Block Source Bake Script (TDD)

**Goal:** Implement `scripts/bake-block-sources.ts`. The script walks `src/app/blocks/<category>/<variant>/` and produces `src/assets/block-sources/<category>__<variant>.json` files of the shape:

```json
{
  "category": "free-page-shells",
  "variant": "page-shell-1",
  "files": {
    "page-shell-1.component.html": "...raw HTML...",
    "page-shell-1.component.ts": "...raw TS..."
  }
}
```

The script must be runnable via `tsx` with no Angular runtime involved.

**Files:**
- Create: `scripts/bake-block-sources.ts`
- Create: `scripts/bake-block-sources.spec.ts`
- Modify: `package.json` (add `bake` script)

- [ ] **Step 1: Write the failing test**

Create `scripts/bake-block-sources.spec.ts`:
```ts
import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm, mkdir, writeFile, readFile } from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

import { bakeBlockSources } from './bake-block-sources';

async function fixture(): Promise<{ root: string; cleanup: () => Promise<void> }> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'bake-blocks-'));
  return {
    root,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

test('bakeBlockSources produces a JSON file per variant', async () => {
  const { root, cleanup } = await fixture();
  try {
    const blocks = path.join(root, 'src/app/blocks');
    const assets = path.join(root, 'src/assets/block-sources');
    const variantDir = path.join(blocks, 'free-page-shells', 'page-shell-1');

    await mkdir(variantDir, { recursive: true });
    await writeFile(
      path.join(variantDir, 'page-shell-1.component.ts'),
      'export class PageShell1 {}\n',
    );
    await writeFile(
      path.join(variantDir, 'page-shell-1.component.html'),
      '<div>hello</div>\n',
    );

    const written = await bakeBlockSources({ blocksDir: blocks, outDir: assets });
    assert.deepEqual(written, [
      path.join(assets, 'free-page-shells__page-shell-1.json'),
    ]);

    const raw = await readFile(written[0], 'utf8');
    const parsed = JSON.parse(raw);
    assert.equal(parsed.category, 'free-page-shells');
    assert.equal(parsed.variant, 'page-shell-1');
    assert.equal(parsed.files['page-shell-1.component.ts'], 'export class PageShell1 {}\n');
    assert.equal(parsed.files['page-shell-1.component.html'], '<div>hello</div>\n');
  } finally {
    await cleanup();
  }
});

test('bakeBlockSources returns an empty array when blocks dir is missing', async () => {
  const { root, cleanup } = await fixture();
  try {
    const written = await bakeBlockSources({
      blocksDir: path.join(root, 'does-not-exist'),
      outDir: path.join(root, 'out'),
    });
    assert.deepEqual(written, []);
  } finally {
    await cleanup();
  }
});

test('bakeBlockSources handles multiple categories and variants', async () => {
  const { root, cleanup } = await fixture();
  try {
    const blocks = path.join(root, 'blocks');
    const outDir = path.join(root, 'out');

    for (const [cat, variant] of [
      ['page-shells', 'page-shell-1'],
      ['page-shells', 'page-shell-2'],
      ['free-page-shells', 'page-shell-1'],
    ] as const) {
      const dir = path.join(blocks, cat, variant);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, `${variant}.component.ts`), `// ${cat}/${variant}\n`);
    }

    const written = await bakeBlockSources({ blocksDir: blocks, outDir });
    assert.equal(written.length, 3);
    assert.ok(written.every(p => p.startsWith(outDir)));
  } finally {
    await cleanup();
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npx tsx --test scripts/bake-block-sources.spec.ts
```
Expected: module-not-found error on `./bake-block-sources`.

- [ ] **Step 3: Write the implementation**

Create `scripts/bake-block-sources.ts`:
```ts
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

export interface BakeOptions {
  readonly blocksDir: string;
  readonly outDir: string;
}

export interface BakedBlock {
  readonly category: string;
  readonly variant: string;
  readonly files: Readonly<Record<string, string>>;
}

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readVariant(
  categoryDir: string,
  category: string,
  variant: string,
): Promise<BakedBlock> {
  const variantDir = path.join(categoryDir, variant);
  const entries = await readdir(variantDir);
  const files: Record<string, string> = {};
  for (const entry of entries) {
    const full = path.join(variantDir, entry);
    const s = await stat(full);
    if (s.isFile()) {
      files[entry] = await readFile(full, 'utf8');
    }
  }
  return { category, variant, files };
}

export async function bakeBlockSources(opts: BakeOptions): Promise<readonly string[]> {
  if (!(await exists(opts.blocksDir))) return [];
  await mkdir(opts.outDir, { recursive: true });

  const written: string[] = [];
  const categories = await readdir(opts.blocksDir);

  for (const category of categories) {
    const categoryDir = path.join(opts.blocksDir, category);
    const catStat = await stat(categoryDir);
    if (!catStat.isDirectory()) continue;

    const variants = await readdir(categoryDir);
    for (const variant of variants) {
      const variantDir = path.join(categoryDir, variant);
      const varStat = await stat(variantDir);
      if (!varStat.isDirectory()) continue;

      const baked = await readVariant(categoryDir, category, variant);
      const outFile = path.join(opts.outDir, `${category}__${variant}.json`);
      await writeFile(outFile, JSON.stringify(baked, null, 2), 'utf8');
      written.push(outFile);
    }
  }

  return written;
}

// CLI entry point
const isDirectRun =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('bake-block-sources.ts');

if (isDirectRun) {
  const projectRoot = path.resolve(process.cwd());
  const blocksDir = path.join(projectRoot, 'src/app/blocks');
  const outDir = path.join(projectRoot, 'src/assets/block-sources');

  bakeBlockSources({ blocksDir, outDir })
    .then(written => {
      console.log(`[bake] wrote ${written.length} file(s) to ${outDir}`);
    })
    .catch(err => {
      console.error('[bake] failed:', err);
      process.exit(1);
    });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npx tsx --test scripts/bake-block-sources.spec.ts
```
Expected: 3 passing tests.

- [ ] **Step 5: Add `bake` npm script**

Edit `package.json` `scripts` to add:
```json
{
  "scripts": {
    "bake": "tsx scripts/bake-block-sources.ts",
    "bake:test": "tsx --test scripts/bake-block-sources.spec.ts"
  }
}
```

- [ ] **Step 6: Smoke run the bake script against the empty project**

Run:
```bash
mkdir -p src/assets/block-sources
npm run bake
```
Expected: `[bake] wrote 0 file(s) to .../src/assets/block-sources` (no blocks installed yet).

- [ ] **Step 7: Add .gitkeep files**

Run:
```bash
touch src/assets/block-sources/.gitkeep
mkdir -p src/assets/mock-data
touch src/assets/mock-data/.gitkeep
mkdir -p src/assets/i18n
echo '{}' > src/assets/i18n/zh-TW.json
```

- [ ] **Step 8: Commit**

Run:
```bash
git add scripts/ package.json src/assets/
git commit -m "feat(m0): add bake-block-sources TS script + empty asset dirs

scripts/bake-block-sources.ts walks src/app/blocks/ and produces
src/assets/block-sources/<category>__<variant>.json for Catalog pages
to inline at build time. No runtime MCP dependency.

Covered by node:test + tsx. Run via 'npm run bake'."
```

---

## Task 15 — End-to-End Block Download Smoke Test

**Goal:** Prove that the project's `ngm-dev-cli.json` + stored auth can download a **free** and a **paid** block into `src/app/blocks/`, then verify the bake script picks them up.

**Files:**
- Created by `@ngm-dev/cli add`: four files under `src/app/blocks/free-page-shells/page-shell-1/` and `src/app/blocks/page-shells/page-shell-2/`
- Generated by bake: two files under `src/assets/block-sources/`

- [ ] **Step 1: Install the free block**

Run:
```bash
npx @ngm-dev/cli add free-page-shells/page-shell-1 \
  --angular-version 20 \
  --allow \
  --yes \
  --skip-asking-for-dependencies
```
Expected: ending with `All done!`. Peer-dep warning is allowed (we already installed them in Task 4).

- [ ] **Step 2: Verify free block files exist**

Run:
```bash
ls src/app/blocks/free-page-shells/page-shell-1
```
Expected: `page-shell-1.component.html` and `page-shell-1.component.ts`.

- [ ] **Step 3: Install the paid block**

Run:
```bash
npx @ngm-dev/cli add page-shells/page-shell-2 \
  --angular-version 20 \
  --allow \
  --yes \
  --skip-asking-for-dependencies
```
Expected: `All done!`. If this fails with `401 Unauthorized — Token is bound to a different machine`, **STOP** and re-do the auth refresh (spec R2).

- [ ] **Step 4: Verify paid block files exist**

Run:
```bash
ls src/app/blocks/page-shells/page-shell-2
```
Expected: `page-shell-2.component.html` and `page-shell-2.component.ts`.

- [ ] **Step 5: Run the bake script**

Run:
```bash
npm run bake
```
Expected:
```
[bake] wrote 2 file(s) to .../src/assets/block-sources
```

- [ ] **Step 6: Verify baked JSON files**

Run:
```bash
ls src/assets/block-sources/*.json
node -e "const j=require('./src/assets/block-sources/page-shells__page-shell-2.json');console.log('category:',j.category,'variant:',j.variant,'files:',Object.keys(j.files));"
```
Expected: two files listed. The `require` output should show `category: page-shells variant: page-shell-2 files: [ 'page-shell-2.component.html', 'page-shell-2.component.ts' ]`.

- [ ] **Step 7: Run lint, build, and test**

Run:
```bash
npm run lint
npm run build -- --configuration development
npm test -- --watch=false --browsers=ChromeHeadless
```
Expected: all three succeed. The installed block files shouldn't break lint because they're vendor files — if lint fails on them, add `src/app/blocks/**/*` to the lint ignore list in `eslint.config.js` (but NOT to the prettier ignore — blocks stay Prettier-formatted by `@ngm-dev/cli`).

- [ ] **Step 8: Commit**

Run:
```bash
git add src/app/blocks/ src/assets/block-sources/ eslint.config.js 2>/dev/null
git commit -m "test(m0): install free + paid smoke blocks and bake sources

- free-page-shells/page-shell-1 (free)
- page-shells/page-shell-2 (paid — verifies auth binding)
- 2 baked JSON files in src/assets/block-sources/"
```

---

## Task 16 — M0 Definition of Done Verification

**Goal:** Run the full quality gate from the spec §13 DoD and record the milestone in a changelog.

**Files:**
- Create: `docs/CHANGELOG.md`

- [ ] **Step 1: Run the full lint / build / test gate**

Run:
```bash
npm run lint
npm run format:check
npm run build -- --configuration development
npm run bake:test
npm test -- --watch=false --browsers=ChromeHeadless
```
Expected: every command exits 0. If anything fails, fix it before moving on — do not mask failures.

- [ ] **Step 2: Verify the four routes are reachable via test (already done in Task 13)**

Re-run just that spec for documentation purposes:
```bash
npm test -- --watch=false --browsers=ChromeHeadless --include="**/app.routes.spec.ts"
```
Expected: 4 passing tests (unauth /catalog, unauth /auth/sign-in, auth-redirected /app/dashboard, authed /app/dashboard).

- [ ] **Step 3: Create the changelog**

Write `docs/CHANGELOG.md`:
```markdown
# Changelog

All milestone deliveries are recorded here in reverse-chronological order.
See `docs/2026-04-08-material-block-showcase-design.md` §13 for milestone definitions.

## M0 — Workspace Bootstrap — 2026-04-08

**Delivered**

- Angular 20 zoneless workspace (`--test-runner=karma`, `--style=css`, `--strict`, `--routing`).
- Angular Material 20.2.5 + CDK 20.2.5 + Tailwind 4.1.12 + PostCSS 8.5.6 (peer-dep locked by registry).
- `@ngm-dev/cli` 2.0.2 integration: `ngm-dev-cli.json` points to `src/app/blocks/`; auth verified end-to-end.
- Four layout shells (`LandingLayout`, `CatalogLayout`, `AdminLayout`, `AuthLayout`) with smoke tests.
- Split-shell routing with `authMatchGuard` gating `/app/**`.
- Core signal stores: `ThemeStore` (light/dark/system + localStorage + DOM sync), `AuthStore` (mock JWT + 8h session), `authMatchGuard`.
- `ng2-charts@^8.0.0` + `chart.js@^4.3.0`, Inter + JetBrains Mono fonts.
- ESLint (angular-eslint, flat config) + Prettier.
- `scripts/bake-block-sources.ts` — node script (via `tsx`) that walks installed blocks and emits per-variant JSON for Catalog pages. Covered by `node:test`.
- End-to-end block-download smoke test using `free-page-shells/page-shell-1` (free) and `page-shells/page-shell-2` (paid).

**Quality gate**

- `npm run lint` — green.
- `npm run format:check` — green.
- `npm run build -- --configuration development` — green, no warnings.
- `npm run bake:test` — 3 passing tests.
- `npm test -- --watch=false --browsers=ChromeHeadless` — all passing (ThemeStore 5, AuthStore 7, authMatchGuard 2, four layout smoke tests, routes integration 4, models 4).

**Deferred to later milestones**

- M3 theme tokens and dark-mode palette wiring (base tokens exist via `mat.theme()`, polished in M1).
- Catalog registry and page shell (M1).
- Auth form blocks, Landing page content, Dashboard content (M2).
```

- [ ] **Step 4: Final commit**

Run:
```bash
git add docs/CHANGELOG.md
git commit -m "docs(m0): record M0 delivery in CHANGELOG"
```

- [ ] **Step 5: Tag the milestone**

Run:
```bash
git tag -a m0-workspace-bootstrap -m "Milestone M0: workspace bootstrap complete"
git log --oneline -20
```
Expected: the commit log shows the M0 task chain, and the tag exists.

---

## Plan Self-Review

**Spec coverage (§13 M0 requirements)**

| Spec M0 item | Task(s) |
| --- | --- |
| Auth refresh (pre-flight, manual) | Task 1 |
| `ng new` native Linux path → amended to WSL mount (documented) | Task 2 |
| Zoneless / strict / plain CSS / Angular 20 | Task 2 (flags), Task 3 (providers) |
| `@ngm-dev/cli init` → peer deps, postcssrc, angular.json styles, Material Symbols | Task 4 |
| `ngm-dev-cli.json` per spec §4.4 | Task 4 |
| Install `ng2-charts@^8`, `chart.js@^4`, Inter, JetBrains Mono | Task 5 |
| `core/`, `layouts/`, `landing/`, `catalog/`, `app-shell/`, `auth/` scaffolds | Tasks 7, 11, 12 |
| ESLint, angular-eslint, Prettier | Task 6 |
| `authMatchGuard`, `ThemeStore`, `AuthStore` (stubs) | Tasks 8, 9, 10 — **full, not stubs** |
| `scripts/bake-block-sources.ts` + CI invocation | Task 14 |
| Smoke test (free + paid block, placeholder test page) | Task 15 |
| DoD — build, lint, test, four layouts reachable, changelog | Task 16 |

**Placeholder scan:** no `TBD`, `TODO`, `fill in`, or skipped steps. Every code block contains complete, runnable code.

**Type consistency:** `AuthStore.signIn(email, password)`, `ThemeStore.setMode(mode)`, `bakeBlockSources(opts)`, and `authMatchGuard` are referenced with identical signatures in both their defining task and their downstream consumers.

**Scope focus:** plan stops at M0 DoD. M1 (Catalog shell + 10 display categories) is a separate plan.

---

## Execution Handoff

Plan complete and saved to `docs/plans/2026-04-08-m0-workspace-bootstrap-plan.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration. Uses `superpowers:subagent-driven-development`.
2. **Inline Execution** — execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

**Which approach?**
