import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, CheckCircle, Check, X } from 'lucide-react';
import api from '../api/axios';
import PasswordInput from '../components/PasswordInput';
import AlertBox from '../components/AlertBox';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const passChecks = {
    length: passwords.newPassword.length >= 8,
    upper: /[A-Z]/.test(passwords.newPassword),
    lower: /[a-z]/.test(passwords.newPassword),
    number: /[0-9]/.test(passwords.newPassword),
    special: /[^A-Za-z0-9]/.test(passwords.newPassword),
  };
  const isPasswordValid = Object.values(passChecks).every(Boolean);
  const doPasswordsMatch = passwords.newPassword === passwords.confirmPassword && passwords.newPassword !== '';

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setBusy(true); setErrorMsg(''); setSuccessMsg('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccessMsg('OTP sent to your email! Please check your Gmail.');
      setStep(2);
    } catch (err) { setErrorMsg(err.response?.data?.message || 'Error sending OTP'); } 
    finally { setBusy(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setBusy(true); setErrorMsg('');
    try {
      await api.post('/auth/verify-otp', { email, otp: otp.trim() });
      setStep(3);
    } catch (err) { setErrorMsg(err.response?.data?.message || 'Invalid OTP'); } 
    finally { setBusy(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!isPasswordValid) return setErrorMsg('Please ensure your password meets all requirements.');
    if (!doPasswordsMatch) return setErrorMsg('Passwords do not match!');
    
    setBusy(true);
    try {
      await api.post('/auth/reset-password', { email, otp: otp.trim(), newPassword: passwords.newPassword });
      toast.success('Password reset successfully!');
      nav('/login');
    } catch (err) { setErrorMsg(err.response?.data?.message || 'Error resetting password'); } 
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-sage-100 via-white to-sand-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md !p-8">
        <div className="w-14 h-14 rounded-2xl bg-sage-500 text-white grid place-items-center mx-auto mb-4 shadow-lg shadow-sage-500/30">
          {step === 1 ? <Mail size={26} /> : step === 2 ? <KeyRound size={26} /> : <CheckCircle size={26} />}
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-1">
          {step === 1 ? 'Forgot Password' : step === 2 ? 'Enter OTP' : 'Reset Password'}
        </h1>
        
        <AlertBox type="error" message={errorMsg} />
        <AlertBox type="success" message={successMsg} />

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input required type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button disabled={busy} className="btn-primary w-full justify-center">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="label">6-Digit OTP</label>
              <input required type="text" maxLength="6" className="input text-center tracking-[1em] text-lg font-bold" value={otp} onChange={e => setOtp(e.target.value)} />
            </div>
            <button disabled={busy} className="btn-primary w-full justify-center">Verify OTP</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="label">New Password</label>
              <PasswordInput value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} />
              
              {passwords.newPassword.length > 0 && (
                <div className="mt-2 text-xs space-y-1 bg-sage-50 dark:bg-slate-800/50 p-2 rounded-lg">
                  <div className={`flex items-center gap-1 ${passChecks.length ? 'text-green-600' : 'text-rose-500'}`}>
                    {passChecks.length ? <Check size={12}/> : <X size={12}/>} 8+ अक्षर
                  </div>
                  <div className={`flex items-center gap-1 ${passChecks.upper ? 'text-green-600' : 'text-rose-500'}`}>
                    {passChecks.upper ? <Check size={12}/> : <X size={12}/>} 1 बड़ा अक्षर (A-Z)
                  </div>
                  <div className={`flex items-center gap-1 ${passChecks.lower ? 'text-green-600' : 'text-rose-500'}`}>
                    {passChecks.lower ? <Check size={12}/> : <X size={12}/>} 1 छोटा अक्षर (a-z)
                  </div>
                  <div className={`flex items-center gap-1 ${passChecks.number ? 'text-green-600' : 'text-rose-500'}`}>
                    {passChecks.number ? <Check size={12}/> : <X size={12}/>} 1 नंबर (0-9)
                  </div>
                  <div className={`flex items-center gap-1 ${passChecks.special ? 'text-green-600' : 'text-rose-500'}`}>
                    {passChecks.special ? <Check size={12}/> : <X size={12}/>} 1 स्पेशल कैरेक्टर
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <PasswordInput value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
              {passwords.confirmPassword.length > 0 && !doPasswordsMatch && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><X size={12}/> पासवर्ड मैच नहीं हो रहे हैं</p>
              )}
            </div>
            <button disabled={busy || !isPasswordValid || !doPasswordsMatch} className="btn-primary w-full justify-center">
              {busy ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-sage-500 mt-5">
          Remember it? <Link to="/login" className="text-sage-700 font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}