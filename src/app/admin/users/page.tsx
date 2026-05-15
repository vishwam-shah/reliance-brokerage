'use client';

import { useCallback, useEffect, useState } from 'react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import Pagination from '@/components/ui/Pagination';
import { Card } from '@/components/ui/Card';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  company: string;
  createdAt: string;
  lastLoginAt?: string;
};

const TABLE_HEAD = 'text-xs font-semibold text-on-surface-variant px-5 py-3.5 text-left';
const TABLE_CELL = 'px-5 py-4 text-sm';
const ROW_CLASS = 'border-b border-outline-variant/20 hover:bg-surface-container/30 transition-colors last:border-0';

export default function UsersPage() {
  const { user } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [userPage, setUserPage] = useState(1);
  const [userLimit, setUserLimit] = useState(20);
  const [userTotal, setUserTotal] = useState(0);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserRole, setEditUserRole] = useState('');
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`/api/users?page=${userPage}&limit=${userLimit}`, { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.items ?? []);
        setUserTotal(data.total ?? 0);
      }
    } finally {
      setLoadingData(false);
    }
  }, [userPage, userLimit]);

  useEffect(() => {
    loadUsers();
  }, [userPage, userLimit, loadUsers]);

  const saveUserRole = async () => {
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const res = await fetch(`/api/users/${editingUser._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editUserRole }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data?.error?.message ?? 'Update failed'); return; }
      toast.success('User role updated');
      setEditingUser(null);
      loadUsers();
    } catch { toast.error('Network error'); }
    finally { setSavingUser(false); }
  };

  const deleteUser = async () => {
    if (!deletingUser) return;
    const id = deletingUser._id;
    setDeletingUser(null);
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error?.message ?? 'Delete failed'); return; }
    toast.success('User deleted');
    loadUsers();
  };

  return (
    <div className="space-y-4">
      {loadingData ? (
        <div className="flex justify-center py-16">
          <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className={TABLE_HEAD}>Name</th>
                  <th className={TABLE_HEAD}>Email</th>
                  <th className={TABLE_HEAD}>Role</th>
                  <th className={TABLE_HEAD}>Joined</th>
                  <th className={TABLE_HEAD}>Last login</th>
                  {user?.role === 'superadmin' && <th className={cn(TABLE_HEAD, 'text-right')}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className={ROW_CLASS}>
                    <td className={cn(TABLE_CELL, 'font-semibold text-on-surface')}>{u.name}</td>
                    <td className={cn(TABLE_CELL, 'text-on-surface-variant text-xs')}>{u.email}</td>
                    <td className={TABLE_CELL}>
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize',
                        u.role === 'superadmin' ? 'bg-purple-50 text-purple-700' :
                        u.role === 'admin' ? 'bg-blue-50 text-blue-700' :
                        u.role === 'seller' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className={cn(TABLE_CELL, 'text-xs text-on-surface-variant')}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className={cn(TABLE_CELL, 'text-xs text-on-surface-variant')}>
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : '—'}
                    </td>
                    {user?.role === 'superadmin' && (
                      <td className={cn(TABLE_CELL, 'text-right')}>
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => { setEditingUser(u); setEditUserRole(u.role); }}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                            title="Edit role"
                            disabled={u._id === user?.id}
                          >
                            <CIcon icon={cilPencil} style={{ width: 14, height: 14 }} />
                          </button>
                          <button
                            onClick={() => setDeletingUser(u)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-error transition-colors"
                            title="Delete user"
                            disabled={u._id === user?.id}
                          >
                            <CIcon icon={cilTrash} style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={userPage}
            limit={userLimit}
            total={userTotal}
            onPageChange={setUserPage}
            onLimitChange={setUserLimit}
          />
        </Card>
      )}

      {/* Edit user role dialog */}
      <Dialog.Root open={!!editingUser} onOpenChange={(o) => !o && setEditingUser(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 max-w-sm w-full z-50 shadow-modal">
            <Dialog.Title className="font-headline text-lg font-bold text-on-surface mb-1">
              Edit User Role
            </Dialog.Title>
            <Dialog.Description className="text-sm text-on-surface-variant mb-5">
              Change the role for <span className="font-semibold text-on-surface">{editingUser?.name}</span>.
            </Dialog.Description>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Role</label>
              <select
                className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-white text-sm text-on-surface outline-none focus:ring-2 focus:ring-accent/30"
                value={editUserRole}
                onChange={(e) => setEditUserRole(e.target.value)}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Dialog.Close className="h-10 px-4 rounded-xl text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">
                Cancel
              </Dialog.Close>
              <button
                onClick={saveUserRole}
                disabled={savingUser}
                className="h-10 px-4 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {savingUser && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Save Changes
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete user confirmation */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-modal">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Delete user?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              This will permanently delete <span className="font-semibold text-on-surface">{deletingUser.name}</span> ({deletingUser.email}). This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="h-10 px-4 rounded-xl text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="h-10 px-4 rounded-xl text-sm font-medium bg-error text-white hover:bg-error/90 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
