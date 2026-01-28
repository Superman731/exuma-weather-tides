import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import TimeDisplay from '@/components/exuma/TimeDisplay';
import WeatherCard from '@/components/exuma/WeatherCard';
import TideCard from '@/components/exuma/TideCard';
import AstronomyCard from '@/components/exuma/AstronomyCard';
import FunFactCard from '@/components/exuma/FunFactCard';
import OceanRealityCard from '@/components/exuma/OceanRealityCard';
import SunDaylightCard from '@/components/exuma/SunDaylightCard';
import MoonCard from '@/components/exuma/MoonCard';
import SkySpaceCard from '@/components/exuma/SkySpaceCard';
import EnhancedWeatherCard from '@/components/exuma/EnhancedWeatherCard';
import IslandContextCard from '@/components/exuma/IslandContextCard';
import LifestyleCard from '@/components/exuma/LifestyleCard';
import SystemStatusCard from '@/components/exuma/SystemStatusCard';

export default function ExumaDisplay() {
  const [weather, setWeather] = useState(null);
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
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Get comprehensive ACCURATE real-time data for Georgetown, Exuma, Bahamas (23.5° N, 75.8° W) for TODAY ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. 

Search authoritative sources like weather.com, NOAA, timeanddate.com, etc.

Provide ALL of the following data:

WEATHER:
- Current temp (°F), feels like temp, condition, wind speed (mph), wind gusts (mph), wind direction (e.g., "NE"), humidity %, cloud cover %, rain chance %, rain forecast by hour

OCEAN:
- Tide status now (Rising/Falling/Slack)
- Water temperature (°F) if available
- Barometric pressure (inHg) and trend (rising/falling/steady)
- Boat-safe hours today (e.g., "6 AM - 6 PM")

TIDES:
- Today's HIGH tide time (12-hour format) with height
- Today's LOW tide time (12-hour format) with height

SUN & DAYLIGHT:
- Sunrise and sunset times
- Daylight length (e.g., "11h 3m")
- Golden hour times (evening)
- UV index (0-11+)
- Solar noon time
- Civil, nautical, astronomical twilight times

MOON:
- Moon phase name
- Moon illumination percentage (0-100)
- Moonrise and moonset times

SKY & SPACE:
- Visible planets tonight (list names)
- Best stargazing window (time range)
- Featured constellation tonight
- Milky Way visibility (Excellent/Good/Fair/Poor)
- Any meteor showers (name and peak info)
- Satellite pass density (High/Moderate/Low)

ISLAND CONTEXT:
- Exact coordinates of Tropic of Cancer Beach
- Seasonal marker (days until solstice/equinox)
- Sea state description (calm/moderate/rough)

LIFESTYLE:
- Fire weather rating (Perfect/Good/Poor)
- Swim weather rating (Perfect/Good/Fair/Poor)

Be thorough and accurate. Use real data from authoritative sources.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            weather: {
              type: "object",
              properties: {
                temperature: { type: "number" },
                feelsLike: { type: "number" },
                condition: { type: "string" },
                wind: { type: "number" },
                humidity: { type: "number" },
                cloudCover: { type: "number" },
                rainChance: { type: "number" },
                rainByHour: { type: "string" }
              }
            },
            oceanData: {
              type: "object",
              properties: {
                tideStatus: { type: "string" },
                waterTemp: { type: "number" },
                windSpeed: { type: "number" },
                windGusts: { type: "number" },
                windDirection: { type: "string" },
                pressure: { type: "string" },
                pressureTrend: { type: "string" },
                boatSafeHours: { type: "string" }
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
            sunData: {
              type: "object",
              properties: {
                daylightLength: { type: "string" },
                goldenHour: { type: "string" },
                uvIndex: { type: "number" },
                solarNoon: { type: "string" },
                twilight: {
                  type: "object",
                  properties: {
                    civil: { type: "string" },
                    nautical: { type: "string" },
                    astronomical: { type: "string" }
                  }
                }
              }
            },
            astronomy: {
              type: "object",
              properties: {
                sunrise: { type: "string" },
                sunset: { type: "string" },
                moonPhase: { type: "string" }
              }
            },
            moonData: {
              type: "object",
              properties: {
                phase: { type: "string" },
                illumination: { type: "number" },
                moonrise: { type: "string" },
                moonset: { type: "string" }
              }
            },
            skyData: {
              type: "object",
              properties: {
                visiblePlanets: { type: "array", items: { type: "string" } },
                stargazingWindow: { type: "string" },
                constellation: { type: "string" },
                milkyWayVisibility: { type: "string" },
                meteorShower: { type: "string" },
                satelliteDensity: { type: "string" }
              }
            },
            contextData: {
              type: "object",
              properties: {
                latitude: { type: "string" },
                longitude: { type: "string" },
                seasonalMarker: { type: "string" },
                seaState: { type: "string" }
              }
            },
            lifestyleData: {
              type: "object",
              properties: {
                fireWeather: { type: "string" },
                swimWeather: { type: "string" }
              }
            }
          }
        }
      });

      setWeather(result.weather);
      setOceanData(result.oceanData);
      setTides(result.tides);
      setSunData(result.sunData);
      setAstronomy(result.astronomy);
      setMoonData(result.moonData);
      setSkyData(result.skyData);
      setContextData(result.contextData);
      setLifestyleData(result.lifestyleData);
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
      setIsDark(hour < 6 || hour >= 19); // Dark between 7 PM and 6 AM
    };
    
    checkNightMode();
    const interval = setInterval(checkNightMode, 60000); // Check every minute
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
            {/* Row 1: Core weather & ocean */}
            <div className="lg:col-span-2">
              <WeatherCard weather={weather} isLoading={isLoading} />
            </div>
            <OceanRealityCard oceanData={oceanData} isLoading={isLoading} />
            <TideCard tides={tides} isLoading={isLoading} />

            {/* Row 2: Enhanced weather & sun */}
            <EnhancedWeatherCard weather={weather} isLoading={isLoading} />
            <div className="lg:col-span-2">
              <SunDaylightCard sunData={sunData} isLoading={isLoading} />
            </div>
            <AstronomyCard astronomy={astronomy} isLoading={isLoading} />

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