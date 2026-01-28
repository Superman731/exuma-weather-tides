import React from 'react';
import { Waves, ArrowUp, ArrowDown } from 'lucide-react';

export default function TideCard({ tides, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-24 mb-4"></div>
        <div className="space-y-4">
          <div className="h-12 bg-white/20 rounded"></div>
          <div className="h-12 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Waves className="w-5 h-5 text-cyan-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Tides
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sky-200/60 text-xs uppercase tracking-wider">High Tide</p>
              <p className="text-white text-xl font-light">{tides?.highTide || '--:--'}</p>
            </div>
          </div>
          <p className="text-sky-100/50 text-sm">{tides?.highTideHeight || ''}</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-sky-200/60 text-xs uppercase tracking-wider">Low Tide</p>
              <p className="text-white text-xl font-light">{tides?.lowTide || '--:--'}</p>
            </div>
          </div>
          <p className="text-sky-100/50 text-sm">{tides?.lowTideHeight || ''}</p>
        </div>
      </div>
    </div>
  );
}