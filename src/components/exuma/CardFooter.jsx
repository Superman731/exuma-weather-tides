import React from 'react';

export default function CardFooter({ source, sourceTimestamp, retrievedAt, lat, lon }) {
  if (!source && !retrievedAt) {
    return null;
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      });
    } catch {
      return 'Invalid';
    }
  };

  return (
    <div className="mt-4 pt-3 border-t border-white/10 text-xs text-sky-200/40 space-y-1">
      {source && (
        <div>Source: {source}</div>
      )}
      {sourceTimestamp && (
        <div>Source Time: {formatTimestamp(sourceTimestamp)}</div>
      )}
      {retrievedAt && (
        <div>Retrieved: {formatTimestamp(retrievedAt)}</div>
      )}
      {lat && lon && (
        <div>Location: {lat}°N, {Math.abs(lon)}°W</div>
      )}
    </div>
  );
}