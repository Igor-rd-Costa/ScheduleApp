import { Component, Input } from '@angular/core';
import { Icon, IconType } from '../Icon/Icon.component';
import { CardBase } from '../CardBase/CardBase.component';
import { Time } from 'src/app/Utils/Time';

@Component({
  selector: 'AppointmentCard',
  standalone: true,
  imports: [Icon, CardBase],
  templateUrl: './AppointmentCard.component.html',
})
export class AppointmentCard {  
  Time = Time;
  @Input() serviceIcon : IconType = 'cut';
  @Input() serviceName : string = "";
  @Input() servicePrice : number | null = null;
  @Input() serviceDuration : number = 0;
  @Input() businessName : string = "";
  @Input() employeeName : string = "";
  @Input() appointmentTime : number = 0;

  FormatTime() {
    const t = new Date();
    const day = t.getDate();
    const month = t.getMonth() + 1;
    const hour = t.getHours();
    const minute = t.getMinutes();
    return Time.DateTimeToString(this.appointmentTime);
    return `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute} ${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${t.getFullYear()}`;    
  }
}
