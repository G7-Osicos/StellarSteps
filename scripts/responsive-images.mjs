/**
 * Generate responsive WebP sizes for hero images so mobile gets smaller files.
 * Run after convert-images-to-webp.mjs. Run: node scripts/responsive-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'assets', 'img');
const Q = 82;

// Full-screen BG: 960w (mobile/tablet), 1920w (desktop)
const BG_SIZES = [960, 1920];
// Book/title/openbook: max display ~672px (2xl), so 800 and 1600 for 2x screens
const HERO_SIZES = [800, 1600];

const HERO_FILES = ['LP_BG.webp', 'Book.webp', 'title.webp', 'openbook.webp', 'openbooktape.webp'];

async function main() {
    for (const name of HERO_FILES) {
        const full = path.join(IMG_DIR, name);
        if (!fs.existsSync(full)) {
            console.warn('Skip (not found):', name);
            continue;
        }
        const isBg = name === 'LP_BG.webp';
        const widths = isBg ? BG_SIZES : HERO_SIZES;
        const base = name.replace(/\.webp$/, '');
        for (const w of widths) {
            const out = path.join(IMG_DIR, `${base}-${w}w.webp`);
            await sharp(full)
                .resize(w, null, { withoutEnlargement: true })
                .webp({ quality: Q })
                .toFile(out);
            console.log(name, '->', `${base}-${w}w.webp`);
        }
    }
    console.log('Done. Responsive hero images created.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
