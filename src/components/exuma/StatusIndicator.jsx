import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { callFunction } from './functionPathResolver';

export default function StatusIndicator() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'connected' | 'error'
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await callFunction('ping?action=health', {});
        if (result.ok) {
          setStatus('connected');
          setLastCheck(new Date().toLocaleTimeString());
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700">
        <Loader className="w-4 h-4 text-gray-400 animate-spin" />
        <span className="text-gray-300 text-xs">Connecting...</span>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-green-700/50">
        <CheckCircle className="w-4 h-4 text-green-400" />
        <span className="text-green-300 text-xs">Data Connected</span>
        {lastCheck && <span className="text-gray-500 text-xs ml-2">{lastCheck}</span>}
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-red-700/50">
      <XCircle className="w-4 h-4 text-red-400" />
      <span className="text-red-300 text-xs">Connection Error</span>
    </div>
  );
}