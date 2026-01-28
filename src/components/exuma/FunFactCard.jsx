import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import CardFooter from './CardFooter';

export default function FunFactCard({ response, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-amber-500/10 via-white/10 to-cyan-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="h-20 bg-white/20 rounded"></div>
      </div>
    );
  }

  if (!response || !response.ok) {
    return (
      <div className="bg-red-900/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-red-500/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-200/80 uppercase tracking-widest text-xs font-medium">
            Fun Fact - Error
          </h3>
        </div>
        <p className="text-red-200 text-sm">{response?.error?.message || 'Failed to load fun fact'}</p>
        <CardFooter
          source={response?.source}
          retrievedAt={response?.retrievedAt}
        />
      </div>
    );
  }

  const factData = response.data;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-white/10 to-cyan-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:border-amber-300/30 transition-all duration-500">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Island Discovery
        </h3>
      </div>

      <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed mb-4">
        "{factData.fact}"
      </p>

      <p className="text-sky-200/40 text-xs">
        {factData.rotationSchedule} • Fact {factData.factIndex + 1} of {factData.totalFacts}
      </p>

      <CardFooter
        source={response.source}
        retrievedAt={response.retrievedAt}
      />
    </div>
  );
}