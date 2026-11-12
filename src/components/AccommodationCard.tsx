import React from 'react';
import { Heart, MapPin, Users, Sparkles, Bed, ShieldCheck } from 'lucide-react';
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
  // Determine badge styling
  const isAvailable = property.statusBadge === 'Available Now';

  return (
    <article className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Top 50%: 16:9 Aspect Ratio Image Container */}
      <div className="relative w-full aspect-video bg-slate-100 overflow-hidden group">
        {/* Architectural campus visual representation */}
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
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="60%" stopColor="#eff6ff" />
                  <stop offset="100%" stopColor="#f8fafc" />
                </linearGradient>
                <linearGradient id="wall-ktdi" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>
                <linearGradient id="roof-ktdi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#sky-ktdi)" />
              {/* Greenery / Campus hills */}
              <path d="M0 240 Q 180 200 360 230 T 640 220 L 640 360 L 0 360 Z" fill="#15803d" opacity="0.25" />
              <path d="M0 270 Q 220 240 440 265 T 640 255 L 640 360 L 0 360 Z" fill="#16a34a" opacity="0.3" />
              {/* Modern KTDI Single Block Structure */}
              <g transform="translate(140, 70)">
                {/* Main Dormitory Building */}
                <rect x="30" y="40" width="300" height="190" rx="4" fill="url(#wall-ktdi)" stroke="#cbd5e1" strokeWidth="2" />
                {/* Traditional Malaysian College Pitched Roof in Crimson */}
                <polygon points="10,40 180,-10 350,40" fill="url(#roof-ktdi)" />
                <rect x="15" y="38" width="330" height="7" fill="#800000" />
                {/* Windows and balcony rows */}
                {[0, 1, 2].map((row) => (
                  <g key={row} transform={`translate(0, ${row * 50})`}>
                    {[0, 1, 2, 3].map((col) => (
                      <g key={col} transform={`translate(${col * 65 + 50}, 60)`}>
                        <rect x="0" y="0" width="45" height="35" rx="3" fill="#38bdf8" opacity="0.75" stroke="#94a3b8" />
                        <rect x="2" y="16" width="41" height="17" fill="#ffffff" opacity="0.85" />
                        <line x1="22.5" y1="0" x2="22.5" y2="35" stroke="#94a3b8" />
                        {/* Sun shade */}
                        <line x1="-3" y1="-2" x2="48" y2="-2" stroke="#64748b" strokeWidth="2" />
                      </g>
                    ))}
                  </g>
                ))}
                {/* Entrance canopy */}
                <rect x="150" y="200" width="60" height="30" fill="#334155" />
                <rect x="140" y="196" width="80" height="6" fill="#800000" />
              </g>
              {/* Campus palm / tropical trees */}
              <circle cx="80" cy="270" r="45" fill="#166534" opacity="0.8" />
              <circle cx="105" cy="250" r="35" fill="#15803d" opacity="0.9" />
              <circle cx="560" cy="280" r="50" fill="#166534" opacity="0.85" />
              <circle cx="530" cy="260" r="40" fill="#15803d" opacity="0.9" />
              {/* Ground lawn */}
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
              {/* KL Cityline Backdrop (Setiawangsa / Titiwangsa) */}
              <rect x="80" y="170" width="30" height="110" fill="#cbd5e1" opacity="0.5" />
              <rect x="120" y="150" width="25" height="130" fill="#cbd5e1" opacity="0.4" />
              <rect x="520" y="160" width="35" height="120" fill="#cbd5e1" opacity="0.5" />
              {/* Modern KSJ Twin Highrise Block */}
              <g transform="translate(170, 45)">
                {/* Block A & B */}
                <rect x="30" y="30" width="130" height="235" rx="3" fill="url(#wall-ksj)" stroke="#cbd5e1" strokeWidth="2" />
                <rect x="175" y="15" width="130" height="250" rx="3" fill="url(#wall-ksj)" stroke="#cbd5e1" strokeWidth="2" />
                {/* Roof parapet in UTM Dark Red */}
                <rect x="25" y="24" width="140" height="8" fill="#800000" />
                <rect x="170" y="9" width="140" height="8" fill="#800000" />
                {/* Sky bridge connecting blocks */}
                <rect x="155" y="120" width="25" height="25" fill="#334155" opacity="0.8" />
                {/* Window Grids with AC Ledges */}
                {[0, 1, 2, 3, 4].map((r) => (
                  <g key={r} transform={`translate(0, ${r * 40})`}>
                    <rect x="45" y="45" width="38" height="26" rx="2" fill="#38bdf8" opacity="0.6" stroke="#94a3b8" />
                    <rect x="105" y="45" width="38" height="26" rx="2" fill="#38bdf8" opacity="0.6" stroke="#94a3b8" />
                    <rect x="190" y="32" width="38" height="26" rx="2" fill="#38bdf8" opacity="0.6" stroke="#94a3b8" />
                    <rect x="250" y="32" width="38" height="26" rx="2" fill="#38bdf8" opacity="0.6" stroke="#94a3b8" />
                  </g>
                ))}
              </g>
              {/* KSJ Campus ground & shuttle lane */}
              <rect x="0" y="290" width="640" height="70" fill="#475569" opacity="0.3" />
              {/* UTM Shuttle Bus Silhouette */}
              <g transform="translate(430, 275)">
                <rect x="0" y="0" width="90" height="36" rx="4" fill="#800000" />
                <rect x="5" y="5" width="75" height="14" rx="2" fill="#e0f2fe" opacity="0.9" />
                <circle cx="20" cy="38" r="8" fill="#0f172a" />
                <circle cx="70" cy="38" r="8" fill="#0f172a" />
              </g>
            </svg>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400">
              <Bed className="w-12 h-12 stroke-[1.2] text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-500">{property.name}</span>
            </div>
          )}
        </div>

        {/* Overlay Badge in the top-left corner of the image */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold tracking-tight shadow-sm ${
              isAvailable
                ? 'bg-emerald-600 text-white ring-1 ring-emerald-500'
                : 'bg-amber-600 text-white ring-1 ring-amber-500'
            }`}
          >
            {isAvailable ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
            )}
            {property.statusBadge}
          </span>
        </div>

        {/* Subtle rating/verified chip in top-right */}
        <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>UTM Verified</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 space-y-3">
        {/* Title & Price Row */}
        <div className="flex items-start justify-between gap-2">
          {/* Left-aligned Text */}
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-slate-900 leading-snug tracking-tight">
              {property.name}
            </h3>
            <p className="text-xs text-slate-500">
              {property.subtitle || `${property.campusName} • ${property.roomType}`}
            </p>
          </div>

          {/* Right-aligned Price Text (Bold, dark red) */}
          <div className="text-right shrink-0">
            <div
              className="text-base font-extrabold tracking-tight"
              style={{ color: '#800000' }}
            >
              RM {property.priceMonth} / month
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              RM {property.priceSemester} / semester
            </div>
          </div>
        </div>

        {/* Availability & Facility Mini Highlights */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{property.capacity}</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[170px]">{property.distanceToFaculty || property.address}</span>
          </div>

          {isAvailable ? (
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {property.availableUnits} left
            </span>
          ) : (
            <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
              Waitlist #{property.waitlistCount || 3}
            </span>
          )}
        </div>

        {/* Bottom of the card: Two buttons */}
        {/* Primary button "View Details" taking up 70% width, secondary 'heart' wishlist button taking up 30% width */}
        <div className="flex items-center gap-2 pt-1">
          {/* Primary Button: 70% width, dark red fill, white text */}
          <button
            type="button"
            onClick={() => onViewDetails(property)}
            className="w-[70%] h-11 rounded-xl font-bold text-xs text-white shadow-xs hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            style={{ backgroundColor: '#800000' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-red-200" />
            <span>View Details</span>
          </button>

          {/* Secondary Outline Icon Button: 30% width, heart icon for wishlist */}
          <button
            type="button"
            onClick={() => onToggleWishlist(property.id)}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`w-[30%] h-11 rounded-xl border font-medium text-xs flex items-center justify-center gap-1 transition-all active:scale-95 ${
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
    </article>
  );
};
