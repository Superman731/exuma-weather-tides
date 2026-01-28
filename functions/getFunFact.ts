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

export default async function getFunFact() {
  const retrievedAt = new Date().toISOString();
  
  try {
    // Get Nassau time
    const nassauTime = new Date().toLocaleString('en-US', { timeZone: 'America/Nassau' });
    const now = new Date(nassauTime);
    const hours = now.getHours();
    const day = now.getDate();
    
    // Rotate every 4 hours: 0-3, 4-7, 8-11, 12-15, 16-19, 20-23
    const block = Math.floor(hours / 4);
    const factIndex = (day * 6 + block) % exumaFacts.length;
    
    return {
      ok: true,
      source: "Local Facts",
      retrievedAt,
      sourceTimestamp: null,
      lat: 23.4334,
      lon: -75.6932,
      units: {},
      data: {
        fact: exumaFacts[factIndex],
        factIndex,
        totalFacts: exumaFacts.length,
        rotationSchedule: "Every 4 hours (Nassau time)"
      },
      error: null
    };
    
  } catch (error) {
    return {
      ok: false,
      source: "Local Facts",
      retrievedAt,
      lat: 23.4334,
      lon: -75.6932,
      units: {},
      data: null,
      error: {
        status: 500,
        message: "Failed to retrieve fun fact",
        details: error.message
      }
    };
  }
}