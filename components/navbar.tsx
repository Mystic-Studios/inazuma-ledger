'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-lg">
              Inazuma Ledger
            </span>
          </Link>
        </div>

        <nav className="flex items-center space-x-4 text-sm font-medium overflow-x-auto no-scrollbar max-w-[60vw]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80 whitespace-nowrap",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 ml-auto">
          <Button variant="default" size="sm">
             Login with Discord
          </Button>
        </div>
      </div>
    </header>
  );
}