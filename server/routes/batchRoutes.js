import { Router } from 'express';
import * as c from '../controllers/batchController.js';
import { protect } from '../middleware/auth.js';
const r = Router(); r.use(protect);
r.route('/').get(c.getBatches).post(c.createBatch);
r.route('/:id').put(c.updateBatch).delete(c.deleteBatch);
export default r;