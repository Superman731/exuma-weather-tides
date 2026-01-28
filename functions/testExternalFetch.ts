import { httpGetJson } from './_httpHelper.js';

export default async function testExternalFetch() {
  const latitude = 23.439714577294154;
  const longitude = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=America%2FNassau`;
    
    const result = await httpGetJson(url, "Open-Meteo-Test");
    
    if (!result.ok) {
      return {
        ok: false,
        source: "Open-Meteo-Test",
        retrievedAt,
        sourceTimestamp: null,
        lat: latitude,
        lon: longitude,
        units: {},
        data: null,
        error: {
          status: result.status || 500,
          message: result.error?.message || "Fetch failed",
          details: JSON.stringify({
            error: result.error,
            text: result.text?.substring(0, 300),
            fetchSource: result.fetchSource
          })
        }
      };
    }
    
    return {
      ok: true,
      source: "Open-Meteo-Test",
      retrievedAt,
      sourceTimestamp: result.json?.current?.time || null,
      lat: latitude,
      lon: longitude,
      units: { temperature: "°C" },
      data: {
        temperature: result.json?.current?.temperature_2m,
        rawResponse: JSON.stringify(result.json).substring(0, 200),
        fetchSource: result.fetchSource
      },
      error: null
    };
    
  } catch (err) {
    return {
      ok: false,
      source: "Open-Meteo-Test",
      retrievedAt,
      sourceTimestamp: null,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Exception in testExternalFetch",
        details: err.stack || JSON.stringify(err)
      }
    };
  }
}