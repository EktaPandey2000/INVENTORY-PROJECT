import Supplier from '../models/Supplier.js';
export const getSuppliers = async (_, res) => res.json(await Supplier.find().sort('name'));
export const createSupplier = async (req, res) => res.status(201).json(await Supplier.create(req.body));
export const updateSupplier = async (req, res) => {
  const s = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json(s);
};
export const deleteSupplier = async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};