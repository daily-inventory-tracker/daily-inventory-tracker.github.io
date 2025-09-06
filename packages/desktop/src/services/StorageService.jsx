export class DesktopStorageService {
  constructor() {
    // This service will use the Electron IPC bridge
  }

  async saveData(key, data) {
    try {
      if (window.electronAPI) {
        return await window.electronAPI.saveData(key, data);
      } else {
        // Fallback to localStorage for web development
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      }
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }

  async loadData(key) {
    try {
      if (window.electronAPI) {
        return await window.electronAPI.loadData(key);
      } else {
        // Fallback to localStorage for web development
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  async deleteData(key) {
    try {
      if (window.electronAPI) {
        return await window.electronAPI.deleteData(key);
      } else {
        // Fallback to localStorage for web development
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  }

  async getAllData() {
    try {
      if (window.electronAPI) {
        // For Electron, we'll need to get all keys and load them
        // This is a simplified version - in a real app you might want to expose getAllData via IPC
        const inventoryEntries = await this.loadData('inventoryEntries') || [];
        const settings = await this.loadData('settings') || {};
        return { inventoryEntries, settings };
      } else {
        // Fallback to localStorage for web development
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            data[key] = JSON.parse(localStorage.getItem(key));
          }
        }
        return data;
      }
    } catch (error) {
      console.error('Error getting all data:', error);
      throw error;
    }
  }

  async clearAllData() {
    try {
      if (window.electronAPI) {
        // Clear main data keys
        await this.deleteData('inventoryEntries');
        await this.deleteData('settings');
        return true;
      } else {
        // Fallback to localStorage for web development
        localStorage.clear();
        return true;
      }
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
} 