const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = async function routeDocusign(req, res) {
  try {
    const { invoiceNum, phase, clientName, signerName, signerEmail, grand, dueDate, fromName, fromEmail } = req.body;
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Generate a complete curl command to create and send a DocuSign envelope via the DocuSign REST API (demo: account-d.docusign.com).

Invoice: #${invoiceNum} | Client: ${clientName} | Amount: $${grand} | Due: ${dueDate}
Signer: Name="${signerName}", Email="${signerEmail}"
From: ${fromName}, ${fromEmail}
Subject: "Invoice #${invoiceNum} — ${phase} | $${grand} USD"
Body: "Please review Invoice #${invoiceNum} for ${phase}. Total: $${grand} USD, due ${dueDate}."

Use an htmlDefinition document, include a signature tab, set status to "sent".
Return ONLY the curl command with placeholders {{ACCESS_TOKEN}} and {{ACCOUNT_ID}}. No explanation, no markdown.`
      }],
    });
    res.json({ curlCmd: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
