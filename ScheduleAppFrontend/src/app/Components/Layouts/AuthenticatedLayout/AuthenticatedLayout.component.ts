import { AfterViewInit, Component, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import AuthService from 'src/app/Services/AuthService';
import { AppLogo } from '../../AppLogo/AppLogo.component';
import { UserMenu } from '../../UserMenu/UserMenu.component';
import { Icon } from '../../Icon/Icon.component';
import CacheService from 'src/app/Services/CacheService';
import { ProfileMenu } from './ProfileMenu/ProfileMenu.component';

@Component({
  selector: 'AuthenticatedLayout',
  standalone: true,
  imports: [AppLogo, UserMenu, Icon, ProfileMenu, ProfileMenu],
  templateUrl: './AuthenticatedLayout.component.html',
})
export class AuthenticatedLayout implements AfterViewInit {
  @ViewChild(ProfileMenu) profileMenu! : ProfileMenu;
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

  GoToBusiness() {
    this.router.navigate(['business']);
  }

  OpenProfileMenu() {
    if (!this.profileMenu.IsVisible())
      this.profileMenu.Show();
    else
      this.profileMenu.Hide();
  }

  OnMouseEnter(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target === null)
      return;

    const decorator = target.getElementsByClassName('menu-item-decorator')[0];
    if (decorator === null)
      return;

    decorator.animate([{width: getComputedStyle(decorator).width}, {width: '100%'}], {duration: 100, fill: 'forwards'});
  }

  OnMouseLeave(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target === null)
      return;

    const decorator = target.getElementsByClassName('menu-item-decorator')[0];
    if (decorator === null)
      return;

    decorator.animate([{width: getComputedStyle(decorator).width}, {width: 0}], {duration: 100, fill: 'forwards'});
  }
}
