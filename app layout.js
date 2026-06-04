export const metadata = {
  title: "AIVC Invoice Automation",
  description: "Generate, sign, and track client invoices",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
