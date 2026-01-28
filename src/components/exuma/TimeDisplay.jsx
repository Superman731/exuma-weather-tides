import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function TimeDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Exuma is in Eastern Time (UTC-5, no DST observed in Bahamas)
  const exumaTime = new Date(time.toLocaleString('en-US', { timeZone: 'America/Nassau' }));

  return (
    <div className="text-center">
      <p className="text-sky-200/80 uppercase tracking-[0.3em] text-sm font-medium mb-2">
        Exuma, Bahamas
      </p>
      <h1 className="text-7xl md:text-9xl font-extralight text-white tracking-tight">
        {format(exumaTime, 'h:mm')}
        <span className="text-4xl md:text-5xl text-sky-200/60 ml-2">
          {format(exumaTime, 'ss')}
        </span>
      </h1>
      <p className="text-2xl md:text-3xl text-sky-100/90 font-light mt-4">
        {format(exumaTime, 'EEEE, MMMM d, yyyy')}
      </p>
    </div>
  );
}