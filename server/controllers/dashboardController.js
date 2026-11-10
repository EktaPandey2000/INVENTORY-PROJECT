import Product from '../models/Product.js';
import Batch from '../models/Batch.js';
import Alert from '../models/Alert.js';

export const getStats = async (_, res) => {
  const now = new Date();
  const in30 = new Date(); in30.setDate(in30.getDate() + 30);

  const allProducts = await Product.find();
  const productCount = allProducts.length;
  const allProductNames = allProducts.map(p => p.name);

  // Active Batches (जो अभी एक्सपायर नहीं हुए हैं)
  const activeBatches = await Batch.find({ status: 'active' }).populate('product', 'name');
  const batchCount = activeBatches.length;
  const activeProductNames = [...new Set(activeBatches.map(b => b.product?.name).filter(Boolean))];

  // Expiring Soon (अगले 30 दिन में एक्सपायर होंगे)
  const expiringSoonBatches = await Batch.find({ expiryDate: { $gte: now, $lte: in30 }, status: 'active' }).populate('product', 'name');
  const expiringSoon = expiringSoonBatches.length;
  const expiringProductNames = [...new Set(expiringSoonBatches.map(b => b.product?.name).filter(Boolean))];

  // 🚨 Expired Items (जो एक्सपायर हो चुके हैं - चाहे उनका स्टेटस कुछ भी हो)
  const expiredBatches = await Batch.find({ expiryDate: { $lt: now } }).populate('product', 'name');
  const expired = expiredBatches.length;
  const expiredProductNames = [...new Set(expiredBatches.map(b => b.product?.name).filter(Boolean))];

  // Low Stock
  const lowStockProducts = [];
  for (const p of allProducts) {
    // सिर्फ एक्टिव बैचों का स्टॉक गिनेंगे
    const batches = await Batch.find({ product: p._id, status: 'active' });
    const stock = batches.reduce((s, b) => s + b.quantity, 0);
    if (stock <= p.reorderLevel) lowStockProducts.push({ product: p, stock });
  }

  // Trend (चार्ट के लिए)
  const trend = [];
  for (let i = 0; i < 6; i++) {
    const start = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
    const monthBatches = await Batch.find({ expiryDate: { $gte: start, $lt: end } }).populate('product', 'name');
    const uniqueNames = [...new Set(monthBatches.map(b => b.product?.name).filter(Boolean))];
    trend.push({ 
      month: start.toLocaleString('default', { month: 'short' }), 
      count: monthBatches.length,
      products: uniqueNames
    });
  }

  const recentAlerts = await Alert.find().sort('-createdAt').limit(5).populate('product');
  res.json({
    stats: { 
      productCount, batchCount, expired, expiringSoon, lowStock: lowStockProducts.length,
      allProductNames, activeProductNames, expiringProductNames, expiredProductNames
    },
    trend, lowStockProducts, recentAlerts,
  });
};