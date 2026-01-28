/**
 * Base44 backend function caller with runtime path discovery
 * Only accepts endpoints that return valid JSON
 */

let cachedBasePath = null;
let discoveryPromise = null;

async function discoverBasePath() {
  const candidates = [
    '/.netlify/functions',
    '/api',
    '/function',
    '/functions'
  ];
  
  for (const basePath of candidates) {
    try {
      const response = await fetch(`${basePath}/ping?action=health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      
      // CRITICAL: Only accept if it's actually JSON, not HTML
      const isJson = contentType.includes('application/json') || 
                     (text.trim().startsWith('{') || text.trim().startsWith('['));
      const isHtml = text.trim().toLowerCase().startsWith('<!doctype') || 
                     text.trim().toLowerCase().startsWith('<html');
      
      if (response.ok && isJson && !isHtml) {
        console.log(`✓ Found valid function base path: ${basePath}`);
        return basePath;
      }
    } catch (error) {
      // Continue to next candidate
    }
  }
  
  throw new Error('Could not find valid JSON-returning function endpoint');
}

async function getBasePath() {
  if (cachedBasePath) {
    return cachedBasePath;
  }
  
  if (!discoveryPromise) {
    discoveryPromise = discoverBasePath();
  }
  
  cachedBasePath = await discoveryPromise;
  return cachedBasePath;
}

export async function callFunction(functionName, payload = {}) {
  const basePath = await getBasePath();
  const url = `${basePath}/${functionName}`;
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const duration = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    // Check if response is HTML (SPA fallback)
    const isHtml = responseText.trim().toLowerCase().startsWith('<!doctype') || 
                   responseText.trim().toLowerCase().startsWith('<html');
    
    if (isHtml) {
      return {
        ok: false,
        error: {
          message: `Function returned HTML instead of JSON - likely not deployed`,
          details: `URL: ${url}\nContent-Type: ${contentType}\nPreview: ${responseText.substring(0, 200)}`,
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
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return {
        ok: false,
        error: {
          message: `HTTP ${response.status} - Non-JSON response`,
          details: `Content-Type: ${contentType}\n${responseText.substring(0, 300)}`,
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
        url: `${basePath}/${functionName}`
      },
      _debug: {
        url: `${basePath}/${functionName}`,
        status: 0,
        duration: Date.now() - startTime,
        exception: error.message
      }
    };
  }
}