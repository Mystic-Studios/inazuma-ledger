import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlayerCardProps {
  player: Player;
}

const getElementColor = (element: string) => {
  switch (element?.toLowerCase()) {
    case 'fire': return 'bg-red-500 hover:bg-red-600';
    case 'wind': return 'bg-green-500 hover:bg-blue-600';
    case 'wood': return 'bg-emerald-700 hover:bg-emerald-800';
    case 'earth': return 'bg-yellow-600 hover:bg-yellow-700';
    default: return 'bg-slate-500';
  }
};

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold truncate pr-2">
                {player.name_en}
            </CardTitle>
            <Badge className={getElementColor(player.element)}>
                {player.element}
            </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{player.name_jp}</p>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 text-sm">
        <div className="flex justify-between mb-2">
            <span className="font-semibold text-muted-foreground">Role:</span>
            <span>{player.role}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
            <div>Kick: <span className="font-bold text-foreground">{player.stats_base.kick}</span></div>
            <div>Spd: <span className="font-bold text-foreground">{player.stats_base.agility}</span></div>
            <div>Tech: <span className="font-bold text-foreground">{player.stats_base.technique}</span></div>
            <div>Phys: <span className="font-bold text-foreground">{player.stats_base.physical}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}