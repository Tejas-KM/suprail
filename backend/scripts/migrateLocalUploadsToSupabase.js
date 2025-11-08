#!/usr/bin/env node
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import moment from 'moment';
import Project from '../models/Project.js';
import { uploadBufferToSupabase } from '../utils/supabaseClient.js';

function guessContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

async function run() {
  const uploadsDir = path.resolve('uploads');
  const mongo = process.env.MONGO_URI;
  if (!mongo) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(mongo);
  console.log('Connected to Mongo');

  const filter = { $and: [
    { imageUrl: { $exists: true, $ne: '' } },
    { imageUrl: { $not: { $regex: '^https?://' } } }, // not absolute URL
  ]};
  const total = await Project.countDocuments(filter);
  console.log('Projects to migrate:', total);

  const cursor = Project.find(filter).cursor();
  let migrated = 0, skipped = 0, failed = 0;
  for await (const proj of cursor) {
    try {
      const localName = proj.imageUrl;
      const localPath = path.join(uploadsDir, localName);
      if (!fs.existsSync(localPath)) {
        console.warn('Missing local file, skipping:', localName);
        skipped++;
        continue;
      }
      const buffer = fs.readFileSync(localPath);
      const ext = path.extname(localName) || '.jpg';
      const safeExt = /^\.[a-z0-9]+$/i.test(ext) ? ext : '.jpg';
      const objectPath = `projects/${moment(proj.createdAt || Date.now()).format('YYYY/MM/DD')}/${path.basename(localName, ext)}${safeExt}`;
      const contentType = guessContentType(localName);
      await uploadBufferToSupabase(objectPath, buffer, contentType);
      proj.imageUrl = objectPath; // store the Supabase object path
      await proj.save();
      migrated++;
      console.log(`[${migrated}/${total}] migrated ->`, objectPath);
    } catch (e) {
      console.error('Failed to migrate project', proj._id?.toString?.(), e?.message);
      failed++;
    }
  }

  console.log('Done. migrated:', migrated, 'skipped:', skipped, 'failed:', failed);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error('Migration fatal error:', e);
  process.exit(1);
});
