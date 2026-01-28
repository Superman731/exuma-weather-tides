import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, AlertCircle, Zap } from 'lucide-react';
import CardFooter from './CardFooter';

const weatherIcons = {
  'clear': Sun,
  'sunny': Sun,
  'mainly clear': Sun,
  'clouds': Cloud,
  'cloudy': Cloud,
  'partly cloudy': Cloud,
  'overcast': Cloud,
  'rain': CloudRain,
  'drizzle': CloudRain,
  'default': Sun
};

export default function WeatherForecastCard({ response, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-40 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-32 bg-white/20 rounded-2xl"></div>
          <div className="h-32 bg-white/20 rounded-2xl"></div>
          <div className="h-32 bg-white/20 rounded-2xl"></div>
          <div className="h-32 bg-white/20 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!response || !response.ok) {
    const error = response?.error || {};
    return (
      <div className="bg-red-900/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-red-500/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-200/80 uppercase tracking-widest text-xs font-medium">
            Weather - Error
          </h3>
        </div>
        <div className="space-y-2 text-xs font-mono">
          <p className="text-red-200">Status: {error.status || 'Unknown'}</p>
          {error.url && <p className="text-red-200">URL: {error.url}</p>}
          <p className="text-red-300">{error.message || 'Failed to load weather data'}</p>
          {error.details && (
            <pre className="text-red-300 text-xs mt-2 overflow-x-auto whitespace-pre-wrap break-words max-h-32">
              {error.details.substring(0, 300)}
            </pre>
          )}
        </div>
        <CardFooter
          source={response?.source}
          retrievedAt={response?.retrievedAt}
          lat={response?.lat}
          lon={response?.lon}
        />
      </div>
    );
  }

  const weather = response.data;
  const current = weather.current;
  const today = weather.today;
  const forecast = weather.forecast;

  const getIcon = (condition) => {
    const key = Object.keys(weatherIcons).find(k => condition?.toLowerCase().includes(k));
    return weatherIcons[key] || weatherIcons.default;
  };

  const CurrentIcon = getIcon(current.condition);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Thermometer className="w-5 h-5 text-amber-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Weather Forecast
        </h3>
      </div>

      {/* Current Weather */}
      <div className="mb-8 p-6 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 rounded-2xl border border-white/10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-2">Now</p>
            <p className="text-5xl md:text-6xl font-extralight text-white mb-2">
              {current.temperature}°
            </p>
            <p className="text-sky-100/80 text-lg capitalize mb-3">{current.condition}</p>
            <div className="flex gap-4 text-sm text-sky-200/70">
              <span>Feels {current.feelsLike}°</span>
              <span>•</span>
              <span>{current.humidity}% humidity</span>
            </div>
          </div>
          <CurrentIcon className="w-16 h-16 text-amber-300/80" strokeWidth={1} />
        </div>
      </div>

      {/* Today Split */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-2">Today High</p>
          <p className="text-white text-3xl font-light">{today.tempHigh}°</p>
          <p className="text-sky-100/60 text-sm mt-1">{today.condition}</p>
        </div>
        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-2">Tonight Low</p>
          <p className="text-white text-3xl font-light">{today.tempLow}°</p>
          <p className="text-sky-100/60 text-sm mt-1">Clear</p>
        </div>
      </div>

      {/* Sun Safety */}
      {(today.uvIndex !== null || today.sunshineDuration !== null) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {today.uvIndex !== null && (
            <div className={`p-4 rounded-2xl border ${
              today.uvIndex >= 8 ? 'bg-red-500/10 border-red-500/20' :
              today.uvIndex >= 6 ? 'bg-orange-500/10 border-orange-500/20' :
              today.uvIndex >= 3 ? 'bg-yellow-500/10 border-yellow-500/20' :
              'bg-green-500/10 border-green-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" />
                <p className="text-sky-200/60 text-xs uppercase tracking-wider">UV Index</p>
              </div>
              <p className={`text-2xl font-light ${
                today.uvIndex >= 8 ? 'text-red-300' :
                today.uvIndex >= 6 ? 'text-orange-300' :
                today.uvIndex >= 3 ? 'text-yellow-300' :
                'text-green-300'
              }`}>
                {today.uvIndex}
              </p>
              <p className="text-sky-100/60 text-xs mt-1">
                {today.uvIndex >= 8 ? 'Extreme' :
                 today.uvIndex >= 6 ? 'Very High' :
                 today.uvIndex >= 3 ? 'Moderate' : 'Low'}
              </p>
            </div>
          )}
          {today.sunshineDuration !== null && (
            <div className="p-4 bg-sun-500/10 rounded-2xl border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4" />
                <p className="text-sky-200/60 text-xs uppercase tracking-wider">Sunshine</p>
              </div>
              <p className="text-white text-2xl font-light">{today.sunshineDuration}h</p>
              <p className="text-sky-100/60 text-xs mt-1">hours of sun</p>
            </div>
          )}
        </div>
      )}

      {/* 7-Day Forecast */}
      <div>
        <p className="text-sky-200/60 text-xs uppercase tracking-wider mb-4">7-Day Forecast</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((day, index) => {
            const DayIcon = getIcon(day.condition);
            return (
              <div key={index} className="p-3 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                <p className="text-sky-200/60 text-xs mb-2">{day.date}</p>
                <DayIcon className="w-6 h-6 text-amber-300 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-white font-light">
                  <span className="text-lg">{day.high}°</span>
                  <span className="text-sky-200/50 text-sm"> / {day.low}°</span>
                </p>
                {day.rainChance > 0 && (
                  <p className="text-sky-300/60 text-xs mt-1">{day.rainChance}%</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CardFooter
        source={response.source}
        sourceTimestamp={response.sourceTimestamp}
        retrievedAt={response.retrievedAt}
        lat={response.lat}
        lon={response.lon}
      />
    </div>
  );
}