import { Component } from '@angular/core';
import AuthService from './Services/AuthService';


@Component({
  selector: 'App',
  templateUrl: './App.component.html',
})
export class App {
  public static backendAddress = "http://localhost:5245/api/";
  title = 'ScheduleAppFrontend';
  
  constructor(protected authService : AuthService) {}
}
