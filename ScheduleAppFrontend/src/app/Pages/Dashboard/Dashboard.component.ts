import { AfterViewInit, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import AuthService from 'src/app/Services/AuthService';
import RouteService from 'src/app/Services/RouteService';

@Component({
  selector: 'Dashboard',
  standalone: true,
  imports: [MinimizableCard, AppointmentCard],
  templateUrl: './Dashboard.component.html',
})
export class Dashboard {

}
