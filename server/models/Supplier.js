import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: String, email: String, phone: String, address: String,
}, { timestamps: true });
export default mongoose.model('Supplier', schema);