import React from 'react';
import { Users, Car, ChevronRight, UserPlus, Calendar } from 'lucide-react';

interface CommunitySectionProps {
  onOpenRoommates: () => void;
  onOpenCarpool: () => void;
  onViewAllCommunity: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  onOpenRoommates,
  onOpenCarpool,
  onViewAllCommunity,
}) => {
  return (
    <section className="w-full bg-[#F8F9FA] border-t border-b border-slate-200/80 px-4 lg:px-8 py-5 lg:py-6 my-2">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* Section Title: "Student Community Board" (Dark gray, bold) */}
        <div className="flex items-center justify-between">
          <h2 className="text-base lg:text-lg font-bold text-slate-800 tracking-tight">
            Student Community Board
          </h2>
          <button
            type="button"
            onClick={onViewAllCommunity}
            className="text-xs font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
            style={{ color: '#800000' }}
          >
            <span>Explore Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontally scrollable row on mobile, responsive grid on desktop */}
        <div className="flex lg:grid lg:grid-cols-2 items-stretch gap-3 lg:gap-5 overflow-x-auto no-scrollbar pb-1">
          {/* Widget 1: Title "Find a Roommate", Icon: Two people, Brief text: "Connect with students looking to share." */}
          <button
            type="button"
            onClick={onOpenRoommates}
            className="w-44 h-44 lg:w-full lg:h-auto shrink-0 bg-white rounded-2xl p-4 lg:p-5 border border-slate-200/90 shadow-2xs text-left flex flex-col justify-between hover:border-[#800000]/40 hover:shadow-xs active:scale-[0.99] transition-all group cursor-pointer"
          >
            <div className="lg:flex lg:items-start lg:gap-4">
              {/* Icon Container: Two people (Users) */}
              <div
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mb-3 lg:mb-0 shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: '#800000' }}
              >
                <Users className="w-5 h-5 text-white" />
              </div>

              <div>
                {/* Title: "Find a Roommate" */}
                <h3 className="text-sm lg:text-base font-bold text-slate-900 group-hover:text-[#800000] transition-colors leading-tight">
                  Find a Roommate
                </h3>

                {/* Brief text: "Connect with students looking to share." */}
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  Connect with students looking to share.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 lg:pt-3 lg:mt-4 border-t border-slate-100 text-[11px] font-semibold text-[#800000]">
              <span className="flex items-center gap-1">
                <UserPlus className="w-3.5 h-3.5" />
                <span>3 New Matches</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Widget 2: Title "Campus Carpool", Icon: A car, Brief text: "Share rides between KSJ and UTM KL." */}
          <button
            type="button"
            onClick={onOpenCarpool}
            className="w-44 h-44 lg:w-full lg:h-auto shrink-0 bg-white rounded-2xl p-4 lg:p-5 border border-slate-200/90 shadow-2xs text-left flex flex-col justify-between hover:border-[#800000]/40 hover:shadow-xs active:scale-[0.99] transition-all group cursor-pointer"
          >
            <div className="lg:flex lg:items-start lg:gap-4">
              {/* Icon Container: A car (Car) */}
              <div
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mb-3 lg:mb-0 shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: '#800000' }}
              >
                <Car className="w-5 h-5 text-white" />
              </div>

              <div>
                {/* Title: "Campus Carpool" */}
                <h3 className="text-sm lg:text-base font-bold text-slate-900 group-hover:text-[#800000] transition-colors leading-tight">
                  Campus Carpool
                </h3>

                {/* Brief text: "Share rides between KSJ and UTM KL." */}
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  Share rides between KSJ and UTM KL.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 lg:pt-3 lg:mt-4 border-t border-slate-100 text-[11px] font-semibold text-[#800000]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily Schedules</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
