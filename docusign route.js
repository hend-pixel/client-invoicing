import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { invoiceNum, phase, clientName, signerName, signerEmail, grand, dueDate, fromName, fromEmail } = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Generate a complete curl command to create and send a DocuSign envelope via the DocuSign REST API (demo environment: account-d.docusign.com).

Invoice: #${invoiceNum} | Client: ${clientName} | Amount: $${grand} | Due: ${dueDate}
Signer: Name="${signerName}", Email="${signerEmail}"
From: ${fromName}, ${fromEmail}
Email subject: "Invoice #${invoiceNum} — ${phase} | $${grand} USD"
Email body: "Please review and acknowledge receipt of Invoice #${invoiceNum} for ${phase}. Total: $${grand} USD, due ${dueDate}."

The envelope should:
1. Use an htmlDefinition document with the invoice summary
2. Include a signature tab for the signer
3. Set status to "sent"

Return ONLY the curl command with placeholders {{ACCESS_TOKEN}} and {{ACCOUNT_ID}}. No explanation, no markdown.`,
      }],
    });

    const curlCmd = message.content[0].text;
    return Response.json({ curlCmd });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
