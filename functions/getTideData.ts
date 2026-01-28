export default async function getTideData() {
  // Tropic of Cancer Beach, Exuma coordinates
  const latitude = 23.4334;
  const longitude = -75.6932;
  
  try {
    // WorldTides API - free tier allows limited requests
    const response = await fetch(
      `https://www.worldtides.info/api/v3?heights&extremes&lat=${latitude}&lon=${longitude}&key=f8e0ea4a-d7f5-48fc-9baa-1c9d8dcf232d`
    );
    
    if (!response.ok) {
      throw new Error('Tide API failed');
    }
    
    const data = await response.json();
    
    // Get today's extremes (highs and lows)
    const now = new Date();
    const todayExtremes = data.extremes?.filter(extreme => {
      const extremeDate = new Date(extreme.dt * 1000);
      return extremeDate.toDateString() === now.toDateString();
    }) || [];
    
    const highTides = todayExtremes.filter(e => e.type === 'High');
    const lowTides = todayExtremes.filter(e => e.type === 'Low');
    
    // Find next high and low tide
    const nextHigh = highTides.find(t => new Date(t.dt * 1000) > now) || highTides[0];
    const nextLow = lowTides.find(t => new Date(t.dt * 1000) > now) || lowTides[0];
    
    if (nextHigh && nextLow) {
      return {
        highTide: new Date(nextHigh.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true,
          timeZone: 'America/Nassau'
        }),
        highTideHeight: `${(nextHigh.height * 3.28084).toFixed(1)} ft`,
        lowTide: new Date(nextLow.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true,
          timeZone: 'America/Nassau'
        }),
        lowTideHeight: `${(nextLow.height * 3.28084).toFixed(1)} ft`
      };
    }
  } catch (error) {
    console.error('Tide API error:', error);
  }
  
  // Fallback to static data for Jan 28, 2026
  return {
    highTide: '1:00 PM',
    highTideHeight: '2.5 ft',
    lowTide: '7:00 AM',
    lowTideHeight: '0.5 ft'
  };
}