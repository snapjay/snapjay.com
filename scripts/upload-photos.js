import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import mime from 'mime-types';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

// Load .env relative to project root
dotenv.config({ path: path.join(process.cwd(), '.env') });

const REGION = 'us-east-1';
const BUCKET_NAME = 'cdn.snapjay.com';
const CLOUDFRONT_DISTRIBUTION_ID = 'E3E2072OYV7APJ';

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  }
});

const cloudFrontClient = new CloudFrontClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  }
});

const PHOTOS_DIR = path.join(process.cwd(), 'public', 'photos');

async function getFiles(dir, relativePath = '') {
  const absoluteDir = path.join(dir, relativePath);
  let entries;
  try {
    entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  } catch (err) {
    return [];
  }
  let results = [];
  
  for (const entry of entries) {
    const entryRelativePath = path.join(relativePath, entry.name);
    if (entry.isDirectory()) {
      const subResults = await getFiles(dir, entryRelativePath);
      results = results.concat(subResults);
    } else if (entry.isFile()) {
      results.push(entryRelativePath);
    }
  }
  return results;
}

async function uploadToS3() {
  if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET) {
    console.error('Missing AWS_ACCESS_KEY or AWS_SECRET in .env file!');
    process.exit(1);
  }

  try {
    console.log('Scanning local files...');
    const localFiles = await getFiles(PHOTOS_DIR);
    
    if (localFiles.length === 0) {
      console.log('No processed photos found to upload.');
      return;
    }

    console.log(`Found ${localFiles.length} files to upload.`);

    for (let i = 0; i < localFiles.length; i++) {
      const relPath = localFiles[i];
      // S3 keys use forward slashes
      const s3Key = relPath.replace(/\\/g, '/');
      const fullPath = path.join(PHOTOS_DIR, relPath);
      
      const fileContent = await fs.readFile(fullPath);
      const mimeType = mime.lookup(fullPath) || 'application/octet-stream';
      
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000, immutable'
      };

      console.log(`[${i + 1}/${localFiles.length}] Uploading ${s3Key}...`);
      await s3Client.send(new PutObjectCommand(uploadParams));
    }

    console.log('All files uploaded successfully.');
    
    console.log('Invalidating CloudFront cache...');
    const invalidationParams = {
      DistributionId: CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: `invalidation-${Date.now()}`,
        Paths: {
          Quantity: 1,
          Items: ['/*']
        }
      }
    };

    await cloudFrontClient.send(new CreateInvalidationCommand(invalidationParams));
    console.log('CloudFront invalidation created successfully!');
    console.log(`Photos are now live at https://cdn.snapjay.com/`);
    
  } catch (error) {
    console.error('Error during S3 upload or CloudFront invalidation:', error);
    process.exit(1);
  }
}

uploadToS3();
