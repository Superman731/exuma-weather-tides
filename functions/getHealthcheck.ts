export default async function getHealthcheck() {
  try {
    const latitude = 23.439714577294154;
    const longitude = -75.60141194341342;
    const retrievedAt = new Date().toISOString();
    
    return {
      ok: true,
      source: "internal",
      retrievedAt,
      sourceTimestamp: null,
      lat: latitude,
      lon: longitude,
      units: {},
      data: { 
        message: "healthcheck ok",
        timestamp: retrievedAt,
        runtime: "base44-backend"
      },
      error: null
    };
  } catch (err) {
    return {
      ok: false,
      source: "internal",
      retrievedAt: new Date().toISOString(),
      sourceTimestamp: null,
      lat: 23.439714577294154,
      lon: -75.60141194341342,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Unknown error",
        details: err.stack || JSON.stringify(err)
      }
    };
  }
}