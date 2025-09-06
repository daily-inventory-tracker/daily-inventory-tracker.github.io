import { Notification } from 'electron';

export class DesktopNotificationService {
  constructor() {
    this.hasPermission = false;
    this.checkPermission();
  }

  checkPermission() {
    // Check if we're in Electron environment
    if (window.electronAPI) {
      this.hasPermission = true;
    } else {
      // For web development, check browser notification permission
      this.hasPermission = Notification.permission === 'granted';
    }
  }

  async requestPermission() {
    try {
      if (window.electronAPI) {
        // Electron notifications don't require explicit permission
        this.hasPermission = true;
        return true;
      } else {
        // For web development, request browser notification permission
        const permission = await Notification.requestPermission();
        this.hasPermission = permission === 'granted';
        return this.hasPermission;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async scheduleNotification(title, body, time) {
    if (!this.hasPermission) {
      console.warn('Notifications not permitted');
      return false;
    }

    try {
      const scheduledTime = new Date(time);
      const now = new Date();
      const delay = scheduledTime.getTime() - now.getTime();

      if (delay > 0) {
        setTimeout(() => {
          this.showNotification(title, body);
        }, delay);
      } else {
        // If time has passed, show immediately
        this.showNotification(title, body);
      }

      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  showNotification(title, body) {
    if (!this.hasPermission) {
      return;
    }

    try {
      if (window.electronAPI) {
        // For Electron, we'll use a simple alert for now
        // In a real app, you'd want to use Electron's native notification API
        alert(`${title}\n${body}`);
      } else {
        // For web development, use browser notifications
        new Notification(title, {
          body: body,
          icon: '/assets/images/icons/icon-32x32.png',
          silent: false
        });
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async showImmediateNotification(title, body) {
    return this.showNotification(title, body);
  }

  async cancelAllNotifications() {
    // This would need to be implemented with a proper scheduling system
    console.log('Cancelling all notifications');
  }
} 