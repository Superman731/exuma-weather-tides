// TEMPORARY: Direct client-side fetch for Open-Meteo while backend routing is unavailable
// This is a FALLBACK ONLY - move back to backend once functions are deployed

export async function fetchWeatherDirect() {
  const latitude = 23.439714577294154;
  const longitude = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=America/Nassau&forecast_days=7&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        ok: false,
        source: "Open-Meteo (CLIENT-SIDE TEMP)",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: response.status,
          message: "Open-Meteo fetch failed",
          details: `HTTP ${response.status}`
        }
      };
    }
    
    const data = await response.json();
    
    if (!data.current || !data.daily) {
      return {
        ok: false,
        source: "Open-Meteo (CLIENT-SIDE TEMP)",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: 200,
          message: "Incomplete data from Open-Meteo",
          details: "Missing current or daily data"
        }
      };
    }
    
    const weatherCodeMap = {
      0: 'Clear', 1: 'Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
      45: 'Fog', 48: 'Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
      61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
      71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
      80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Rain Showers',
      95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
    };
    
    const current = data.current;
    const daily = data.daily;
    
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      forecast.push({
        date: daily.time[i],
        condition: weatherCodeMap[daily.weather_code[i]] || 'Unknown',
        high: Math.round(daily.temperature_2m_max[i]),
        low: Math.round(daily.temperature_2m_min[i]),
        precipProbability: daily.precipitation_probability_max[i] || 0,
        windSpeed: daily.wind_speed_10m_max[i] || 0,
        uvIndex: daily.uv_index_max[i] || 0
      });
    }
    
    return {
      ok: true,
      source: "Open-Meteo (CLIENT-SIDE TEMP)",
      retrievedAt,
      sourceTimestamp: current.time,
      lat: latitude,
      lon: longitude,
      units: {
        temperature: "°F",
        windSpeed: "mph",
        pressure: "hPa"
      },
      data: {
        current: {
          temp: Math.round(current.temperature_2m),
          feelsLike: Math.round(current.apparent_temperature),
          condition: weatherCodeMap[current.weather_code] || 'Unknown',
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          windDirection: current.wind_direction_10m ? `${Math.round(current.wind_direction_10m)}°` : '',
          windGusts: current.wind_gusts_10m,
          pressure: current.surface_pressure,
          cloudCover: current.cloud_cover
        },
        forecast
      },
      error: null
    };
    
  } catch (err) {
    return {
      ok: false,
      source: "Open-Meteo (CLIENT-SIDE TEMP)",
      retrievedAt,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Client-side fetch exception",
        details: err.stack || String(err)
      }
    };
  }
}