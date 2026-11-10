import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  batchNumber: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  costPrice: { type: Number, default: 0 },
  manufacturingDate: Date,
  expiryDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ['active', 'expired', 'depleted'], default: 'active' },
}, { timestamps: true });
schema.index({ product: 1, batchNumber: 1 }, { unique: true });
export default mongoose.model('Batch', schema);