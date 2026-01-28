export default async function getMoonData() {
  const latitude = 23.439714577294154;
  const longitude = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  
  // Calculate moon phase using astronomical algorithms (accurate)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  try {
    // Julian date calculation
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Moon phase calculation based on known new moon epoch
    const daysSinceNewMoon = jd - 2451549.5;
    const newMoons = daysSinceNewMoon / 29.53;
    const phase = (newMoons - Math.floor(newMoons)) * 29.53;
    
    let phaseName, illumination;
    if (phase < 1.84566) {
      phaseName = 'New Moon';
      illumination = 0;
    } else if (phase < 5.53699) {
      phaseName = 'Waxing Crescent';
      illumination = Math.round(phase * 3.4);
    } else if (phase < 9.22831) {
      phaseName = 'First Quarter';
      illumination = 50;
    } else if (phase < 12.91963) {
      phaseName = 'Waxing Gibbous';
      illumination = 50 + Math.round((phase - 9.23) * 13.5);
    } else if (phase < 16.61096) {
      phaseName = 'Full Moon';
      illumination = 100;
    } else if (phase < 20.30228) {
      phaseName = 'Waning Gibbous';
      illumination = 100 - Math.round((phase - 16.61) * 13.5);
    } else if (phase < 23.99361) {
      phaseName = 'Last Quarter';
      illumination = 50;
    } else if (phase < 27.68493) {
      phaseName = 'Waning Crescent';
      illumination = Math.round((29.53 - phase) * 3.4);
    } else {
      phaseName = 'New Moon';
      illumination = 0;
    }
    
    return {
      ok: true,
      source: "Astronomical Calculation",
      retrievedAt,
      sourceTimestamp: null,
      lat: latitude,
      lon: longitude,
      units: { illumination: "%" },
      data: {
        phase: phaseName,
        illumination,
        moonrise: null, // Not available without a paid API
        moonset: null,   // Not available without a paid API
        note: "Moonrise/moonset require a specialized API"
      },
      error: null
    };
    
  } catch (error) {
    return {
      ok: false,
      source: "Astronomical Calculation",
      retrievedAt,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 500,
        message: "Moon calculation failed",
        details: error.message
      }
    };
  }
}