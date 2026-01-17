'use client';

import Image from "next/image";
import { Player } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlayerRadar } from "./player-radar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

const getElementIcon = (element: string) => {
  switch (element?.toLowerCase()) {
    case 'fire': return '/elements/fire.png';
    case 'wind': return '/elements/wind.png';
    case 'forest': return '/elements/forest.png';
    case 'mountain': return '/elements/mountain.png';
    default: return '/elements/void.png';
  }
};

const getPositionColor = (pos: string) => {
  switch (pos?.toUpperCase()) {
    case 'FW': return 'text-red-500';
    case 'MF': return 'text-orange-500';
    case 'DF': return 'text-blue-500';
    case 'GK': return 'text-white-500';
    default: return 'text-slate-400';
  }
};

export function PlayerModal({ player, isOpen, onClose }: PlayerModalProps) {
  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="flex flex-row items-center gap-6 p-6 pb-2 bg-slate-900/50">
          <Avatar className="h-24 w-24 border-2 border-slate-700 bg-slate-800 shadow-xl">
              <AvatarImage src={player.image_url || ''} className="object-cover" />
              <AvatarFallback className="text-3xl bg-slate-800 text-slate-500">
                {player.name_en.substring(0, 2).toUpperCase()}
              </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col gap-2 w-full">
            <div>
                <DialogTitle className="text-3xl font-black tracking-tight">{player.name_en}</DialogTitle>
                <p className="text-lg text-slate-500 font-medium">{player.name_jp || player.name_en}</p>
            </div>
            
            <div className="flex items-center gap-3 mt-1">
                <span className={`text-2xl font-black italic ${getPositionColor(player.position)}`}>
                    {player.position}
                </span>

                <div className="bg-slate-800 p-1 rounded-md border border-slate-700">
                    <Image 
                        src={getElementIcon(player.element)} 
                        alt={player.element} 
                        width={24} 
                        height={24}
                    />
                </div>

                <span className="text-slate-500 font-mono text-sm">
                    #{player.id}
                </span>

                {player.playstyle && (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                        {player.playstyle}
                    </Badge>
                )}
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-0 bg-slate-950">
           <PlayerRadar player={player} />
        </div>
      </DialogContent>
    </Dialog>
  );
}