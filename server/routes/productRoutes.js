import { Router } from 'express';
import * as c from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const r = Router(); 
r.use(protect); 

r.route('/').get(c.getProducts).post(c.createProduct);
r.route('/:id').put(c.updateProduct).delete(c.deleteProduct);

export default r;