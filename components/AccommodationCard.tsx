import React, { useState } from 'react';
import { LocationDetails } from '../types';

interface AccommodationCardProps {
    accommodation: LocationDetails;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
    const [mode, setMode] = useState<'image' | 'video'>('image');

    // Fallback only if backend fails completely (should be rare)
    const fallbackUrl = "https://images.unsplash.com/photo-1571896349842-6e5a513e610a?q=80&w=800&auto=format&fit=crop";
    const dynamicImageUrl = accommodation.mediaOptions?.heroImage || accommodation.customImageUrl || fallbackUrl;
    const videoData = accommodation.mediaOptions?.videoTour || accommodation.video;

    return (
        <div className="bg-white dark:bg-slate-900 border border-luxury-gold/30 p-8 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="w-full md:w-64 h-48 overflow-hidden shrink-0 shadow-lg relative z-10 group-card">
                {mode === 'video' && videoData ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoData.id}?autoplay=1&rel=0`}
                        title={accommodation.placeName}
                        className="h-full w-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <img
                        src={dynamicImageUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Accommodation"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackUrl; }}
                    />
                )}

                {/* Attribution Overlay */}
                {accommodation.attribution && mode === 'image' && !dynamicImageUrl.includes('loremflickr') && !dynamicImageUrl.includes('unsplash') && (
                    <div className="absolute bottom-1 right-1 z-20 max-w-[90%]">
                        <p className="text-[8px] text-zinc-400 bg-black/60 px-1.5 py-0.5 truncate" dangerouslySetInnerHTML={{ __html: accommodation.attribution }}></p>
                    </div>
                )}

                {/* Video Toggle */}
                {videoData && mode === 'image' && (
                    <button
                        onClick={() => setMode('video')}
                        className="absolute top-2 right-2 flex items-center gap-1 bg-red-600/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md shadow-lg transition-transform hover:scale-105"
                    >
                        <span className="material-icons text-[12px]">play_circle</span>
                        Tour
                    </button>
                )}
                {mode === 'video' && (
                    <button
                        onClick={() => setMode('image')}
                        className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md shadow-lg transition-transform hover:scale-105"
                    >
                        <span className="material-icons text-[12px]">image</span>
                        Photo
                    </button>
                )}
            </div>

            <div className="flex-grow relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <span className="material-icons text-luxury-gold text-xl">hotel</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-luxury-gold">Recommended Stay</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 shadow-sm uppercase ${dynamicImageUrl ? 'bg-luxury-gold text-white' : 'bg-primary text-white'}`}>
                        {dynamicImageUrl ? 'Authentic View' : 'Recommended'}
                    </span>
                </div>
                <h5 className="text-3xl font-bold mb-3 text-white tracking-tight">{accommodation.placeName}</h5>
                <p className="text-slate-400 leading-relaxed text-sm max-w-xl">{accommodation.description}</p>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-2 relative z-10">
                <div className="text-4xl font-black text-luxury-gold tracking-tighter">{accommodation.rating > 0 ? accommodation.rating.toFixed(1) : "5.0"}</div>
                <a
                    href={accommodation.groundingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-luxury-gold text-white px-10 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-luxury-gold/20 hover:scale-105 active:scale-95"
                >
                    Explore Resort
                </a>
            </div>
        </div>
    );
};

export default AccommodationCard;
