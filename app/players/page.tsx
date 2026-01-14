import { supabase } from "@/lib/supabaseClient";
import { Player } from "@/types";
import { SearchControls } from "@/components/ui/search-controls";
import { PlayersTable } from "@/components/players-table";

export const dynamic = 'force-dynamic';

export default async function PlayersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;

  const query = (searchParams?.query as string) || '';
  const role = (searchParams?.role as string) || '';
  const currentPage = Number(searchParams?.page) || 1;
  const ITEMS_PER_PAGE = 50;

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let supabaseQuery = supabase
    .from('players')
    .select('*', { count: 'exact' });

  if (query) {
    supabaseQuery = supabaseQuery.ilike('name_en', `%${query}%`);
  }
  
  if (role) {
    supabaseQuery = supabaseQuery.ilike('role', `%${role}%`); 
  }

  const { data: players, count, error } = await supabaseQuery
    .order('id', { ascending: true })
    .range(from, to);

  if (error) {
    return <div className="p-10 text-red-500">Error: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <div className="container mx-auto py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Player Database</h1>
            <p className="text-slate-500 text-sm">
                Data synced from Google Sheets · {count} players found
            </p>
        </div>

        <SearchControls />

        <PlayersTable players={players as Player[]} />

        <div className="flex justify-between items-center mt-6 text-sm text-slate-500">
             <div>Showing {players?.length} players</div>
             <div className="flex gap-2"></div>
        </div>
      </div>
    </main>
  );
}