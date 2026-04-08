# UI Blocks Workflow (ngm-dev-blocks MCP)

<!-- Always loaded. Governs how UI blocks from ui.angular-material.dev are used. -->

## Principle

When designing UI or planning features, **prioritize reusing existing blocks from https://ui.angular-material.dev/** via the `ngm-dev-blocks` MCP server. Do not hand-write blocks that already exist in the catalog.

## Tools

| Tool | Purpose |
|---|---|
| `get-all-block-names` | List every block in the catalog — call first. |
| `generate-angular-material-block` | Retrieve full source for a named block (TS / HTML / CSS + deps). |
| `setup-angular-material-blocks` | Initialize project dependencies — run once per project. |

## Workflow

1. **Discover** — call `get-all-block-names` before designing a screen.
2. **Select** — pick the closest matching block from the catalog.
3. **Generate** — call `generate-angular-material-block` with the block name. Never copy-paste from the website manually.
4. **Integrate** — compose the block into the feature. Adjust only what domain logic requires.
5. **Fallback** — build custom only if no block fits. Document the reason in the component header comment.

## Rules

- **Discovery first**: never propose a custom UI without checking the catalog.
- **MCP-driven code**: all block source must come from `generate-angular-material-block` — keeps upgrades traceable.
- **One-time setup**: run `setup-angular-material-blocks` before generating the first block in a new project.
- **Preserve conventions**: blocks already follow v20+ conventions (standalone, signals, OnPush, native control flow, a11y). Do not strip or downgrade them during integration.
- **Preserve a11y**: never remove ARIA attributes, focus management, or semantic elements from generated blocks.

## Division of Labor with `angular-cli` MCP

- `ngm-dev-blocks` MCP → UI components and layouts (the visible surface).
- `angular-cli` MCP → framework-level concerns (routing, DI, forms, SSR, testing, workspace discovery).

Use them together: blocks provide the markup, `angular-cli` guidance ensures framework correctness.
