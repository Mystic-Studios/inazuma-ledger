'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchControls() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) params.set('query', term);
    else params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleRoleClick = (role: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (role) params.set('role', role);
    else params.delete('role');
    replace(`${pathname}?${params.toString()}`);
  };

  const currentRole = searchParams.get('role');

  return (
    <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Search a player..."
                    className="pl-9 bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-slate-700"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('query')?.toString()}
                />
            </div>

            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['All', 'GK', 'DF', 'MF', 'FW'].map((role) => {
                    const isActive = role === 'All' ? !currentRole : currentRole === role;
                    return (
                        <button
                            key={role}
                            onClick={() => handleRoleClick(role === 'All' ? null : role)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                isActive 
                                ? 'bg-slate-800 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {role}
                        </button>
                    )
                })}
            </div>

            <div className="flex gap-2">
                <Button variant="outline" className="border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white">
                    <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
            </div>
        </div>
    </div>
  );
}