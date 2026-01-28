import React from 'react';
import { Waves, Wind, Gauge, Droplets, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import CardFooter from './CardFooter';

export default function OceanRealityCard({ response, tideResponse, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-white/20 rounded"></div>
          <div className="h-12 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!response || !response.ok) {
    return (
      <div className="bg-red-900/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-red-500/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-200/80 uppercase tracking-widest text-xs font-medium">
            Ocean Reality - Error
          </h3>
        </div>
        <p className="text-red-200 text-sm">{response?.error?.message || 'Failed to load ocean data'}</p>
        {response?.error?.details && (
          <p className="text-red-300/60 text-xs mt-2">{response.error.details}</p>
        )}
        <CardFooter
          source={response?.source}
          retrievedAt={response?.retrievedAt}
          lat={response?.lat}
          lon={response?.lon}
        />
      </div>
    );
  }

  const current = response.data.current;
  const tideData = tideResponse?.data;

  const getTideStatusColor = (status) => {
    if (!status) return 'text-gray-400';
    if (status === 'Rising') return 'text-emerald-400';
    if (status === 'Falling') return 'text-sky-400';
    return 'text-gray-400';
  };

  const getWindDirection = (degrees) => {
    if (degrees === undefined || degrees === null) return '';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((degrees % 360) / 45)) % 8;
    return directions[index];
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Waves className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Ocean Reality
        </h3>
      </div>

      <div className="space-y-4">
        {tideData?.tideStatus && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span className="text-sky-200/60 text-sm">Tide Now</span>
            <span className={`font-medium ${getTideStatusColor(tideData.tideStatus)}`}>
              {tideData.tideStatus}
            </span>
          </div>
        )}

        {current.windSpeed !== undefined && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-sky-300" />
              <span className="text-sky-200/60 text-sm">Wind</span>
            </div>
            <span className="text-white font-light">
              {current.windSpeed} mph {getWindDirection(current.windDirection)}
            </span>
          </div>
        )}

        {current.windGusts !== undefined && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span className="text-sky-200/60 text-sm">Gusts</span>
            <span className="text-white font-light">{current.windGusts} mph</span>
          </div>
        )}

        {current.pressure && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-300" />
              <span className="text-sky-200/60 text-sm">Pressure</span>
            </div>
            <span className="text-white font-light">{current.pressure} hPa</span>
          </div>
        )}

        {current.humidity !== undefined && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-300" />
              <span className="text-sky-200/60 text-sm">Humidity</span>
            </div>
            <span className="text-white font-light">{current.humidity}%</span>
          </div>
        )}
      </div>

      <CardFooter
        source={response.source}
        sourceTimestamp={response.sourceTimestamp}
        retrievedAt={response.retrievedAt}
        lat={response.lat}
        lon={response.lon}
      />
    </div>
  );
}