import React from 'react';
import { Waves, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import CardFooter from './CardFooter';

export default function TideCard({ response, isLoading }) {
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

  if (!response || !response.ok) {
    return (
      <div className="bg-red-900/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-red-500/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-200/80 uppercase tracking-widest text-xs font-medium">
            Tides - Error
          </h3>
        </div>
        <p className="text-red-200 text-sm">{response?.error?.message || 'Failed to load tide data'}</p>
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

  const tides = response.data;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Waves className="w-5 h-5 text-cyan-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Tides
        </h3>
      </div>

      <div className="space-y-3">
        {tides.tideStatus && (
          <div className="p-3 bg-white/5 rounded-xl text-center mb-4">
            <span className="text-sky-200/60 text-xs uppercase tracking-wider">Tide Now: </span>
            <span className="text-white font-medium">{tides.tideStatus}</span>
          </div>
        )}

        <p className="text-sky-200/60 text-xs uppercase tracking-wider">High Tides</p>
        {tides.highTides && tides.highTides.map((tide, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-emerald-400" />
              <span className="text-white text-sm font-light">{tide.time}</span>
            </div>
            <span className="text-emerald-300 text-sm">{tide.height}</span>
          </div>
        ))}

        <p className="text-sky-200/60 text-xs uppercase tracking-wider mt-4">Low Tides</p>
        {tides.lowTides && tides.lowTides.map((tide, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-sky-500/10 rounded-xl border border-sky-500/20">
            <div className="flex items-center gap-2">
              <ArrowDown className="w-4 h-4 text-sky-400" />
              <span className="text-white text-sm font-light">{tide.time}</span>
            </div>
            <span className="text-sky-300 text-sm">{tide.height}</span>
          </div>
        ))}
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