/**
 * Simplified function caller - directly uses /functions/ping router
 */

export async function callFunction(functionPath, payload = {}) {
  // functionPath is expected to be like "ping?action=weather"
  const url = `/functions/${functionPath}`;
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const duration = Date.now() - startTime;
    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        ok: false,
        error: {
          message: `HTTP ${response.status} - Non-JSON response`,
          details: `${responseText.substring(0, 300)}`,
          status: response.status,
          url
        }
      };
    }
    
    if (!response.ok) {
      return {
        ok: false,
        error: {
          message: `HTTP ${response.status}`,
          details: JSON.stringify(data).substring(0, 300),
          status: response.status,
          url
        }
      };
    }
    
    return data;
    
  } catch (error) {
    return {
      ok: false,
      error: {
        message: `Network Error: ${error.message}`,
        details: error.stack || String(error),
        url
      }
    };
  }
}