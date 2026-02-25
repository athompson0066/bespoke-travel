import React from 'react';
import { Link } from 'react-router-dom';
import MediaCard from './MediaCard';
import AccommodationCard from './AccommodationCard';

const StaticItineraryExample: React.FC = () => {
  // Hardcoded example data matching ItineraryResponse structure
  const itineraryDays = [
    {
      day: 1,
      title: "Arrival in Positano",
      rainAlternate: "Private cooking class at La Tagliata followed by wine tasting in their cellar.",
      vibeDeck: "Italian Summer Jazz",
      morning: {
        placeName: "Private Transfer to Le Sirenuse",
        category: "Transport",
        description: "Check-in to the Sea View Field Suite. Welcome champagne on terrace.",
        rating: 5.0,
        imageKeyword: "positano view",
        groundingUrl: "https://sirenuse.it",
        customImageUrl: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_627,q_auto,w_1200/hotelier-images/26/fa/35042564145e028306fddaeea2292caa8eac784057b628241af7dcf0d513.jpeg"
      },
      afternoon: {
        placeName: "Lunch at La Sponda",
        category: "Dining",
        description: "Michelin-starred dining with panoramic views of the bay.",
        rating: 4.9,
        imageKeyword: "italian restaurant view",
        groundingUrl: "https://sirenuse.it/en/la-sponda-restaurant",
        customImageUrl: "https://www.italianplaces.it/images/ristoranti/la_sponda_positano/lasponda.jpg"
      },
      evening: {
        placeName: "Sunset Aperitivo at Franco's Bar",
        category: "Nightlife",
        description: "The most iconic sunset spot in Positano. Reserved premier seating.",
        rating: 4.8,
        imageKeyword: "cocktails sunset",
        groundingUrl: "https://francosbar.com",
        customImageUrl: "https://images.squarespace-cdn.com/content/v1/5d74fbe2ab51db1eb86f7214/1569721409187-J79XK7SN11PF4QAMR7XT/francos+bar.jpg"
      },
      accommodation: {
        placeName: "Le Sirenuse",
        category: "Hotel",
        description: "A wonderful place from which to enjoy the simple pleasures of Positano and the spectacular views of the bay.",
        rating: 5.0,
        imageKeyword: "le sirenuse positano",
        groundingUrl: "https://sirenuse.it",
        mediaOptions: {
          heroImage: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/701764917.jpg?k=25f5ec065365a20a654980a7f6b68ce5162a078ce52a293fba0d7985e5c53ac5&o=",
          videoTour: null
        },
        attribution: "Booking.com"
      }
    },
    {
      day: 2,
      title: "Capri by Private Yacht",
      rainAlternate: "Private tour of Villa San Michele and Anacapri artisan workshops.",
      vibeDeck: "Mediterranean Lounge",
      morning: {
        placeName: "Riva Aquarama Charter",
        category: "Activity",
        description: "Full day private charter circumnavigating Capri, including Blue Grotto access before crowds.",
        rating: 5.0,
        imageKeyword: "riva boat capri",
        groundingUrl: "https://www.capri.com",
        customImageUrl: "https://cdn.tripspoint.com/uploads/photos/5150/vintage-riva-aquarama-motorboat-for-a-daily-charter-along-amalfi-coast_1vI9c.jpeg"
      },
      afternoon: {
        placeName: "Lunch at Il Riccio",
        category: "Dining",
        description: "Cliffside seafood dining next to the Blue Grotto. Famous for their dessert room.",
        rating: 4.7,
        imageKeyword: "capri seafood lunch",
        groundingUrl: "https://www.capri Palace.com",
        customImageUrl: "https://media-cdn2.greatbritishchefs.com/media/eacfhhay/img45394.whqc_660x440q80.jpg"
      },
      evening: {
        placeName: "Dinner at Da Paolino",
        category: "Dining",
        description: "Dining under the famous lemon trees. Reserved premier seating.",
        rating: 4.6,
        imageKeyword: "lemon restaurant capri",
        groundingUrl: "https://paolinocapri.com",
        customImageUrl: "https://www.airial.travel/_next/image?url=https%3A%2F%2Fmedia-cdn.tripadvisor.com%2Fmedia%2Fphoto-m%2F1280%2F03%2Fca%2F96%2F92%2Fda-paolino-lemontrees.jpg&w=3840&q=75"
      }
    },
    {
      day: 3,
      title: "Ravello & Departure",
      rainAlternate: "Guided tour of the Amalfi Cathedral and crypts.",
      vibeDeck: "Classical Italian",
      morning: {
        placeName: "Villa Cimbrone Gardens",
        category: "Culture",
        description: "Private guided history tour of the estate and 'Terrace of Infinity'.",
        rating: 4.9,
        imageKeyword: "villa cimbrone",
        groundingUrl: "https://www.villacimbrone.com",
        customImageUrl: "https://www.ravello.com/images/articles/villa-cimbrone/v2/hotel-villa-cimbrone.jpg"
      },
      afternoon: {
        placeName: "Lunch at Rossellinis",
        category: "Dining",
        description: "Farewell lunch at Palazzo Avino before private transfer to NAP airport.",
        rating: 5.0,
        imageKeyword: "ravello dining view",
        groundingUrl: "https://palazzoavino.com",
        customImageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/b5/f8/d9/caption.jpg?w=1100&h=1100&s=1"
      },
      evening: {
        placeName: "Departure",
        category: "Transport",
        description: "Private Mercedes V-Class transfer to Naples International Airport.",
        rating: 5.0,
        imageKeyword: "luxury car transfer",
        groundingUrl: "",
        customImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Mercedes-Benz_V_250_d_Avantgarde_Edition_%28447%29_%E2%80%93_Frontansicht%2C_2._M%C3%A4rz_2015%2C_D%C3%BCsseldorf.jpg/800px-Mercedes-Benz_V_250_d_Avantgarde_Edition_%28447%29_%E2%80%93_Frontansicht%2C_2._M%C3%A4rz_2015%2C_D%C3%BCsseldorf.jpg"
      }
    }
  ];

  return (
    <div className="bg-slate-950 overflow-hidden shadow-2xl border border-primary/20 animate-in slide-in-from-bottom-8 duration-700 h-[1000px] flex flex-col relative group text-white">
      {/* Decorative Blur */}
      <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>

      <div className="bg-primary p-8 text-white shrink-0 relative z-10">
        <div className="flex justify-between items-start mb-10 border-b border-white/10 pb-6">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-luxury-gold block mb-1.5 opacity-80">Curated By</span>
            <div className="flex items-center gap-2">
              <span className="material-icons text-luxury-gold text-lg">explore</span>
              <span className="font-bold text-xl tracking-tight text-white border-b border-luxury-gold/50">Odissea Travel Designs</span>
            </div>
            <p className="text-xs text-white/50 mt-1 uppercase tracking-widest font-medium">Virtuoso® Member Agency</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 block mb-1.5 opacity-80">Presented To</span>
            <span className="font-black text-lg tracking-tight">Mr. & Mrs. Sterling</span>
            <p className="text-xs text-white/70 mt-1 font-medium">September 12-15, 2026</p>
          </div>
        </div>

        <h4 className="font-black text-4xl tracking-tighter mb-2">Amalfi Coast, Italy</h4>
        <p className="text-sm text-luxury-gold uppercase tracking-widest font-black mb-8 flex items-center gap-2">
          3-Day Ultra-Luxury Concept <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span> <span className="text-white/50">Positano • Capri • Ravello</span>
        </p>

        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-5 rounded-md relative shadow-inner">
          <span className="material-icons absolute top-4 left-4 text-white/10 text-4xl pointer-events-none">format_quote</span>
          <p className="font-medium text-[15px] text-white/90 italic pl-12 pr-4 leading-relaxed relative z-10 tracking-wide text-pretty">
            "Dear James and Eleanor—I'm thrilled to present this initial concept for your Amalfi Coast getaway. I've secured the Sea View Field Suite for you at Le Sirenuse and a sunset table at Franco's for your arrival. Let's review the Riva yacht details together before finalizing."
          </p>
          <p className="text-right text-xs mt-3 flex items-center justify-end gap-2 text-white">
            <span className="w-6 h-px bg-luxury-gold/50"></span>
            <span className="font-bold text-luxury-gold">Isabella Romano</span>, Senior Advisor
          </p>
        </div>
      </div>

      <div className="p-8 overflow-y-auto flex-grow space-y-16 scrollbar-hide relative z-10">
        {itineraryDays.map((day) => (
          <div key={day.day} className="space-y-8">
            {/* Day Header */}
            <div className="flex items-center gap-6 sticky top-0 bg-slate-950/90 backdrop-blur-md z-20 py-4 -mx-2 px-2 border-b border-white/5">
              <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-black text-lg shadow-xl shadow-primary/20 shrink-0">
                {day.day.toString().padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-2xl font-bold text-white tracking-tight truncate">{day.title}</h4>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-0.5">
                    <span className="material-icons text-luxury-gold text-[10px]">queue_music</span>
                    <span className="text-[9px] text-zinc-300 font-medium tracking-wide uppercase">{day.vibeDeck}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rain Alternate */}
            <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 flex items-start gap-3 relative overflow-hidden">
              <span className="material-icons text-indigo-400 mt-0.5">umbrella</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Agentic Alternate (Rain Plan)</p>
                <p className="text-sm text-slate-300 italic">{day.rainAlternate}</p>
              </div>
            </div>

            {/* Media Cards Grid - Single Column for Visibility */}
            <div className="grid grid-cols-1 gap-6">
              <MediaCard time="Morning" loc={day.morning} />
              <MediaCard time="Afternoon" loc={day.afternoon} />
              <MediaCard time="Evening" loc={day.evening} />
            </div>

            {/* Accommodation (Only show for Day 1 as home base, or if moving hotels) */}
            {day.day === 1 && day.accommodation && (
              <div className="pt-4">
                <AccommodationCard accommodation={day.accommodation} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900 border-t border-white/5 mt-auto relative z-10">
        <Link to="/generator" className="w-full bg-primary text-white py-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20">
          Unlock Full Intelligence Suite
          <span className="material-icons">lock_open</span>
        </Link>
        <p className="text-center mt-3 text-[9px] text-slate-400 uppercase tracking-widest">
          Available to Verified Advisors Only
        </p>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] py-20 flex items-center overflow-hidden bg-background-dark">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
          <img
            alt="Luxury Travel Vista"
            className="w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite]"
            src="https://www.thetravelmagazine.net/wp-content/uploads/woman.jpg"
          />
        </div>

        <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8 animate-in slide-in-from-left duration-700">
              <span className="material-icons text-luxury-gold text-sm">stars</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Elite Automation Suite</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight animate-in slide-in-from-left duration-700 delay-100">
              Elevate Your Curation. <br />
              <span className="text-primary italic font-light">Reclaim Your Calendar.</span>
            </h1>

            <p className="text-xl text-slate-300 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in slide-in-from-left duration-700 delay-200">
              Bespoke AI transforms the labor-intensive art of itinerary building into a seamless, 60-second experience. Designed exclusively for the standards of HNW travelers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 animate-in fade-in duration-1000 delay-500">
              <Link to="/generator" className="bg-primary text-white w-full sm:w-auto px-16 py-5 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-2xl shadow-primary/40 flex items-center justify-center gap-2">
                Build Your First Itinerary (5 Free Credits)
                <span className="material-icons">auto_awesome</span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in zoom-in duration-1000 delay-300">
            <div className="relative glass p-4 rounded-3xl border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
              <img
                src="https://www.thetravelmagazine.net/wp-content/uploads/woman.jpg"
                className="rounded-2xl shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                alt="Product Preview"
              />
              <div className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl border-white/10 shadow-2xl animate-bounce-slow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-xs">check</span>
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Grounding Verified</span>
                </div>
                <p className="text-[10px] text-slate-400">Enterprise Search Active</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Concierge Section */}
      <section className="py-24 px-6 bg-background-light dark:bg-slate-950">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="glass p-8 rounded-3xl border-white/5 bg-primary/5">
                  <span className="material-icons text-primary text-4xl mb-4">public</span>
                  <h4 className="text-xl font-bold mb-2">Global Insight</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Direct access to real-time availability and trending destinations worldwide.</p>
                </div>
                <div className="glass p-8 rounded-3xl border-white/5 mt-12">
                  <span className="material-icons text-luxury-gold text-4xl mb-4">verified</span>
                  <h4 className="text-xl font-bold mb-2">Bespoke Quality</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Curated exclusively for the standard of HNW travelers and luxury agencies.</p>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="glass p-8 rounded-3xl border-white/5">
                  <span className="material-icons text-white text-4xl mb-4">bolt</span>
                  <h4 className="text-xl font-bold mb-2">Instant Scale</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Scale your expertise across hundreds of clients with instantaneous output.</p>
                </div>
                <div className="glass p-8 rounded-3xl border-white/5 bg-primary/5">
                  <span className="material-icons text-primary text-4xl mb-4">auto_fix_high</span>
                  <h4 className="text-xl font-bold mb-2">Custom Visuals</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Bespoke AI-generated imagery for every itinerary to wow your clients.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">The 24/7 Digital <br /> Concierge for Your Practice.</h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Bespoke AI acts as an extension of your elite advising team, handling the heavy lifting of research and documentation so you can focus on building relationships.
            </p>
            <Link to="/generator" className="text-primary font-bold flex items-center gap-2 group hover:underline">
              Explore Intelligence Suite
              <span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Complete Private Beta Section */}
      <section className="py-32 px-6 bg-background-dark relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-luxury-gold/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-64 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left Content: The Elite Value Prop */}
            <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-2 bg-luxury-gold/10 backdrop-blur-md border border-luxury-gold/20 px-4 py-2 rounded-full mb-4">
                <span className="material-icons text-luxury-gold text-xs">vpn_key</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-gold">Elite Access Only</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                Stop Building Itineraries. <br /> <span className="text-primary">Start Closing Sales.</span>
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                Bespoke AI eliminates the tedious busywork of luxury travel design. See how top-tier advisors are reclaiming 15+ hours a week while delivering stunning proposals that instantly convert high-net-worth clients.
              </p>

              <div className="space-y-5 pt-4">
                {[
                  {
                    icon: 'hourglass_disabled',
                    title: 'The Burnout of Endless Curation',
                    desc: 'Instantly generate 5-star, hyper-personalized itineraries in seconds. Reclaim your time to close more sales and build stronger relationships than competing agents.'
                  },
                  {
                    icon: 'cancel_presentation',
                    title: 'The Embarrassment of Closed Venues',
                    desc: 'Every recommendation is verified against real-time global data. Never lose a client’s trust over a permanently closed restaurant or unavailable activity again.'
                  },
                  {
                    icon: 'style',
                    title: 'Losing Deals to Basic PDF Proposals',
                    desc: 'Deliver bespoke, editorial-grade visual storytelling. Your digital proposals will look like a feature in Vogue Travel, instantly setting you apart from traditional agents.'
                  },
                  {
                    icon: 'thunderstorm',
                    title: 'Scrambling When the Weather Turns',
                    desc: 'True 24/7 concierge forward-thinking. Every outdoor activity includes an automated, equally luxurious "Rain Plan", proving your unmatched attention to detail.'
                  },
                  {
                    icon: 'gpp_bad',
                    title: 'The Fear of Big Tech Data Mining',
                    desc: 'Your client list is your livelihood. We strictly enforce enterprise-grade privacy and zero data-sharing, keeping your high-net-worth blackbook entirely yours.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary transition-all">
                      <span className="material-icons text-primary text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm mb-1">{item.title}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[44, 45, 46, 47].map(i => <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} className="w-8 h-8 rounded-full border-2 border-background-dark" alt="Curator" />)}
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                  Routed to Lead Curation Team
                </p>
              </div>
            </div>

            {/* Right Side: The Form Widget */}
            <div className="relative">
              <StaticItineraryExample />

              {/* Decorative "System Status" Label */}
              <div className="absolute -top-4 -right-4 lg:right-4 z-50 bg-background-dark border border-white/10 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 delay-700">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">System Operational</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-background-light dark:bg-background-dark border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">The Standard of Luxury</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: 'psychology', title: 'Intelligent Curation', text: "Sophisticated algorithms tailored for the HNW traveler, learning the nuances of your elite client's personal taste." },
              { icon: 'verified_user', title: 'Agency-First Design', text: 'Elegant, high-end templates that reflect a prestigious brand identity across every digital touchpoint.' },
              { icon: 'send', title: 'Seamless Productivity', text: 'Go from request to a comprehensive digital experience in seconds. Reclaim your time for high-touch relationship building.' },
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/40 transition-all">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <span className="material-icons text-primary group-hover:text-white text-3xl transition-colors">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32 px-6 bg-background-light dark:bg-background-dark border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <span className="material-icons text-luxury-gold text-6xl mb-8">format_quote</span>
          <blockquote className="text-3xl md:text-4xl font-medium italic mb-10 leading-snug">
            "Bespoke AI has redefined my capability as an advisor. What used to take half a day of deep research now takes a minute. The output is indistinguishable from my own manual curation, yet perfectly polished."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden shadow-xl">
              <img
                alt="Advisor Portrait"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA1hlcvTlwUjIYFGij_oMpdFrmma-sBYh-1olRmPh8fRBic5U7QF87_3JAXdd7kXLgv2dJfiSxXjX7BoKomOUTj1IM8HxcxSidByTMT6OTojojMo4OK2FdX--wuH2VGz4tqdyyQFeI3mAHOX1c6KG1esg2gKMRTzQkBEqPSlCeL9wZfBnPki44Y0-jJtmbN4EVfN1aoF3-H1aimi3Ki3FHOUzUXWNZYEGvjuRMXRkOnlYpkjqeMwEK6pZMM07mn1Wx4ZdyDgPEpmQe"
              />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">Alexandra Sterling</p>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider">Principal Luxury Travel Advisor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-primary rounded-xl overflow-hidden p-12 md:p-20 text-center text-white">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Ready to scale your expertise?</h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto relative z-10">
              Stop losing Sunday nights to formatting. Join the elite circle of advisors using Bespoke AI to deliver more, faster.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 relative z-10">
              <Link
                to="/generator"
                className="bg-white text-primary px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-xl w-full sm:w-auto text-center"
              >
                Launch Generator - Get 5 Free Credits
              </Link>
              <p className="mt-4 text-[11px] text-white/70 uppercase tracking-[0.2em] font-bold relative z-10">
                Available to Verified Advisors Only.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
