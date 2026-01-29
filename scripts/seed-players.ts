import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SHEET_ID = '1N4h7z27Rxq3bvYuR9VyeQv3Ze-zwo-1XZQTd9rZa-Zs'; 

const SHEETS = [
  { gid: '1173802089', rarity: 'Normal' },
  { gid: '454016586', rarity: 'Hero' },
  { gid: '1441010188', rarity: 'Fabled' },
];

type SheetRow = (string | number | undefined)[];

const cleanText = (val: unknown) => {
  if (typeof val !== 'string' || !val) return 'Unknown';
  const match = val.match(/\(([^)]+)\)/);
  if (match) return match[1].trim();
  return val.trim();
};

const extractUrl = (cell: XLSX.CellObject | undefined) => {
  if (!cell) return null;
  
  if (cell.f) {
    const match = cell.f.match(/"(https?:\/\/[^"]+)"/);
    if (match) return match[1];
  }
  
  if (cell.v && String(cell.v).startsWith('http')) {
    return String(cell.v);
  }

  return null;
};

const getColumnIndex = (headers: string[], possibleNames: string[]) => {
  const lowerHeaders = headers.map(h => h?.toString().toLowerCase().trim());
  for (const name of possibleNames) {
    const idx = lowerHeaders.indexOf(name.toLowerCase().trim());
    if (idx !== -1) return idx;
  }
  return -1;
};

async function importPlayers() {
  const allPlayers = [];
  let nextAutoId = 5854;
  const imageMap = new Map<string, string>();

  console.log('Starting Import Script...');

  for (const sheetConfig of SHEETS) {
    console.log(`\nFetching ${sheetConfig.rarity} players...`);
    const xlsxUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx&gid=${sheetConfig.gid}`;
    
    try {
      const response = await fetch(xlsxUrl);
      if (!response.ok) throw new Error(`Failed to fetch XLSX for ${sheetConfig.rarity}: ${response.statusText}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as SheetRow[];
      if (jsonData.length === 0) continue;

      const headers = jsonData[0] as string[];

      const colIdx = {
        id: getColumnIndex(headers, ['ID']),
        image: getColumnIndex(headers, ['Image']),
        nameEn: getColumnIndex(headers, ['Name (Localised)', 'Name(Localised)']),
        nameJp: getColumnIndex(headers, ['Name (Romaji)', 'Name(Romaji)']),
        gender: getColumnIndex(headers, ['Gender']),
        role: getColumnIndex(headers, ['Role']),
        position: getColumnIndex(headers, ['Position']),
        altPosition: getColumnIndex(headers, ['Alt Position']),
        element: getColumnIndex(headers, ['Element']),
        playstyle: getColumnIndex(headers, ['Preferred Playstyle', 'Playstyle']),
        kick: getColumnIndex(headers, ['Kick']),
        control: getColumnIndex(headers, ['Control']),
        technique: getColumnIndex(headers, ['Technique']),
        pressure: getColumnIndex(headers, ['Pressure']),
        physical: getColumnIndex(headers, ['Physical']),
        agility: getColumnIndex(headers, ['Agility']),
        intelligence: getColumnIndex(headers, ['Intelligence']),
        total: getColumnIndex(headers, ['Total Stats', 'Total']),
      };

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const getRaw = (idx: number) => (idx !== -1 ? row[idx] : undefined);
        const getString = (idx: number) => {
            const val = getRaw(idx);
            return typeof val === 'string' ? val : undefined;
        };
        const getNum = (idx: number) => {
          const val = getRaw(idx);
          if (typeof val === 'number') return val;
          const cleaned = String(val || '').replace(/,/g, '').trim();
          return cleaned ? Number(cleaned) : 0;
        };

        const rawNameEn = getString(colIdx.nameEn) || getString(colIdx.nameJp);
        if (!rawNameEn || rawNameEn.trim() === '' || rawNameEn === 'Unknown') {
            continue;
        }
        
        const cleanName = cleanText(rawNameEn);

        let imageUrl = null;
        if (colIdx.image !== -1) {
            const cellAddress = XLSX.utils.encode_cell({ r: i, c: colIdx.image });
            const rawCell = sheet[cellAddress]; 
            imageUrl = extractUrl(rawCell);
        }

        if (imageUrl) {
            if (!imageMap.has(cleanName)) {
                imageMap.set(cleanName, imageUrl);
            }
        } 

        else if (imageMap.has(cleanName)) {
            imageUrl = imageMap.get(cleanName);
        }

        let playerId = Number(getRaw(colIdx.id));
        if (isNaN(playerId) || playerId === 0) {
            playerId = nextAutoId++;
        }

        let role = cleanText(getString(colIdx.role));
        if (role === 'Unknown' || !role) {
            role = 'Player';
        }

        const kick = getNum(colIdx.kick);
        const control = getNum(colIdx.control);
        const technique = getNum(colIdx.technique);
        const pressure = getNum(colIdx.pressure);
        const physical = getNum(colIdx.physical);
        const agility = getNum(colIdx.agility);
        const intelligence = getNum(colIdx.intelligence);

        let totalStats = getNum(colIdx.total);
        if (totalStats === 0) {
            totalStats = kick + control + technique + pressure + physical + agility + intelligence;
        }

        allPlayers.push({
          id: playerId,
          name_en: rawNameEn,
          name_jp: getString(colIdx.nameJp),
          gender: cleanText(getString(colIdx.gender)),
          role: role,
          position: getString(colIdx.position),
          alt_position: getString(colIdx.altPosition),
          element: cleanText(getString(colIdx.element)),
          playstyle: getString(colIdx.playstyle),
          rarity: sheetConfig.rarity,
          
          stats_base: {
            kick, control, technique, pressure, physical, agility, intelligence,
            total_stats: totalStats,
          },
          stats_composite: {}, 
          image_url: imageUrl || null
        });
      }
    } catch (err) {
      console.error(`Error processing ${sheetConfig.rarity}:`, err);
    }
  }

  console.log(`\nUploading ${allPlayers.length} valid players to Supabase...`);
  const BATCH_SIZE = 100;
  for (let i = 0; i < allPlayers.length; i += BATCH_SIZE) {
    const batch = allPlayers.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('players').upsert(batch, { onConflict: 'id' });
    
    if (error) console.error(`Batch Error:`, error.message);
    else process.stdout.write('.');
  }

  console.log(`\nImport Complete!`);
}

importPlayers();