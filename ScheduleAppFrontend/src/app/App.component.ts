import { AfterViewChecked, AfterViewInit, Component, effect, signal } from '@angular/core';
import AuthService from './Services/AuthService';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import RouteService from './Services/RouteService';

@Component({
  selector: 'App',
  templateUrl: './App.component.html',
})
export class App {
  public static backendAddress = "http://localhost:5245/api/";
  title = 'ScheduleAppFrontend';
  
  constructor(protected authService : AuthService) {}
}
