import React, { useState } from 'react';
import {
  CURRENT_STUDENT,
  INITIAL_PROPERTIES,
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_WAITLIST,
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
  RoommateListing,
  CarpoolListing,
  MessageThread,
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
import { DatabaseModal } from './components/DatabaseModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Database, Sparkles, Rocket } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  // "Johor Bahru" is styled as active by default per prompt specifications
  const [selectedCampus, setSelectedCampus] = useState<CampusId>('jb');

  // Database State (Persisted in LocalStorage)
  const [properties, setProperties] = useState<RoomProperty[]>(() => LocalDatabase.getProperties());
  const [rooms, setRooms] = useState<RoomItem[]>(() => LocalDatabase.getRooms());
  const [bookings, setBookings] = useState<BookingRecord[]>(() => LocalDatabase.getBookings());
  const [waitlist, setWaitlist] = useState<WaitlistRecord[]>(() => LocalDatabase.getWaitlist());
  const [wishlist, setWishlist] = useState<string[]>(() => LocalDatabase.getWishlist());
  const [roommates, setRoommates] = useState<RoommateListing[]>(INITIAL_ROOMMATES);
  const [carpools, setCarpools] = useState<CarpoolListing[]>(INITIAL_CARPOOLS);
  const [messages, setMessages] = useState<MessageThread[]>(INITIAL_MESSAGE_THREADS);

  // Drill-down State: Campus -> Kolej name -> Available rooms -> Room options (Addendum 01 Sec. 1)
  const [selectedPropertyForDrillDown, setSelectedPropertyForDrillDown] =
    useState<RoomProperty | null>(null);
  const [selectedRoomForModal, setSelectedRoomForModal] = useState<RoomItem | null>(null);

  // Modal States
  const [modalProperty, setModalProperty] = useState<RoomProperty | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

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
      // Room-level reservation (Addendum 01 Sec. 5)
      const res = LocalDatabase.bookSpecificRoom(roomItem, paymentMethod);
      if (res.success && res.booking) {
        setRooms(LocalDatabase.getRooms());
        setProperties(LocalDatabase.getProperties());
        setBookings(LocalDatabase.getBookings());
        showToast(res.message);
      } else {
        showToast(res.message);
      }
    } else {
      // Fallback property-level reservation
      const res = LocalDatabase.createBooking(property, paymentMethod);
      if (res.success && res.booking) {
        setProperties(LocalDatabase.getProperties());
        setBookings(LocalDatabase.getBookings());
        showToast(res.message);
      } else {
        showToast(res.message);
      }
    }
  };

  // Waitlist handler
  const handleJoinWaitlist = (property: RoomProperty) => {
    const res = LocalDatabase.joinWaitlist(property);
    if (res.success && res.waitlist) {
      setProperties(LocalDatabase.getProperties());
      setWaitlist(LocalDatabase.getWaitlist());
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  // Reset database handler
  const handleResetDatabase = () => {
    LocalDatabase.resetDatabase();
    setProperties(INITIAL_PROPERTIES);
    setRooms(INITIAL_ROOMS);
    setBookings(INITIAL_BOOKINGS);
    setWaitlist(INITIAL_WAITLIST);
    setWishlist(['ktdi-jb-01']);
    showToast('Database reset to fresh course project seed state!');
  };

  // Database manual inventory update (Properties)
  const handleUpdatePropertyUnits = (propId: string, delta: number) => {
    const updated = properties.map((p) => {
      if (p.id === propId) {
        const newUnits = Math.max(0, p.availableUnits + delta);
        return {
          ...p,
          availableUnits: newUnits,
          statusBadge: newUnits > 0 ? ('Available Now' as const) : ('Waitlist Open' as const),
        };
      }
      return p;
    });
    setProperties(updated);
    LocalDatabase.saveProperties(updated);
  };

  // Room status toggle in Database Inspector (A10)
  const handleToggleRoomStatus = (roomId: string, status: RoomItem['status']) => {
    LocalDatabase.updateRoomStatus(roomId, status);
    setRooms(LocalDatabase.getRooms());
    setProperties(LocalDatabase.getProperties());
    showToast(`Updated status of room to ${status}`);
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

  // When clicking "View Details" on a property card:
  // Navigate directly into the Addendum 01 room selection drill-down!
  const handleViewDetails = (property: RoomProperty) => {
    setSelectedPropertyForDrillDown(property);
  };

  // When student picks a room inside the room selection view:
  const handleSelectSpecificRoom = (room: RoomItem) => {
    const parentProp =
      properties.find((p) => p.id === room.propertyId) || selectedPropertyForDrillDown;
    setModalProperty(parentProp);
    setSelectedRoomForModal(room);
  };

  // Synchronize derived availableUnits on properties from physical rooms
  const syncedProperties = properties.map((p) => {
    const freeRooms = rooms.filter((r) => r.propertyId === p.id && r.status === 'available').length;
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

  // Ensure Card 1 (KTDI) and Card 2 (KSJ) are ordered first on main view
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
        student={CURRENT_STUDENT}
        bookings={bookings}
        waitlist={waitlist}
        unreadCount={2}
        onOpenDatabaseModal={() => setIsDbModalOpen(true)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onResetDatabase={handleResetDatabase}
      />

      {/* Responsive App Canvas: Centered Mobile View on <1024px, Full Multi-Column Viewport on >=1024px */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full">
        <div className="w-full max-w-md lg:max-w-none mx-auto min-h-screen bg-white lg:bg-transparent shadow-2xl lg:shadow-none flex flex-col relative pb-20 lg:pb-10">
          {/* 1. Global Navigation Bar (Sticky Top) */}
          <Navbar
            student={CURRENT_STUDENT}
            bookings={bookings}
            waitlist={waitlist}
            activeTabLabel={activeTabLabel}
            onOpenDatabaseModal={() => setIsDbModalOpen(true)}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
            onResetDatabase={handleResetDatabase}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              setSelectedPropertyForDrillDown(null);
            }}
          />

          {/* Dynamic Main View Switcher based on Active Tab */}
          {activeTab === 'home' && (
            <main className="flex-1 flex flex-col animate-in fade-in duration-150">
              {/* If user is drilling down into a Kolej's available rooms (Addendum 01 Sec. 1 & 6) */}
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

                  {/* 3. Main Content Area: Accommodation Listings (Vertical on Mobile, Multi-Column Grid on Desktop) */}
                  <section className="px-4 lg:px-8 py-4 lg:py-6 max-w-7xl w-full mx-auto space-y-4">
                    {/* Section Title: "Available Accommodations" (Dark gray, bold) */}
                    <div className="flex items-center justify-between">
                      <h1 className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight">
                        Available Accommodations
                      </h1>
                      <span className="text-xs font-semibold text-slate-400">
                        {orderedProperties.length} residences
                      </span>
                    </div>

                    {/* Stacked on mobile, 2-to-3 column responsive grid on desktop */}
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

                  {/* Quick Database & Deployment Action Bar */}
                  <div className="px-4 lg:px-8 py-3 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDbModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200/80 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Test Room-Level Database (Azraf Mahir)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsDeployModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-[#800000] bg-red-50 hover:bg-red-100 transition-colors border border-red-200/80 cursor-pointer"
                    >
                      <Rocket className="w-3.5 h-3.5 text-[#800000]" />
                      <span>Deployment &amp; PWA Instructions</span>
                    </button>
                  </div>
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
                student={CURRENT_STUDENT}
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
                student={CURRENT_STUDENT}
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

          {/* Room Detail Full Modal */}
          <RoomDetailModal
            property={modalProperty}
            room={selectedRoomForModal}
            student={CURRENT_STUDENT}
            onClose={() => {
              setModalProperty(null);
              setSelectedRoomForModal(null);
            }}
            onBookRoom={handleBookRoom}
            onJoinWaitlist={handleJoinWaitlist}
          />

          {/* Course Database Inspector Modal */}
          <DatabaseModal
            isOpen={isDbModalOpen}
            onClose={() => setIsDbModalOpen(false)}
            student={CURRENT_STUDENT}
            properties={syncedProperties}
            rooms={rooms}
            bookings={bookings}
            waitlist={waitlist}
            onUpdatePropertyUnits={handleUpdatePropertyUnits}
            onToggleRoomStatus={handleToggleRoomStatus}
            onResetDatabase={handleResetDatabase}
          />

          {/* Deployment & PWA Instructions Modal */}
          <DeploymentGuideModal
            isOpen={isDeployModalOpen}
            onClose={() => setIsDeployModalOpen(false)}
          />

          {/* Offline Mode Connectivity Banner */}
          <OfflineIndicator />

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-slate-700/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
