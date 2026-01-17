'use client';

import { useState } from "react";
import Image from "next/image";
import { Player } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerModal } from "./player-modal";
import { toggleCollection } from "@/actions/collection";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PlayersTableProps {
  players: Player[];
  initialCollection?: number[];
  isLoggedIn: boolean;
}

const getElementImage = (element: string) => {
  switch (element?.toLowerCase()) {
    case 'fire': return '/elements/fire.png';
    case 'wind': return '/elements/wind.png';
    case 'forest': return '/elements/forest.png';
    case 'mountain': return '/elements/mountain.png';
    default: return '/elements/void.png';
  }
};

const getPositionColor = (position: string) => {
  switch (position?.toUpperCase()) {
    case 'GK': return 'text-white-500';
    case 'FW': return 'text-red-500';
    case 'MF': return 'text-orange-500';
    case 'DF': return 'text-blue-500';
    default: return 'text-gray-400';
  }
};
export function PlayersTable({ players, initialCollection, isLoggedIn }: PlayersTableProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [collectedIds, setCollectedIds] = useState<Set<number>>(new Set(initialCollection));

  const handleToggle = async (player: Player, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLoggedIn) {
        toast.error("You must be logged in to collect players");
        return;
    }

    const isCollected = collectedIds.has(player.id);
    const newSet = new Set(collectedIds);
    if (isCollected) newSet.delete(player.id);
    else newSet.add(player.id);
    setCollectedIds(newSet);

    try {
      await toggleCollection(player.id, player.rarity);
      toast.success(isCollected ? "Removed from collection" : "Added to collection");
    } catch (error) {
      setCollectedIds(new Set(initialCollection));
      toast.error("Failed to update collection");
    }
  };

  return (
    <>
      <div className="rounded-md border border-slate-800 bg-slate-950 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900 hover:bg-slate-900">
            <TableRow className="border-slate-800">
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12 text-slate-400">ID</TableHead>
              <TableHead className="text-slate-400">PLAYER</TableHead>
              <TableHead className="text-slate-400">POSITION</TableHead>
              <TableHead className="text-slate-400">ELEMENT</TableHead>
              <TableHead className="text-slate-400">PLAYSTYLE</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">KICK</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">CTRL</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">TECH</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">PRES</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">PHYS</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">AGIL</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">INTL</TableHead>
              <TableHead className="text-right text-amber-500 font-bold">TOTAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => {
              const isCollected = collectedIds.has(player.id);
              return (
                <TableRow 
                  key={player.id} 
                  className={cn(
                    "border-slate-800 cursor-pointer transition-colors",
                    isCollected 
                        ? "bg-emerald-950/40 hover:bg-emerald-950/60" 
                        : "hover:bg-slate-900/50"
                  )}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <TableCell> 
                    <div className="flex gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleToggle(player, e)}
                            className={cn(
                                "h-8 w-8 transition-all active:scale-90",
                                isCollected 
                                    ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10" 
                                    : "text-slate-600 hover:text-slate-400 hover:bg-slate-800"
                            )}
                        >
                            <Plus className={cn("h-4 w-4", isCollected && "fill-current")} />
                        </Button>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-slate-500">
                    {player.id}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-700 bg-slate-800">
                        {player.image_url && (
                          <AvatarImage 
                            src={player.image_url} 
                            alt={player.name_en}
                            className="object-cover" 
                          />
                        )}
                        <AvatarFallback className="text-xs text-slate-400 bg-slate-900 font-medium">
                            {player.name_en.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className={cn("font-medium", isCollected ? "text-emerald-100" : "text-slate-200")}>
                            {player.name_en}
                        </span>
                        <span className="text-xs text-slate-500">{player.name_jp || '-'}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className={`font-black italic ${getPositionColor(player.position)}`}>
                    {player.position}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center" title={player.element}>
                      <Image 
                        src={getElementImage(player.element)} 
                        alt={player.element || 'Element'} 
                        width={24} 
                        height={24} 
                        className="opacity-90"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-400 text-sm">
                    {player.playstyle || '-'}
                  </TableCell>

                  <TableCell className="text-right font-mono text-slate-300">{player.stats_base.kick}</TableCell>
                  <TableCell className="text-right font-mono text-slate-300">{player.stats_base.control}</TableCell>
                  <TableCell className="text-right font-mono text-slate-300">{player.stats_base.technique}</TableCell>
                  <TableCell className="text-right font-mono text-slate-300">{player.stats_base.pressure}</TableCell>
                  <TableCell className="text-right font-mono text-slate-300">{player.stats_base.physical}</TableCell>
                  <TableCell className="text-right font-mono text-slate-300">{player.stats_base.agility}</TableCell>
                  <TableCell className="text-right font-mono text-slate-300">{player.stats_base.intelligence}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-amber-400">{player.stats_base.total_stats}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PlayerModal 
        player={selectedPlayer} 
        isOpen={!!selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
      />
    </>
  );
}