/**
 * Resize and compress images in public/assets/img for faster loading.
 * - Resizes to max 1600px on longest side (does not enlarge small images)
 * - Compresses to WebP quality 82
 * - Outputs to public/assets/img-resized/ (copy into img/ to replace originals)
 *
 * Run: node scripts/resize-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'assets', 'img');
const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'img-resized');
const MAX_SIZE = 1600;
const WEBP_QUALITY = 82;
const MIN_SIZE_KB = 80; // Only process files larger than this (skip tiny icons)

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
    // Output to img-resized/ preserving folder structure; PNG->file.png.webp, WebP->same path
    const outRel = isWebp ? relPath : path.join(path.dirname(relPath) || '.', path.basename(file) + '.webp');
    const outPath = path.join(OUT_DIR, outRel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    await sharp(file)
        .resize(MAX_SIZE, MAX_SIZE, { fit: 'inside', withoutEnlargement: true })
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
    console.log(`Found ${files.length} images. Processing files > ${MIN_SIZE_KB}KB...\n`);

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
    console.log(`\nOptimized images are in public/assets/img-resized/`);
    console.log(`To use them: copy img-resized/* into img/ (replace originals).`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
