const exumaFacts = [
  "The Exumas consist of over 365 cays and islands, often said to be 'one for every day of the year.'",
  "The famous swimming pigs of Big Major Cay have become one of the Bahamas' most popular tourist attractions.",
  "Thunderball Grotto, a stunning underwater cave, was featured in two James Bond films.",
  "The Exuma Cays Land and Sea Park was the first of its kind in the world, established in 1958.",
  "Exuma's waters are known for their extraordinary clarity, with visibility often exceeding 200 feet.",
  "Nurse sharks can be hand-fed at Compass Cay, a unique wildlife experience in the Exumas.",
  "Staniel Cay hosted scenes from the James Bond film 'Thunderball' and 'Never Say Never Again.'",
  "The limestone formations in Exuma are over 150 million years old.",
  "Exuma is home to the endangered Bahamian rock iguana, found nowhere else on Earth.",
  "The Tropic of Cancer runs through Little Exuma, marked by a monument on the beach.",
  "Pirates once used the hidden coves of the Exumas as hideouts, including the notorious Blackbeard.",
  "The water in Exuma appears in 50+ shades of blue due to varying depths and sandy bottoms.",
  "Leaf Cay is home to a colony of friendly iguanas that greet visitors on the beach.",
  "The Exumas were largely uninhabited until Loyalists arrived after the American Revolution.",
  "Stocking Island's Chat 'N' Chill is famous for its Sunday pig roasts and conch salad.",
  "The sandbars of Exuma shift and change with the tides, creating new landscapes daily.",
  "Exuma's coral reefs are part of the third-largest barrier reef system in the world.",
  "David Copperfield owns several islands in the Exumas, including Musha Cay.",
  "The annual National Family Island Regatta in George Town is the Bahamas' biggest sailing event.",
  "Exuma salt was once a major export, with salt raking ponds still visible on Little Exuma."
];

Deno.serve(async (req) => {
  const latitude = 23.439714577294154;
  const longitude = -75.60141194341342;
  const retrievedAt = new Date().toISOString();
  
  try {
    const nassauTime = new Date().toLocaleString('en-US', { timeZone: 'America/Nassau' });
    const now = new Date(nassauTime);
    const hours = now.getHours();
    const day = now.getDate();
    
    const block = Math.floor(hours / 4);
    const factIndex = (day * 6 + block) % exumaFacts.length;
    
    const successResponse = {
      ok: true,
      source: "Local Facts",
      retrievedAt,
      sourceTimestamp: null,
      lat: latitude,
      lon: longitude,
      units: {},
      data: {
        fact: exumaFacts[factIndex],
        factIndex,
        totalFacts: exumaFacts.length,
        rotationSchedule: "Every 4 hours (Nassau time)"
      },
      error: null
    };
    
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (err) {
    const errorResponse = {
      ok: false,
      source: "Local Facts",
      retrievedAt,
      lat: latitude,
      lon: longitude,
      units: {},
      data: null,
      error: {
        status: 500,
        message: err.message || "Exception in getFunFact",
        details: err.stack || JSON.stringify(err)
      }
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});