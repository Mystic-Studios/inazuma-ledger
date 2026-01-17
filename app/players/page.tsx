import { Player } from "@/types";
import { SearchControls } from "@/components/ui/search-controls";
import { PlayersTable } from "@/components/players-table";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function PlayersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const query = (searchParams?.query as string) || '';
  const position = (searchParams?.position as string) || '';
  const element = (searchParams?.element as string) || '';
  const gender = (searchParams?.gender as string) || '';
  const playstyle = (searchParams?.playstyle as string) || '';
  const role = (searchParams?.role as string) || '';

  const currentPage = Number(searchParams?.page) || 1;
  const ITEMS_PER_PAGE = 50; 

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let supabaseQuery = supabase
    .from('players')
    .select('*', { count: 'exact' });

  if (query) supabaseQuery = supabaseQuery.ilike('name_en', `%${query}%`);
  if (position) supabaseQuery = supabaseQuery.ilike('position', `${position}`);
  if (element) supabaseQuery = supabaseQuery.ilike('element', `${element}`);
  if (gender) supabaseQuery = supabaseQuery.ilike('gender', `${gender}`);
  if (playstyle) supabaseQuery = supabaseQuery.ilike('playstyle', `${playstyle}`);
  if (role) supabaseQuery = supabaseQuery.ilike('role', role);

  const { data: players, count, error } = await supabaseQuery
    .order('id', { ascending: true }) 
    .range(from, to);

  if (error) {
    return <div className="p-10 text-red-500">Error: {error.message}</div>;
  }

  const { data: { user } } = await supabase.auth.getUser();
  let collectedIds: number[] = [];

  if (user) {
    const { data: collection } = await supabase
      .from('user_collections')
      .select('player_id')
      .eq('user_id', user.id);
    
    if (collection) {
      collectedIds = collection.map((c) => c.player_id);
    }
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

        <PlayersTable 
            players={players as Player[]} 
            initialCollection={collectedIds} 
        />

        {count && (
          <PaginationControls 
            totalCount={count} 
            currentPage={currentPage} 
            pageSize={ITEMS_PER_PAGE} 
          />
        )}
      </div>
    </main>
  );
}