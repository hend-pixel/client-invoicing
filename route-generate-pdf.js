const PDFDocument = require("pdfkit");

const NAVY   = "#1a1a2e";
const LTBLUE = "#f0f4ff";
const GRAY   = "#f8f8fb";
const RED    = "#c0392b";
const GRAY2  = "#888888";

function fmt(n) {
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: 0 });
}

module.exports = function routeGeneratePdf(req, res) {
  try {
    const d = req.body;

    // ── Computed values ──────────────────────────────────────────────────────
    const amt   = Number(d.line1_amount)   || 0;
    const exp   = Number(d.expense_amount) || 0;
    const grand = Number(d.grand_total)    || 0;

    // ── Set up response as a downloadable PDF ────────────────────────────────
    const filename = `invoice_${d.invoice_num}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ margin: 60, size: "LETTER" });
    doc.pipe(res);

    const W = doc.page.width  - 120; // content width (60px margins each side)
    const L = 60;                    // left margin

    // ── Header ───────────────────────────────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(14).fillColor(NAVY)
       .text("UVP Management, LLC Invoice", L, 60);
    doc.font("Helvetica-Oblique").fontSize(10).fillColor("#555555")
       .text(d.phase, L, 80);
    doc.moveTo(L, 98).lineTo(L + W, 98).lineWidth(2).strokeColor(NAVY).stroke();

    // ── 3-column meta box ────────────────────────────────────────────────────
    const metaY  = 110;
    const metaH  = 105;
    const col    = W / 3;

    doc.rect(L, metaY, W, metaH).fillColor(GRAY).fill();

    function metaLabel(text, x, y) {
      doc.font("Helvetica-Bold").fontSize(7).fillColor(GRAY2)
         .text(text.toUpperCase(), x, y, { width: col - 10 });
    }
    function metaVal(text, x, y, opts = {}) {
      doc.font(opts.bold ? "Helvetica-Bold" : "Helvetica")
         .fontSize(9)
         .fillColor(opts.red ? RED : NAVY)
         .text(text || "", x, y, { width: col - 10 });
    }

    // Col 1 — invoice number / issued / due
    metaLabel("Invoice Number", L + 8, metaY + 8);
    metaVal(d.invoice_num, L + 8, metaY + 18, { bold: true });
    metaLabel("Issued On", L + 8, metaY + 34);
    metaVal(d.issue_date, L + 8, metaY + 44);
    metaLabel("Due Date", L + 8, metaY + 60);
    metaVal(d.due_date, L + 8, metaY + 70, { bold: true, red: true });

    // Col 2 — From
    const c2 = L + col + 8;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(NAVY).text("From", c2, metaY + 8);
    doc.font("Helvetica").fontSize(8).fillColor("#333333")
       .text(d.from_name,    c2, metaY + 20, { width: col - 10 })
       .text(d.from_company, c2, metaY + 32, { width: col - 10 })
       .text(d.from_email,   c2, metaY + 44, { width: col - 10 })
       .text("EIN " + d.from_ein, c2, metaY + 56, { width: col - 10 });

    // Col 3 — Bill To
    const c3 = L + col * 2 + 8;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(NAVY).text("Bill To", c3, metaY + 8);
    doc.font("Helvetica").fontSize(8).fillColor("#333333")
       .text(d.bill_to_name,  c3, metaY + 20, { width: col - 10 })
       .text(d.client_name,   c3, metaY + 32, { width: col - 10 })
       .text(d.bill_to_email || "", c3, metaY + 44, { width: col - 10 });

    // ── Phase heading ─────────────────────────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(11).fillColor(NAVY)
       .text(d.phase, L, metaY + metaH + 18);

    // ── Line items table ──────────────────────────────────────────────────────
    const tableY  = metaY + metaH + 38;
    const colDesc = W * 0.72;
    const colAmt  = W * 0.28;

    // Header row
    doc.rect(L, tableY, W, 24).fillColor(NAVY).fill();
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#ffffff")
       .text("ITEMS", L + 10, tableY + 8)
       .text("TOTAL", L + colDesc + 10, tableY + 8, { width: colAmt - 20, align: "right" });

    // Row 1 — professional fees
    const r1Y = tableY + 24;
    doc.rect(L, r1Y, W, 26).fillColor("#ffffff").fill();
    doc.moveTo(L, r1Y + 26).lineTo(L + W, r1Y + 26).lineWidth(0.5).strokeColor("#eeeeee").stroke();
    doc.font("Helvetica").fontSize(10).fillColor("#333333")
       .text(d.line1_label, L + 10, r1Y + 8)
       .text("$" + fmt(amt), L + colDesc + 10, r1Y + 8, { width: colAmt - 20, align: "right" });

    let nextY = r1Y + 26;

    // Row 2 — expenses (optional)
    if (exp > 0) {
      doc.rect(L, nextY, W, 26).fillColor("#ffffff").fill();
      doc.moveTo(L, nextY + 26).lineTo(L + W, nextY + 26).lineWidth(0.5).strokeColor("#eeeeee").stroke();
      doc.font("Helvetica").fontSize(10).fillColor("#333333")
         .text("Travel & Expenses (as incurred)", L + 10, nextY + 8)
         .text("$" + fmt(exp), L + colDesc + 10, nextY + 8, { width: colAmt - 20, align: "right" });
      nextY += 26;
    }

    // Total row
    doc.rect(L, nextY, W, 28).fillColor(LTBLUE).fill();
    doc.font("Helvetica-Bold").fontSize(11).fillColor(NAVY)
       .text("Total Amount", L + 10, nextY + 9)
       .text("$" + fmt(grand) + " USD", L + colDesc + 10, nextY + 9, { width: colAmt - 20, align: "right" });

    // ── Wire instructions ─────────────────────────────────────────────────────
    const wireY = nextY + 42;
    const wireH = 110;
    doc.rect(L, wireY, W, wireH).fillColor(LTBLUE).fill();
    doc.rect(L, wireY, 4, wireH).fillColor(NAVY).fill();

    doc.font("Helvetica-Bold").fontSize(8).fillColor(NAVY)
       .text("DOMESTIC WIRE & ACH TRANSFER INSTRUCTIONS", L + 14, wireY + 10);

    const wireCol = W / 2 - 14;
    const pairs = [
      ["Bank",            d.bank_name],
      ["Account Name",    d.account_name],
      ["Bank Address",    d.bank_address],
      ["Account Address", d.account_address],
      ["SWIFT Code",      d.swift],
      ["ACH & Wire Routing", d.routing],
      ["Account Number",  d.account_number],
    ];

    pairs.forEach(([k, v], i) => {
      const col = i % 2 === 0 ? L + 14 : L + wireCol + 28;
      const row = wireY + 24 + Math.floor(i / 2) * 16;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#444444").text(k + ": ", col, row, { continued: true });
      doc.font("Helvetica").fontSize(7.5).fillColor("#222222").text(v || "");
    });

    doc.font("Helvetica-Oblique").fontSize(8).fillColor("#666666")
       .text(
         `* Please reference invoice number when sending payment.   Questions: ${d.from_name}  |  ${d.from_phone}  |  ${d.from_email}`,
         L + 14, wireY + wireH - 20, { width: W - 28 }
       );

    doc.end();

  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
};
