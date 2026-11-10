import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, AlertTriangle, Clock } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setAlerts((await api.get('/alerts')).data); }
    catch { toast.error('Failed to load alerts'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const markOne = async (id) => {
    try {
      await api.put(`/alerts/${id}/read`);
      setAlerts(a => a.map(x => x._id === id ? { ...x, isRead: true } : x));
    } catch { toast.error('Failed'); }
  };

  const markAll = async () => {
    try {
      await api.put('/alerts/read-all');
      setAlerts(a => a.map(x => ({ ...x, isRead: true })));
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const unread = alerts.filter(a => !a.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell size={20} /> Alerts
            {unread > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white">{unread} new</span>
            )}
          </h2>
          <p className="text-sm text-sage-500">Expiry warnings & low-stock notifications</p>
        </div>
        <button onClick={markAll} className="btn-ghost"><CheckCheck size={16} /> Mark all read</button>
      </div>

      {loading ? <Loader /> : (
        <motion.div layout className="space-y-2">
          <AnimatePresence>
            {alerts.map((a, i) => (
              <motion.div key={a._id} layout
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`card flex items-start gap-3 !p-4 ${
                  a.isRead ? 'opacity-70' : ''
                }`}>
                <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${
                  a.severity === 'danger' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300' :
                  a.severity === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300' :
                  'bg-sage-100 text-sage-600 dark:bg-sage-800 dark:text-sage-200'
                }`}>
                  {a.type === 'expiring' ? <Clock size={18} /> : <AlertTriangle size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{a.message}</div>
                  <div className="text-xs text-sage-500 mt-1">
                    {new Date(a.createdAt).toLocaleString()}
                    {a.product?.name && <span> · {a.product.name}</span>}
                  </div>
                </div>
                {!a.isRead && (
                  <button onClick={() => markOne(a._id)} className="btn-ghost !p-2 !text-xs">
                    Mark read
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {alerts.length === 0 && (
            <div className="card text-center text-sage-500 py-12">
              🎉 All clear — no alerts right now
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}