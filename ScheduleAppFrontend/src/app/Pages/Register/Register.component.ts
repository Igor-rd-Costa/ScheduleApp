import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormControl, FormControlStatus, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import AuthService from 'src/app/Services/AuthService';

@Component({
  selector: 'Register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './Register.component.html',
})
export class Register {
  protected registerForm = new FormGroup({
    FirstName: new FormControl("", [Validators.required]),
    LastName: new FormControl("", [Validators.required]),
    Email: new FormControl("", {validators: [Validators.required, Validators.email], asyncValidators: [this.EmailValidator()]}),
    Password: new FormControl("", {validators: [Validators.required, Validators.minLength(8), this.PasswordValidator()]})
  }); 

  public constructor(private router : Router, private authService : AuthService) {
    
  }

  GoToLoginPage()
  {
    this.router.navigate(['login']);
  }

  async Register(event : SubmitEvent)
  {
    event.preventDefault();
    if (!this.registerForm.valid)
      return;

    let result= await this.authService.Register(
      this.registerForm.controls.FirstName.value ?? "",
      this.registerForm.controls.LastName.value ?? "",
      this.registerForm.controls.Email.value ?? "",
      this.registerForm.controls.Password.value ?? ""
    );
    if (result)
      this.router.navigate(["dashboard"]);
  }

  EmailValidator() : AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return new Promise<ValidationErrors | null>(async resolve => {
        if (control.hasError("email"))
          resolve({emailAvailable: false});

        let emailAvailable = await this.authService.IsEmailAvailable(control.value);
        resolve(emailAvailable ? null : {emailAvailable});
      })
    }
  } 

  PasswordValidator() : ValidatorFn {
    return (control : AbstractControl) : ValidationErrors | null => {
      const val : string = control.value;
      let hasCapital = false;
      let hasNumber = false;
      let hasSymbol = false;
      for (let i = 0; i < val.length; i++) {
        let char = val.charAt(i);
        if (char === char.toUpperCase() && !/[\d]/.test(char))
          hasCapital = true;
        if (/[\d]/.test(char))
          hasNumber = true;
        if (/[^\w\s]/.test(char))
          hasSymbol = true;
      }
      return (hasCapital && hasNumber && hasSymbol) == true ? null : {hasCapital, hasNumber, hasSymbol};
    }
  }
}
