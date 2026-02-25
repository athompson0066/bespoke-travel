import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import AuthModal from './AuthModal';
import PricingModal from './PricingModal';

type ModalType = 'support' | 'contact' | 'request' | null;

const Navbar: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { credits } = useCredits();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // New State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const location = useLocation();

  const navLinks = [
    { name: 'Templates', path: '#' },
    { name: 'AI Generator', path: '/generator' },
    { name: 'Support', type: 'modal', modal: 'support' as ModalType },
    { name: 'Contact Us', type: 'modal', modal: 'contact' as ModalType },
  ];

  const handleModalOpen = (type: ModalType) => {
    setActiveModal(type);
    setIsMenuOpen(false);
    setSubmitted(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setActiveModal(null), 2000);
    }, 1500);
  };

  const renderModalContent = () => {
    if (submitted) {
      return (
        <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons text-4xl">check_circle</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Message Received</h3>
          <p className="text-slate-400">Our concierge team will respond shortly.</p>
        </div>
      );
    }

    const titles: Record<string, string> = {
      support: 'Priority Support',
      contact: 'Connect with Us',
      request: 'Request Platform Access'
    };

    const subtitles: Record<string, string> = {
      support: 'How can we assist your practice today?',
      contact: 'Reach out for inquiries or partnerships.',
      request: 'Apply for our exclusive advisor network.'
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-1">{titles[activeModal || '']}</h3>
          <p className="text-slate-400 text-sm">{subtitles[activeModal || '']}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
              <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="Alexandra Sterling" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Work Email</label>
              <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="advisor@bespoke-ai.com" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Message</label>
            <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none resize-none" placeholder="How can we help?"></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="material-icons animate-spin">sync</span>
          ) : (
            <>
              <span className="material-icons">send</span>
              Submit Request
            </>
          )}
        </button>
      </form>
    );
  };

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />

      <nav className="fixed top-0 w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="material-icons text-white">auto_awesome</span>
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">BESPOKE <span className="text-primary">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.type === 'modal' ? (
                <button
                  key={link.name}
                  onClick={() => handleModalOpen(link.modal as ModalType)}
                  className="text-sm font-medium hover:text-primary transition-colors text-slate-400"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-slate-400'
                    }`}
                >
                  {link.name}
                </Link>
              )
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/admin' ? 'text-primary' : 'text-slate-400'}`}
              >
                Admin
              </Link>
            )}

            {/* Auth & Credits */}
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPricingModalOpen(true)}
                  className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <span className="material-icons text-luxury-gold text-sm">diamond</span>
                  <span className="text-xs font-bold text-white">{credits} Credits</span>
                </button>

                <div className="relative group/profile">
                  <button className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    <img src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`} alt="Profile" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background-dark border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover/profile:block">
                    <div className="p-3 border-b border-white/5">
                      <p className="text-xs font-bold text-white truncate">{user.user_metadata.full_name || user.email}</p>
                    </div>
                    <button onClick={signOut} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-sm font-bold text-white hover:text-primary transition-colors"
              >
                Sign In
              </button>
            )}

            <Link
              to="/generator"
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
            >
              <span className="material-icons text-sm">rocket_launch</span>
              Launch Platform
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              <span className="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-background-light dark:bg-background-dark border-b border-primary/10 p-6 space-y-4 shadow-2xl">
            {navLinks.map((link) => (
              link.type === 'modal' ? (
                <button
                  key={link.name}
                  onClick={() => handleModalOpen(link.modal as ModalType)}
                  className="block w-full text-left text-lg font-medium hover:text-primary"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-lg font-medium hover:text-primary"
                >
                  {link.name}
                </Link>
              )
            ))}

            {user ? (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Credits</span>
                  <span className="font-bold text-white">{credits}</span>
                </div>
                <button onClick={signOut} className="w-full text-left text-red-400 font-bold">Sign Out</button>
              </div>
            ) : (
              <button
                onClick={() => { setIsMenuOpen(false); setIsAuthModalOpen(true); }}
                className="block w-full text-left text-lg font-medium hover:text-primary"
              >
                Sign In
              </button>
            )}

            <Link
              to="/generator"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-primary text-white px-6 py-3 rounded-full text-center font-semibold"
            >
              Launch Generator
            </Link>
          </div>
        )}
      </nav>

      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setActiveModal(null)}
          ></div>
          <div className="relative glass w-full max-w-lg p-8 rounded-[2.5rem] border-white/10 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <span className="material-icons">close</span>
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
