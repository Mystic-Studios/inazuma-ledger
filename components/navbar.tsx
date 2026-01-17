'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Players", href: "/players" },
  { name: "Heroes", href: "/heroes" },
  { name: "Passives", href: "/passives" },
  { name: "Moves", href: "/moves" },
  { name: "Keshin", href: "/keshin" },
  { name: "Awakenings", href: "/awakenings" },
  { name: "Totems", href: "/totems" },
  { name: "Collection", href: "/collection" },
  { name: "Credits", href: "/credits" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full flex h-16 items-center justify-between px-6">
        
        <div className="flex-none">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="flex flex-col leading-none">
                    <span className="text-xl font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors">
                        INAZUMA LEDGER
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400">
                        Victory Road Collection Manager
                    </span>
                </div>
            </Link>
        </div>

        <nav className="hidden xl:flex flex-1 justify-center items-center px-4">
            <div className="flex items-center space-x-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                            isActive 
                            ? "bg-slate-800 text-white shadow-sm" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        )}
                        >
                        {item.name}
                        </Link>
                    )
                })}
            </div>
        </nav>

        <div className="flex-none flex items-center gap-2 min-w-[100px] justify-end">
          {loading ? (
             <div className="h-9 w-20 bg-slate-800/50 rounded-full animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-slate-700 bg-slate-800 p-0 hover:bg-slate-700">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
                    <AvatarFallback className="bg-slate-900 text-slate-400">
                        <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-950 border-slate-800 text-slate-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user.user_metadata.full_name}</p>
                    <p className="text-xs leading-none text-slate-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-slate-900 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={handleLogin}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-full px-5 h-9 text-xs transition-transform active:scale-95"
            >
              <LogIn className="mr-2 h-3.5 w-3.5" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}