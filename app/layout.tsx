import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ProtectedRoutes from "@/components/protected-routes";
import { FavoritesProvider } from "@/hooks/use-favorites";
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
  title: "Portfolio Showcase",
  description: "HP・LP・SNS の制作実績を一覧と詳細で見せるポートフォリオサイト",
  icons: {
    icon: "/ficon.png",
    shortcut: "/ficon.png",
    apple: "/ficon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FavoritesProvider>
          <ProtectedRoutes>{children}</ProtectedRoutes>
        </FavoritesProvider>
      </body>
    </html>
  );
}
