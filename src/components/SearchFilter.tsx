import React from 'react';
import { Search, X } from 'lucide-react';
import { CampusId } from '../types';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCampus: CampusId;
  onCampusChange: (campus: CampusId) => void;
  resultCount: number;
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
}) => {
  return (
    <section className="w-full bg-[#F8F9FA] border-b border-slate-200/80 px-4 lg:px-8 pt-4 pb-3.5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Prominent Search Bar spanning full width on mobile and flexible width on desktop */}
        <div className="relative w-full lg:max-w-md xl:max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-slate-500" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search residences, rooms, or roommates..."
            className="w-full h-11 pl-10 pr-9 bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border border-slate-200/90 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000] transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Horizontally scrollable row of rounded filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {CAMPUS_CHIPS.map((chip) => {
            const isActive = selectedCampus === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onCampusChange(chip.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50'
                }`}
                style={
                  isActive
                    ? { backgroundColor: '#800000', borderColor: '#800000' }
                    : undefined
                }
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
