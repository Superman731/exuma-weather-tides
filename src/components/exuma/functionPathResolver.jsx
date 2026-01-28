/**
 * Runtime function path resolver for Base44 backend functions
 * Discovers the correct base path by testing ping endpoint
 */

let cachedBasePath = null;
let discoveryPromise = null;

async function discoverBasePath() {
  const candidatePaths = ['/function', '/functions', '/api/functions'];
  
  for (const basePath of candidatePaths) {
    try {
      const response = await fetch(`${basePath}/ping`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log(`✓ Discovered working function base path: ${basePath}`);
        return basePath;
      }
    } catch (error) {
      // Continue to next candidate
    }
  }
  
  throw new Error('Could not discover working function base path');
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
    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }
    
    if (!response.ok) {
      return {
        ok: false,
        error: {
          message: `HTTP ${response.status}`,
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
        message: error.message,
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