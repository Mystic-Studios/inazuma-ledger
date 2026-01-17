import { createClient } from "@/utils/supabase/server";
import { Progress } from "@/components/ui/progress"; 
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoginButton } from "@/components/login-button"; 
import { LockKeyhole } from "lucide-react";

interface CollectionItem {
  player_id: number;
  players: {
    id: number;
    name_en: string;
    rarity: string;
    element: string;
    image_url: string | null;
  } | null;
}

const getPercentageValue = (count: number, total: number) => {
  if (total === 0) return 0;
  return (count / total) * 100;
};

export default async function CollectionPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md border border-slate-800 bg-slate-900/50 p-10 rounded-2xl">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <LockKeyhole className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Login Required
            </h1>
            <p className="text-slate-400">
              Join Inazuma Ledger to track your collection.
            </p>
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from('user_collections')
    .select(`
      player_id,
      players (
        id,
        name_en,
        rarity,
        element,
        image_url
      )
    `)
    .eq('user_id', user.id);

  const userItems = (data as unknown as CollectionItem[]) || [];

  const { count: totalNormal } = await supabase.from('players').select('*', { count: 'exact', head: true }).eq('rarity', 'Normal');
  const { count: totalHero } = await supabase.from('players').select('*', { count: 'exact', head: true }).eq('rarity', 'Hero');
  const { count: totalFabled } = await supabase.from('players').select('*', { count: 'exact', head: true }).eq('rarity', 'Fabled');

  const collectedNormal = userItems.filter(i => i.players?.rarity === 'Normal').length;
  const collectedHero = userItems.filter(i => i.players?.rarity === 'Hero').length;
  const collectedFabled = userItems.filter(i => i.players?.rarity === 'Fabled').length;

  const pctNormal = getPercentageValue(collectedNormal, totalNormal || 1);
  const pctHero = getPercentageValue(collectedHero, totalHero || 1);
  const pctFabled = getPercentageValue(collectedFabled, totalFabled || 1);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="container mx-auto py-10 space-y-8">
        
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">My Collection</h1>
            <p className="text-slate-400">Track your progress towards 100% completion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-blue-400">Normal Players</h3>
                <span className="text-2xl font-black text-white">{pctNormal.toFixed(1)}%</span>
            </div>
            <Progress value={pctNormal} className="h-2 bg-slate-800" />
            <p className="mt-2 text-xs text-slate-500 text-right">{collectedNormal} / {totalNormal}</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-amber-400">Heroes</h3>
                <span className="text-2xl font-black text-white">{pctHero.toFixed(1)}%</span>
            </div>
            <Progress value={pctHero} className="h-2 bg-slate-800" indicatorClassName="bg-amber-400" />
            <p className="mt-2 text-xs text-slate-500 text-right">{collectedHero} / {totalHero}</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-purple-400">Fabled</h3>
                <span className="text-2xl font-black text-white">{pctFabled.toFixed(1)}%</span>
            </div>
            <Progress value={pctFabled} className="h-2 bg-slate-800" indicatorClassName="bg-purple-400" />
            <p className="mt-2 text-xs text-slate-500 text-right">{collectedFabled} / {totalFabled}</p>
            </div>
        </div>

        <div className="border border-slate-800 rounded-xl p-6 bg-slate-950">
            <h2 className="text-xl font-bold text-white mb-6">Collected Items ({userItems.length})</h2>
            <ScrollArea className="h-125">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pr-4">
                {userItems.map((item) => (
                    item.players && (
                        <div key={item.player_id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center gap-3 hover:bg-slate-800 transition-colors">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-950">
                                {item.players.image_url ? (
                                    <Image 
                                        src={item.players.image_url} 
                                        alt={item.players.name_en} 
                                        fill
                                        className="object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">No Img</div>
                                )}
                            </div>
                            <div className="text-center w-full">
                                <p className="text-xs font-bold text-slate-200 truncate w-full" title={item.players.name_en}>
                                    {item.players.name_en}
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                                    {item.players.rarity}
                                </p>
                            </div>
                        </div>
                    )
                ))}
                </div>
            </ScrollArea>
        </div>
      </div>
    </div>
  );
}