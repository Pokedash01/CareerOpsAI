import {
  initRelationalDatabase,
  saveRelationalDatabase,
  dbUsers,
  dbJobs
} from '../server/database.js';
import fs from 'fs';
import path from 'path';

// Force wipe corrupt DB state
const DB_DIR = path.join(process.cwd(), 'data', 'db');
if (fs.existsSync(DB_DIR)) {
  fs.readdirSync(DB_DIR).forEach(f => fs.unlinkSync(path.join(DB_DIR, f)));
}

// Load store
const store = JSON.parse(fs.readFileSync('careerops_store.json', 'utf-8'));

// Manually trigger migration
initRelationalDatabase(store);

// Save to disk to populate all JSON files
saveRelationalDatabase();

console.log(`Database migrated: ${Object.keys(dbUsers).length} users, ${Object.keys(dbJobs).length} jobs.`);
