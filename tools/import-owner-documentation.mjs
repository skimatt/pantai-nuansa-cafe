import { readFile, writeFile, mkdir, copyFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { z } from 'zod';
import { syncLocalPhotos } from './sync-local-photos.mjs';

const itemSchema = z.object({
  file: z.string().regex(/^[a-z0-9-]+\.(jpeg|mp4)$/),
  caption: z.string().min(1),
  alt: z.string().min(1),
});
const config = z.object({
  sourceRoot: z.string(),
  date: z.string(),
  credit: z.string(),
  photos: z.array(itemSchema),
  videos: z.array(itemSchema),
  featuredVideo: z.string(),
  facilityPhotos: z.array(z.string()),
  discoverPhotos: z.array(z.string()),
}).parse(JSON.parse(await readFile('content/documentation-import.json', 'utf8')));
const sourceRoot = path.resolve(config.sourceRoot);
const outputRoot = 'public/assets/owner-documentation';
const evidenceRoot = 'evidence/documentation-import';
const provenance = 'docs/implementation/OWNER_DOCUMENTATION_IMPORT.md';
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
const saveJson = async (file, value) => writeFile(file, JSON.stringify(value, null, 2) + '\n');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const probe = file => JSON.parse(execFileSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_type,codec_name,width,height',
  '-of', 'json', file,
], { encoding: 'utf8' }));
const encode = args => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
await mkdir(outputRoot, { recursive: true });
await mkdir(evidenceRoot, { recursive: true });
const imported = [];
const assets = [];
const films = [];

// Reuse identical photos already supplied through the local folder workflow.
const photoMetadataPath = 'foto-website/galeri/foto.json';
const photoMetadata = await readJson(photoMetadataPath);
const priorPhotos = Object.entries(photoMetadata).filter(([file]) => !config.photos.some(item => item.file === file));
for (const [index, [, value]] of priorPhotos.entries()) value.order = 100 + index;
for (const [order, item] of config.photos.entries()) {
  const source = path.join(sourceRoot, 'Gambar', item.file);
  const bytes = await readFile(source);
  const destination = path.join('foto-website/galeri', item.file);
  try {
    const existing = await readFile(destination);
    if (digest(existing) !== digest(bytes)) throw new Error('Photo name conflicts with an existing original: ' + destination);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await copyFile(source, destination);
  }
  photoMetadata[item.file] = { caption: item.caption, alt: item.alt, credit: config.credit, order };
  imported.push({ type: 'image', source: path.relative(process.cwd(), source), sha256: digest(bytes), destination });
}
await saveJson(photoMetadataPath, photoMetadata);
const facilityMetadata = {};
for (const [order, file] of config.facilityPhotos.entries()) {
  await copyFile(path.join(sourceRoot, 'Gambar', file), path.join('foto-website/fasilitas', file));
  const item = config.photos.find(photo => photo.file === file);
  facilityMetadata[file] = { caption: item.caption, alt: item.alt, credit: config.credit, order };
}
await saveJson('foto-website/fasilitas/foto.json', facilityMetadata);

