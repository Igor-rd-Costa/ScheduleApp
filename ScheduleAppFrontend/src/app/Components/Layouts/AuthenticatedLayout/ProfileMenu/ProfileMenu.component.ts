import { AfterViewInit, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import AuthService from 'src/app/Services/AuthService';

@Component({
  selector: 'ProfileMenu',
  standalone: true,
  imports: [Icon],
  templateUrl: './ProfileMenu.component.html',
})
export class ProfileMenu implements AfterViewInit {
  visible = signal(false);

  constructor(private router: Router, protected authService: AuthService) {}

  ngAfterViewInit(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement | null;
      if (target === null)
        return;
      if (this.visible() && target.closest("#profile-menu") === null && target.closest("#profile-menu-button") === null) {
        this.Hide();
      }
    });
  }

  IsVisible() {
    return this.visible();
  }

  Show() {
    this.visible.set(true);
  }

  Hide() {
    this.visible.set(false);
  }

  GoToProfile() {
    this.router.navigate(['profile']);
    this.Hide();
  }

  GoToHistory() {
    this.router.navigate(['history']);
    this.Hide();
  }

  GoToBusiness() {
    this.router.navigate(['business']);
    this.Hide();
  }

  Logout() {
    this.authService.Logout().then(() => {
      this.router.navigate(['login']);
      this.Hide();
    })
  }
}
