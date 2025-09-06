import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Import shared logic
import { dataStorage } from '@shared/DataStorage.js';
import { notificationService } from '@shared/NotificationService.js';
import { inventoryData } from '@shared/index.js';

// Import services
import { DesktopStorageService } from './services/StorageService.jsx';
import { DesktopNotificationService } from './services/NotificationService.jsx';

// Import screens
import HomeScreen from './screens/HomeScreen.jsx';
import InventoryScreen from './screens/InventoryScreen.jsx';
import ChartsScreen from './screens/ChartsScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';

// Navigation component
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/inventory', label: 'Today\'s Inventory' },
    { path: '/charts', label: 'Progress Charts' },
    { path: '/settings', label: 'Settings' }
  ];

  return (
    <nav className="nav">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const AppContent = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage service
        const storageService = new DesktopStorageService();
        dataStorage.setStorage(storageService);

        // Initialize notification service
        const notificationServiceInstance = new DesktopNotificationService();
        notificationService.setService(notificationServiceInstance);

        // Listen for new day events from menu
        if (window.electronAPI) {
          window.electronAPI.onNewDay(() => {
            // Navigate to inventory screen for new day
            window.location.href = '/inventory';
          });
        }

        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsReady(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <div className="app">
        <div className="loading">Loading Daily Inventory...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Daily Inventory</h1>
      </header>
      <Navigation />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/inventory" element={<InventoryScreen />} />
          <Route path="/charts" element={<ChartsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App; 