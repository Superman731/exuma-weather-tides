export default async function getWeatherData() {
  const latitude = 23.5;
  const longitude = -75.8;
  
  try {
    // Using Open-Meteo (free, no API key needed)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=America/Nassau&forecast_days=7&temperature_unit=fahrenheit&wind_speed_unit=mph`
    );
    
    if (!response.ok) {
      throw new Error('Weather API failed');
    }
    
    const data = await response.json();
  const current = data.current;
  const daily = data.daily;
  
  const weatherCodeMap = {
    0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 80: 'Rain Showers', 95: 'Thunderstorm'
  };
  
  return {
    weather: {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition: weatherCodeMap[current.weather_code] || 'Clear',
      wind: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
      cloudCover: current.cloud_cover,
      rainChance: daily.precipitation_probability_max[0]
    },
    forecastData: {
      current: {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        cloudCover: current.cloud_cover,
        rainChance: daily.precipitation_probability_max[0]
      },
      today: {
        day: {
          temp: Math.round(daily.temperature_2m_max[0]),
          condition: weatherCodeMap[daily.weather_code[0]] || 'Clear',
          description: 'Sunny skies',
          rainChance: daily.precipitation_probability_max[0],
          windSpeed: Math.round(daily.wind_speed_10m_max[0]),
          humidity: current.relative_humidity_2m,
          uvIndex: daily.uv_index_max[0]
        },
        night: {
          temp: Math.round(daily.temperature_2m_min[0]),
          condition: weatherCodeMap[daily.weather_code[0]] || 'Clear',
          description: 'Clear skies',
          rainChance: daily.precipitation_probability_max[0],
          windSpeed: Math.round(daily.wind_speed_10m_max[0]),
          humidity: current.relative_humidity_2m
        },
        sunrise: new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        sunset: new Date(daily.sunset[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      },
      forecast: daily.time.slice(1, 8).map((date, i) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        high: Math.round(daily.temperature_2m_max[i + 1]),
        low: Math.round(daily.temperature_2m_min[i + 1]),
        condition: weatherCodeMap[daily.weather_code[i + 1]] || 'Clear',
        rainChance: daily.precipitation_probability_max[i + 1]
      }))
    },
    oceanData: {
      windSpeed: Math.round(current.wind_speed_10m),
      windGusts: Math.round(current.wind_gusts_10m),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(current.wind_direction_10m / 45) % 8],
      tideStatus: 'Rising',
      waterTemp: 78,
      pressure: '30.1 inHg',
      pressureTrend: 'steady',
      boatSafeHours: '6 AM - 6 PM'
    },
    sunData: {
      daylightLength: '11h 3m',
      goldenHour: '5:15 PM - 5:47 PM',
      uvIndex: daily.uv_index_max[0],
      solarNoon: '12:15 PM',
      twilight: {
        civil: '5:47 PM - 6:09 PM',
        nautical: '6:09 PM - 6:35 PM',
        astronomical: '6:35 PM - 7:00 PM'
      }
    },
    astronomy: {
      sunrise: new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      sunset: new Date(daily.sunset[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      moonPhase: 'Waning Crescent'
    }
  };
}