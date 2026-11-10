import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Boxes } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import ExpiryBadge from '../components/ExpiryBadge';
import toast from 'react-hot-toast';

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [open, setOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [form, setForm] = useState({ type: 'in', quantity: 0, reason: '' });

  const load = async () => {
    setLoading(true);
    try { setBatches((await api.get('/batches')).data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleStock = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stock/movement', {
        batchId: selectedBatch._id,
        type: form.type,
        quantity: form.quantity,
        reason: form.reason
      });
      toast.success(`Stock ${form.type === 'in' ? 'added' : 'removed'} successfully!`);
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const openStockModal = (batch, type) => {
    setSelectedBatch(batch);
    setForm({ type, quantity: 1, reason: type === 'in' ? 'New Stock Received' : 'Sold to Customer' });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Boxes size={24} className="text-teal-600" /> Batches & Stock</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage inventory and track stock movements</p>
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4 font-bold">Product</th>
                  <th className="p-4 font-bold">Batch #</th>
                  <th className="p-4 font-bold text-center">Current Stock</th>
                  <th className="p-4 font-bold">Expiry Status</th>
                  <th className="p-4 font-bold text-right">Stock Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {batches.map((b, i) => (
                    <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-bold">{b.product?.name || '—'}</td>
                      <td className="p-4 text-slate-500 font-medium">{b.batchNumber}</td>
                      <td className="p-4 text-center font-extrabold text-lg">{b.quantity}</td>
                      <td className="p-4"><ExpiryBadge date={b.expiryDate} status={b.status} /></td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openStockModal(b, 'in')} className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors" title="Stock In">
                          <Plus size={16} />
                        </button>
                        <button onClick={() => openStockModal(b, 'out')} className="p-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg transition-colors" title="Stock Out">
                          <Minus size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.type === 'in' ? 'Add Stock (Stock In)' : 'Remove Stock (Stock Out)'}>
        <form onSubmit={handleStock} className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl mb-4">
            <p className="text-sm font-bold">{selectedBatch?.product?.name}</p>
            <p className="text-xs text-slate-500">Batch: {selectedBatch?.batchNumber} | Available: {selectedBatch?.quantity}</p>
          </div>
          
          <div>
            <label className="label">Quantity</label>
            <input type="number" min="1" required className="input" value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} />
          </div>
          <div>
            <label className="label">Reason</label>
            <input required className="input" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Sold to customer, New delivery" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button className={`btn ${form.type === 'in' ? 'bg-emerald-600' : 'bg-rose-600'} text-white hover:opacity-90`}>
              Confirm {form.type === 'in' ? 'Addition' : 'Removal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}