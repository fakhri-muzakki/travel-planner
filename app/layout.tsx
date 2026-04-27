import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Planner",
  description:
    "Travel Planner is an AI-powered app that helps you create automated vacation plans based on your destination, budget, travel dates, interests, food preferences, and travel style. It generates daily itineraries complete with activity recommendations, dining options, and cost estimates to make vacation planning easier and more convenient.",
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
        <ThemeProvider>
          {children}
          <ModeToggle />
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 3000,
              removeDelay: 1000,

              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "16px",
                padding: "14px 16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                backdropFilter: "blur(10px)",
              },

              success: {
                duration: 3000,
                style: {
                  background: "rgba(16,185,129,0.10)",
                  color: "hsl(var(--foreground))",
                  border: "1px solid rgba(16,185,129,0.25)",
                },
                iconTheme: {
                  primary: "#10b981",
                  secondary: "hsl(var(--background))",
                },
              },

              error: {
                style: {
                  background: "rgba(239,68,68,0.10)",
                  color: "hsl(var(--foreground))",
                  border: "1px solid rgba(239,68,68,0.25)",
                },
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "hsl(var(--background))",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
