import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  X,
  Trash2,
  ShieldCheck,
  Search,
  RefreshCw,
  Briefcase,
  Calendar,
  Clock,
  AlertTriangle,
  UserCheck,
  Mail,
} from 'lucide-react';

export interface AdminUserRecord {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_login_at: string;
  job_count: number;
  status_breakdown?: Record<string, number>;
  is_primary: boolean;
  target_roles?: string[];
  preferred_locations?: string[];
}

interface AdminUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { id: string; email: string; name: string } | null;
  onToast: (msg: string, type?: 'info' | 'error') => void;
}

export const AdminUsersModal: React.FC<AdminUsersModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onToast,
}) => {
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUserRecord | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('careerops_auth_token') || '';
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to load users');
      }
      const data = await res.json();
      if (data?.users) {
        setUsersList(data.users);
      }
    } catch (err: any) {
      onToast(err.message || 'Error fetching user directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const confirmAndExecuteDelete = async () => {
    if (!userToDelete) return;
    const user = userToDelete;
    if (user.is_primary) {
      onToast('Primary admin account cannot be deleted.', 'error');
      setUserToDelete(null);
      return;
    }

    setDeletingId(user.id);
    try {
      const token = localStorage.getItem('careerops_auth_token') || '';
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onToast(`User ${user.email} was removed successfully.`);
        setUsersList((prev) => prev.filter((u) => u.id !== user.id));
        setUserToDelete(null);
      } else {
        throw new Error(data?.error || 'Failed to delete user');
      }
    } catch (err: any) {
      onToast(err.message || 'Error deleting user', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = usersList.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[88vh] bg-[#0c1019] border border-blue-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-blue-500/20"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-white text-lg">
                    Admin User Management Directory
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    {usersList.length} Registered
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  View all database accounts, inspect assigned job states, and clean up test or inactive users.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchUsers}
                disabled={loading}
                className="p-2 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-zinc-300 transition cursor-pointer border border-white/[0.08] disabled:opacity-50"
                title="Refresh user list"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-zinc-400 hover:text-white transition cursor-pointer border border-white/[0.08]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-white/[0.06] bg-black/20 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search users by name, email, or user ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.08] text-zinc-200 placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:border-blue-500/70"
              />
            </div>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Users Table / List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {loading && usersList.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto" />
                <p className="text-xs text-zinc-400 font-mono">Loading registered user accounts...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 text-xs">
                No users found matching your search.
              </div>
            ) : (
              filtered.map((user) => {
                const isPrimary = user.is_primary || user.id === 'usr_kb270102';
                const isCurrent = currentUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* User Info */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm">
                        {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-white text-sm truncate">
                            {user.full_name}
                          </span>

                          {isPrimary && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
                              <ShieldCheck className="w-3 h-3 text-amber-400" />
                              <span>Primary Admin</span>
                            </span>
                          )}

                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                              <UserCheck className="w-3 h-3 text-emerald-400" />
                              <span>You</span>
                            </span>
                          )}

                          {user.id === 'usr_demo' && (
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-700/50 text-zinc-300 border border-zinc-600">
                              Demo Account
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-zinc-400">
                          <span className="flex items-center gap-1 text-zinc-300">
                            <Mail className="w-3 h-3 text-zinc-500" />
                            <span>{user.email}</span>
                          </span>

                          <span className="font-mono text-[11px] text-zinc-500">
                            ID: {user.id}
                          </span>
                        </div>

                        {user.target_roles && user.target_roles.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] uppercase font-bold text-zinc-400">Target Roles:</span>
                            {user.target_roles.slice(0, 3).map((r, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                      {/* Job Count Badge */}
                      <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.06]">
                        <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                        <div className="text-xs">
                          <span className="font-bold text-white font-mono">{user.job_count}</span>
                          <span className="text-zinc-400 ml-1">
                            {user.job_count === 1 ? 'Job' : 'Jobs'}
                          </span>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="hidden sm:block text-[11px] text-zinc-500 font-mono text-right">
                        <div>
                          Joined: {new Date(user.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div>
                          Active: {user.last_login_at ? new Date(user.last_login_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                        </div>
                      </div>

                      {/* Delete Button */}
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => setUserToDelete(user)}
                          disabled={deletingId === user.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition cursor-pointer disabled:opacity-50"
                          title={`Delete ${user.email}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete User</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* In-Modal Delete Confirmation Overlay */}
          <AnimatePresence>
            {userToDelete && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-[#121622] border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4"
                >
                  <div className="flex items-center gap-3 text-rose-400">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-base">Permanently Delete User?</h4>
                      <p className="text-xs text-zinc-400">This action cannot be undone.</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                    Are you sure you want to delete <span className="text-white font-semibold">{userToDelete.full_name}</span> ({userToDelete.email})? All associated candidate job applications, personal profile partition, and active sessions will be purged.
                  </p>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setUserToDelete(null)}
                      disabled={Boolean(deletingId)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmAndExecuteDelete}
                      disabled={Boolean(deletingId)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition cursor-pointer flex items-center gap-2"
                    >
                      {deletingId ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      <span>{deletingId ? 'Deleting...' : 'Yes, Delete Account'}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Relational Database Integrity: User deletion cascade purges associated jobs & sessions.</span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-white/[0.05] hover:bg-white/[0.09] text-zinc-200 rounded-xl transition cursor-pointer border border-white/[0.08]"
            >
              Close Directory
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
