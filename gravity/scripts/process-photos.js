import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const PHOTOS_DIR = path.join(process.cwd(), '.photos');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'photos');

const onlyNew = process.argv.includes('--only-new') || process.argv.includes('-n');

async function processPhotos() {
  try {
    // Ensure directories exist
    try {
      await fs.access(PHOTOS_DIR);
    } catch {
      await fs.mkdir(PHOTOS_DIR, { recursive: true });
      console.log(`Created ${PHOTOS_DIR}. Put images here to process them.`);
    }

    try {
      await fs.access(OUTPUT_DIR);
    } catch {
      await fs.mkdir(OUTPUT_DIR, { recursive: true });
    }

    const files = await fs.readdir(PHOTOS_DIR);
    const images = files.filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file));

    if (images.length === 0) {
      console.log(`No images found in ${PHOTOS_DIR}`);
      return;
    }

    if (onlyNew) {
      console.log(`Checking ${images.length} images for updates (--only-new)...`);
    } else {
      console.log(`Found ${images.length} images to process...`);
    }

    let processedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const progress = `[${i + 1}/${images.length}]`;
      const inputPath = path.join(PHOTOS_DIR, file);
      const outputFilename = path.basename(file, path.extname(file)) + '.webp';
      const outputPath = path.join(OUTPUT_DIR, outputFilename);

      if (onlyNew) {
        try {
          const sourceStat = await fs.stat(inputPath);
          const destStat = await fs.stat(outputPath);
          if (sourceStat.mtimeMs <= destStat.mtimeMs) {
            console.log(`${progress} Skipped (up-to-date): ${file}`);
            skippedCount++;
            continue;
          }
        } catch {
          // File does not exist, proceed to process
        }
      }

      console.log(`${progress} Processing: ${file} -> /photos/${outputFilename}`);

      await sharp(inputPath)
        .resize(800, 800, {
          fit: 'cover',
          position: 'attention',
        })
        .modulate({
          brightness: 1.05,
          saturation: 0.8,
          hue: 5 // slight color shift
        })
        // Add a slight gamma correction for that washed-out vintage look
        .gamma(1.1)
        // Convert to webp with good quality
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);

      processedCount++;
    }

    console.log(`\nProcessing complete! ${processedCount} processed, ${skippedCount} skipped.`);

  } catch (err) {
    console.error('Error processing photos:', err);
    process.exit(1);
  }
}

processPhotos();
