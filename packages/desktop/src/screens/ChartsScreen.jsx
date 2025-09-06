import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Import shared logic
import {
  dataStorage,
  inventoryData,
  InventoryEntry,
  getChartData,
  getAverageChartData,
  formatDateForDisplay,
} from 'dailyinventory-shared';

const ChartsScreen = () => {
  const [allEntries, setAllEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('completion');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const entries = await dataStorage.loadData('inventoryEntries') || [];
      const inventoryEntries = entries.map(entry => 
        new InventoryEntry(entry.date, entry.selections)
      );
      setAllEntries(inventoryEntries);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading chart data:', error);
      setIsLoading(false);
    }
  };

  const getCompletionTrendData = () => {
    if (!allEntries || allEntries.length === 0) return [];

    return allEntries.slice(-30).map(entry => ({
      date: formatDateForDisplay(entry.date).split(',')[0], // Just the day
      completion: Math.round(entry.getCompletionPercentage()),
      completed: entry.isComplete() ? 1 : 0,
    }));
  };

  const getItemTrendData = () => {
    if (!allEntries || allEntries.length === 0) return [];

    const recentEntries = allEntries.slice(-7); // Last 7 days
    const itemTrends = inventoryData.map((item, index) => {
      const validEntries = recentEntries.filter(entry => 
        entry.selections[index] !== null && entry.selections[index] !== undefined
      );
      
      if (validEntries.length === 0) return { name: item[0].substring(0, 15) + '...', average: 0 };
      
      const sum = validEntries.reduce((acc, entry) => acc + entry.selections[index], 0);
      const average = Math.round((sum / validEntries.length) * 100) / 100;
      
      return {
        name: item[0].substring(0, 15) + '...',
        average: average,
        fullName: item[0]
      };
    });

    return itemTrends.sort((a, b) => b.average - a.average).slice(0, 10); // Top 10
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return <div className="loading">Loading charts...</div>;
  }

  if (allEntries.length === 0) {
    return (
      <div className="card">
        <h2>Progress Charts</h2>
        <p>No data available yet. Start your daily inventory to see your progress charts.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Progress Charts</h2>
        <p>Visualize your daily inventory progress and trends over time.</p>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            className={`btn ${selectedChart === 'completion' ? '' : 'btn-secondary'}`}
            onClick={() => setSelectedChart('completion')}
            style={{ marginRight: '10px' }}
          >
            Completion Overview
          </button>
          <button 
            className={`btn ${selectedChart === 'trends' ? '' : 'btn-secondary'}`}
            onClick={() => setSelectedChart('trends')}
            style={{ marginRight: '10px' }}
          >
            Completion Trends
          </button>
          <button 
            className={`btn ${selectedChart === 'items' ? '' : 'btn-secondary'}`}
            onClick={() => setSelectedChart('items')}
          >
            Item Analysis
          </button>
        </div>
      </div>

      {selectedChart === 'completion' && (
        <>
          <div className="chart-container">
            <h3>Completion Overview</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={getChartData(allEntries).datasets[0].data.map((value, index) => ({
                    name: getChartData(allEntries).labels[index],
                    value: value
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getChartData(allEntries).datasets[0].data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Average Scores by Item</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getAverageChartData(allEntries).datasets[0].data.map((value, index) => ({
                name: getAverageChartData(allEntries).labels[index],
                average: value
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {selectedChart === 'trends' && (
        <div className="chart-container">
          <h3>Completion Trends (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getCompletionTrendData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completion" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Completion %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedChart === 'items' && (
        <div className="chart-container">
          <h3>Top Items by Average Score (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getItemTrendData()} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 2]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="average" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h3>Summary Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{allEntries.length}</div>
            <div className="stat-label">Total Entries</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {allEntries.filter(entry => entry.isComplete()).length}
            </div>
            <div className="stat-label">Completed Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Math.round((allEntries.filter(entry => entry.isComplete()).length / allEntries.length) * 100)}%
            </div>
            <div className="stat-label">Completion Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Math.round(allEntries.reduce((acc, entry) => acc + entry.getCompletionPercentage(), 0) / allEntries.length)}%
            </div>
            <div className="stat-label">Average Completion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsScreen; 