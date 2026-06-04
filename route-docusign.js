// Sends invoice data to your n8n webhook.
// n8n then creates the DocuSign envelope and sends it to the signer.
//
// Set your n8n webhook URL as an env variable:
//   N8N_DOCUSIGN_WEBHOOK=https://your-n8n-instance.com/webhook/docusign-invoice
//
// In n8n, create a workflow:
//   [Webhook] → [DocuSign: Create Envelope & Send] → [Respond to Webhook]

module.exports = async function routeDocusign(req, res) {
  const webhookUrl = process.env.N8N_DOCUSIGN_WEBHOOK;

  if (!webhookUrl) {
    return res.status(500).json({
      error: "N8N_DOCUSIGN_WEBHOOK environment variable is not set. Add it in your Vercel settings."
    });
  }

  try {
    const payload = req.body; // { invoiceNum, phase, clientName, signerName, signerEmail, grand, dueDate, fromName, fromEmail }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceNum:  payload.invoiceNum,
        phase:       payload.phase,
        clientName:  payload.clientName,
        signerName:  payload.signerName,
        signerEmail: payload.signerEmail,
        amount:      payload.grand,
        dueDate:     payload.dueDate,
        fromName:    payload.fromName,
        fromEmail:   payload.fromEmail,
        sentAt:      new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`n8n returned ${response.status}: ${text}`);
    }

    res.json({ success: true, message: "Sent to n8n — DocuSign envelope is being created." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
