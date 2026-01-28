/**
 * Backend-safe HTTP helper for Base44 functions
 * Attempts multiple fetch methods and provides detailed error info
 */
export async function httpGetJson(url, label = "API") {
  let fetchMethod = null;
  let fetchSource = null;
  
  // Try to determine which fetch method is available
  try {
    if (typeof fetch !== 'undefined') {
      fetchMethod = fetch;
      fetchSource = "global fetch";
    } else {
      throw new Error("No fetch method available in backend runtime");
    }
  } catch (err) {
    throw new Error(`Cannot determine fetch method: ${err.message}`);
  }
  
  let response;
  let responseText;
  let statusCode;
  
  try {
    // Attempt fetch
    response = await fetchMethod(url);
    statusCode = response.status;
    responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(
        `HTTP ${statusCode} from ${label}. Response: ${responseText.substring(0, 200)}`
      );
    }
    
    // Try to parse JSON
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (parseErr) {
      throw new Error(
        `${label} returned ${statusCode} but invalid JSON. ` +
        `Parse error: ${parseErr.message}. ` +
        `Response text: ${responseText.substring(0, 200)}`
      );
    }
    
    return {
      ok: true,
      status: statusCode,
      json,
      text: responseText,
      fetchSource
    };
    
  } catch (err) {
    return {
      ok: false,
      status: statusCode || 0,
      json: null,
      text: responseText || null,
      fetchSource,
      error: {
        message: err.message,
        stack: err.stack,
        url,
        label
      }
    };
  }
}