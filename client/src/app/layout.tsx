import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import WagmiClientProvider from "../providers/wagmi-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "On-Chain Riddle",
  description: "On-Chain Riddle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎭</text></svg>"
      />
      <body className={`${montserrat.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WagmiClientProvider>{children}</WagmiClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
