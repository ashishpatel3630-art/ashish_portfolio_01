
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashish Mewada | Agentic AI Engineer",
  description:
    "Portfolio of Ashish Mewada — AI Engineer building intelligent systems using Machine Learning, LLMs, RAG and Agentic AI.",
  applicationName: "Ashish Mewada — AI Engineer",
  authors: [{ name: "Ashish Mewada" }],
  openGraph: {
    title: "Ashish Mewada | AI Engineer",
    description: "Building intelligent systems that reason, retrieve, interact, and take action.",
    siteName: "Ashish Mewada",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ashish Mewada | Agentic AI Engineer",
    description: "Building intelligent systems that reason, retrieve, interact, and take action.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
