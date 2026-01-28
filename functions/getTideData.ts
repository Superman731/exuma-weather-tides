export default async function getTideData() {
  const latitude = 23.4334;
  const longitude = -75.6932;
  const retrievedAt = new Date().toISOString();
  
  try {
    const response = await fetch(
      `https://www.worldtides.info/api/v3?heights&extremes&lat=${latitude}&lon=${longitude}&key=f8e0ea4a-d7f5-48fc-9baa-1c9d8dcf232d`,
      { timeout: 10000 }
    );
    
    if (!response.ok) {
      return {
        ok: false,
        source: "WorldTides",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: response.status,
          message: "WorldTides API request failed",
          details: `HTTP ${response.status}: ${response.statusText}`
        }
      };
    }
    
    const apiData = await response.json();
    
    if (apiData.error) {
      return {
        ok: false,
        source: "WorldTides",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: 500,
          message: "WorldTides returned error",
          details: apiData.error
        }
      };
    }
    
    const now = new Date();
    const todayExtremes = (apiData.extremes || []).filter(extreme => {
      const extremeDate = new Date(extreme.dt * 1000);
      return extremeDate.toDateString() === now.toDateString();
    });
    
    const highTides = todayExtremes.filter(e => e.type === 'High');
    const lowTides = todayExtremes.filter(e => e.type === 'Low');
    
    const nextHigh = highTides.find(t => new Date(t.dt * 1000) > now) || highTides[0];
    const nextLow = lowTides.find(t => new Date(t.dt * 1000) > now) || lowTides[0];
    
    // Determine tide status (rising/falling/slack)
    let tideStatus = "Unknown";
    if (apiData.heights && apiData.heights.length >= 2) {
      const recentHeights = apiData.heights.slice(-2);
      if (recentHeights[1].height > recentHeights[0].height) {
        tideStatus = "Rising";
      } else if (recentHeights[1].height < recentHeights[0].height) {
        tideStatus = "Falling";
      } else {
        tideStatus = "Slack";
      }
    }
    
    if (!nextHigh || !nextLow) {
      return {
        ok: false,
        source: "WorldTides",
        retrievedAt,
        lat: latitude,
        lon: longitude,
        units: { height: "feet" },
        data: null,
        error: {
          status: 500,
          message: "No tide extremes found for today",
          details: "API returned data but no high/low tides for current date"
        }
      };
    }
    
    return {
      ok: true,
      source: "WorldTides",
      retrievedAt,
      sourceTimestamp: apiData.requestDateTime || null,
      lat: latitude,
      lon: longitude,
      units: { height: "feet" },
      data: {
        highTide: new Date(nextHigh.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true,
          timeZone: 'America/Nassau'
        }),
        highTideHeight: `${(nextHigh.height * 3.28084).toFixed(1)} ft`,
        lowTide: new Date(nextLow.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true,
          timeZone: 'America/Nassau'
        }),
        lowTideHeight: `${(nextLow.height * 3.28084).toFixed(1)} ft`,
        tideStatus,
        allTodayTides: todayExtremes.map(e => ({
          type: e.type,
          time: new Date(e.dt * 1000).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true,
            timeZone: 'America/Nassau'
          }),
          height: `${(e.height * 3.28084).toFixed(1)} ft`
        }))
      },
      error: null
    };
    
  } catch (error) {
    return {
      ok: false,
      source: "WorldTides",
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