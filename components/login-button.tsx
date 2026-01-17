'use client';

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function LoginButton() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button 
      onClick={handleLogin}
      className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-full px-8 h-12 transition-transform active:scale-95"
    >
      <LogIn className="mr-2 h-5 w-5" />
      Login with Discord
    </Button>
  );
}