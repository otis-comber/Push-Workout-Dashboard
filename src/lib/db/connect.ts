import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Define MONGODB_URI in .env.local");

const mongoUri = MONGODB_URI;

// `global` survives Next.js hot reloads; module-level vars dont.
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn; // already connected -> reuse
  if (!cached.promise) {
    // not connecting yet -> start once
    cached.promise = mongoose.connect(mongoUri).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
