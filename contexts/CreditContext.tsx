
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

interface CreditContextType {
    credits: number;
    loading: boolean;
    refreshCredits: () => Promise<void>;
    deductCredit: (amount: number) => Promise<boolean>;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAdmin } = useAuth();
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(false);

    const refreshCredits = async () => {
        if (!user) return;
        setLoading(true);

        // Use maybeSingle() to avoid 406 error if row is missing
        let { data, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .maybeSingle();

        // 406 handling or null data checks
        if (!data && !error) {
            console.warn("CreditContext: No profile found for user. Attempting auto-creation...");
            const fallbackUsername = (user.email?.split('@')[0] || 'user') + '_' + Math.floor(Math.random() * 10000);

            const { error: insertError } = await supabase.from('profiles').insert([
                {
                    id: user.id,
                    full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
                    avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture || '',
                    credits: 5, // Default credits
                    username: fallbackUsername
                }
            ]);

            if (insertError) {
                console.error("CreditContext: Critial - Failed to auto-create profile:", insertError);
                error = insertError; // Propagate error
            } else {
                console.log("CreditContext: Profile auto-created. Retrying fetch...");
                // Retry fetch
                const retry = await supabase.from('profiles').select('credits').eq('id', user.id).maybeSingle();
                data = retry.data;
                error = retry.error;
            }
        }

        if (error) {
            console.error('CreditContext: Error fetching credits:', error);
            // Optionally set error state in UI
        } else {
            console.log("CreditContext: Credits loaded:", data?.credits);
            setCredits(data?.credits || 0);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            refreshCredits();
        } else {
            setCredits(0);
        }
    }, [user]);

    const deductCredit = async (amount: number): Promise<boolean> => {
        if (!user) return false;

        // Admin gets unlimited credits
        if (isAdmin) return true;

        if (credits < amount) return false;

        // Optimistic update
        setCredits(prev => prev - amount);

        const { error } = await supabase.rpc('deduct_credits', {
            user_id: user.id,
            amount: amount
        });

        if (error) {
            console.error('Error deducting credits:', error);
            // Revert optimistic update on error
            refreshCredits();
            return false;
        }

        return true;
    };

    return (
        <CreditContext.Provider value={{ credits, loading, refreshCredits, deductCredit }}>
            {children}
        </CreditContext.Provider>
    );
};

export const useCredits = () => {
    const context = useContext(CreditContext);
    if (context === undefined) {
        throw new Error('useCredits must be used within a CreditProvider');
    }
    return context;
};
