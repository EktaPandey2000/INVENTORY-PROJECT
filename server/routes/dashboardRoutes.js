import { Router } from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';
const r = Router(); r.get('/stats', protect, getStats);
export default r;