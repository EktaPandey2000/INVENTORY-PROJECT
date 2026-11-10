import { Router } from 'express';
import { 
  register, login, me, forgotPassword, verifyOTP, resetPassword, deleteAccount, verifyRegister, resendRegisterOTP
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.post('/register', register); 
r.post('/resend-otp', resendRegisterOTP);
r.post('/verify-register', verifyRegister); 
r.post('/login', login); 
r.get('/me', protect, me);
r.post('/forgot-password', forgotPassword);
r.post('/verify-otp', verifyOTP);
r.post('/reset-password', resetPassword);
r.delete('/delete-account', protect, deleteAccount);

export default r;