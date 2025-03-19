import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import "./markdown.css";

export const metadata: Metadata = {
  title: "Whispr",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
