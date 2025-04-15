import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Ensure the environment variable is defined
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Cached connection to avoid multiple connections in serverless environments
let cached = global.mongoose || { conn: null, promise: null };

async function connectToDB() {
  // Return the cached connection if already available
  if (cached.conn) {
    return cached.conn;
  }

  // If no cached connection, create a new connection and cache it
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Disable buffering of commands
      useNewUrlParser: true, // Avoid deprecation warnings for MongoDB URI parser
      useUnifiedTopology: true, // Avoid deprecation warnings for MongoDB topology engine
    });
  }

  // Store the resolved promise in the cache and return the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
