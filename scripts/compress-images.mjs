/**
 * Compress images (no resize) in public/assets/img for faster loading.
 * - Keeps original dimensions, only reduces file size via WebP compression
 * - Quality 82 (good balance of size vs visual quality)
 * - Outputs to public/assets/img-compressed/ (copy into img/ to replace originals)
 *
 * Run: node scripts/compress-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'assets', 'img');
const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'img-compressed');
const WEBP_QUALITY = 82;
const MIN_SIZE_KB = 5; // Skip tiny files (icons, etc.)

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function* walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) yield* walk(full);
        else if (e.isFile() && !e.name.startsWith('.tmp-') && IMAGE_EXTS.has(path.extname(e.name).toLowerCase())) yield full;
    }
}

async function processFile(file) {
    const ext = path.extname(file).toLowerCase();
    const relPath = path.relative(IMG_DIR, file);
    const stat = fs.statSync(file);
    const sizeKb = stat.size / 1024;

    if (sizeKb < MIN_SIZE_KB) return { processed: false, reason: 'small' };

    const isWebp = ext === '.webp';
    const outRel = isWebp ? relPath : path.join(path.dirname(relPath) || '.', path.basename(file) + '.webp');
    const outPath = path.join(OUT_DIR, outRel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    // No resize - only compress (preserves dimensions)
    await sharp(file)
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);

    const newStat = fs.statSync(outPath);
    const newSizeKb = (newStat.size / 1024).toFixed(1);
    const saved = ((1 - newStat.size / stat.size) * 100).toFixed(0);

    return {
        processed: true,
        rel: outRel,
        oldKb: sizeKb.toFixed(1),
        newKb: newSizeKb,
        saved: saved + '%',
    };
}

async function main() {
    const files = [...walk(IMG_DIR)];
    console.log(`Found ${files.length} images. Compressing files > ${MIN_SIZE_KB}KB (no resize)...\n`);

    let processed = 0;
    let totalSaved = 0;

    for (const file of files) {
        try {
            const result = await processFile(file);
            if (result.processed) {
                console.log(`${result.rel}: ${result.oldKb}KB → ${result.newKb}KB (saved ${result.saved})`);
                processed++;
                totalSaved += parseFloat(result.oldKb) - parseFloat(result.newKb);
            }
        } catch (err) {
            console.error('Error:', file, err.message);
        }
    }

    console.log(`\nDone. Processed ${processed} images. Total saved ~${totalSaved.toFixed(0)}KB.`);
    console.log(`\nCompressed images are in public/assets/img-compressed/`);
    console.log(`To use them: copy img-compressed/* into img/ (replace originals).`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
