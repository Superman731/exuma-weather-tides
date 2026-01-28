Deno.serve(async (req) => {
  return new Response(JSON.stringify({
    ok: true,
    message: "pong",
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
});