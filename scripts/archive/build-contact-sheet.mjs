/**
 * Build a single HTML contact sheet that tiles every M1 variant
 * screenshot so reviewers can scan all 85 at a glance.
 *
 * Run: node scripts/build-contact-sheet.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VARIANTS_DIR = path.resolve(__dirname, '../docs/verification/m1-visual-check/variants');
const OUT_FILE = path.resolve(__dirname, '../docs/verification/m1-visual-check/contact-sheet.html');

async function main() {
  const manifest = JSON.parse(
    await readFile(path.join(VARIANTS_DIR, '_manifest.json'), 'utf8'),
  );

  const byCategory = new Map();
  for (const r of manifest.results) {
    if (!byCategory.has(r.category)) byCategory.set(r.category, []);
    byCategory.get(r.category).push(r);
  }

  const sections = [...byCategory.entries()]
    .map(([category, rows]) => {
      const cards = rows
        .map(r => {
          const fileName = `${r.category}__${r.variant}.png`;
          return `
            <figure class="card">
              <div class="card__img-wrap">
                <img src="variants/${fileName}" alt="${r.category} ${r.variant}" loading="lazy" />
              </div>
              <figcaption>
                <strong>${r.variant}</strong>
                <span>${Math.round(r.bytes / 1024)} KB</span>
              </figcaption>
            </figure>`;
        })
        .join('');
      return `
        <section>
          <h2>${category} <small>(${rows.length})</small></h2>
          <div class="grid">${cards}</div>
        </section>`;
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="zh-TW">
<head>
<meta charset="utf-8" />
<title>M1 Variant Contact Sheet — 85 variants</title>
<style>
  body { font-family: -apple-system, Segoe UI, Inter, sans-serif; margin: 0; padding: 1.5rem; background: #f5f5f5; color: #111; }
  h1 { margin: 0 0 0.25rem; }
  .meta { color: #666; font-size: 0.875rem; margin-bottom: 1.5rem; }
  section { margin-bottom: 2rem; background: #fff; padding: 1rem 1.25rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  section h2 { margin: 0 0 0.75rem; font-size: 1.125rem; text-transform: capitalize; }
  section h2 small { color: #888; font-weight: normal; font-size: 0.75em; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.75rem; }
  .card { margin: 0; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; }
  .card__img-wrap { width: 100%; height: 180px; overflow: hidden; background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
  .card img { width: 100%; height: 100%; object-fit: contain; object-position: top left; }
  .card figcaption { padding: 0.5rem 0.75rem; font-size: 0.75rem; display: flex; justify-content: space-between; gap: 0.5rem; }
  .card strong { font-weight: 600; color: #111; }
  .card span { color: #888; }
</style>
</head>
<body>
  <h1>M1 Variant Contact Sheet</h1>
  <p class="meta">
    Captured ${manifest.capturedAt} · ${manifest.ok}/${manifest.total} variants rendered successfully
  </p>
  ${sections}
</body>
</html>
`;
  await writeFile(OUT_FILE, html, 'utf8');
  console.log(`Wrote ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
