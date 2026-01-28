/**
 * Base44 backend function caller
 * Base path confirmed: /function
 */

const BASE_PATH = '/function';

export async function callFunction(functionName, payload = {}) {
  const url = `${BASE_PATH}/${functionName}`;
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
      // Not JSON - likely HTML error page
      return {
        ok: false,
        error: {
          message: `HTTP ${response.status} - Non-JSON response`,
          details: responseText.substring(0, 300),
          status: response.status,
          url
        },
        _debug: {
          url,
          status: response.status,
          duration,
          responsePreview: responseText.substring(0, 300)
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
        },
        _debug: {
          url,
          status: response.status,
          duration,
          responsePreview: responseText.substring(0, 300)
        }
      };
    }
    
    return {
      ...data,
      _debug: {
        url,
        status: response.status,
        duration
      }
    };
    
  } catch (error) {
    return {
      ok: false,
      error: {
        message: `Network Error: ${error.message}`,
        details: error.stack || String(error),
        url
      },
      _debug: {
        url,
        status: 0,
        duration: Date.now() - startTime,
        exception: error.message
      }
    };
  }
}