import React, { useState } from 'react';
import {
  Home,
  Map,
  Users,
  MessageSquare,
  Database,
  Rocket,
  RotateCcw,
  Phone,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { StudentUser, BookingRecord, WaitlistRecord, CampusId } from '../types';
import { TabType } from './BottomNav';
import { PWAInstallButton } from './PWAInstallButton';

interface DesktopSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedCampus: CampusId;
  onCampusChange: (campus: CampusId) => void;
  student: StudentUser;
  bookings: BookingRecord[];
  waitlist: WaitlistRecord[];
  unreadCount: number;
  onOpenDatabaseModal: () => void;
  onOpenDeployModal: () => void;
  onResetDatabase: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onTabChange,
  selectedCampus,
  onCampusChange,
  student,
  bookings,
  waitlist,
  unreadCount,
  onOpenDatabaseModal,
  onOpenDeployModal,
  onResetDatabase,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const navItems: { id: TabType; label: string; sublabel: string; icon: React.ElementType; badge?: number }[] = [
    {
      id: 'home',
      label: 'Accommodations',
      sublabel: 'Browse & book rooms',
      icon: Home,
    },
    {
      id: 'map',
      label: 'Campus Map & POIs',
      sublabel: 'Colleges, faculties & shuttles',
      icon: Map,
    },
    {
      id: 'community',
      label: 'Community & Bookings',
      sublabel: `${bookings.length} active • ${waitlist.length} waitlisted`,
      icon: Users,
    },
    {
      id: 'messages',
      label: 'Student Messages',
      sublabel: 'HEPA & Resident Assistants',
      icon: MessageSquare,
      badge: unreadCount,
    },
  ];

  const campuses: { id: CampusId; label: string; count: string }[] = [
    { id: 'all', label: 'All UTM Campuses', count: '6 Colleges' },
    { id: 'jb', label: 'Johor Bahru (Skudai)', count: '3 Colleges' },
    { id: 'kl', label: 'Kuala Lumpur (MJIIT)', count: '2 Colleges' },
    { id: 'pagoh', label: 'Pagoh Edu Hub', count: '1 Complex' },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:left-0 bg-white border-r border-slate-200/90 z-30 select-none">
      {/* Brand Header */}
      <div className="px-6 h-16 border-b border-slate-100 flex items-center justify-between">
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs"
            style={{ backgroundColor: '#800000' }}
          >
            UTM
          </div>
          <div>
            <span
              className="text-base font-black tracking-tight block leading-none"
              style={{ color: '#800000' }}
            >
              UTM Smart Stay
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              Student Accommodation Hub
            </span>
          </div>
        </div>
      </div>

      {/* Verified Student Card (Azraf Mahir) */}
      <div className="p-4 border-b border-slate-100">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center gap-3">
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#800000]/20"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-bold text-slate-900 truncate">
                  {student.fullName}
                </h3>
                <ShieldCheck className="w-3.5 h-3.5 text-[#800000] shrink-0" />
              </div>
              <p className="text-[11px] font-mono font-semibold text-[#800000]">
                {student.matricNo}
              </p>
              <p className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <Phone className="w-2.5 h-2.5" />
                {student.phone}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-500">
            <span className="truncate">{student.faculty}</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-50/80 text-[#800000] shadow-2xs ring-1 ring-[#800000]/20'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#800000] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Campus Filter */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Campus Filter
          </div>
          {campuses.map((c) => {
            const isSelected = selectedCampus === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onCampusChange(c.id);
                  if (activeTab !== 'home' && activeTab !== 'map') {
                    onTabChange('home');
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="w-3.5 h-3.5 shrink-0 opacity-75" />
                  <span className="truncate">{c.label}</span>
                </div>
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Developer, PWA & Deployment Tools */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Native App &amp; Deployment
          </div>

          <PWAInstallButton variant="sidebar" />

          <button
            type="button"
            onClick={onOpenDeployModal}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 text-xs font-bold transition-colors text-left cursor-pointer"
          >
            <Rocket className="w-4 h-4 text-[#800000] shrink-0" />
            <div>
              <span className="block leading-tight">Deploy &amp; Install Guide</span>
              <span className="text-[10px] text-slate-500 font-normal">
                Vercel &amp; GitHub Pages steps
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenDatabaseModal}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 text-xs font-bold transition-colors text-left cursor-pointer"
          >
            <Database className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="block leading-tight">Database Inspector</span>
              <span className="text-[10px] text-slate-500 font-normal">
                Room-level records &amp; locks
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirmReset) {
                onResetDatabase();
                setConfirmReset(false);
              } else {
                setConfirmReset(true);
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>
              {confirmReset ? 'Click again to confirm reset' : 'Reset Seed Database'}
            </span>
          </button>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-600">SCSE2243 App Dev Project I</div>
        <div>UTM MJIIT • PWA &amp; Responsive Web</div>
      </div>
    </aside>
  );
};
