import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import TimeDisplay from '@/components/exuma/TimeDisplay';
import WeatherCard from '@/components/exuma/WeatherCard';
import WeatherForecastCard from '@/components/exuma/WeatherForecastCard';
import TideCard from '@/components/exuma/TideCard';
import AstronomyCard from '@/components/exuma/AstronomyCard';
import FunFactCard from '@/components/exuma/FunFactCard';
import OceanRealityCard from '@/components/exuma/OceanRealityCard';
import SunDaylightCard from '@/components/exuma/SunDaylightCard';
import MoonCard from '@/components/exuma/MoonCard';
import SkySpaceCard from '@/components/exuma/SkySpaceCard';

import IslandContextCard from '@/components/exuma/IslandContextCard';
import LifestyleCard from '@/components/exuma/LifestyleCard';
import SystemStatusCard from '@/components/exuma/SystemStatusCard';

export default function ExumaDisplay() {
  const [weather, setWeather] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [tides, setTides] = useState(null);
  const [astronomy, setAstronomy] = useState(null);
  const [oceanData, setOceanData] = useState(null);
  const [sunData, setSunData] = useState(null);
  const [moonData, setMoonData] = useState(null);
  const [skyData, setSkyData] = useState(null);
  const [contextData, setContextData] = useState(null);
  const [lifestyleData, setLifestyleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Call backend functions for reliable API data
      const [tideData, weatherData, astronomyData] = await Promise.all([
        base44.functions.invoke('getTideData', {}),
        base44.functions.invoke('getWeatherData', {}),
        base44.functions.invoke('getAstronomyData', {})
      ]);

      setWeather(weatherData.weather);
      setForecastData(weatherData.forecastData);
      setOceanData(weatherData.oceanData);
      setTides(tideData);
      setSunData(astronomyData.sunData);
      setAstronomy(astronomyData.astronomy);
      setMoonData(astronomyData.moonData);
      setSkyData(astronomyData.skyData);
      setContextData(astronomyData.contextData);
      setLifestyleData(astronomyData.lifestyleData);
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

  // Night mode detection
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-8 lg:p-12">
        {/* Header with time */}
        <header className="mb-8 md:mb-12">
          <TimeDisplay />
        </header>

        {/* Main data grid */}
        <main className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {/* Weather Forecast - Full Width */}
            <div className="lg:col-span-3">
              <WeatherForecastCard forecastData={forecastData} isLoading={isLoading} />
            </div>
            
            {/* Ocean & Tides */}
            <OceanRealityCard oceanData={oceanData} isLoading={isLoading} />
            <TideCard tides={tides} isLoading={isLoading} />

            {/* Astronomy & Sun */}
            <AstronomyCard astronomy={astronomy} isLoading={isLoading} />
            <div className="lg:col-span-2">
              <SunDaylightCard sunData={sunData} isLoading={isLoading} />
            </div>

            {/* Row 3: Moon & sky */}
            <MoonCard moonData={moonData} isLoading={isLoading} />
            <div className="lg:col-span-2">
              <SkySpaceCard skyData={skyData} isLoading={isLoading} />
            </div>
            <IslandContextCard contextData={contextData} isLoading={isLoading} />

            {/* Row 4: Lifestyle & fun fact */}
            <LifestyleCard lifestyleData={lifestyleData} isLoading={isLoading} />
            <div className="md:col-span-2 lg:col-span-2">
              <FunFactCard />
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