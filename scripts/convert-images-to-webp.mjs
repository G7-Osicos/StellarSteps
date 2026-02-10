/**
 * Convert PNG/JPG/JPEG under public/assets/img to WebP (same folder, .webp extension).
 * Run: node scripts/convert-images-to-webp.mjs
 * Then update your JSX to reference .webp and optionally remove originals.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'assets', 'img');
const EXTS = new Set(['.png', '.jpg', '.jpeg']);
const WEBP_QUALITY = 85;

function* walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) yield* walk(full);
        else if (e.isFile() && EXTS.has(path.extname(e.name).toLowerCase())) yield full;
    }
}

async function main() {
    let count = 0;
    for (const file of walk(IMG_DIR)) {
        const ext = path.extname(file).toLowerCase();
        const out = path.join(path.dirname(file), path.basename(file, ext) + '.webp');
        await sharp(file)
            .webp({ quality: WEBP_QUALITY })
            .toFile(out);
        console.log(path.relative(IMG_DIR, file), '->', path.relative(IMG_DIR, out));
        count++;
    }
    console.log('Done. Converted', count, 'images to WebP.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
