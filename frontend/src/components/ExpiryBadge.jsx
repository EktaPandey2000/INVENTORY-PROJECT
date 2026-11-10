export default function ExpiryBadge({ date, status }) {
  if (status === 'expired')
    return <span className="px-2 py-1 rounded-lg text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Expired</span>;
  const days = Math.ceil((new Date(date) - new Date()) / 86400000);
  if (days <= 0)
    return <span className="px-2 py-1 rounded-lg text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Expired</span>;
  if (days <= 30)
    return <span className="px-2 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{days}d left</span>;
  return <span className="px-2 py-1 rounded-lg text-xs font-medium bg-sage-100 text-sage-700 dark:bg-sage-800 dark:text-sage-200">{days}d left</span>;
}