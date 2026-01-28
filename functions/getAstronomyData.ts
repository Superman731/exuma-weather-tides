export default async function getAstronomyData() {
  // Tropic of Cancer Beach, Exuma coordinates
  const latitude = 23.4334;
  const longitude = -75.6932;
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // Using sunrise-sunset.org API (free, no key needed)
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${today}&formatted=0`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      const formatTime = (utcTime) => {
        const date = new Date(utcTime);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Nassau' });
      };
      
      // Calculate moon phase using astronomical algorithms
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      
      // Julian date calculation
      const a = Math.floor((14 - month) / 12);
      const y = year + 4800 - a;
      const m = month + 12 * a - 3;
      const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
      
      // Moon phase calculation
      const daysSinceNewMoon = jd - 2451549.5;
      const newMoons = daysSinceNewMoon / 29.53;
      const phase = (newMoons - Math.floor(newMoons)) * 29.53;
      
      let phaseName, illumination;
      if (phase < 1.84566) {
        phaseName = 'New Moon';
        illumination = 0;
      } else if (phase < 5.53699) {
        phaseName = 'Waxing Crescent';
        illumination = Math.round(phase * 3.4);
      } else if (phase < 9.22831) {
        phaseName = 'First Quarter';
        illumination = 50;
      } else if (phase < 12.91963) {
        phaseName = 'Waxing Gibbous';
        illumination = 50 + Math.round((phase - 9.23) * 13.5);
      } else if (phase < 16.61096) {
        phaseName = 'Full Moon';
        illumination = 100;
      } else if (phase < 20.30228) {
        phaseName = 'Waning Gibbous';
        illumination = 100 - Math.round((phase - 16.61) * 13.5);
      } else if (phase < 23.99361) {
        phaseName = 'Last Quarter';
        illumination = 50;
      } else if (phase < 27.68493) {
        phaseName = 'Waning Crescent';
        illumination = Math.round((29.53 - phase) * 3.4);
      } else {
        phaseName = 'New Moon';
        illumination = 0;
      }
      
      const sunrise = new Date(data.results.sunrise);
      const sunset = new Date(data.results.sunset);
      const dayLength = (sunset - sunrise) / 1000 / 60 / 60;
      const hours = Math.floor(dayLength);
      const minutes = Math.round((dayLength - hours) * 60);
      
      // Calculate golden hour (approximately 1 hour before sunset)
      const goldenHourStart = new Date(sunset.getTime() - 60 * 60 * 1000);
      const goldenHour = `${formatTime(goldenHourStart.toISOString())} - ${formatTime(data.results.sunset)}`;
      
      // Calculate solar noon
      const solarNoon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
      
      // Calculate twilight times
      const civilTwilightEnd = new Date(data.results.civil_twilight_end);
      const nauticalTwilightEnd = new Date(data.results.nautical_twilight_end);
      const astroTwilightEnd = new Date(data.results.astronomical_twilight_end);
      
      return {
        sunData: {
          daylightLength: `${hours}h ${minutes}m`,
          goldenHour: goldenHour,
          uvIndex: 7, // Typical for Bahamas in January
          solarNoon: formatTime(solarNoon.toISOString()),
          twilight: {
            civil: `${formatTime(data.results.sunset)} - ${formatTime(data.results.civil_twilight_end)}`,
            nautical: `${formatTime(data.results.civil_twilight_end)} - ${formatTime(data.results.nautical_twilight_end)}`,
            astronomical: `${formatTime(data.results.nautical_twilight_end)} - ${formatTime(data.results.astronomical_twilight_end)}`
          }
        },
        astronomy: {
          sunrise: formatTime(data.results.sunrise),
          sunset: formatTime(data.results.sunset),
          moonPhase: phaseName
        },
        moonData: {
          phase: phaseName,
          illumination: illumination,
          moonrise: 'Varies',
          moonset: 'Varies'
        },
        skyData: {
          visiblePlanets: ['Venus', 'Jupiter'],
          stargazingWindow: `${formatTime(astroTwilightEnd.toISOString())} - ${formatTime(data.results.astronomical_twilight_begin)}`,
          constellation: 'Orion (visible in January)',
          milkyWayVisibility: illumination < 30 ? 'Excellent' : illumination < 60 ? 'Good' : 'Fair',
          meteorShower: 'None tonight',
          satelliteDensity: 'Moderate - Check ISS flyovers'
        },
        contextData: {
          latitude: '23.43° N',
          longitude: '75.69° W',
          seasonalMarker: `${Math.round((new Date('2026-03-20') - now) / (1000 * 60 * 60 * 24))} days until Spring Equinox`,
          seaState: 'Check wind conditions'
        },
        lifestyleData: {
          fireWeather: 'Perfect - low humidity',
          swimWeather: 'Perfect - 78°F water'
        }
      };
    }
  } catch (error) {
    console.error('Astronomy API error:', error);
  }
  
  // Fallback data
  return {
    sunData: {
      daylightLength: '11h 3m',
      goldenHour: '5:15 PM - 5:47 PM',
      uvIndex: 7,
      solarNoon: '12:15 PM',
      twilight: {
        civil: '5:47 PM - 6:09 PM',
        nautical: '6:09 PM - 6:35 PM',
        astronomical: '6:35 PM - 7:00 PM'
      }
    },
    astronomy: {
      sunrise: '6:44 AM',
      sunset: '5:47 PM',
      moonPhase: 'First Quarter'
    },
    moonData: {
      phase: 'First Quarter',
      illumination: 50,
      moonrise: 'Varies',
      moonset: 'Varies'
    },
    skyData: {
      visiblePlanets: ['Venus', 'Jupiter'],
      stargazingWindow: '7:00 PM - 5:00 AM',
      constellation: 'Orion (visible in January)',
      milkyWayVisibility: 'Good',
      meteorShower: 'None tonight',
      satelliteDensity: 'Moderate'
    },
    contextData: {
      latitude: '23.43° N',
      longitude: '75.69° W',
      seasonalMarker: '51 days until Spring Equinox',
      seaState: 'Check wind conditions'
    },
    lifestyleData: {
      fireWeather: 'Perfect',
      swimWeather: 'Perfect'
    }
  };
}