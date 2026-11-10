import Product from '../models/Product.js';
import Batch from '../models/Batch.js';

export const getProducts = async (req, res) => {
  const { search, category } = req.query;
  const q = {};
  if (search) q.name = { $regex: search, $options: 'i' };
  if (category) q.category = category;
  
  const items = await Product.find(q).populate('category supplier createdBy').sort('-createdAt');
  
  const result = await Promise.all(items.map(async (p) => {
    // 🚨 यहाँ से status: 'active' हटा दिया है, अब यह सारे बैचों का टोटल जोड़ेगा (एक्सपायर सहित)
    const batches = await Batch.find({ product: p._id });
    
    // टोटल स्टॉक (जो Products पेज पर दिखेगा)
    const totalStock = batches.reduce((s, b) => s + b.quantity, 0);
    
    // सिर्फ एक्टिव स्टॉक (जिससे पता चले कि कितना बेचने लायक है)
    const activeBatches = batches.filter(b => b.status === 'active');
    const activeStock = activeBatches.reduce((s, b) => s + b.quantity, 0);

    return { ...p.toObject(), stock: totalStock, activeStock };
  }));
  
  res.json(result);
};

export const createProduct = async (req, res) => {
  // 🚨 createdBy सेव करें
  const product = await Product.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });

  // 🚨 सुरक्षा चेक: अगर एडमिन नहीं है और उसने खुद नहीं बनाया है, तो रोक दें
  if (req.user.role !== 'admin' && p.createdBy?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only edit products you created.' });
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && p.createdBy?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only delete products you created.' });
  }

  await Product.findByIdAndDelete(req.params.id);
  await Batch.deleteMany({ product: req.params.id });
  res.json({ message: 'Deleted' });
};