import React from 'react';
import { Waves, Thermometer, Wind, Gauge, Ship } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OceanRealityCard({ oceanData, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-8 bg-white/20 rounded"></div>
          <div className="h-8 bg-white/20 rounded"></div>
          <div className="h-8 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  const getTideStatusColor = (status) => {
    if (status?.toLowerCase().includes('rising')) return 'text-emerald-400';
    if (status?.toLowerCase().includes('falling')) return 'text-sky-400';
    return 'text-gray-400';
  };

  const getPressureTrendIcon = (trend) => {
    if (trend === 'rising') return '↑';
    if (trend === 'falling') return '↓';
    return '→';
  };

  const getWindRotation = (direction) => {
    const directions = {
      'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
      'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
      'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
      'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[direction] || 0;
  };

  return (
    <div className="bg-gradient-to-br from-cyan-500/10 via-white/10 to-blue-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Waves className="w-5 h-5 text-cyan-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Ocean Reality
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-sky-200/70 text-sm">Tide Now</span>
          <span className={`text-lg font-medium ${getTideStatusColor(oceanData?.tideStatus)}`}>
            {oceanData?.tideStatus || 'Unknown'}
          </span>
        </div>

        {oceanData?.waterTemp && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span className="text-sky-200/70 text-sm">Water Temp</span>
            </div>
            <span className="text-lg font-medium text-white">{oceanData.waterTemp}°F</span>
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-sky-400" />
            <span className="text-sky-200/70 text-sm">Wind</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-white">
              {oceanData?.windSpeed || '--'} mph
              {oceanData?.windGusts && ` (gusts ${oceanData.windGusts})`}
            </span>
            {oceanData?.windDirection && (
              <motion.div
                animate={{ rotate: getWindRotation(oceanData.windDirection) }}
                transition={{ duration: 0.5 }}
                className="w-6 h-6 text-amber-400"
              >
                ↑
              </motion.div>
            )}
          </div>
        </div>

        {oceanData?.pressure && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <span className="text-sky-200/70 text-sm">Pressure</span>
            </div>
            <span className="text-lg font-medium text-white">
              {oceanData.pressure} {getPressureTrendIcon(oceanData.pressureTrend)}
            </span>
          </div>
        )}

        {oceanData?.boatSafeHours && (
          <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <Ship className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-200/90 text-sm font-medium">Boat-Safe Hours</span>
            </div>
            <span className="text-lg font-medium text-emerald-300">{oceanData.boatSafeHours}</span>
          </div>
        )}
      </div>
    </div>
  );
}