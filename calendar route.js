// app/api/calendar/route.js
// Google Calendar integration via OAuth2
// On Vercel: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
// as environment variables (see README for how to get these).

export async function POST(request) {
  const { summary, description, startTime, endTime } = await request.json();

  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    return Response.json(
      { error: "Google Calendar credentials not configured. See README." },
      { status: 500 }
    );
  }

  try {
    // Step 1: Refresh the access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      throw new Error("Failed to refresh Google access token");
    }

    // Step 2: Create the calendar event
    const eventRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary,
          description,
          start: { dateTime: startTime, timeZone: "America/New_York" },
          end: { dateTime: endTime, timeZone: "America/New_York" },
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 60 },
              { method: "popup", minutes: 30 },
            ],
          },
        }),
      }
    );

    const event = await eventRes.json();
    if (event.error) throw new Error(event.error.message);

    return Response.json({ eventId: event.id, htmlLink: event.htmlLink });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