for (const item of config.videos) {
  const source = path.join(sourceRoot, 'Video', item.file);
  const hash = digest(await readFile(source));
  const stem = item.file.replace('.mp4', '') + '-' + hash.slice(0, 12);
  const destination = path.join(outputRoot, stem + '.mp4');
  const posterFile = path.join(outputRoot, stem + '-poster.webp');
  try {
    await stat(destination);
    await stat(posterFile);
  } catch {
    const original = probe(source);
    const video = original.streams.find(stream => stream.codec_type === 'video');
    const ratio = Math.min(1, 1280 / Math.max(video.width, video.height));
    const width = Math.max(2, Math.floor(video.width * ratio / 2) * 2);
    const height = Math.max(2, Math.floor(video.height * ratio / 2) * 2);
    // FFmpeg autorotates camera metadata before scaling. Keep the displayed ratio.
    const landscape = video.width > video.height;
    const filter = landscape
      ? 'scale=1280:1280:force_original_aspect_ratio=decrease:force_divisible_by=2'
      : `scale=${width}:${height}`;
    encode(['-i', source, '-map', '0:v:0', '-an', '-vf', filter, '-r', '24',
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', '-map_metadata', '-1', destination]);
    const metadata = probe(destination);
    const time = Math.min(2, Number(metadata.format.duration) / 3);
    const frame = execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-ss', String(time),
      '-i', destination, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 20 * 1024 * 1024 });
    await sharp(frame).resize({ width: 720, height: 960, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84 }).toFile(posterFile);
  }
  const metadata = probe(destination);
  const video = metadata.streams.find(stream => stream.codec_type === 'video');
  const poster = await sharp(posterFile).metadata();
  const id = 'owner-' + item.file.replace('.mp4', '');
  const common = {
    sceneId: 'golden-memories', sourceType: 'owner', license: 'User supplied documentation for website publication',
    attribution: config.credit, verified: false, isPlaceholder: false, alt: item.alt,
    variants: [], loading: 'lazy', pivot: [.5, .5], depth: .5, status: 'approved',
    promptVersion: 'owner-documentation-2026-11-05', provenance,
    sourceFile: path.relative(process.cwd(), source).replaceAll('\\', '/'), permission: 'local-folder-publish-intent',
  };
  assets.push(
    { ...common, id, src: '/' + destination.replaceAll('\\', '/').replace(/^public\//, ''), type: 'video',
      width: video.width, height: video.height, durationSeconds: Number(metadata.format.duration), hasAudio: false },
    { ...common, id: id + '-poster', src: '/' + posterFile.replaceAll('\\', '/').replace(/^public\//, ''),
      type: 'image', width: poster.width, height: poster.height },
  );
  films.push({ id: 'moment-' + id, type: 'video', assetId: id, posterAssetId: id + '-poster',
    caption: item.caption, alt: item.alt, verified: false, credit: config.credit, sortOrder: films.length });
  imported.push({ type: 'video', source: common.sourceFile, sha256: hash, destination, poster: posterFile,
    duration: Number(metadata.format.duration), bytes: Number(metadata.format.size), width: video.width, height: video.height });
  console.log('Dokumentasi siap:', item.file);
}

const { output: photos } = await syncLocalPhotos();
const photoAsset = file => photos.assets.find(asset => asset.sourceFile === 'foto-website/galeri/' + file);
const media = await readJson('content/media.json');
media.assets = [...media.assets.filter(asset => !asset.id.startsWith('owner-video-')), ...assets];
const gallery = await readJson('content/gallery.json');
const featured = films.find(item => item.assetId === 'owner-' + config.featuredVideo.replace('.mp4', ''));
if (!featured) throw new Error('Featured documentary video is missing');
gallery.items = [featured, ...films.filter(item => item !== featured),
  ...gallery.items.filter(item => !item.assetId.startsWith('owner-video-'))]
  .map((item, sortOrder) => ({ ...item, sortOrder }));
const sections = await readJson('content/sections.json');
sections.journey.discover.nextLabel = 'Lihat suasana lebih dekat';
sections.journey.discover.photos = config.discoverPhotos.map((file, index) => {
  const asset = photoAsset(file);
  const item = config.photos.find(photo => photo.file === file);
  return { ...sections.journey.discover.photos[index], assetId: asset.id, caption: item.caption, credit: config.credit };
});
const experience = sections.journey.experience;
const featuredAsset = assets.find(asset => asset.id === featured.assetId);
const seconds = Math.round(featuredAsset.durationSeconds);
Object.assign(experience, {
  assetId: featured.assetId, posterAssetId: featured.posterAssetId, previewAssetId: featured.assetId,
  description: 'Meja di atas pasir, naungan pepohonan, dan laut di depan mata. Putar dokumentasi untuk melihat suasananya lebih dekat.',
  titleLabel: 'Cuplikan area duduk outdoor di tepi pantai', durationLabel: `00:${String(seconds).padStart(2, '0')}`,
  credit: config.credit, playLabel: 'Putar video suasana', pauseLabel: 'Jeda video suasana',
  replayLabel: 'Putar ulang video suasana', visualDescription: featured.alt,
});
await saveJson('content/media.json', media);
await saveJson('content/gallery.json', gallery);
await saveJson('content/sections.json', sections);
const pages = await readJson('content/pages.json');
pages.labels.facilityNotice = 'Kenali area duduk dan pandangan pantai melalui dokumentasi Pantai Nuansa Cafe.';
await saveJson('content/pages.json', pages);
await saveJson(evidenceRoot + '/import-manifest.json', { date: config.date, items: imported });
console.log('Impor lengkap:', config.photos.length, 'foto dan', films.length, 'video.');
