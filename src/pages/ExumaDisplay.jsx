import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import TimeDisplay from '@/components/exuma/TimeDisplay';
import WeatherForecastCard from '@/components/exuma/WeatherForecastCard';
import TideCard from '@/components/exuma/TideCard';
import AstronomyCard from '@/components/exuma/AstronomyCard';
import FunFactCard from '@/components/exuma/FunFactCard';
import OceanRealityCard from '@/components/exuma/OceanRealityCard';
import SunDaylightCard from '@/components/exuma/SunDaylightCard';
import MoonCard from '@/components/exuma/MoonCard';
import SystemStatusCard from '@/components/exuma/SystemStatusCard';
import SkySpaceCard from '@/components/exuma/SkySpaceCard';

export default function ExumaDisplay() {
  const [weatherResponse, setWeatherResponse] = useState(null);
  const [tideResponse, setTideResponse] = useState(null);
  const [astronomyResponse, setAstronomyResponse] = useState(null);
  const [moonResponse, setMoonResponse] = useState(null);
  const [funFactResponse, setFunFactResponse] = useState(null);
  const [skyResponse, setSkyResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Weather
      const weatherResult = await base44.functions.invoke('ping', { action: 'weather' });
      setWeatherResponse(weatherResult.data);

      // Tides
      const tideResult = await base44.functions.invoke('ping', { action: 'tides' });
      setTideResponse(tideResult.data);

      // Astronomy
      const astroResult = await base44.functions.invoke('ping', { action: 'astronomy' });
      setAstronomyResponse(astroResult.data);

      // Moon
      const moonResult = await base44.functions.invoke('ping', { action: 'moon' });
      setMoonResponse(moonResult.data);

      // Fun Fact
      const factResult = await base44.functions.invoke('ping', { action: 'funfact' });
      setFunFactResponse(factResult.data);

      // Sky & Space
      const skyResult = await base44.functions.invoke('ping', { action: 'sky' });
      setSkyResponse(skyResult.data);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set error responses
      const errorResponse = { ok: false, error: { message: error.message || 'Failed to load' } };
      if (!weatherResponse) setWeatherResponse(errorResponse);
      if (!tideResponse) setTideResponse(errorResponse);
      if (!astronomyResponse) setAstronomyResponse(errorResponse);
      if (!moonResponse) setMoonResponse(errorResponse);
      if (!funFactResponse) setFunFactResponse(errorResponse);
      if (!skyResponse) setSkyResponse(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const refreshInterval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const checkNightMode = () => {
      const hour = new Date().getHours();
      setIsDark(hour < 6 || hour >= 19);
    };
    checkNightMode();
    const interval = setInterval(checkNightMode, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br relative overflow-hidden transition-all duration-1000 ${
        isDark 
          ? 'from-slate-950 via-indigo-950 to-slate-950' 
          : 'from-slate-900 via-sky-950 to-slate-900'
      }`}
      style={{ opacity: isDark ? 0.92 : 1 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 min-h-screen p-4 md:p-8 lg:p-12">
        <header className="mb-8 md:mb-12">
          <TimeDisplay />
        </header>

        <main className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <div className="lg:col-span-3">
              <WeatherForecastCard 
                response={weatherResponse} 
                isLoading={isLoading} 
              />
            </div>
            
            <OceanRealityCard 
              response={weatherResponse} 
              tideResponse={tideResponse}
              isLoading={isLoading} 
            />
            
            <TideCard 
              response={tideResponse} 
              isLoading={isLoading} 
            />

            <AstronomyCard 
              response={astronomyResponse} 
              isLoading={isLoading} 
            />
            
            <div className="lg:col-span-2">
              <SunDaylightCard 
                response={astronomyResponse} 
                isLoading={isLoading} 
              />
            </div>

            <MoonCard 
              response={moonResponse} 
              isLoading={isLoading} 
            />
            
            <SkySpaceCard 
              response={skyResponse} 
              isLoading={isLoading} 
            />
            
            <div className="md:col-span-2 lg:col-span-2">
              <FunFactCard 
                response={funFactResponse} 
                isLoading={isLoading} 
              />
            </div>
            
            <SystemStatusCard 
              lastUpdated={lastUpdated} 
              onRefresh={fetchData} 
              isLoading={isLoading} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}