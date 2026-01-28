import React from 'react';
import { Flame, Waves, Quote } from 'lucide-react';

const islandQuotes = [
  "Island time is the best time.",
  "Salt in the air, sand in my hair.",
  "Paradise found.",
  "Where the ocean meets the sky.",
  "Life is better in flip flops.",
  "Catch flights, not feelings... but catch the sunset too.",
  "Happiness comes in waves.",
  "Good vibes happen on the tides.",
  "Sunsets are proof that endings can be beautiful.",
  "Just another day in paradise.",
  "Ocean breeze puts the mind at ease.",
  "The ocean is calling and I must go.",
  "Life's a beach, enjoy the waves.",
  "Sandy toes and sun-kissed nose.",
  "Keep calm and beach on."
];

export default function LifestyleCard({ lifestyleData, isLoading }) {
  const [quoteIndex] = React.useState(() => Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % islandQuotes.length);

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-500/10 via-white/10 to-rose-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Quote className="w-5 h-5 text-pink-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Island Life
        </h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-xl italic text-sky-100/80">
          "{islandQuotes[quoteIndex]}"
        </div>

        <div className="grid grid-cols-2 gap-4">
          {lifestyleData?.fireWeather && (
            <div className={`p-4 rounded-xl border ${
              lifestyleData.fireWeather === 'Perfect' 
                ? 'bg-orange-500/10 border-orange-500/20' 
                : 'bg-white/5 border-white/10'
            }`}>
              <Flame className={`w-5 h-5 mb-2 ${
                lifestyleData.fireWeather === 'Perfect' ? 'text-orange-400' : 'text-gray-400'
              }`} />
              <p className="text-xs text-sky-200/60 uppercase tracking-wider mb-1">Fire Tonight</p>
              <p className={`text-sm font-medium ${
                lifestyleData.fireWeather === 'Perfect' ? 'text-orange-300' : 'text-white/70'
              }`}>
                {lifestyleData.fireWeather}
              </p>
            </div>
          )}

          {lifestyleData?.swimWeather && (
            <div className={`p-4 rounded-xl border ${
              lifestyleData.swimWeather === 'Perfect' 
                ? 'bg-cyan-500/10 border-cyan-500/20' 
                : 'bg-white/5 border-white/10'
            }`}>
              <Waves className={`w-5 h-5 mb-2 ${
                lifestyleData.swimWeather === 'Perfect' ? 'text-cyan-400' : 'text-gray-400'
              }`} />
              <p className="text-xs text-sky-200/60 uppercase tracking-wider mb-1">Swim Tonight</p>
              <p className={`text-sm font-medium ${
                lifestyleData.swimWeather === 'Perfect' ? 'text-cyan-300' : 'text-white/70'
              }`}>
                {lifestyleData.swimWeather}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}