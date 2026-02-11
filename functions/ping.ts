import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Parse body for action if not in query
    let bodyAction = action;
    if (!bodyAction) {
      try {
        const body = await req.json();
        bodyAction = body.action;
      } catch {
        // ignore
      }
    }

    const lat = 23.4397;
    const lon = -75.5970;

    // Health check
    if (bodyAction === 'health') {
      return Response.json({
        ok: true,
        message: 'pong',
        timestamp: new Date().toISOString()
      });
    }

    // Weather
    if (bodyAction === 'weather') {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,uv_index,sunshine_duration&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunshine_duration,wind_gusts_10m_max&timezone=America%2FNassau&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=7`;

      // Get water temperature from Open-Meteo Marine API
      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction&hourly=sea_surface_temperature&timezone=America%2FNassau&temperature_unit=fahrenheit`;

      const [weatherResponse, marineResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(marineUrl)
      ]);

      const data = await weatherResponse.json();
      const marineData = await marineResponse.json();


      const weatherCodes = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
        61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow',
        75: 'Heavy snow', 77: 'Snow grains', 80: 'Light showers', 81: 'Showers',
        82: 'Heavy showers', 85: 'Light snow showers', 86: 'Snow showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm'
      };

      const dailyData = data.daily?.time?.map((date, i) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        weatherCode: data.daily.weather_code[i],
        condition: weatherCodes[data.daily.weather_code[i]] || 'Unknown',
        high: data.daily.temperature_2m_max[i],
        low: data.daily.temperature_2m_min[i],
        rainChance: data.daily.precipitation_probability_max[i] || 0,
        uvIndex: data.daily.uv_index_max[i] || null,
        sunshineDuration: data.daily.sunshine_duration[i] || null,
        windGusts: data.daily.wind_gusts_10m_max[i] ? Math.round(data.daily.wind_gusts_10m_max[i]) : null
      })) || [];

      return Response.json({
        ok: true,
        source: 'Open-Meteo API',
        retrievedAt: new Date().toISOString(),
        lat, lon,
        data: {
          current: {
            temperature: Math.round(data.current?.temperature_2m || 0),
            feelsLike: Math.round(data.current?.apparent_temperature || 0),
            condition: weatherCodes[data.current?.weather_code] || 'Unknown',
            weatherCode: data.current?.weather_code,
            humidity: data.current?.relative_humidity_2m || 0,
            windSpeed: Math.round(data.current?.wind_speed_10m || 0),
            windDirection: data.current?.wind_direction_10m,
            windGusts: Math.round(data.current?.wind_gusts_10m || 0),
            pressure: Math.round(data.current?.pressure_msl || 0),
            uvIndex: data.current?.uv_index || null,
            sunshineHours: data.current?.sunshine_duration ? (data.current.sunshine_duration / 3600).toFixed(1) : null,
            waterTemp: marineData.hourly?.sea_surface_temperature?.[0] ? Math.round(marineData.hourly.sea_surface_temperature[0]) : null,
            waveHeight: marineData.current?.wave_height ? (marineData.current.wave_height * 3.28084).toFixed(1) : null,
            wavePeriod: marineData.current?.wave_period || null
          },
          today: {
            tempHigh: dailyData[0]?.high || 0,
            tempLow: dailyData[0]?.low || 0,
            condition: dailyData[0]?.condition || 'Unknown',
            uvIndex: dailyData[0]?.uvIndex || null,
            sunshineDuration: dailyData[0]?.sunshineDuration ? (dailyData[0].sunshineDuration / 3600).toFixed(1) : null,
            windGusts: dailyData[0]?.windGusts || null
          },
          forecast: dailyData.slice(1, 7)
        }
      });
    }

    // Tides - Using NOAA free API for Exuma (Settlement Point, Bahamas)
      if (bodyAction === 'tides') {
        const stationId = '9710441'; // NOAA station: Settlement Point, Bahamas
      const today = new Date();
      const beginDate = today.toISOString().split('T')[0].replace(/-/g, '');
      const endDate = new Date(today.getTime() + 86400000).toISOString().split('T')[0].replace(/-/g, '');

      const tideUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${beginDate}&end_date=${endDate}&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=base44&format=json`;

      const response = await fetch(tideUrl);
      const data = await response.json();

      if (data.error) {
        return Response.json({
          ok: false,
          error: { message: 'NOAA Tide API error', details: data.error?.message || 'Unknown error' }
        });
      }

      const now = Date.now();
      const predictions = data.predictions || [];

      const highTides = predictions.filter(t => t.type === 'H').map(t => ({
        time: new Date(t.t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        height: `${parseFloat(t.v).toFixed(1)} ft`,
        timestamp: new Date(t.t).getTime()
      }));

      const lowTides = predictions.filter(t => t.type === 'L').map(t => ({
        time: new Date(t.t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        height: `${parseFloat(t.v).toFixed(1)} ft`,
        timestamp: new Date(t.t).getTime()
      }));

      const nextHigh = highTides.find(t => t.timestamp > now);
      const nextLow = lowTides.find(t => t.timestamp > now);

      let tideStatus = 'Unknown';
      if (nextHigh && nextLow) {
        tideStatus = nextHigh.timestamp < nextLow.timestamp ? 'Rising' : 'Falling';
      }

      return Response.json({
        ok: true,
        source: 'NOAA Tides & Currents (Free)',
        retrievedAt: new Date().toISOString(),
        lat, lon,
        data: {
          highTides: highTides.slice(0, 2),
          lowTides: lowTides.slice(0, 2),
          nextHigh: nextHigh || highTides[0] || null,
          nextLow: nextLow || lowTides[0] || null,
          tideStatus
        }
      });
    }

    // Astronomy
    if (bodyAction === 'astronomy') {
      const astroUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
      const response = await fetch(astroUrl);
      const data = await response.json();

      if (data.status !== 'OK') {
        return Response.json({
          ok: false,
          error: { message: 'Astronomy API error' }
        });
      }

      const formatTime = (utcTime) => {
        return new Date(utcTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'America/Nassau'
        });
      };

      return Response.json({
        ok: true,
        source: 'sunrise-sunset.org',
        retrievedAt: new Date().toISOString(),
        lat, lon,
        data: {
          sunrise: formatTime(data.results.sunrise),
          sunset: formatTime(data.results.sunset),
          solarNoon: formatTime(data.results.solar_noon),
          dayLength: data.results.day_length,
          civilTwilight: {
            begin: formatTime(data.results.civil_twilight_begin),
            end: formatTime(data.results.civil_twilight_end)
          },
          nauticalTwilight: {
            begin: formatTime(data.results.nautical_twilight_begin),
            end: formatTime(data.results.nautical_twilight_end)
          },
          astronomicalTwilight: {
            begin: formatTime(data.results.astronomical_twilight_begin),
            end: formatTime(data.results.astronomical_twilight_end)
          }
        }
      });
    }

    // Moon
    if (bodyAction === 'moon') {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();

      const jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) + 
                 Math.floor(275 * month / 9) + day + 1721013.5;
      const daysSinceNew = (jd - 2451550.1) % 29.53058867;
      const illumination = Math.round((1 - Math.cos(daysSinceNew * 2 * Math.PI / 29.53058867)) / 2 * 100);

      let phase = 'Unknown';
      let note = '';

      if (daysSinceNew < 1.84566) {
        phase = 'New Moon';
        note = 'Perfect for stargazing - dark skies tonight!';
      } else if (daysSinceNew < 5.53699) {
        phase = 'Waxing Crescent';
        note = 'Growing light - good for evening activities';
      } else if (daysSinceNew < 9.22831) {
        phase = 'First Quarter';
        note = 'Half moon rising - balanced lighting';
      } else if (daysSinceNew < 12.91963) {
        phase = 'Waxing Gibbous';
        note = 'Nearly full - bright evenings ahead';
      } else if (daysSinceNew < 16.61096) {
        phase = 'Full Moon';
        note = 'Bright moonlight - great for night walks!';
      } else if (daysSinceNew < 20.30228) {
        phase = 'Waning Gibbous';
        note = 'Still bright - excellent visibility';
      } else if (daysSinceNew < 23.99361) {
        phase = 'Last Quarter';
        note = 'Half moon setting - morning light';
      } else {
        phase = 'Waning Crescent';
        note = 'Darkening skies - stars emerging';
      }

      // Get moonrise/moonset from astronomy API
      const astroUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
      const astroResponse = await fetch(astroUrl);
      const astroData = await astroResponse.json();

      const formatTime = (utcTime) => {
        return new Date(utcTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'America/Nassau'
        });
      };

      const moonrise = astroData.results?.moon_phase?.moonrise ? formatTime(astroData.results.moon_phase.moonrise) : null;
      const moonset = astroData.results?.moon_phase?.moonset ? formatTime(astroData.results.moon_phase.moonset) : null;

      return Response.json({
        ok: true,
        source: 'Calculated + sunrise-sunset.org',
        retrievedAt: new Date().toISOString(),
        lat, lon,
        data: { phase, illumination, note, moonrise, moonset }
      });
    }

    // Sky
    if (bodyAction === 'sky') {
      // Fetch weather data for cloud cover
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover,relative_humidity_2m&timezone=America%2FNassau`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      const now = new Date();
      const month = now.getMonth();
      const hour = now.getHours();

      const visiblePlanets = ['Venus', 'Mars', 'Jupiter', 'Saturn'];
      const constellations = month < 3 || month > 10 ? 
        ['Orion', 'Taurus', 'Gemini'] : 
        ['Scorpius', 'Sagittarius', 'Aquila'];

      const moonPhase = ((now.getDate() + month * 2.5) % 29.53);
      const moonIllumination = Math.round((1 - Math.cos(moonPhase * 2 * Math.PI / 29.53)) / 2 * 100);

      const cloudCover = weatherData.current?.cloud_cover || 50;
      const humidity = weatherData.current?.relative_humidity_2m || 70;

      // Calculate sky quality based on actual conditions
      let skyQuality = 'Moderate';
      let milkyWayVisible = false;

      if (cloudCover < 30 && moonIllumination < 40 && humidity < 75 && (hour >= 21 || hour < 4)) {
        skyQuality = 'Excellent';
        milkyWayVisible = true;
      } else if (cloudCover < 50 && moonIllumination < 60 && humidity < 85 && (hour >= 20 || hour < 5)) {
        skyQuality = 'Good';
        milkyWayVisible = moonIllumination < 40;
      } else if (cloudCover < 70 && (hour >= 20 || hour < 5)) {
        skyQuality = 'Fair';
        milkyWayVisible = false;
      } else {
        skyQuality = 'Poor';
        milkyWayVisible = false;
      }

      const meteorShowers = [
        { name: 'Quadrantids', months: [0] },
        { name: 'Lyrids', months: [3] },
        { name: 'Perseids', months: [7] },
        { name: 'Geminids', months: [11] }
      ];
      const activeShower = meteorShowers.find(s => s.months.includes(month));

      return Response.json({
        ok: true,
        source: 'Calculated + Open-Meteo',
        retrievedAt: new Date().toISOString(),
        lat, lon,
        data: {
          visiblePlanets,
          constellations,
          meteorShower: activeShower?.name || 'None currently active',
          milkyWayVisible,
          skyQuality,
          cloudCover,
          humidity
        }
      });
    }

    // Fun Fact
    if (bodyAction === 'funfact') {
      const facts = [
        "The Exumas consist of 365 cays and islands, one for each day of the year!",
        "The waters around Exuma are home to the famous swimming pigs at Pig Beach.",
        "Exuma Cays Land and Sea Park was the first protected area in the Caribbean.",
        "Thunderball Grotto, featured in James Bond films, is a popular snorkeling spot.",
        "The Exumas have some of the clearest water in the world with visibility up to 200 feet."
      ];

      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const factIndex = dayOfYear % facts.length;

      return Response.json({
        ok: true,
        source: 'Local Database',
        retrievedAt: new Date().toISOString(),
        data: {
          fact: facts[factIndex],
          factIndex,
          totalFacts: facts.length,
          rotationSchedule: 'Changes daily'
        }
      });
    }

    return Response.json({
      ok: false,
      error: { message: 'Unknown action', details: `Action: ${bodyAction}` }
    });

  } catch (error) {
    return Response.json({
      ok: false,
      error: {
        message: 'Server error',
        details: error.message
      }
    }, { status: 500 });
  }
});