import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  type: { type: String, enum: ['expired', 'expiring', 'low-stock'], required: true },
  message: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  severity: { type: String, enum: ['info', 'warning', 'danger'], default: 'info' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Alert', schema);