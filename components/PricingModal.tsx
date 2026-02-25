import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const handleCreateOrder = async (amount: number) => {
        if (!user) return '';
        try {
            const { data, error } = await supabase.functions.invoke('create-paypal-order', {
                body: { amount: amount }
            });
            if (error) throw error;
            return data.id; // Start assuming the structure is { id: "..." }
        } catch (err) {
            console.error('Error creating order:', err);
            return '';
        }
    };

    const handleApprove = async (data: any) => {
        try {
            const { error } = await supabase.functions.invoke('capture-paypal-order', {
                body: { orderID: data.orderID }
            });
            if (error) throw error;
            alert('Payment successful! Credits added.');
            onClose();
            window.location.reload(); // Refresh to show new credits
        } catch (err) {
            console.error('Error capturing order:', err);
            alert('Payment failed. Please try again.');
        }
    };

    if (!isOpen) return null;

    const initialOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
        intent: "capture",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-background-dark border border-white/10 rounded-3xl p-8 max-w-5xl w-full relative shadow-2xl h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-10"
                >
                    <span className="material-icons">close</span>
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Upgrade Your Status</h2>
                    <p className="text-slate-400">Select a credit package to continue generating elite itineraries.</p>
                </div>

                <PayPalScriptProvider options={initialOptions}>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Essential Advisor Pack */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all group flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-2">Essential Advisor</h3>
                            <div className="text-3xl font-bold text-primary mb-4">$29</div>
                            <ul className="space-y-3 mb-8 text-sm text-slate-400 flex-grow">
                                <li className="flex items-center gap-2"><span className="material-icons text-green-500 text-xs">check</span> 10 Credits (Up to 1 itinerary)</li>
                                <li className="flex items-center gap-2"><span className="material-icons text-green-500 text-xs">check</span> Standard Support</li>
                            </ul>
                            <div className="mt-auto">
                                <PayPalButtons
                                    style={{ layout: "horizontal", tagline: false, height: 40 }}
                                    createOrder={() => handleCreateOrder(29.00)}
                                    onApprove={handleApprove}
                                />
                            </div>
                        </div>

                        {/* Elite Curation Pack - Highlighted */}
                        <div className="bg-primary/10 border border-primary rounded-2xl p-6 relative transform scale-105 shadow-xl shadow-primary/20 flex flex-col">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Elite Curation</h3>
                            <div className="text-3xl font-bold text-luxury-gold mb-4">$99</div>
                            <ul className="space-y-3 mb-8 text-sm text-slate-300 flex-grow">
                                <li className="flex items-center gap-2"><span className="material-icons text-primary text-xs">check</span> 50 Credits (Up to 3-5 itineraries)</li>
                                <li className="flex items-center gap-2"><span className="material-icons text-primary text-xs">check</span> Priority Generation</li>
                                <li className="flex items-center gap-2"><span className="material-icons text-primary text-xs">check</span> Early Access Features</li>
                            </ul>
                            <div className="mt-auto">
                                <PayPalButtons
                                    style={{ layout: "horizontal", tagline: false, height: 45 }}
                                    createOrder={() => handleCreateOrder(99.00)}
                                    onApprove={handleApprove}
                                />
                            </div>
                        </div>

                        {/* Prestige Firm Pack */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-2">Prestige Firm</h3>
                            <div className="text-3xl font-bold text-white mb-4">$599</div>
                            <ul className="space-y-3 mb-8 text-sm text-slate-400 flex-grow">
                                <li className="flex items-center gap-2"><span className="material-icons text-green-500 text-xs">check</span> 500 Credits (Agency scale)</li>
                                <li className="flex items-center gap-2"><span className="material-icons text-green-500 text-xs">check</span> Dedicated Account Mgr</li>
                            </ul>
                            <div className="mt-auto">
                                <PayPalButtons
                                    style={{ layout: "horizontal", tagline: false, height: 40 }}
                                    createOrder={() => handleCreateOrder(599.00)}
                                    onApprove={handleApprove}
                                />
                            </div>
                        </div>
                    </div>
                </PayPalScriptProvider>

                <p className="text-center text-[10px] text-slate-500 mt-8">
                    Secure payment processing by PayPal. Credits never expire.
                </p>
            </div>
        </div>
    );
};

export default PricingModal;
