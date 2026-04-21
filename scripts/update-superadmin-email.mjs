import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

try {
  const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch {}

const MIKE_EMAIL = 'mike@reliance-brokerage.com';
const ANNY_EMAIL = 'anny@reliance-brokerage.com';

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

function strongPassword() {
  const raw = randomBytes(12).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 14);
  return `R!${raw}9`;
}

await mongoose.connect(MONGODB_URI);
const users = mongoose.connection.collection('users');

const existingSuper = await users.findOne({ role: 'superadmin' });
if (!existingSuper) {
  console.error('No superadmin found to rename. Seed one first.');
  await mongoose.disconnect();
  process.exit(1);
}

const prevEmail = existingSuper.email;
await users.updateOne(
  { _id: existingSuper._id },
  { $set: { email: MIKE_EMAIL.toLowerCase(), updatedAt: new Date() } }
);
console.log(`[1] Renamed superadmin email: ${prevEmail} -> ${MIKE_EMAIL}`);

const annyExisting = await users.findOne({ email: ANNY_EMAIL.toLowerCase() });
if (annyExisting) {
  console.log(`[2] User ${ANNY_EMAIL} already exists (role=${annyExisting.role}). Skipping create.`);
} else {
  const password = strongPassword();
  const hash = await bcrypt.hash(password, 12);
  const now = new Date();
  await users.insertOne({
    name: 'Anny',
    email: ANNY_EMAIL.toLowerCase(),
    password: hash,
    role: 'superadmin',
    phone: '',
    company: '',
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`[2] Created superadmin: ${ANNY_EMAIL}`);
  console.log(`    Temporary password: ${password}`);
  console.log(`    (Save this now — it is not stored in plaintext anywhere.)`);
}

await mongoose.disconnect();
