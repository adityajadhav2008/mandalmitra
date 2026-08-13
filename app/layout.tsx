import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import { LanguageProvider } from "./language-provider";

export const metadata: Metadata = {
  title: "MandalSetu",
  description: "Mandal management made simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white pb-[76px] lg:pb-0">
        <LanguageProvider>
          {children}

          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}