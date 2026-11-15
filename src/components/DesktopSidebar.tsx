import React from 'react';
import {
  BarChart3,
  MapPin,
  Users,
  MessageSquare,
  Briefcase,
  Settings,
  Building2,
} from 'lucide-react';
import { StudentUser, BookingRecord, WaitlistRecord, CampusId, PortalRole } from '../types';
import { TabType } from './BottomNav';

interface DesktopSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedCampus: CampusId;
  onCampusChange: (campus: CampusId) => void;
  student: StudentUser;
  bookings: BookingRecord[];
  waitlist: WaitlistRecord[];
  unreadCount: number;
  onSwitchPortal: (role: PortalRole) => void;
  onSignOutStudent?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onTabChange,
  bookings,
  unreadCount,
  onSwitchPortal,
  onSignOutStudent,
}) => {
  const dockItems: {
    id: string;
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    badge?: number;
    onClick: () => void;
  }[] = [
    {
      id: 'home',
      label: 'DASHBOARD',
      icon: BarChart3,
      isActive: activeTab === 'home',
      onClick: () => onTabChange('home'),
    },
    {
      id: 'map',
      label: 'CAMPUS MAP',
      icon: MapPin,
      isActive: activeTab === 'map',
      onClick: () => onTabChange('map'),
    },
    {
      id: 'community',
      label: 'COMMUNITY',
      icon: Users,
      isActive: activeTab === 'community',
      onClick: () => onTabChange('community'),
    },
    {
      id: 'bookings',
      label: 'BOOKINGS',
      icon: Briefcase,
      isActive: false,
      badge: bookings.length,
      onClick: () => onTabChange('community'),
    },
    {
      id: 'messages',
      label: 'MESSAGING',
      icon: MessageSquare,
      isActive: activeTab === 'messages',
      badge: unreadCount,
      onClick: () => onTabChange('messages'),
    },
    {
      id: 'settings',
      label: 'ACCOUNT',
      icon: Settings,
      isActive: false,
      onClick: () => {
        if (onSignOutStudent) onSignOutStudent();
      },
    },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:items-center lg:w-28 lg:fixed lg:left-6 xl:left-10 lg:top-24 lg:bottom-8 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.10)] border border-slate-100 py-4 px-2.5 z-30 select-none justify-between">
      {/* Main Vertical Icon Dock (Matches the floating white vertical pill dock in the design guide) */}
      <div className="w-full flex flex-col items-center gap-2">
        {dockItems.map((item) => {
          const Icon = item.icon;
          if (item.isActive) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="w-full aspect-square rounded-2xl bg-gradient-to-b from-[#B81419] to-[#8F0D11] text-white shadow-[0_10px_25px_rgba(177,18,23,0.35)] flex flex-col items-center justify-center gap-2 p-2 transition-transform active:scale-95 cursor-pointer relative"
              >
                <div className="w-8 h-8 rounded-full bg-white text-[#B11217] flex items-center justify-center shadow-xs">
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-extrabold tracking-[0.12em] uppercase leading-none">
                  {item.label}
                </span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-300 text-[#800000] text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className="w-full py-3 rounded-2xl text-slate-400 hover:text-slate-800 hover:bg-slate-50 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative group"
            >
              <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#B11217] transition-colors" />
              <span className="text-[9px] font-bold tracking-[0.12em] uppercase leading-none">
                {item.label}
              </span>
              {item.badge && item.badge > 0 && (
                <span className="absolute top-2 right-3 min-w-4 h-4 px-1 rounded-full bg-red-50 text-[#B11217] text-[9px] font-extrabold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Staff Portal Switcher */}
      <div className="w-full pt-2 border-t border-slate-100 flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={() => onSwitchPortal('admin')}
          title="Open HEPA Housing Staff Portal (/admin)"
          className="w-full py-2 rounded-xl text-slate-400 hover:text-[#B11217] hover:bg-red-50/50 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[8px] font-extrabold tracking-widest uppercase">STAFF</span>
        </button>
      </div>
    </aside>
  );
};
