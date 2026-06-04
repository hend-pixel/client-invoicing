import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { invoiceData } = req.body;
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: `Write a complete Python script using reportlab to generate a professional PDF invoice saved to /tmp/invoice_${invoiceData.invoice_num}.pdf.

Invoice data (JSON): ${JSON.stringify(invoiceData)}

Requirements:
- reportlab platypus, US letter, 0.85 inch margins
- Header: "UVP Management, LLC Invoice" bold 14pt dark navy (#1a1a2e), italic subtitle with phase name
- Thick horizontal rule below header
- 3-column info table (#f8f8fb background): Invoice # / Issued / Due Date (red bold) | From AIVC | Bill To client
- Bold section heading with phase name
- Line items table: dark navy header row, line items, total row (#f0f4ff background)
- Wire instructions box: left navy border, light blue background, 2-column grid
- Return ONLY executable Python, no markdown fences, no explanation.
- Last line: open('/tmp/invoice_${invoiceData.invoice_num}.pdf','wb').write(generate_invoice_pdf(data)); print('PDF_DONE')`
      }],
    });
    res.json({ code: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
