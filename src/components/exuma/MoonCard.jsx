import React from 'react';
import { Moon, Sparkles, AlertCircle } from 'lucide-react';
import CardFooter from './CardFooter';

const moonEmojis = {
  'New Moon': '🌑',
  'Waxing Crescent': '🌒',
  'First Quarter': '🌓',
  'Waxing Gibbous': '🌔',
  'Full Moon': '🌕',
  'Waning Gibbous': '🌖',
  'Last Quarter': '🌗',
  'Waning Crescent': '🌘'
};

export default function MoonCard({ response, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-24 mb-4"></div>
        <div className="space-y-4">
          <div className="h-24 bg-white/20 rounded"></div>
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
            Moon - Error
          </h3>
        </div>
        <p className="text-red-200 text-sm">{response?.error?.message || 'Failed to load moon data'}</p>
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

  const moonData = response.data;
  const moonEmoji = moonEmojis[moonData.phase] || '🌙';

  // Calculate stargazing suitability
  const illumination = moonData.illumination || 0;
  let stargazingQuality = '';
  let stargazingColor = '';
  
  if (illumination < 25) {
    stargazingQuality = 'Excellent - Dark skies';
    stargazingColor = 'text-green-400';
  } else if (illumination < 50) {
    stargazingQuality = 'Good - Moderate light';
    stargazingColor = 'text-yellow-400';
  } else if (illumination < 75) {
    stargazingQuality = 'Fair - Bright moon';
    stargazingColor = 'text-orange-400';
  } else {
    stargazingQuality = 'Poor - Very bright';
    stargazingColor = 'text-red-400';
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Moon className="w-5 h-5 text-indigo-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Moon
        </h3>
      </div>

      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{moonEmoji}</div>
        <p className="text-white text-xl font-light mb-1">{moonData.phase || 'Unknown'}</p>
        <p className="text-sky-100/60 text-sm">{illumination}% illuminated</p>
      </div>

      {moonData.note && (
        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 mb-4">
          <p className="text-amber-200/80 text-xs">{moonData.note}</p>
        </div>
      )}

      <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-300" />
          <p className="text-sky-200/60 text-xs uppercase tracking-wider">Stargazing</p>
        </div>
        <p className={`text-sm font-medium ${stargazingColor}`}>
          {stargazingQuality}
        </p>
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