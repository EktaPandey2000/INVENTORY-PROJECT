import Batch from '../models/Batch.js';
export const getBatches = async (req, res) => {
  const q = req.query.product ? { product: req.query.product } : {};
  res.json(await Batch.find(q).populate('product').sort('expiryDate'));
};
export const createBatch = async (req, res) => res.status(201).json(await Batch.create(req.body));
export const updateBatch = async (req, res) => {
  const b = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!b) return res.status(404).json({ message: 'Not found' });
  res.json(b);
};
export const deleteBatch = async (req, res) => {
  await Batch.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};