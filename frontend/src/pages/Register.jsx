import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, User, KeyRound, RefreshCw, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PasswordInput from '../components/PasswordInput';
import AlertBox from '../components/AlertBox';

export default function Register() {
  const { register, verifyRegister } = useAuth();
  const nav = useNavigate();
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const passChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password), 
  };

  const isPasswordValid = Object.values(passChecks).every(Boolean);
  const doPasswordsMatch = form.password === form.confirmPassword && form.password !== '';

  const submitDetails = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg(''); setIsAlreadyRegistered(false);

    if (!isPasswordValid) return setErrorMsg('Please ensure your password meets all requirements.');
    if (!doPasswordsMatch) return setErrorMsg('Passwords do not match!');

    setBusy(true);
    try { 
      await register({ name: form.name, email: form.email, password: form.password }); 
      setSuccessMsg('OTP sent to your email! Please check your Gmail inbox.');
      setStep(2); 
    } catch (err) { 
      const msg = err.response?.data?.message || 'Registration failed';
      setErrorMsg(msg);
      if (msg.includes('already registered')) setIsAlreadyRegistered(true);
    } finally { 
      setBusy(false); 
    }
  };

  const submitOTP = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    setBusy(true);
    try {
      await verifyRegister(form.email, otp.trim());
      nav('/dashboard'); 
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setBusy(false);
    }
  };

  const handleResendOTP = async () => {
    setBusy(true); setErrorMsg(''); setSuccessMsg('');
    try {
      await api.post('/auth/resend-otp', { email: form.email });
      setSuccessMsg('New OTP sent! Please check your Gmail inbox.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-slate-50 dark:bg-slate-950">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md !p-8 shadow-xl border-slate-200 dark:border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-teal-500 text-white grid place-items-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
          {step === 1 ? <Leaf size={26} /> : <KeyRound size={26} />}
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-1 text-slate-800 dark:text-white">
          {step === 1 ? 'Create account' : 'Verify Email'}
        </h1>
        <p className="text-center text-slate-500 mb-6 text-sm">
          {step === 1 ? 'Start tracking with FreshTrack' : `Enter the OTP sent to ${form.email}`}
        </p>
        
        <AlertBox type="error" message={errorMsg}>
          {isAlreadyRegistered && <Link to="/login" className="font-bold underline mt-1 block">Click here to Login</Link>}
        </AlertBox>
        <AlertBox type="success" message={successMsg} />

        {step === 1 ? (
          <form onSubmit={submitDetails} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required className="input !pl-11" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="email" className="input !pl-11" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <PasswordInput value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              
              {/* 🚨 नया कॉम्पैक्ट ग्रिड */}
              {form.password.length > 0 && (
                <div className="mt-2 text-[11px] grid grid-cols-2 gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <div className={`flex items-center gap-1 font-medium ${passChecks.length ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {passChecks.length ? <Check size={12}/> : <X size={12}/>} 8+ Characters
                  </div>
                  <div className={`flex items-center gap-1 font-medium ${passChecks.upper ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {passChecks.upper ? <Check size={12}/> : <X size={12}/>} Uppercase (A-Z)
                  </div>
                  <div className={`flex items-center gap-1 font-medium ${passChecks.lower ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {passChecks.lower ? <Check size={12}/> : <X size={12}/>} Lowercase (a-z)
                  </div>
                  <div className={`flex items-center gap-1 font-medium ${passChecks.number ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {passChecks.number ? <Check size={12}/> : <X size={12}/>} Number (0-9)
                  </div>
                  <div className={`flex items-center gap-1 font-medium ${passChecks.special ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {passChecks.special ? <Check size={12}/> : <X size={12}/>} Special (@, #, $)
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <PasswordInput value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
              {form.confirmPassword.length > 0 && !doPasswordsMatch && (
                <p className="text-[11px] font-medium text-rose-500 mt-1 flex items-center gap-1"><X size={12}/> Passwords do not match</p>
              )}
            </div>
            
            <button disabled={busy || !isPasswordValid || !doPasswordsMatch} className="btn-primary w-full justify-center py-3">
              {busy ? 'Creating...' : 'Create account'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitOTP} className="space-y-4">
            <div>
              <label className="label">6-Digit OTP</label>
              <input required type="text" maxLength="6" className="input text-center tracking-[1em] text-lg font-bold" value={otp} onChange={e => setOtp(e.target.value)} />
            </div>
            <button disabled={busy} className="btn-primary w-full justify-center py-3">{busy ? 'Verifying...' : 'Verify & Create Account'}</button>
            
            <button type="button" onClick={handleResendOTP} disabled={busy} className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center justify-center gap-2 mt-4">
              <RefreshCw size={14} /> Didn't receive OTP? Resend
            </button>
          </form>
        )}
        <p className="text-center text-sm text-slate-500 mt-6 font-medium">
          Have account? <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
