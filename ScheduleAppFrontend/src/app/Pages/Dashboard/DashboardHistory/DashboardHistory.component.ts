import { Component, signal } from '@angular/core';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import BusinessService from 'src/app/Services/BusinessService';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';

@Component({
  selector: 'DashboardHistory',
  standalone: true,
  imports: [Heading, AppointmentCard],
  templateUrl: './DashboardHistory.component.html',
})
export class DashboardHistory {
  pastAppointments = signal<AppointmentInfo[]>([]);

  constructor(private businessService: BusinessService, private scheduleService: ScheduleService) {
    this.businessService.GetPastAppointments().then(pa => {
      this.scheduleService.GetAppointmentInfo(pa).then(info => {
        this.pastAppointments.set(info.sort((a, b) => {
          if (a.time < b.time)
            return -1;
          return 1;
        }));
      })
    })
  }
}
