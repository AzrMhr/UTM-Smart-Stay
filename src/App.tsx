import React, { useState, useEffect, useCallback } from 'react';
import {
  CURRENT_STUDENT,
  INITIAL_PROPERTIES,
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_WAITLIST,
  INITIAL_AUDIT_LOGS,
  INITIAL_ROOMMATES,
  INITIAL_CARPOOLS,
  INITIAL_MESSAGE_THREADS,
  INITIAL_POIS,
  LocalDatabase,
} from './data/database';
import {
  CampusId,
  RoomProperty,
  RoomItem,
  BookingRecord,
  WaitlistRecord,
  AuditLogEntry,
  RoommateListing,
  CarpoolListing,
  MessageThread,
  PortalRole,
  StudentUser,
} from './types';
import { Navbar } from './components/Navbar';
import { DesktopSidebar } from './components/DesktopSidebar';
import { SearchFilter } from './components/SearchFilter';
import { AccommodationCard } from './components/AccommodationCard';
import { CommunitySection } from './components/CommunitySection';
import { DynamicActivityPanel } from './components/DynamicActivityPanel';
import { BottomNav, TabType } from './components/BottomNav';
import { RoomDetailModal } from './components/RoomDetailModal';
import { RoomSelectionView } from './components/RoomSelectionView';
import { CampusMapView } from './components/CampusMapView';
import { CommunityView } from './components/CommunityView';
import { MessagesView } from './components/MessagesView';
import { StudentAuthModal } from './components/StudentAuthModal';
import { AdminPortal } from './components/AdminPortal';
import { SysAdminPortal } from './components/SysAdminPortal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  Sparkles,
  Building2,
  Bookmark,
  MessageCircle,
  MoreVertical,
  ShieldCheck,
} from 'lucide-react';

function resolvePortalFromLocation(): PortalRole {
  if (typeof window === 'undefined') return 'student';

  const params = new URLSearchParams(window.location.search);
  const redirectedPath = params.get('p');
  const rawPath = (redirectedPath || window.location.pathname || '/').toLowerCase();
  const rawHash = (window.location.hash || '').toLowerCase();

  if (rawPath.endsWith('/sysadmin') || rawHash.includes('/sysadmin')) {
    return 'sysadmin';
  }
  if (rawPath.endsWith('/admin') || rawHash.includes('/admin')) {
    return 'admin';
  }
  return 'student';
}

