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
        base44.functions.getTideData(),
        base44.functions.getWeatherData(),
        base44.functions.getAstronomyData()
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
        prompt: `Get REAL-TIME data for Georgetown, Exuma, Bahamas (23.5°N, 75.8°W) for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.

CRITICAL: Search these authoritative sources NOW:
- Tides: Search "Georgetown Exuma tide times ${new Date().toLocaleDateString()}" on tideschart.com
- Weather: Get current conditions and 7-day forecast from weather.com for Georgetown Exuma
- Astronomy: Get sunrise/sunset from timeanddate.com for Georgetown Exuma

Return ALL this data:
- Weather: current temp (°F), feels like, condition, wind (mph), wind gusts (mph), wind direction (N/NE/E/etc), humidity %, cloud cover %, rain chance %
- Forecast: 7-day with highs/lows, conditions, rain chance
- Tides: today's high tide time (e.g. "1:22 PM") with height (ft), low tide time with height
- Ocean: tide status (Rising/Falling), water temp (78°F typical), pressure (inHg), boat-safe hours
- Sun: sunrise, sunset, daylight length, golden hour, UV index, solar noon, twilight times
- Astronomy: sunrise, sunset, moon phase
- Moon: phase name, illumination %, moonrise, moonset
- Sky: visible planets, stargazing window, constellation, Milky Way visibility, meteor showers, satellite density
- Context: exact coordinates, seasonal marker, sea state
- Lifestyle: fire weather rating, swim weather rating`,
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
                rainChance: { type: "number" }
              }
            },
            forecastData: {
              type: "object",
              properties: {
                current: {
                  type: "object",
                  properties: {
                    temp: { type: "number" },
                    feelsLike: { type: "number" },
                    humidity: { type: "number" },
                    cloudCover: { type: "number" },
                    rainChance: { type: "number" }
                  }
                },
                today: {
                  type: "object",
                  properties: {
                    day: {
                      type: "object",
                      properties: {
                        temp: { type: "number" },
                        condition: { type: "string" },
                        description: { type: "string" },
                        rainChance: { type: "number" },
                        windSpeed: { type: "number" },
                        humidity: { type: "number" },
                        uvIndex: { type: "number" }
                      }
                    },
                    night: {
                      type: "object",
                      properties: {
                        temp: { type: "number" },
                        condition: { type: "string" },
                        description: { type: "string" },
                        rainChance: { type: "number" },
                        windSpeed: { type: "number" },
                        humidity: { type: "number" }
                      }
                    },
                    sunrise: { type: "string" },
                    sunset: { type: "string" }
                  }
                },
                forecast: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: { type: "string" },
                      high: { type: "number" },
                      low: { type: "number" },
                      condition: { type: "string" },
                      rainChance: { type: "number" }
                    }
                  }
                }
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

      const flattenedOceanData = result.oceanData ? {
        ...result.oceanData,
        windSpeed: result.oceanData.windSpeed || result.oceanData.wind?.speed,
        windGusts: result.oceanData.windGusts || result.oceanData.wind?.gusts,
        windDirection: result.oceanData.windDirection || result.oceanData.wind?.direction
      } : null;

      const flattenedTides = result.tides ? {
        highTide: result.tides.highTide?.time || result.tides.highTide,
        highTideHeight: result.tides.highTide?.height || result.tides.highTideHeight,
        lowTide: result.tides.lowTide?.time || result.tides.lowTide,
        lowTideHeight: result.tides.lowTide?.height || result.tides.lowTideHeight
      } : null;

      setWeather(result.weather);
      setForecastData(result.forecastData);
      setOceanData(flattenedOceanData);
      setTides(flattenedTides);
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