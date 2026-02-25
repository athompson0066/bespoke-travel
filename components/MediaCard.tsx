import React, { useState } from 'react';
import { LocationDetails } from '../types';

interface MediaCardProps {
    loc: LocationDetails;
    time: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ loc, time }) => {
    const [mode, setMode] = useState<'image' | 'video'>('image');

    const fallbackUrl = `https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop`;

    // Prioritize mediaOptions from new Unfailable Waterfall
    const dynamicImageUrl = loc.mediaOptions?.heroImage || loc.customImageUrl || fallbackUrl;
    const videoData = loc.mediaOptions?.videoTour || loc.video;

    return (
        <div className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-luxury-gold/30 hover:bg-white/10">
            {/* Visual Header */}
            <div className="relative aspect-video w-full overflow-hidden">
                {mode === 'video' && videoData ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoData.id}?autoplay=1&rel=0`}
                        title={loc.placeName}
                        className="h-full w-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <img
                        src={dynamicImageUrl}
                        alt={loc.placeName}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackUrl; }}
                    />
                )}

                {/* Badges & Toggles */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10">
                        {time}
                    </span>
                    {mode === 'video' && (
                        <button onClick={() => setMode('image')} className="flex items-center gap-1 bg-black/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10 hover:bg-black">
                            <span className="material-icons text-[14px]">image</span> Back to Photo
                        </button>
                    )}
                </div>

                {/* Video Toggle Button (Only if video exists) */}
                {videoData && mode === 'image' && (
                    <button
                        onClick={() => setMode('video')}
                        className="absolute top-3 right-3 flex items-center gap-2 bg-luxury-gold/90 px-3 py-1 text-xs font-bold text-black backdrop-blur-md shadow-lg transition-transform hover:scale-105 hover:bg-luxury-gold"
                    >
                        <span className="material-icons text-[16px]">play_circle</span>
                        Watch Tour
                    </button>
                )}

                {/* Location Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                    <h3 className="text-lg font-bold text-white">{loc.placeName}</h3>
                    <p className="text-sm text-gray-300">{loc.category}</p>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4">
                <p className="text-sm leading-relaxed text-gray-300 mb-4">{loc.description}</p>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1">
                        <span className="material-icons text-[16px] text-yellow-500">star</span>
                        <span className="text-sm font-bold text-white">{loc.rating}</span>
                    </div>
                    <div className="flex gap-2">
                        {loc.groundingUrl && (
                            <a href={loc.groundingUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                                <span className="material-icons text-sm">map</span> Map
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaCard;
