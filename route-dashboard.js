module.exports = function routeDashboard(req, res) {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AIVC Invoice Automation</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Trebuchet MS', sans-serif; background: linear-gradient(140deg,#0c0c1e 0%,#1a1040 60%,#0f1a2e 100%); min-height: 100vh; color: #fff; }
  input { font-family: inherit; }
  .header { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 36px; display: flex; align-items: center; justify-content: space-between; }
  .header h1 { font-size: 17px; font-weight: 700; }
  .header p { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
  .tabs { display: flex; gap: 8px; }
  .tab { padding: 7px 18px; border-radius: 20px; border: none; cursor: pointer; font-size: 12px; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); border-bottom: 2px solid transparent; font-family: inherit; }
  .tab.active { background: rgba(124,140,255,0.25); color: #a78bfa; border-bottom: 2px solid #a78bfa; font-weight: 700; }
  .main { max-width: 1160px; margin: 0 auto; padding: 28px 24px; }
  .grid2 { display: grid; gap: 24px; }
  .card { background: rgba(255,255,255,0.06); border-radius: 10px; padding: 18px 20px; margin-bottom: 16px; }
  .card-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
  .field { margin-bottom: 14px; }
  .field label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 5px; }
  .field input { width: 100%; padding: 9px 11px; border: 1.5px solid rgba(255,255,255,0.12); border-radius: 6px; font-size: 13px; background: rgba(255,255,255,0.07); color: #fff; outline: none; }
  .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
  .type-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .type-btn { padding: 11px 14px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: #fff; cursor: pointer; text-align: left; font-family: inherit; }
  .type-btn.active { border-color: #a78bfa; background: rgba(167,139,250,0.15); }
  .type-btn .title { font-weight: 700; font-size: 13px; }
  .type-btn .sub { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }
  .continue-btn { width: 100%; padding: 13px; border-radius: 8px; border: none; background: linear-gradient(90deg,#7c8cff,#a78bfa); color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; }
  .preview-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 14px; }
  .sow-box { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 16px 20px; margin-top: 18px; }
  .sow-title { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 12px; }
  .sow-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .sow-card { background: rgba(255,255,255,0.05); border-radius: 7px; padding: 9px 12px; }
  .sow-card .k { font-size: 9px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .sow-card .v { font-weight: 700; font-size: 12px; color: #a78bfa; }
  .inv { font-family: Georgia, serif; background: #fff; color: #222; padding: 28px 32px; border-radius: 8px; font-size: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.13); }
  .inv-header { font-weight: 700; font-size: 15px; color: #1a1a2e; border-bottom: 3px solid #1a1a2e; padding-bottom: 10px; margin-bottom: 14px; }
  .inv-meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; background: #f8f8fb; padding: 12px 14px; border-radius: 6px; margin-bottom: 14px; }
  .ml { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 2px; margin-top: 6px; }
  .mv { font-size: 11px; color: #333; margin-bottom: 2px; }
  .mh { font-size: 11px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
  .mred { font-weight: 700; color: #c0392b !important; }
  table.inv-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  table.inv-table th { padding: 9px 12px; text-align: left; font-weight: 700; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; background: #1a1a2e; color: #fff; }
  table.inv-table th.right, table.inv-table td.right { text-align: right; }
  table.inv-table td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
  table.inv-table tr.total td { background: #f0f4ff; font-weight: 700; color: #1a1a2e; }
  .inv-wire { background: #f0f4ff; border-left: 4px solid #1a1a2e; padding: 12px 16px; font-size: 11px; border-radius: 0 6px 6px 0; }
  .inv-wire-title { font-weight: 700; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .inv-wire-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 20px; line-height: 1.8; }
  .inv-wire-note { margin-top: 8px; color: #666; font-style: italic; }
  .action-col { display: flex; flex-direction: column; gap: 14px; }
  .action-card { background: rgba(255,255,255,0.06); border-radius: 10px; padding: 18px 20px; }
  .action-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .action-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .action-title { font-weight: 700; font-size: 14px; }
  .action-sub { font-size: 11px; color: rgba(255,255,255,0.4); }
  .action-btn { width: 100%; padding: 13px; border-radius: 8px; border: none; cursor: pointer; font-weight: 700; font-size: 13px; color: #fff; font-family: inherit; }
  .action-btn:disabled { background: rgba(255,255,255,0.08) !important; color: rgba(255,255,255,0.4); cursor: not-allowed; }
  .action-btn.done { background: rgba(100,220,100,0.15) !important; color: #7cdc64; border: 1px solid rgba(100,220,100,0.35); }
  .dl-btn { width: 100%; margin-top: 8px; padding: 9px; border-radius: 6px; border: 1px solid rgba(124,220,100,0.3); background: transparent; color: #7cdc64; cursor: pointer; font-size: 12px; font-weight: 600; font-family: inherit; }
  .action-note { margin-top: 8px; font-size: 11px; color: rgba(255,255,255,0.3); line-height: 1.5; }
  .ds-input { width: 100%; padding: 8px 11px; border: 1.5px solid rgba(255,255,255,0.12); border-radius: 6px; font-size: 13px; background: rgba(255,255,255,0.07); color: #fff; outline: none; font-family: inherit; }
  .log-box { background: rgba(0,0,0,0.35); border-radius: 8px; padding: 12px 14px; font-family: monospace; font-size: 11px; }
  .log-title { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: rgba(255,255,255,0.3); margin-bottom: 8px; }
  .log-line { margin-bottom: 4px; }
  .log-time { color: rgba(255,255,255,0.2); margin-right: 8px; }
  .due-info { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 4px; }
  .due-info strong { color: #a78bfa; }
  #expenses-field { display: none; }
</style>
</head>
<body>

<div class="header">
  <div><h1>⚡ AIVC Invoice Automation</h1><p>PDF → DocuSign, in one flow</p></div>
  <div class="tabs">
    <button class="tab active" onclick="goStep(0)">1. Details</button>
    <button class="tab" onclick="goStep(1)">2. Preview &amp; Send</button>
  </div>
</div>

<div class="main">

  <!-- STEP 0: Details -->
  <div id="step0" class="grid2" style="grid-template-columns:400px 1fr">
    <div>
      <div class="card">
        <div class="card-label">Invoice Type</div>
        <div class="type-btns">
          <button class="type-btn active" id="btn-first" onclick="setType('first')">
            <div class="title">🔵 First Invoice</div><div class="sub">50% at SOW signing</div>
          </button>
          <button class="type-btn" id="btn-final" onclick="setType('final')">
            <div class="title">✅ Final Invoice</div><div class="sub">50% + expenses</div>
          </button>
        </div>
      </div>
      <div class="card">
        <div class="card-label">Invoice Details</div>
        <div class="grid-2col">
          <div class="field"><label>Invoice #</label><input id="invoiceNum" value="2012" oninput="updatePreview()" /></div>
          <div class="field"><label>Total SOW Fee ($)</label><input id="totalFee" type="number" value="150000" oninput="updatePreview()" /></div>
        </div>
        <div class="field"><label>Client / Company Name</label><input id="clientName" value="LiveOps Agent Services, LLC" oninput="updatePreview()" /></div>
        <div class="field"><label>Phase Label</label><input id="phase" value="Strategy &amp; Acceleration Sprint" oninput="updatePreview()" /></div>
        <div class="grid-2col">
          <div class="field"><label>Bill To Name</label><input id="billToName" value="Accounts Payable" oninput="updatePreview()" /></div>
          <div class="field"><label>Bill To Email</label><input id="billToEmail" type="email" oninput="updatePreview()" /></div>
        </div>
        <div id="expenses-field" class="field"><label>Expenses Amount ($)</label><input id="expenses" type="number" value="0" oninput="updatePreview()" /></div>
      </div>
      <div class="card">
        <div class="card-label">Dates</div>
        <div class="grid-2col">
          <div class="field"><label>Payment Terms (days)</label><input id="paymentTermsDays" type="number" value="30" oninput="updatePreview()" /></div>
          <div class="field"><label>Override Due Date</label><input id="customDue" type="date" oninput="updatePreview()" /></div>
        </div>
        <div class="due-info">Due: <strong id="dueDisplay"></strong> &nbsp;·&nbsp; Amount: <strong id="amtDisplay"></strong></div>
      </div>
      <button class="continue-btn" onclick="goStep(1)">Continue to Preview &amp; Send →</button>
    </div>
    <div>
      <div class="preview-label">Live Preview</div>
      <div id="preview0"></div>
      <div class="sow-box">
        <div class="sow-title">LiveOps SOW — Auto-Detected</div>
        <div class="sow-grid">
          <div class="sow-card"><div class="k">Total Fee</div><div class="v">$150,000</div></div>
          <div class="sow-card"><div class="k">First Invoice</div><div class="v">$75,000</div></div>
          <div class="sow-card"><div class="k">Final Invoice</div><div class="v">$75,000 + T&amp;E</div></div>
          <div class="sow-card"><div class="k">SOW Signed</div><div class="v">May 28, 2026</div></div>
          <div class="sow-card"><div class="k">Delivery Date</div><div class="v">July 13, 2026</div></div>
          <div class="sow-card"><div class="k">Sponsor</div><div class="v">Molly Moore</div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- STEP 1: Preview & Send -->
  <div id="step1" class="grid2" style="grid-template-columns:1fr 400px;display:none">
    <div>
      <div class="preview-label">Final Invoice Preview</div>
      <div id="preview1"></div>
    </div>
    <div class="action-col">
      <div class="action-card">
        <div class="action-head">
          <div class="action-icon" style="background:rgba(124,140,255,0.2)">📄</div>
          <div><div class="action-title">Generate PDF</div><div class="action-sub" id="pdf-sub">Invoice · USD</div></div>
        </div>
        <button class="action-btn" id="pdf-btn" style="background:linear-gradient(90deg,#667eea,#764ba2)" onclick="generatePDF()">Generate Invoice PDF</button>
        <button class="dl-btn" id="dl-btn" style="display:none" onclick="downloadScript()">⬇ Download Python Script</button>
      </div>
      <div class="action-card">
        <div class="action-head">
          <div class="action-icon" style="background:rgba(255,180,50,0.2)">✍️</div>
          <div><div class="action-title">Send via DocuSign</div><div class="action-sub">Request signature from client</div></div>
        </div>
        <div class="field"><label>Signer Name</label><input id="signerName" class="ds-input" placeholder="e.g. Molly Moore" /></div>
        <div class="field"><label>Signer Email</label><input id="signerEmail" type="email" class="ds-input" placeholder="accountspayable@client.com" /></div>
        <button class="action-btn" id="ds-btn" style="background:linear-gradient(90deg,#f7971e,#ffd200)" onclick="sendDocuSign()">Send to DocuSign →</button>
        <div class="action-note">Downloads a shell script. Add your DocuSign credentials and run it.</div>
      </div>
      <div class="log-box" id="log" style="display:none">
        <div class="log-title">ACTIVITY LOG</div>
        <div id="log-lines"></div>
      </div>
    </div>
  </div>

</div>

<script>
const AIVC = {
  name:"Emily Tavis", company:"AIVC, Inc.", address:"117 W 17th St New York, NY 10011",
  email:"emily@aivc.com", ein:"41-4378479", phone:"(917) 957-4324",
  bankName:"JPMorgan Chase Bank, N.A.", bankAddress:"270 Park Avenue, New York, NY 10172",
  accountName:"AIVC, Inc.", accountAddress:"117 W 17th St, #4C, New York, NY 10011",
  swift:"CHASUS33", routing:"021000021", accountNumber:"2908571022"
};
let invoiceType = "first";
let pdfBlob = null;
const fmt = n => Number(n).toLocaleString("en-US",{minimumFractionDigits:0});
const fmtDate = d => d.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
const addDays = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const val = id => document.getElementById(id)?.value || "";
const getDue = () => { const c=val("customDue"); return c ? fmtDate(new Date(c+"T00:00:00")) : fmtDate(addDays(new Date(), Number(val("paymentTermsDays"))||30)); };
const getAmt = () => (Number(val("totalFee"))||0)*0.5;
const getExp = () => invoiceType==="final" ? (Number(val("expenses"))||0) : 0;
const getGrand = () => getAmt()+getExp();

function setType(t) {
  invoiceType=t;
  document.getElementById("btn-first").classList.toggle("active",t==="first");
  document.getElementById("btn-final").classList.toggle("active",t==="final");
  document.getElementById("expenses-field").style.display=t==="final"?"block":"none";
  updatePreview();
}

function buildPreview() {
  const label = invoiceType==="first"?"50% Professional Fees (SOW Commencement)":"50% Professional Fees (Final Delivery)";
  const exp=getExp(); const grand=getGrand();
  return \`<div class="inv">
    <div class="inv-header">UVP Management, LLC Invoice <span style="font-weight:400;font-style:italic;font-size:12px;color:#666;margin-left:10px">\${val("phase")}</span></div>
    <div class="inv-meta">
      <div>
        <div class="ml">Invoice Number</div><div class="mv" style="font-weight:700">\${val("invoiceNum")}</div>
        <div class="ml">Issued On</div><div class="mv">\${fmtDate(new Date())}</div>
        <div class="ml">Due Date</div><div class="mv mred">\${getDue()}</div>
      </div>
      <div>
        <div class="mh">From</div>
        <div class="mv">\${AIVC.name}</div><div class="mv">\${AIVC.company}</div>
        <div class="mv">\${AIVC.email}</div><div class="mv">EIN \${AIVC.ein}</div>
      </div>
      <div>
        <div class="mh">Bill To</div>
        <div class="mv">\${val("billToName")||"Accounts Payable"}</div>
        <div class="mv">\${val("clientName")}</div>
        <div class="mv">\${val("billToEmail")}</div>
      </div>
    </div>
    <div style="font-weight:700;font-size:13px;margin-bottom:10px;color:#1a1a2e">\${val("phase")}</div>
    <table class="inv-table">
      <thead><tr><th>Items</th><th class="right">Total</th></tr></thead>
      <tbody>
        <tr><td>\${label}</td><td class="right">$\${fmt(getAmt())}</td></tr>
        \${exp>0?\`<tr><td>Travel &amp; Expenses (as incurred)</td><td class="right">$\${fmt(exp)}</td></tr>\`:""}
        <tr class="total"><td>Total Amount</td><td class="right" style="font-size:14px">$\${fmt(grand)} USD</td></tr>
      </tbody>
    </table>
    <div class="inv-wire">
      <div class="inv-wire-title">Wire &amp; ACH Instructions</div>
      <div class="inv-wire-grid">
        <div><span style="color:#888">Bank: </span>\${AIVC.bankName}</div>
        <div><span style="color:#888">Account Name: </span>\${AIVC.accountName}</div>
        <div><span style="color:#888">SWIFT: </span>\${AIVC.swift}</div>
        <div><span style="color:#888">Routing: </span>\${AIVC.routing}</div>
        <div><span style="color:#888">Account #: </span>\${AIVC.accountNumber}</div>
      </div>
      <div class="inv-wire-note">* Reference invoice number when sending. Questions: \${AIVC.name} | \${AIVC.phone} | \${AIVC.email}</div>
    </div>
  </div>\`;
}

function updatePreview() {
  const html=buildPreview();
  ["preview0","preview1"].forEach(id=>{ const el=document.getElementById(id); if(el) el.innerHTML=html; });
  document.getElementById("dueDisplay").textContent=getDue();
  document.getElementById("amtDisplay").textContent="$"+fmt(getAmt());
  document.getElementById("pdf-sub").textContent="Invoice #"+val("invoiceNum")+" · $"+fmt(getGrand())+" USD";
}

function goStep(n) {
  document.getElementById("step0").style.display=n===0?"grid":"none";
  document.getElementById("step1").style.display=n===1?"grid":"none";
  document.querySelectorAll(".tab").forEach((t,i)=>t.classList.toggle("active",i===n));
  updatePreview();
}

function addLog(msg,type="info") {
  document.getElementById("log").style.display="block";
  const color=type==="success"?"#7cdc64":type==="error"?"#ff6b6b":"rgba(255,255,255,0.5)";
  document.getElementById("log-lines").innerHTML+=\`<div class="log-line" style="color:\${color}"><span class="log-time">\${new Date().toLocaleTimeString()}</span>\${msg}</div>\`;
}

async function generatePDF() {
  const btn=document.getElementById("pdf-btn");
  btn.disabled=true; btn.textContent="⏳ Working...";
  addLog("Generating PDF script...");
  try {
    const invoiceData={
      invoice_num:val("invoiceNum"), phase:val("phase"),
      issue_date:fmtDate(new Date()), due_date:getDue(),
      from_name:AIVC.name, from_company:AIVC.company, from_address:AIVC.address,
      from_email:AIVC.email, from_ein:AIVC.ein, from_phone:AIVC.phone,
      bill_to_name:val("billToName")||"Accounts Payable",
      client_name:val("clientName"), bill_to_email:val("billToEmail"),
      line1_label:invoiceType==="first"?"50% Professional Fees (SOW Commencement)":"50% Professional Fees (Final Delivery)",
      line1_amount:getAmt(), expense_amount:getExp(), grand_total:getGrand(),
      bank_name:AIVC.bankName, bank_address:AIVC.bankAddress,
      account_name:AIVC.accountName, account_address:AIVC.accountAddress,
      swift:AIVC.swift, routing:AIVC.routing, account_number:AIVC.accountNumber,
    };
    const res=await fetch("/api/generate-pdf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({invoiceData})});
    const data=await res.json();
    if(data.error) throw new Error(data.error);
    pdfBlob=new Blob([data.code],{type:"text/x-python"});
    btn.classList.add("done"); btn.disabled=false; btn.textContent="✅ Generate Invoice PDF — Done";
    document.getElementById("dl-btn").style.display="block";
    addLog("Script ready — run: python3 generate_invoice_"+val("invoiceNum")+".py","success");
  } catch(e){ btn.disabled=false; btn.textContent="Generate Invoice PDF"; addLog("Failed: "+e.message,"error"); }
}

function downloadScript() {
  if(!pdfBlob) return;
  const a=document.createElement("a");
  a.href=URL.createObjectURL(pdfBlob);
  a.download="generate_invoice_"+val("invoiceNum")+".py";
  a.click();
}

async function sendDocuSign() {
  const email=val("signerEmail");
  if(!email){ addLog("Enter signer email first","error"); return; }
  const btn=document.getElementById("ds-btn");
  btn.disabled=true; btn.textContent="⏳ Working...";
  addLog("Preparing DocuSign envelope for "+email+"...");
  try {
    const res=await fetch("/api/docusign",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({invoiceNum:val("invoiceNum"),phase:val("phase"),clientName:val("clientName"),signerName:val("signerName")||"Accounts Payable",signerEmail:email,grand:fmt(getGrand()),dueDate:getDue(),fromName:AIVC.name,fromEmail:AIVC.email})});
    const data=await res.json();
    if(data.error) throw new Error(data.error);
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([data.curlCmd],{type:"text/plain"}));
    a.download="docusign_invoice_"+val("invoiceNum")+".sh"; a.click();
    btn.classList.add("done"); btn.disabled=false; btn.textContent="✅ Send to DocuSign → — Done";
    addLog("Script downloaded. Fill in {{ACCESS_TOKEN}} + {{ACCOUNT_ID}} and run it.","success");
  } catch(e){ btn.disabled=false; btn.textContent="Send to DocuSign →"; addLog("Failed: "+e.message,"error"); }
}

updatePreview();
</script>
</body>
</html>`);
};
