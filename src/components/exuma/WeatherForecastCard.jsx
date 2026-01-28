import React from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Sunrise, Sunset, Moon } from 'lucide-react';

const getWeatherIcon = (condition) => {
  const lowerCondition = condition?.toLowerCase() || '';
  if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) return CloudRain;
  if (lowerCondition.includes('cloud')) return Cloud;
  return Sun;
};

export default function WeatherForecastCard({ forecastData, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-8 bg-white/20 rounded w-32 mb-6"></div>
        <div className="space-y-4">
          <div className="h-48 bg-white/20 rounded-2xl"></div>
          <div className="h-40 bg-white/20 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const today = forecastData?.today;
  const forecast = forecastData?.forecast || [];

  return (
    <div className="bg-gradient-to-br from-sky-500/15 via-white/10 to-blue-500/15 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <h2 className="text-white text-2xl font-light mb-6">Weather Forecast</h2>

      {/* Today's Day/Night Split */}
      {today && (
        <div className="mb-6 border border-white/20 rounded-2xl overflow-hidden bg-white/5">
          <div className="px-4 py-2 bg-white/10 border-b border-white/20">
            <h3 className="text-white font-medium">Today</h3>
          </div>
          
          <div className="grid grid-cols-2 divide-x divide-white/20">
            {/* Day */}
            <div className="p-4">
              <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-3">Day</p>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-white text-4xl font-light">{today.day?.temp}°</span>
                  {React.createElement(getWeatherIcon(today.day?.condition), { 
                    className: "w-10 h-10 text-sky-300", 
                    strokeWidth: 1.5 
                  })}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sky-200/80 text-sm mb-1">
                    <Droplets className="w-3 h-3" />
                    <span>{today.day?.rainChance}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-sky-200/80 text-sm">
                    <Wind className="w-3 h-3" />
                    <span>{today.day?.windSpeed} mph</span>
                  </div>
                </div>
              </div>
              <p className="text-sky-100/80 text-sm mb-3">{today.day?.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                  <span className="text-sky-200/70">Humidity</span>
                  <span className="text-white ml-auto">{today.day?.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span className="text-sky-200/70">UV</span>
                  <span className="text-white ml-auto">{today.day?.uvIndex}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sunrise className="w-3 h-3 text-amber-400" />
                  <span className="text-sky-200/70">Sunrise</span>
                  <span className="text-white ml-auto">{today.sunrise}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sunset className="w-3 h-3 text-orange-400" />
                  <span className="text-sky-200/70">Sunset</span>
                  <span className="text-white ml-auto">{today.sunset}</span>
                </div>
              </div>
            </div>

            {/* Night */}
            <div className="p-4 bg-slate-900/20">
              <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-3">Night</p>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-white text-4xl font-light">{today.night?.temp}°</span>
                  {React.createElement(getWeatherIcon(today.night?.condition), { 
                    className: "w-10 h-10 text-indigo-300", 
                    strokeWidth: 1.5 
                  })}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sky-200/80 text-sm mb-1">
                    <Droplets className="w-3 h-3" />
                    <span>{today.night?.rainChance}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-sky-200/80 text-sm">
                    <Wind className="w-3 h-3" />
                    <span>{today.night?.windSpeed} mph</span>
                  </div>
                </div>
              </div>
              <p className="text-sky-100/80 text-sm mb-3">{today.night?.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                  <span className="text-sky-200/70">Humidity</span>
                  <span className="text-white ml-auto">{today.night?.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-300" />
                  <span className="text-sky-200/70">Moonrise</span>
                  <span className="text-white ml-auto">{today.moonrise}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-300" />
                  <span className="text-sky-200/70">Phase</span>
                  <span className="text-white ml-auto">{today.moonPhase}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-300" />
                  <span className="text-sky-200/70">Moonset</span>
                  <span className="text-white ml-auto">{today.moonset}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Conditions */}
      {forecastData?.current && (
        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-3">Current Conditions</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <p className="text-sky-200/60 text-xs mb-1">Temperature</p>
              <p className="text-white text-xl font-light">{forecastData.current.temp}°</p>
            </div>
            <div>
              <p className="text-sky-200/60 text-xs mb-1">Feels Like</p>
              <p className="text-white text-xl font-light">{forecastData.current.feelsLike}°</p>
            </div>
            <div>
              <p className="text-sky-200/60 text-xs mb-1">Humidity</p>
              <p className="text-white text-xl font-light">{forecastData.current.humidity}%</p>
            </div>
            <div>
              <p className="text-sky-200/60 text-xs mb-1">Cloud Cover</p>
              <p className="text-white text-xl font-light">{forecastData.current.cloudCover}%</p>
            </div>
            <div>
              <p className="text-sky-200/60 text-xs mb-1">Rain Chance</p>
              <p className="text-white text-xl font-light">{forecastData.current.rainChance}%</p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      <div className="space-y-2">
        {forecast.map((day, index) => {
          const WeatherIcon = getWeatherIcon(day.condition);
          return (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <p className="text-sky-100 font-medium w-16">{day.date}</p>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xl font-light">{day.high}°</span>
                  <span className="text-sky-200/60">/</span>
                  <span className="text-sky-200/80 text-lg font-light">{day.low}°</span>
                </div>
                <WeatherIcon className="w-6 h-6 text-sky-300" strokeWidth={1.5} />
                <p className="text-sky-100/80 text-sm flex-1">{day.condition}</p>
              </div>
              <div className="flex items-center gap-1 text-sky-200/80 text-sm">
                <Droplets className="w-4 h-4" />
                <span>{day.rainChance}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}