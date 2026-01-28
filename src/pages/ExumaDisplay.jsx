import React, { useState, useEffect } from 'react';
import { callFunction } from '@/components/exuma/functionPathResolver';
import TimeDisplay from '@/components/exuma/TimeDisplay';
import StatusIndicator from '@/components/exuma/StatusIndicator';
import WeatherForecastCard from '@/components/exuma/WeatherForecastCard';
import TideCard from '@/components/exuma/TideCard';
import AstronomyCard from '@/components/exuma/AstronomyCard';
import FunFactCard from '@/components/exuma/FunFactCard';
import OceanRealityCard from '@/components/exuma/OceanRealityCard';
import SunDaylightCard from '@/components/exuma/SunDaylightCard';
import MoonCard from '@/components/exuma/MoonCard';
import SystemStatusCard from '@/components/exuma/SystemStatusCard';
import DebugPanel from '@/components/exuma/DebugPanel';
import SkySpaceCard from '@/components/exuma/SkySpaceCard';
import BackendProbe from '@/components/exuma/BackendProbe';

export default function ExumaDisplay() {
  const [debugMode, setDebugMode] = useState(false);
  const [showProbe, setShowProbe] = useState(false);
  const [weatherResponse, setWeatherResponse] = useState(null);
  const [tideResponse, setTideResponse] = useState(null);
  const [astronomyResponse, setAstronomyResponse] = useState(null);
  const [moonResponse, setMoonResponse] = useState(null);
  const [funFactResponse, setFunFactResponse] = useState(null);
  const [skyResponse, setSkyResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [apiCalls, setApiCalls] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    const calls = [];
    
    try {
      // Weather
      const weatherStart = Date.now();
      const weatherStartTime = new Date().toISOString();
      const weatherData = await callFunction('ping?action=weather');
      setWeatherResponse(weatherData);
      calls.push({
        functionName: 'weather',
        startTime: weatherStartTime,
        endTime: new Date().toISOString(),
        duration: Date.now() - weatherStart,
        ok: weatherData.ok,
        source: weatherData.source,
        lat: weatherData.lat,
        lon: weatherData.lon,
        error: weatherData.error,
        responsePreview: JSON.stringify(weatherData).substring(0, 300)
      });

      // Tides
      const tideStart = Date.now();
      const tideStartTime = new Date().toISOString();
      const tideData = await callFunction('ping?action=tides');
      setTideResponse(tideData);
      calls.push({
        functionName: 'tides',
        startTime: tideStartTime,
        endTime: new Date().toISOString(),
        duration: Date.now() - tideStart,
        ok: tideData.ok,
        source: tideData.source,
        lat: tideData.lat,
        lon: tideData.lon,
        error: tideData.error,
        responsePreview: JSON.stringify(tideData).substring(0, 300)
      });

      // Astronomy
      const astroStart = Date.now();
      const astroStartTime = new Date().toISOString();
      const astroData = await callFunction('ping?action=astronomy');
      setAstronomyResponse(astroData);
      calls.push({
        functionName: 'astronomy',
        startTime: astroStartTime,
        endTime: new Date().toISOString(),
        duration: Date.now() - astroStart,
        ok: astroData.ok,
        source: astroData.source,
        lat: astroData.lat,
        lon: astroData.lon,
        error: astroData.error,
        responsePreview: JSON.stringify(astroData).substring(0, 300)
      });

      // Moon
      const moonStart = Date.now();
      const moonStartTime = new Date().toISOString();
      const moonData = await callFunction('ping?action=moon');
      setMoonResponse(moonData);
      calls.push({
        functionName: 'moon',
        startTime: moonStartTime,
        endTime: new Date().toISOString(),
        duration: Date.now() - moonStart,
        ok: moonData.ok,
        source: moonData.source,
        lat: moonData.lat,
        lon: moonData.lon,
        error: moonData.error,
        responsePreview: JSON.stringify(moonData).substring(0, 300)
      });

      // Fun Fact
      const factStart = Date.now();
      const factStartTime = new Date().toISOString();
      const factData = await callFunction('ping?action=funfact');
      setFunFactResponse(factData);
      calls.push({
        functionName: 'funfact',
        startTime: factStartTime,
        endTime: new Date().toISOString(),
        duration: Date.now() - factStart,
        ok: factData.ok,
        source: factData.source,
        lat: factData.lat,
        lon: factData.lon,
        error: factData.error,
        responsePreview: JSON.stringify(factData).substring(0, 300)
      });

      // Sky & Space
      const skyStart = Date.now();
      const skyStartTime = new Date().toISOString();
      const skyData = await callFunction('ping?action=sky');
      setSkyResponse(skyData);
      calls.push({
        functionName: 'sky',
        startTime: skyStartTime,
        endTime: new Date().toISOString(),
        duration: Date.now() - skyStart,
        ok: skyData.ok,
        source: skyData.source,
        lat: skyData.lat,
        lon: skyData.lon,
        error: skyData.error,
        responsePreview: JSON.stringify(skyData).substring(0, 300)
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set error responses for all cards so they show gracefully
      if (!weatherResponse) setWeatherResponse({ ok: false, error: { message: error.message } });
      if (!tideResponse) setTideResponse({ ok: false, error: { message: error.message } });
      if (!astronomyResponse) setAstronomyResponse({ ok: false, error: { message: error.message } });
      if (!moonResponse) setMoonResponse({ ok: false, error: { message: error.message } });
      if (!funFactResponse) setFunFactResponse({ ok: false, error: { message: error.message } });
      if (!skyResponse) setSkyResponse({ ok: false, error: { message: error.message } });
    } finally {
      setIsLoading(false);
      setApiCalls(calls);
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

      <StatusIndicator />
      
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

      {debugMode && (
        <>
          <DebugPanel apiCalls={apiCalls} />
          {showProbe && <BackendProbe />}
          <button
            onClick={() => setDebugMode(false)}
            className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
          >
            Hide Debug
          </button>
        </>
      )}
      
      {!debugMode && (
        <button
          onClick={() => setDebugMode(true)}
          className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm opacity-50 hover:opacity-100"
        >
          Debug
        </button>
      )}
    </div>
  );
}