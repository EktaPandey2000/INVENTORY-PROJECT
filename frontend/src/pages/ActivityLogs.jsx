import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/activity').then(r => setLogs(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><Activity size={24} className="text-teal-600" /> Activity Logs</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Track who did what and when</p>
      </div>

      {loading ? <Loader /> : (
        <div className="card !p-0 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log, i) => (
              <motion.div key={log._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 grid place-items-center shrink-0">
                  <Activity size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {log.user?.name} <span className="font-normal text-slate-500 text-xs ml-2">({log.user?.role})</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{log.details}</p>
                </div>
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                  <Clock size={12} /> {new Date(log.createdAt).toLocaleString()}
                </div>
              </motion.div>
            ))}
            {logs.length === 0 && <div className="p-10 text-center text-slate-500">No activity yet.</div>}
          </div>
        </div>
      )}
    </div>
  );
}