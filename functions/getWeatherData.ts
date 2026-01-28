export default async function getWeatherData({ base44 }) {
  const latitude = 23.4334;
  const longitude = -75.6932;
  const retrievedAt = new Date().toISOString();
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=America/Nassau&forecast_days=7&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    
    const response = await base44.asServiceRole.fetch(url);
    
    if (!response.ok) {
      return {
        ok: false,
        source: "Open-Meteo",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: response.status,
          message: "Open-Meteo API request failed",
          details: `HTTP ${response.status}: ${response.statusText}`
        }
      };
    }
    
    const data = await response.json();
    
    if (!data.current || !data.daily) {
      return {
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
    }
    
    const current = data.current;
    const daily = data.daily;
    
    const weatherCodeMap = {
      0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
      61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 80: 'Rain Showers', 95: 'Thunderstorm'
    };
    
    return {
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
    
  } catch (error) {
    return {
      ok: false,
      source: "Open-Meteo",
      retrievedAt,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 500,
        message: "Network error or timeout",
        details: error.message
      }
    };
  }
}