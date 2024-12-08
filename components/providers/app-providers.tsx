"use client"

import { FC, ReactNode } from "react";
import dynamic from "next/dynamic";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";

const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);
interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <>
      <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
      <Toaster richColors position="bottom-right" closeButton />
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        storageKey="Pulsar"
        enableSystem
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </>
  );
};

export default AppProviders;
