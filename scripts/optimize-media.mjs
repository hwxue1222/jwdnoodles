import { promises as fs } from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const execFileAsync = promisify(execFile);

function toPosix(p) {
  return p.split(path.sep).join('/');
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(full)));
      continue;
    }
    out.push(full);
  }
  return out;
}

async function sips(args) {
  await execFileAsync('sips', args, { cwd: ROOT });
}

function getImageProfile(rel) {
  const r = rel.replace(/^images\//, '');
  if (r.startsWith('menu/')) return { maxWidth: 1800, jpgQuality: 85 };
  if (r.startsWith('brand/icon.')) return { maxWidth: 256 };
  if (r.startsWith('brand/')) return { maxWidth: 720 };
  if (r.startsWith('dishes/')) return { maxWidth: 1400, jpgQuality: 78 };
  return { maxWidth: 1600, jpgQuality: 75 };
}

async function safeStat(filePath) {
  try {
    return await fs.stat(filePath);
  } catch (err) {
    if (err && err.code === 'ENOENT') return null;
    throw err;
  }
}

async function convertMenuPngToJpg(pngPath, { maxWidth, jpgQuality }) {
  const original = await safeStat(pngPath);
  if (!original) return null;
  const jpgPath = pngPath.replace(/\.png$/i, '.jpg');
  const tmpPath = `${jpgPath}.tmp.jpg`;
  await sips(['-Z', String(maxWidth), '-s', 'format', 'jpeg', '-s', 'formatOptions', String(jpgQuality), pngPath, '--out', tmpPath]);
  const out = await safeStat(tmpPath);
  if (!out) return null;
  if (out.size >= original.size) {
    await fs.unlink(tmpPath);
    return null;
  }
  await fs.rename(tmpPath, jpgPath);
  await fs.unlink(pngPath);
  return jpgPath;
}

async function optimizeRasterInPlace(filePath, rel) {
  const profile = getImageProfile(rel);
  const ext = path.extname(filePath).toLowerCase();
  const stat = await safeStat(filePath);
  if (!stat) return false;

  if (ext === '.jpg' || ext === '.jpeg') {
    if (stat.size < 250 * 1024) return false;
    const tmp = `${filePath}.tmp.jpg`;
    await sips(['-Z', String(profile.maxWidth), '-s', 'formatOptions', String(profile.jpgQuality), filePath, '--out', tmp]);
    const out = await safeStat(tmp);
    if (!out) return false;
    if (out.size >= stat.size) {
      await fs.unlink(tmp);
      return false;
    }
    await fs.rename(tmp, filePath);
    return true;
  }

  if (ext === '.png') {
    if (stat.size < 200 * 1024) return false;
    const tmp = `${filePath}.tmp.png`;
    await sips(['-Z', String(profile.maxWidth), filePath, '--out', tmp]);
    const out = await safeStat(tmp);
    if (!out) return false;
    if (out.size >= stat.size) {
      await fs.unlink(tmp);
      return false;
    }
    await fs.rename(tmp, filePath);
    return true;
  }

  return false;
}

async function main() {
  const files = await walk(IMAGES_DIR);
  let changed = 0;
  let convertedMenu = 0;

  for (const filePath of files) {
    if (path.basename(filePath).includes('.tmp.')) continue;
    const rel = toPosix(path.relative(PUBLIC_DIR, filePath));
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.png' && rel.startsWith('images/menu/')) {
      const s = await safeStat(filePath);
      if (!s) continue;
      if (s.size < 150 * 1024) continue;
      const out = await convertMenuPngToJpg(filePath, getImageProfile(rel));
      if (out) convertedMenu++;
      continue;
    }

    if (ext === '.png' && !rel.startsWith('images/brand/')) continue;
    const did = await optimizeRasterInPlace(filePath, rel);
    if (did) changed++;
  }

  console.log(`optimized: ${changed}, converted_menu_png_to_jpg: ${convertedMenu}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
