import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function DebugPanel({ apiCalls = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (apiCalls.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-2xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900 text-white px-4 py-2 rounded-t-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        Debug Panel ({apiCalls.length} calls)
      </button>
      
      {isOpen && (
        <div className="bg-gray-900 border border-gray-700 rounded-t-lg max-h-96 overflow-y-auto text-xs font-mono">
          {apiCalls.map((call, index) => (
            <div key={index} className="border-b border-gray-700 p-3">
              <div className="flex items-center gap-2 mb-2">
                {call.ok ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-white font-semibold">{call.functionName}</span>
                <span className={`px-2 py-0.5 rounded ${call.ok ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                  {call.ok ? 'OK' : 'FAIL'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-gray-400">
                <div>
                  <span className="text-gray-500">Start:</span> {call.startTime}
                </div>
                <div>
                  <span className="text-gray-500">End:</span> {call.endTime}
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span> {call.duration}ms
                </div>
                <div>
                  <span className="text-gray-500">Source:</span> {call.source || 'N/A'}
                </div>
                {call.lat && call.lon && (
                  <>
                    <div>
                      <span className="text-gray-500">Lat:</span> {call.lat}
                    </div>
                    <div>
                      <span className="text-gray-500">Lon:</span> {call.lon}
                    </div>
                  </>
                )}
              </div>
              
              {call.error && (
                <div className="mt-2 p-2 bg-red-900/30 rounded text-red-200">
                  <div className="font-semibold">Error: {call.error.message}</div>
                  <div className="text-xs mt-1">{call.error.details}</div>
                </div>
              )}
              
              {call.responsePreview && (
                <div className="mt-2 p-2 bg-gray-800 rounded text-gray-300 max-h-24 overflow-y-auto">
                  <div className="text-gray-500 mb-1">Response (first 300 chars):</div>
                  <pre className="whitespace-pre-wrap break-words">{call.responsePreview}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}