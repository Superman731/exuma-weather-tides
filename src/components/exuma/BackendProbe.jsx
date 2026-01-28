import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export default function BackendProbe() {
  const [probeResults, setProbeResults] = useState([]);
  const [isProbing, setIsProbing] = useState(false);

  const probeEndpoint = async (path, method = 'GET') => {
    const startTime = Date.now();
    try {
      const response = await fetch(path, { method });
      const duration = Date.now() - startTime;
      const text = await response.text();
      
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        path,
        method,
        status: response.status,
        statusText: response.statusText,
        duration,
        headers: JSON.stringify(headers, null, 2),
        body: text.substring(0, 1000),
        bodyLength: text.length,
        ok: response.ok
      };
    } catch (error) {
      return {
        path,
        method,
        status: 0,
        statusText: 'Network Error',
        duration: Date.now() - startTime,
        headers: 'N/A',
        body: error.message,
        bodyLength: 0,
        ok: false
      };
    }
  };

  const runProbe = async () => {
    setIsProbing(true);
    const results = [];

    // Test ping
    results.push(await probeEndpoint('/functions/ping', 'GET'));
    results.push(await probeEndpoint('/functions/ping', 'POST'));
    
    // Test healthcheck
    results.push(await probeEndpoint('/functions/healthcheck', 'GET'));
    results.push(await probeEndpoint('/functions/healthcheck', 'POST'));
    
    // Test a known working route (if any)
    results.push(await probeEndpoint('/functions/getWeatherData', 'POST'));

    setProbeResults(results);
    setIsProbing(false);
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-3xl max-h-[80vh] overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold">Backend Probe</h3>
        </div>
        <button
          onClick={runProbe}
          disabled={isProbing}
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded text-sm"
        >
          {isProbing ? 'Probing...' : 'Run Probe'}
        </button>
      </div>

      {probeResults.length > 0 && (
        <div className="space-y-4 text-xs font-mono">
          {probeResults.map((result, index) => (
            <div key={index} className={`p-3 rounded border ${result.ok ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">
                  {result.method} {result.path}
                </span>
                <span className={`px-2 py-1 rounded ${result.ok ? 'bg-green-700' : 'bg-red-700'} text-white`}>
                  {result.status} {result.statusText}
                </span>
              </div>
              <div className="text-gray-400 space-y-1">
                <div>Duration: {result.duration}ms</div>
                <div>Body Length: {result.bodyLength} chars</div>
              </div>
              <div className="mt-2">
                <div className="text-gray-500 mb-1">Headers:</div>
                <pre className="text-gray-300 bg-black/30 p-2 rounded overflow-x-auto">{result.headers}</pre>
              </div>
              <div className="mt-2">
                <div className="text-gray-500 mb-1">Response Body (first 1000 chars):</div>
                <pre className="text-gray-300 bg-black/30 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">{result.body}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}