import { Component, ElementRef, Input, ViewChild, signal } from '@angular/core';
import { Icon } from '../Icon/Icon.component';
import { NotificationItem } from './NotificationItem/NotificationItem.component';
import { Notification, NotificationsService } from 'src/app/Services/NotificationsService';
import { Time } from 'src/app/Utils/Time';
import CacheService from 'src/app/Services/CacheService';

export enum NotificationType {
  USER_NOTIFICATION,
  BUSINESS_NOTIFICATION
}

@Component({
  selector: 'NotificationsPanel',
  standalone: true,
  imports: [Icon, NotificationItem],
  templateUrl: './NotificationsPanel.component.html',
})
export class NotificationsPanel {
  Time = Time;
  NotificationType = NotificationType;
  ParseInt = parseInt;
  @ViewChild('notificationWrapper') notificationWrapper! : ElementRef<HTMLElement>; 
  @ViewChild('notification') notification! : ElementRef<HTMLElement>;
  @ViewChild('bottomBorder') bottomBorder! : ElementRef<HTMLElement>;
  @Input() type = NotificationType.USER_NOTIFICATION;
  protected visible = signal(false);
  notifications: Notification[] | null = null;

  constructor(private notificationsService : NotificationsService, private cacheService : CacheService) {
    document.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest("#notification-panel") && !(e.target as HTMLElement).closest("#notification-button")) {
        this.visible.set(false)
      }
    })
  }

  async ToggleVisibility() {
    this.visible.set(!this.visible())
    if (this.visible()) {
      let notifications : Notification[] = [];
      if (this.type === NotificationType.USER_NOTIFICATION) {
        notifications = await this.notificationsService.GetUserNotifications();
        for (let i = 0; i < notifications.length; i++) {
          if (notifications[i].wasVisualized === false) {
            this.notificationsService.MarkUserNotificationsAsRead();
            break;
          }
        }
      }
      else {
        notifications = await this.notificationsService.GetBusinessNotifications();
        for (let i = 0; i < notifications.length; i++) {
          if (notifications[i].wasVisualized === false) {
            this.notificationsService.MarkBusinessNotificationsAsRead();
            break;
          }
        }
      }
      this.notifications = notifications;
    }
  }

  IsVisible() {
    return this.visible()
  }

  async OnNotificationClose(target : NotificationItem) {
    const id = target.notificationId;
    let result = false;
    if (this.type === NotificationType.USER_NOTIFICATION)
      result = await this.notificationsService.DeleteUserNotification(id);
    else
      result = await this.notificationsService.DeleteBusinessNotification(id);

    if (result && this.notifications) {
      for (let i  = 0; i < this.notifications.length; i++) {
        if (this.notifications[i].id === id) {
          this.notifications.splice(i, 1);
          break;
        }
      }
    }
  }
}
