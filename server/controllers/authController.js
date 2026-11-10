import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail } from '../utils/mailer.js';

// 1. रजिस्टर (OTP जनरेट और ईमेल भेजना)
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  await User.create({ 
    name, email, password, role, 
    isVerified: false,
    registerOTP: otp,
    registerOTPExpires: Date.now() + 10 * 60 * 1000 
  });
  
  const message = `Hello ${name},\n\nYour FreshTrack account verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.`;
  
  try {
    await sendEmail(email, 'FreshTrack - Verify Your Account', message);
    res.status(201).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: 'Failed to send OTP. Check email settings.' });
  }
};

// 2. रजिस्टर OTP दोबारा भेजना (Resend)
export const resendRegisterOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.registerOTP = otp;
  user.registerOTPExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const message = `Your NEW FreshTrack verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.`;
  
  try {
    await sendEmail(email, 'FreshTrack - New Verification OTP', message);
    res.json({ message: 'New OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
};

// 3. OTP वेरिफाई करना (अकाउंट चालू करना)
export const verifyRegister = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.registerOTP !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
  if (user.registerOTPExpires < Date.now()) return res.status(400).json({ message: 'OTP expired.' });

  user.isVerified = true;
  user.registerOTP = undefined;
  user.registerOTPExpires = undefined;
  await user.save();

  res.status(200).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
};

// 4. लॉगिन (Progressive Lockout के साथ)
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first.' });

  // चेक करें कि अकाउंट अभी लॉक है या नहीं
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const secondsLeft = Math.ceil((user.lockUntil - Date.now()) / 1000);
    const minutes = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const timeStr = minutes > 0 ? `${minutes} min ${secs} sec` : `${secs} sec`;
    
    return res.status(403).json({ message: `Account locked. Try again in ${timeStr}.` });
  }

  // पासवर्ड चेक करें
  if (!(await user.matchPassword(password))) {
    user.loginAttempts += 1;

    // 🚨 गलत अटेम्प्ट्स के हिसाब से लॉक का समय तय करें
    let lockTime = 0;
    if (user.loginAttempts === 3) {
      lockTime = 30 * 1000; // 30 सेकंड
    } else if (user.loginAttempts === 4) {
      lockTime = 60 * 1000; // 1 मिनट
    } else if (user.loginAttempts === 5) {
      lockTime = 180 * 1000; // 3 मिनट
    } else if (user.loginAttempts >= 6) {
      lockTime = 300 * 1000; // 5 मिनट (मैक्सिमम)
    }

    // अगर लॉक टाइम सेट हुआ है, तो अकाउंट लॉक करें
    if (lockTime > 0) {
      user.lockUntil = Date.now() + lockTime;
      await user.save();
      
      const mins = Math.floor(lockTime / 60000);
      const secs = (lockTime % 60000) / 1000;
      const timeMsg = mins > 0 ? `${mins} minute(s)` : `${secs} seconds`;
      
      return res.status(403).json({ message: `Too many failed attempts. Account locked for ${timeMsg}.` });
    }

    // अगर 1 या 2 अटेम्प्ट है, तो सिर्फ चेतावनी दें
    await user.save();
    return res.status(401).json({ message: `Invalid credentials. ${3 - user.loginAttempts} attempts left before temporary lock.` });
  }

  // सही पासवर्ड: काउंटर रीसेट करें
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
  
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
};

// 5. Forgot Password (पासवर्ड भूलने पर OTP)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordOTP = otp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const message = `Your FreshTrack password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.`;
  
  try {
    await sendEmail(email, 'FreshTrack - Password Reset OTP', message);
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email.' });
  }
};

// 6. Verify OTP (Forgot Password के लिए)
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found.' });
  if (user.resetPasswordOTP !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
  if (user.resetPasswordExpires < Date.now()) return res.status(400).json({ message: 'OTP has expired.' });
  res.json({ message: 'OTP verified successfully.' });
};

// 7. Reset Password (नया पासवर्ड सेट करना)
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found.' });
  if (user.resetPasswordOTP !== otp || user.resetPasswordExpires < Date.now()) return res.status(400).json({ message: 'Invalid or expired OTP.' });
  
  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
  res.json({ message: 'Password reset successfully.' });
};

// 8. अकाउंट डिलीट करना
export const deleteAccount = async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!(await user.matchPassword(password))) return res.status(401).json({ message: 'Incorrect password.' });

  await User.findByIdAndDelete(req.user._id);
  res.json({ message: 'Account deleted successfully.' });
};

// 9. Profile अपडेट करना (नाम या पासवर्ड)
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.password) {
      if (req.body.password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// 10. Current User
export const me = (req, res) => res.json(req.user);