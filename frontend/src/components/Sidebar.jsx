import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, Boxes, Truck, Tags, BellRing, Leaf, User, LogOut, Activity, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const nav = useNavigate();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/batches', label: 'Batches & Stock', icon: Boxes },
    ...(isAdmin ? [
      { to: '/suppliers', label: 'Suppliers', icon: Truck },
      { to: '/categories', label: 'Categories', icon: Tags },
    ] : []),
    { to: '/alerts', label: 'Alerts', icon: BellRing },
    { to: '/activity', label: 'Activity Logs', icon: Activity },
  ];

  const SidebarContent = (
    <>
      <div className="flex items-center justify-between px-4 py-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 text-white grid place-items-center shadow-lg shadow-teal-500/30">
            <Leaf size={20} />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">FreshTrack</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400 mt-0.5">{user?.role} Panel</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-2 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'} onClick={() => setIsOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
              isActive 
              ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
            }`}>
            <Icon size={20} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 pb-4 border-t border-slate-100 dark:border-slate-800 pt-4">
        <NavLink to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 text-white grid place-items-center font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-slate-800 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </NavLink>
        <button onClick={() => { logout(); nav('/login'); }} className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-[270px] h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20">
        {SidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-900 z-50 flex flex-col md:hidden shadow-2xl">
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}