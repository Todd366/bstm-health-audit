import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BSTM Business Health Audit",
  description: "Measure. Diagnose. Improve.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
