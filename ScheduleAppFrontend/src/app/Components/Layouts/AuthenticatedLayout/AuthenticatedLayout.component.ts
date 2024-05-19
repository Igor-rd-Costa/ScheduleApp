import { Component } from '@angular/core';
import { Router } from '@angular/router';
import AuthService from 'src/app/Services/AuthService';
import { AppLogo } from '../../AppLogo/AppLogo.component';
import { UserMenu } from '../../UserMenu/UserMenu.component';
import { Icon } from '../../Icon/Icon.component';

@Component({
  selector: 'AuthenticatedLayout',
  standalone: true,
  imports: [AppLogo, UserMenu, Icon],
  templateUrl: './AuthenticatedLayout.component.html',
})
export class AuthenticatedLayout {

  public constructor(private router : Router, private authService : AuthService) {}
  
  async Logout() {
    await this.authService.Logout();
    this.router.navigate(['login']);
  }

  GoToBusinesses() {
    this.router.navigate(['businesses']);
  }

  GoToDashboard() {
    this.router.navigate(['dashboard']);
  }

  GoToProfile() {
    this.router.navigate(['profile']);
  }
}
