import cron from 'node-cron';
import Batch from '../models/Batch.js';
import Alert from '../models/Alert.js';

export const runExpiryCheck = async () => {
  const now = new Date();
  const in30 = new Date(); in30.setDate(in30.getDate() + 30);

  const expired = await Batch.find({ expiryDate: { $lt: now }, status: 'active' }).populate('product');
  for (const b of expired) {
    b.status = 'expired'; await b.save();
    await Alert.create({
      type: 'expired', severity: 'danger',
      message: `Batch ${b.batchNumber} of ${b.product?.name || 'product'} expired on ${b.expiryDate.toDateString()}`,
      product: b.product?._id, batch: b._id,
    });
  }

  const soon = await Batch.find({ expiryDate: { $gte: now, $lte: in30 }, status: 'active' }).populate('product');
  for (const b of soon) {
    const exists = await Alert.findOne({
      batch: b._id, type: 'expiring',
      createdAt: { $gte: new Date(Date.now() - 24 * 3600 * 1000) },
    });
    if (!exists) {
      await Alert.create({
        type: 'expiring', severity: 'warning',
        message: `Batch ${b.batchNumber} of ${b.product?.name || 'product'} expires on ${b.expiryDate.toDateString()}`,
        product: b.product?._id, batch: b._id,
      });
    }
  }
};

export const startExpiryJob = () => {
  cron.schedule('0 8 * * *', () => runExpiryCheck().catch(console.error));
  setTimeout(() => runExpiryCheck().catch(console.error), 4000);
};