import React from 'react';
import { Sunrise, Sunset, Moon } from 'lucide-react';

export default function AstronomyCard({ astronomy, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-white/20 rounded"></div>
          <div className="h-20 bg-white/20 rounded"></div>
          <div className="h-20 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Moon className="w-5 h-5 text-amber-200" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Astronomy
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-b from-amber-500/10 to-transparent rounded-2xl">
          <Sunrise className="w-8 h-8 text-amber-400 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-1">Sunrise</p>
          <p className="text-white text-lg font-light">{astronomy?.sunrise || '--:--'}</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-b from-orange-500/10 to-transparent rounded-2xl">
          <Sunset className="w-8 h-8 text-orange-400 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-1">Sunset</p>
          <p className="text-white text-lg font-light">{astronomy?.sunset || '--:--'}</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-2xl">
          <Moon className="w-8 h-8 text-indigo-300 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-1">Moon</p>
          <p className="text-white text-sm font-light">{astronomy?.moonPhase || '--'}</p>
        </div>
      </div>

      {astronomy?.nextEvent && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-sky-100/60 text-sm text-center">
            <span className="text-amber-300">{astronomy.nextEvent}</span>
          </p>
        </div>
      )}
    </div>
  );
}