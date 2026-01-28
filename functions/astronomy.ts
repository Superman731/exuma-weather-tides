import { httpGetJson } from './_httpHelper.ts';

Deno.serve(async (req) => {
  const lat = 23.439714577294154;
  const lon = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${today}&formatted=0`;
    
    const result = await httpGetJson(url, "sunrise-sunset.org");
    
    if (!result.ok) {
      return new Response(JSON.stringify({
        ok: false,
        source: "sunrise-sunset.org",
        retrievedAt,
        lat,
        lon,
        units: {},
        data: null,
        error: {
          status: result.status || 500,
          message: result.error?.message || "Sunrise-sunset fetch failed",
          details: result.text?.substring(0, 300)
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const apiData = result.json;
    
    if (!apiData.results) {
      return new Response(JSON.stringify({
        ok: false,
        source: "sunrise-sunset.org",
        retrievedAt,
        lat,
        lon,
        units: {},
        data: null,
        error: {
          status: 500,
          message: "Invalid API response - missing results"
        }
      }), {
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
    
    const dayLengthSeconds = results.day_length;
    const dayLengthHours = Math.floor(dayLengthSeconds / 3600);
    const dayLengthMinutes = Math.floor((dayLengthSeconds % 3600) / 60);
    
    return new Response(JSON.stringify({
      ok: true,
      source: "sunrise-sunset.org",
      retrievedAt,
      sourceTimestamp: null,
      lat,
      lon,
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
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      source: "sunrise-sunset.org",
      retrievedAt,
      lat,
      lon,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Exception in astronomy function",
        details: err.stack
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});