import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import AuthService, { UserInfo } from 'src/app/Services/AuthService';

@Component({
  selector: 'Profile',
  standalone: true,
  imports: [Icon, MainButton],
  templateUrl: './Profile.component.html',
})
export class Profile {
  protected userInfo = signal<UserInfo>({
    firstName: "",
    lastName: "",
    email: ""
  });
  public constructor(private authService : AuthService, private router : Router) {
    this.authService.GetUserInfo().then(info => {
      this.userInfo.set(info);
    })
  }

  Logout() {
    this.authService.Logout();
    this.router.navigate(['login']);
  }

  GoToBusiness() {
    this.router.navigate(['business']);
  }
}
