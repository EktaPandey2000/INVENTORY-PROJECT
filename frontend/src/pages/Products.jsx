import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Package, Download } from 'lucide-react';
import * as XLSX from 'xlsx'; // Excel Export के लिए
import api from '../api/axios';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const empty = { name: '', sku: '', description: '', category: '', supplier: '', unit: 'pcs', price: 0, reorderLevel: 10 };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState(''); 
  
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c, s] = await Promise.all([
        api.get('/products', { params: { search } }),
        api.get('/categories'),
        api.get('/suppliers'),
      ]);
      setProducts(p.data); setCategories(c.data); setSuppliers(s.data);
    } catch (e) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [search]);

  const exportToExcel = () => {
    if (products.length === 0) return toast.error('No products to export');
    
    const ws = XLSX.utils.json_to_sheet(products.map(p => ({
      Name: p.name, SKU: p.sku, Category: p.category?.name || '-', 
      Stock: p.stock, Unit: p.unit, Price: p.price
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "FreshTrack_Products.xlsx");
    toast.success('Excel file downloaded!');
  };

  const openCreate = () => { setForm(empty); setEditing(null); setOpen(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name, sku: p.sku, description: p.description || '',
      category: p.category?._id || '', supplier: p.supplier?._id || '',
      unit: p.unit, price: p.price, reorderLevel: p.reorderLevel,
    });
    setEditing(p); setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/products/${editing._id}`, form);
      else await api.post('/products', form);
      toast.success(editing ? 'Product updated' : 'Product created');
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product and all its batches?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package size={24} className="text-teal-600" /> Products
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your catalog & stock levels</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..." 
              className="input !pl-11 w-full" 
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={exportToExcel} className="btn-ghost flex-1 sm:flex-none justify-center">
              <Download size={18} /> Export
            </button>
            
            {/* 🚨 अब सभी यूज़र्स को Add बटन दिखेगा */}
            <button onClick={openCreate} className="btn-primary flex-1 sm:flex-none justify-center">
              <Plus size={18} /> Add
            </button>
          </div>
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-left border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Name</th>
                  <th className="p-4 font-bold text-slate-600 dark:text-slate-300">SKU</th>
                  <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Category</th>
                  <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Stock</th>
                  <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Price</th>
                  <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {products.map((p, i) => (
                    <motion.tr key={p._id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{p.name}</td>
                      <td className="p-4 text-slate-500 font-medium">{p.sku}</td>
                      <td className="p-4">{p.category?.name || '—'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          p.stock <= p.reorderLevel
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                        }`}>{p.stock} {p.unit}</span>
                      </td>
                      <td className="p-4 font-semibold">₹{p.price}</td>
                      <td className="p-4 text-right">
                        {/* 🚨 सभी को एडिट और डिलीट का बटन दिखेगा */}
                        <button onClick={() => openEdit(p)} className="btn-ghost !p-2 !rounded-xl mr-1 text-slate-500 hover:text-teal-600"><Pencil size={16} /></button>
                        <button onClick={() => remove(p._id)} className="btn-ghost !p-2 !rounded-xl text-slate-500 hover:text-rose-600"><Trash2 size={16} /></button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-500 font-medium">
                      No products found. {search && 'Try searching something else.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Product' : 'New Product'}>
        <form onSubmit={save} className="space-y-4">
          <div><label className="label">Name</label>
            <input required className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">SKU</label>
            <input required className="input" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></div>
          <div><label className="label">Description</label>
            <input className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Category</label>
              <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">— Select —</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select></div>
            <div><label className="label">Supplier</label>
              <select className="input" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}>
                <option value="">— Select —</option>
                {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="label">Unit</label>
              <input className="input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} /></div>
            <div><label className="label">Price (₹)</label>
              <input type="number" min="0" className="input" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} /></div>
            <div><label className="label">Reorder Level</label>
              <input type="number" min="0" className="input" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: +e.target.value })} /></div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            <button className="btn-primary">{editing ? 'Update Product' : 'Create Product'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}