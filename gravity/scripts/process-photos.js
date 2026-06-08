import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const PHOTOS_DIR = path.join(process.cwd(), '.photos');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'photos');

const onlyNew = process.argv.includes('--only-new') || process.argv.includes('-n');

async function getImages(dir, relativePath = '') {
  const absoluteDir = path.join(dir, relativePath);
  let entries;
  try {
    entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  } catch {
    return [];
  }
  let results = [];
  
  for (const entry of entries) {
    const entryRelativePath = path.join(relativePath, entry.name);
    if (entry.isDirectory()) {
      const subResults = await getImages(dir, entryRelativePath);
      results = results.concat(subResults);
    } else if (entry.isFile() && /\.(jpg|jpeg|png|webp|avif)$/i.test(entry.name)) {
      results.push(entryRelativePath);
    }
  }
  return results;
}

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

    const images = await getImages(PHOTOS_DIR);

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
      const relPath = images[i];
      const progress = `[${i + 1}/${images.length}]`;
      const inputPath = path.join(PHOTOS_DIR, relPath);
      
      const outputFilename = path.basename(relPath, path.extname(relPath)) + '.webp';
      const targetOutputDir = path.join(OUTPUT_DIR, path.dirname(relPath));
      const outputPath = path.join(targetOutputDir, outputFilename);

      // Ensure the output subdirectory exists
      await fs.mkdir(targetOutputDir, { recursive: true });

      if (onlyNew) {
        try {
          const sourceStat = await fs.stat(inputPath);
          const destStat = await fs.stat(outputPath);
          if (sourceStat.mtimeMs <= destStat.mtimeMs) {
            console.log(`${progress} Skipped (up-to-date): ${relPath}`);
            skippedCount++;
            continue;
          }
        } catch {
          // File does not exist, proceed to process
        }
      }

      console.log(`${progress} Processing: ${relPath} -> /photos/${path.join(path.dirname(relPath), outputFilename).replace(/\\/g, '/')}`);

      const baseSharp = sharp(inputPath)
        .rotate()
        .modulate({
          brightness: 1.05,
          saturation: 0.8,
          hue: 5 // slight color shift
        })
        // Add a slight gamma correction for that washed-out vintage look
        .gamma(1.1);

      // Save full 800x800 version
      await baseSharp
        .clone()
        .resize(800, 800, {
          fit: 'cover',
          position: 'attention',
        })
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);

      // Save 400x400 thumbnail version
      const outputThumbFilename = path.basename(relPath, path.extname(relPath)) + '-thumb.webp';
      const outputThumbPath = path.join(targetOutputDir, outputThumbFilename);
      await baseSharp
        .clone()
        .resize(400, 400, {
          fit: 'cover',
          position: 'attention',
        })
        .webp({ quality: 75, effort: 6 })
        .toFile(outputThumbPath);

      processedCount++;
    }

    console.log(`\nProcessing complete! ${processedCount} processed, ${skippedCount} skipped.`);

  } catch (err) {
    console.error('Error processing photos:', err);
    process.exit(1);
  }
}

processPhotos();
