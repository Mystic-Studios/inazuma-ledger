'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Player } from "@/types";

export function PlayerRadar({ player }: { player: Player }) {
  const data = [
    { subject: "Kick", A: player.stats_base.kick, fullMark: 100 },
    { subject: "Spd", A: player.stats_base.agility, fullMark: 100 },
    { subject: "Tech", A: player.stats_base.technique, fullMark: 100 },
    { subject: "Phys", A: player.stats_base.physical, fullMark: 100 },
    { subject: "Ctrl", A: player.stats_base.control, fullMark: 100 },
    { subject: "Pres", A: player.stats_base.pressure, fullMark: 100 },
  ];

  return (
    <div className="h-62.5 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }} 
          />
          <Radar
            name={player.name_en}
            dataKey="A"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}