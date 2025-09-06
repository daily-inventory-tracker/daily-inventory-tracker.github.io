import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// Import shared logic
import { dataStorage } from '@shared/DataStorage.js';
import { notificationService } from '@shared/NotificationService.js';
import { inventoryData, InventoryEntry } from '@shared/index.js';
import {
  formatDateForDisplay,
} from 'dailyinventory-shared';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [todayEntry, setTodayEntry] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allEntries = await dataStorage.loadData('inventoryEntries') || [];
      const today = dayjs().format('YYYY-MM-DD');
      
      // Find today's entry
      const todayData = allEntries.find(entry => entry.date === today);
      if (todayData) {
        setTodayEntry(new InventoryEntry(todayData.date, todayData.selections));
      }

      // Get recent entries (last 7 days)
      const recent = allEntries
        .slice(-7)
        .map(entry => new InventoryEntry(entry.date, entry.selections))
        .reverse();
      setRecentEntries(recent);

      // Calculate stats
      const totalDays = allEntries.length;
      const completedDays = allEntries.filter(entry => 
        entry.selections.filter(s => s !== null).length === inventoryData.length
      ).length;

      // Calculate streaks
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      for (let i = allEntries.length - 1; i >= 0; i--) {
        const entry = allEntries[i];
        const isComplete = entry.selections.filter(s => s !== null).length === inventoryData.length;
        
        if (isComplete) {
          tempStreak++;
          if (i === allEntries.length - 1) {
            currentStreak = tempStreak;
          }
        } else {
          if (tempStreak > bestStreak) {
            bestStreak = tempStreak;
          }
          tempStreak = 0;
        }
      }

      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }

      setStats({
        totalDays,
        completedDays,
        currentStreak,
        bestStreak,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const startNewDay = () => {
    navigate('/inventory');
  };

  const continueToday = () => {
    navigate('/inventory');
  };

  const viewCharts = () => {
    navigate('/charts');
  };

  return (
    <div>
      <div className="card">
        <h2>Welcome to Daily Inventory</h2>
        <p>
          Track your daily spiritual inventory to maintain awareness of your character defects 
          and spiritual progress. Take time each day to reflect on these important aspects of your life.
        </p>
        
        {todayEntry ? (
          <div className="card">
            <h3>Today's Progress</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${todayEntry.getCompletionPercentage()}%` }}
              />
            </div>
            <p>
              {todayEntry.getCompletedCount()} of {todayEntry.getTotalCount()} items completed 
              ({Math.round(todayEntry.getCompletionPercentage())}%)
            </p>
            <button className="btn" onClick={continueToday}>
              Continue Today's Inventory
            </button>
          </div>
        ) : (
          <div className="card">
            <h3>Ready to Start Your Day?</h3>
            <p>Begin your daily inventory to track your spiritual progress.</p>
            <button className="btn" onClick={startNewDay}>
              Start Today's Inventory
            </button>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalDays}</div>
          <div className="stat-label">Total Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completedDays}</div>
          <div className="stat-label">Completed Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.bestStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      {recentEntries.length > 0 && (
        <div className="card">
          <h3>Recent Activity</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {recentEntries.map((entry, index) => (
              <div key={index} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{formatDateForDisplay(entry.date)}</span>
                <span style={{ 
                  color: entry.isComplete() ? '#28a745' : '#6c757d',
                  fontWeight: 'bold'
                }}>
                  {entry.getCompletedCount()}/{entry.getTotalCount()}
                </span>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={viewCharts} style={{ marginTop: '15px' }}>
            View Detailed Charts
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeScreen; 