import { Router } from 'express';
import * as c from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
const r = Router(); r.use(protect);
r.route('/').get(c.getCategories).post(c.createCategory);
r.route('/:id').put(c.updateCategory).delete(c.deleteCategory);
export default r;