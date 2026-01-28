import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';

const weatherIcons = {
  'clear': Sun,
  'sunny': Sun,
  'clouds': Cloud,
  'cloudy': Cloud,
  'rain': CloudRain,
  'drizzle': CloudRain,
  'default': Sun
};

export default function WeatherCard({ weather, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-24 mb-4"></div>
        <div className="h-16 bg-white/20 rounded w-32 mb-4"></div>
        <div className="h-4 bg-white/20 rounded w-full"></div>
      </div>
    );
  }

  const condition = weather?.condition?.toLowerCase() || 'clear';
  const IconComponent = Object.entries(weatherIcons).find(([key]) => 
    condition.includes(key)
  )?.[1] || weatherIcons.default;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-500">
      <div className="flex items-center gap-2 mb-4">
        <Thermometer className="w-5 h-5 text-amber-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Weather
        </h3>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-5xl md:text-6xl font-extralight text-white">
            {weather?.temperature || '--'}°
          </p>
          <p className="text-sky-100/80 text-lg capitalize mt-1">
            {weather?.condition || 'Loading...'}
          </p>
        </div>
        <IconComponent className="w-16 h-16 text-amber-300/80" strokeWidth={1} />
      </div>

      <div className="flex gap-6 mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-sky-300/60" />
          <span className="text-sky-100/70 text-sm">
            {typeof weather?.wind === 'object' ? weather.wind.speed : weather?.wind || '--'} mph
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-300/60" />
          <span className="text-sky-100/70 text-sm">{weather?.humidity || '--'}%</span>
        </div>
      </div>
    </div>
  );
}