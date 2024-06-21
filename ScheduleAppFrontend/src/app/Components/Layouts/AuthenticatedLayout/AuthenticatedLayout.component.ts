import { AfterViewInit, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import AuthService from 'src/app/Services/AuthService';
import { AppLogo } from '../../AppLogo/AppLogo.component';
import { UserMenu } from '../../UserMenu/UserMenu.component';
import { Icon } from '../../Icon/Icon.component';
import CacheService from 'src/app/Services/CacheService';

@Component({
  selector: 'AuthenticatedLayout',
  standalone: true,
  imports: [AppLogo, UserMenu, Icon],
  templateUrl: './AuthenticatedLayout.component.html',
})
export class AuthenticatedLayout implements AfterViewInit {
  hasNotifications = signal(false);

  public constructor(private router : Router, protected authService : AuthService) {}

  async ngAfterViewInit(): Promise<void> {
  }
  
  async Logout() {
    await this.authService.Logout();
    this.router.navigate(['login']);
  }

  GoToBusinesses() {
    this.router.navigate(['businesses']);
  }

  GoToHome() {
    this.router.navigate(['home']);
  }

  GoToProfile() {
    this.router.navigate(['profile']);
  }
}
