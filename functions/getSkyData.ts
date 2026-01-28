export default async function getSkyData() {
  const latitude = 23.4334;
  const longitude = -75.6932;
  const retrievedAt = new Date().toISOString();
  
  try {
    // Constellation by season (Northern Hemisphere, tropical latitude)
    const month = new Date().getMonth(); // 0-11
    let constellation = '';
    let visiblePlanets = [];
    
    // Seasonal constellations visible from Exuma
    if (month >= 0 && month <= 2) { // Jan-Mar: Winter
      constellation = 'Orion - Look south for the distinctive belt of three stars';
      visiblePlanets = ['Venus (evening)', 'Jupiter', 'Mars'];
    } else if (month >= 3 && month <= 5) { // Apr-Jun: Spring
      constellation = 'Leo - Look for the backwards question mark pattern';
      visiblePlanets = ['Venus', 'Saturn (dawn)', 'Jupiter'];
    } else if (month >= 6 && month <= 8) { // Jul-Sep: Summer
      constellation = 'Scorpius - Red star Antares marks the scorpion\'s heart';
      visiblePlanets = ['Saturn (evening)', 'Jupiter', 'Venus (dawn)'];
    } else { // Oct-Dec: Fall
      constellation = 'Pegasus - The great square in the eastern sky';
      visiblePlanets = ['Jupiter (evening)', 'Saturn', 'Venus'];
    }
    
    // Calculate moon phase for stargazing quality (simplified)
    const now = new Date();
    const daysIntoLunarCycle = ((now - new Date('2000-01-06')) / (1000 * 60 * 60 * 24)) % 29.53;
    const moonPhase = daysIntoLunarCycle / 29.53;
    
    let stargazingWindow = '';
    let milkyWayVisibility = '';
    
    if (moonPhase < 0.15 || moonPhase > 0.85) { // New moon ±3 days
      stargazingWindow = '9:00 PM - 5:00 AM (Dark skies all night)';
      milkyWayVisibility = 'Excellent';
    } else if (moonPhase < 0.35 || moonPhase > 0.65) {
      stargazingWindow = '10:00 PM - 4:00 AM (Moon sets/rises mid-night)';
      milkyWayVisibility = 'Good';
    } else if (moonPhase >= 0.45 && moonPhase <= 0.55) { // Full moon ±3 days
      stargazingWindow = '3:00 AM - 5:00 AM (Moon bright most of night)';
      milkyWayVisibility = 'Poor';
    } else {
      stargazingWindow = '11:00 PM - 3:00 AM (Partial moonlight)';
      milkyWayVisibility = 'Fair';
    }
    
    // Exuma has minimal light pollution
    const satelliteDensity = 'High - Expect 3-5 visible per hour';
    
    // Notable meteor showers by month
    let meteorShower = null;
    if (month === 0) meteorShower = 'Quadrantids (Jan 3-4) - Up to 40 meteors/hour';
    else if (month === 3) meteorShower = 'Lyrids (Apr 22-23) - Up to 18 meteors/hour';
    else if (month === 4) meteorShower = 'Eta Aquarids (May 6-7) - Up to 60 meteors/hour';
    else if (month === 7) meteorShower = 'Perseids (Aug 12-13) - Up to 100 meteors/hour';
    else if (month === 9) meteorShower = 'Orionids (Oct 21-22) - Up to 25 meteors/hour';
    else if (month === 10) meteorShower = 'Leonids (Nov 17-18) - Up to 15 meteors/hour';
    else if (month === 11) meteorShower = 'Geminids (Dec 13-14) - Up to 120 meteors/hour';
    
    return {
      ok: true,
      source: "Astronomical Calculation",
      retrievedAt,
      sourceTimestamp: null,
      lat: latitude,
      lon: longitude,
      units: {},
      data: {
        constellation,
        visiblePlanets,
        stargazingWindow,
        milkyWayVisibility,
        satelliteDensity,
        meteorShower
      },
      error: null
    };
    
  } catch (error) {
    return {
      ok: false,
      source: "Astronomical Calculation",
      retrievedAt,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 500,
        message: "Sky data calculation error",
        details: error.message
      }
    };
  }
}