// Core inventory data structure
export const inventoryData = [
  ['Selfish and Self-Seeking', 'Interest in Others'],
  ['Dishonest', 'Honest'],
  ['Frightened', 'Courage'],
  ['Inconsiderate', 'Considerate'],
  ['Prideful', 'humility-Seek God\'s Will'],
  ['Greedy', 'Giving and Sharing'],
  ['Lustful', 'Doing for Others'],
  ['Anger', 'Calm'],
  ['Envy', 'Grateful'],
  ['Sloth', 'Take Action'],
  ['Gluttony', 'Moderation'],
  ['Impatient', 'Patience'],
  ['Intolerant', 'Tolerance'],
  ['Resentment', 'Forgiveness'],
  ['Hate', 'Love & Concern for Others'],
  ['Harmful Acts', 'Good Deeds'],
  ['Self-Pity', 'Self-Forgiveness'],
  ['Self-Justification', 'Humility-Seek God\'s Will'],
  ['Self-Importance', 'Modesty'],
  ['Self-Condemnation', 'Self-Forgiveness'],
  ['Suspicion', 'Trust'],
  ['Doubt', 'Faith'],
  ['HOW DO YOU FEEL?', 'HOW YOU FEEL?'],
  ['Restless, Irritable, Guilt, Shame, Discontent', 'Peaceful, Serene, Loving, Content'],
];

// Data models
export class InventoryEntry {
  constructor(date, selections = []) {
    this.date = date;
    this.selections = selections;
    this.timestamp = new Date().toISOString();
  }

  getCompletedCount() {
    return this.selections.filter(selection => selection !== null).length;
  }

  getTotalCount() {
    return inventoryData.length;
  }

  getCompletionPercentage() {
    return (this.getCompletedCount() / this.getTotalCount()) * 100;
  }

  isComplete() {
    return this.getCompletedCount() === this.getTotalCount();
  }
}

// Chart data utilities
export const getChartData = (allData) => {
  if (!allData || allData.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [{
        data: [1],
        backgroundColor: ['#e9ecef'],
        borderColor: ['#dee2e6'],
        borderWidth: 1,
      }],
    };
  }

  const completedCount = allData.filter(entry => entry.isComplete()).length;
  const incompleteCount = allData.length - completedCount;

  return {
    labels: ['Completed', 'Incomplete'],
    datasets: [{
      data: [completedCount, incompleteCount],
      backgroundColor: ['#28a745', '#dc3545'],
      borderColor: ['#1e7e34', '#c82333'],
      borderWidth: 1,
    }],
  };
};

export const getAverageChartData = (allData) => {
  if (!allData || allData.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [{
        data: [1],
        backgroundColor: ['#e9ecef'],
        borderColor: ['#dee2e6'],
        borderWidth: 1,
      }],
    };
  }

  // Calculate averages for each inventory item
  const averages = inventoryData.map((item, index) => {
    const validEntries = allData.filter(entry => 
      entry.selections[index] !== null && entry.selections[index] !== undefined
    );
    
    if (validEntries.length === 0) return 0;
    
    const sum = validEntries.reduce((acc, entry) => acc + entry.selections[index], 0);
    return Math.round((sum / validEntries.length) * 100) / 100;
  });

  const labels = inventoryData.map(item => item[0].substring(0, 20) + '...');

  return {
    labels,
    datasets: [{
      label: 'Average Score',
      data: averages,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };
};

// Date utilities
export const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getDateRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Re-export DataStorage and NotificationService
export { DataStorage, dataStorage } from './DataStorage';
export { NotificationService, notificationService } from './NotificationService'; 