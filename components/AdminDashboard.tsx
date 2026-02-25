import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface Profile {
    id: string;
    email: string;
    full_name?: string;
    company_name?: string;
    plan: string;
    credits: number;
    subscription_status: string;
    created_at?: string;
}

const AdminDashboard: React.FC = () => {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAdmin) {
            fetchProfiles();
        }
    }, [isAdmin]);

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProfiles(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch profiles');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) return;
        try {
            // In a real scenario, this should call an Edge Function with service_role to delete from auth.users.
            // For now, we will call our admin-actions endpoint (which we will build next)
            const { data, error } = await supabase.functions.invoke('admin-actions', {
                body: { action: 'delete_user', userId }
            });

            if (error) throw error;

            setProfiles(prev => prev.filter(p => p.id !== userId));
            alert('User deleted successfully.');
        } catch (err: any) {
            alert(`Error deleting user: ${err.message}`);
        }
    };

    const handleUpdateCredits = async (userId: string, currentCredits: number) => {
        const amountStr = window.prompt(`Update credits for user (current: ${currentCredits}):`, currentCredits.toString());
        if (amountStr === null) return;

        const newCredits = parseInt(amountStr, 10);
        if (isNaN(newCredits)) {
            alert('Invalid number');
            return;
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ credits: newCredits })
                .eq('id', userId);

            if (error) throw error;

            setProfiles(prev => prev.map(p => p.id === userId ? { ...p, credits: newCredits } : p));
        } catch (err: any) {
            alert(`Error updating credits: ${err.message}`);
        }
    };

    const handleUpdatePlan = async (userId: string, currentPlan: string) => {
        const newPlan = window.prompt(`Update plan (Essential, Premium, Elite) (current: ${currentPlan}):`, currentPlan);
        if (!newPlan) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ plan: newPlan })
                .eq('id', userId);

            if (error) throw error;

            setProfiles(prev => prev.map(p => p.id === userId ? { ...p, plan: newPlan } : p));
        } catch (err: any) {
            alert(`Error updating plan: ${err.message}`);
        }
    };

    if (authLoading) return <div className="text-white text-center p-20">Loading...</div>;
    if (!user || !isAdmin) return <Navigate to="/" replace />;

    return (
        <div className="bg-slate-950 min-h-screen pt-10 pb-20 text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-10 flex justify-between items-center border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2">Admin Dashboard</h1>
                        <p className="text-sm text-slate-400">Manage subscribers, plans, and platform settings.</p>
                    </div>
                    <button onClick={fetchProfiles} className="bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2">
                        <span className="material-icons text-sm">refresh</span> Refresh Data
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-500 p-4 border border-red-500/50 rounded-lg mb-8">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-slate-500 flex flex-col items-center">
                        <span className="material-icons animate-spin text-4xl mb-4">settings</span>
                        <p>Loading subscribers...</p>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-black/50 border-b border-white/10 text-xs uppercase tracking-widest text-slate-400">
                                    <tr>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Company</th>
                                        <th className="p-4">Plan / Status</th>
                                        <th className="p-4">Credits</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {profiles.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-slate-500">No subscribers found.</td>
                                        </tr>
                                    ) : (
                                        profiles.map((profile) => (
                                            <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{profile.full_name || 'N/A'}</div>
                                                    <div className="text-xs text-slate-400">{profile.email}</div>
                                                </td>
                                                <td className="p-4 text-slate-300">
                                                    {profile.company_name || <span className="text-slate-600 italic">None</span>}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded">
                                                            {profile.plan || 'Free'}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium">
                                                        {profile.subscription_status === 'active' ? (
                                                            <span className="text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Active</span>
                                                        ) : (
                                                            <span className="text-slate-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> Inactive</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold flex items-center gap-1.5">
                                                        <span className="material-icons text-luxury-gold text-sm">diamond</span>
                                                        {profile.credits}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleUpdatePlan(profile.id, profile.plan || '')}
                                                            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-slate-300 transition-colors"
                                                        >
                                                            Edit Plan
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateCredits(profile.id, profile.credits || 0)}
                                                            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-slate-300 transition-colors"
                                                        >
                                                            Edit Credits
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(profile.id)}
                                                            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-3 py-1.5 transition-colors ml-2"
                                                            title="Delete permanently"
                                                        >
                                                            <span className="material-icons text-xs">delete_forever</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
