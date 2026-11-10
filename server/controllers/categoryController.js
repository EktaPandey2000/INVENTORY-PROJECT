import Category from '../models/Category.js';

export const getCategories = async (_, res) => res.json(await Category.find().sort('name'));

export const createCategory = async (req, res) => res.status(201).json(await Category.create(req.body));

export const updateCategory = async (req, res) => {
  const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!c) return res.status(404).json({ message: 'Not found' });
  res.json(c);
};

export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};