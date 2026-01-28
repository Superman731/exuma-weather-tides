import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function IslandContextCard({ contextData, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-8 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-white/10 to-teal-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-emerald-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Island Context
        </h3>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-white/5 rounded-xl">
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-2">Tropic of Cancer Beach</p>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <p className="text-white font-light font-mono text-sm">
              {contextData?.latitude || '23.5° N'}, {contextData?.longitude || '75.8° W'}
            </p>
          </div>
        </div>

        {contextData?.seasonalMarker && (
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <p className="text-amber-200 font-medium">{contextData.seasonalMarker}</p>
          </div>
        )}

        {contextData?.seaState && (
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-1">Sea State</p>
            <p className="text-white font-light">{contextData.seaState}</p>
          </div>
        )}
      </div>
    </div>
  );
}