import { readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'public', 'assets');
const videoExtensions = new Set(['.mp4', '.webm', '.mov', '.m4v']);

async function collect(dir = root, items = []) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return items; }
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(absolute, items);
    else if (videoExtensions.has(path.extname(entry.name).toLowerCase())) {
      const relative = path.relative(path.join(process.cwd(), 'public'), absolute).split(path.sep).join('/');
      const stem = path.basename(entry.name, path.extname(entry.name));
      const match = stem.match(/^(.*?)_(\d+)_(.+)$/);
      const title = match ? `${match[1].replaceAll('_', ' ')} ${match[2]}` : stem.replaceAll('_', ' ');
      const creator = match?.[3].replace(/_+$/, '') || 'satvic.community';
      items.push({ src: `/${relative}`, title, creator, place: path.basename(path.dirname(absolute)), city: 'Pune', video: `/${relative}` });
    }
  }
  return items;
}

export async function GET() {
  return Response.json({ reels: await collect() });
}
