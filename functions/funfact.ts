Deno.serve(async (req) => {
  const retrievedAt = new Date().toISOString();
  
  try {
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
    
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      source: "Local Facts",
      retrievedAt,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Exception in funfact function",
        details: err.stack
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});