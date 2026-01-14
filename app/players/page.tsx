import { supabase } from "@/lib/supabaseClient";
import { Player } from "@/types";
import { PlayerCard } from "@/components/player-card";

export const revalidate = 0;

export default async function Home() {
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
    .limit(50)
    .order('id', { ascending: true });

  if (error) {
    return <div className="p-10 text-red-500">Error loading players: {error.message}</div>;
  }

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight text-slate-900">
            Inazuma Ledger
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(players as Player[]).map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </main>
  );
}