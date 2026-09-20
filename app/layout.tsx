import type { Metadata } from "next";
import "./globals.css";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Prompt Builder | Deterministic prompt design",
  description: "Turn a rough idea into a structured, portable AI prompt.",
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
