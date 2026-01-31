import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from "./providers";
import { Header } from "@/widgets/layout/ui/Header";
import { Footer } from "@/widgets/layout/ui/Footer";
import "./fonts.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Slava Larionov - Ремешки для Apple Watch",
  description: "Создай уникальный ремешок для своих Apple Watch. Конфигуратор ремешков с персонализацией.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${manrope.variable} antialiased`}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
