'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Player } from "@/types";

const POS_BADGES = {
    GK: { label: 'GK', color: '#06b6d4' },
    DF: { label: 'DF', color: '#10b981' },
    MF: { label: 'MF', color: '#f59e0b' },
    FW: { label: 'FW', color: '#ef4444' },
};

const STAT_CONFIG = {
    Kick: { positions: ['FW'] },
    Control: { positions: ['FW', 'MF'] },
    Technique: { positions: ['FW', 'MF'] },
    Pressure: { positions: ['GK', 'DF'] },
    Physical: { positions: ['GK', 'DF'] },
    Agility: { positions: ['GK'] },
    Intelligence: { positions: ['DF', 'MF'] },
};

interface CustomTickProps {
  payload?: {
    value?: string;
  };
  x?: string | number;
  y?: string | number;
  cx?: string | number;
  cy?: string | number;
  statValues: Record<string, number>;
}
function CustomTick({ payload, x, y, cx, cy, statValues }: CustomTickProps) {
    const statName = payload?.value as keyof typeof STAT_CONFIG | undefined;
    if (!statName) return null;

    const config = STAT_CONFIG[statName];
    const value = statValues[statName] || 0;

    const _x = Number(x) || 0;
    const _y = Number(y) || 0;
    const _cx = Number(cx) || 0;
    const _cy = Number(cy) || 0;

    const angle = Math.atan2(_y - _cy, _x - _cx);
    const offset = 20; 
    
    const finalX = _x + Math.cos(angle) * offset;
    const finalY = _y + Math.sin(angle) * offset;

    return (
      <g transform={`translate(${finalX},${finalY})`}>
        <text x={0} y={0} dy={-25} textAnchor="middle" fill="white" className="text-2xl font-black" style={{ fontSize: '24px', fontWeight: 900 }}>
            {value}
        </text>
        
        <text x={0} y={0} dy={-5} textAnchor="middle" fill="#94a3b8" className="text-xs uppercase font-bold tracking-wider" style={{ fontSize: '10px' }}>
            {statName}
        </text>

        <g transform="translate(0, 8)">
            <foreignObject x="-40" y="0" width="80" height="24">
                <div className="flex justify-center gap-1 w-full h-full">
                    {config?.positions.map((pos: string) => {
                        const badge = POS_BADGES[pos as keyof typeof POS_BADGES];
                        return (
                            <span 
                                key={pos} 
                                style={{ backgroundColor: badge.color }} 
                                className="text-[9px] text-black font-bold px-1.5 py-0.5 rounded-[2px]"
                            >
                                {badge.label}
                            </span>
                        );
                    })}
                </div>
            </foreignObject>
        </g>
      </g>
    );
}

export function PlayerRadar({ player }: { player: Player }) {
  const data = [
    { subject: "Agility", A: player.stats_base.agility, fullMark: 111 },
    { subject: "Intelligence", A: player.stats_base.intelligence, fullMark: 121 },
    { subject: "Technique", A: player.stats_base.technique, fullMark: 116 },
    { subject: "Kick", A: player.stats_base.kick, fullMark: 121 },
    { subject: "Control", A: player.stats_base.control, fullMark: 115 },
    { subject: "Pressure", A: player.stats_base.pressure, fullMark: 105 },
    { subject: "Physical", A: player.stats_base.physical, fullMark: 109 },
  ];

  const statValues = {
      Agility: player.stats_base.agility,
      Intelligence: player.stats_base.intelligence,
      Technique: player.stats_base.technique,
      Kick: player.stats_base.kick,
      Control: player.stats_base.control,
      Pressure: player.stats_base.pressure,
      Physical: player.stats_base.physical,
  };

  return (
    <div className="h-[450px] w-full mt-4 select-none" pointer-events="none">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="55%" data={data}>
          <PolarGrid stroke="#1e293b" strokeWidth={1} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={(props) => <CustomTick {...props} statValues={statValues} />}
          />
          <Radar
            name={player.name_en}
            dataKey="A"
            stroke="#ef4444"
            strokeWidth={3}
            fill="#ef4444"
            fillOpacity={0.25}
            isAnimationActive={false}
            activeDot={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}