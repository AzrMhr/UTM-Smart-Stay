import React, { useState, useMemo } from 'react';
import {
  Building2,
  LayoutDashboard,
  Grid3X3,
  ClipboardList,
  Clock,
  LogOut,
  ShieldCheck,
  Plus,
  CheckCircle2,
  XCircle,
  Send,
  DollarSign,
  BedDouble,
  Lock,
  ArrowRight,
  Users,
  Terminal,
  GraduationCap,
} from 'lucide-react';
import {
  RoomProperty,
  RoomItem,
  BookingRecord,
  WaitlistRecord,
  PortalRole,
} from '../types';
import { LocalDatabase } from '../data/database';

interface AdminPortalProps {
  properties: RoomProperty[];
  rooms: RoomItem[];
  bookings: BookingRecord[];
  waitlist: WaitlistRecord[];
  onRefreshData: () => void;
  onSwitchPortal: (role: PortalRole) => void;
  onShowToast: (msg: string) => void;
}

type AdminTab = 'overview' | 'rooms' | 'bookings' | 'waitlist';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  properties,
  rooms,
  bookings,
  waitlist,
  onRefreshData,
  onSwitchPortal,
  onShowToast,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [staffEmail, setStaffEmail] = useState('admin@utm.my');
  const [staffPasscode, setStaffPasscode] = useState('HEPA2026');
  const [staffName, setStaffName] = useState('Dr. Norazlina (HEPA Director)');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    properties[0]?.id || 'ktdi-jb-01'
  );

  // Bulk room creation state
  const [bulkBlock, setBulkBlock] = useState('Block M-04');
  const [bulkFloor, setBulkFloor] = useState(6);
  const [bulkStartIdx, setBulkStartIdx] = useState(1);
  const [bulkCount, setBulkCount] = useState(4);

  // Pricing update state
  const selectedProperty = useMemo(
    () => properties.find((p) => p.id === selectedPropertyId) || properties[0],
    [properties, selectedPropertyId]
  );
  const [editMonthPrice, setEditMonthPrice] = useState<number>(
    selectedProperty?.priceMonth || 450
  );
  const [editSemPrice, setEditSemPrice] = useState<number>(
    selectedProperty?.priceSemester || 2250
  );
  const [editDeposit, setEditDeposit] = useState<number>(
    selectedProperty?.depositAmount || 200
  );

  const handleSelectProperty = (propId: string) => {
    setSelectedPropertyId(propId);
    const prop = properties.find((p) => p.id === propId);
    if (prop) {
      setEditMonthPrice(prop.priceMonth);
      setEditSemPrice(prop.priceSemester);
      setEditDeposit(prop.depositAmount);
    }
  };

  // KPIs
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const bookedRooms = rooms.filter((r) => r.status === 'booked').length;
  const heldRooms = rooms.filter((r) => r.status === 'held').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;
  const occupancyRate =
    totalRooms > 0 ? Math.round(((bookedRooms + heldRooms) / totalRooms) * 100) : 0;
  const totalDeposits = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.depositPaid, 0);

  // Group rooms by floor for the selected property
  const propertyRooms = useMemo(
    () => rooms.filter((r) => r.propertyId === selectedPropertyId),
    [rooms, selectedPropertyId]
  );

  const roomsByFloor = useMemo(() => {
    const map = new Map<number, RoomItem[]>();
    propertyRooms.forEach((r) => {
      const list = map.get(r.floor) || [];
      list.push(r);
      map.set(r.floor, list);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [propertyRooms]);

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!staffEmail.includes('@') || staffPasscode.length < 4) {
      setAuthError('Enter a valid UTM staff email and passcode.');
      return;
    }
    setStaffName(
      staffEmail === 'admin@utm.my' ? 'Dr. Norazlina (HEPA Director)' : staffEmail
    );
    setIsAuthenticated(true);
  };

  const handleRoomStatusChange = (roomId: string, newStatus: RoomItem['status']) => {
    LocalDatabase.updateRoomStatus(roomId, newStatus, 'admin', staffName);
    onRefreshData();
    onShowToast(`Room updated to "${newStatus}"`);
  };

  const handleBulkAddRooms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    const res = LocalDatabase.bulkCreateRooms(
      selectedProperty.id,
      bulkBlock,
      bulkFloor,
      bulkStartIdx,
      bulkCount,
      selectedProperty.roomType
    );
    onRefreshData();
    onShowToast(res.message);
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    LocalDatabase.updatePropertyPricing(
      selectedProperty.id,
      Number(editMonthPrice),
      Number(editSemPrice),
      Number(editDeposit),
      staffName
    );
    onRefreshData();
    onShowToast(`Updated pricing for ${selectedProperty.shortCode}`);
  };

  const handleBookingAction = (
    bookingId: string,
    status: BookingRecord['status']
  ) => {
    LocalDatabase.updateBookingStatus(bookingId, status, staffName);
    onRefreshData();
    onShowToast(
      status === 'cancelled'
        ? 'Booking cancelled and linked room released back to Available'
        : `Booking marked as ${status}`
    );
  };

  const handleOfferWaitlist = (waitlistId: string) => {
    LocalDatabase.promoteWaitlistEntry(waitlistId, staffName);
    onRefreshData();
    onShowToast('Waitlist offer dispatched to student');
  };

  // Top Portal Verification Bar
  const PortalSwitcherBar = () => (
    <div className="bg-slate-950 text-slate-300 border-b border-slate-800 px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-white tracking-tight">Site Verification Switcher</span>
        <span className="text-slate-500 hidden sm:inline">• Route: /admin</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onSwitchPortal('student')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student Site (/)</span>
        </button>
        <button
          type="button"
          className="px-2.5 py-1 rounded-lg bg-[#800000] text-white font-bold inline-flex items-center gap-1.5"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Housing Admin (/admin)</span>
        </button>
        <button
          type="button"
          onClick={() => onSwitchPortal('sysadmin')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>System Admin (/sysadmin)</span>
        </button>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <PortalSwitcherBar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#800000] flex items-center justify-center font-black text-xs">
                  HEPA
                </div>
                <div>
                  <h1 className="text-base font-extrabold tracking-tight">
                    UTM Housing Management Portal
                  </h1>
                  <p className="text-xs text-slate-400">
                    College Officers &amp; Residential Administration
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleStaffLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  UTM Staff Email
                </label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Staff Access Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={staffPasscode}
                    onChange={(e) => setStaffPasscode(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]"
                    required
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Sign In as HEPA Housing Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Occupancy Overview', icon: LayoutDashboard },
    { id: 'rooms', label: 'Room & Floor Grid', icon: Grid3X3, badge: totalRooms },
    { id: 'bookings', label: 'Student Bookings', icon: ClipboardList, badge: bookings.length },
    { id: 'waitlist', label: 'Waitlist Queue', icon: Clock, badge: waitlist.length },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <PortalSwitcherBar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Management Left Sidebar */}
        <aside className="w-full lg:w-72 bg-slate-900 text-slate-200 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#800000] text-white font-black text-xs flex items-center justify-center">
                HEPA
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-white leading-tight">
                  Housing Admin
                </h1>
                <p className="text-[11px] text-slate-400">UTM Management Side</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-slate-800">
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{staffName}</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">{staffEmail}</p>
            </div>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1.5 overflow-x-auto lg:flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#800000] text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono tabular-nums ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:block p-4 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock Admin Session</span>
            </button>
          </div>
        </aside>

        {/* Main Management Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#800000]">
                UTM Residential Management
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {activeTab === 'overview' && 'Campus Occupancy & Revenue Overview'}
                {activeTab === 'rooms' && 'Floor-by-Floor Room Inventory & Pricing'}
                {activeTab === 'bookings' && 'Student Reservations & Deposits'}
                {activeTab === 'waitlist' && 'Residential College Waitlist Queue'}
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Synced live with Student Marketplace (`/`)
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500">Total Physical Rooms</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                    {totalRooms}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1 tabular-nums">
                    {availableRooms} available now
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500">Occupancy Rate</div>
                  <div className="text-2xl font-extrabold text-[#800000] mt-1 tabular-nums">
                    {occupancyRate}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
                    {bookedRooms} booked · {heldRooms} held · {maintenanceRooms} maint.
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500">Confirmed Bookings</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                    {bookings.filter((b) => b.status === 'confirmed').length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
                    {waitlist.length} students in waitlist
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500">Deposits Collected</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                    RM {totalDeposits.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    FPX &amp; Card verified
                  </div>
                </div>
              </div>

              {/* Property Capacity Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    College &amp; Partner Residence Occupancy Breakdown
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('rooms')}
                    className="text-xs font-bold text-[#800000] hover:underline cursor-pointer"
                  >
                    Manage Rooms →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="px-5 py-3">Residence</th>
                        <th className="px-5 py-3">Campus</th>
                        <th className="px-5 py-3 text-right">Monthly Rate</th>
                        <th className="px-5 py-3 text-right">Available</th>
                        <th className="px-5 py-3 text-right">Booked / Held</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {properties.map((prop) => {
                        const propRooms = rooms.filter((r) => r.propertyId === prop.id);
                        const avail = propRooms.filter((r) => r.status === 'available').length;
                        const occ = propRooms.filter(
                          (r) => r.status === 'booked' || r.status === 'held'
                        ).length;
                        return (
                          <tr key={prop.id} className="hover:bg-slate-50/70">
                            <td className="px-5 py-3.5 font-bold text-slate-900">
                              {prop.name}
                              <span className="ml-2 text-[10px] font-mono text-slate-400">
                                {prop.shortCode}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-600">{prop.campusName}</td>
                            <td className="px-5 py-3.5 text-right font-bold text-slate-900 tabular-nums">
                              RM {prop.priceMonth}
                            </td>
                            <td className="px-5 py-3.5 text-right font-bold text-emerald-700 tabular-nums">
                              {avail}
                            </td>
                            <td className="px-5 py-3.5 text-right text-slate-600 tabular-nums">
                              {occ} / {propRooms.length}
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  avail > 0
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-800'
                                }`}
                              >
                                {avail > 0 ? 'Available' : 'Waitlist Open'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectProperty(prop.id);
                                  setActiveTab('rooms');
                                }}
                                className="text-xs font-bold text-[#800000] hover:underline cursor-pointer"
                              >
                                Edit Floor Grid
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROOM & FLOOR GRID */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              {/* Property Selector */}
              <div className="flex flex-wrap gap-2">
                {properties.map((prop) => {
                  const isSelected = prop.id === selectedPropertyId;
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => handleSelectProperty(prop.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#800000] text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {prop.shortCode} · {prop.name}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Floor-by-Floor Interactive Grid */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {selectedProperty?.name} — Floor Room Matrix
                      </h3>
                      <p className="text-xs text-slate-500">
                        Select any room status dropdown to toggle live student availability
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-semibold">
                      <span className="text-emerald-700">Available</span>
                      <span className="text-slate-600">Booked</span>
                      <span className="text-amber-700">Held</span>
                      <span className="text-rose-700">Maintenance</span>
                    </div>
                  </div>

                  {roomsByFloor.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                      No physical room records assigned yet. Use the Bulk Add Rooms form to generate rooms for this residence.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {roomsByFloor.map(([floorNum, floorRooms]) => (
                        <div key={floorNum} className="space-y-2.5">
                          <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                            Floor {floorNum} ({floorRooms.length} rooms)
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {floorRooms.map((room) => (
                              <div
                                key={room.id}
                                className={`p-3 rounded-xl border text-xs space-y-2 ${
                                  room.status === 'available'
                                    ? 'bg-emerald-50/50 border-emerald-200'
                                    : room.status === 'held'
                                    ? 'bg-amber-50/50 border-amber-200'
                                    : room.status === 'maintenance'
                                    ? 'bg-rose-50/50 border-rose-200'
                                    : 'bg-slate-50 border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                    <BedDouble className="w-3.5 h-3.5 text-slate-500" />
                                    Room {room.roomNo}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                                    RM {room.priceMonth}/mo
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600 truncate">
                                  {room.block} · {room.roomType}
                                </div>
                                <select
                                  value={room.status}
                                  onChange={(e) =>
                                    handleRoomStatusChange(
                                      room.id,
                                      e.target.value as RoomItem['status']
                                    )
                                  }
                                  aria-label={`Status for Room ${room.roomNo}`}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800000]/20 cursor-pointer"
                                >
                                  <option value="available">Available</option>
                                  <option value="booked">Booked</option>
                                  <option value="held">15m Hold</option>
                                  <option value="maintenance">Maintenance</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Side Forms: Bulk Create & Pricing */}
                <div className="space-y-6">
                  {/* Bulk Add Rooms */}
                  <form
                    onSubmit={handleBulkAddRooms}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Plus className="w-4 h-4 text-[#800000]" />
                      <span>Bulk Create Rooms</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <label className="block font-semibold text-slate-600 mb-1">
                          Block / Wing
                        </label>
                        <input
                          type="text"
                          value={bulkBlock}
                          onChange={(e) => setBulkBlock(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">
                          Floor
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={bulkFloor}
                          onChange={(e) => setBulkFloor(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 tabular-nums"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">
                          Start Index
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={bulkStartIdx}
                          onChange={(e) => setBulkStartIdx(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 tabular-nums"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block font-semibold text-slate-600 mb-1">
                          Number of Rooms to Add
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={bulkCount}
                          onChange={(e) => setBulkCount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 tabular-nums"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Generate Rooms on Floor {bulkFloor}
                    </button>
                  </form>

                  {/* Adjust Pricing */}
                  <form
                    onSubmit={handleSavePricing}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <DollarSign className="w-4 h-4 text-[#800000]" />
                      <span>Adjust {selectedProperty?.shortCode} Rates</span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">
                          Monthly Rent (RM)
                        </label>
                        <input
                          type="number"
                          min={100}
                          value={editMonthPrice}
                          onChange={(e) => setEditMonthPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 tabular-nums"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">
                          Semester Rate (RM)
                        </label>
                        <input
                          type="number"
                          min={500}
                          value={editSemPrice}
                          onChange={(e) => setEditSemPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 tabular-nums"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">
                          Security Deposit (RM)
                        </label>
                        <input
                          type="number"
                          min={50}
                          value={editDeposit}
                          onChange={(e) => setEditDeposit(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 tabular-nums"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Save Property Pricing
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKINGS MANAGER */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  All Student Accommodation Bookings ({bookings.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Cancelling a booking releases its room immediately
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Booking Code</th>
                      <th className="px-5 py-3">Student &amp; Matric</th>
                      <th className="px-5 py-3">Residence &amp; Room</th>
                      <th className="px-5 py-3 text-right">Deposit Paid</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Management Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                          {b.bookingCode}
                          <div className="text-[10px] font-normal text-slate-400">
                            {b.createdAt}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900">{b.studentName}</div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {b.studentMatric} · {b.studentPhone}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{b.propertyName}</div>
                          <div className="text-[11px] text-slate-500">
                            {b.roomNo ? `Room ${b.roomNo} (Floor ${b.floor})` : b.roomType}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-slate-900 tabular-nums">
                          RM {b.depositPaid}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : b.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {b.status !== 'confirmed' && (
                              <button
                                type="button"
                                onClick={() => handleBookingAction(b.id, 'confirmed')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Confirm</span>
                              </button>
                            )}
                            {b.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleBookingAction(b.id, 'cancelled')}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancel &amp; Release</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WAITLIST MANAGER */}
          {activeTab === 'waitlist' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#800000]" />
                  <span>Waitlist Queue ({waitlist.length})</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Promote queued students when rooms open up
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Queue #</th>
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Requested College</th>
                      <th className="px-5 py-3">Joined At</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {waitlist.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 font-mono font-extrabold text-[#800000] tabular-nums">
                          #{w.position}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900">{w.studentName}</div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {w.studentMatric} · {w.studentPhone}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800">
                          {w.propertyName}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                          {w.joinedAt}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              w.status === 'offered'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {w.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {w.status === 'queued' ? (
                            <button
                              type="button"
                              onClick={() => handleOfferWaitlist(w.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#800000] hover:bg-[#660000] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Room Offer</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-emerald-700">
                              Offer Dispatched
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
