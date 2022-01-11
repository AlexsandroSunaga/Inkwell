import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACME Knowledge Assistant",
  description: "Portfolio RAG demo — synthetic HR policies, cited answers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0f1419", color: "#e7ecf3" }}>
        {children}
      </body>
    </html>
  );
}
