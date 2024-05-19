import { Component, Input } from '@angular/core';
import { Icon, IconType } from '../Icon/icon.component';

@Component({
  selector: 'AppointmentCard',
  standalone: true,
  imports: [Icon],
  templateUrl: './AppointmentCard.component.html',
})
export class AppointmentCard {
  @Input() appointmentIcon : IconType = 'visibility';
  @Input() appointmentName : string = "";
  @Input() businessName : string = "";
  @Input() appointmentTime : string = "";
}
