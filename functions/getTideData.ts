export default async function getTideData() {
  // Georgetown, Exuma tide data
  // Using calculated values based on the screenshots provided
  const now = new Date();
  const highTime = new Date(now);
  highTime.setHours(13, 22, 0); // 1:22 PM
  const lowTime = new Date(now);
  lowTime.setHours(19, 22, 0); // 7:22 PM
  
  return {
    highTide: highTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    highTideHeight: "2.5 ft",
    lowTide: lowTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    lowTideHeight: "0.5 ft"
  };
}