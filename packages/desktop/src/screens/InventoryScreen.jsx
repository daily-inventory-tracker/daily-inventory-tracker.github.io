import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// Import shared logic
import { dataStorage } from '@shared/DataStorage.js';
import { notificationService } from '@shared/NotificationService.js';
import { inventoryData, InventoryEntry, formatDateForDisplay } from '@shared/index.js';

const InventoryScreen = () => {
  const navigate = useNavigate();
  const [selections, setSelections] = useState(new Array(inventoryData.length).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      const allEntries = await dataStorage.loadData('inventoryEntries') || [];
      const today = dayjs().format('YYYY-MM-DD');
      
      const todayEntry = allEntries.find(entry => entry.date === today);
      if (todayEntry) {
        setSelections(todayEntry.selections);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading today\'s data:', error);
      setIsLoading(false);
    }
  };

  const handleSelection = (index, value) => {
    const newSelections = [...selections];
    newSelections[index] = value;
    setSelections(newSelections);
  };

  const saveInventory = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const today = dayjs().format('YYYY-MM-DD');
      const allEntries = await dataStorage.loadData('inventoryEntries') || [];
      
      // Find existing entry for today
      const existingIndex = allEntries.findIndex(entry => entry.date === today);
      
      if (existingIndex >= 0) {
        // Update existing entry
        allEntries[existingIndex].selections = selections;
        allEntries[existingIndex].timestamp = new Date().toISOString();
      } else {
        // Add new entry
        allEntries.push({
          date: today,
          selections: selections,
          timestamp: new Date().toISOString()
        });
      }

      await dataStorage.saveData('inventoryEntries', allEntries);
      
      setMessage('Inventory saved successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error saving inventory:', error);
      setMessage('Error saving inventory. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getCompletionPercentage = () => {
    const completed = selections.filter(s => s !== null).length;
    return (completed / inventoryData.length) * 100;
  };

  if (isLoading) {
    return <div className="loading">Loading today's inventory...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Today's Inventory - {formatDateForDisplay(dayjs().format('YYYY-MM-DD'))}</h2>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
        <p>
          {selections.filter(s => s !== null).length} of {inventoryData.length} items completed 
          ({Math.round(getCompletionPercentage())}%)
        </p>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      <div className="card">
        <form onSubmit={(e) => { e.preventDefault(); saveInventory(); }}>
          {inventoryData.map((item, index) => (
            <div key={index} className="inventory-item">
              <label>
                <strong>{item[0]}</strong> vs <strong>{item[1]}</strong>
              </label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name={`inventory-${index}`}
                    value="0"
                    checked={selections[index] === 0}
                    onChange={() => handleSelection(index, 0)}
                  />
                  <span>Left ({item[0]})</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name={`inventory-${index}`}
                    value="1"
                    checked={selections[index] === 1}
                    onChange={() => handleSelection(index, 1)}
                  />
                  <span>Right ({item[1]})</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name={`inventory-${index}`}
                    value="2"
                    checked={selections[index] === 2}
                    onChange={() => handleSelection(index, 2)}
                  />
                  <span>Neutral</span>
                </label>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button 
              type="submit" 
              className="btn" 
              disabled={isSaving}
              style={{ marginRight: '15px' }}
            >
              {isSaving ? 'Saving...' : 'Save Inventory'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryScreen; 