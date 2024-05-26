import { Component } from '@angular/core';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import CacheService from 'src/app/Services/CacheService';

@Component({
  selector: 'Dashboard',
  standalone: true,
  imports: [MinimizableCard, AppointmentCard],
  templateUrl: './Dashboard.component.html',
})
export class Dashboard {

}
