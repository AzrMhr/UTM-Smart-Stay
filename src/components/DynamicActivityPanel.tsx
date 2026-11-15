import React, { useState } from 'react';
import {
  BedDouble,
  Users,
  Car,
  Bookmark,
  ArrowUpRight,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { RoomProperty, RoomItem, RoommateListing, CarpoolListing } from '../types';

interface DynamicActivityPanelProps {
  properties: RoomProperty[];
  rooms: RoomItem[];
  roommates: RoommateListing[];
  carpools: CarpoolListing[];
  wishlist: string[];
  onToggleWishlist: (propertyId: string) => void;
  onSelectProperty: (property: RoomProperty) => void;
  onOpenCommunity: () => void;
}

type TimeframeFilter = 'realtime' | 'today' | 'month' | 'all';

export const DynamicActivityPanel: React.FC<DynamicActivityPanelProps> = ({
  properties,
  rooms,
  roommates,
  carpools,
  wishlist,
  onToggleWishlist,
  onSelectProperty,
  onOpenCommunity,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('realtime');
  const [savedRows, setSavedRows] = useState<string[]>([]);

  const toggleSaveRow = (id: string) => {
    setSavedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Build dynamic feed items based on live rooms, properties, roommates, and carpools
  const availableKtdiRooms = rooms.filter(
    (r) => r.propertyId === 'ktdi-jb-01' && r.status === 'available'
  ).length;
  const availableResRooms = rooms.filter(
    (r) => r.propertyId === 'res-kl-05' && r.status === 'available'
  ).length;
  const availableKrpRooms = rooms.filter(
    (r) => r.propertyId === 'krp-jb-03' && r.status === 'available'
  ).length;

  const ktdiProp = properties.find((p) => p.id === 'ktdi-jb-01') || properties[0];
  const ksjProp = properties.find((p) => p.id === 'ksj-kl-02') || properties[1];
  const resProp = properties.find((p) => p.id === 'res-kl-05') || properties[0];
  const krpProp = properties.find((p) => p.id === 'krp-jb-03') || properties[0];

  const allItems = [
    {
      id: 'act-ktdi-502',
      title: 'Block M-04 • Corner Single Room 502 Released',
      subtitle: `${availableKtdiRooms} units open in Kolej Tun Dr. Ismail`,
      platform: 'UTM Johor Bahru',
      category: 'room' as const,
      viewsMetric: '1,248',
      applicationsMetric: '18',
      deltaMetric: `+${availableKtdiRooms} open`,
      timeframe: 'realtime' as const,
      badgeColor: 'from-[#9E1316] to-[#60080A]',
      property: ktdiProp,
    },
    {
      id: 'act-res-1203',
      title: 'Residensi UTM KL • Tower A Master & Studio Suites',
      subtitle: `${availableResRooms} luxury partner units ready for immediate check-in`,
      platform: 'UTM Kuala Lumpur',
      category: 'room' as const,
      viewsMetric: '2,890',
      applicationsMetric: '42',
      deltaMetric: '+94% match',
      timeframe: 'realtime' as const,
      badgeColor: 'from-slate-800 to-slate-950',
      property: resProp,
    },
    {
      id: 'act-rm-azraf',
      title: `${roommates[0]?.studentName || 'Azraf Mahir'} • MJIIT Roommate Match`,
      subtitle: roommates[0]?.targetResidence || 'Kolej Siswa Jaya / Residensi UTM KL',
      platform: 'Roommate Board',
      category: 'roommate' as const,
      viewsMetric: '640',
      applicationsMetric: '9',
      deltaMetric: '+3 new',
      timeframe: 'today' as const,
      badgeColor: 'from-amber-600 to-amber-800',
      property: ksjProp,
    },
    {
      id: 'act-cp-ksj',
      title: carpools[0]?.route || 'KSJ Setiawangsa ➔ UTM KL / MJIIT Gate',
      subtitle: `${carpools[0]?.driverName || 'Farhan'} • ${carpools[0]?.departureTime || '8:15 AM'}`,
      platform: 'Campus Carpool',
      category: 'carpool' as const,
      viewsMetric: '412',
      applicationsMetric: `${carpools[0]?.seatsAvailable ?? 3} seats`,
      deltaMetric: 'RM 2.50',
      timeframe: 'today' as const,
      badgeColor: 'from-emerald-600 to-emerald-800',
      property: ksjProp,
    },
    {
      id: 'act-krp-301',
      title: 'Kolej Rahman Putra (KRP) • Balcony Deluxe Batch',
      subtitle: `${availableKrpRooms} single balcony rooms near Sports Complex`,
      platform: 'UTM Johor Bahru',
      category: 'room' as const,
      viewsMetric: '3,410',
      applicationsMetric: '64',
      deltaMetric: '+12% wk',
      timeframe: 'month' as const,
      badgeColor: 'from-[#9E1316] to-[#60080A]',
      property: krpProp,
    },
  ];

  const visibleItems =
    timeframe === 'all'
      ? allItems
      : timeframe === 'realtime'
      ? allItems.slice(0, 3)
      : timeframe === 'today'
      ? allItems.filter((i) => i.timeframe === 'today' || i.timeframe === 'realtime')
      : allItems;

  const tabs: { id: TimeframeFilter; label: string }[] = [
    { id: 'realtime', label: 'Realtime Data' },
    { id: 'today', label: 'Today' },
    { id: 'month', label: 'Past Month' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <section className="px-4 lg:px-8 py-4 max-w-7xl w-full mx-auto">
      <div className="bg-white rounded-3xl shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-slate-200/70 p-5 lg:p-7 space-y-5">
        {/* Header Row: Title on Left, Timeframe Tabs on Right (matches design guide) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base lg:text-lg font-bold text-slate-800 tracking-tight">
              Accommodation &amp; Campus Updates
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#A81518]">
              <Sparkles className="w-3 h-3" />
              Live Feed
            </span>
          </div>

          <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = timeframe === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimeframe(tab.id)}
                  className={`pb-2 -mb-4 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-[#B11217] text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Column Headers */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
          <div className="col-span-5">Update / Residence Stream</div>
          <div className="col-span-2">Campus Hub</div>
          <div className="col-span-1 text-right">Views</div>
          <div className="col-span-1 text-right">Inquiries</div>
          <div className="col-span-1 text-right">Delta</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Dynamic Feed Rows */}
        <div className="divide-y divide-slate-100">
          {visibleItems.map((item) => {
            const isSaved =
              savedRows.includes(item.id) ||
              (item.property && wishlist.includes(item.property.id));

            return (
              <div
                key={item.id}
                className="py-3.5 px-2 flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 hover:bg-slate-50/80 rounded-2xl transition-colors"
              >
                {/* Content Name + Thumbnail */}
                <div className="md:col-span-5 flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-14 h-10 rounded-xl bg-gradient-to-br ${item.badgeColor} text-white flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {item.category === 'room' && <BedDouble className="w-4 h-4" />}
                    {item.category === 'roommate' && <Users className="w-4 h-4" />}
                    {item.category === 'carpool' && <Car className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs lg:text-sm font-bold text-slate-800 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{item.subtitle}</span>
                    </div>
                  </div>
                </div>

                {/* Platform / Campus */}
                <div className="md:col-span-2 flex items-center justify-between md:justify-start text-xs font-semibold text-slate-600">
                  <span className="md:hidden text-[10px] uppercase text-slate-400">Campus:</span>
                  <span>{item.platform}</span>
                </div>

                {/* Numeric Telemetry Columns */}
                <div className="grid grid-cols-3 md:contents gap-2 text-xs font-bold tabular-nums">
                  <div className="md:col-span-1 md:text-right text-slate-700">
                    <span className="md:hidden text-[10px] text-slate-400 block">Views</span>
                    {item.viewsMetric}
                  </div>
                  <div className="md:col-span-1 md:text-right text-slate-700">
                    <span className="md:hidden text-[10px] text-slate-400 block">Active</span>
                    {item.applicationsMetric}
                  </div>
                  <div className="md:col-span-1 md:text-right text-emerald-600">
                    <span className="md:hidden text-[10px] text-slate-400 block">Status</span>
                    {item.deltaMetric}
                  </div>
                </div>

                {/* Action Buttons (Matches "Save" dark button + "Watch Now" crimson button in design guide) */}
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      toggleSaveRow(item.id);
                      if (item.property) {
                        onToggleWishlist(item.property.id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#1E2430] hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3 h-3" />
                        <span>Save</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (item.category === 'room' && item.property) {
                        onSelectProperty(item.property);
                      } else {
                        onOpenCommunity();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#B11217] hover:bg-[#8E0E12] text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>{item.category === 'room' ? 'Book Now' : 'Connect'}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
