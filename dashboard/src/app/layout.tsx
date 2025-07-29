import type { Metadata } from "next";
import "./globals.css";
import SpectrumProvider from "@/components/SpectrumProvider";

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
      <body className="antialiased font-helvetica">
        <SpectrumProvider>{children}</SpectrumProvider>
      </body>
    </html>
  );
}
