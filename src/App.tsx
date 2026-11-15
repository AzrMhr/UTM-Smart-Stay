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
import { Sparkles, Building2 } from 'lucide-react';

function resolvePortalFromLocation(): PortalRole {
  if (typeof window === 'undefined') return 'student';

  // Handle GitHub Pages SPA 404 redirect query (?p=/admin or ?p=/sysadmin)
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

  // Normalize GitHub Pages ?p= redirect on initial load
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

  // Listen to browser back/forward and hash changes
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

  // Student Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<CampusId>('jb');

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

  // Filter listings based on campus and search query
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

    return matchesCampus && matchesSearch;
  });

  // Ensure KTDI and KSJ appear first on the marketplace view
  const orderedProperties = [...filteredProperties].sort((a, b) => {
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

  // SITE 1: Student Marketplace (/) — Strictly Student-Facing
  return (
    <div className="min-h-screen bg-slate-100 lg:bg-[#F8F9FA] flex">
      {/* Desktop Persistent Sidebar Navigation (Visible on lg: >= 1024px) */}
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

      {/* Responsive App Canvas */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full">
        <div className="w-full max-w-md lg:max-w-none mx-auto min-h-screen bg-white lg:bg-transparent shadow-2xl lg:shadow-none flex flex-col relative pb-20 lg:pb-10">
          {/* 1. Global Navigation Bar (Sticky Top) */}
          <Navbar
            student={activeStudent}
            bookings={bookings}
            activeTabLabel={activeTabLabel}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              setSelectedPropertyForDrillDown(null);
            }}
            onSwitchPortal={switchPortal}
            onSignOutStudent={() => setIsStudentAuthOpen(true)}
          />

          {/* Dynamic Main View Switcher */}
          {activeTab === 'home' && (
            <main className="flex-1 flex flex-col animate-in fade-in duration-150">
              {selectedPropertyForDrillDown ? (
                <RoomSelectionView
                  property={selectedPropertyForDrillDown}
                  rooms={rooms}
                  onBack={() => setSelectedPropertyForDrillDown(null)}
                  onSelectRoom={handleSelectSpecificRoom}
                />
              ) : (
                <>
                  {/* 2. Search and Filter Section */}
                  <SearchFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCampus={selectedCampus}
                    onCampusChange={(campus) => setSelectedCampus(campus)}
                    resultCount={orderedProperties.length}
                  />

                  {/* 3. Main Content Area: Accommodation Listings */}
                  <section className="px-4 lg:px-8 py-4 lg:py-6 max-w-7xl w-full mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <h1 className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight">
                        Available Accommodations
                      </h1>
                      <span className="text-xs font-semibold text-slate-400">
                        {orderedProperties.length} residences
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
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
                        <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                          <p className="text-xs font-semibold text-slate-500">
                            No accommodations match &quot;{searchQuery}&quot; in{' '}
                            {selectedCampus.toUpperCase()}.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCampus('all');
                            }}
                            className="text-xs font-bold text-[#800000] hover:underline cursor-pointer"
                          >
                            Clear search &amp; view all campuses
                          </button>
                        </div>
                      )}
                    </div>
                  </section>

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
            <main className="flex-1 animate-in fade-in duration-150">
              <CampusMapView
                pois={INITIAL_POIS}
                properties={syncedProperties}
                selectedCampus={selectedCampus}
                onSelectProperty={(prop) => {
                  setSelectedPropertyForDrillDown(prop);
                  setActiveTab('home');
                }}
              />
            </main>
          )}

          {/* Tab 3: Community View */}
          {activeTab === 'community' && (
            <main className="flex-1 animate-in fade-in duration-150">
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
            </main>
          )}

          {/* Tab 4: Messages View */}
          {activeTab === 'messages' && (
            <main className="flex-1 animate-in fade-in duration-150">
              <MessagesView
                threads={messages}
                student={activeStudent}
                onSendMessage={handleSendMessage}
              />
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
