// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import RoutePrefetcher from "./components/RoutePrefetcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ganspro Kenya",
  description: "Empowering Students, Transforming Lives",
  icons: {
    icon: [
      {
        url: "/LOGO.png", // Path to your logo in the public folder
        type: "image/png", // Change to "image/jpeg" if using JPEG, or "image/svg+xml" for SVG
      },
      {
        url: "/LOGO.PNG", // Fallback for older browsers
        type: "image/png",
      },
    ],
    apple: {
      url: "/LOGO.png", // For Apple devices
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <RoutePrefetcher />
          {children}
        </Providers>
      </body>
    </html>
  );
}