import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Truck, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const empty = { name: '', contactPerson: '', email: '', phone: '', address: '' };

export default function Suppliers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try { setItems((await api.get('/suppliers')).data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditing(null); setOpen(true); };
  const openEdit = (s) => { setForm({ ...empty, ...s }); setEditing(s); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/suppliers/${editing._id}`, form);
      else await api.post('/suppliers', form);
      toast.success(editing ? 'Updated' : 'Created');
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this supplier?')) return;
    try { await api.delete(`/suppliers/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2"><Truck size={20} /> Suppliers</h2>
          <p className="text-sm text-sage-500">Vendors who supply your stock</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Supplier</button>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((s, i) => (
              <motion.div key={s._id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }}
                className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">{s.name}</h3>
                    <p className="text-xs text-sage-500">{s.contactPerson || '—'}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="btn-ghost !p-2"><Pencil size={14} /></button>
                    <button onClick={() => remove(s._id)} className="btn-ghost !p-2 !text-rose-600"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  {s.email && <div className="text-sage-600 dark:text-sage-300">✉ {s.email}</div>}
                  {s.phone && <div className="text-sage-600 dark:text-sage-300">📞 {s.phone}</div>}
                  {s.address && <div className="text-sage-500 text-xs mt-2">📍 {s.address}</div>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="card col-span-full text-center text-sage-500">No suppliers yet</div>
          )}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Supplier' : 'New Supplier'}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label">Name</label>
            <input required className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Contact Person</label>
            <input className="input" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div><label className="label">Address</label>
            <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}