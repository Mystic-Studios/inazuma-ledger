export interface PlayerStats {
  kick: number;
  control: number;
  technique: number;
  pressure: number;
  physical: number;
  agility: number;
  intelligence: number;
  total_stats: number;
}

export interface Player {
  id: number;
  name_en: string;
  name_jp: string | null;
  gender: string | null;
  role: string;
  position: string;
  alt_position: string | null;
  element: string;
  playstyle: string | null;
  stats_base: PlayerStats;
  stats_composite: string | null;
  image_url: string | null;
}