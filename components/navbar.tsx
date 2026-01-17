'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Players", href: "/players" },
  { name: "Heroes", href: "/heroes" },
  { name: "Passives", href: "/passives" },
  { name: "Special Moves", href: "/moves" },
  { name: "Keshin", href: "/keshin" },
  { name: "Awakenings", href: "/awakenings" },
  { name: "Totems", href: "/totems" },
  { name: "Collection", href: "/collection" },
  { name: "Credits", href: "/credits" },
];
export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between relative">
        
        <Link href="/" className="flex items-center gap-2 group z-20">
            <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors">
                    INAZUMA
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400">
                    Victory Road
                </span>
            </div>
        </Link>

        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all",
                    isActive 
                    ? "bg-slate-800 text-white shadow-sm" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
                >
                {item.name}
                </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 z-20">
          <Button 
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-full px-6 transition-transform active:scale-95"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}