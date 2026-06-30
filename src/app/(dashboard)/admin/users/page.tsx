'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { FiUsers, FiSearch, FiToggleLeft, FiToggleRight, FiMail, FiCheck } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [changingRole, setChangingRole] = useState<string | null>(null);

  const loadUsers = () => {
    adminAPI.getUsers({ role: role || undefined, search: search || undefined, page }).then(res => {
      setUsers(res.data.users);
      setTotal(res.data.total);
    });
  };

  useEffect(() => { loadUsers(); }, [page, role, search]);

  const toggleStatus = async (id: string) => {
    await adminAPI.toggleUserStatus(id);
    loadUsers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChangingRole(userId);
    try {
      await adminAPI.updateUserRole(userId, newRole);
      loadUsers();
    } finally {
      setChangingRole(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-slate-500 dark:text-slate-400">Total users: {total}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search users..." />
        </div>
        <div className="flex gap-2">
          {['', 'jobseeker', 'employee', 'admin'].map(r => (
            <button key={r} onClick={() => setRole(r)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${role === r ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>{r || 'All'}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 font-medium">User</th>
              <th className="text-left py-3 px-4 font-medium">Email</th>
              <th className="text-left py-3 px-4 font-medium">Role</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Joined</th>
              <th className="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 dark:bg-green-900/50 rounded-full flex items-center justify-center"><FiUsers className="text-green-600 text-sm" /></div>
                  <span className="font-medium">{user.profile?.firstName} {user.profile?.lastName}</span>
                </td>
                <td className="py-3 px-4 text-slate-500">{user.email}</td>
                <td className="py-3 px-4">
                  <select value={user.role} onChange={e => handleRoleChange(user._id, e.target.value)} disabled={changingRole === user._id} className={`input-field text-xs py-1 px-2 w-auto ${changingRole === user._id ? 'opacity-50' : ''}`}>
                    <option value="jobseeker">jobseeker</option>
                    <option value="employee">employee</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="py-3 px-4"><span className={`badge text-xs ${user.isActive ? 'badge-green' : 'badge-red'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="py-3 px-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => toggleStatus(user._id)} className={`btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 ml-auto ${user.isActive ? 'text-red-500' : 'text-green-600'}`}>
                    {user.isActive ? <FiToggleLeft /> : <FiToggleRight />} {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
