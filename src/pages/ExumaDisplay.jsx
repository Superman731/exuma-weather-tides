import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import TimeDisplay from '@/components/exuma/TimeDisplay';
import WeatherCard from '@/components/exuma/WeatherCard';
import TideCard from '@/components/exuma/TideCard';
import AstronomyCard from '@/components/exuma/AstronomyCard';
import FunFactCard from '@/components/exuma/FunFactCard';
import { RefreshCw } from 'lucide-react';

export default function ExumaDisplay() {
  const [weather, setWeather] = useState(null);
  const [tides, setTides] = useState(null);
  const [astronomy, setAstronomy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current real-time data for Exuma, Bahamas (coordinates: 23.5° N, 75.8° W) for today's date. I need:

1. Current weather: temperature in Fahrenheit, condition (sunny/cloudy/rain etc), wind speed in mph, humidity percentage
2. Today's tide times: next high tide time and low tide time in 12-hour format (e.g., "6:42 AM"), include approximate heights
3. Astronomy: today's sunrise time, sunset time, and current moon phase name

Provide accurate, current data for the Exuma region. Use realistic typical values for Exuma if exact real-time data isn't available.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            weather: {
              type: "object",
              properties: {
                temperature: { type: "number" },
                condition: { type: "string" },
                wind: { type: "number" },
                humidity: { type: "number" }
              }
            },
            tides: {
              type: "object",
              properties: {
                highTide: { type: "string" },
                highTideHeight: { type: "string" },
                lowTide: { type: "string" },
                lowTideHeight: { type: "string" }
              }
            },
            astronomy: {
              type: "object",
              properties: {
                sunrise: { type: "string" },
                sunset: { type: "string" },
                moonPhase: { type: "string" },
                nextEvent: { type: "string" }
              }
            }
          }
        }
      });

      setWeather(result.weather);
      setTides(result.tides);
      setAstronomy(result.astronomy);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 minutes
    const refreshInterval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-6 md:p-12 flex flex-col">
        {/* Header with time */}
        <header className="mb-12 md:mb-16">
          <TimeDisplay />
        </header>

        {/* Data grid */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
          <WeatherCard weather={weather} isLoading={isLoading} />
          <TideCard tides={tides} isLoading={isLoading} />
          <AstronomyCard astronomy={astronomy} isLoading={isLoading} />
          <div className="md:col-span-2 lg:col-span-3">
            <FunFactCard />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 flex items-center justify-center gap-4 text-sky-200/40 text-sm">
          {lastUpdated && (
            <span>
              Last updated: {lastUpdated.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </span>
          )}
          <button 
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </footer>
      </div>
    </div>
  );
}