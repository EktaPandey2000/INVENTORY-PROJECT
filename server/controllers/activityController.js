import ActivityLog from '../models/ActivityLog.js';

export const getLogs = async (req, res) => {
  const logs = await ActivityLog.find().populate('user', 'name email role').sort('-createdAt').limit(100);
  res.json(logs);
};