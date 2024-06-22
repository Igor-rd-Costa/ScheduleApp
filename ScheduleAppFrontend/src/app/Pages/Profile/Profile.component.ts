import { Component, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { NotificationType, NotificationsPanel } from 'src/app/Components/NotificationsPanel/NotificationsPanel.component';
import AuthService, { User } from 'src/app/Services/AuthService';
import BusinessService, { Business } from 'src/app/Services/BusinessService';

@Component({
  selector: 'Profile',
  standalone: true,
  imports: [Icon, MainButton, NotificationsPanel],
  templateUrl: './Profile.component.html',
})
export class Profile {
  NotificationType = NotificationType;
  @ViewChild(NotificationsPanel) notificationsPanel! : NotificationsPanel
  user = signal<User|null>(null);
  business = signal<Business|null|undefined>(undefined)

  public constructor(protected authService : AuthService, private router : Router) {
    this.user.set(this.authService.GetLoggedUser())
    this.business.set(this.authService.GetLoggedBusiness())
  }

  Logout() {
    this.authService.Logout().then(() => {
      this.router.navigate(['login']);
    });
  }

  GoToHistory() {
    this.router.navigate(['history']);
  }

  GoToBusiness() {
    this.router.navigate(['business']);
  }

  ToggleNotificationsDisplay() {
    this.notificationsPanel.ToggleVisibility();
    if (this.notificationsPanel.IsVisible()) {
      this.user.update(u => {
        if (u)
          u.hasUnseenNotifications = false;
        return u;
      });
    }
  }
}
