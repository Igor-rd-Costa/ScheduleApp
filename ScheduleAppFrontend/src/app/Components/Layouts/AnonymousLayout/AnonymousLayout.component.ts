import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppLogo } from '../../AppLogo/AppLogo.component';
import { Icon } from '../../Icon/Icon.component';

@Component({
  selector: 'AnonymousLayout',
  standalone: true,
  imports: [Icon],
  templateUrl: './AnonymousLayout.component.html',
})
export class AnonymousLayout {

  public constructor(private router : Router) {}

  GoToLoginPage() {
    this.router.navigate(['login']);
  }

  GoToBusinesses() {
    this.router.navigate(['businesses']);
  }

  GoToHome() {
    this.router.navigate(['']);
  }
}
