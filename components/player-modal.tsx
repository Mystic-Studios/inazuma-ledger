'use client';

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

export function PlayerModal({ player, isOpen, onClose }: PlayerModalProps) {
  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-106.25">
        <DialogHeader className="flex flex-row items-center gap-4 border-b border-slate-800 pb-4">
          <Avatar className="h-16 w-16 border-2 border-slate-700">
             <AvatarImage src={player.image_url || ''} />
             <AvatarFallback className="text-xl bg-slate-800">
                {player.name_en.substring(0, 2).toUpperCase()}
             </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-xl font-bold">{player.name_en}</DialogTitle>
            <p className="text-sm text-slate-400">{player.name_jp}</p>
            <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{player.role}</Badge>
                <Badge variant="outline" className="text-xs">{player.element}</Badge>
            </div>
          </div>
        </DialogHeader>

        <PlayerRadar player={player} />

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 mt-2">
            <div className="flex flex-col items-center p-2 bg-slate-900 rounded">
                <span className="text-xs text-slate-500 uppercase">Total Stats</span>
                <span className="text-xl font-bold text-amber-500">{player.stats_base.total_stats}</span>
            </div>
             <div className="flex flex-col items-center p-2 bg-slate-900 rounded">
                <span className="text-xs text-slate-500 uppercase">Position</span>
                <span className="text-lg font-bold">{player.position || '-'}</span>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}