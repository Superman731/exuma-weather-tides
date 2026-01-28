import { httpGetJson } from './_httpHelper.js';

Deno.serve(async (req) => {
  const latitude = 23.439714577294154;
  const longitude = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=America/Nassau&forecast_days=7&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    
    const result = await httpGetJson(url, "Open-Meteo");
    
    if (!result.ok) {
      const errorResponse = {
        ok: false,
        source: "Open-Meteo",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: result.status || 500,
          message: result.error?.message || "Open-Meteo fetch failed",
          details: JSON.stringify({
            error: result.error,
            text: result.text?.substring(0, 300),
            fetchSource: result.fetchSource
          })
        }
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = result.json;
    
    if (!data.current || !data.daily) {
      const errorResponse = {
        ok: false,
        source: "Open-Meteo",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: 500,
          message: "Incomplete data from API",
          details: "Missing current or daily data"
        }
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const current = data.current;
    const daily = data.daily;
    
    const weatherCodeMap = {
      0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
      61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 80: 'Rain Showers', 95: 'Thunderstorm'
    };
    
    const successResponse = {
      ok: true,
      source: "Open-Meteo",
      retrievedAt,
      sourceTimestamp: current.time || null,
      lat: latitude,
      lon: longitude,
      units: {
        temperature: "°F",
        wind: "mph",
        pressure: "hPa",
        humidity: "%"
      },
      data: {
        current: {
          temperature: Math.round(current.temperature_2m),
          feelsLike: Math.round(current.apparent_temperature),
          condition: weatherCodeMap[current.weather_code] || 'Unknown',
          windSpeed: Math.round(current.wind_speed_10m),
          windGusts: Math.round(current.wind_gusts_10m),
          windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(current.wind_direction_10m / 45) % 8],
          humidity: current.relative_humidity_2m,
          cloudCover: current.cloud_cover,
          pressure: current.surface_pressure || null
        },
        today: {
          tempHigh: Math.round(daily.temperature_2m_max[0]),
          tempLow: Math.round(daily.temperature_2m_min[0]),
          condition: weatherCodeMap[daily.weather_code[0]] || 'Unknown',
          rainChance: daily.precipitation_probability_max[0] || 0,
          windSpeedMax: Math.round(daily.wind_speed_10m_max[0]),
          uvIndex: daily.uv_index_max[0] || null,
          sunrise: new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          }),
          sunset: new Date(daily.sunset[0]).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          })
        },
        forecast: daily.time.slice(1, 8).map((date, i) => ({
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
          high: Math.round(daily.temperature_2m_max[i + 1]),
          low: Math.round(daily.temperature_2m_min[i + 1]),
          condition: weatherCodeMap[daily.weather_code[i + 1]] || 'Unknown',
          rainChance: daily.precipitation_probability_max[i + 1] || 0,
          windSpeedMax: Math.round(daily.wind_speed_10m_max[i + 1])
        }))
      },
      error: null
    };
    
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (err) {
    const errorResponse = {
      ok: false,
      source: "Open-Meteo",
      retrievedAt,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Exception in getWeatherData",
        details: err.stack || JSON.stringify(err)
      }
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});