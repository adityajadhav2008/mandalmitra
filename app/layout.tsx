import "./globals.css";
import { LanguageProvider } from "./language-provider";

export const metadata = {
  title: "MandalMitra",
  description: "Every Mandal, One Simple Platform",
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