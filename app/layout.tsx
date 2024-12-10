import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { EB_Garamond } from "next/font/google";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import AppProviders from "@/components/providers/app-providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Pulsar - Integration & Notification Solution",
  description: "Welcome to Pulsar! 🌌 Pulsar is a powerful platform that enables users to create API keys, define event categories, and seamlessly integrate with Discord (Direct Message or Channel) and Slack. Experience an easy way to trigger real-time notifications and updates to your platforms, effortlessly! 🛠️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/80 text-sm !shadow-none",
        },
      }}
    >
      <html lang="en" className={cn(inter.variable, eb_garamond.variable)}>
        <body className="font-sans antialiased">
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
