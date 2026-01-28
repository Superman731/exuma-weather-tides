Deno.serve(async (req) => {
  const lat = 23.439714577294154;
  const lon = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  
  try {
    const now = new Date();
    const month = now.getMonth();
    
    const constellations = {
      0: "Orion, Taurus", 1: "Orion, Gemini", 2: "Leo, Cancer", 3: "Leo, Virgo",
      4: "Virgo, Boötes", 5: "Scorpius, Libra", 6: "Sagittarius, Scorpius", 7: "Sagittarius, Aquila",
      8: "Pegasus, Aquarius", 9: "Pegasus, Andromeda", 10: "Andromeda, Cassiopeia", 11: "Orion, Taurus"
    };
    
    const visiblePlanets = month >= 3 && month <= 8 
      ? "Mars, Jupiter, Saturn" 
      : "Venus (evening), Jupiter, Saturn";
    
    const julianDay = (now.getTime() / 86400000) + 2440587.5;
    const daysSinceNewMoon = julianDay - 2451549.5;
    const moonAge = (daysSinceNewMoon % 29.53058867);
    const moonIllumination = Math.abs(50 - (moonAge / 29.53058867) * 100);
    
    const isDarkSkies = moonIllumination < 25;
    const stargazingWindow = isDarkSkies ? "11 PM - 2 AM (good)" : "After midnight (fair)";
    
    const milkyWayVisible = month >= 4 && month <= 9;
    
    const meteorShowers = {
      0: { name: "Quadrantids", date: "early January" },
      3: { name: "Lyrids", date: "late April" },
      4: { name: "Eta Aquariids", date: "early May" },
      7: { name: "Perseids", date: "mid August" },
      11: { name: "Geminids", date: "mid December" }
    };
    
    const shower = meteorShowers[month] || null;
    
    return new Response(JSON.stringify({
      ok: true,
      source: "Astronomical Calculation",
      retrievedAt,
      sourceTimestamp: now.toISOString(),
      lat,
      lon,
      units: {},
      data: {
        visiblePlanets,
        bestStargazing: stargazingWindow,
        constellations: constellations[month],
        milkyWayVisible,
        meteorShower: shower,
        satellitePasses: "ISS visible in evening hours"
      },
      error: null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      source: "Astronomical Calculation",
      retrievedAt,
      lat,
      lon,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Exception in sky function",
        details: err.stack
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});