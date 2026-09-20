import type { Metadata } from "next";
import "./globals.css";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Prompt Refiner | Deterministic prompt quality",
  description: "Refine intent, structure, constraints, and output before a prompt reaches an LLM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ParallaxBackground />
        {children}
      </body>
    </html>
  );
}
