import { AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlertBox({ type = 'error', message, children }) {
  if (!message) return null;
  const isError = type === 'error';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-xl flex items-start gap-2 text-sm mb-4 ${
        isError 
          ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300' 
          : 'bg-sage-50 text-sage-700 border border-sage-200 dark:bg-sage-900/30 dark:border-sage-800 dark:text-sage-300'
      }`}
    >
      {isError ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <CheckCircle size={18} className="shrink-0 mt-0.5" />}
      <div>
        <p>{message}</p>
        {children} {/* अगर Login का लिंक देना हो तो */}
      </div>
    </motion.div>
  );
}
