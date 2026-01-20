import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduMind AI - Turn Notes into Summaries & Quizzes",
  description: "Turn your study notes into instant summaries and AI-generated quizzes using advanced AI technology",
  keywords: ["study", "AI", "summaries", "quizzes", "notes"],
  authors: [{ name: "EduMind AI" }],
  openGraph: {
    title: "EduMind AI",
    description: "Turn your study notes into instant summaries and quizzes using AI",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
