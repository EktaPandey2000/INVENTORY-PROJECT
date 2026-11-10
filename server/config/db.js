import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory_expiry');
    console.log(`✅ MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ DB error', err.message);
    process.exit(1);
  }
};
export default connectDB;