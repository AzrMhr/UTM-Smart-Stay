import React, { useState } from 'react';
import {
  Menu,
  Bell,
  X,
  Shield,
  FileText,
  CheckCircle2,
  Phone,
  LogOut,
  ChevronRight,
  Building2,
  Search,
  TrendingUp,
} from 'lucide-react';
import { StudentUser, BookingRecord, PortalRole, CampusId } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  student: StudentUser;
  bookings: BookingRecord[];
  activeTabLabel?: string;
  selectedCampus?: CampusId;
  onCampusChange?: (campus: CampusId) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onNavigateToTab: (tab: 'home' | 'map' | 'community' | 'messages') => void;
  onSwitchPortal: (role: PortalRole) => void;
  onSignOutStudent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  student,
  bookings,
  selectedCampus = 'jb',
  onCampusChange,
  searchQuery = '',
  onSearchChange,
  onNavigateToTab,
  onSwitchPortal,
  onSignOutStudent,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const topNavItems: { id: CampusId; label: string }[] = [
    { id: 'all', label: 'ANALYTICS' },
    { id: 'jb', label: 'JOHOR BAHRU' },
    { id: 'kl', label: 'KUALA LUMPUR' },
    { id: 'pagoh', label: 'PAGOH' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#A81518]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-b border-white/10 lg:border-none transition-all">
        {/* Mobile Header (< lg): Exact 3-part layout */}
        <div className="lg:hidden px-4 h-14 flex items-center justify-between text-white">
          {/* Left side: Hamburger menu icon */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-transform"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Center: App title "UTM Smart Stay" in bold sans-serif */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigateToTab('home')}
          >
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4 text-[#A81518]" />
            </div>
            <span className="text-base font-black tracking-tight text-white select-none">
              UTM Smart Stay
            </span>
          </div>

          {/* Right side: Notification bell with indicator dot + Profile avatar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-transform relative"
              >
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-[#A81518]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Student profile"
              className="w-8 h-8 rounded-full ring-2 ring-white/80 overflow-hidden flex items-center justify-center bg-slate-200 active:scale-95 transition-transform"
            >
              <img
                src={
                  student.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'
                }
                alt={student.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Desktop Header (>= lg): Matches the Reference Image Crimson Top Bar */}
        <div className="hidden lg:flex items-center justify-between px-8 h-20 max-w-7xl mx-auto text-white">
          {/* Left: White Square Logo Mark + Uppercase Nav Links */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => onNavigateToTab('home')}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-[#B11217]" />
              </div>
              <div className="text-left">
                <span className="text-sm font-black tracking-tight text-white block leading-none">
                  UTM SMART STAY
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-white/70 uppercase">
                  Accommodation Hub
                </span>
              </div>
            </button>

            <nav className="flex items-center gap-6 pl-2">
              {topNavItems.map((item) => {
                const isActive = selectedCampus === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigateToTab('home');
                      if (onCampusChange) onCampusChange(item.id);
                    }}
                    className={`text-xs tracking-[0.14em] uppercase transition-all cursor-pointer py-1 border-b-2 ${
                      isActive
                        ? 'font-extrabold text-white border-white'
                        : 'font-semibold text-white/65 hover:text-white border-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Translucent Dark-Crimson Search Input + Bell + Avatar */}
          <div className="flex items-center gap-4">
            {onSearchChange && (
              <div className="relative w-72 xl:w-80">
                <Search className="w-4 h-4 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onNavigateToTab('home');
                    onSearchChange(e.target.value);
                  }}
                  placeholder="Search by Residence, Room, Matric..."
                  className="w-full h-10 pl-10 pr-8 rounded-xl bg-black/25 hover:bg-black/30 focus:bg-black/35 text-xs text-white placeholder:text-white/60 border border-white/10 focus:outline-none focus:border-white/30 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <PWAInstallButton variant="compact" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-[#B11217]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2.5 pl-1 cursor-pointer group"
              title="Open Student Profile Drawer"
            >
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Shared Notification Popover */}
        {notificationsOpen && (
          <div className="absolute right-4 lg:right-8 top-14 lg:top-18 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">Campus Notifications</span>
              <span className="text-[10px] font-semibold text-[#800000] bg-red-50 px-2 py-0.5 rounded-full">
                2 New
              </span>
            </div>

            <div className="space-y-2">
              <div
                onClick={() => {
                  setNotificationsOpen(false);
                  onNavigateToTab('community');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-red-50/50 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-800">
                  <span>Housing Office Verified</span>
                  <span className="text-[10px] text-slate-400 font-normal">10:45 AM</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  Deposit RM 200 for KTDI confirmed for {student.fullName} ({student.matricNo}).
                </p>
              </div>

              <div
                onClick={() => {
                  setNotificationsOpen(false);
                  onNavigateToTab('messages');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-red-50/50 cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-800">
                  <span>KSJ Waitlist Update</span>
                  <span className="text-[10px] text-slate-400 font-normal">09:12 AM</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  You moved to Position #3 for Kolej Siswa Jaya shared twin room.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Slide-out Navigation Drawer (Strictly Student-Facing) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <aside className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="p-5 text-white bg-gradient-to-br from-[#B11217] to-[#7A0B0E]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold tracking-wider text-red-100 uppercase">
                  UTM Student Portal
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center overflow-hidden">
                  <img
                    src={student.avatarUrl}
                    alt={student.fullName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {student.fullName}
                  </h3>
                  <p className="text-xs text-red-100 mt-0.5">Matric: {student.matricNo}</p>
                  <p className="text-[11px] text-red-200 font-mono flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 inline" />
                    {student.phone}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/20 text-[11px] text-red-100 flex items-center justify-between">
                <span>{student.faculty}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                  Active Term
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm text-slate-700">
              <div className="pb-1">
                <PWAInstallButton variant="sidebar" />
              </div>

              <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Student Housing Menu
              </div>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigateToTab('community');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#B11217]" />
                  <span className="font-medium text-slate-800">My Bookings &amp; Waitlist</span>
                </div>
                <span className="text-xs bg-red-50 text-[#B11217] font-bold px-2 py-0.5 rounded-full">
                  {bookings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigateToTab('map');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <Shield className="w-4 h-4 text-[#B11217]" />
                <span className="font-medium text-slate-800">Campus College Map &amp; POIs</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigateToTab('community');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <FileText className="w-4 h-4 text-[#B11217]" />
                <span className="font-medium text-slate-800">Roommate Matching Board</span>
              </button>

              {onSignOutStudent && (
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    onSignOutStudent();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">Sign Out / Switch Student</span>
                </button>
              )}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Staff Access
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    onSwitchPortal('admin');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-600 text-xs font-semibold text-left"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Housing Management Portal</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-600">UTM Smart Stay</p>
              <p className="text-[11px] mt-0.5">Independent Student Accommodation Platform</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
