import mongoose from 'mongoose';

type RuntimeMode = 'development' | 'production' | 'test';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

function getRuntimeMode(): RuntimeMode {
  const mode = process.env.NODE_ENV;
  if (mode === 'production' || mode === 'test') return mode;
  return 'development';
}

function getMongoUri(mode: RuntimeMode): string {
  const isProduction = mode === 'production';
  const envKey = isProduction ? 'MONGODB_URI_PRODUCTION' : 'MONGODB_URI';
  const uri = process.env[envKey];

  if (!uri) {
    throw new Error(`${envKey} is not defined for NODE_ENV=${mode}`);
  }

  return uri;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache = global._mongooseCache ?? { conn: null, promise: null };
if (!global._mongooseCache) global._mongooseCache = cache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    const runtimeMode = getRuntimeMode();
    const mongoUri = getMongoUri(runtimeMode);

    cache.promise = mongoose
      .connect(mongoUri, {
        bufferCommands: false,
        autoIndex: runtimeMode !== 'production',
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      })
      .catch((err) => {
        cache.promise = null;
        throw err;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
