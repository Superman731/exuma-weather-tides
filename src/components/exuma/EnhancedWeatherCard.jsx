import React from 'react';
import { Cloud, Droplets, Eye } from 'lucide-react';

export default function EnhancedWeatherCard({ weather, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-500/10 via-white/10 to-blue-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Cloud className="w-5 h-5 text-sky-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Weather Details
        </h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-1">Current</p>
            <p className="text-white text-2xl font-light">{weather?.temperature || '--'}°</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-1">Feels Like</p>
            <p className="text-white text-2xl font-light">{weather?.feelsLike || '--'}°</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span className="text-sky-200/70 text-sm">Humidity</span>
          </div>
          <span className="text-white font-light">{weather?.humidity || '--'}%</span>
        </div>

        {weather?.cloudCover && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-sky-200/70 text-sm">Cloud Cover</span>
            </div>
            <span className="text-white font-light">{weather.cloudCover}%</span>
          </div>
        )}

        {weather?.rainChance && (
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-200/90 text-sm font-medium">Rain Chance</span>
              <span className="text-blue-100 font-light">{weather.rainChance}%</span>
            </div>
            {weather.rainByHour && (
              <p className="text-blue-200/70 text-xs">{weather.rainByHour}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}