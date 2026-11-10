import { motion } from 'framer-motion';
export default function StatCard({ icon: Icon, label, value, tone = 'sage', delay = 0 }) {
  const tones = {
    sage: 'from-sage-400 to-sage-600',
    sand: 'from-sand-300 to-sand-500',
    rose: 'from-rose-400 to-rose-600',
    amber: 'from-amber-400 to-amber-600',
    sky: 'from-sky-400 to-sky-600',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }} whileHover={{ y: -3 }} className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tones[tone]} text-white grid place-items-center shadow-lg`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-xs text-sage-500 dark:text-sage-300 font-medium">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </motion.div>
  );
}