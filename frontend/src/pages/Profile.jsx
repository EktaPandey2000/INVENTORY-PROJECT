import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Modal from '../components/Modal';
import PasswordInput from '../components/PasswordInput';
import AlertBox from '../components/AlertBox';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!password) return setErrorMsg('Please enter your password to confirm.');
    setBusy(true);
    try {
      await api.delete('/auth/delete-account', { data: { password } });
      toast.success('Account deleted successfully.');
      logout(); nav('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2"><User size={20} /> My Profile</h2>
        <p className="text-sm text-sage-500">Manage your account details</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 text-white grid place-items-center text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{user?.name}</h3>
            <p className="text-sage-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <div className="space-y-4 border-t border-sage-100 dark:border-slate-700 pt-4">
          <div className="flex items-center gap-3"><Mail className="text-sage-400" size={18} /><div><p className="text-xs text-sage-500">Email Address</p><p className="font-medium">{user?.email}</p></div></div>
          <div className="flex items-center gap-3"><Shield className="text-sage-400" size={18} /><div><p className="text-xs text-sage-500">Account Role</p><p className="font-medium capitalize">{user?.role}</p></div></div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/10">
        <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-2"><AlertTriangle size={18} /> Danger Zone</h3>
        <p className="text-sm text-sage-600 dark:text-sage-300 mb-4">Once you delete your account, there is no going back.</p>
        <button onClick={() => setOpen(true)} className="btn bg-rose-600 text-white hover:bg-rose-700 shadow-sm"><Trash2 size={16} /> Delete Account</button>
      </motion.div>
      <Modal open={open} onClose={() => { setOpen(false); setPassword(''); setErrorMsg(''); }} title="Delete Account">
        <div className="mb-4 text-sm text-sage-600 dark:text-sage-300">Are you absolutely sure? This action <b>cannot</b> be undone.</div>
        <AlertBox type="error" message={errorMsg} />
        <form onSubmit={handleDelete} className="space-y-4">
          <div><label className="label">Confirm your password</label><PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button disabled={busy} className="btn bg-rose-600 text-white hover:bg-rose-700">{busy ? 'Deleting...' : 'Delete'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}