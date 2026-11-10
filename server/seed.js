import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

// मॉडल्स इम्पोर्ट करें
import User from './models/User.js';
import Category from './models/Category.js';
import Supplier from './models/Supplier.js';
import Product from './models/Product.js';
import Batch from './models/Batch.js';
import StockMovement from './models/StockMovement.js';
import ActivityLog from './models/ActivityLog.js';

const run = async () => {
  await connectDB();

  // 1. सिर्फ इन्वेंट्री का डेटा साफ करें (Users को डिलीट नहीं करेंगे!)
  console.log('🗑️  Clearing old inventory data (Preserving Users)...');
  await Promise.all([
    Category.deleteMany(), 
    Supplier.deleteMany(), 
    Product.deleteMany(), 
    Batch.deleteMany(),
    StockMovement.deleteMany(),
    ActivityLog.deleteMany()
  ]);

  // 2. एडमिन यूज़र चेक करें (अगर पहले से नहीं है, तभी बनाएं)
  let adminUser = await User.findOne({ email: 'admin@demo.com' });
  
  if (!adminUser) {
    console.log('👤 Creating Admin user...');
    adminUser = await User.create({ 
      name: 'Admin', 
      email: 'admin@demo.com', 
      password: 'admin123', 
      role: 'admin', 
      isVerified: true 
    });
  } else {
    console.log('👤 Admin user already exists. Skipping creation.');
  }

  // 3. नई कैटेगरी और सप्लायर बनाएं
  console.log('📦 Creating Categories and Suppliers...');
  const cats = await Category.insertMany([
    { name: 'Dairy', color: '#a8c3a0' }, 
    { name: 'Beverages', color: '#a9c2d4' },
    { name: 'Snacks', color: '#d4b8a8' }, 
    { name: 'Bakery', color: '#d4c3a8' },
  ]);
  
  const sup = await Supplier.create({ 
    name: 'Fresh Farms', 
    contactPerson: 'Ravi', 
    email: 'ravi@fresh.com', 
    phone: '9876543210' 
  });

  // 4. नए प्रोडक्ट्स बनाएं (मालिक: adminUser._id)
  console.log('🛒 Creating Products...');
  const products = await Product.insertMany([
    { 
      name: 'Milk 1L', sku: 'MILK-1L', category: cats[0]._id, supplier: sup._id, 
      price: 60, reorderLevel: 20, unit: 'ltr', createdBy: adminUser._id 
    },
    { 
      name: 'Orange Juice 1L', sku: 'OJ-1L', category: cats[1]._id, supplier: sup._id, 
      price: 120, reorderLevel: 10, createdBy: adminUser._id 
    },
    { 
      name: 'Potato Chips', sku: 'CHIPS', category: cats[2]._id, supplier: sup._id, 
      price: 30, reorderLevel: 15, createdBy: adminUser._id 
    },
    { 
      name: 'Wheat Bread', sku: 'BREAD', category: cats[3]._id, supplier: sup._id, 
      price: 40, reorderLevel: 12, createdBy: adminUser._id 
    },
  ]);

  // 5. बैचेस (Batches) बनाएं
  console.log('🏷️  Creating Batches...');
  const day = 86400000, now = Date.now();
  await Batch.insertMany([
    { product: products[0]._id, batchNumber: 'B1', quantity: 50, expiryDate: new Date(now + 5 * day) },
    { product: products[1]._id, batchNumber: 'B2', quantity: 30, expiryDate: new Date(now + 20 * day) },
    { product: products[2]._id, batchNumber: 'B3', quantity: 100, expiryDate: new Date(now + 90 * day) },
    { product: products[3]._id, batchNumber: 'B4', quantity: 5, expiryDate: new Date(now - 2 * day) },
    { product: products[0]._id, batchNumber: 'B5', quantity: 15, expiryDate: new Date(now + 60 * day) },
  ]);

  console.log('✅ Seed done successfully!');
  console.log('👤 Admin Login: admin@demo.com / admin123');
  console.log('ℹ️  Your registered users are safe!');
  
  await mongoose.disconnect();
};

run().catch(e => { 
  console.error('❌ Seed Error:', e); 
  process.exit(1); 
});