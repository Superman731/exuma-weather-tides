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
import DebugPanel from '@/components/exuma/DebugPanel';
import SkySpaceCard from '@/components/exuma/SkySpaceCard';
import BackendProbe from '@/components/exuma/BackendProbe';

export default function ExumaDisplay() {
  const [showProbe, setShowProbe] = useState(true);
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
      // Healthcheck first - capture raw response
      const healthStart = Date.now();
      const healthStartTime = new Date().toISOString();
      try {
        const healthData = await base44.functions.invoke('getHealthcheck', {});
        const healthEnd = Date.now();
        calls.push({
          functionName: 'getHealthcheck',
          startTime: healthStartTime,
          endTime: new Date().toISOString(),
          duration: healthEnd - healthStart,
          ok: healthData?.ok || false,
          source: healthData?.source || 'unknown',
          lat: healthData?.lat,
          lon: healthData?.lon,
          error: healthData?.error,
          responsePreview: JSON.stringify(healthData).substring(0, 300),
          rawResponse: typeof healthData === 'string' ? healthData : JSON.stringify(healthData)
        });
      } catch (error) {
        calls.push({
          functionName: 'getHealthcheck',
          startTime: healthStartTime,
          endTime: new Date().toISOString(),
          duration: Date.now() - healthStart,
          ok: false,
          source: 'Error',
          error: { 
            message: error.message || 'Exception', 
            details: error.stack || JSON.stringify(error),
            rawError: String(error)
          },
          responsePreview: '',
          rawResponse: String(error)
        });
      }

      // Test External Fetch
      const testStart = Date.now();
      const testStartTime = new Date().toISOString();
      try {
        const testData = await base44.functions.invoke('testExternalFetch', {});
        const testEnd = Date.now();
        calls.push({
          functionName: 'testExternalFetch',
          startTime: testStartTime,
          endTime: new Date().toISOString(),
          duration: testEnd - testStart,
          ok: testData.ok,
          source: testData.source,
          lat: testData.lat,
          lon: testData.lon,
          error: testData.error,
          responsePreview: JSON.stringify(testData).substring(0, 300)
        });
      } catch (error) {
        calls.push({
          functionName: 'testExternalFetch',
          startTime: testStartTime,
          endTime: new Date().toISOString(),
          duration: Date.now() - testStart,
          ok: false,
          source: 'Error',
          error: { message: 'Exception', details: error.message },
          responsePreview: ''
        });
      }

      // Weather
      const weatherStart = Date.now();
      const weatherStartTime = new Date().toISOString();
      try {
        const weatherData = await base44.functions.invoke('getWeatherData', {});
        const weatherEnd = Date.now();
        setWeatherResponse(weatherData);
        calls.push({
          functionName: 'getWeatherData',
          startTime: weatherStartTime,
          endTime: new Date().toISOString(),
          duration: weatherEnd - weatherStart,
          ok: weatherData.ok,
          source: weatherData.source,
          lat: weatherData.lat,
          lon: weatherData.lon,
          error: weatherData.error,
          responsePreview: JSON.stringify(weatherData).substring(0, 300)
        });
      } catch (error) {
        calls.push({
          functionName: 'getWeatherData',
          startTime: weatherStartTime,
          endTime: new Date().toISOString(),
          duration: Date.now() - weatherStart,
          ok: false,
          source: 'Error',
          error: { message: 'Exception', details: error.message },
          responsePreview: ''
        });
      }

      // Tides
      const tideStart = Date.now();
      const tideStartTime = new Date().toISOString();
      try {
        const tideData = await base44.functions.invoke('getTideData', {});
        const tideEnd = Date.now();
        setTideResponse(tideData);
        calls.push({
          functionName: 'getTideData',
          startTime: tideStartTime,
          endTime: new Date().toISOString(),
          duration: tideEnd - tideStart,
          ok: tideData.ok,
          source: tideData.source,
          lat: tideData.lat,
          lon: tideData.lon,
          error: tideData.error,
          responsePreview: JSON.stringify(tideData).substring(0, 300)
        });
      } catch (error) {
        calls.push({
          functionName: 'getTideData',
          startTime: tideStartTime,
          endTime: new Date().toISOString(),
          duration: Date.now() - tideStart,
          ok: false,
          source: 'Error',
          error: { message: 'Exception', details: error.message },
          responsePreview: ''
        });
      }

      // Astronomy
      const astroStart = Date.now();
      const astroStartTime = new Date().toISOString();
      try {
        const astroData = await base44.functions.invoke('getAstronomyData', {});
        const astroEnd = Date.now();
        setAstronomyResponse(astroData);
        calls.push({
          functionName: 'getAstronomyData',
          startTime: astroStartTime,
          endTime: new Date().toISOString(),
          duration: astroEnd - astroStart,
          ok: astroData.ok,
          source: astroData.source,
          lat: astroData.lat,
          lon: astroData.lon,
          error: astroData.error,
          responsePreview: JSON.stringify(astroData).substring(0, 300)
        });
      } catch (error) {
        calls.push({
          functionName: 'getAstronomyData',
          startTime: astroStartTime,
          endTime: new Date().toISOString(),
          duration: Date.now() - astroStart,
          ok: false,
          source: 'Error',
          error: { message: 'Exception', details: error.message },
          responsePreview: ''
        });
      }

      // Moon
      const moonStart = Date.now();
      const moonStartTime = new Date().toISOString();
      try {
        const moonData = await base44.functions.invoke('getMoonData', {});
        const moonEnd = Date.now();
        setMoonResponse(moonData);
        calls.push({
          functionName: 'getMoonData',
          startTime: moonStartTime,
          endTime: new Date().toISOString(),
          duration: moonEnd - moonStart,
          ok: moonData.ok,
          source: moonData.source,
          lat: moonData.lat,
          lon: moonData.lon,
          error: moonData.error,
          responsePreview: JSON.stringify(moonData).substring(0, 300)
        });
      } catch (error) {
        calls.push({
          functionName: 'getMoonData',
          startTime: moonStartTime,
          endTime: new Date().toISOString(),
          duration: Date.now() - moonStart,
          ok: false,
          source: 'Error',
          error: { message: 'Exception', details: error.message },
          responsePreview: ''
        });
      }

      // Fun Fact
      const factStart = Date.now();
      const factStartTime = new Date().toISOString();
      try {
        const factData = await base44.functions.invoke('getFunFact', {});
        const factEnd = Date.now();
        setFunFactResponse(factData);
        calls.push({
          functionName: 'getFunFact',
          startTime: factStartTime,
          endTime: new Date().toISOString(),
          duration: factEnd - factStart,
          ok: factData.ok,
          source: factData.source,
          lat: factData.lat,
          lon: factData.lon,
          error: factData.error,
          responsePreview: JSON.stringify(factData).substring(0, 300)
        });
      } catch (error) {
        calls.push({
          functionName: 'getFunFact',
          startTime: factStartTime,
          endTime: new Date().toISOString(),
          duration: Date.now() - factStart,
          ok: false,
          source: 'Error',
          error: { message: 'Exception', details: error.message },
          responsePreview: ''
        });
      }

      // Sky & Space
      const skyStart = Date.now();
      const skyStartTime = new Date().toISOString();
      try {
        const skyData = await base44.functions.invoke('getSkyData', {});
        const skyEnd = Date.now();
        setSkyResponse(skyData);
        calls.push({
          functionName: 'getSkyData',
          startTime: skyStartTime,
          endTime: new Date().toISOString(),
          duration: skyEnd - skyStart,
          ok: skyData.ok,
          source: skyData.source,
          lat: skyData.lat,
          lon: skyData.lon,
          error: skyData.error,
          responsePreview: JSON.stringify(skyData).substring(0, 300)
        });
      } catch (error) {
        calls.push({
          functionName: 'getSkyData',
          startTime: skyStartTime,
          endTime: new Date().toISOString(),
          duration: Date.now() - skyStart,
          ok: false,
          source: 'Error',
          error: { message: 'Exception', details: error.message },
          responsePreview: ''
        });
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
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

      <DebugPanel apiCalls={apiCalls} />
      {showProbe && <BackendProbe />}
    </div>
  );
}