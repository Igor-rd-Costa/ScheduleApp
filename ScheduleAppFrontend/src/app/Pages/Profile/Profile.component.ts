import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import AuthService, { User } from 'src/app/Services/AuthService';

@Component({
  selector: 'Profile',
  standalone: true,
  imports: [Icon, MainButton],
  templateUrl: './Profile.component.html',
})
export class Profile {
  protected user = signal<User>({
    id: "-1",
    firstName: "",
    lastName: "",
    email: "",
    lastEditDate: new Date(0)
  });

  public constructor(private authService : AuthService, private router : Router) {
    this.authService.GetUser(null).then(info => {
      this.user.set(info);
    })
  }

  Logout() {
    this.authService.Logout().then(() => {
      this.router.navigate(['login']);
    });
  }

  GoToBusiness() {
    this.router.navigate(['business']);
  }
}
