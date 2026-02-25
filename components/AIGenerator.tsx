import React, { useState, useEffect } from 'react';
import { generateItinerary, generateCustomVisual } from '../services/geminiService';
import { ItineraryRequest, ItineraryResponse, ClientRecord, LocationDetails } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import { supabase } from '../services/supabaseClient';
import PricingModal from './PricingModal';
import AuthModal from './AuthModal';

const INTEREST_OPTIONS = [
  'Michelin Dining', 'Contemporary Art', 'History', 'Private Yachting',
  'Wine Tasting', 'Wellness & Spa', 'Wildlife', 'Photography', 'Shopping'
];

// MOCK_CLIENTS removed, fetching real clients from Supabase

const CREDIT_COSTS: Record<string, number> = {
  '3 Days': 10,
  '5 Days': 15,
  '7 Days': 20,
  '10 Days': 30
};

// PricingModal imported from component



import MediaCard from './MediaCard';
import AccommodationCard from './AccommodationCard';
import ClientsManager from './ClientsManager';

const AIGenerator: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { credits, deductCredit } = useCredits();

  const [activeTab, setActiveTab] = useState<'builder' | 'clients' | 'settings'>('builder');
  const [loading, setLoading] = useState(false);
  const [transmitting, setTransmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [result, setResult] = useState<ItineraryResponse | null>(null);
  const [showHeroVideo, setShowHeroVideo] = useState(false);

  // Modal State
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Clients state
  const [clients, setClients] = useState<ClientRecord[]>([]);

  useEffect(() => {
    if (user) {
      supabase
        .from('clients')
        .select('*')
        .order('name')
        .then(({ data }) => {
          if (data) setClients(data);
        });
    }
  }, [user, activeTab]);

  /* 
   * Agent / Email Customization State 
   */
  const [recipientEmail, setRecipientEmail] = useState('');
  const [agentName, setAgentName] = useState('Bespoke AI');
  const [agentBusiness, setAgentBusiness] = useState('Bespoke AI');

  const [formData, setFormData] = useState<ItineraryRequest>({
    clientName: '',
    destination: '',
    duration: '7 Days',
    vibe: 'relaxing',
    budgetLevel: 'ultra-luxury',
    interests: [],
    travelPace: 3
  });

  const cost = CREDIT_COSTS[formData.duration];
  const hasEnoughCredits = isAdmin || (credits || 0) >= cost;

  const handleEmailItinerary = async () => {
    if (!result || !user) return;

    setSendingEmail(true);
    try {
      if (!recipientEmail) {
        alert('Please enter a recipient email address.');
        setSendingEmail(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('send-itinerary', {
        body: {
          email: recipientEmail,
          clientName: formData.clientName,
          agentName: agentName,
          agentBusiness: agentBusiness,
          itinerary: result
        }
      });

      if (error) {
        let errorMessage = error.message;
        if (error.context) {
          try {
            const body = await error.context.json();
            errorMessage = body.error?.message || body.error || errorMessage;
          } catch (e) {
            // keep default
          }
        }
        throw new Error(errorMessage);
      }

      alert(`Itinerary emailed successfully to ${recipientEmail}!`);
    } catch (err: any) {
      console.error('Error sending email:', err);
      // Show the specific error message from the backend or network
      alert(`Failed to send email: ${err.message || 'Unknown error'}. \n\nNote: If you are using Resend Sandbox, you can only send to your verified email (e.g., aiolosmedia25@gmail.com).`);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!hasEnoughCredits) {
      setIsPricingOpen(true);
      return;
    }

    setLoading(true);
    setResult(null);
    setSent(false);
    try {
      const data = await generateItinerary(formData);
      setResult(data);
      // Consume credits
      await deductCredit(cost);

      // Update client's last destination if they exist
      const matchingClient = clients.find(c => c.name.toLowerCase() === formData.clientName.trim().toLowerCase());
      if (matchingClient) {
        supabase
          .from('clients')
          .update({ last_destination: formData.destination })
          .eq('id', matchingClient.id)
          .then(({ error }) => {
            if (error) console.error('Error updating client destination:', error);
          });
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      alert(`Failed to generate itinerary: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };



  const handleTransmit = () => {
    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      setSent(true);
    }, 2000);
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const sidebarLinks = [
    { id: 'builder', icon: 'auto_awesome', label: 'Itinerary Builder' },
    { id: 'clients', icon: 'group', label: 'My Clients' },
    { id: 'settings', icon: 'settings', label: 'Platform Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'clients':
        return <ClientsManager />;
      case 'settings':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
            <h2 className="text-3xl font-bold mb-8">Settings</h2>
            <div className="space-y-8">
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Agency / Business Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                      value={agentBusiness}
                      onChange={(e) => setAgentBusiness(e.target.value)}
                      placeholder="e.g. Sterling Luxury Travel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Advisor Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="e.g. Alexandra Sterling"
                    />
                  </div>
                </div>
              </div>
              <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Subscription & Billing</h3>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-slate-400">Current Balance</p>
                    <p className="text-2xl font-black text-white">{isAdmin ? 'Unlimited' : `${credits} Credits`}</p>
                  </div>
                  <button onClick={() => setIsPricingOpen(true)} className="bg-luxury-gold text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Buy Credits</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <span className="text-green-500 font-bold flex items-center gap-2">
                    <span className="material-icons text-sm">check_circle</span> Plan: {credits > 1000 ? 'Enterprise' : 'Ad-hoc'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'builder':
      default:
        return (
          <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Form Side */}
            <div className="glass p-8 rounded-2xl lg:sticky lg:top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span className="material-icons text-primary">edit_note</span>
                  Journey Parameters
                </h2>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="material-icons text-luxury-gold text-xs">toll</span>
                  <span className="text-[10px] font-black text-white">{isAdmin ? 'Unlimited' : credits}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2">Client Name</label>
                  <input
                    required
                    type="text"
                    list="client-options"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white transition-all"
                    placeholder="e.g. The Sterling Family"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                  <datalist id="client-options">
                    {clients.map(c => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Destination</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white transition-all"
                    placeholder="e.g. Kyoto, Japan"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Duration</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white appearance-none cursor-pointer"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    >
                      <option className="bg-background-dark" value="3 Days">3 Days</option>
                      <option className="bg-background-dark" value="5 Days">5 Days</option>
                      <option className="bg-background-dark" value="7 Days">7 Days</option>
                      <option className="bg-background-dark" value="10 Days">10 Days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Vibe</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white appearance-none cursor-pointer"
                      value={formData.vibe}
                      onChange={(e) => setFormData({ ...formData, vibe: e.target.value as any })}
                    >
                      <option className="bg-background-dark" value="relaxing">Relaxing</option>
                      <option className="bg-background-dark" value="adventurous">Active</option>
                      <option className="bg-background-dark" value="cultural">Art & Culture</option>
                      <option className="bg-background-dark" value="romantic">Romantic</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold">Travel Pace</label>
                    <span className="text-xs font-bold text-primary uppercase">
                      {['Slow', 'Relaxed', 'Balanced', 'Active', 'Fast paced'][formData.travelPace - 1]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    value={formData.travelPace}
                    onChange={(e) => setFormData({ ...formData, travelPace: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-4">Key Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${formData.interests.includes(interest)
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/30'
                          }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  {!hasEnoughCredits && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-4 flex items-center gap-3">
                      <span className="material-icons text-red-500 text-sm">error</span>
                      <p className="text-[10px] text-red-500 font-bold uppercase">Insufficient credits for {formData.duration}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold flex flex-col items-center justify-center transition-all shadow-xl shadow-primary/20 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'} ${!hasEnoughCredits ? 'bg-luxury-gold text-white' : 'bg-primary text-white'}`}
                  >
                    {loading ? (
                      <span className="material-icons animate-spin">sync</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="material-icons">{!hasEnoughCredits ? 'toll' : 'auto_awesome'}</span>
                        <span>{!hasEnoughCredits ? 'Purchase Credits' : 'Generate Experience'}</span>
                      </div>
                    )}
                    {!loading && hasEnoughCredits && (
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mt-1">Cost: {cost} Credit{cost > 1 ? 's' : ''}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Result Side */}
            <div className="relative pb-12 min-h-[600px]">
              {!result && !loading && (
                <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-white/10 h-full flex flex-col items-center justify-center min-h-[600px]">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20">
                    <span className="material-icons text-primary text-5xl">travel_explore</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Begin Your Curation</h3>
                  <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Set the journey parameters on the left to generate an elite, search-verified itinerary with direct location links.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-8 animate-in fade-in duration-700">
                  <div className="relative">
                    <div className="absolute inset-0 bg-luxury-gold blur-[60px] opacity-20 animate-pulse"></div>
                    <div className="relative w-24 h-24 border-4 border-white/10 border-t-luxury-gold rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-icons text-white/20 text-4xl animate-pulse">auto_awesome</span>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-sm mx-auto">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Designing Your Journey</h3>
                    <div className="flex flex-col gap-2 items-center">
                      <p className="text-luxury-gold text-xs font-black uppercase tracking-[0.2em] animate-pulse">
                        Curating Exclusive Experiences
                      </p>
                      <p className="text-slate-500 text-sm">
                        Analyzing 50+ data points for {formData.destination}<span className="animate-pulse">...</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-md w-full mx-auto relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-1 bg-luxury-gold animate-[loading_60s_linear_infinite]" style={{ width: '100%' }}></div>
                    <div className="flex gap-4 items-start text-left">
                      <span className="material-icons text-luxury-gold shrink-0">verified</span>
                      <div>
                        <p className="text-white text-sm font-bold mb-1">Did you know?</p>
                        <p className="text-slate-400 text-xs leading-relaxed">As luxury travel advisors, you have access to private villas, after-hours tours, and amenities that aren't available to the public. We are checking these perks for you now.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
                    {showHeroVideo && result.destinationVideo ? (
                      <div className="w-full h-full bg-black relative">
                        <iframe
                          src={`https://www.youtube.com/embed/${result.destinationVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                          title={result.destinationVideo.title}
                          className="w-full h-full object-cover"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        <button
                          onClick={() => setShowHeroVideo(false)}
                          className="absolute top-6 right-6 bg-black/50 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-all z-50"
                        >
                          <span className="material-icons">close</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <img
                          src={result.destinationImageUrl || `https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop`}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          alt={result.destination}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>

                        {/* Destination Attribution Overlay */}
                        {result.destinationImageAttribution && !result.destinationImageUrl?.includes('unsplash') && (
                          <div className="absolute bottom-1 right-1 z-20 max-w-[90%]">
                            <p className="text-[9px] text-zinc-400 bg-black/60 px-2 py-1 rounded truncate" dangerouslySetInnerHTML={{ __html: result.destinationImageAttribution }}></p>
                          </div>
                        )}

                        <div className="absolute bottom-12 left-12 right-12 z-10">
                          <div className="flex items-center gap-4 mb-6 flex-wrap">
                            <div className="bg-primary/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase text-white tracking-[0.25em] shadow-xl border border-white/20">
                              Verified Itinerary
                            </div>
                            {result.destinationImageUrl && (
                              <div className="bg-luxury-gold/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase text-white tracking-[0.25em] shadow-xl border border-white/20">
                                Authentic Location
                              </div>
                            )}
                            {result.destinationVideo && (
                              <button
                                onClick={() => setShowHeroVideo(true)}
                                className="bg-red-600/90 hover:bg-red-600 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase text-white tracking-[0.25em] shadow-xl border border-white/20 flex items-center gap-2 hover:scale-105 transition-all"
                              >
                                <span className="material-icons text-sm">play_circle_filled</span>
                                Watch Cinematic Tour
                              </button>
                            )}
                          </div>
                          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">{result.destination}</h2>
                          <p className="text-slate-200 text-xl max-w-3xl italic leading-relaxed opacity-90 font-medium">"{result.summary}"</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* New Features: Playlist, Calendar, and Tips */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    {/* Utility Buttons */}
                    <div className="lg:col-span-1 space-y-4">
                      {result.itinerary[0]?.vibeDeck && (
                        <a
                          href={`https://open.spotify.com/search/${encodeURIComponent(result.itinerary[0].vibeDeck + " " + result.destination + " vibe")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#1DB954]/20 hover:scale-[1.02] active:scale-95 group"
                        >
                          <span className="material-icons group-hover:animate-spin">music_note</span>
                          <span>Sound of {result.destination}</span>
                        </a>
                      )}
                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Trip+to+${encodeURIComponent(result.destination)}&details=${encodeURIComponent("Itinerary curated by Bespoke AI")}&dates=${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15)}/${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <span className="material-icons">event</span>
                        <span>Add to Calendar</span>
                      </a>
                    </div>

                    {/* Know Before You Go Card */}
                    {result.tips && (
                      <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="relative z-10">
                          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-icons text-luxury-gold">lightbulb</span>
                            Know Before You Go
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs font-bold text-luxury-gold uppercase tracking-wider mb-1">Currency</p>
                              <p className="text-sm text-slate-300">{result.tips.currency}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-luxury-gold uppercase tracking-wider mb-1">Tipping</p>
                              <p className="text-sm text-slate-300">{result.tips.tipping}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-luxury-gold uppercase tracking-wider mb-1">Dress Code</p>
                              <p className="text-sm text-slate-300">{result.tips.dressCode}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-luxury-gold uppercase tracking-wider mb-1">Etiquette</p>
                              <p className="text-sm text-slate-300">{result.tips.etiquette}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {result.itinerary.map((day) => (
                    <div key={day.day} className="space-y-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shadow-primary/20 shrink-0">
                          {day.day < 10 ? `0${day.day}` : day.day}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-3xl font-bold text-white tracking-tight truncate">{day.title}</h4>
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black">Daily Sequence</p>
                            {day.vibeDeck && (
                              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                <span className="material-icons text-luxury-gold text-xs">queue_music</span>
                                <span className="text-[10px] text-zinc-300 font-medium tracking-wide uppercase">{day.vibeDeck}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {day.rainAlternate && (
                        <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-2xl flex items-start gap-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2 opacity-10">
                            <span className="material-icons text-4xl">umbrella</span>
                          </div>
                          <span className="material-icons text-indigo-400 mt-0.5">umbrella</span>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Agentic Alternate (Rain Plan)</p>
                            <p className="text-sm text-slate-300 italic">{day.rainAlternate}</p>
                          </div>
                        </div>
                      )}

                      <div className="h-px bg-slate-200 dark:bg-white/10 w-full my-6"></div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <MediaCard time="Morning" loc={day.morning} />
                        <MediaCard time="Afternoon" loc={day.afternoon} />
                        <MediaCard time="Evening" loc={day.evening} />
                      </div>

                      {day.accommodation && (
                        <AccommodationCard accommodation={day.accommodation} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {result && (
                <div className="mt-12 flex flex-col items-center justify-center pb-8 print:hidden gap-4">
                  <div className="w-full max-w-md">
                    <label className="block text-sm font-semibold mb-2 text-center text-slate-400">Send to Client (or yourself)</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white transition-all text-center mb-4"
                      placeholder="client@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleEmailItinerary}
                    disabled={sendingEmail || !recipientEmail}
                    className={`bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 ${sendingEmail || !recipientEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="material-icons">{sendingEmail ? 'hourglass_empty' : 'email'}</span>
                    {sendingEmail ? 'Sending...' : 'Email Itinerary'}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark relative overflow-hidden text-center px-4">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 max-w-md animate-in zoom-in duration-500">
          <span className="material-icons text-6xl text-primary mb-6">lock_person</span>
          <h2 className="text-3xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Please sign in or create a free account to access the Bespoke AI Itinerary Builder.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20"
          >
            Sign In / Create Account
          </button>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => { setIsAuthModalOpen(false); window.location.href = '#/'; }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background-light dark:bg-background-dark">
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <aside className="w-full lg:w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] z-40 shrink-0 shadow-sm transition-all">
        <div className="p-6">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-2 lg:pb-0">
            {sidebarLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id as any)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap lg:w-full ${activeTab === link.id
                  ? 'bg-primary text-white shadow-xl shadow-primary/20'
                  : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                  }`}
              >
                <span className="material-icons">{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block mt-12 p-8 rounded-3xl bg-luxury-gold/5 border border-luxury-gold/20 relative overflow-hidden group">
            <div className="flex items-center gap-3 text-luxury-gold mb-4 relative z-10">
              <span className="material-icons text-xl">toll</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Credit Engine</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-6 relative z-10">
              Your practice currently has <span className="text-white font-bold">{isAdmin ? 'unlimited credits' : `${credits} credits remaining`}</span>.
            </p>
            <button onClick={() => setIsPricingOpen(true)} className="w-full bg-luxury-gold text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-luxury-gold/10 hover:scale-105 active:scale-95 transition-all">
              Top Up Credits
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-16 transition-all">
        <div className="max-w-[1400px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AIGenerator;
