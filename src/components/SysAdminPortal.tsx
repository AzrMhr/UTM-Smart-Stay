import React, { useState } from 'react';
import {
  Terminal,
  Database,
  ShieldAlert,
  Play,
  RotateCcw,
  Download,
  FileJson,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Building2,
  Activity,
  KeyRound,
} from 'lucide-react';
import {
  RoomProperty,
  RoomItem,
  BookingRecord,
  WaitlistRecord,
  AuditLogEntry,
  PortalRole,
} from '../types';
import { CURRENT_STUDENT, LocalDatabase } from '../data/database';

interface SysAdminPortalProps {
  properties: RoomProperty[];
  rooms: RoomItem[];
  bookings: BookingRecord[];
  waitlist: WaitlistRecord[];
  auditLogs: AuditLogEntry[];
  onRefreshData: () => void;
  onResetDatabase: () => void;
  onSwitchPortal: (role: PortalRole) => void;
  onShowToast: (msg: string) => void;
}

type SysAdminTab = 'tables' | 'concurrency' | 'audit' | 'maintenance';
type TableName = 'rooms' | 'properties' | 'users' | 'bookings' | 'waitlist';

export const SysAdminPortal: React.FC<SysAdminPortalProps> = ({
  properties,
  rooms,
  bookings,
  waitlist,
  auditLogs,
  onRefreshData,
  onResetDatabase,
  onSwitchPortal,
  onShowToast,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [sysEmail, setSysEmail] = useState('sysadmin@utm-smartstay.internal');
  const [sysKey, setSysKey] = useState('SYS-ROOT-2026');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<SysAdminTab>('tables');
  const [selectedTable, setSelectedTable] = useState<TableName>('rooms');
  const [roomFilterProp, setRoomFilterProp] = useState<string>('all');

  // Concurrency test state
  const [testLog, setTestLog] = useState<
    { step: string; status: 'ok' | 'blocked'; message: string }[]
  >([]);

  const handleSysLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!sysEmail.includes('@') || sysKey.trim().length < 6) {
      setAuthError('Invalid System Administrator key.');
      return;
    }
    setIsAuthenticated(true);
  };

  const handleRawRoomStatusToggle = (roomId: string, status: RoomItem['status']) => {
    LocalDatabase.updateRoomStatus(roomId, status, 'sysadmin', 'System Administrator');
    onRefreshData();
    onShowToast(`SysAdmin updated room ${roomId} -> ${status}`);
  };

  const handleRunConcurrencyTest = () => {
    const firstAvailable = rooms.find((r) => r.status === 'available');
    if (!firstAvailable) {
      setTestLog([
        {
          step: 'PRE-CHECK',
          status: 'blocked',
          message:
            'No available rooms left to lock. Reset database or set a room to available first.',
        },
      ]);
      return;
    }

    const req1 = LocalDatabase.bookSpecificRoom(
      firstAvailable,
      'FPX Online Banking (Maybank2u / CIMB / Bank Islam)'
    );
    const req2 = LocalDatabase.bookSpecificRoom(
      firstAvailable,
      'Credit / Debit Card (Visa/Mastercard)'
    );

    LocalDatabase.addAuditLog({
      actorRole: 'sysadmin',
      actorName: 'System Administrator',
      action: 'CONCURRENCY_LOCK_TEST',
      target: `${firstAvailable.propertyName} • Room ${firstAvailable.roomNo}`,
      details: `Req1=${req1.success ? 'LOCKED' : 'FAIL'}, Req2=${req2.success ? 'FAIL_OPEN' : 'BLOCKED'}`,
    });

    setTestLog([
      {
        step: `REQ-1 (Student A -> Room ${firstAvailable.roomNo})`,
        status: req1.success ? 'ok' : 'blocked',
        message: req1.message,
      },
      {
        step: `REQ-2 (Concurrent Student B -> Room ${firstAvailable.roomNo})`,
        status: req2.success ? 'ok' : 'blocked',
        message: req2.message,
      },
    ]);

    onRefreshData();
    onShowToast('Concurrency double-booking test executed');
  };

  const downloadTextFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = LocalDatabase.exportRoomsCSV();
    downloadTextFile(csv, 'utm_smart_stay_rooms.csv', 'text/csv;charset=utf-8;');
    LocalDatabase.addAuditLog({
      actorRole: 'sysadmin',
      actorName: 'System Administrator',
      action: 'EXPORT_CSV',
      target: 'rooms table',
      details: `Exported ${rooms.length} room records to CSV`,
    });
    onRefreshData();
    onShowToast('Exported rooms inventory CSV');
  };

  const handleExportJSON = () => {
    const json = LocalDatabase.exportDatabaseSnapshot();
    downloadTextFile(json, 'utm_smart_stay_snapshot.json', 'application/json');
    LocalDatabase.addAuditLog({
      actorRole: 'sysadmin',
      actorName: 'System Administrator',
      action: 'EXPORT_SNAPSHOT',
      target: 'Full Database',
      details: 'Downloaded complete JSON database backup',
    });
    onRefreshData();
    onShowToast('Exported full JSON database snapshot');
  };

  const filteredRooms =
    roomFilterProp === 'all'
      ? rooms
      : rooms.filter((r) => r.propertyId === roomFilterProp);

  // Top Portal Verification Bar
  const PortalSwitcherBar = () => (
    <div className="bg-black text-slate-300 border-b border-slate-800 px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-white tracking-tight">Site Verification Switcher</span>
        <span className="text-slate-500 hidden sm:inline">• Route: /sysadmin (Privileged)</span>
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
          onClick={() => onSwitchPortal('admin')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Housing Admin (/admin)</span>
        </button>
        <button
          type="button"
          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold inline-flex items-center gap-1.5"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>System Admin (/sysadmin)</span>
        </button>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <PortalSwitcherBar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-base font-extrabold text-white">
                    System Administrator Console
                  </h1>
                  <p className="text-xs text-slate-400">
                    Database Inspection, Schema Locks &amp; System Recovery
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSysLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  SysAdmin Identifier
                </label>
                <input
                  type="email"
                  value={sysEmail}
                  onChange={(e) => setSysEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Root Access Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={sysKey}
                    onChange={(e) => setSysKey(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Authenticate as System Administrator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <PortalSwitcherBar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* SysAdmin Left Sidebar */}
        <aside className="w-full lg:w-72 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white">System Admin</h1>
              <p className="text-[11px] font-mono text-emerald-400">DB_INSPECTOR_PRIVILEGED</p>
            </div>
          </div>

          <div className="p-4 border-b border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="text-slate-400">ACTIVE OPERATOR</div>
              <div className="text-white font-bold truncate">{sysEmail}</div>
              <div className="text-emerald-400">ROLE: SYSADMIN (READ/WRITE/RESET)</div>
            </div>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1.5 overflow-x-auto lg:flex-1">
            {[
              { id: 'tables' as const, label: 'Database Tables', icon: Database },
              { id: 'concurrency' as const, label: 'Concurrency Lock Test', icon: Play },
              { id: 'audit' as const, label: 'System Audit Logs', icon: Activity },
              { id: 'maintenance' as const, label: 'Backup & DB Reset', icon: ShieldAlert },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:block p-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Lock SysAdmin Console</span>
            </button>
          </div>
        </aside>

        {/* Main Console Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Schema Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'rooms', count: rooms.length },
              { label: 'properties', count: properties.length },
              { label: 'users', count: 1 },
              { label: 'bookings', count: bookings.length },
              { label: 'audit_logs', count: auditLogs.length },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5"
              >
                <div className="text-[11px] font-mono text-slate-400">table.{stat.label}</div>
                <div className="text-xl font-extrabold font-mono text-white mt-0.5 tabular-nums">
                  {stat.count} rows
                </div>
              </div>
            ))}
          </div>

          {/* TAB 1: DATABASE TABLES */}
          {activeTab === 'tables' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {(['rooms', 'properties', 'users', 'bookings', 'waitlist'] as TableName[]).map(
                    (tbl) => (
                      <button
                        key={tbl}
                        type="button"
                        onClick={() => setSelectedTable(tbl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                          selectedTable === tbl
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {tbl}
                      </button>
                    )
                  )}
                </div>

                {selectedTable === 'rooms' && (
                  <select
                    value={roomFilterProp}
                    onChange={(e) => setRoomFilterProp(e.target.value)}
                    aria-label="Filter rooms by property"
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                  >
                    <option value="all">ALL PROPERTIES ({rooms.length})</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.shortCode} — {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* ROOMS TABLE */}
              {selectedTable === 'rooms' && (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="px-4 py-3">room_id</th>
                        <th className="px-4 py-3">property_id</th>
                        <th className="px-4 py-3">floor / room_no</th>
                        <th className="px-4 py-3 text-right">price_month</th>
                        <th className="px-4 py-3">status</th>
                        <th className="px-4 py-3 text-right">override_status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredRooms.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-800/40">
                          <td className="px-4 py-2.5 text-emerald-400">{r.id}</td>
                          <td className="px-4 py-2.5 text-slate-300">{r.propertyId}</td>
                          <td className="px-4 py-2.5 text-white tabular-nums">
                            F{r.floor} · {r.roomNo}
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-200 tabular-nums">
                            RM {r.priceMonth}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                r.status === 'available'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : r.status === 'held'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : r.status === 'maintenance'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-slate-700 text-slate-200'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <select
                              value={r.status}
                              onChange={(e) =>
                                handleRawRoomStatusToggle(
                                  r.id,
                                  e.target.value as RoomItem['status']
                                )
                              }
                              aria-label={`Override room ${r.id} status`}
                              className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-[11px] text-white"
                            >
                              <option value="available">available</option>
                              <option value="booked">booked</option>
                              <option value="held">held</option>
                              <option value="maintenance">maintenance</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PROPERTIES TABLE */}
              {selectedTable === 'properties' && (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="px-4 py-3">id</th>
                        <th className="px-4 py-3">name</th>
                        <th className="px-4 py-3">campus_id</th>
                        <th className="px-4 py-3 text-right">available_units</th>
                        <th className="px-4 py-3 text-right">price_month</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {properties.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="px-4 py-2.5 text-emerald-400">{p.id}</td>
                          <td className="px-4 py-2.5 text-white">{p.name}</td>
                          <td className="px-4 py-2.5 text-slate-300">{p.campusId}</td>
                          <td className="px-4 py-2.5 text-right text-amber-300 tabular-nums">
                            {p.availableUnits} / {p.totalUnits}
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-200 tabular-nums">
                            RM {p.priceMonth}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* USERS TABLE */}
              {selectedTable === 'users' && (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="px-4 py-3">id</th>
                        <th className="px-4 py-3">full_name</th>
                        <th className="px-4 py-3">matric_no (UNIQUE)</th>
                        <th className="px-4 py-3">phone_e164 (UNIQUE)</th>
                        <th className="px-4 py-3">faculty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="px-4 py-3 text-emerald-400">{CURRENT_STUDENT.id}</td>
                        <td className="px-4 py-3 text-white">{CURRENT_STUDENT.fullName}</td>
                        <td className="px-4 py-3 text-amber-300">{CURRENT_STUDENT.matricNo}</td>
                        <td className="px-4 py-3 text-slate-200">{CURRENT_STUDENT.phone}</td>
                        <td className="px-4 py-3 text-slate-300">{CURRENT_STUDENT.faculty}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* BOOKINGS TABLE */}
              {selectedTable === 'bookings' && (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="px-4 py-3">booking_code</th>
                        <th className="px-4 py-3">student_matric</th>
                        <th className="px-4 py-3">property_id</th>
                        <th className="px-4 py-3">room_id</th>
                        <th className="px-4 py-3 text-right">deposit_paid</th>
                        <th className="px-4 py-3">status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/40">
                          <td className="px-4 py-2.5 text-emerald-400">{b.bookingCode}</td>
                          <td className="px-4 py-2.5 text-white">{b.studentMatric}</td>
                          <td className="px-4 py-2.5 text-slate-300">{b.propertyId}</td>
                          <td className="px-4 py-2.5 text-slate-300">{b.roomId || 'legacy'}</td>
                          <td className="px-4 py-2.5 text-right text-slate-200 tabular-nums">
                            RM {b.depositPaid}
                          </td>
                          <td className="px-4 py-2.5 text-amber-300">{b.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* WAITLIST TABLE */}
              {selectedTable === 'waitlist' && (
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="px-4 py-3">id</th>
                        <th className="px-4 py-3">property_id</th>
                        <th className="px-4 py-3">student_matric</th>
                        <th className="px-4 py-3 text-right">position</th>
                        <th className="px-4 py-3">status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {waitlist.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-800/40">
                          <td className="px-4 py-2.5 text-emerald-400">{w.id}</td>
                          <td className="px-4 py-2.5 text-slate-300">{w.propertyId}</td>
                          <td className="px-4 py-2.5 text-white">{w.studentMatric}</td>
                          <td className="px-4 py-2.5 text-right text-amber-300 tabular-nums">
                            #{w.position}
                          </td>
                          <td className="px-4 py-2.5 text-slate-200">{w.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONCURRENCY LOCK TEST */}
          {activeTab === 'concurrency' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Double-Booking Concurrency Guard Verification
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulates two concurrent requests targeting the exact same available room to verify atomic lock enforcement (`UNIQUE(room_id, term)`).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRunConcurrencyTest}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Execute Lock Race Test</span>
                </button>
              </div>

              {testLog.length > 0 && (
                <div className="space-y-3">
                  {testLog.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border font-mono text-xs flex items-start gap-3 ${
                        entry.status === 'ok'
                          ? 'bg-emerald-950/50 border-emerald-700 text-emerald-200'
                          : 'bg-rose-950/50 border-rose-700 text-rose-200'
                      }`}
                    >
                      {entry.status === 'ok' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold">{entry.step}</div>
                        <div className="mt-1 opacity-90">{entry.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  System &amp; Admin Audit Trail ({auditLogs.length})
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Chronological mutations log
                </span>
              </div>
              <div className="divide-y divide-slate-800">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                            log.actorRole === 'sysadmin'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : log.actorRole === 'admin'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          {log.actorRole}
                        </span>
                        <span className="font-mono font-bold text-white">{log.action}</span>
                        <span className="text-slate-400">· {log.target}</span>
                      </div>
                      <p className="text-slate-400">{log.details}</p>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 shrink-0 text-right">
                      <div>{log.actorName}</div>
                      <div>{log.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & RESET */}
          {activeTab === 'maintenance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-extrabold text-white">
                  Export &amp; Snapshot Backups
                </h3>
                <p className="text-xs text-slate-400">
                  Download current rooms inventory or a full database JSON snapshot for archival or external verification.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Export Rooms CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <FileJson className="w-4 h-4 text-amber-400" />
                    <span>Export Full DB JSON</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-rose-900/60 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-extrabold text-rose-300">
                  Reset Database to Seed State
                </h3>
                <p className="text-xs text-slate-400">
                  Clears all student bookings, admin edits, and audit logs from local persistence and restores the initial Azraf Mahir (A24MJ3028) seed state.
                </p>
                <button
                  type="button"
                  onClick={onResetDatabase}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Database Now</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
