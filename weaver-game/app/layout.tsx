import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Weaver",
  description: "A quiet, surreal, text-based experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

