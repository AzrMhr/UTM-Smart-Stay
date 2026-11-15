import React, { useState } from 'react';
import {
  Heart,
  MapPin,
  Users,
  Sparkles,
  Bed,
  ShieldCheck,
  MoreHorizontal,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { RoomProperty } from '../types';

interface AccommodationCardProps {
  property: RoomProperty;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onViewDetails: (property: RoomProperty) => void;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  property,
  isWishlisted,
  onToggleWishlist,
  onViewDetails,
}) => {
  const [compactSpotlight, setCompactSpotlight] = useState(false);
  const isAvailable = property.statusBadge === 'Available Now';

  // Compute dynamic metrics for the 3-column footer strip (matches INFLUENCE / ENGAGEMENT / REACH in design guide)
  const occupancyPct =
    property.totalUnits > 0
      ? Math.min(
          99,
          Math.max(
            68,
            Math.round(
              ((property.totalUnits - property.availableUnits) / property.totalUnits) * 100
            )
          )
        )
      : 92;
  const satisfactionPct = Math.round((property.rating / 5) * 100);
  const transitReachPct =
    property.campusId === 'kl' ? 96 : property.campusId === 'jb' ? 94 : 89;

  return (
    <article className="w-full bg-white rounded-3xl border border-slate-200/70 shadow-[0_14px_38px_rgba(15,23,42,0.07)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)] flex flex-col justify-between">
      {/* Top Card Header Bar (Matches reference card top brand + ⋯ button) */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-2xs"
            style={{
              backgroundColor:
                property.campusId === 'jb'
                  ? '#B11217'
                  : property.campusId === 'kl'
                  ? '#1E2430'
                  : '#0F766E',
            }}
          >
            <Building2 className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-extrabold tracking-tight text-slate-800">
            {property.shortCode}
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            • {property.campusId.toUpperCase()}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setCompactSpotlight(!compactSpotlight)}
          title="Toggle Spotlight vs Architectural View"
          aria-label="Toggle card view mode"
          className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Architectural 16:9 Banner OR Minimalist Spotlight Header */}
      {!compactSpotlight && (
        <div
          onClick={() => onViewDetails(property)}
          className="relative mx-4 rounded-2xl aspect-video bg-slate-100 overflow-hidden group cursor-pointer"
        >
          <div className="w-full h-full relative flex items-center justify-center">
            {property.imageTheme === 'ktdi' ? (
              <svg
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                viewBox="0 0 640 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="sky-ktdi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fee2e2" />
                    <stop offset="60%" stopColor="#eff6ff" />
                    <stop offset="100%" stopColor="#f8fafc" />
                  </linearGradient>
                  <linearGradient id="wall-ktdi" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f1f5f9" />
                  </linearGradient>
                  <linearGradient id="roof-ktdi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b91c1c" />
                    <stop offset="100%" stopColor="#7f1d1d" />
                  </linearGradient>
                </defs>
                <rect width="640" height="360" fill="url(#sky-ktdi)" />
                <path
                  d="M0 240 Q 180 200 360 230 T 640 220 L 640 360 L 0 360 Z"
                  fill="#15803d"
                  opacity="0.25"
                />
                <path
                  d="M0 270 Q 220 240 440 265 T 640 255 L 640 360 L 0 360 Z"
                  fill="#16a34a"
                  opacity="0.3"
                />
                <g transform="translate(140, 70)">
                  <rect
                    x="30"
                    y="40"
                    width="300"
                    height="190"
                    rx="4"
                    fill="url(#wall-ktdi)"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                  <polygon points="10,40 180,-10 350,40" fill="url(#roof-ktdi)" />
                  <rect x="15" y="38" width="330" height="7" fill="#800000" />
                  {[0, 1, 2].map((row) => (
                    <g key={row} transform={`translate(0, ${row * 50})`}>
                      {[0, 1, 2, 3].map((col) => (
                        <g key={col} transform={`translate(${col * 65 + 50}, 60)`}>
                          <rect
                            x="0"
                            y="0"
                            width="45"
                            height="35"
                            rx="3"
                            fill="#38bdf8"
                            opacity="0.75"
                            stroke="#94a3b8"
                          />
                          <rect
                            x="2"
                            y="16"
                            width="41"
                            height="17"
                            fill="#ffffff"
                            opacity="0.85"
                          />
                          <line x1="22.5" y1="0" x2="22.5" y2="35" stroke="#94a3b8" />
                          <line
                            x1="-3"
                            y1="-2"
                            x2="48"
                            y2="-2"
                            stroke="#64748b"
                            strokeWidth="2"
                          />
                        </g>
                      ))}
                    </g>
                  ))}
                  <rect x="150" y="200" width="60" height="30" fill="#334155" />
                  <rect x="140" y="196" width="80" height="6" fill="#800000" />
                </g>
                <circle cx="80" cy="270" r="45" fill="#166534" opacity="0.8" />
                <circle cx="105" cy="250" r="35" fill="#15803d" opacity="0.9" />
                <circle cx="560" cy="280" r="50" fill="#166534" opacity="0.85" />
                <circle cx="530" cy="260" r="40" fill="#15803d" opacity="0.9" />
                <rect x="0" y="295" width="640" height="65" fill="#14532d" opacity="0.4" />
                <path d="M 280 360 L 300 295 L 340 295 L 360 360 Z" fill="#e2e8f0" />
              </svg>
            ) : property.imageTheme === 'ksj' ? (
              <svg
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                viewBox="0 0 640 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="sky-ksj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="50%" stopColor="#ffedd5" />
                    <stop offset="100%" stopColor="#f8fafc" />
                  </linearGradient>
                  <linearGradient id="wall-ksj" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f8fafc" />
                  </linearGradient>
                </defs>
                <rect width="640" height="360" fill="url(#sky-ksj)" />
                <rect x="80" y="170" width="30" height="110" fill="#cbd5e1" opacity="0.5" />
                <rect x="120" y="150" width="25" height="130" fill="#cbd5e1" opacity="0.4" />
                <rect x="520" y="160" width="35" height="120" fill="#cbd5e1" opacity="0.5" />
                <g transform="translate(170, 45)">
                  <rect
                    x="30"
                    y="30"
                    width="130"
                    height="235"
                    rx="3"
                    fill="url(#wall-ksj)"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                  <rect
                    x="175"
                    y="15"
                    width="130"
                    height="250"
                    rx="3"
                    fill="url(#wall-ksj)"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                  <rect x="25" y="24" width="140" height="8" fill="#800000" />
                  <rect x="170" y="9" width="140" height="8" fill="#800000" />
                  <rect x="155" y="120" width="25" height="25" fill="#334155" opacity="0.8" />
                  {[0, 1, 2, 3, 4].map((r) => (
                    <g key={r} transform={`translate(0, ${r * 40})`}>
                      <rect
                        x="45"
                        y="45"
                        width="38"
                        height="26"
                        rx="2"
                        fill="#38bdf8"
                        opacity="0.6"
                        stroke="#94a3b8"
                      />
                      <rect
                        x="105"
                        y="45"
                        width="38"
                        height="26"
                        rx="2"
                        fill="#38bdf8"
                        opacity="0.6"
                        stroke="#94a3b8"
                      />
                      <rect
                        x="190"
                        y="32"
                        width="38"
                        height="26"
                        rx="2"
                        fill="#38bdf8"
                        opacity="0.6"
                        stroke="#94a3b8"
                      />
                      <rect
                        x="250"
                        y="32"
                        width="38"
                        height="26"
                        rx="2"
                        fill="#38bdf8"
                        opacity="0.6"
                        stroke="#94a3b8"
                      />
                    </g>
                  ))}
                </g>
                <rect x="0" y="290" width="640" height="70" fill="#475569" opacity="0.3" />
                <g transform="translate(430, 275)">
                  <rect x="0" y="0" width="90" height="36" rx="4" fill="#800000" />
                  <rect x="5" y="5" width="75" height="14" rx="2" fill="#e0f2fe" opacity="0.9" />
                  <circle cx="20" cy="38" r="8" fill="#0f172a" />
                  <circle cx="70" cy="38" r="8" fill="#0f172a" />
                </g>
              </svg>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-50 via-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-500">
                <Bed className="w-11 h-11 stroke-[1.3] text-[#B11217] mb-1" />
                <span className="text-xs font-bold text-slate-700">{property.shortCode}</span>
              </div>
            )}
          </div>

          {/* Overlay Badge in the top-left corner of the image */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tight shadow-sm ${
                isAvailable ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              {property.statusBadge}
            </span>
          </div>

          {/* UTM Verified Chip */}
          <div className="absolute top-2.5 right-2.5 z-10 bg-black/65 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>UTM Verified</span>
          </div>
        </div>
      )}

      {/* Centerpiece Spotlight Metric + Residence Title (Inspired by 4.2m / 2.2m / 1.2m in Design Guide) */}
      <div className="px-5 pt-4 pb-3 text-center space-y-2">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 leading-snug tracking-tight">
            {property.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {property.subtitle || `${property.campusName} • ${property.roomType}`}
          </p>
        </div>

        {/* Hero Numeric Display */}
        <div className="py-2">
          <div className="text-3xl font-light tracking-tight text-slate-900 tabular-nums">
            RM {property.priceMonth}
            <span className="text-xs font-bold text-[#B11217] ml-1">/ month</span>
          </div>
          <button
            type="button"
            onClick={() => onViewDetails(property)}
            className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 hover:text-[#B11217] transition-colors cursor-pointer"
          >
            <span>
              {isAvailable
                ? `${property.availableUnits} ROOMS AVAILABLE NOW`
                : `WAITLIST QUEUE #${property.waitlistCount || 3}`}
            </span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Compact Location & Capacity */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {property.capacity}
          </span>
          <span className="inline-flex items-center gap-1 truncate max-w-[180px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.distanceToFaculty || property.campusName}</span>
          </span>
        </div>

        {/* Primary Action Buttons (70% View Details, 30% Wishlist Heart) */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => onViewDetails(property)}
            className="w-[70%] h-10 rounded-xl font-bold text-xs text-white shadow-xs hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: '#800000' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-red-200" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleWishlist(property.id)}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`w-[30%] h-10 rounded-xl border font-medium text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
              }`}
            />
            <span className="text-[11px] font-semibold">{isWishlisted ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Bottom 3-Column Telemetry Strip (Directly mirrors INFLUENCE / ENGAGEMENT / REACH in Design Guide) */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 grid grid-cols-3 text-center">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            OCCUPANCY
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 tabular-nums">
            {occupancyPct}%
          </div>
        </div>
        <div className="border-x border-slate-200/60">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            SATISFACTION
          </div>
          <div
            className={`text-sm font-bold mt-0.5 tabular-nums ${
              satisfactionPct >= 94 ? 'text-emerald-600' : 'text-slate-800'
            }`}
          >
            {satisfactionPct}%
          </div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            TRANSIT SCORE
          </div>
          <div
            className={`text-sm font-bold mt-0.5 tabular-nums ${
              transitReachPct >= 94 ? 'text-emerald-600' : 'text-slate-800'
            }`}
          >
            {transitReachPct}%
          </div>
        </div>
      </div>
    </article>
  );
};
