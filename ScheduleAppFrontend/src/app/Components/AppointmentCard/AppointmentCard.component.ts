import { Component, Input } from '@angular/core';
import { Icon, IconType } from '../Icon/Icon.component';
import { CardBase } from '../CardBase/CardBase.component';

@Component({
  selector: 'AppointmentCard',
  standalone: true,
  imports: [Icon, CardBase],
  templateUrl: './AppointmentCard.component.html',
})
export class AppointmentCard {
  @Input() appointmentIcon : IconType = 'visibility';
  @Input() appointmentName : string = "";
  @Input() businessName : string = "";
  @Input() appointmentTime : string = "";
}
