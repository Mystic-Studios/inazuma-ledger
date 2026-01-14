import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SHEET_ID = '1N4h7z27Rxq3bvYuR9VyeQv3Ze-zwo-1XZQTd9rZa-Zs'; 
const SHEET_GID = '1173802089'; 

interface CsvRow {
  [key: string]: string | undefined;
}
async function importPlayers() {

  const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
  
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    const csvText = await response.text();

    const { data } = Papa.parse<CsvRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    console.log(`Found ${data.length} rows.`);
    
    // DEBUG
    if (data.length > 0) {
      console.log('HEADERS FOUND IN SHEET:', Object.keys(data[0]));
    }

    const formattedPlayers = data.map((row) => {
      const getNum = (val: string | undefined) => {
        const cleaned = val?.replace(/,/g, '').trim();
        return cleaned ? Number(cleaned) : 0;
      };

      return {
        id: row['ID'],
        name_en: row['Name(Localised)'],
        name_jp: row['Name(Romaji)'],
        gender: row['Gender'],
        role: row['Role'],
        position: row['Position'],
        alt_position: row['Alt Position'],
        element: row['Element'],
        playstyle: row['Preferred Playstyle'],
        
        stats_base: {
          kick: getNum(row['Kick']),
          control: getNum(row['Control']),
          technique: getNum(row['Technique']),
          pressure: getNum(row['Pressure']),
          physical: getNum(row['Physical']),
          agility: getNum(row['Agility']),
          intelligence: getNum(row['Intelligence']),
          total_stats: getNum(row['Total Stats']),
        },
        stats_composite: {
           
        },
        
        image_url: row['Image'] || null
      };
    });

    const BATCH_SIZE = 100;
    for (let i = 0; i < formattedPlayers.length; i += BATCH_SIZE) {
      const batch = formattedPlayers.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('players').upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`Error inserting batch ${i}:`, error.message);
      }

    }

    console.log('\nImport Complete.');

  } catch (err) {
    console.error('Script failed:', err);
  }
}

importPlayers();