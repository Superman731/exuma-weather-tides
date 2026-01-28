import { httpGetJson } from './_httpHelper.ts';

// Astronomy data endpoint for Exuma (Sunrise-Sunset API)
Deno.serve(async (req) => {
  const latitude = 23.439714577294154;
  const longitude = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${today}&formatted=0`;
    
    const result = await httpGetJson(url, "sunrise-sunset.org");
    
    if (!result.ok) {
      const errorResponse = {
        ok: false,
        source: "sunrise-sunset.org",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: result.status || 500,
          message: result.error?.message || "Sunrise-sunset fetch failed",
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
    
    const apiData = result.json;
    
    if (!apiData.results) {
      const errorResponse = {
        ok: false,
        source: "sunrise-sunset.org",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: 500,
          message: "Invalid API response",
          details: "Missing results field"
        }
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const results = apiData.results;
    
    const formatTime = (utcString) => {
      const date = new Date(utcString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true,
        timeZone: 'America/Nassau'
      });
    };
    
    const sunrise = new Date(results.sunrise);
    const sunset = new Date(results.sunset);
    const dayLengthSeconds = results.day_length;
    const dayLengthHours = Math.floor(dayLengthSeconds / 3600);
    const dayLengthMinutes = Math.floor((dayLengthSeconds % 3600) / 60);
    
    const successResponse = {
      ok: true,
      source: "sunrise-sunset.org",
      retrievedAt,
      sourceTimestamp: null,
      lat: latitude,
      lon: longitude,
      units: {},
      data: {
        sunrise: formatTime(results.sunrise),
        sunset: formatTime(results.sunset),
        solarNoon: formatTime(results.solar_noon),
        dayLength: `${dayLengthHours}h ${dayLengthMinutes}m`,
        civilTwilightEnd: formatTime(results.civil_twilight_end),
        nauticalTwilightEnd: formatTime(results.nautical_twilight_end),
        astronomicalTwilightEnd: formatTime(results.astronomical_twilight_end),
        goldenHour: formatTime(results.sunset)
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
      source: "sunrise-sunset.org",
      retrievedAt,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Exception in getAstronomyData",
        details: err.stack || JSON.stringify(err)
      }
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});