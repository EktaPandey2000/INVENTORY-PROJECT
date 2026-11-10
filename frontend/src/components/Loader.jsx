import { motion } from 'framer-motion';
export default function Loader() {
  return (
    <div className="flex justify-center py-20">
      <motion.div className="w-10 h-10 rounded-full border-4 border-sage-200 border-t-sage-500"
        animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} />
    </div>
  );
}