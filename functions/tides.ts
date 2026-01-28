import { httpGetJson } from './_httpHelper.ts';

Deno.serve(async (req) => {
  const lat = 23.439714577294154;
  const lon = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  
  const apiKey = Deno.env.get('TIDE_API_KEY') || 'f8e0ea4a-d7f5-48fc-9baa-1c9d8dcf232d';
  
  if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
    return new Response(JSON.stringify({
      ok: false,
      source: "WorldTides",
      retrievedAt,
      lat,
      lon,
      units: {},
      data: null,
      error: {
        status: 401,
        message: "Missing TIDE_API_KEY environment variable",
        details: "Set TIDE_API_KEY in Base44 dashboard settings to enable tide data"
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const url = `https://www.worldtides.info/api/v3?heights&extremes&lat=${lat}&lon=${lon}&key=${apiKey}`;
    
    const result = await httpGetJson(url, "WorldTides");
    
    if (!result.ok) {
      return new Response(JSON.stringify({
        ok: false,
        source: "WorldTides",
        retrievedAt,
        lat,
        lon,
        units: {},
        data: null,
        error: {
          status: result.status || 500,
          message: result.error?.message || "WorldTides fetch failed",
          details: result.text?.substring(0, 300)
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const apiData = result.json;
    
    if (apiData.error) {
      return new Response(JSON.stringify({
        ok: false,
        source: "WorldTides",
        retrievedAt,
        lat,
        lon,
        units: {},
        data: null,
        error: {
          status: apiData.status || 400,
          message: "WorldTides API error",
          details: apiData.error
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!apiData.extremes || !apiData.heights) {
      return new Response(JSON.stringify({
        ok: false,
        source: "WorldTides",
        retrievedAt,
        lat,
        lon,
        units: {},
        data: null,
        error: {
          status: 500,
          message: "Incomplete tide data from API"
        }
      }), {
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
      const timeStr = eDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      
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
    const tideStatus = nextExtreme ? (nextExtreme.type === 'High' ? 'Rising' : 'Falling') : 'Unknown';
    
    return new Response(JSON.stringify({
      ok: true,
      source: "WorldTides",
      retrievedAt,
      sourceTimestamp: null,
      lat,
      lon,
      units: { height: "feet" },
      data: { highTide, lowTide, tideStatus },
      error: null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      source: "WorldTides",
      retrievedAt,
      lat,
      lon,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Exception in tides function",
        details: err.stack
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});