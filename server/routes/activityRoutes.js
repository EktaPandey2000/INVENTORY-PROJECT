import { Router } from 'express';
import { getLogs } from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.use(protect);
r.get('/', getLogs);

export default r;