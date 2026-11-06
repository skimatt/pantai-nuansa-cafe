import { existsSync } from 'node:fs';
import path from 'node:path';

type OwnerAsset = { id: string; src: string; sourceFile?: string; permission?: string };
export type ImportedOriginal = { source: string; sha256: string; destination: string; poster?: string };
const portable = (file: string) => path.posix.normalize(file.replaceAll('\\', '/'));

export function validateOwnerOriginal(asset: OwnerAsset, imports: ImportedOriginal[], workspace = process.cwd()) {
  if (!asset.sourceFile) throw new Error(`Missing owner original ${asset.id}`);
  const source = portable(asset.sourceFile);
  if (asset.permission === 'local-folder-publish-intent' && source.startsWith('../')) {
    // External masters stay on the owner's computer; deployment uses tracked derivatives.
    const published = path.posix.join('public', asset.src);
    const record = imports.find(item => portable(item.source) === source &&
      [item.destination, item.poster].some(file => file && portable(file) === published));
    if (!record || !/^[a-f0-9]{64}$/.test(record.sha256)) {
      throw new Error(`Missing import provenance for owner original ${asset.id}`);
    }
    if (!existsSync(path.join(workspace, published))) throw new Error(`Missing published owner media ${asset.id}`);
    return;
  }
  const original = asset.permission === 'local-folder-publish-intent' ? source : path.join('Assets/foto-ig', source);
  if (!existsSync(path.resolve(workspace, original))) throw new Error(`Missing owner original ${asset.id}`);
}
