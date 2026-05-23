import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const inputDir = path.join(projectRoot, 'Pic', 'Input');
const inputMenuDir = path.join(inputDir, 'menu');
const publicDir = path.join(projectRoot, 'public');
const outputDir = path.join(projectRoot, 'Pic', 'Output');

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const exists = async (p) => {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
};

const getDims = async (file) => {
  try {
    const mod = await import('jimp');
    const Jimp = mod.Jimp ?? mod.default ?? mod;
    const img = await Jimp.read(file);
    return { w: img.bitmap.width, h: img.bitmap.height };
  } catch {
    return null;
  }
};

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

const findInputByBaseName = async (baseName) => {
  try {
    for (const dir of [inputDir, inputMenuDir]) {
      try {
        const files = await fs.readdir(dir);
        const lowerMap = new Map(files.map((f) => [f.toLowerCase(), f]));
        for (const ext of IMAGE_EXTS) {
          const candidate = `${baseName}${ext}`;
          const hit = lowerMap.get(candidate.toLowerCase());
          if (hit) return path.join(dir, hit);
        }
      } catch {
        continue;
      }
    }
    return null;
  } catch {
    return null;
  }
};

const enhanceAndCopyIfExists = async ({ fromBase, to, outMime }) => {
  const from = await findInputByBaseName(fromBase);
  if (!from) return { ok: false, from: path.join(inputDir, `${fromBase}.*`), to };
  await ensureDir(path.dirname(to));
  await ensureDir(outputDir);

  const ext = path.extname(from).toLowerCase();
  const mod = await import('jimp');
  const Jimp = mod.Jimp ?? mod.default ?? mod;
  const img = await Jimp.read(from);
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const maxSide = Math.max(w, h);

  const needsUpscale = maxSide > 0 && maxSide < 1400;
  const mime = outMime ?? 'image/jpeg';
  const canKeepOriginal =
    !needsUpscale &&
    ((mime === 'image/jpeg' && (ext === '.jpg' || ext === '.jpeg')) || (mime === 'image/png' && ext === '.png'));
  if (needsUpscale) {
    const scale = 1600 / maxSide;
    const nw = Math.max(1, Math.round(w * scale));
    const nh = Math.max(1, Math.round(h * scale));
    img.resize({ w: nw, h: nh });
    img.convolute([
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ]);
  }

  const previewOut = path.join(outputDir, path.basename(to));
  if (canKeepOriginal) {
    await fs.copyFile(from, previewOut);
    await fs.copyFile(from, to);
  } else {
    const quality = needsUpscale ? 92 : 95;
    const buf =
      mime === 'image/png' ? await img.getBuffer('image/png') : await img.getBuffer('image/jpeg', { quality });
    await fs.writeFile(previewOut, buf);
    await fs.writeFile(to, buf);
  }

  const dims = (await getDims(to)) ?? { w, h };
  return { ok: true, from, to, w0: w, h0: h, w1: dims.w, h1: dims.h, enhanced: needsUpscale };
};

const tasks = [
  {
    fromBase: 'puteri-harbour',
    to: path.join(publicDir, 'images', 'stores', 'puteri-harbour.jpg'),
    outMime: 'image/jpeg',
  },
  {
    fromBase: 'kulai-commune',
    to: path.join(publicDir, 'images', 'stores', 'kulai-commune.jpg'),
    outMime: 'image/jpeg',
  },
  {
    fromBase: 'lotus-mutiara-rini',
    to: path.join(publicDir, 'images', 'stores', 'lotus-mutiara-rini.jpg'),
    outMime: 'image/jpeg',
  },
  {
    fromBase: 'brand-icon',
    to: path.join(publicDir, 'images', 'brand', 'icon.png'),
    outMime: 'image/png',
  },
  {
    fromBase: 'brand-zh',
    to: path.join(publicDir, 'images', 'brand', 'zh.png'),
    outMime: 'image/png',
  },
  {
    fromBase: 'brand-en',
    to: path.join(publicDir, 'images', 'brand', 'en.png'),
    outMime: 'image/png',
  },
  {
    fromBase: 'halal-cert-1',
    to: path.join(publicDir, 'images', 'halal', 'cert-1.jpg'),
    outMime: 'image/jpeg',
  },
  {
    fromBase: 'halal-cert-2',
    to: path.join(publicDir, 'images', 'halal', 'cert-2.jpg'),
    outMime: 'image/jpeg',
  },
];

const discoverDishTasks = async () => {
  try {
    const dishTasks = [];
    const seen = new Set();

    for (const dir of [inputDir, inputMenuDir]) {
      let files = [];
      try {
        files = await fs.readdir(dir);
      } catch {
        files = [];
      }
      for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        if (!IMAGE_EXTS.includes(ext)) continue;
        const base = path.parse(f).name;

        let code = '';
        let fromBase = '';
        const m1 = base.match(/^[A-Za-z][0-9]{1,2}$/);
        const m2 = base.match(/^dish-([A-Za-z][0-9]{1,2})$/);
        if (m1) {
          code = base.toUpperCase();
          fromBase = base;
        } else if (m2) {
          code = m2[1].toUpperCase();
          fromBase = base;
        } else {
          continue;
        }

        if (seen.has(code)) continue;
        seen.add(code);

        dishTasks.push({
          fromBase,
          to: path.join(publicDir, 'images', 'dishes', `${code}.jpg`),
          outMime: 'image/jpeg',
        });
      }
    }

    return dishTasks;
  } catch {
    return [];
  }
};

const discoverGlobalTasks = async () => {
  try {
    const files = await fs.readdir(inputDir);
    const globalTasks = [];
    const seen = new Set();

    for (const f of files) {
      const ext = path.extname(f).toLowerCase();
      if (!IMAGE_EXTS.includes(ext)) continue;
      const base = path.parse(f).name;
      const m = base.match(/^global-([a-z0-9-]+)$/i);
      if (!m) continue;

      const slug = m[1].toLowerCase();
      if (seen.has(slug)) continue;
      seen.add(slug);

      globalTasks.push({
        fromBase: base,
        to: path.join(publicDir, 'images', 'global', `${slug}.jpg`),
        outMime: 'image/jpeg',
      });
    }

    return globalTasks;
  } catch {
    return [];
  }
};

if (!(await exists(inputDir))) {
  await ensureDir(inputDir);
  console.log(`Created: ${path.relative(projectRoot, inputDir)}`);
}

const results = [];
const dishTasks = await discoverDishTasks();
const globalTasks = await discoverGlobalTasks();
for (const t of [...tasks, ...dishTasks, ...globalTasks]) results.push(await enhanceAndCopyIfExists(t));

const copied = results.filter((r) => r.ok);
const missing = results.filter((r) => !r.ok);

for (const r of copied) {
  const info =
    typeof r.w0 === 'number' && typeof r.w1 === 'number'
      ? ` (${r.w0}x${r.h0} -> ${r.w1}x${r.h1}${r.enhanced ? ', enhanced' : ''})`
      : '';
  console.log(`Synced: ${path.relative(projectRoot, r.from)} -> ${path.relative(projectRoot, r.to)}${info}`);
}
for (const r of missing) console.log(`Missing: ${path.relative(projectRoot, r.from)}`);

if (missing.length > 0) process.exitCode = 2;
