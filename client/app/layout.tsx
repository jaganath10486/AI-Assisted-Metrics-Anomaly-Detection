import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anomaly Detect | AI Dashboard",
  description: "AI-assisted metrics anomaly detection platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
