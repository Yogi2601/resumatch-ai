import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Activity,
  BarChart3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Lock,
  UserCheck,
  Calendar,
  X,
  FileText,
  Building,
} from 'lucide-react';
import type { User, AdminUser, PlatformMetrics } from '../types.ts';

interface AdminDashboardProps {
  currentUser: User | null;
  token: string | null;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  token,
  onClose,
}) => {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchAdminData = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to fetch administrator records.');
      }

      const data = await response.json();
      setMetrics(data.metrics);
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Error communicating with admin API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user @${username}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user.');
      }

      setActionSuccess(`User @${username} deleted.`);
      fetchAdminData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: 'user' | 'admin', username: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role for @${username} from "${currentRole}" to "${newRole}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role.');
      }

      setActionSuccess(`Role for @${username} updated to "${newRole}".`);
      fetchAdminData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-indigo-200 shadow-xl overflow-hidden mb-8 text-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Administrator Command Console</h2>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                Verified Admin Access
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Platform metrics, user directory management, and system-wide ATS scan activity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminData}
            disabled={isLoading}
            className="p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Close Console</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-bold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 font-bold shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-blue-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics ? metrics.totalUsers : '...'}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Registered accounts</span>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50/50 p-4 rounded-2xl border border-purple-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-purple-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total ATS Scans</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics ? metrics.totalScans : '...'}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Resumes processed</span>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Platform Avg Score</span>
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics ? `${metrics.averageScore}%` : '...'}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">ATS compatibility rate</span>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-amber-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Admin Verified</span>
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics ? metrics.adminUsers : '...'}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Master admin accounts</span>
          </div>
        </div>

        {/* Section: User Directory Management */}
        <div className="bg-slate-50/60 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>User Directory & Permission Roles</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Ordinary users register with standard role. Only administrators can assign or update roles.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, @username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Scans Run</th>
                  <th className="p-3">Registered Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelf = user.id === currentUser?.id;
                    const registeredDate = user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A';

                    return (
                      <tr key={user.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span>{user.fullName}</span>
                          {isSelf && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold border border-slate-200">
                              You
                            </span>
                          )}
                        </td>

                        <td className="p-3 font-mono text-indigo-700 font-semibold">
                          @{user.username}
                        </td>

                        <td className="p-3 font-mono text-slate-600">
                          {user.email}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border shadow-2xs ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="p-3 font-bold text-slate-900">
                          {user.scansCount}
                        </td>

                        <td className="p-3 text-slate-500">
                          {registeredDate}
                        </td>

                        <td className="p-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleRole(user.id, user.role, user.username)}
                            className="text-[11px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition"
                            title="Toggle user/admin role"
                          >
                            {user.role === 'admin' ? 'Demote to User' : 'Grant Admin'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Recent Platform Scan Activity */}
        {metrics && metrics.recentScans && metrics.recentScans.length > 0 && (
          <div className="bg-slate-50/60 rounded-2xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>System-Wide Scan Activity Log</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {metrics.recentScans.slice(0, 6).map((scan) => {
                const scoreColor =
                  scan.overallScore >= 80
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : scan.overallScore >= 65
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-rose-700 bg-rose-50 border-rose-200';

                return (
                  <div key={scan.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[140px]">
                        {scan.userName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-black border ${scoreColor}`}>
                        {scan.overallScore}% ATS
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium truncate">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{scan.jobTitle} @ {scan.companyName}</span>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(scan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
