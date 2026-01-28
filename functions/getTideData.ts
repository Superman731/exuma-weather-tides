import { httpGetJson } from './_httpHelper.ts';

Deno.serve(async (req) => {
  const latitude = 23.439714577294154;
  const longitude = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  
  const apiKey = Deno.env.get('TIDE_API_KEY') || 'f8e0ea4a-d7f5-48fc-9baa-1c9d8dcf232d';
  
  if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
    const errorResponse = {
      ok: false,
      source: "WorldTides",
      retrievedAt,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 401,
        message: "Missing TIDE_API_KEY",
        details: "WorldTides API requires a valid API key. Set TIDE_API_KEY environment variable."
      }
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const url = `https://www.worldtides.info/api/v3?heights&extremes&lat=${latitude}&lon=${longitude}&key=${apiKey}`;
    
    const result = await httpGetJson(url, "WorldTides");
    
    if (!result.ok) {
      const errorResponse = {
        ok: false,
        source: "WorldTides",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: result.status || 500,
          message: result.error?.message || "WorldTides fetch failed",
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
    
    if (apiData.error) {
      const errorResponse = {
        ok: false,
        source: "WorldTides",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: apiData.status || 400,
          message: "WorldTides API error",
          details: apiData.error
        }
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!apiData.extremes || !apiData.heights) {
      const errorResponse = {
        ok: false,
        source: "WorldTides",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: 500,
          message: "Incomplete tide data",
          details: "Missing extremes or heights"
        }
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const todayExtremes = apiData.extremes.filter(e => {
      const eDate = new Date(e.dt * 1000);
      return eDate >= todayStart && eDate < todayEnd;
    });
    
    let highTide = null, lowTide = null;
    for (const extreme of todayExtremes) {
      const eDate = new Date(extreme.dt * 1000);
      const timeStr = eDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      
      if (extreme.type === 'High') {
        if (!highTide || eDate > now) {
          highTide = { time: timeStr, height: extreme.height.toFixed(1) };
        }
      } else if (extreme.type === 'Low') {
        if (!lowTide || eDate > now) {
          lowTide = { time: timeStr, height: extreme.height.toFixed(1) };
        }
      }
    }
    
    const nextExtreme = apiData.extremes.find(e => new Date(e.dt * 1000) > now);
    let tideStatus = 'Unknown';
    if (nextExtreme) {
      tideStatus = nextExtreme.type === 'High' ? 'Rising' : 'Falling';
    }
    
    const successResponse = {
      ok: true,
      source: "WorldTides",
      retrievedAt,
      sourceTimestamp: null,
      lat: latitude,
      lon: longitude,
      units: { height: "feet" },
      data: {
        highTide,
        lowTide,
        tideStatus
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
      source: "WorldTides",
      retrievedAt,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Exception in getTideData",
        details: err.stack || JSON.stringify(err)
      }
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});