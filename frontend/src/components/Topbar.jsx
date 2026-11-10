import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Topbar({ toggleMenu }) {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      
      <div className="flex items-center gap-4">
        {/* मोबाइल हैमबर्गर बटन */}
        <button onClick={toggleMenu} className="md:hidden p-2 text-slate-600 dark:text-slate-300">
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight">Hello, {user?.name?.split(' ')[0] || 'User'} 👋</h2>
          <p className="hidden sm:block text-sm text-slate-500">Welcome to your dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Link to="/alerts" className="relative w-10 h-10 rounded-full grid place-items-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-colors">
          <Bell size={18} className="text-slate-600 dark:text-slate-300" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-800"></span>
        </Link>
        <button onClick={toggle} className="w-10 h-10 rounded-full grid place-items-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-colors">
          {dark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-600" />}
        </button>
      </div>
    </motion.header>
  );
}