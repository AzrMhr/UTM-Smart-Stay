import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Phone,
  ShieldCheck,
  PlusCircle,
  X,
} from 'lucide-react';
import {
  BookingRecord,
  WaitlistRecord,
  RoommateListing,
  CarpoolListing,
  StudentUser,
} from '../types';

interface CommunityViewProps {
  student: StudentUser;
  bookings: BookingRecord[];
  waitlist: WaitlistRecord[];
  roommates: RoommateListing[];
  carpools: CarpoolListing[];
  onAddRoommatePost: (listing: RoommateListing) => void;
  onBookCarpoolSeat: (carpoolId: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  student,
  bookings,
  waitlist,
  roommates,
  carpools,
  onAddRoommatePost,
  onBookCarpoolSeat,
}) => {
  const [subTab, setSubTab] = useState<'status' | 'roommates' | 'carpool'>('status');
  const [isPostingRoommate, setIsPostingRoommate] = useState(false);
  const [targetResidence, setTargetResidence] = useState('Kolej Siswa Jaya (KSJ)');
  const [budget, setBudget] = useState('RM 300 - RM 400/mo');
  const [desc, setDesc] = useState('');
  const [carpoolSuccess, setCarpoolSuccess] = useState<string | null>(null);

  const handlePostRoommate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    const newPost: RoommateListing = {
      id: `rm-${Date.now()}`,
      studentName: student.fullName,
      matricNo: student.matricNo,
      faculty: student.faculty,
      targetResidence,
      lifestyle: ['Non-Smoker', 'Focused Study', 'UTM Verified'],
      budgetRange: budget,
      description: desc,
      postedDate: 'Just now',
      contactPhone: student.phone,
    };

    onAddRoommatePost(newPost);
    setIsPostingRoommate(false);
    setDesc('');
  };

  const handleBookSeat = (cp: CarpoolListing) => {
    onBookCarpoolSeat(cp.id);
    setCarpoolSuccess(`Seat reserved with ${cp.driverName}! Departure: ${cp.departureTime}.`);
    setTimeout(() => setCarpoolSuccess(null), 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-5">
      {/* Sub-tab Navigation */}
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 max-w-lg">
        <button
          type="button"
          onClick={() => setSubTab('status')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'status' ? 'bg-white text-[#800000] shadow-xs' : 'text-slate-600'
          }`}
        >
          My Bookings ({bookings.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('roommates')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'roommates' ? 'bg-white text-[#800000] shadow-xs' : 'text-slate-600'
          }`}
        >
          Roommates ({roommates.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('carpool')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'carpool' ? 'bg-white text-[#800000] shadow-xs' : 'text-slate-600'
          }`}
        >
          Carpool ({carpools.length})
        </button>
      </div>

      {/* SUBTAB 1: My Bookings & Waitlist Status */}
      {subTab === 'status' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Confirmed Bookings */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm lg:text-base font-bold text-slate-800">
                Active Housing Applications
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {student.fullName} ({student.matricNo})
              </span>
            </div>

            {bookings.length > 0 ? (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 lg:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{b.status.toUpperCase()}</span>
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{b.propertyName}</h4>
                      <p className="text-xs text-slate-500">
                        {b.roomNo ? `Room ${b.roomNo} (Floor ${b.floor}) • ` : ''}
                        {b.roomType} • {b.campusName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-[#800000] block">
                        {b.bookingCode}
                      </span>
                      <span className="text-[10px] text-slate-400">{b.bookingPeriod}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Payment Gateway:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                        {b.paymentMethod.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Deposit Amount:</span>
                      <span className="font-bold text-emerald-700 tabular-nums">
                        RM {b.depositPaid}.00 (Paid)
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Hold Verification:</span>
                      <span className="text-slate-500">Verified by HEPA</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                No active bookings found. Explore available accommodations to apply.
              </div>
            )}
          </div>

          {/* Waitlist Positions */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm lg:text-base font-bold text-slate-800">
              Waitlist Queue Positions
            </h3>
            {waitlist.length > 0 ? (
              waitlist.map((w) => (
                <div
                  key={w.id}
                  className="p-4 lg:p-5 bg-white rounded-2xl border border-amber-200/80 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>QUEUE POSITION #{w.position}</span>
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{w.propertyName}</h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-700 tabular-nums">
                        ~{w.estimatedWaitDays} Days
                      </span>
                      <div className="text-[10px] text-slate-400">Estimated wait</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    When a room becomes vacant, an automated notification will be sent to{' '}
                    <span className="font-mono text-slate-700 font-semibold">{w.studentPhone}</span>.
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                You are not on any college waitlists currently.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Roommates Feed */}
      {subTab === 'roommates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm lg:text-base font-bold text-slate-800">Find a Roommate</h3>
              <p className="text-xs text-slate-500">Verified UTM students seeking room shares</p>
            </div>

            <button
              type="button"
              onClick={() => setIsPostingRoommate(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-2xs flex items-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: '#800000' }}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Request</span>
            </button>
          </div>

          {isPostingRoommate && (
            <form
              onSubmit={handlePostRoommate}
              className="p-5 bg-white rounded-2xl border border-red-200 shadow-md space-y-3 max-w-lg animate-in fade-in"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Create Roommate Post</span>
                <button
                  type="button"
                  onClick={() => setIsPostingRoommate(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block">Target Residence</label>
                <select
                  value={targetResidence}
                  onChange={(e) => setTargetResidence(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                >
                  <option>Kolej Siswa Jaya (KSJ)</option>
                  <option>Kolej Tun Dr. Ismail (KTDI)</option>
                  <option>Residensi UTM KL</option>
                  <option>Kolej Rahman Putra (KRP)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block">Target Budget Range</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block">
                  Description &amp; Study Habits
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. 2nd year MJIIT student looking for a quiet study partner..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white cursor-pointer"
                style={{ backgroundColor: '#800000' }}
              >
                Publish to Board
              </button>
            </form>
          )}

          {/* Roommate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roommates.map((rm) => (
              <div
                key={rm.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-[#800000] font-bold text-xs flex items-center justify-center ring-1 ring-red-100">
                        {rm.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900">{rm.studentName}</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <p className="text-[10px] text-slate-400">{rm.faculty}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400">{rm.postedDate}</span>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl">
                    <div className="font-semibold text-[11px] text-[#800000] mb-0.5">
                      Looking for: {rm.targetResidence} ({rm.budgetRange})
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">{rm.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {rm.lifestyle.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`https://wa.me/${rm.contactPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Carpool Listings */}
      {subTab === 'carpool' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm lg:text-base font-bold text-slate-800">
                Campus Carpool &amp; Rides
              </h3>
              <p className="text-xs text-slate-500">Shared transport between KSJ &amp; UTM KL</p>
            </div>
            <span className="text-[10px] bg-red-50 text-[#800000] font-bold px-2.5 py-1 rounded-lg">
              Low Carbon Campus
            </span>
          </div>

          {carpoolSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{carpoolSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carpools.map((cp) => (
              <div
                key={cp.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {cp.days}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{cp.route}</h4>
                    <p className="text-[11px] text-[#800000] font-semibold flex items-center gap-1 pt-0.5">
                      <Clock className="w-3 h-3" />
                      {cp.departureTime}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-800 block tabular-nums">
                      {cp.farePerTrip}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold inline-block mt-1">
                      {cp.seatsAvailable} seats open
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <div className="text-slate-500 text-[11px] truncate max-w-[180px]">
                    <span className="font-semibold text-slate-700">{cp.driverName}</span> •{' '}
                    <span>{cp.vehicle}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookSeat(cp)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-2xs hover:opacity-95 active:scale-95 transition-all shrink-0 cursor-pointer"
                    style={{ backgroundColor: '#800000' }}
                  >
                    Reserve Seat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
