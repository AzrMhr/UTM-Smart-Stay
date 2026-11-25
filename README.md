# UTM SMART STAY MEMBER

> **Project:** SCSE2243 Application Development Project I (UTM MJIIT) — Centralized Student Accommodation & Community Platform  
> **Portals:** Student Marketplace (`/`) · Housing Management Admin (`/admin`) · System Administrator Console (`/sysadmin`)

---

### SUBSYSTEM 1 : AZRAF MAHIR

<table>
  <thead>
    <tr>
      <th align="center">Sprint</th>
      <th align="center">Module</th>
      <th align="center">FrontEnd</th>
      <th align="center">BackEnd</th>
      <th align="center">Database</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">1</td>
      <td>User Registration, Login &amp; Student Dashboard Module</td>
      <td>
        <ul>
          <li><a href="./src/components/StudentAuthModal.tsx">Student Login &amp; OTP Modal</a></li>
          <li><a href="./src/App.tsx">Main Dashboard &amp; Portal Router</a></li>
          <li><a href="./src/components/Navbar.tsx">Global Navigation Bar</a></li>
          <li><a href="./src/components/DesktopSidebar.tsx">Desktop Floating Dock</a></li>
          <li><a href="./src/components/BottomNav.tsx">Mobile Bottom Navigation Bar</a></li>
          <li><a href="./src/components/DynamicActivityPanel.tsx">Live Campus Updates Panel</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/App.tsx">Portal &amp; Auth State Controller</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/types/index.ts">User &amp; Portal Schema</a></li>
          <li><a href="./src/data/database.ts">User Database</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">2</td>
      <td>Progressive Web App (PWA) &amp; Deployment Module</td>
      <td>
        <ul>
          <li><a href="./src/components/PWAInstallButton.tsx">PWA Install Prompt Button</a></li>
          <li><a href="./src/components/OfflineIndicator.tsx">Offline Status Banner</a></li>
          <li><a href="./index.html">App Shell &amp; Manifest Entry</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/hooks/usePWAInstall.ts">PWA Install Hook</a></li>
          <li><a href="./src/hooks/useOnlineStatus.ts">Network Status Hook</a></li>
          <li><a href="./vite.config.ts">Service Worker &amp; Build Config</a></li>
          <li><a href="./vercel.json">Vercel SPA Routing Config</a></li>
          <li><a href="./public/404.html">GitHub Pages SPA Fallback</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/data/database.ts">Offline Persistence Store</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---

### SUBSYSTEM 2 : Tanjim Arup

<table>
  <thead>
    <tr>
      <th align="center">Sprint</th>
      <th align="center">Module</th>
      <th align="center">FrontEnd</th>
      <th align="center">BackEnd</th>
      <th align="center">Database</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">1</td>
      <td>Multi-Campus Search, Listing &amp; Campus Map Module</td>
      <td>
        <ul>
          <li><a href="./src/components/SearchFilter.tsx">Campus Search &amp; Filter Bar</a></li>
          <li><a href="./src/components/AccommodationCard.tsx">Accommodation Property Card</a></li>
          <li><a href="./src/components/CampusMapView.tsx">Interactive Campus Map Page</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/App.tsx">Campus Filter &amp; Sort Controller</a></li>
          <li><a href="./src/data/database.ts">Wishlist &amp; Inventory Sync</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/types/index.ts">Property &amp; POI Schema</a></li>
          <li><a href="./src/data/database.ts">Properties &amp; POIs Database</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">2</td>
      <td>Room-Level Selection, 15-Min Hold &amp; Booking Module</td>
      <td>
        <ul>
          <li><a href="./src/components/RoomSelectionView.tsx">Floor &amp; Unit Room Selection Page</a></li>
          <li><a href="./src/components/RoomDetailModal.tsx">Room Detail &amp; Booking Modal</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/data/database.ts">Atomic Room Booking Controller</a></li>
          <li><a href="./src/data/database.ts">Waitlist Queue Controller</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/types/index.ts">Rooms &amp; Bookings Schema</a></li>
          <li><a href="./src/data/database.ts">Rooms, Bookings &amp; Waitlist Database</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---

### SUBSYSTEM 3 : Yahya Waleed

<table>
  <thead>
    <tr>
      <th align="center">Sprint</th>
      <th align="center">Module</th>
      <th align="center">FrontEnd</th>
      <th align="center">BackEnd</th>
      <th align="center">Database</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">1</td>
      <td>Student Community Board, Roommates &amp; Carpool Module</td>
      <td>
        <ul>
          <li><a href="./src/components/CommunitySection.tsx">Community Hub Preview Section</a></li>
          <li><a href="./src/components/CommunityView.tsx">Community, Roommate &amp; Carpool Page</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/App.tsx">Roommate &amp; Carpool Controller</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/types/index.ts">Community &amp; Carpool Schema</a></li>
          <li><a href="./src/data/database.ts">Community Listings Database</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">2</td>
      <td>Student Inquiries &amp; Housing Messaging Module</td>
      <td>
        <ul>
          <li><a href="./src/components/MessagesView.tsx">Housing Messages &amp; Chat Page</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/App.tsx">Messaging Thread Controller</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/types/index.ts">Message Thread Schema</a></li>
          <li><a href="./src/data/database.ts">Messages Database</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---

### SUBSYSTEM 4 : AbdulKarim Malek

<table>
  <thead>
    <tr>
      <th align="center">Sprint</th>
      <th align="center">Module</th>
      <th align="center">FrontEnd</th>
      <th align="center">BackEnd</th>
      <th align="center">Database</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">1</td>
      <td>Housing Management Admin Portal (<code>/admin</code>) Module</td>
      <td>
        <ul>
          <li><a href="./src/components/AdminPortal.tsx">Housing Admin Dashboard Page</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/data/database.ts">Room Status &amp; Bulk Generator</a></li>
          <li><a href="./src/data/database.ts">Pricing &amp; Booking Manager</a></li>
          <li><a href="./src/data/database.ts">Waitlist Promotion Controller</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/types/index.ts">Admin &amp; Inventory Schema</a></li>
          <li><a href="./src/data/database.ts">Central Housing Database</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">2</td>
      <td>System Administrator Console (<code>/sysadmin</code>) &amp; Audit Module</td>
      <td>
        <ul>
          <li><a href="./src/components/SysAdminPortal.tsx">System Admin Console Page</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/components/SysAdminPortal.tsx">Concurrency Lock Race Tester</a></li>
          <li><a href="./src/data/database.ts">CSV/JSON Snapshot &amp; DB Reset Engine</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="./src/types/index.ts">Audit Log Schema</a></li>
          <li><a href="./src/data/database.ts">Audit Logs &amp; Raw Table Store</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---

## Quick Start &amp; Packaging

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Typecheck and build production bundle (dist/)
npm run lint
npm run build
```

See <a href="./DEPLOYMENT.md">DEPLOYMENT.md</a> for demo credentials, portal routes (`/`, `/admin`, `/sysadmin`), and Vercel / GitHub Pages deployment instructions.
