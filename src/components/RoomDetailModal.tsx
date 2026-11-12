import React, { useState } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  MapPin,
  Clock,
  CreditCard,
  Building2,
  Bed,
  Users,
  Sparkles,
  Info,
  DoorOpen,
} from 'lucide-react';
import { RoomProperty, RoomItem, StudentUser, BookingRecord, WaitlistRecord } from '../types';

interface RoomDetailModalProps {
  property: RoomProperty | null;
  room?: RoomItem | null;
  student: StudentUser;
  onClose: () => void;
  onBookRoom: (
    property: RoomProperty,
    paymentMethod: BookingRecord['paymentMethod'],
    room?: RoomItem
  ) => void;
  onJoinWaitlist: (property: RoomProperty) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  property,
  room,
  student,
  onClose,
  onBookRoom,
  onJoinWaitlist,
}) => {
  const [selectedTerm, setSelectedTerm] = useState('Semester 1 2026/2027');
  const [paymentMethod, setPaymentMethod] = useState<BookingRecord['paymentMethod']>(
    'FPX Online Banking (Maybank2u / CIMB / Bank Islam)'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [confirmedWaitlist, setConfirmedWaitlist] = useState<WaitlistRecord | null>(null);

  if (!property) return null;

  const isRoomBooking = !!room;
  const isAvailable = isRoomBooking ? room.status === 'available' : property.availableUnits > 0;
  const priceMonth = room ? room.priceMonth : property.priceMonth;
  const priceSemester = room ? room.priceSemester : property.priceSemester;
  const depositAmount = room ? room.depositAmount : property.depositAmount;

  const handleAction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (isAvailable) {
        onBookRoom(property, paymentMethod, room || undefined);
        const code = `UTM-BK-${Math.floor(10000 + Math.random() * 90000)}`;
        setConfirmedBooking({
          id: `bk-${Date.now()}`,
          bookingCode: code,
          propertyId: property.id,
          propertyName: property.name,
          roomId: room?.id,
          roomNo: room?.roomNo,
          floor: room?.floor,
          block: room?.block,
          roomType: room ? room.roomType : property.roomType,
          campusName: property.campusName,
          studentName: student.fullName,
          studentPhone: student.phone,
          studentMatric: student.matricNo,
          bookingPeriod: selectedTerm,
          amountMonth: priceMonth,
          amountPaid: depositAmount,
          depositPaid: depositAmount,
          paymentMethod,
          status: 'confirmed',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          expiresAt: 'In 15 minutes',
        });
      } else {
        onJoinWaitlist(property);
        setConfirmedWaitlist({
          id: `wl-${Date.now()}`,
          propertyId: property.id,
          propertyName: property.name,
          studentName: student.fullName,
          studentMatric: student.matricNo,
          studentPhone: student.phone,
          position: (property.waitlistCount || 3) + 1,
          estimatedWaitDays: 4,
          joinedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'queued',
        });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col z-10 overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Sticky Header with Title & Close button */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-3.5 flex items-center justify-between z-20">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#800000]">
              {property.campusName}
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {room ? `Room ${room.roomNo} (${property.name})` : property.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm text-slate-700">
          {/* Confirmed Booking State */}
          {confirmedBooking ? (
            <div className="p-6 text-center space-y-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {room ? `Room ${room.roomNo} Reserved!` : 'Room Application Reserved!'}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  15-minute booking hold confirmed in UTM Central Database.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 text-left text-xs space-y-2 shadow-2xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reservation Code:</span>
                  <span className="font-bold text-[#800000]">{confirmedBooking.bookingCode}</span>
                </div>
                {confirmedBooking.roomNo && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reserved Room:</span>
                    <span className="font-bold text-slate-800">
                      Room {confirmedBooking.roomNo} (Floor {confirmedBooking.floor})
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Matric:</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.studentMatric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">College:</span>
                  <span className="font-semibold text-slate-800">{property.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deposit Paid:</span>
                  <span className="font-bold text-emerald-700">RM {depositAmount} (FPX Sandbox)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-sm"
                style={{ backgroundColor: '#800000' }}
              >
                Done (View in My Bookings)
              </button>
            </div>
          ) : confirmedWaitlist ? (
            <div className="p-6 text-center space-y-4 bg-amber-50/60 rounded-2xl border border-amber-200">
              <div className="w-14 h-14 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Waitlist Queue Confirmed!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  You are registered in the priority FIFO queue for {property.name}.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-100 text-left text-xs space-y-2 shadow-2xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Your Queue Position:</span>
                  <span className="font-bold text-amber-800 text-sm">#{confirmedWaitlist.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Allocation:</span>
                  <span className="font-semibold text-slate-800">~{confirmedWaitlist.estimatedWaitDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Notification via:</span>
                  <span className="font-semibold text-slate-800">SMS / WhatsApp ({student.phone})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-xs text-white shadow-sm"
                style={{ backgroundColor: '#800000' }}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Room Specifications Quick Strip (Reference: Innap Guest Detail system) */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                <div className="p-2 bg-white rounded-xl shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-medium">Room Type</div>
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <Bed className="w-3.5 h-3.5 text-[#800000]" />
                    <span className="truncate">{room ? room.roomType : property.bedType}</span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-xl shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-medium">Capacity</div>
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-[#800000]" />
                    <span>{room ? `${room.capacity} Student` : property.capacity}</span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-xl shadow-2xs">
                  <div className="text-[10px] text-slate-400 font-medium">Location</div>
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#800000]" />
                    <span className="truncate">
                      {room ? `Fl. ${room.floor} (${room.roomNo})` : property.floor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown & Hold Banner */}
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-600">
                    {room ? `Rate for Room ${room.roomNo}` : 'Monthly Rate'}
                  </div>
                  <div className="text-xl font-black text-[#800000]">
                    RM {priceMonth}
                    <span className="text-xs font-normal text-slate-500"> / month</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Semester total: RM {priceSemester} (Deposit: RM {depositAmount})
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {isRoomBooking
                      ? isAvailable
                        ? 'Room Free'
                        : 'Room Held / Booked'
                      : isAvailable
                      ? `${property.availableUnits} Units Left`
                      : 'Waitlist Open'}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>15-min auto hold</span>
                  </div>
                </div>
              </div>

              {/* Room-specific Features or Residence Facilities */}
              {room ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Features for Room {room.roomNo}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {room.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {room.notes && (
                    <p className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      {room.notes}
                    </p>
                  )}

                  {/* 2BR Unit Context */}
                  {room.unitContext && (
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs space-y-1.5">
                      <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        <span>Unit Sharing Context ({room.unitContext.unitNo})</span>
                      </div>
                      {room.unitContext.otherRooms.map((other, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-blue-800">
                          <span>{other.label} (Room {other.roomNo})</span>
                          <span className="font-semibold capitalize">
                            {other.status === 'booked' ? 'Occupied' : other.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Room &amp; Hostel Facilities
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {property.facilities.map((fac, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  About this Residence
                </h4>
                <p>{property.description}</p>
                <div className="flex items-center gap-1.5 pt-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{property.address}</span>
                </div>
              </div>

              {/* Verified Applicant Profile (Pre-filled dummy student data per user prompt) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Applicant Information (Pre-filled)
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                    UTM Student
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block">Student Name</label>
                    <input
                      type="text"
                      readOnly
                      value={student.fullName}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Matric Number</label>
                    <input
                      type="text"
                      readOnly
                      value={student.matricNo}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block">Contact Phone Number</label>
                  <input
                    type="text"
                    readOnly
                    value={student.phone}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Payment Method Selector (For immediate booking) */}
              {isAvailable && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Payment Gateway (Sandbox Mode)
                  </h4>
                  <div className="space-y-1.5">
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentMethod.startsWith('FPX')
                          ? 'border-[#800000] bg-red-50/40'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod.startsWith('FPX')}
                        onChange={() =>
                          setPaymentMethod('FPX Online Banking (Maybank2u / CIMB / Bank Islam)')
                        }
                        className="accent-[#800000]"
                      />
                      <CreditCard className="w-4 h-4 text-[#800000]" />
                      <div>
                        <span className="font-bold text-slate-800 block">FPX Online Banking</span>
                        <span className="text-[10px] text-slate-500">Maybank2u, CIMB Clicks, Bank Islam</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        paymentMethod.startsWith('Credit')
                          ? 'border-[#800000] bg-red-50/40'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod.startsWith('Credit')}
                        onChange={() =>
                          setPaymentMethod('Credit / Debit Card (Visa/Mastercard)')
                        }
                        className="accent-[#800000]"
                      />
                      <CreditCard className="w-4 h-4 text-[#800000]" />
                      <div>
                        <span className="font-bold text-slate-800 block">Credit / Debit Card</span>
                        <span className="text-[10px] text-slate-500">Visa / Mastercard instant authorization</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sticky Action Footer */}
        {!confirmedBooking && !confirmedWaitlist && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Total Deposit Due</span>
              <span className="text-base font-extrabold text-[#800000]">
                {isAvailable ? `RM ${depositAmount}` : 'RM 0 (Waitlist)'}
              </span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleAction}
              className="flex-1 py-3 px-5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
              style={{ backgroundColor: isAvailable ? '#800000' : '#b45309' }}
            >
              {isSubmitting ? (
                <span>Locking in Central DB...</span>
              ) : isAvailable ? (
                <>
                  <Sparkles className="w-4 h-4 text-red-200" />
                  <span>
                    {room ? `Confirm Room ${room.roomNo} (Hold 15m)` : 'Book Room (Hold 15m)'}
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-amber-200" />
                  <span>Join Waitlist Queue</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
