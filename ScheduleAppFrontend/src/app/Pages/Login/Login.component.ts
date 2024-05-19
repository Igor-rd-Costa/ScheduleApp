import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import AuthService from 'src/app/Services/AuthService';

@Component({
  selector: 'Login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './Login.component.html',
})
export class Login {
  protected loginForm = new FormGroup({
    Email: new FormControl("", {validators: [Validators.required, Validators.email]}),
    Password: new FormControl("", {validators: [Validators.required]})
  });

  public constructor(private router : Router, private authService : AuthService) {
  }

  async Login(event : SubmitEvent)
  {
    event.preventDefault();
    if (!this.loginForm.valid)
      return;
    let result = await this.authService.Login(
      this.loginForm.controls.Email.value ?? "",
      this.loginForm.controls.Password.value ?? ""
    );
    if (result) {
      this.router.navigate(["dashboard"]);
    } else {
      //TODO show login error
    }
  }

  GoToRegisterPage()
  {
    this.router.navigate(['register']);
  }
}
