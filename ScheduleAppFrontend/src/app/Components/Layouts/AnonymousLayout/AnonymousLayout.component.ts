import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppLogo } from '../../AppLogo/AppLogo.component';

@Component({
  selector: 'AnonymousLayout',
  standalone: true,
  imports: [AppLogo],
  templateUrl: './AnonymousLayout.component.html',
})
export class AnonymousLayout {

  public constructor(private router : Router) {}

  GoToLoginPage() {
    this.router.navigate(['login']);
  }
}
