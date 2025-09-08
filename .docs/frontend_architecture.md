# Frontend Architecture

This document outlines the frontend architecture, components, and implementation details for the Epic Isolator platform.

## 1. Technology Stack

* **Framework**: React.js
* **Routing**: React Router
* **UI Components**: Custom components inspired by Umbrel OS
* **State Management**: React Context API / Redux (TBD)
* **Styling**: CSS Modules / Styled Components (TBD)

## 2. Component Structure

### 2.1 Main Layout Components
* **AppShell** - Main application container
  * Header (with branding, dark/light toggle, logout)
  * Sidebar (collapsible)
  * MainContent (routes container)
  * Footer

### 2.2 Page Components
* **LoginPage** - User authentication
* **DashboardPage** - Grid view of installed applications
* **InstallPage** - App installation wizard
* **AppDetailsPage** - Detailed view of a single app

### 2.3 Feature Components
* **AppGrid** - Grid display of installed applications
  * AppCard - Individual application card
  * ContextMenu - App action menu
* **InstallWizard** - Multi-step installation process
  * FileUploader - For .deb uploads
  * AdvancedOptions - For container configuration
* **ResourceMonitor** - Real-time CPU/RAM charts
  * SystemUsage - Overall system metrics
  * AppUsageList - Per-app resource consumption

### 2.4 Shared Components
* **Button** - Standard button styles
* **Modal** - Popup dialogs
* **Spinner** - Loading indicators
* **Notification** - Toast messages for errors/success
* **ThemeToggle** - Dark/light mode switcher

## 3. State Management

### 3.1 Global State
* Authentication state
* Theme preferences
* System resources

### 3.2 App State
* Installed applications list
* Application status
* Resource usage metrics

### 3.3 Installation State
* Upload progress
* Installation stages
* Logs/output

## 4. API Integration

* RESTful API calls via fetch/axios
* Authentication header injection
* Error handling and retries

## 5. UI/UX Guidelines

### 5.1 Layout
* Fixed-size grid for app cards
* Responsive sidebar (collapsible)
* Consistent padding and spacing

### 5.2 Interaction Patterns
* App context menu on right-click/long-press
* Scroll-to-bottom logs view
* Progress indicators for installations

### 5.3 Theme
* Dark/light mode toggle
* Color palette inspired by Umbrel OS
* Consistent iconography

## 6. File Hierarchy

```
src/
├── assets/
│   ├── icons/
│   └── images/
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   └── MainContent.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── InstallPage.jsx
│   │   └── AppDetailsPage.jsx
│   ├── features/
│   │   ├── app-grid/
│   │   │   ├── AppGrid.jsx
│   │   │   ├── AppCard.jsx
│   │   │   └── ContextMenu.jsx
│   │   ├── install-wizard/
│   │   │   ├── InstallWizard.jsx
│   │   │   ├── FileUploader.jsx
│   │   │   └── AdvancedOptions.jsx
│   │   └── resource-monitor/
│   │       ├── ResourceMonitor.jsx
│   │       ├── SystemUsage.jsx
│   │       └── AppUsageList.jsx
│   └── shared/
│       ├── Button.jsx
│       ├── Modal.jsx
│       ├── Spinner.jsx
│       ├── Notification.jsx
│       └── ThemeToggle.jsx
├── contexts/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── AppContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useTheme.js
│   └── useApi.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── storage.js
├── styles/
│   ├── variables.css
│   ├── global.css
│   └── themes/
│       ├── dark.css
│       └── light.css
├── utils/
│   ├── formatters.js
│   └── validators.js
├── App.jsx
├── index.jsx
└── routes.jsx
```

## 7. Detailed Layout Specifications

### 7.1 Layout Dimensions

* **Viewport**: Optimized for desktop (min-width: 1024px)
* **Grid System**: 12-column layout with 16px gutters
* **Container Width**: Max-width of 1440px, centered
* **Sidebar Width**: 280px (expanded), 60px (collapsed)
* **Header Height**: 64px fixed
* **Footer Height**: 40px fixed
* **App Card Size**: 180px × 220px fixed size

### 7.2 UI Element Positioning

* **Header**
  * Position: Fixed top, full width
  * Logo: Top-left, 32px left padding
  * Theme Toggle: Top-right, 16px right margin
  * Logout Button: Top-right, 16px right margin after theme toggle

* **Sidebar**
  * Position: Fixed left, full height minus header
  * Toggle: Top-left, 16px margin
  * Resource Graphs: Stacked vertically, 16px padding
  * App List: Below graphs, scrollable

* **Dashboard Grid**
  * Position: Center area, 32px padding from all edges
  * Grid Layout: 4 columns on large screens, responsive
  * App Spacing: 24px between cards
  * Install Button: Fixed bottom-right, 32px margin

* **Modal Dialogs**
  * Position: Centered, 50% width (min 400px, max 800px)
  * Header: 56px height with close button on right
  * Footer: 64px height with action buttons right-aligned

* **Notifications**
  * Position: Top-right, 16px from top/right edges
  * Width: 320px maximum
  * Stack: Newest on top, 8px spacing between

### 7.3 Responsive Behavior

* **Desktop** (1024px+): Full layout with expanded sidebar
* **Tablet** (768px-1024px): Collapsed sidebar, 3-column app grid
* **Mobile** (<768px): Hidden sidebar (toggle to show), 1-column app grid
