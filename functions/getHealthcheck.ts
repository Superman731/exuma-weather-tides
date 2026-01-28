Deno.serve(async (req) => {
  try {
    const latitude = 23.439714577294154;
    const longitude = -75.60141194341342;
    const retrievedAt = new Date().toISOString();
    
    const result = {
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
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const errorResult = {
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
    
    return new Response(JSON.stringify(errorResult), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});