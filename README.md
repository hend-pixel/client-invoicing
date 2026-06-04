# AIVC Invoice Automation

Generate invoices → send to DocuSign, in one flow.

---

## Deploy in 4 Steps

### 1. Push to GitHub

```bash
cd aivc-invoices
git init
git add .
git commit -m "Initial commit"
# Create a new repo at github.com/new (name it aivc-invoices, keep it Private)
git remote add origin https://github.com/YOUR_USERNAME/aivc-invoices.git
git branch -M main
git push -u origin main
```

---

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `aivc-invoices` GitHub repo
3. Framework preset will auto-detect as **Next.js** — leave all defaults
4. Click **Deploy**

---

### 3. Add Environment Variable on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | Your key from [console.anthropic.com](https://console.anthropic.com) |

Then **Redeploy** from the Deployments tab.

---

### 4. DocuSign Setup

The DocuSign button downloads a shell script. To run it you need:

1. A free DocuSign developer account at [developers.docusign.com](https://developers.docusign.com)
2. Create an app → get your **Account ID** and an **Access Token**
3. Replace `{{ACCESS_TOKEN}}` and `{{ACCOUNT_ID}}` in the downloaded `.sh` file, then run:

```bash
chmod +x docusign_invoice_2012.sh
./docusign_invoice_2012.sh
```

---

## Local Development

```bash
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY in .env.local
npm install
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
aivc-invoices/
├── app/
│   ├── layout.js
│   ├── page.js
│   └── api/
│       ├── generate-pdf/route.js   # Anthropic → Python PDF script
│       └── docusign/route.js       # Anthropic → DocuSign curl script
├── components/
│   └── InvoiceDashboard.js         # Main UI
├── .env.example
├── .gitignore
└── package.json
```

## Security

- `ANTHROPIC_API_KEY` lives only in server-side `/api/` routes — never sent to the browser
- `.env.local` is gitignored
