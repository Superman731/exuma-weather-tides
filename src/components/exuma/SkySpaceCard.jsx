import React from 'react';
import { Star, Sparkles, Satellite, AlertCircle } from 'lucide-react';
import CardFooter from './CardFooter';

export default function SkySpaceCard({ response, isLoading }) {
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

  if (!response || !response.ok) {
    return (
      <div className="bg-red-900/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-red-500/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-200/80 uppercase tracking-widest text-xs font-medium">
            Sky & Space - Error
          </h3>
        </div>
        <p className="text-red-200 text-sm">{response?.error?.message || 'Failed to load sky data'}</p>
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

  const skyData = response.data;

  return (
    <div className="bg-gradient-to-br from-purple-500/10 via-white/10 to-pink-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-purple-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Sky & Space
        </h3>
      </div>

      <div className="space-y-4">
        {skyData?.visiblePlanets && skyData.visiblePlanets.length > 0 && (
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-2">Visible Tonight</p>
            <p className="text-white font-light">{skyData.visiblePlanets.join(', ')}</p>
          </div>
        )}

        {skyData?.constellations && skyData.constellations.length > 0 && (
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-2">Constellations</p>
            <p className="text-white font-light">{skyData.constellations.join(', ')}</p>
          </div>
        )}

        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl border border-purple-500/20">
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-3">Night Sky Visibility</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sky-200/70 text-sm">Milky Way</span>
              <span className={`text-sm font-medium ${
                skyData?.milkyWayVisible ? 'text-purple-300' : 'text-gray-400'
              }`}>
                {skyData?.milkyWayVisible ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sky-200/70 text-sm">Star Visibility</span>
              <span className={`text-sm font-medium ${
                skyData?.skyQuality === 'Excellent' ? 'text-purple-300' :
                skyData?.skyQuality === 'Good' ? 'text-indigo-300' :
                skyData?.skyQuality === 'Fair' ? 'text-sky-300' : 'text-gray-400'
              }`}>
                {skyData?.skyQuality || 'Moderate'}
              </span>
            </div>
          </div>
        </div>

        {skyData?.meteorShower && (
          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <p className="text-amber-200 font-medium">Meteor Shower</p>
            </div>
            <p className="text-amber-100/80 text-sm">{skyData.meteorShower}</p>
          </div>
        )}

        {skyData?.satelliteDensity && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-cyan-400" />
              <span className="text-sky-200/70 text-sm">Satellite Passes</span>
            </div>
            <span className="text-white font-light">{skyData.satelliteDensity}</span>
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