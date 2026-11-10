import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tags, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const empty = { name: '', description: '', color: '#7c9d96' };

export default function Categories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try { setItems((await api.get('/categories')).data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditing(null); setOpen(true); };
  const openEdit = (c) => { setForm({ ...empty, ...c }); setEditing(c); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/categories/${editing._id}`, form);
      else await api.post('/categories', form);
      toast.success(editing ? 'Updated' : 'Created');
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2"><Tags size={20} /> Categories</h2>
          <p className="text-sm text-sage-500">Organize products into logical groups</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Category</button>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((c, i) => (
              <motion.div key={c._id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }}
                className="card flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl shrink-0"
                  style={{ background: c.color || '#7c9d96' }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{c.name}</h3>
                  <p className="text-xs text-sage-500 truncate">{c.description || '—'}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="btn-ghost !p-2"><Pencil size={14} /></button>
                  <button onClick={() => remove(c._id)} className="btn-ghost !p-2 !text-rose-600"><Trash2 size={14} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="card col-span-full text-center text-sage-500">No categories yet</div>
          )}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label">Name</label>
            <input required className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Description</label>
            <input className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className="label">Color</label>
            <div className="flex items-center gap-2">
              <input type="color" className="w-12 h-10 rounded-xl border border-sage-200 dark:border-slate-700 bg-transparent"
                value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
              <input className="input" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
            </div></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}