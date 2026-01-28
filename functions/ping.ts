import { httpGetJson } from './_httpHelper.ts';

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'health';
  const lat = 23.439714577294154;
  const lon = -75.60141194341342;
  const retrievedAt = new Date().toISOString();

  try {
    switch (action) {
      case 'health':
        return new Response(JSON.stringify({
          ok: true,
          message: "pong",
          timestamp: retrievedAt
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'weather': {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=America/Nassau&forecast_days=7&temperature_unit=fahrenheit&wind_speed_unit=mph`;
        const result = await httpGetJson(weatherUrl, "Open-Meteo");
        
        if (!result.ok) {
          return new Response(JSON.stringify({
            ok: false,
            source: "Open-Meteo",
            retrievedAt,
            lat,
            lon,
            units: {},
            data: null,
            error: {
              status: result.status || 500,
              message: result.error?.message || "Open-Meteo fetch failed",
              details: result.text?.substring(0, 300)
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const data = result.json;
        if (!data.current || !data.daily) {
          return new Response(JSON.stringify({
            ok: false,
            source: "Open-Meteo",
            retrievedAt,
            lat,
            lon,
            units: {},
            data: null,
            error: { status: 500, message: "Incomplete data from API" }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const current = data.current;
        const daily = data.daily;
        
        const weatherCodeMap = {
          0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
          45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
          61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 80: 'Rain Showers', 95: 'Thunderstorm'
        };
        
        return new Response(JSON.stringify({
          ok: true,
          source: "Open-Meteo",
          retrievedAt,
          sourceTimestamp: current.time || null,
          lat,
          lon,
          units: { temperature: "°F", wind: "mph", pressure: "hPa", humidity: "%" },
          data: {
            current: {
              temperature: Math.round(current.temperature_2m),
              feelsLike: Math.round(current.apparent_temperature),
              condition: weatherCodeMap[current.weather_code] || 'Unknown',
              windSpeed: Math.round(current.wind_speed_10m),
              windGusts: Math.round(current.wind_gusts_10m),
              windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(current.wind_direction_10m / 45) % 8],
              humidity: current.relative_humidity_2m,
              cloudCover: current.cloud_cover,
              pressure: current.surface_pressure || null
            },
            today: {
              tempHigh: Math.round(daily.temperature_2m_max[0]),
              tempLow: Math.round(daily.temperature_2m_min[0]),
              condition: weatherCodeMap[daily.weather_code[0]] || 'Unknown',
              rainChance: daily.precipitation_probability_max[0] || 0,
              windSpeedMax: Math.round(daily.wind_speed_10m_max[0]),
              uvIndex: daily.uv_index_max[0] || null,
              sunrise: new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
              sunset: new Date(daily.sunset[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            },
            forecast: daily.time.slice(1, 8).map((date, i) => ({
              date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
              high: Math.round(daily.temperature_2m_max[i + 1]),
              low: Math.round(daily.temperature_2m_min[i + 1]),
              condition: weatherCodeMap[daily.weather_code[i + 1]] || 'Unknown',
              rainChance: daily.precipitation_probability_max[i + 1] || 0,
              windSpeedMax: Math.round(daily.wind_speed_10m_max[i + 1])
            }))
          },
          error: null
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case 'tides': {
        const apiKey = Deno.env.get('TIDE_API_KEY') || 'f8e0ea4a-d7f5-48fc-9baa-1c9d8dcf232d';
        
        if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
          return new Response(JSON.stringify({
            ok: false,
            source: "WorldTides",
            retrievedAt,
            lat,
            lon,
            units: {},
            data: null,
            error: {
              status: 401,
              message: "Missing TIDE_API_KEY environment variable",
              details: "Set TIDE_API_KEY in Base44 dashboard settings to enable tide data"
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const tideUrl = `https://www.worldtides.info/api/v3?heights&extremes&lat=${lat}&lon=${lon}&key=${apiKey}`;
        const result = await httpGetJson(tideUrl, "WorldTides");
        
        if (!result.ok) {
          return new Response(JSON.stringify({
            ok: false,
            source: "WorldTides",
            retrievedAt,
            lat,
            lon,
            units: {},
            data: null,
            error: {
              status: result.status || 500,
              message: result.error?.message || "WorldTides fetch failed",
              details: result.text?.substring(0, 300)
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const apiData = result.json;
        
        if (apiData.error) {
          return new Response(JSON.stringify({
            ok: false,
            source: "WorldTides",
            retrievedAt,
            lat,
            lon,
            units: {},
            data: null,
            error: {
              status: apiData.status || 400,
              message: "WorldTides API error",
              details: apiData.error
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (!apiData.extremes || !apiData.heights) {
          return new Response(JSON.stringify({
            ok: false,
            source: "WorldTides",
            retrievedAt,
            lat,
            lon,
            units: {},
            data: null,
            error: {
              status: 500,
              message: "Incomplete tide data from API"
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const todayExtremes = apiData.extremes.filter(e => {
          const eDate = new Date(e.dt * 1000);
          return eDate >= todayStart && eDate < todayEnd;
        });
        
        let highTide = null, lowTide = null;
        for (const extreme of todayExtremes) {
          const eDate = new Date(extreme.dt * 1000);
          const timeStr = eDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          
          if (extreme.type === 'High') {
            if (!highTide || eDate > now) {
              highTide = { time: timeStr, height: extreme.height.toFixed(1) };
            }
          } else if (extreme.type === 'Low') {
            if (!lowTide || eDate > now) {
              lowTide = { time: timeStr, height: extreme.height.toFixed(1) };
            }
          }
        }
        
        const nextExtreme = apiData.extremes.find(e => new Date(e.dt * 1000) > now);
        const tideStatus = nextExtreme ? (nextExtreme.type === 'High' ? 'Rising' : 'Falling') : 'Unknown';
        
        return new Response(JSON.stringify({
          ok: true,
          source: "WorldTides",
          retrievedAt,
          sourceTimestamp: null,
          lat,
          lon,
          units: { height: "feet" },
          data: { highTide, lowTide, tideStatus },
          error: null
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case 'astronomy': {
        const today = new Date().toISOString().split('T')[0];
        const astroUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${today}&formatted=0`;
        
        const result = await httpGetJson(astroUrl, "sunrise-sunset.org");
        
        if (!result.ok) {
          return new Response(JSON.stringify({
            ok: false,
            source: "sunrise-sunset.org",
            retrievedAt,
            lat,
            lon,
            units: {},
            data: null,
            error: {
              status: result.status || 500,
              message: result.error?.message || "Sunrise-sunset fetch failed",
              details: result.text?.substring(0, 300)
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const apiData = result.json;
        
        if (!apiData.results) {
          return new Response(JSON.stringify({
            ok: false,
            source: "sunrise-sunset.org",
            retrievedAt,
            lat,
            lon,
            units: {},
            data: null,
            error: {
              status: 500,
              message: "Invalid API response - missing results"
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const results = apiData.results;
        
        const formatTime = (utcString) => {
          const date = new Date(utcString);
          return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true,
            timeZone: 'America/Nassau'
          });
        };
        
        const dayLengthSeconds = results.day_length;
        const dayLengthHours = Math.floor(dayLengthSeconds / 3600);
        const dayLengthMinutes = Math.floor((dayLengthSeconds % 3600) / 60);
        
        return new Response(JSON.stringify({
          ok: true,
          source: "sunrise-sunset.org",
          retrievedAt,
          sourceTimestamp: null,
          lat,
          lon,
          units: {},
          data: {
            sunrise: formatTime(results.sunrise),
            sunset: formatTime(results.sunset),
            solarNoon: formatTime(results.solar_noon),
            dayLength: `${dayLengthHours}h ${dayLengthMinutes}m`,
            civilTwilightEnd: formatTime(results.civil_twilight_end),
            nauticalTwilightEnd: formatTime(results.nautical_twilight_end),
            astronomicalTwilightEnd: formatTime(results.astronomical_twilight_end),
            goldenHour: formatTime(results.sunset)
          },
          error: null
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case 'moon': {
        const now = new Date();
        const julianDay = (now.getTime() / 86400000) + 2440587.5;
        const daysSinceNewMoon = julianDay - 2451549.5;
        const newMoons = daysSinceNewMoon / 29.53058867;
        const phase = (newMoons % 1) * 29.53058867;
        
        let phaseName, illumination;
        if (phase < 1.84566) {
          phaseName = "New Moon";
          illumination = 0;
        } else if (phase < 5.53699) {
          phaseName = "Waxing Crescent";
          illumination = Math.round((phase / 29.53058867) * 100);
        } else if (phase < 9.22831) {
          phaseName = "First Quarter";
          illumination = 50;
        } else if (phase < 12.91963) {
          phaseName = "Waxing Gibbous";
          illumination = Math.round((phase / 29.53058867) * 100);
        } else if (phase < 16.61096) {
          phaseName = "Full Moon";
          illumination = 100;
        } else if (phase < 20.30228) {
          phaseName = "Waning Gibbous";
          illumination = Math.round((1 - ((phase - 14.765) / 29.53058867)) * 100);
        } else if (phase < 23.99361) {
          phaseName = "Last Quarter";
          illumination = 50;
        } else {
          phaseName = "Waning Crescent";
          illumination = Math.round((1 - ((phase - 14.765) / 29.53058867)) * 100);
        }
        
        let note = null;
        if (phaseName === "Full Moon") {
          note = "Bright moon tonight - best for night activities";
        } else if (phaseName === "New Moon") {
          note = "Dark skies tonight - perfect for stargazing";
        }
        
        return new Response(JSON.stringify({
          ok: true,
          source: "Astronomical Calculation",
          retrievedAt,
          sourceTimestamp: now.toISOString(),
          lat,
          lon,
          units: {},
          data: {
            phase: phaseName,
            illumination,
            note
          },
          error: null
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case 'sky': {
        const now = new Date();
        const month = now.getMonth();
        
        const constellations = {
          0: "Orion, Taurus", 1: "Orion, Gemini", 2: "Leo, Cancer", 3: "Leo, Virgo",
          4: "Virgo, Boötes", 5: "Scorpius, Libra", 6: "Sagittarius, Scorpius", 7: "Sagittarius, Aquila",
          8: "Pegasus, Aquarius", 9: "Pegasus, Andromeda", 10: "Andromeda, Cassiopeia", 11: "Orion, Taurus"
        };
        
        const visiblePlanets = month >= 3 && month <= 8 
          ? "Mars, Jupiter, Saturn" 
          : "Venus (evening), Jupiter, Saturn";
        
        const julianDay = (now.getTime() / 86400000) + 2440587.5;
        const daysSinceNewMoon = julianDay - 2451549.5;
        const moonAge = (daysSinceNewMoon % 29.53058867);
        const moonIllumination = Math.abs(50 - (moonAge / 29.53058867) * 100);
        
        const isDarkSkies = moonIllumination < 25;
        const stargazingWindow = isDarkSkies ? "11 PM - 2 AM (good)" : "After midnight (fair)";
        
        const milkyWayVisible = month >= 4 && month <= 9;
        
        const meteorShowers = {
          0: { name: "Quadrantids", date: "early January" },
          3: { name: "Lyrids", date: "late April" },
          4: { name: "Eta Aquariids", date: "early May" },
          7: { name: "Perseids", date: "mid August" },
          11: { name: "Geminids", date: "mid December" }
        };
        
        const shower = meteorShowers[month] || null;
        
        return new Response(JSON.stringify({
          ok: true,
          source: "Astronomical Calculation",
          retrievedAt,
          sourceTimestamp: now.toISOString(),
          lat,
          lon,
          units: {},
          data: {
            visiblePlanets,
            bestStargazing: stargazingWindow,
            constellations: constellations[month],
            milkyWayVisible,
            meteorShower: shower,
            satellitePasses: "ISS visible in evening hours"
          },
          error: null
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      case 'funfact': {
        const facts = [
          "The Exumas consist of 365 cays and islands - one for every day of the year.",
          "Swimming pigs live on Big Major Cay in the Exumas and swim out to greet visitors.",
          "The Exuma Cays Land and Sea Park was the first protected marine area in the Caribbean.",
          "Thunderball Grotto in the Exumas was featured in two James Bond films.",
          "The water in Exuma appears in 50+ shades of blue due to varying depths and sandy bottoms.",
          "Pirates once used the shallow waters of the Exumas as hideouts in the 1700s.",
          "The tropic of cancer runs through the Exumas at 23.5°N latitude.",
          "Compass Cay is home to nurse sharks that swim alongside visitors.",
          "The Exumas' Tropic of Cancer Beach is one of the most beautiful beaches in the world.",
          "George Town, Great Exuma is the capital and largest settlement of the Exuma district.",
          "The annual Exuma Regatta attracts sailors from around the world each April.",
          "Exuma's waters are so clear you can see fish from 100+ feet away.",
          "The sandbars in the Exumas shift with tides, creating new islands daily.",
          "Exuma Point is a favorite spot for bonefishing - considered the 'grey ghost' of fishing.",
          "Staniel Cay is home to the famous swimming pigs at Pig Beach.",
          "The Exuma Cays are popular filming locations for Hollywood movies.",
          "Exuma National Park protects 176 square miles of pristine ocean and islands.",
          "The blue holes in Exuma are underwater caves formed during the last ice age.",
          "Local Exumians celebrate their heritage with Junkanoo festivals.",
          "The Exuma Sound drops to depths over 6,000 feet just offshore.",
          "Fresh conch salad is a daily staple in the Exumas, caught fresh each morning."
        ];
        
        const nassauTime = new Date().toLocaleString('en-US', { timeZone: 'America/Nassau' });
        const nassauDate = new Date(nassauTime);
        const dayOfYear = Math.floor((nassauDate - new Date(nassauDate.getFullYear(), 0, 0)) / 86400000);
        const hour = nassauDate.getHours();
        const factIndex = (dayOfYear + Math.floor(hour / 4)) % facts.length;
        
        return new Response(JSON.stringify({
          ok: true,
          source: "Local Facts",
          retrievedAt,
          units: {},
          data: {
            fact: facts[factIndex],
            rotationSchedule: "Changes every 4 hours (Nassau time)",
            factIndex,
            totalFacts: facts.length
          },
          error: null
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({
          ok: false,
          error: {
            status: 400,
            message: `Unknown action: ${action}`,
            details: "Valid actions: health, weather, tides, astronomy, moon, sky, funfact"
          }
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: {
        status: 500,
        message: err.message || "Exception in ping router",
        details: err.stack
      },
      retrievedAt
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});