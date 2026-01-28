import React from 'react';
import { Sun, Clock, Sunrise, Sunset } from 'lucide-react';

export default function SunDaylightCard({ sunData, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-white/20 rounded"></div>
          <div className="h-24 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-white/10 to-orange-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Sun className="w-5 h-5 text-amber-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Sun & Daylight
        </h3>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sky-200/70 text-sm">Daylight Length</span>
          <span className="text-xl font-light text-white">{sunData?.daylightLength || '--'}</span>
        </div>

        {sunData?.goldenHour && (
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-amber-200/90 text-sm font-medium">Golden Hour</span>
              <span className="text-amber-100 font-light">{sunData.goldenHour}</span>
            </div>
          </div>
        )}

        {sunData?.uvIndex && (
          <div className="flex items-center justify-between">
            <span className="text-sky-200/70 text-sm">UV Index</span>
            <span className={`text-lg font-medium ${
              sunData.uvIndex >= 8 ? 'text-red-400' : 
              sunData.uvIndex >= 6 ? 'text-orange-400' : 
              sunData.uvIndex >= 3 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {sunData.uvIndex} {sunData.uvIndex >= 8 ? '(Very High)' : sunData.uvIndex >= 6 ? '(High)' : sunData.uvIndex >= 3 ? '(Moderate)' : '(Low)'}
            </span>
          </div>
        )}

        {sunData?.solarNoon && (
          <div className="flex items-center justify-between">
            <span className="text-sky-200/70 text-sm">Solar Noon</span>
            <span className="text-white font-light">{sunData.solarNoon}</span>
          </div>
        )}

        {/* Twilight visualization */}
        {sunData?.twilight && (
          <div className="space-y-2">
            <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-3">Twilight Periods</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400/60"></div>
                <span className="text-xs text-sky-200/70 flex-1">Civil</span>
                <span className="text-xs text-white font-light">{sunData.twilight.civil}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-400/60"></div>
                <span className="text-xs text-sky-200/70 flex-1">Nautical</span>
                <span className="text-xs text-white font-light">{sunData.twilight.nautical}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-400/60"></div>
                <span className="text-xs text-sky-200/70 flex-1">Astronomical</span>
                <span className="text-xs text-white font-light">{sunData.twilight.astronomical}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}