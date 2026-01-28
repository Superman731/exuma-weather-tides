import React from 'react';
import { Moon, Eye } from 'lucide-react';

const getMoonEmoji = (phase) => {
  const p = phase?.toLowerCase() || '';
  if (p.includes('new')) return '🌑';
  if (p.includes('waxing crescent')) return '🌒';
  if (p.includes('first quarter')) return '🌓';
  if (p.includes('waxing gibbous')) return '🌔';
  if (p.includes('full')) return '🌕';
  if (p.includes('waning gibbous')) return '🌖';
  if (p.includes('last quarter') || p.includes('third quarter')) return '🌗';
  if (p.includes('waning crescent')) return '🌘';
  return '🌙';
};

export default function MoonCard({ moonData, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  const getStargazingRating = (illumination) => {
    if (illumination < 20) return { text: 'Dark Night ✨', color: 'text-purple-300', desc: 'Perfect for stargazing' };
    if (illumination < 50) return { text: 'Good Night 🌙', color: 'text-indigo-300', desc: 'Great for stars' };
    if (illumination < 80) return { text: 'Bright Night 🌔', color: 'text-sky-300', desc: 'Stars still visible' };
    return { text: 'Very Bright 🌕', color: 'text-amber-300', desc: 'Moon dominates' };
  };

  const rating = getStargazingRating(moonData?.illumination || 50);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-white/10 to-purple-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Moon className="w-5 h-5 text-indigo-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Moon
        </h3>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-2xl font-light mb-1">{moonData?.phase || 'Unknown'}</p>
            <p className="text-sky-200/60 text-sm">{moonData?.illumination || '--'}% illuminated</p>
          </div>
          <div className="text-6xl">{getMoonEmoji(moonData?.phase)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-1">Moonrise</p>
            <p className="text-white font-light">{moonData?.moonrise || '--:--'}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-1">Moonset</p>
            <p className="text-white font-light">{moonData?.moonset || '--:--'}</p>
          </div>
        </div>

        <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-purple-300" />
            <p className={`font-medium ${rating.color}`}>{rating.text}</p>
          </div>
          <p className="text-sky-200/70 text-sm">{rating.desc}</p>
        </div>
      </div>
    </div>
  );
}