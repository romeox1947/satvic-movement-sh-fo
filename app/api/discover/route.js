import { readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'public', 'assets');
const videoTypes = new Set(['.mp4', '.webm', '.mov', '.m4v']);
const imageTypes = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

async function collect(dir = root, items = []) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return items; }
  entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, items);
    else {
      const ext = path.extname(entry.name).toLowerCase();
      const kind = videoTypes.has(ext) ? 'reel' : imageTypes.has(ext) ? 'photo' : null;
      if (!kind) continue;
      const relative = path.relative(path.join(process.cwd(), 'public'), absolute).split(path.sep).join('/');
      const category = path.relative(root, absolute).split(path.sep)[0];
      const stem = path.basename(entry.name, ext);
      const match = stem.match(/^(.*?)_(\d+)_(.+)$/);
      items.push({
        id: relative,
        url: `/${relative}`,
        kind,
        category,
        title: match ? `${match[1].replaceAll('_', ' ')} ${match[2]}` : stem.replaceAll('_', ' '),
        creator: match?.[3].replace(/_+$/, '') || 'satvic.community',
        place: path.basename(path.dirname(absolute)),
        city: 'Pune',
      });
    }
  }
  return items;
}

export async function GET() {
  return Response.json({ items: await collect() });
}
