import { Component } from '@angular/core';
import { Icon } from '../../Icon/Icon.component';
import { Router } from '@angular/router';

@Component({
  selector: 'AppLogo',
  standalone: true,
  imports: [Icon],
  templateUrl: './AppLogo.component.html',
})
export class AppLogo {

  constructor(private router: Router) {}

  GoToHome() {
    this.router.navigate(['']);
  }
}
