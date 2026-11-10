import { Router } from 'express';
import { handleStock, getMovements } from '../controllers/stockController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.use(protect);
r.post('/movement', handleStock);
r.get('/movements', getMovements);

export default r;