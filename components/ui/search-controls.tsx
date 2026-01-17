'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const ELEMENTS = ['Fire', 'Wind', 'Forest', 'Mountain'];
const GENDERS = ['Male', 'Female'];
const PLAYSTYLES = ['Bond', 'Breach', 'Counter', 'Justice', 'Rough Play', 'Tension'];
const ROLES = ['Player', 'Manager', 'Coach', 'Coordinator'];

export function SearchControls() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

    const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    if (value) {
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    } else {
      params.delete(key);
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) params.set('query', term);
    else params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const activePos = searchParams.get('position');
  const activeElement = searchParams.get('element');
  const activeGender = searchParams.get('gender');
  const activeStyle = searchParams.get('playstyle');
  const activeRole = searchParams.get('role');

  const activeFilterCount = [activeElement, activeGender, activeStyle, activeRole].filter(Boolean).length;

  return (
    <div className="space-y-4 mb-6">
        <div className="flex flex-row flex-wrap gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            
            <div className="relative flex-1 min-w-50">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Search a player..."
                    className="pl-9 bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-slate-700"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('query')?.toString()}
                />
            </div>

            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
                {['All', 'GK', 'DF', 'MF', 'FW'].map((label) => {
                    const isSelected = label === 'All' ? !activePos : activePos === label;
                    return (
                        <button
                            key={label}
                            onClick={() => updateFilter('position', label === 'All' ? null : label)}
                            className={`px-3 md:px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                                isSelected 
                                ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                            }`}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white relative ${activeFilterCount > 0 ? 'text-blue-400 border-blue-900/50' : ''}`}>
                    <Filter className="mr-2 h-4 w-4" /> 
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-blue-500/20 text-blue-400 text-[10px]">
                        {activeFilterCount}
                      </Badge>
                    )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-slate-950 border-slate-800 p-4" align="end">
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-200 leading-none">Filters</h4>
                    {activeFilterCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-0 text-xs text-slate-500 hover:text-red-400"
                        onClick={() => replace(`${pathname}?position=${activePos || ''}`)} 
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  
                  <Separator className="bg-slate-800" />

                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-slate-500 uppercase">Element</h5>
                    <div className="flex flex-wrap gap-2">
                      {ELEMENTS.map((elm) => (
                        <Badge
                          key={elm}
                          variant="outline"
                          className={`cursor-pointer transition-colors ${
                            activeElement === elm 
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 hover:bg-indigo-500/30' 
                            : 'text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                          onClick={() => updateFilter('element', elm)}
                        >
                          {elm}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-slate-500 uppercase">Gender</h5>
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map((gen) => (
                        <Badge
                          key={gen}
                          variant="outline"
                          className={`cursor-pointer transition-colors ${
                            activeGender === gen 
                            ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 hover:bg-pink-500/30' 
                            : 'text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                          onClick={() => updateFilter('gender', gen)}
                        >
                          {gen}
                        </Badge>
                      ))}
                    </div>
                  </div>

                   <div className="space-y-2">
                    <h5 className="text-xs font-medium text-slate-500 uppercase">Playstyle</h5>
                    <div className="flex flex-wrap gap-2">
                      {PLAYSTYLES.map((style) => (
                        <Badge
                          key={style}
                          variant="outline"
                          className={`cursor-pointer transition-colors ${
                            activeStyle === style 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30' 
                            : 'text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                          onClick={() => updateFilter('playstyle', style)}
                        >
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-slate-500 uppercase">Role</h5>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map((role) => (
                        <Badge
                          key={role}
                          variant="outline"
                          className={`cursor-pointer transition-colors ${
                            activeRole === role 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30' 
                            : 'text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                          onClick={() => updateFilter('role', role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                </div>
              </PopoverContent>
            </Popover>
        </div>
    </div>
  );
}