import React from 'react';
import { Home, Map, Users, MessageSquare } from 'lucide-react';

export type TabType = 'home' | 'map' | 'community' | 'messages';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 2,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-lg pb-safe">
      <div className="max-w-md mx-auto h-16 grid grid-cols-4 items-center px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center h-full w-full py-1 text-center relative group active:scale-95 transition-transform"
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-[#800000]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                  style={isActive ? { color: '#800000' } : undefined}
                />

                {/* Badge if present (Icon 4 has notification badge '2') */}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center leading-none ring-1.5 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'font-bold' : 'text-slate-500'
                }`}
                style={isActive ? { color: '#800000' } : undefined}
              >
                {tab.label}
              </span>

              {/* Subtle top indicator bar for active state */}
              {isActive && (
                <span
                  className="absolute top-0 w-8 h-0.5 rounded-b-full"
                  style={{ backgroundColor: '#800000' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
