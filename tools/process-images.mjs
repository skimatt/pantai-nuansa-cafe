import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

// Only workspace-owned generated originals are transformed; originals remain intact.
const root = process.cwd();
const source = path.join(root, 'assets-source/generated');
const records = [];
await mkdir(path.join(root, 'public/assets/environment'), { recursive: true });
await mkdir(path.join(root, 'public/assets/menu'), { recursive: true });
for (const file of await readdir(source)) {
  if (!/^(coastal-master-v1|palm-foreground-v2|menu-\d{2}-v1)\.png$/.test(file)) continue; // Later scenes have dedicated processors.
  const hero = file.startsWith('coastal'), palm=file.startsWith('palm');
  const name = hero ? 'coastal-master-v1' : palm ? 'palm-foreground-v2' : file.replace(/-v1\.png$/, '');
  const target = `assets/${hero||palm ? 'environment' : 'menu'}/${name}.webp`;
  const result = await sharp(path.join(source, file)).resize({ width: hero ? 1920 : palm ? 900 : 640, withoutEnlargement: true }).webp({ quality: hero ? 86 : 82 }).toFile(path.join(root, 'public', target));
  records.push({ src: `/${target}`, width: result.width, height: result.height, bytes: result.size });
  if (hero) {
    const mobile = await sharp(path.join(source, file)).resize(780, 1200, { fit: 'cover', position: 'right' }).webp({ quality: 84 }).toFile(path.join(root, 'public/assets/environment/coastal-mobile-v1.webp'));
    records.push({ src: '/assets/environment/coastal-mobile-v1.webp', width: mobile.width, height: mobile.height, bytes: mobile.size });
  }
}
await writeFile(path.join(root, 'assets-source/processed-assets.json'), JSON.stringify(records, null, 2));
console.log(`Optimized ${records.length} assets. Originals preserved.`);
