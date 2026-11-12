import React, { useState } from 'react';
import {
  Menu,
  Bell,
  X,
  Shield,
  FileText,
  Database,
  RotateCcw,
  CheckCircle2,
  Phone,
  User,
  Rocket,
  ChevronRight,
} from 'lucide-react';
import { StudentUser, BookingRecord, WaitlistRecord } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  student: StudentUser;
  bookings: BookingRecord[];
  waitlist: WaitlistRecord[];
  activeTabLabel?: string;
  onOpenDatabaseModal: () => void;
  onOpenDeployModal: () => void;
  onResetDatabase: () => void;
  onNavigateToTab: (tab: 'home' | 'map' | 'community' | 'messages') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  student,
  bookings,
  openDeployModal,
  onOpenDatabaseModal,
  onOpenDeployModal,
  onResetDatabase,
  onNavigateToTab,
  activeTabLabel = 'Accommodations Dashboard',
}: NavbarProps & { openDeployModal?: () => void }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleOpenDeploy = onOpenDeployModal || openDeployModal || (() => {});

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 transition-all">
        {/* Mobile Header (< lg): Exact 3-part layout (Hamburger Left, "UTM Smart Stay" Center, Bell + Avatar Right) */}
        <div className="lg:hidden px-4 h-14 flex items-center justify-between">
          {/* Left side: Hamburger menu icon */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-transform"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Center: App title "UTM Smart Stay" in bold, dark red sans-serif */}
          <div
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={() => onNavigateToTab('home')}
          >
            <span
              className="text-lg font-black tracking-tight select-none"
              style={{ color: '#800000' }}
            >
              UTM Smart Stay
            </span>
          </div>

          {/* Right side: User profile avatar and notification bell with red dot */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-transform relative"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
              </button>
            </div>

            {/* Profile Avatar */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Student profile"
              className="w-8 h-8 rounded-full ring-2 ring-slate-100 overflow-hidden flex items-center justify-center bg-slate-200 active:scale-95 transition-transform"
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

        {/* Desktop Header (>= lg): Breadcrumb Left, Action Buttons & Profile Right */}
        <div className="hidden lg:flex items-center justify-between px-8 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span
              onClick={() => onNavigateToTab('home')}
              className="font-bold text-[#800000] cursor-pointer hover:underline"
            >
              UTM Smart Stay
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">{activeTabLabel}</span>
          </div>

          <div className="flex items-center gap-3">
            <PWAInstallButton variant="compact" />

            <button
              type="button"
              onClick={handleOpenDeploy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-[#800000]" />
              <span>Deploy Guide</span>
            </button>

            <button
              type="button"
              onClick={onOpenDatabaseModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live DB</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
              </button>
            </div>

            {/* Student Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-slate-900">{student.fullName}</div>
                <div className="text-[10px] font-mono text-slate-500">{student.matricNo}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Notification Popover */}
        {notificationsOpen && (
          <div className="absolute right-4 lg:right-8 top-14 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
                  Deposit RM 200 for KTDI confirmed for Azraf Mahir (A24MJ3028).
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

      {/* Mobile Slide-out Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <aside className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="p-5 text-white" style={{ backgroundColor: '#800000' }}>
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
                Accommodation Management
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
                  <CheckCircle2 className="w-4 h-4 text-[#800000]" />
                  <span className="font-medium text-slate-800">My Bookings &amp; Applications</span>
                </div>
                <span className="text-xs bg-red-50 text-[#800000] font-bold px-2 py-0.5 rounded-full">
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
                <Shield className="w-4 h-4 text-[#800000]" />
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
                <FileText className="w-4 h-4 text-[#800000]" />
                <span className="font-medium text-slate-800">Roommate Matching Board</span>
              </button>

              <div className="pt-3 px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Deployment &amp; Database Tools
              </div>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  handleOpenDeploy();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50/50 hover:bg-red-50 transition-colors text-left border border-red-100"
              >
                <Rocket className="w-4 h-4 text-[#800000]" />
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Deployment &amp; PWA Guide
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Vercel &amp; GitHub Pages instructions
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenDatabaseModal();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left border border-slate-200"
              >
                <Database className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">Database Inspector</span>
                  <span className="text-[11px] text-slate-500">
                    View real-time records &amp; inventory
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (resetConfirm) {
                    onResetDatabase();
                    setResetConfirm(false);
                    setDrawerOpen(false);
                  } else {
                    setResetConfirm(true);
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors text-left"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-medium">
                  {resetConfirm ? 'Click again to confirm reset' : 'Reset Database to Seed State'}
                </span>
              </button>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-600">SCSE2243 Application Development I</p>
              <p className="text-[11px] mt-0.5">UTM MJIIT • Standalone Student Housing Hub</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
