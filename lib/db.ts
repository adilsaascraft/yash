import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not defined");
}


let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  
  if (cached.conn) return cached.conn;

  console.log('MONGO_URI =', process.env.MONGO_URI)

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then((mongoose) => {
        console.log('✅ Mongo Connected')
        return mongoose
      })
      .catch((err) => {
        console.error('❌ Mongo Error:', err)
        throw err
      })
  }

  cached.conn = await cached.promise;
  return cached.conn;
}