export class NotificationService {
  constructor() {
    this.service = null;
  }

  setService(service) {
    this.service = service;
  }

  async requestPermission() {
    if (!this.service) {
      throw new Error('Notification service not initialized');
    }
    return this.service.requestPermission();
  }

  async scheduleNotification(title, body, time) {
    if (!this.service) {
      throw new Error('Notification service not initialized');
    }
    return this.service.scheduleNotification(title, body, time);
  }

  async cancelAllNotifications() {
    if (!this.service) {
      throw new Error('Notification service not initialized');
    }
    return this.service.cancelAllNotifications();
  }
}

export const notificationService = new NotificationService(); 