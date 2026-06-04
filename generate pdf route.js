import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { invoiceData } = await request.json();

    const prompt = `Write a complete Python script using reportlab to generate a professional PDF invoice saved to /tmp/invoice_${invoiceData.invoice_num}.pdf.

Invoice data (JSON): ${JSON.stringify(invoiceData)}

Requirements:
- Use reportlab platypus with US letter page size, 0.85 inch margins
- Header: "UVP Management, LLC Invoice" bold 14pt dark navy (#1a1a2e), italic subtitle with phase name
- Thick horizontal rule below header
- 3-column info table with light gray background (#f8f8fb): [Invoice # + Issued On + Due Date | From AIVC | Bill To client]. Due date in red bold.
- Bold section heading with phase name
- Line items table: dark navy header row (ITEMS | TOTAL), line items, total row with light blue background (#f0f4ff)
- Wire instructions box with left navy border, light blue background, 2-column grid layout
- Return only executable Python code, no markdown fences, no explanations.
- End with: pdf_bytes = generate_invoice_pdf(data); open('/tmp/invoice_${invoiceData.invoice_num}.pdf','wb').write(pdf_bytes); print('PDF_DONE')`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const code = message.content[0].text;
    return Response.json({ code });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
