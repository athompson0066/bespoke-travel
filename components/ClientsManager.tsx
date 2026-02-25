import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ClientRecord } from '../types';

const ClientsManager: React.FC = () => {
    const { user } = useAuth();
    const [clients, setClients] = useState<ClientRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [newClientDestination, setNewClientDestination] = useState('');

    useEffect(() => {
        if (user) {
            fetchClients();
        }
    }, [user]);

    const fetchClients = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching clients:', error);
        } else {
            setClients(data || []);
        }
        setLoading(false);
    };

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newClientName.trim()) return;

        const newClientData = {
            user_id: user.id,
            name: newClientName,
            last_destination: newClientDestination || null,
            status: 'active'
        };

        const { data, error } = await supabase
            .from('clients')
            .insert([newClientData])
            .select()
            .single();

        if (error) {
            console.error('Error adding client:', error);
            alert('Failed to add client.');
        } else if (data) {
            setClients([data, ...clients]);
            setNewClientName('');
            setNewClientDestination('');
            setIsAdding(false);
        }
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm('Are you sure you want to delete this client?')) return;

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting client:', error);
            alert('Failed to delete client.');
        } else {
            setClients(clients.filter(c => c.id !== id));
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Client Directory</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary text-white px-6 py-2 rounded-full font-bold flex items-center gap-2"
                >
                    <span className="material-icons">{isAdding ? 'close' : 'person_add'}</span>
                    {isAdding ? 'Cancel' : 'Add Client'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddClient} className="glass p-6 rounded-2xl mb-8 flex flex-col sm:flex-row gap-4 items-end animate-in fade-in slide-in-from-top-4">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold mb-2">Client Name <span className="text-red-500">*</span></label>
                        <input
                            required
                            type="text"
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            placeholder="e.g. The Sterling Family"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold mb-2">Last Destination</label>
                        <input
                            type="text"
                            value={newClientDestination}
                            onChange={(e) => setNewClientDestination(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            placeholder="e.g. St. Barths"
                        />
                    </div>
                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all h-[50px] w-full sm:w-auto mt-4 sm:mt-0">
                        Save
                    </button>
                </form>
            )}

            {loading ? (
                <div className="text-center py-12 text-slate-400">
                    <span className="material-icons animate-spin text-4xl mb-4">sync</span>
                    <p>Loading clients...</p>
                </div>
            ) : clients.length === 0 ? (
                <div className="text-center py-16 glass rounded-2xl text-slate-400">
                    <span className="material-icons text-5xl mb-4 opacity-50">group</span>
                    <p className="text-lg">No clients found.</p>
                    <p className="text-sm mt-2">Add your first client to get started with saving itineraries.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {clients.map(client => (
                        <div key={client.id} className="glass p-6 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-luxury-gold/20 text-luxury-gold rounded-full flex items-center justify-center font-bold">
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold">{client.name}</h4>
                                    <p className="text-xs text-slate-400">Last trip: {client.last_destination || 'None'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${client.status === 'active' ? 'bg-green-500/20 text-green-500' :
                                        client.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                            'bg-slate-500/20 text-slate-500'
                                    }`}>
                                    {client.status || 'active'}
                                </span>
                                <button
                                    onClick={() => handleDeleteClient(client.id)}
                                    className="material-icons text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Client"
                                >
                                    delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientsManager;
