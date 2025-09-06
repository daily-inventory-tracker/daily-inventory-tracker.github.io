export class DataStorage {
  constructor() {
    this.storage = null;
  }

  setStorage(storage) {
    this.storage = storage;
  }

  async saveData(key, data) {
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }
    return this.storage.saveData(key, data);
  }

  async loadData(key) {
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }
    return this.storage.loadData(key);
  }

  async deleteData(key) {
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }
    return this.storage.deleteData(key);
  }
}

export const dataStorage = new DataStorage(); 