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
const SHEET_GID = '1173802089'; 

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
    const match = cell.f.match(/"([^"]+)"/);
    return match ? match[1] : null;
  }
  
  if (cell.v && String(cell.v).startsWith('http')) {
    return String(cell.v);
  }

  return null;
};

async function importPlayers() {
  const xlsxUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx&gid=${SHEET_GID}`;
  
  try {
    const response = await fetch(xlsxUrl);
    if (!response.ok) throw new Error(`Failed to fetch XLSX: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as SheetRow[];
    
    const headers = jsonData[0] as string[];
    
    const getIdx = (name: string) => headers.indexOf(name);
    const imageColIdx = getIdx('Image');

    const formattedPlayers = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      const getVal = (colName: string) => {
        const idx = getIdx(colName);
        return idx !== -1 ? row[idx] : undefined;
      };

      const getNum = (colName: string) => {
        const val = getVal(colName);
        if (typeof val === 'number') return val;
        const cleaned = String(val || '').replace(/,/g, '').trim();
        return cleaned ? Number(cleaned) : 0;
      };

      const cellAddress = XLSX.utils.encode_cell({ r: i, c: imageColIdx });
      const rawCell = sheet[cellAddress]; 
      const imageUrl = extractUrl(rawCell);

      const getString = (colName: string) => {
        const val = getVal(colName);
        return typeof val === 'string' ? val : undefined;
      };

      formattedPlayers.push({
        id: Number(getVal('ID')),
        name_en: getString('Name(Localised)'),
        name_jp: getString('Name(Romaji)'),
        gender: cleanText(getString('Gender')),

        role: cleanText(getString('Role')),
        position: getString('Position'),
        alt_position: getString('Alt Position'),
        element: cleanText(getString('Element')),
        playstyle: getString('Preferred Playstyle'),
        
        stats_base: {
          kick: getNum('Kick'),
          control: getNum('Control'),
          technique: getNum('Technique'),
          pressure: getNum('Pressure'),
          physical: getNum('Physical'),
          agility: getNum('Agility'),
          intelligence: getNum('Intelligence'),
          total_stats: getNum('Total Stats'),
        },
        stats_composite: {}, 
        
        image_url: imageUrl || null
      });
    }

    const BATCH_SIZE = 100;
    for (let i = 0; i < formattedPlayers.length; i += BATCH_SIZE) {
      const batch = formattedPlayers.slice(i, i + BATCH_SIZE);
      await supabase.from('players').upsert(batch, { onConflict: 'id' });
    }

    console.log('Import Complete.');

  } catch (err) {
    console.error('Script failed:', err);
  }
}

importPlayers();