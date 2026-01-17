import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inazuma Ledger",
  description: "Victory Road Collection Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">

      <body className={`${inter.className} bg-slate-950 text-slate-200 min-h-screen flex flex-col`}>
        <Navbar />

        <main className="flex-1 w-full flex flex-col"> 
            {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}