import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const PHOTOS_DIR = path.join(process.cwd(), '.photos');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'photos');

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

    console.log(`Found ${images.length} images to process...`);

    for (const file of images) {
      const inputPath = path.join(PHOTOS_DIR, file);
      const outputFilename = path.basename(file, path.extname(file)) + '.webp';
      const outputPath = path.join(OUTPUT_DIR, outputFilename);

      console.log(`Processing: ${file} -> /photos/${outputFilename}`);

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

      console.log(`\u2713 Saved to ${outputPath}`);
    }

    console.log('\nAll photos processed!');

  } catch (err) {
    console.error('Error processing photos:', err);
    process.exit(1);
  }
}

processPhotos();
