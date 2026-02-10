/**
 * Delete unused images from public/assets/img.
 * Run: node scripts/delete-unused-images.mjs
 * Add --dry-run to only list what would be deleted.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.join(__dirname, '..', 'public', 'assets', 'img');
const DRY_RUN = process.argv.includes('--dry-run');

// All image paths used in the codebase (relative to img/)
const USED = new Set([
  'Attic Background -20260201T170631Z-3-001/Attic Background/attic1.webp',
  'Attic Background -20260201T170631Z-3-001/Attic Background/attic2.webp',
  'pointt.webp',
  'dirt.webp',
  'Leo1-left.webp',
  'Leo1.webp',
  'Book.webp',
  'Book-800w.webp',
  'Book-1600w.webp',
  'title.webp',
  'title-800w.webp',
  'title-1600w.webp',
  'LeoCurious.webp',
  'Star.webp',
  'Graystar.webp',
  'locked.webp',
  'play.webp',
  'replay.webp',
  'prologueB.webp',
  'prologueC.webp',
  'castleB.webp',
  'castleC.webp',
  'woodsB.webp',
  'woodsC.webp',
  'gateB.webp',
  'gateC.webp',
  'settingboard.webp',
  'LP_BG.webp',
  'LP_BG-960w.webp',
  'LP_BG-1920w.webp',
  'tabframe.webp',
  'openbook.webp',
  'openbook-800w.webp',
  'openbook-1600w.webp',
  'woodboard2.webp',
  'Leo0.webp',
  'C1F2-Leo.webp',
  'C1F2-BG.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/cloud.PNG.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/rock platform.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Bag Icon.webp',
  'whisperingwoods/Marky4-right.webp',
  'X.png.webp',
  'stuff/BananaGlow.webp',
  'stuff/SocksGlow.webp',
  'stuff/RobotGlow.webp',
  'stuff/ToyBox.webp',
  'stuff/ToyBoxRobot.webp',
  'stuff/Bin.webp',
  'stuff/BinWithBanana.webp',
  'stuff/Hamper.webp',
  'stuff/HamperWSocks.webp',
  'stuff/Crown.webp',
  'Leointro.png.webp',
  'herobutton.webp',
  'guardianbutton.webp',
  'papetape.webp',
  'Leo3.webp',
  'Leo2.webp',
  'Leo2-left.webp',
  'Frame 18-Leo.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Full BG-zoomed.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Default_Sleeping.PNG.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/IMG_9241.PNG.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/IMG_9243.PNG.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Stone opens.webp',
  'LeoCurious-right.webp',
  'LeoOH!.webp',
  'Marky1-right.webp',
  'Marky3.webp',
  'Marky2-left.webp',
  'Marky4.webp',
  'po-overlay.webp',
  'Leo looking-right.webp',
  'C1F10-LEO.webp',
  'Marky1.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Full BG.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Climbing Leo.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Left side eye.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Mad.PNG.webp',
  'The Gate of Gratitude-20260201T170632Z-3-001/The Gate of Gratitude/Talking.PNG.webp',
  'LeoSad.webp',
  'whisperingwoods/bg-#2zoom.webp',
  'whisperingwoods/paw tthorn removal bandage.webp',
  'whisperingwoods/paw tthorn removal 2new.webp',
  'whisperingwoods/paw tthorn removal 2.webp',
  'whisperingwoods/Sparkle.webp',
  'whisperingwoods/thornremoved.webp',
  'whisperingwoods/Tool Tweezer.webp',
  'whisperingwoods/Tool Bandage-hor.webp',
  'whisperingwoods/bg wolf.webp',
  'whisperingwoods/bg-#2.webp',
  'whisperingwoods/Marky3-right.webp',
  'whisperingwoods/treee branch.webp',
  'whisperingwoods/wolf_emotions-#2.webp',
  'whisperingwoods/wolf_emotions-#3-happy.webp',
  'whisperingwoods/wolf_emotions-#5.webp',
  'whisperingwoods/wolf emotion thorn orig.webp',
  'whisperingwoods/Wolf emotion suprise after help.webp',
  'whisperingwoods/Leo Shivering-right.webp',
  'whisperingwoods/Leo Shivering.webp',
  'whisperingwoods/Leo looking-left.webp',
  'openbooktape.webp',
  'openbooktape-800w.webp',
  'openbooktape-1600w.webp',
  'whisperingwoods/bg 4.webp',
]);

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.isFile()) {
      yield full;
    }
  }
}

function main() {
  const toDelete = [];
  for (const file of walk(IMG_DIR)) {
    const rel = path.relative(IMG_DIR, file).replace(/\\/g, '/');
    const isTmp = path.basename(file).startsWith('.tmp-');
    const isUsed = USED.has(rel);
    if (isTmp || !isUsed) {
      toDelete.push({ file, rel, isTmp });
    }
  }

  console.log(`Found ${toDelete.length} files to delete (${toDelete.filter((x) => x.isTmp).length} .tmp-*, ${toDelete.filter((x) => !x.isTmp).length} unused):\n`);
  for (const { rel, isTmp } of toDelete) {
    console.log(`  ${isTmp ? '[.tmp]' : '[unused]'} ${rel}`);
  }

  if (DRY_RUN) {
    console.log('\n(--dry-run: no files deleted)');
    return;
  }

  console.log(`\nDeleting ${toDelete.length} files...`);
  let deleted = 0;
  for (const { file } of toDelete) {
    try {
      fs.unlinkSync(file);
      deleted++;
    } catch (err) {
      console.error(`Error deleting ${file}:`, err.message);
    }
  }
  console.log(`Deleted ${deleted} files.`);
}

main();