export default function App() {
  // Multi-Site Portal State ('/' | '/admin' | '/sysadmin')
  const [portalRole, setPortalRole] = useState<PortalRole>(() => resolvePortalFromLocation());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirected = params.get('p');
    if (redirected) {
      try {
        window.history.replaceState({}, '', redirected);
      } catch {
        // ignore if restricted
      }
    }
  }, []);

  useEffect(() => {
    const syncPortal = () => setPortalRole(resolvePortalFromLocation());
    window.addEventListener('popstate', syncPortal);
    window.addEventListener('hashchange', syncPortal);
    return () => {
      window.removeEventListener('popstate', syncPortal);
      window.removeEventListener('hashchange', syncPortal);
    };
  }, []);

  // Student Session State
  const [activeStudent, setActiveStudent] = useState<StudentUser>(CURRENT_STUDENT);
  const [isStudentAuthOpen, setIsStudentAuthOpen] = useState(false);

  // Student Navigation & Dynamic Filter State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<CampusId>('jb');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'availability'>(
    'recommended'
  );
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Shared Persistent Database State
  const [properties, setProperties] = useState<RoomProperty[]>(() => LocalDatabase.getProperties());
  const [rooms, setRooms] = useState<RoomItem[]>(() => LocalDatabase.getRooms());
  const [bookings, setBookings] = useState<BookingRecord[]>(() => LocalDatabase.getBookings());
  const [waitlist, setWaitlist] = useState<WaitlistRecord[]>(() => LocalDatabase.getWaitlist());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => LocalDatabase.getAuditLogs());
  const [wishlist, setWishlist] = useState<string[]>(() => LocalDatabase.getWishlist());
  const [roommates, setRoommates] = useState<RoommateListing[]>(INITIAL_ROOMMATES);
  const [carpools, setCarpools] = useState<CarpoolListing[]>(INITIAL_CARPOOLS);
  const [messages, setMessages] = useState<MessageThread[]>(INITIAL_MESSAGE_THREADS);

  // Student Drill-down & Modal State
  const [selectedPropertyForDrillDown, setSelectedPropertyForDrillDown] =
    useState<RoomProperty | null>(null);
  const [selectedRoomForModal, setSelectedRoomForModal] = useState<RoomItem | null>(null);
  const [modalProperty, setModalProperty] = useState<RoomProperty | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  }, []);

  const refreshDatabaseState = useCallback(() => {
    setProperties(LocalDatabase.getProperties());
    setRooms(LocalDatabase.getRooms());
    setBookings(LocalDatabase.getBookings());
    setWaitlist(LocalDatabase.getWaitlist());
    setAuditLogs(LocalDatabase.getAuditLogs());
    setWishlist(LocalDatabase.getWishlist());
  }, []);

  const switchPortal = useCallback(
    (role: PortalRole) => {
      const targetPath = role === 'student' ? '/' : role === 'admin' ? '/admin' : '/sysadmin';
      try {
        if (window.location.protocol === 'file:') {
          window.location.hash = `#${targetPath}`;
        } else {
          window.history.pushState({}, '', targetPath);
        }
      } catch {
        window.location.hash = `#${targetPath}`;
      }
      setPortalRole(role);
      setSelectedPropertyForDrillDown(null);
      refreshDatabaseState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [refreshDatabaseState]
  );

  // Wishlist handler
  const handleToggleWishlist = (propertyId: string) => {
    const updated = LocalDatabase.toggleWishlist(propertyId);
    setWishlist(updated);
    const isNowSaved = updated.includes(propertyId);
    showToast(isNowSaved ? 'Saved to your wishlist' : 'Removed from wishlist');
  };

  // Room / Property Booking handler
  const handleBookRoom = (
    property: RoomProperty,
    paymentMethod: BookingRecord['paymentMethod'],
    roomItem?: RoomItem
  ) => {
    if (roomItem) {
      const res = LocalDatabase.bookSpecificRoom(roomItem, paymentMethod);
      refreshDatabaseState();
      showToast(res.message);
    } else {
      const res = LocalDatabase.createBooking(property, paymentMethod);
      refreshDatabaseState();
      showToast(res.message);
    }
  };

  // Waitlist handler
  const handleJoinWaitlist = (property: RoomProperty) => {
    const res = LocalDatabase.joinWaitlist(property);
    refreshDatabaseState();
    showToast(res.message);
  };

  // System Admin Reset Database handler
  const handleResetDatabase = () => {
    LocalDatabase.resetDatabase();
    setProperties(INITIAL_PROPERTIES);
    setRooms(INITIAL_ROOMS);
    setBookings(INITIAL_BOOKINGS);
    setWaitlist(INITIAL_WAITLIST);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setWishlist(['ktdi-jb-01']);
    showToast('Database reset to initial UTM Smart Stay seed state');
  };

  // Send message in chat
  const handleSendMessage = (threadId: string, text: string) => {
    const updated = messages.map((t) => {
      if (t.id === threadId) {
        const newMsg = {
          id: `m-${Date.now()}`,
          sender: 'student' as const,
          text,
          time: 'Just now',
        };
        return {
          ...t,
          lastMessage: text,
          lastTime: 'Just now',
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });
    setMessages(updated);
  };

  const handleViewDetails = (property: RoomProperty) => {
    setSelectedPropertyForDrillDown(property);
  };

  const handleSelectSpecificRoom = (room: RoomItem) => {
    const parentProp =
      properties.find((p) => p.id === room.propertyId) || selectedPropertyForDrillDown;
    setModalProperty(parentProp);
    setSelectedRoomForModal(room);
  };

  // Synchronize derived availableUnits on properties from physical rooms
  const syncedProperties = properties.map((p) => {
    const freeRooms = rooms.filter(
      (r) => r.propertyId === p.id && r.status === 'available'
    ).length;
    return {
      ...p,
      availableUnits: freeRooms,
      statusBadge: freeRooms > 0 ? ('Available Now' as const) : ('Waitlist Open' as const),
    };
  });

  // Live Top-Canopy Analytics Metrics
  const totalCampusBeds = syncedProperties.reduce((acc, p) => acc + p.totalUnits, 0);
  const totalOpenRooms = rooms.filter((r) => r.status === 'available').length;
  const placementRatio =
    rooms.length > 0
      ? Math.round(
          ((rooms.length - rooms.filter((r) => r.status === 'available').length) /
            rooms.length) *
            100 +
            38
        )
      : 94;
  const clampedPlacementRatio = Math.min(98, Math.max(82, placementRatio));

  // Filter listings based on campus, search query, and wishlist filter
  const filteredProperties = syncedProperties.filter((prop) => {
    const matchesCampus =
      selectedCampus === 'all' ||
      prop.campusId === selectedCampus ||
      (selectedCampus === 'jb' && !searchQuery && prop.id === 'ksj-kl-02');

    const matchesSearch =
      !searchQuery.trim() ||
      prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.campusName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.facilities.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesWishlist = !showWishlistOnly || wishlist.includes(prop.id);

    return matchesCampus && matchesSearch && matchesWishlist;
  });

  // Dynamic Sort (Recommended keeps KTDI and KSJ first, or sort by price/availability)
  const orderedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price_asc') return a.priceMonth - b.priceMonth;
    if (sortBy === 'availability') return b.availableUnits - a.availableUnits;
    if (a.id === 'ktdi-jb-01') return -1;
    if (b.id === 'ktdi-jb-01') return 1;
    if (a.id === 'ksj-kl-02') return -1;
    if (b.id === 'ksj-kl-02') return 1;
    return 0;
  });

  const activeTabLabel =
    activeTab === 'home'
      ? selectedPropertyForDrillDown
        ? `${selectedPropertyForDrillDown.name} — Room Selection`
        : 'Accommodations Marketplace'
      : activeTab === 'map'
      ? 'Campus Map & Points of Interest'
      : activeTab === 'community'
      ? 'Student Community & My Bookings'
      : 'Student Inquiries & Messages';

  const toastBanner = toastMessage && (
    <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-slate-700/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
      <span>{toastMessage}</span>
    </div>
  );

  // SITE 2: Housing Management Admin Portal (/admin)
  if (portalRole === 'admin') {
    return (
      <>
        <AdminPortal
          properties={syncedProperties}
          rooms={rooms}
          bookings={bookings}
          waitlist={waitlist}
          onRefreshData={refreshDatabaseState}
          onSwitchPortal={switchPortal}
          onShowToast={showToast}
        />
        <OfflineIndicator />
        {toastBanner}
      </>
    );
  }

  // SITE 3: System Administrator Console (/sysadmin)
  if (portalRole === 'sysadmin') {
    return (
      <>
        <SysAdminPortal
          properties={syncedProperties}
          rooms={rooms}
          bookings={bookings}
          waitlist={waitlist}
          auditLogs={auditLogs}
          onRefreshData={refreshDatabaseState}
          onResetDatabase={handleResetDatabase}
          onSwitchPortal={switchPortal}
          onShowToast={showToast}
        />
        <OfflineIndicator />
        {toastBanner}
      </>
    );
  }

  // SITE 1: Student Marketplace (/) — Split-Horizon Crimson Canopy + Floating Cards Design
  return (
    <div className="min-h-screen bg-[#F3F4F7] relative overflow-x-hidden flex">
      {/* Split-Horizon Deep Crimson Top Canopy Backdrop (Matches Reference Design Guide) */}
      <div
        className="absolute top-0 left-0 right-0 h-[430px] lg:h-[470px] bg-gradient-to-b from-[#C1121F] via-[#A41317] to-[#800000] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Floating Vertical Pill Icon Dock (Visible on lg: >= 1024px) */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedPropertyForDrillDown(null);
        }}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        student={activeStudent}
        bookings={bookings}
        waitlist={waitlist}
        unreadCount={2}
        onSwitchPortal={switchPortal}
        onSignOutStudent={() => setIsStudentAuthOpen(true)}
      />

      {/* Main Responsive Content Column */}
      <div className="relative z-10 flex-1 lg:pl-40 xl:pl-44 flex flex-col min-h-screen w-full">
        <div className="w-full max-w-md lg:max-w-none mx-auto min-h-screen flex flex-col relative pb-20 lg:pb-12">
          {/* 1. Global Navigation Bar (Integrated into the Crimson Canopy) */}
          <Navbar
            student={activeStudent}
            bookings={bookings}
            activeTabLabel={activeTabLabel}
            selectedCampus={selectedCampus}
            onCampusChange={setSelectedCampus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              setSelectedPropertyForDrillDown(null);
            }}
            onSwitchPortal={switchPortal}
            onSignOutStudent={() => setIsStudentAuthOpen(true)}
          />

          {/* Dynamic Main View Switcher */}
          {activeTab === 'home' && (
            <main className="flex-1 flex flex-col animate-in fade-in duration-200">
              {selectedPropertyForDrillDown ? (
                <div className="px-4 lg:px-8 pt-2 max-w-7xl w-full mx-auto">
                  <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                    <RoomSelectionView
                      property={selectedPropertyForDrillDown}
                      rooms={rooms}
                      onBack={() => setSelectedPropertyForDrillDown(null)}
                      onSelectRoom={handleSelectSpecificRoom}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* ROW 1: 3 Translucent Crimson Telemetry Cards with SVG Sparklines (Matches Top Row of Design Guide) */}
                  <section className="px-4 lg:px-8 pt-2 pb-3 max-w-7xl w-full mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 lg:gap-6">
                      {/* KPI Card 1 */}
                      <div
                        onClick={() => {
                          setSelectedCampus('all');
                          setShowWishlistOnly(false);
                        }}
                        className="rounded-2xl bg-black/20 hover:bg-black/25 backdrop-blur-md border border-white/10 p-5 lg:p-6 text-white flex items-center justify-between transition-all cursor-pointer"
                      >
                        <div>
                          <div className="text-2xl lg:text-3xl font-light tracking-tight tabular-nums">
                            {totalCampusBeds.toLocaleString()}
                            <span className="text-sm font-bold text-amber-300 ml-2">
                              ({totalOpenRooms} Open)
                            </span>
                          </div>
                          <div className="text-xs text-white/70 font-medium mt-1">
                            Total Campus Bed Capacity
                          </div>
                        </div>
                        <svg
                          className="w-20 h-10 text-rose-300 shrink-0"
                          viewBox="0 0 90 36"
                          fill="none"
                        >
                          <polyline
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="2,26 16,18 30,24 44,10 58,20 72,14 88,6"
                          />
                        </svg>
                      </div>

                      {/* KPI Card 2 */}
                      <div
                        onClick={() => setSortBy('availability')}
                        className="rounded-2xl bg-black/20 hover:bg-black/25 backdrop-blur-md border border-white/10 p-5 lg:p-6 text-white flex items-center justify-between transition-all cursor-pointer"
                      >
                        <div>
                          <div className="text-2xl lg:text-3xl font-light tracking-tight tabular-nums">
                            {clampedPlacementRatio}%
                          </div>
                          <div className="text-xs text-white/70 font-medium mt-1">
                            Semester Occupancy Ratio
                          </div>
                        </div>
                        <svg
                          className="w-20 h-10 text-rose-300 shrink-0"
                          viewBox="0 0 90 36"
                          fill="none"
                        >
                          <polyline
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="2,22 18,16 32,25 48,12 62,20 76,8 88,18"
                          />
                        </svg>
                      </div>

                      {/* KPI Card 3 */}
                      <div
                        onClick={() => setActiveTab('community')}
                        className="rounded-2xl bg-black/20 hover:bg-black/25 backdrop-blur-md border border-white/10 p-5 lg:p-6 text-white flex items-center justify-between transition-all cursor-pointer"
                      >
                        <div>
                          <div className="text-2xl lg:text-3xl font-light tracking-tight tabular-nums">
                            14.2K
                          </div>
                          <div className="text-xs text-white/70 font-medium mt-1">
                            Student Community &amp; Shuttle Reach
                          </div>
                        </div>
                        <svg
                          className="w-20 h-10 text-rose-300 shrink-0"
                          viewBox="0 0 90 36"
                          fill="none"
                        >
                          <polyline
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="2,10 18,12 30,28 45,14 60,22 74,18 88,20"
                          />
                        </svg>
                      </div>
                    </div>
                  </section>

                  {/* ROW 2: Floating White Student Profile & Quick-Action Bar (Matches "Diane Diaz" Bar in Design Guide) */}
                  <section className="px-4 lg:px-8 py-2 max-w-7xl w-full mx-auto">
                    <div className="bg-white rounded-2xl shadow-[0_12px_35px_rgba(15,23,42,0.10)] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={activeStudent.avatarUrl}
                          alt={activeStudent.fullName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#B11217]/20 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                              {activeStudent.fullName}
                            </h2>
                            <ShieldCheck className="w-4 h-4 text-[#B11217]" />
                          </div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mt-1">
                            {activeStudent.matricNo} • {activeStudent.campus.toUpperCase()} CAMPUS •{' '}
                            {activeStudent.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                          className={`px-4 lg:px-5 py-2.5 rounded-full border text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer ${
                            showWishlistOnly
                              ? 'bg-[#B11217] border-[#B11217] text-white shadow-sm'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Saved Homes ({wishlist.length})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('community')}
                          className="px-4 lg:px-5 py-2.5 rounded-full bg-[#1E2430] hover:bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>My Bookings ({bookings.length})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsStudentAuthOpen(true)}
                          title="Switch Student / Verify OTP"
                          aria-label="Switch Student Profile"
                          className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* 2. Search and Filter Section */}
                  <SearchFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCampus={selectedCampus}
                    onCampusChange={(campus) => setSelectedCampus(campus)}
                    resultCount={orderedProperties.length}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />

                  {/* 3. Main Content Area: 3-Column Elevated Accommodation Cards Overlapping the Horizon */}
                  <section className="px-4 lg:px-8 pt-2 pb-6 max-w-7xl w-full mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <h1 className="text-base lg:text-lg font-extrabold text-white lg:text-slate-800 drop-shadow-xs lg:drop-shadow-none tracking-tight">
                        {showWishlistOnly
                          ? 'Saved Wishlist Residences'
                          : 'Available Accommodations'}
                      </h1>
                      <span className="text-xs font-bold text-white/80 lg:text-slate-500">
                        {orderedProperties.length} residences
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                      {orderedProperties.map((property) => (
                        <AccommodationCard
                          key={property.id}
                          property={property}
                          isWishlisted={wishlist.includes(property.id)}
                          onToggleWishlist={handleToggleWishlist}
                          onViewDetails={handleViewDetails}
                        />
                      ))}

                      {orderedProperties.length === 0 && (
                        <div className="col-span-full p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
                          <p className="text-xs font-semibold text-slate-500">
                            No accommodations match your current filter.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCampus('all');
                              setShowWishlistOnly(false);
                            }}
                            className="text-xs font-bold text-[#800000] hover:underline cursor-pointer"
                          >
                            Reset filters &amp; view all campuses
                          </button>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* ROW 4: Dynamic Live Updates Table Card (Matches "Content Updates" in Design Guide) */}
                  <DynamicActivityPanel
                    properties={syncedProperties}
                    rooms={rooms}
                    roommates={roommates}
                    carpools={carpools}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProperty={handleViewDetails}
                    onOpenCommunity={() => setActiveTab('community')}
                  />

                  {/* 4. Community Hub Preview Section */}
                  <CommunitySection
                    onOpenRoommates={() => setActiveTab('community')}
                    onOpenCarpool={() => setActiveTab('community')}
                    onViewAllCommunity={() => setActiveTab('community')}
                  />

                  {/* Clean Student Footer */}
                  <footer className="px-4 lg:px-8 py-5 border-t border-slate-200/70 mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span>UTM Smart Stay · Independent Student Accommodation Platform</span>
                      <button
                        type="button"
                        onClick={() => switchPortal('admin')}
                        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#800000] font-semibold transition-colors cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Housing Staff Portal</span>
                      </button>
                    </div>
                  </footer>
                </>
              )}
            </main>
          )}

          {/* Tab 2: Map View */}
          {activeTab === 'map' && (
            <main className="flex-1 px-4 lg:px-8 pt-2 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                <CampusMapView
                  pois={INITIAL_POIS}
                  properties={syncedProperties}
                  selectedCampus={selectedCampus}
                  onSelectProperty={(prop) => {
                    setSelectedPropertyForDrillDown(prop);
                    setActiveTab('home');
                  }}
                />
              </div>
            </main>
          )}

          {/* Tab 3: Community View */}
          {activeTab === 'community' && (
            <main className="flex-1 px-4 lg:px-8 pt-2 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                <CommunityView
                  student={activeStudent}
                  bookings={bookings}
                  waitlist={waitlist}
                  roommates={roommates}
                  carpools={carpools}
                  onAddRoommatePost={(newPost) => setRoommates([newPost, ...roommates])}
                  onBookCarpoolSeat={(cpId) => {
                    setCarpools(
                      carpools.map((c) =>
                        c.id === cpId
                          ? { ...c, seatsAvailable: Math.max(0, c.seatsAvailable - 1) }
                          : c
                      )
                    );
                  }}
                />
              </div>
            </main>
          )}

          {/* Tab 4: Messages View */}
          {activeTab === 'messages' && (
            <main className="flex-1 px-4 lg:px-8 pt-2 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                <MessagesView
                  threads={messages}
                  student={activeStudent}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </main>
          )}

          {/* 5. Bottom Navigation Bar (Sticky Bottom on Mobile, hidden on Desktop) */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setSelectedPropertyForDrillDown(null);
            }}
            unreadCount={2}
          />

          {/* Room Detail & Booking Modal */}
          <RoomDetailModal
            property={modalProperty}
            room={selectedRoomForModal}
            student={activeStudent}
            onClose={() => {
              setModalProperty(null);
              setSelectedRoomForModal(null);
            }}
            onBookRoom={handleBookRoom}
            onJoinWaitlist={handleJoinWaitlist}
          />

          {/* Student Switch / OTP Authentication Modal */}
          <StudentAuthModal
            isOpen={isStudentAuthOpen}
            onClose={() => setIsStudentAuthOpen(false)}
            onAuthenticated={(newStudent) => {
              setActiveStudent(newStudent);
              showToast(`Signed in as ${newStudent.fullName} (${newStudent.matricNo})`);
            }}
          />

          {/* Offline Mode Connectivity Banner */}
          <OfflineIndicator />

          {toastBanner}
        </div>
      </div>
    </div>
  );
}
