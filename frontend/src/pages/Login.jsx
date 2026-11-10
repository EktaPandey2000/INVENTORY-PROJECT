import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { 
      await login(form.email, form.password); 
      toast.success('Welcome back!'); 
      nav('/dashboard'); 
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Login failed'); 
    } finally { 
      setBusy(false); 
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      
      {/* Left Side (Branding) - Hidden on Mobile */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-500 to-emerald-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md grid place-items-center shadow-lg">
            <Leaf size={24} />
          </div>
          <span className="font-bold text-3xl tracking-tight">FreshTrack</span>
        </div>

        <div className="relative z-10 text-white">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">Manage your inventory <br /> like a pro.</h1>
          <p className="text-teal-100 text-lg">Track stock, monitor expiry dates, and get real-time alerts to never lose a product again.</p>
        </div>
        
        <div className="relative z-10 text-teal-200 text-sm">© 2024 FreshTrack. All rights reserved.</div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
          </div>
          
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="email" className="input !pl-12" placeholder="name@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label !mb-0">Password</label>
                <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-bold">Forgot Password?</Link>
              </div>
              <PasswordInput value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </div>
            
            <motion.button whileTap={{ scale: 0.98 }} disabled={busy} className="btn-primary w-full py-4 text-base mt-2">
              {busy ? 'Signing in...' : 'Sign in to account'}
            </motion.button>
          </form>
          
          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Don't have an account? <Link to="/register" className="text-teal-600 font-bold hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}