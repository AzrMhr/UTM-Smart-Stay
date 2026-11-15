import React, { useState } from 'react';
import { X, Phone, Hash, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { StudentUser } from '../types';
import { CURRENT_STUDENT } from '../data/database';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (student: StudentUser) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [fullName, setFullName] = useState(CURRENT_STUDENT.fullName);
  const [phone, setPhone] = useState(CURRENT_STUDENT.phone);
  const [matricNo, setMatricNo] = useState(CURRENT_STUDENT.matricNo);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanedPhone = phone.trim();
    const cleanedMatric = matricNo.trim().toUpperCase();

    if (!cleanedPhone.startsWith('+60') || cleanedPhone.length < 10) {
      setError('Enter a valid Malaysian mobile number in E.164 format (e.g. +60123456789).');
      return;
    }
    if (!/^[A-Z0-9]{7,12}$/.test(cleanedMatric)) {
      setError('Enter a valid UTM matriculation number (e.g. A24MJ3028).');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.trim() !== '123456') {
      setError('Invalid verification code. Use demo OTP 123456.');
      return;
    }

    const isSeedStudent = matricNo.trim().toUpperCase() === CURRENT_STUDENT.matricNo;
    const authenticatedUser: StudentUser = isSeedStudent
      ? CURRENT_STUDENT
      : {
          id: `usr-${matricNo.trim().toLowerCase()}`,
          fullName: fullName.trim() || 'UTM Student',
          phone: phone.trim(),
          matricNo: matricNo.trim().toUpperCase(),
          email: `${matricNo.trim().toLowerCase()}@graduate.utm.my`,
          faculty: 'Universiti Teknologi Malaysia',
          campus: 'Johor Bahru',
          gender: 'Unspecified',
          avatarUrl: CURRENT_STUDENT.avatarUrl,
        };

    onAuthenticated(authenticatedUser);
    setStep('credentials');
    setOtp('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div
          className="px-6 py-5 text-white flex items-center justify-between"
          style={{ backgroundColor: '#800000' }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 block">
              Student Identity Gate
            </span>
            <h2 className="text-lg font-extrabold tracking-tight">
              Sign In to UTM Smart Stay
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in dialog"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {step === 'credentials' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Azraf Mahir"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number (E.164 Unique Key)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+60123456789"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  UTM Matriculation Number
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={matricNo}
                    onChange={(e) => setMatricNo(e.target.value.toUpperCase())}
                    placeholder="A24MJ3028"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#800000' }}
              >
                <span>Request 6-Digit SMS OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onAuthenticated(CURRENT_STUDENT);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#800000]" />
                <span>Quick Sign-In: {CURRENT_STUDENT.fullName} ({CURRENT_STUDENT.matricNo})</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <p className="font-bold">Simulated SMS OTP dispatched to {phone}</p>
                  <p className="mt-0.5 text-emerald-700">
                    Enter demo code <span className="font-mono font-bold">123456</span> to verify matric{' '}
                    <span className="font-mono font-bold">{matricNo}</span>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center text-xl tracking-[0.4em] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Auto-fill 123456
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: '#800000' }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify &amp; Enter</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setError(null);
                }}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Edit phone or matric number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
