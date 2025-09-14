import SpectrumProvider from "@/components/SpectrumProvider";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "My Wall",
  description: "map out your thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SpectrumProvider>
          <div className={nunito.className}>{children}</div>
        </SpectrumProvider>
      </body>
    </html>
  );
}
