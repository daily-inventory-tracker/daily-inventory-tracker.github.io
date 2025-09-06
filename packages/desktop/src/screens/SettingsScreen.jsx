import React, { useState, useEffect } from 'react';

// Import shared logic
import {
  dataStorage,
  notificationService,
} from 'dailyinventory-shared';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    reminderTime: '20:00',
    theme: 'light',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [dataStats, setDataStats] = useState({
    totalEntries: 0,
    dataSize: '0 KB',
  });

  useEffect(() => {
    loadSettings();
    loadDataStats();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await dataStorage.loadData('settings');
      if (savedSettings) {
        setSettings({ ...settings, ...savedSettings });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setIsLoading(false);
    }
  };

  const loadDataStats = async () => {
    try {
      const allEntries = await dataStorage.loadData('inventoryEntries') || [];
      const allData = await dataStorage.getAllData();
      const dataSize = JSON.stringify(allData).length;
      
      setDataStats({
        totalEntries: allEntries.length,
        dataSize: `${Math.round(dataSize / 1024)} KB`,
      });
    } catch (error) {
      console.error('Error loading data stats:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      await dataStorage.saveData('settings', settings);
      
      // Update notification settings
      if (settings.notifications) {
        await notificationService.requestPermission();
      }
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const exportData = async () => {
    try {
      const allData = await dataStorage.getAllData();
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `daily-inventory-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      setMessage('Data exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage('Error exporting data. Please try again.');
    }
  };

  const importData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure
      if (!data.inventoryEntries || !Array.isArray(data.inventoryEntries)) {
        throw new Error('Invalid data format');
      }
      
      // Clear existing data and import new data
      await dataStorage.clearAllData();
      
      for (const [key, value] of Object.entries(data)) {
        await dataStorage.saveData(key, value);
      }
      
      await loadDataStats();
      setMessage('Data imported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error importing data:', error);
      setMessage('Error importing data. Please check the file format.');
    }
  };

  const clearAllData = async () => {
    if (!window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    try {
      await dataStorage.clearAllData();
      await loadDataStats();
      setMessage('All data cleared successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error clearing data:', error);
      setMessage('Error clearing data. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Settings</h2>
        <p>Configure your Daily Inventory app preferences and manage your data.</p>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      <div className="card">
        <h3>Notifications</h3>
        <div className="form-group">
          <label className="radio-option">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            />
            <span>Enable daily reminders</span>
          </label>
        </div>
        
        {settings.notifications && (
          <div className="form-group">
            <label>Reminder Time</label>
            <input
              type="time"
              className="form-control"
              value={settings.reminderTime}
              onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="card">
        <h3>Appearance</h3>
        <div className="form-group">
          <label>Theme</label>
          <select
            className="form-control"
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h3>Data Management</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{dataStats.totalEntries}</div>
            <div className="stat-label">Total Entries</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{dataStats.dataSize}</div>
            <div className="stat-label">Data Size</div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button className="btn" onClick={exportData} style={{ marginRight: '15px' }}>
            Export Data
          </button>
          
          <label className="btn btn-secondary" style={{ marginRight: '15px' }}>
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </label>
          
          <button className="btn btn-secondary" onClick={clearAllData}>
            Clear All Data
          </button>
        </div>
      </div>

      <div className="card">
        <h3>About</h3>
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Description:</strong> Daily Inventory - Track your daily spiritual inventory</p>
        <p>
          This app helps you maintain awareness of your character defects and spiritual progress 
          through daily reflection and tracking.
        </p>
      </div>

      <div className="card">
        <button 
          className="btn" 
          onClick={saveSettings}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen; 