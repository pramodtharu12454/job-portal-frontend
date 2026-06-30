'use client';

import { useEffect, useState } from 'react';
import { categoriesAPI } from '@/lib/api';
import { FiLayers, FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [newCat, setNewCat] = useState({ name: '', icon: '', description: '', order: 0 });

  useEffect(() => { categoriesAPI.getCategories().then(res => setCategories(res.data)); }, []);

  const handleCreate = async () => {
    await categoriesAPI.createCategory(newCat);
    setNewCat({ name: '', icon: '', description: '', order: 0 });
    categoriesAPI.getCategories().then(res => setCategories(res.data));
  };

  const handleUpdate = async () => {
    if (!editing) return;
    await categoriesAPI.updateCategory(editing._id, editing);
    setEditing(null);
    categoriesAPI.getCategories().then(res => setCategories(res.data));
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      await categoriesAPI.deleteCategory(id);
      categoriesAPI.getCategories().then(res => setCategories(res.data));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage job categories</p>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><FiPlus /> Add Category</h2>
        <div className="grid grid-cols-4 gap-3">
          <input value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} className="input-field" placeholder="Category name" />
          <input value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })} className="input-field" placeholder="Icon name" />
          <input value={newCat.description} onChange={e => setNewCat({ ...newCat, description: e.target.value })} className="input-field" placeholder="Description" />
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2 justify-center"><FiPlus /> Add</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 font-medium">Name</th>
              <th className="text-left py-3 px-4 font-medium">Description</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id} className="border-b border-slate-100 dark:border-slate-700/50">
                {editing?._id === cat._id ? (
                  <>
                    <td className="py-3 px-4"><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="input-field text-sm" /></td>
                    <td className="py-3 px-4"><input value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="input-field text-sm" /></td>
                    <td className="py-3 px-4">
                      <select value={editing.isActive ? 'true' : 'false'} onChange={e => setEditing({ ...editing, isActive: e.target.value === 'true' })} className="input-field text-sm">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={handleUpdate} className="btn-secondary text-xs py-1.5 px-3 mr-1"><FiSave /></button>
                      <button onClick={() => setEditing(null)} className="btn-secondary text-xs py-1.5 px-3"><FiX /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-4 font-medium">{cat.name}</td>
                    <td className="py-3 px-4 text-slate-500">{cat.description || '-'}</td>
                    <td className="py-3 px-4"><span className={`badge text-xs ${cat.isActive ? 'badge-green' : 'badge-red'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => setEditing(cat)} className="btn-secondary text-xs py-1.5 px-3 mr-1"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(cat._id)} className="btn-secondary text-xs py-1.5 px-3 text-red-500"><FiTrash2 /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
