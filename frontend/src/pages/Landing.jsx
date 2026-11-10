import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ShieldCheck, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sand-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sage-500 text-white grid place-items-center shadow-md">
            <Leaf size={18} />
          </div>
          <span className="font-bold text-xl">FreshTrack</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={() => nav('/dashboard')} className="btn-primary">Go to Dashboard</button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block py-1 px-3 rounded-full bg-sage-100 text-sage-700 dark:bg-sage-800 dark:text-sage-200 text-sm font-medium mb-6">
            ✨ Smart Inventory Management
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Track Inventory & <span className="text-sage-500">Expiry Dates</span> Effortlessly
          </h1>
          <p className="text-lg text-sage-600 dark:text-sage-300 max-w-2xl mx-auto mb-10">
            Never let your products expire again. FreshTrack helps you manage stock, track batches, and get alerts before items go out of date.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
        >
          <div className="card text-left">
            <div className="w-12 h-12 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-300 grid place-items-center mb-4">
              <Clock size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Expiry Alerts</h3>
            <p className="text-sage-500 text-sm">Get automatic warnings 30 days before your products expire so you can take action.</p>
          </div>
          <div className="card text-left">
            <div className="w-12 h-12 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-300 grid place-items-center mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Batch Tracking</h3>
            <p className="text-sage-500 text-sm">Track products by manufacturing date, batch number, and quantity in real-time.</p>
          </div>
          <div className="card text-left">
            <div className="w-12 h-12 rounded-xl bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-300 grid place-items-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Account</h3>
            <p className="text-sage-500 text-sm">Your data is safe with OTP verification, account locking, and secure passwords.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}