import 'dotenv/config';
// Migration script to update legacy projects so productCount uses pipe sizes
// Usage: node backend/scripts/migrateProductCountToSizes.js

import mongoose from 'mongoose';
import Project from '../models/Project.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/supreme';

async function migrate() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const projects = await Project.find({});
  let updated = 0;

  for (const project of projects) {
    if (!project.predictionData?.classes || !project.productCount?.length) continue;

    // Build color-to-size map
    const colorToSize = {};
    for (const cls of project.predictionData.classes) {
      colorToSize[cls.color] = cls.className;
    }

    // Check if any productCount entry uses color name
    let needsUpdate = false;
    for (const item of project.productCount) {
      if (colorToSize[item.name]) {
        needsUpdate = true;
        break;
      }
    }
    if (!needsUpdate) continue;

    // Transform productCount to use sizes
    const newProductCount = project.productCount.map(item => {
      if (colorToSize[item.name]) {
        return { name: colorToSize[item.name], count: item.count };
      }
      return item;
    });

    project.productCount = newProductCount;
    await project.save();
    updated++;
  }

  console.log(`Migration complete. Updated ${updated} projects.`);
  mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  mongoose.disconnect();
});
