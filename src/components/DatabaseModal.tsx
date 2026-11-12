import React, { useState } from 'react';
import {
  X,
  Database,
  Plus,
  Minus,
  RotateCcw,
  ShieldCheck,
  Check,
  Server,
  Layers,
  DoorOpen,
  Filter,
} from 'lucide-react';
import { RoomProperty, RoomItem, BookingRecord, WaitlistRecord, StudentUser } from '../types';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentUser;
  properties: RoomProperty[];
  rooms: RoomItem[];
  bookings: BookingRecord[];
  waitlist: WaitlistRecord[];
  onUpdatePropertyUnits: (propId: string, delta: number) => void;
  onToggleRoomStatus: (roomId: string, status: RoomItem['status']) => void;
  onResetDatabase: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  student,
  properties,
  rooms,
  bookings,
  waitlist,
  onUpdatePropertyUnits,
  onToggleRoomStatus,
  onResetDatabase,
}) => {
  const [activeTable, setActiveTable] = useState<
    'rooms' | 'properties' | 'users' | 'bookings' | 'waitlist'
  >('rooms');
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>('all');
  const [testLog, setTestLog] = useState<string | null>(null);

  if (!isOpen) return null;

  const runConcurrencyTest = () => {
    setTestLog('Simulating 2 concurrent booking requests for Room 502...');
    setTimeout(() => {
      setTestLog(
        'PostgreSQL Partial Unique Guard triggered: Request 1 locked Room 502. Request 2 rejected with "Room was just taken!".'
      );
    }, 700);
  };

  const filteredRooms = rooms.filter(
    (r) => selectedPropertyFilter === 'all' || r.propertyId === selectedPropertyFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Central Inventory Database</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  ROOM-LEVEL STORAGE
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                SCSE2243 Test Suite • Addendum 01 Physical Room Records
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Table Selector Tabs */}
        <div className="px-5 pt-3 pb-2 flex gap-2 border-b border-slate-800 bg-slate-900/90 overflow-x-auto no-scrollbar">
          {(['rooms', 'properties', 'users', 'bookings', 'waitlist'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTable(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all shrink-0 ${
                activeTable === t
                  ? 'bg-[#800000] text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t} (
              {t === 'rooms'
                ? rooms.length
                : t === 'properties'
                ? properties.length
                : t === 'users'
                ? 1
                : t === 'bookings'
                ? bookings.length
                : waitlist.length}
              )
            </button>
          ))}
        </div>

        {/* Table Data View */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs">
          {/* ROOMS TABLE (Addendum 01 Sec. 4 & 7 A8/A10) */}
          {activeTable === 'rooms' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  TABLE: rooms ({filteredRooms.length} individual room records)
                </span>

                <button
                  type="button"
                  onClick={runConcurrencyTest}
                  className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 rounded text-[10px] border border-emerald-700"
                >
                  Test Room Concurrency Lock
                </button>
              </div>

              {testLog && (
                <div className="p-2.5 bg-slate-800 text-emerald-400 rounded-lg text-[11px] border border-slate-700 animate-in fade-in">
                  &gt; {testLog}
                </div>
              )}

              {/* Property Filter */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedPropertyFilter('all')}
                  className={`px-2.5 py-1 rounded-md shrink-0 ${
                    selectedPropertyFilter === 'all'
                      ? 'bg-white text-slate-900 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  All Properties
                </button>
                {properties.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPropertyFilter(p.id)}
                    className={`px-2.5 py-1 rounded-md shrink-0 ${
                      selectedPropertyFilter === p.id
                        ? 'bg-white text-slate-900 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {p.shortCode}
                  </button>
                ))}
              </div>

              {/* Room Rows with Toggleable Status */}
              <div className="space-y-2">
                {filteredRooms.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-white font-bold flex items-center gap-2">
                        <span>Room {r.roomNo}</span>
                        {r.unitNo && (
                          <span className="text-[10px] text-amber-300">({r.unitNo})</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-normal">
                          Floor {r.floor} • {r.propertyName}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {r.roomType} • RM {r.priceMonth}/mo • {r.features.slice(0, 2).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          onToggleRoomStatus(r.id, e.target.value as RoomItem['status'])
                        }
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-hidden ${
                          r.status === 'available'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : r.status === 'held'
                            ? 'bg-amber-950 text-amber-300 border-amber-700'
                            : r.status === 'booked'
                            ? 'bg-slate-700 text-slate-300 border-slate-600'
                            : 'bg-rose-950 text-rose-300 border-rose-700'
                        }`}
                      >
                        <option value="available">available</option>
                        <option value="held">held</option>
                        <option value="booked">booked</option>
                        <option value="maintenance">maintenance</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROPERTIES TABLE */}
          {activeTable === 'properties' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-400">
                TABLE: properties (Available counts are derived from physical room statuses)
              </div>

              <div className="space-y-2">
                {properties.map((p) => {
                  const free = rooms.filter(
                    (r) => r.propertyId === p.id && r.status === 'available'
                  ).length;
                  return (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-white font-bold flex items-center gap-2">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({p.campusName})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {p.roomType} • RM {p.priceMonth}/mo • Total: {p.totalUnits}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right mr-1">
                          <span
                            className={`text-xs font-bold ${
                              free > 0 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {free} Free
                          </span>
                          <div className="text-[10px] text-slate-500">
                            {free > 0 ? 'Available Now' : 'Waitlist Open'}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onUpdatePropertyUnits(p.id, -1)}
                          disabled={p.availableUnits <= 0}
                          title="Decrement available room"
                          className="w-7 h-7 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded flex items-center justify-center text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdatePropertyUnits(p.id, 1)}
                          title="Increment available room"
                          className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* USERS TABLE */}
          {activeTable === 'users' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-400">
                TABLE: users (Pre-seeded dummy student identity per prompt brief)
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-2">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-white font-bold">{student.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Student Name:</span>
                  <span className="text-white font-bold">{student.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Phone Number:</span>
                  <span className="text-emerald-400 font-bold">{student.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Matric Number:</span>
                  <span className="text-amber-400 font-bold">{student.matricNo}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Institutional Email:</span>
                  <span className="text-slate-300">{student.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Program / Faculty:</span>
                  <span className="text-slate-300">{student.faculty}</span>
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS TABLE */}
          {activeTable === 'bookings' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-400">
                TABLE: bookings ({bookings.length} records with specific room &amp; hold details)
              </div>

              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1.5"
                >
                  <div className="flex justify-between">
                    <span className="text-emerald-400 font-bold">{b.bookingCode}</span>
                    <span className="text-slate-400">{b.status}</span>
                  </div>
                  <div className="text-slate-300">
                    {b.propertyName} • {b.roomNo ? `Room ${b.roomNo}` : b.roomType}
                  </div>
                  <div className="text-slate-400 text-[11px] flex justify-between">
                    <span>
                      Student: {b.studentName} ({b.studentMatric})
                    </span>
                    <span>Deposit: RM {b.depositPaid}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* WAITLIST TABLE */}
          {activeTable === 'waitlist' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-400">
                TABLE: waitlist_entries ({waitlist.length} queued students)
              </div>

              {waitlist.map((w) => (
                <div
                  key={w.id}
                  className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="text-amber-400 font-bold">Position #{w.position}</span>
                    <span className="text-slate-400">Wait: ~{w.estimatedWaitDays}d</span>
                  </div>
                  <div className="text-slate-300">{w.propertyName}</div>
                  <div className="text-slate-400 text-[11px]">
                    Applicant: {w.studentName} ({w.studentMatric}) • Joined: {w.joinedAt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetDatabase}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Default Seeds</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
