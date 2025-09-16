import SpectrumProvider from "@/components/SpectrumProvider";
import { UserProvider } from "@/contexts/UserContext";
import type { Metadata } from "next";
import localFont from "next/font/local";

const excalidraw = localFont({
  src: "../fonts/Excalifont-Regular.woff2",
  display: "swap",
  variable: "--font-excalifont",
});
import "./globals.css";

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
        <UserProvider>
          <SpectrumProvider>
            <div className={excalidraw.className}>{children}</div>
          </SpectrumProvider>
        </UserProvider>
      </body>
    </html>
  );
}
