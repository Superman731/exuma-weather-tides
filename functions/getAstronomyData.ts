export default async function getAstronomyData({ base44 }) {
  const latitude = 23.4334;
  const longitude = -75.6932;
  const retrievedAt = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${today}&formatted=0`;
    
    const response = await base44.asServiceRole.fetch(url);
    
    if (!response.ok) {
      return {
        ok: false,
        source: "sunrise-sunset.org",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: response.status,
          message: "Sunrise-sunset API request failed",
          details: `HTTP ${response.status}: ${response.statusText}`
        }
      };
    }
    
    const apiData = await response.json();
    
    if (apiData.status !== 'OK') {
      return {
        ok: false,
        source: "sunrise-sunset.org",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: 500,
          message: "API returned non-OK status",
          details: `Status: ${apiData.status}`
        }
      };
    }
    
    const formatTime = (utcTime) => {
      const date = new Date(utcTime);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true, 
        timeZone: 'America/Nassau' 
      });
    };
    
    const sunrise = new Date(apiData.results.sunrise);
    const sunset = new Date(apiData.results.sunset);
    const dayLength = (sunset - sunrise) / 1000 / 60 / 60;
    const hours = Math.floor(dayLength);
    const minutes = Math.round((dayLength - hours) * 60);
    
    const goldenHourStart = new Date(sunset.getTime() - 32 * 60 * 1000); // 32 mins before sunset
    const solarNoon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
    
    return {
      ok: true,
      source: "sunrise-sunset.org",
      retrievedAt,
      sourceTimestamp: null,
      lat: latitude,
      lon: longitude,
      units: {},
      data: {
        sunrise: formatTime(apiData.results.sunrise),
        sunset: formatTime(apiData.results.sunset),
        daylightLength: `${hours}h ${minutes}m`,
        goldenHour: `${formatTime(goldenHourStart.toISOString())} - ${formatTime(apiData.results.sunset)}`,
        solarNoon: formatTime(solarNoon.toISOString()),
        twilight: {
          civilStart: formatTime(apiData.results.civil_twilight_begin),
          civilEnd: formatTime(apiData.results.civil_twilight_end),
          nauticalStart: formatTime(apiData.results.nautical_twilight_begin),
          nauticalEnd: formatTime(apiData.results.nautical_twilight_end),
          astronomicalStart: formatTime(apiData.results.astronomical_twilight_begin),
          astronomicalEnd: formatTime(apiData.results.astronomical_twilight_end)
        }
      },
      error: null
    };
    
  } catch (error) {
    return {
      ok: false,
      source: "sunrise-sunset.org",
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