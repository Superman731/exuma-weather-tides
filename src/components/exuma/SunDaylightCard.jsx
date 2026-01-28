import React from 'react';
import { Sun, Sunrise, Sunset, AlertCircle } from 'lucide-react';
import CardFooter from './CardFooter';

export default function SunDaylightCard({ response, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-white/20 rounded"></div>
          <div className="h-16 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!response || !response.ok) {
    const error = response?.error || {};
    return (
      <div className="bg-red-900/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-red-500/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-200/80 uppercase tracking-widest text-xs font-medium">
            Sun & Daylight - Error
          </h3>
        </div>
        <div className="space-y-2 text-xs font-mono">
          <p className="text-red-200">Status: {error.status || 'Unknown'}</p>
          {error.url && <p className="text-red-200">URL: {error.url}</p>}
          <p className="text-red-300">{error.message || 'Failed to load sun data'}</p>
          {error.details && (
            <pre className="text-red-300 text-xs mt-2 overflow-x-auto whitespace-pre-wrap break-words max-h-32">
              {error.details.substring(0, 300)}
            </pre>
          )}
        </div>
        <CardFooter
          source={response?.source}
          retrievedAt={response?.retrievedAt}
          lat={response?.lat}
          lon={response?.lon}
        />
      </div>
    );
  }

  const sunData = response.data;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Sun className="w-5 h-5 text-amber-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Sun & Daylight
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-2xl">
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-2">Daylight</p>
          <p className="text-white text-2xl font-light">{sunData.daylightLength || '--'}</p>
        </div>

        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-2">Golden Hour</p>
          <p className="text-white text-sm font-light">{sunData.civilTwilight?.end || '--'}</p>
        </div>

        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-2">Blue Hour</p>
          <p className="text-white text-sm font-light">{sunData.nauticalTwilight?.begin || '--'}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-3">Twilight</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-400/60"></div>
          <span className="text-sky-200/60 text-xs flex-1">Civil</span>
          <span className="text-white text-sm font-light">
            {sunData.civilTwilight?.end || '--'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-400/60"></div>
          <span className="text-sky-200/60 text-xs flex-1">Nautical</span>
          <span className="text-white text-sm font-light">
            {sunData.nauticalTwilight?.end || '--'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-400/60"></div>
          <span className="text-sky-200/60 text-xs flex-1">Astronomical</span>
          <span className="text-white text-sm font-light">
            {sunData.astronomicalTwilight?.end || '--'}
          </span>
        </div>
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