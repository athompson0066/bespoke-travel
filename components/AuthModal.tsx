
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
                        },
                    },
                });
                if (error) throw error;
            }
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-background-dark border border-white/10 rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <span className="material-icons">close</span>
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    {isLogin ? 'Welcome Back' : 'Join Bespoke AI'}
                </h2>

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-slate-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-primary font-bold hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-slate-500 uppercase">Or continue with</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Sign in with Google
                </button>

            </div>
        </div>
    );
};

export default AuthModal;
