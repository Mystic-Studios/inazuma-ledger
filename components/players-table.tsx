'use client';

import { useState } from "react";
import { Player } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerModal } from "./player-modal";

interface PlayersTableProps {
  players: Player[];
}

const getElementColor = (element: string) => {
  switch (element?.toLowerCase()) {
    case 'fire': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'wind': return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'wood': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    case 'earth': return 'text-yellow-600 bg-yellow-600/10 border-yellow-600/20';
    default: return 'text-slate-500 bg-slate-500/10';
  }
};

const getPositionColor = (position: string) => {
  switch (position?.toUpperCase()) {
    case 'GK': return 'text-yellow-500';
    case 'FW': return 'text-red-500';
    case 'MF': return 'text-blue-500';
    case 'DF': return 'text-green-500';
    default: return 'text-gray-400';
  }
};

export function PlayersTable({ players }: PlayersTableProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <>
      <div className="rounded-md border border-slate-800 bg-slate-950 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900 hover:bg-slate-900">
            <TableRow className="border-slate-800">
              <TableHead className="w-12.5"></TableHead>
              <TableHead className="w-12.5 text-slate-400">ID</TableHead>
              <TableHead className="text-slate-400">PLAYER</TableHead>
              <TableHead className="text-slate-400">POSITION</TableHead>
              <TableHead className="text-slate-400">ELEMENT</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">KICK</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">CTRL</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">TECH</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">PHYS</TableHead>
              <TableHead className="text-right text-blue-400 font-bold">AGIL</TableHead>
              <TableHead className="text-right text-amber-500 font-bold">TOTAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow 
                key={player.id} 
                className="border-slate-800 hover:bg-slate-900/50 group cursor-pointer"
                onClick={() => setSelectedPlayer(player)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}> 
                  <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10">
                          <Plus className="h-4 w-4" />
                      </Button>
                  </div>
                </TableCell>

                <TableCell className="font-mono text-slate-500">
                  {player.id}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-700 bg-slate-800">
                      <AvatarImage src={player.image_url || ''} />
                      <AvatarFallback className="text-xs text-slate-500">
                          {player.name_en.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-200">{player.name_en}</span>
                      <span className="text-xs text-slate-500">{player.name_jp || '-'}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className={`font-black italic ${getPositionColor(player.position)}`}>
                  {player.position}
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className={`${getElementColor(player.element)} border-0`}>
                      {player.element}
                  </Badge>
                </TableCell>

                <TableCell className="text-right font-mono text-slate-300">{player.stats_base.kick}</TableCell>
                <TableCell className="text-right font-mono text-slate-300">{player.stats_base.control}</TableCell>
                <TableCell className="text-right font-mono text-slate-300">{player.stats_base.technique}</TableCell>
                <TableCell className="text-right font-mono text-slate-300">{player.stats_base.physical}</TableCell>
                <TableCell className="text-right font-mono text-slate-300">{player.stats_base.agility}</TableCell>
                <TableCell className="text-right font-mono font-bold text-amber-400">{player.stats_base.total_stats}</TableCell>
              </TableRow>
            ))}
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