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
    await writeFile(path.join(variantDir, 'page-shell-1.component.html'), '<div>hello</div>\n');

    const written = await bakeBlockSources({ blocksDir: blocks, outDir: assets });
    assert.deepEqual(written, [path.join(assets, 'free-page-shells__page-shell-1.json')]);

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
