// Absolute minimal function - no imports, no dependencies, cannot fail
export default async function ping() {
  return {
    status: 200,
    body: JSON.stringify({
      ok: true,
      message: "pong",
      timestamp: new Date().toISOString()
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };
}