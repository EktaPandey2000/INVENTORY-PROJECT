import Batch from '../models/Batch.js';
import StockMovement from '../models/StockMovement.js';
import ActivityLog from '../models/ActivityLog.js';

export const handleStock = async (req, res) => {
  const { batchId, type, quantity, reason } = req.body;
  const batch = await Batch.findById(batchId).populate('product');

  if (!batch) return res.status(404).json({ message: 'Batch not found' });

  const qty = Number(quantity);
  if (qty <= 0) return res.status(400).json({ message: 'Quantity must be greater than 0' });

  if (type === 'out' && batch.quantity < qty) {
    return res.status(400).json({ message: 'Not enough stock in this batch' });
  }

  if (type === 'in') batch.quantity += qty;
  if (type === 'out') {
    batch.quantity -= qty;
    if (batch.quantity === 0) batch.status = 'depleted';
  }
  await batch.save();

  await StockMovement.create({
    product: batch.product._id,
    batch: batch._id,
    type, quantity: qty, reason,
    user: req.user._id
  });

  await ActivityLog.create({
    user: req.user._id,
    action: type === 'in' ? 'Stock In' : 'Stock Out',
    details: `${type === 'in' ? 'Added' : 'Removed'} ${qty} units of ${batch.product.name} (${reason})`
  });

  res.json({ message: `Stock ${type === 'in' ? 'added' : 'removed'} successfully`, batch });
};

export const getMovements = async (req, res) => {
  const movements = await StockMovement.find().populate('product batch user').sort('-createdAt');
  res.json(movements);
};