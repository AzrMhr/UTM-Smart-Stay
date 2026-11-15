import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { CampusId } from '../types';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCampus: CampusId;
  onCampusChange: (campus: CampusId) => void;
  resultCount: number;
  sortBy?: 'recommended' | 'price_asc' | 'availability';
  onSortChange?: (sort: 'recommended' | 'price_asc' | 'availability') => void;
}

const CAMPUS_CHIPS: { id: CampusId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'jb', label: 'Johor Bahru' },
  { id: 'kl', label: 'Kuala Lumpur' },
  { id: 'pagoh', label: 'Pagoh' },
];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCampus,
  onCampusChange,
  sortBy = 'recommended',
  onSortChange,
}) => {
  return (
    <section className="w-full px-4 lg:px-8 pt-2 pb-3">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Prominent Search Bar spanning full width on mobile and sleek pill on desktop */}
        <div className="relative w-full lg:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-white/70" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search residences, rooms, or roommates..."
            className="w-full h-11 pl-10 pr-9 bg-black/25 hover:bg-black/30 focus:bg-black/35 text-white placeholder:text-white/65 text-sm rounded-2xl border border-white/15 focus:outline-hidden focus:border-white/40 transition-all backdrop-blur-xs"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Horizontally scrollable row of rounded filter chips + Dynamic Sort */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-2">
            {CAMPUS_CHIPS.map((chip) => {
              const isActive = selectedCampus === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => onCampusChange(chip.id)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#800000] shadow-sm'
                      : 'bg-black/20 text-white/85 border border-white/15 hover:bg-black/30 hover:text-white'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {onSortChange && (
            <div className="hidden sm:flex items-center gap-1.5 pl-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-white/70" />
              <select
                value={sortBy}
                onChange={(e) =>
                  onSortChange(
                    e.target.value as 'recommended' | 'price_asc' | 'availability'
                  )
                }
                aria-label="Sort residences"
                className="bg-black/25 text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 border border-white/15 focus:outline-none cursor-pointer"
              >
                <option value="recommended" className="text-slate-900">
                  Sort: Featured
                </option>
                <option value="price_asc" className="text-slate-900">
                  Price: Low to High
                </option>
                <option value="availability" className="text-slate-900">
                  Most Available
                </option>
              </select>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
