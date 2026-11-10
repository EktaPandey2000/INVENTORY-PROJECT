import Alert from '../models/Alert.js';
export const getAlerts = async (_, res) =>
  res.json(await Alert.find().sort('-createdAt').limit(100).populate('product'));
export const markRead = async (req, res) =>
  res.json(await Alert.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true }));
export const markAllRead = async (_, res) => {
  await Alert.updateMany({ isRead: false }, { isRead: true });
  res.json({ message: 'All read' });
};