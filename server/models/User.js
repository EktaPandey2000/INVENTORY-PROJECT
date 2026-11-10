import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
  
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Date },

  isVerified: { type: Boolean, default: false },
  registerOTP: { type: String },
  registerOTPExpires: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

export default mongoose.model('User', userSchema);