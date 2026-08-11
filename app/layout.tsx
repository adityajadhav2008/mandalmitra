import "./globals.css";
import { LanguageProvider } from "./language-provider";

export const metadata = {
  title: "MandalSetu",
  description: "Every Mandal, One Simple Platform",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}