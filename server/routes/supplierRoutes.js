import { Router } from 'express';
import * as c from '../controllers/supplierController.js';
import { protect } from '../middleware/auth.js';
const r = Router(); r.use(protect);
r.route('/').get(c.getSuppliers).post(c.createSupplier);
r.route('/:id').put(c.updateSupplier).delete(c.deleteSupplier);
export default r;