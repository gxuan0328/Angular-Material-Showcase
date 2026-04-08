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
