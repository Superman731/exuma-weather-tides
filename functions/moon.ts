Deno.serve(async (req) => {
  const lat = 23.439714577294154;
  const lon = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  
  try {
    const now = new Date();
    const julianDay = (now.getTime() / 86400000) + 2440587.5;
    const daysSinceNewMoon = julianDay - 2451549.5;
    const newMoons = daysSinceNewMoon / 29.53058867;
    const phase = (newMoons % 1) * 29.53058867;
    
    let phaseName, illumination;
    if (phase < 1.84566) {
      phaseName = "New Moon";
      illumination = 0;
    } else if (phase < 5.53699) {
      phaseName = "Waxing Crescent";
      illumination = Math.round((phase / 29.53058867) * 100);
    } else if (phase < 9.22831) {
      phaseName = "First Quarter";
      illumination = 50;
    } else if (phase < 12.91963) {
      phaseName = "Waxing Gibbous";
      illumination = Math.round((phase / 29.53058867) * 100);
    } else if (phase < 16.61096) {
      phaseName = "Full Moon";
      illumination = 100;
    } else if (phase < 20.30228) {
      phaseName = "Waning Gibbous";
      illumination = Math.round((1 - ((phase - 14.765) / 29.53058867)) * 100);
    } else if (phase < 23.99361) {
      phaseName = "Last Quarter";
      illumination = 50;
    } else {
      phaseName = "Waning Crescent";
      illumination = Math.round((1 - ((phase - 14.765) / 29.53058867)) * 100);
    }
    
    let note = null;
    if (phaseName === "Full Moon") {
      note = "Bright moon tonight - best for night activities";
    } else if (phaseName === "New Moon") {
      note = "Dark skies tonight - perfect for stargazing";
    }
    
    return new Response(JSON.stringify({
      ok: true,
      source: "Astronomical Calculation",
      retrievedAt,
      sourceTimestamp: now.toISOString(),
      lat,
      lon,
      units: {},
      data: {
        phase: phaseName,
        illumination,
        note
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
        message: err.message || "Exception in moon function",
        details: err.stack
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});