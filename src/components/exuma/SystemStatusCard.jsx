import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function SystemStatusCard({ lastUpdated, onRefresh, isLoading }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className="text-sky-200/60 text-xs">
            {isOnline ? 'Connected' : 'Offline'}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 text-sky-200/60 hover:text-sky-200 transition-colors text-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {lastUpdated && (
            <span>
              {lastUpdated.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </span>
          )}
        </button>
      </div>

      <div className="flex justify-center pt-4 border-t border-white/10">
        <div className="bg-white p-3 rounded-lg">
          <QRCode
            value={window.location.href}
            size={80}
            level="L"
          />
        </div>
      </div>
      <p className="text-center text-sky-200/40 text-xs mt-2">Scan for mobile view</p>
    </div>
  );
}