exports.handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ok: true,
      service: "health-check",
      timestamp: new Date().toISOString()
    })
  };
};
