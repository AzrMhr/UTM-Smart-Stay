import React, { useState } from 'react';
import {
  ArrowLeft,
  Grid,
  List,
  Check,
  Clock,
  Ban,
  Building2,
  Layers,
  ChevronRight,
  Home,
  Info,
} from 'lucide-react';
import { RoomItem, RoomProperty } from '../types';

interface RoomSelectionViewProps {
  property: RoomProperty;
  rooms: RoomItem[];
  onBack: () => void;
  onSelectRoom: (room: RoomItem) => void;
}

export const RoomSelectionView: React.FC<RoomSelectionViewProps> = ({
  property,
  rooms,
  onBack,
  onSelectRoom,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'floor'>('list');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [featureFilter, setFeatureFilter] = useState<string | null>(null);

  // Filter rooms belonging to this property
  const propertyRooms = rooms.filter((r) => r.propertyId === property.id);

  // Available floors
  const distinctFloors = Array.from(new Set(propertyRooms.map((r) => r.floor))).sort(
    (a, b) => b - a
  ); // highest floor first

  // Categories (especially for Residensi variant)
  const distinctCategories = Array.from(new Set(propertyRooms.map((r) => r.roomType)));

  // Filtered rooms
  const filteredRooms = propertyRooms.filter((r) => {
    if (selectedFloor !== 'all' && r.floor !== selectedFloor) return false;
    if (selectedCategory !== 'all' && r.roomType !== selectedCategory) return false;
    if (onlyAvailable && r.status !== 'available') return false;
    if (featureFilter && !r.features.includes(featureFilter)) return false;
    return true;
  });

  const availableCount = propertyRooms.filter((r) => r.status === 'available').length;
  const isApartmentStyle = property.id === 'res-kl-05';

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-5 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation (Addendum 01 Sec. 6) */}
      <nav className="flex items-center gap-1.5 text-[11px] lg:text-xs text-slate-500 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
        >
          <Home className="w-3.5 h-3.5 text-[#800000]" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate max-w-[140px]">{property.campusName}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-bold text-slate-800 truncate max-w-[180px]">{property.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-bold text-[#800000]">Select Room</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column on Desktop: Sticky Building Overview & Filters */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          {/* Header Banner & Summary */}
          <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-2xs space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#800000] hover:underline mb-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Accommodations</span>
                </button>
                <h1 className="text-lg lg:text-xl font-bold text-slate-900 leading-tight">
                  {property.name}
                </h1>
                <p className="text-xs text-slate-500">{property.address}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs lg:text-sm font-bold text-[#800000]">
                  From RM {property.priceMonth} / mo
                </div>
                <div className="text-[11px] text-slate-400">{property.roomType}</div>
              </div>
            </div>

            {/* Real-time Derived Availability Counter (Addendum 01 Sec. 2 & 5) */}
            <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {availableCount} of {propertyRooms.length} rooms available this semester
                </span>
              </div>

              <span className="text-[11px] font-mono text-[#800000] font-semibold">
                Live DB
              </span>
            </div>
          </div>

          {/* Residensi Variant: Apartment Type Selector (Addendum 01 Sec. 1 & 6 F11) */}
          {isApartmentStyle && (
            <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#800000]" />
                <span>Residensi Unit &amp; Room Options</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {distinctCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-50/60 border-[#800000] shadow-xs text-[#800000] font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="font-semibold text-[11px] truncate">{cat}</div>
                      <div className="text-[10px] text-slate-400">
                        {
                          propertyRooms.filter(
                            (r) => r.roomType === cat && r.status === 'available'
                          ).length
                        }{' '}
                        free
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* View Mode & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              {/* View Mode Toggle: LIST VIEW vs FLOOR VIEW (Addendum 01 Sec. 6 F9d) */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-[#800000] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('floor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'floor'
                      ? 'bg-white text-[#800000] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Floor View</span>
                </button>
              </div>

              {/* Available only toggle */}
              <button
                type="button"
                onClick={() => setOnlyAvailable(!onlyAvailable)}
                className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold border transition-colors cursor-pointer ${
                  onlyAvailable
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {onlyAvailable ? 'Available Only' : 'All Statuses'}
              </button>
            </div>

            {/* Floor Filter Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Filter by Floor
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedFloor('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedFloor === 'all'
                      ? 'bg-[#800000] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All Floors
                </button>
                {distinctFloors.map((fl) => (
                  <button
                    key={fl}
                    type="button"
                    onClick={() => setSelectedFloor(fl)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedFloor === fl
                        ? 'bg-[#800000] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Floor {fl}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature quick tags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Room Features
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                {['Balcony', 'Corner Room', 'Air Conditioning', 'Quiet Corner'].map((feat) => {
                  const isActive = featureFilter === feat;
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => setFeatureFilter(isActive ? null : feat)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-800 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {feat} {isActive && '✕'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column on Desktop: Room List or Floor Matrix */}
        <div className="lg:col-span-8">
          {/* VIEW 1: LIST VIEW (Addendum 01 Sec. 6 F9d) */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRooms.map((room) => {
                const isFree = room.status === 'available';
                const isHeld = room.status === 'held';

                return (
                  <div
                    key={room.id}
                    className={`p-4 bg-white rounded-2xl border flex flex-col justify-between transition-all duration-150 ${
                      isFree
                        ? 'border-slate-200 shadow-2xs hover:border-[#800000] hover:shadow-xs'
                        : 'border-slate-200/60 opacity-80 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-bold text-slate-900 font-mono">
                              Room {room.roomNo}
                            </span>
                            {room.unitNo && (
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                                {room.unitNo}
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                                isFree
                                  ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300'
                                  : isHeld
                                  ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {isFree ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Available</span>
                                </>
                              ) : isHeld ? (
                                <>
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>Held (15m Hold)</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="w-3 h-3 text-slate-400" />
                                  <span>Booked</span>
                                </>
                              )}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500">
                            Floor {room.floor} • {room.block || 'Main Wing'} • {room.roomType}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-[#800000] tabular-nums">
                            RM {room.priceMonth} / mo
                          </div>
                          <div className="text-[10px] text-slate-400 tabular-nums">
                            RM {room.priceSemester} / sem
                          </div>
                        </div>
                      </div>

                      {/* Features chips */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {room.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>

                      {/* 2BR Unit Context (Addendum 01 Sec. 6 F11) */}
                      {room.unitContext && (
                        <div className="mt-3 p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1">
                          <div className="font-semibold text-blue-900 flex items-center gap-1 text-[11px]">
                            <Info className="w-3 h-3 text-blue-600" />
                            <span>Unit Context ({room.unitContext.unitNo})</span>
                          </div>
                          {room.unitContext.otherRooms.map((other, idx) => (
                            <div key={idx} className="flex justify-between text-[11px] text-blue-800">
                              <span>
                                {other.label} (Room {other.roomNo})
                              </span>
                              <span className="font-semibold capitalize">
                                {other.status === 'booked' ? 'Occupied' : other.status}
                              </span>
                            </div>
                          ))}
                          <p className="text-[10px] text-blue-600 italic">
                            Shares common living area &amp; kitchen.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        Deposit: RM {room.depositAmount}
                      </span>

                      <button
                        type="button"
                        disabled={!isFree}
                        onClick={() => onSelectRoom(room)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-2xs hover:opacity-95 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                        style={{ backgroundColor: isFree ? '#800000' : '#64748b' }}
                      >
                        {isFree ? 'Select Room' : isHeld ? 'Held by Student' : 'Room Unavailable'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredRooms.length === 0 && (
                <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                  No rooms match your filter criteria. Try resetting the floor or features.
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: FLOOR VIEW (Addendum 01 Sec. 6 F9d) */}
          {viewMode === 'floor' && (
            <div className="space-y-4">
              {/* Status Legend */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs flex flex-wrap items-center justify-around gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-600 ring-1 ring-emerald-300" />
                  <span className="text-[11px] font-semibold text-slate-700">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-500 ring-1 ring-amber-300" />
                  <span className="text-[11px] font-semibold text-slate-700">Held (15m)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-300" />
                  <span className="text-[11px] font-semibold text-slate-700">Booked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-rose-200" />
                  <span className="text-[11px] font-semibold text-slate-700">Maint.</span>
                </div>
              </div>

              {distinctFloors.map((floorNum) => {
                const floorRooms = propertyRooms.filter((r) => r.floor === floorNum);

                return (
                  <div
                    key={floorNum}
                    className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#800000]" />
                        <h3 className="text-sm font-bold text-slate-800">Floor {floorNum}</h3>
                      </div>

                      <span className="text-[11px] text-slate-500 font-medium tabular-nums">
                        {floorRooms.filter((r) => r.status === 'available').length} of{' '}
                        {floorRooms.length} free
                      </span>
                    </div>

                    {/* Floor Room Tiles Grid (Touch targets min 44px) */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                      {floorRooms.map((room) => {
                        const isFree = room.status === 'available';
                        const isHeld = room.status === 'held';
                        const isBooked = room.status === 'booked';

                        return (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => onSelectRoom(room)}
                            disabled={!isFree}
                            className={`min-h-[54px] p-2 rounded-xl text-center flex flex-col justify-center items-center transition-all ${
                              isFree
                                ? 'bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-950 active:scale-95 shadow-2xs cursor-pointer'
                                : isHeld
                                ? 'bg-amber-50 border border-amber-300 text-amber-900'
                                : isBooked
                                ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                                : 'bg-rose-50 border border-rose-200 text-rose-500 cursor-not-allowed'
                            }`}
                          >
                            <span className="text-xs font-bold font-mono leading-none">
                              {room.roomNo}
                            </span>
                            <span className="text-[9px] mt-1 truncate max-w-full font-medium tabular-nums">
                              {isFree ? `RM ${room.priceMonth}` : isHeld ? 'Held' : 'Taken'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
