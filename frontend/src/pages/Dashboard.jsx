import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Package, Boxes, AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 min-w-[160px]">
        <p className="font-bold text-slate-800 dark:text-white mb-1">{label}</p>
        <p className="text-teal-600 dark:text-teal-400 font-semibold text-sm mb-2">
          {data.count} Batches Expiring
        </p>
        {data.products && data.products.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-700 pt-2 mt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Products:</p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              {data.products.map((prodName, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                  {prodName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setData(r.data)).catch(console.error);
  }, []);

  if (!data) return <Loader />;
  const { stats, trend, lowStockProducts } = data;

  const statCards = [
    { 
      title: "Total Products", 
      value: stats.productCount, 
      icon: Package, 
      bg: "bg-blue-50 dark:bg-blue-900/20", 
      text: "text-blue-600 dark:text-blue-400",
      productList: stats.allProductNames,
      hoverText: "All products in inventory"
    },
    { 
      title: "Active Batches", 
      value: stats.batchCount, 
      icon: Boxes, 
      bg: "bg-teal-50 dark:bg-teal-900/20", 
      text: "text-teal-600 dark:text-teal-400",
      productList: stats.activeProductNames,
      hoverText: "Products with active stock"
    },
    { 
      title: "Expiring Soon", 
      value: stats.expiringSoon, 
      icon: Clock, 
      bg: "bg-amber-50 dark:bg-amber-900/20", 
      text: "text-amber-600 dark:text-amber-400",
      productList: stats.expiringProductNames,
      hoverText: "Batches expiring within 30 days"
    },
    { 
      title: "Expired Items", 
      value: stats.expired, 
      icon: AlertTriangle, 
      bg: "bg-rose-50 dark:bg-rose-900/20", 
      text: "text-rose-600 dark:text-rose-400",
      productList: stats.expiredProductNames,
      hoverText: "Products that are already expired"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="card !p-6 flex flex-col justify-between relative group cursor-help shadow-sm hover:shadow-xl transition-all duration-300 hover:z-50"
          >
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 min-w-[200px] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 scale-95 group-hover:scale-100 origin-top">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-t border-l border-slate-100 dark:border-slate-700 rotate-45"></div>
              <p className="font-bold text-slate-800 dark:text-white mb-1 text-sm">{card.title}</p>
              <p className="text-slate-500 text-xs mb-2">{card.hoverText}</p>
              
              {card.productList && card.productList.length > 0 ? (
                <div className="border-t border-slate-100 dark:border-slate-700 pt-2 mt-1 max-h-24 overflow-y-auto custom-scrollbar">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Products:</p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    {card.productList.map((prodName, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                        {prodName}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="border-t border-slate-100 dark:border-slate-700 pt-2 mt-1">
                  <p className="text-xs text-slate-400 italic">No products found</p>
                </div>
              )}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.text} grid place-items-center transition-transform group-hover:scale-110`}>
                <card.icon size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Expiry Trend</h3>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">Next 6 Months</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40} className="hover:opacity-80 transition-opacity cursor-pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingDown className="text-rose-500" size={20} /> Low Stock Alert
          </h3>
          
          {lowStockProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 grid place-items-center mb-3">
                <Package size={24} />
              </div>
              <p className="text-sm font-medium">All stock levels are healthy</p>
            </div>
          ) : (
            <ul className="space-y-3 flex-1 overflow-auto pr-2">
              {lowStockProducts.map(({ product, stock }) => (
                <motion.li key={product._id} whileHover={{ scale: 1.02, backgroundColor: 'rgba(244, 63, 94, 0.05)' }} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 cursor-pointer transition-colors group">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate group-hover:text-rose-600 transition-colors">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.sku}</p>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    {stock} left
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}