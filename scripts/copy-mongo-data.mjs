import { readFileSync } from 'fs';
import mongoose from 'mongoose';

try {
  const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
} catch {}

const sourceUri =
  process.env.SOURCE_MONGODB_URI ??
  process.env.MONGODB_URI;

const targetUri =
  process.env.TARGET_MONGODB_URI ??
  process.env.MONGODB_URI_PRODUCTION ??
  process.env.MONGODB_URL_PRODUCTION;

if (!sourceUri) {
  console.error('SOURCE_MONGODB_URI or MONGODB_URI is not set');
  process.exit(1);
}

if (!targetUri) {
  console.error('TARGET_MONGODB_URI, MONGODB_URI_PRODUCTION, or MONGODB_URL_PRODUCTION is not set');
  process.exit(1);
}

if (sourceUri === targetUri) {
  console.error('Source and target MongoDB URIs are the same. Refusing to copy.');
  process.exit(1);
}

const overwrite = process.env.OVERWRITE_TARGET === '1';

const source = await mongoose.createConnection(sourceUri).asPromise();
const target = await mongoose.createConnection(targetUri).asPromise();

try {
  const collections = await source.db.listCollections().toArray();
  const names = collections
    .map((collection) => collection.name)
    .filter((name) => !name.startsWith('system.'))
    .sort();

  if (!names.length) {
    console.log('No collections found in source database.');
  }

  for (const name of names) {
    const sourceCollection = source.db.collection(name);
    const targetCollection = target.db.collection(name);
    const documents = await sourceCollection.find({}).toArray();

    if (overwrite) {
      await targetCollection.deleteMany({});
    }

    if (documents.length > 0) {
      if (overwrite) {
        await targetCollection.insertMany(documents, { ordered: false });
      } else {
        await targetCollection.bulkWrite(
          documents.map((document) => ({
            updateOne: {
              filter: { _id: document._id },
              update: { $set: document },
              upsert: true,
            },
          })),
          { ordered: false }
        );
      }
    }

    console.log(`Copied ${documents.length} document(s) into ${name}`);
  }
} finally {
  await source.close();
  await target.close();
}