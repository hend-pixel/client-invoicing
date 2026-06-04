import { useState, useRef } from "react";

const AIVC = {
  name: "Emily Tavis", company: "AIVC, Inc.",
  address: "117 W 17th St New York, NY 10011 United States",
  email: "emily@aivc.com", ein: "41-4378479", phone: "(917) 957-4324",
  bankName: "JPMorgan Chase Bank, N.A.",
  bankAddress: "270 Park Avenue, New York, NY 10172",
  accountName: "AIVC, Inc.",
  accountAddress: "117 W 17th St, #4C, New York, NY 10011",
  swift: "CHASUS33", routing: "021000021", accountNumber: "2908571022",
};

const fmt = (n) => Number(n).toLocaleString("en-US", { minimumFractionDigits: 0 });
const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

function InvoicePreview({ d }) {
  const today = new Date();
  const amt = (Number(d.totalFee) || 0) * 0.5;
  const exp = d.invoiceType === "final" ? (Number(d.expenses) || 0) : 0;
  const grand = amt + exp;
  const due = d.customDue ? fmtDate(new Date(d.customDue + "T00:00:00")) : fmtDate(addDays(today, Number(d.paymentTermsDays) || 30));
  const th = { padding: "9px 12px", textAlign: "left", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", background: "#1a1a2e", color: "#fff" };
  const td = { padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: 13 };
  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#fff", color: "#222", padding: "28px 32px", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.13)" }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e", borderBottom: "3px solid #1a1a2e", paddingBottom: 10, marginBottom: 14 }}>
        UVP Management, LLC Invoice
        <span style={{ fontWeight: 400, fontStyle: "italic", fontSize: 12, color: "#666", marginLeft: 10 }}>{d.phase}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, background: "#f8f8fb", padding: "12px 14px", borderRadius: 6, marginBottom: 14 }}>
        {[
          ["Invoice Number", d.invoiceNum, "Issued On", fmtDate(today), "Due Date", due],
          ["From", AIVC.name, AIVC.company, AIVC.email, `EIN ${AIVC.ein}`],
          ["Bill To", d.billToName || "Accounts Payable", d.clientName, d.billToEmail],
        ].map((col, i) => (
          <div key={i}>
            {col.map((item, j) => {
              const isLabel = j % 2 === 0 && i === 0 && j < 5;
              const isH = i > 0 && j === 0;
              return <div key={j} style={{ fontSize: isLabel || isH ? 9 : 11, fontWeight: isH ? 700 : "normal", color: isLabel ? "#999" : isH ? "#1a1a2e" : "#333", marginBottom: isLabel ? 2 : 6, textTransform: isLabel ? "uppercase" : "none", letterSpacing: isLabel ? 0.8 : 0 }}>{item}</div>;
            })}
          </div>
        ))}
      </div>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: "#1a1a2e" }}>{d.phase}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead><tr><th style={th}>Items</th><th style={{ ...th, textAlign: "right" }}>Total</th></tr></thead>
        <tbody>
          <tr><td style={td}>{d.invoiceType === "first" ? "50% Professional Fees (SOW Commencement)" : "50% Professional Fees (Final Delivery)"}</td><td style={{ ...td, textAlign: "right" }}>${fmt(amt)}</td></tr>
          {exp > 0 && <tr><td style={td}>Travel & Expenses (as incurred)</td><td style={{ ...td, textAlign: "right" }}>${fmt(exp)}</td></tr>}
          <tr style={{ background: "#f0f4ff" }}><td style={{ ...td, fontWeight: 700, color: "#1a1a2e" }}>Total Amount</td><td style={{ ...td, textAlign: "right", fontWeight: 700, fontSize: 14 }}>${fmt(grand)} USD</td></tr>
        </tbody>
      </table>
      <div style={{ background: "#f0f4ff", borderLeft: "4px solid #1a1a2e", padding: "12px 16px", fontSize: 11, borderRadius: "0 6px 6px 0" }}>
        <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Wire & ACH Instructions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 20px", lineHeight: 1.8 }}>
          {[["Bank", AIVC.bankName], ["Account Name", AIVC.accountName], ["SWIFT", AIVC.swift], ["Routing", AIVC.routing], ["Account #", AIVC.accountNumber]].map(([k, v]) =>
            <div key={k}><span style={{ color: "#888" }}>{k}: </span>{v}</div>)}
        </div>
        <div style={{ marginTop: 8, color: "#666", fontStyle: "italic" }}>* Reference invoice number when sending. Questions: {AIVC.name} | {AIVC.phone} | {AIVC.email}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const today = new Date();
  const [step, setStep] = useState(0);
  const [d, setD] = useState({
    invoiceType: "first", invoiceNum: "2012",
    clientName: "LiveOps Agent Services, LLC",
    phase: "Strategy & Acceleration Sprint",
    totalFee: "150000", expenses: "0",
    billToName: "Accounts Payable", billToEmail: "",
    paymentTermsDays: "30", customDue: "",
    signerName: "", signerEmail: "",
  });
  const [status, setStatus] = useState({ pdf: null, docusign: null });
  const [loading, setLoading] = useState({ pdf: false, docusign: false });
  const [logs, setLogs] = useState([]);
  const pdfRef = useRef(null);

  const set = (k) => (e) => setD(prev => ({ ...prev, [k]: e.target.value }));
  const addLog = (msg, type = "info") => setLogs(p => [...p, { msg, type, t: new Date().toLocaleTimeString() }]);

  const dueDate = d.customDue ? fmtDate(new Date(d.customDue + "T00:00:00")) : fmtDate(addDays(today, Number(d.paymentTermsDays) || 30));
  const amt = (Number(d.totalFee) || 0) * 0.5;
  const exp = d.invoiceType === "final" ? Number(d.expenses) || 0 : 0;
  const grand = amt + exp;

  async function generatePDF() {
    setLoading(p => ({ ...p, pdf: true }));
    addLog("Generating PDF script...");
    try {
      const invoiceData = {
        invoice_num: d.invoiceNum, phase: d.phase,
        issue_date: fmtDate(today), due_date: dueDate,
        from_name: AIVC.name, from_company: AIVC.company, from_address: "117 W 17th St New York, NY 10011",
        from_email: AIVC.email, from_ein: AIVC.ein, from_phone: AIVC.phone,
        bill_to_name: d.billToName || "Accounts Payable", client_name: d.clientName, bill_to_email: d.billToEmail,
        line1_label: d.invoiceType === "first" ? "50% Professional Fees (SOW Commencement)" : "50% Professional Fees (Final Delivery)",
        line1_amount: amt, expense_amount: exp, grand_total: grand,
        bank_name: AIVC.bankName, bank_address: AIVC.bankAddress, account_name: AIVC.accountName,
        account_address: AIVC.accountAddress, swift: AIVC.swift, routing: AIVC.routing, account_number: AIVC.accountNumber,
      };
      const res = await fetch("/api/generate-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceData }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const blob = new Blob([data.code], { type: "text/x-python" });
      pdfRef.current = { url: URL.createObjectURL(blob), filename: `generate_invoice_${d.invoiceNum}.py` };
      setStatus(p => ({ ...p, pdf: "ready" }));
      addLog(`Script ready — run: python3 generate_invoice_${d.invoiceNum}.py`, "success");
    } catch (e) { addLog("Failed: " + e.message, "error"); }
    setLoading(p => ({ ...p, pdf: false }));
  }

  function downloadPDFScript() {
    if (!pdfRef.current) return;
    const a = document.createElement("a");
    a.href = pdfRef.current.url; a.download = pdfRef.current.filename; a.click();
  }

  async function sendToDocuSign() {
    if (!d.signerEmail) { addLog("Enter signer email first", "error"); return; }
    setLoading(p => ({ ...p, docusign: true }));
    addLog(`Preparing DocuSign envelope for ${d.signerEmail}...`);
    try {
      const res = await fetch("/api/docusign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceNum: d.invoiceNum, phase: d.phase, clientName: d.clientName, signerName: d.signerName || "Accounts Payable", signerEmail: d.signerEmail, grand: fmt(grand), dueDate, fromName: AIVC.name, fromEmail: AIVC.email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([data.curlCmd], { type: "text/plain" }));
      a.download = `docusign_invoice_${d.invoiceNum}.sh`; a.click();
      setStatus(p => ({ ...p, docusign: "sent" }));
      addLog(`Script downloaded. Add {{ACCESS_TOKEN}} + {{ACCOUNT_ID}} and run it.`, "success");
    } catch (e) { addLog("Failed: " + e.message, "error"); }
    setLoading(p => ({ ...p, docusign: false }));
  }

  const iS = { width: "100%", padding: "9px 11px", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 6, fontSize: 13, background: "rgba(255,255,255,0.07)", color: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lS = { display: "block", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 5 };
  const F = (label, key, type = "text") => (<div style={{ marginBottom: 14 }}><label style={lS}>{label}</label><input type={type} value={d[key]} onChange={set(key)} style={iS} /></div>);
  const Btn = ({ onClick, ld, done, color, children }) => (<button onClick={onClick} disabled={ld} style={{ width: "100%", padding: "13px", borderRadius: 8, border: done ? "1px solid rgba(100,220,100,0.35)" : "none", cursor: ld ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 13, background: done ? "rgba(100,220,100,0.15)" : ld ? "rgba(255,255,255,0.08)" : color, color: done ? "#7cdc64" : ld ? "rgba(255,255,255,0.4)" : "#fff" }}>{ld ? "⏳ Working..." : done ? `✅ ${children} — Done` : children}</button>);
  const logColor = { info: "rgba(255,255,255,0.5)", success: "#7cdc64", error: "#ff6b6b" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(140deg,#0c0c1e 0%,#1a1040 60%,#0f1a2e 100%)", fontFamily: "'Trebuchet MS', sans-serif", color: "#fff" }}>
      <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>⚡ AIVC Invoice Automation</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>PDF → DocuSign, in one flow</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Details", "Preview & Send"].map((s, i) => (
            <button key={s} onClick={() => setStep(i)} style={{ padding: "7px 18px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: step === i ? 700 : 400, background: step === i ? "rgba(124,140,255,0.25)" : "rgba(255,255,255,0.06)", color: step === i ? "#a78bfa" : "rgba(255,255,255,0.5)", borderBottom: step === i ? "2px solid #a78bfa" : "2px solid transparent" }}>{i + 1}. {s}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "28px 24px" }}>
        {step === 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 24 }}>
            <div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "18px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Invoice Type</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[["first", "🔵 First Invoice", "50% at SOW signing"], ["final", "✅ Final Invoice", "50% + expenses"]].map(([v, l, s]) => (
                    <button key={v} onClick={() => setD(p => ({ ...p, invoiceType: v }))} style={{ padding: "11px 14px", borderRadius: 8, border: d.invoiceType === v ? "2px solid #a78bfa" : "2px solid rgba(255,255,255,0.12)", background: d.invoiceType === v ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)", color: "#fff", cursor: "pointer", textAlign: "left" }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{l}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "18px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Invoice Details</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>{F("Invoice #", "invoiceNum")}{F("Total SOW Fee ($)", "totalFee", "number")}</div>
                {F("Client / Company Name", "clientName")}
                {F("Phase Label", "phase")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>{F("Bill To Name", "billToName")}{F("Bill To Email", "billToEmail", "email")}</div>
                {d.invoiceType === "final" && F("Expenses Amount ($)", "expenses", "number")}
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "18px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Dates</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>{F("Payment Terms (days)", "paymentTermsDays", "number")}{F("Override Due Date", "customDue", "date")}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>Due: <strong style={{ color: "#a78bfa" }}>{dueDate}</strong> · Amount: <strong style={{ color: "#a78bfa" }}>${fmt(amt)}</strong>{exp > 0 && ` + $${fmt(exp)} expenses`}</div>
              </div>
              <button onClick={() => setStep(1)} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "linear-gradient(90deg,#7c8cff,#a78bfa)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Continue to Preview & Send →</button>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Live Preview</div>
              <InvoicePreview d={d} />
              <div style={{ marginTop: 18, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>LiveOps SOW — Auto-Detected</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  {[["Total Fee","$150,000"],["First Invoice","$75,000"],["Final Invoice","$75,000 + T&E"],["SOW Signed","May 28, 2026"],["Delivery Date","July 13, 2026"],["Sponsor","Molly Moore"]].map(([k,v]) => (
                    <div key={k} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 7, padding: "9px 12px" }}>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{k}</div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#a78bfa" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Final Invoice Preview</div>
              <InvoicePreview d={d} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(124,140,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📄</div>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>Generate PDF</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Invoice #{d.invoiceNum} · ${fmt(grand)} USD</div></div>
                </div>
                <Btn onClick={generatePDF} ld={loading.pdf} done={status.pdf === "ready"} color="linear-gradient(90deg,#667eea,#764ba2)">Generate Invoice PDF</Btn>
                {status.pdf === "ready" && <button onClick={downloadPDFScript} style={{ width: "100%", marginTop: 8, padding: "9px", borderRadius: 6, border: "1px solid rgba(124,220,100,0.3)", background: "transparent", color: "#7cdc64", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>⬇ Download Python Script</button>}
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,180,50,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✍️</div>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>Send via DocuSign</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Request signature from client</div></div>
                </div>
                <div style={{ marginBottom: 10 }}><label style={lS}>Signer Name</label><input value={d.signerName} onChange={set("signerName")} placeholder="e.g. Molly Moore" style={iS} /></div>
                <div style={{ marginBottom: 10 }}><label style={lS}>Signer Email</label><input value={d.signerEmail} onChange={set("signerEmail")} type="email" placeholder="accountspayable@client.com" style={iS} /></div>
                <Btn onClick={sendToDocuSign} ld={loading.docusign} done={status.docusign === "sent"} color="linear-gradient(90deg,#f7971e,#ffd200)">Send to DocuSign →</Btn>
                <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>Downloads a shell script. Add your DocuSign credentials and run it.</div>
              </div>
              {logs.length > 0 && (
                <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 8, padding: "12px 14px", fontFamily: "monospace", fontSize: 11 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>ACTIVITY LOG</div>
                  {logs.map((l, i) => <div key={i} style={{ color: logColor[l.type], marginBottom: 4 }}><span style={{ color: "rgba(255,255,255,0.2)", marginRight: 8 }}>{l.t}</span>{l.msg}</div>)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
