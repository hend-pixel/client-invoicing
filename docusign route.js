export async function POST(request) {
    try {
        const data = await request.json();

            const webhookUrl = process.env.N8N_DOCUSIGN_WEBHOOK_URL;
                if (!webhookUrl) {
                      return Response.json({ error: "N8N_DOCUSIGN_WEBHOOK_URL not configured" }, { status: 500 });
                          }

                              const n8nRes = await fetch(webhookUrl, {
                                    method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify(data),
                                                    });

                                                        if (!n8nRes.ok) {
                                                              const msg = await n8nRes.text();
                                                                    return Response.json({ error: `n8n error: ${msg}` }, { status: 500 });
                                                                        }

                                                                            const result = await n8nRes.json().catch(() => ({ status: "sent" }));
                                                                                return Response.json({ status: "sent", ...result });

                                                                                  } catch (err) {
                                                                                      return Response.json({ error: err.message }, { status: 500 });
                                                                                        }
                                                                                        }
}