import type { Metadata } from "next";
import { Afacad } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const afacad = Afacad({
  variable: "--font-afacad",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AgriPulse",
  description:
    "Real-time agricultural market intelligence for Rwanda — USSD for farmers, dashboard for officers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${afacad.variable} h-full antialiased`}>
      <body className="min-h-full font-sans text-ap-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
