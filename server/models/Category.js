import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  color: { type: String, default: '#7c9d96' },
}, { timestamps: true });
export default mongoose.model('Category', schema);