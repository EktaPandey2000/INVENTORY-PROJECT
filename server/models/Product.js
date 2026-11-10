import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  sku: { type: String, required: true, unique: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  unit: { type: String, default: 'pcs' },
  price: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 10 },
  
  // 🚨 नया फील्ड: किसने बनाया?
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

export default mongoose.model('Product', schema);