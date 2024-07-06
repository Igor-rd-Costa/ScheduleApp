import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import BusinessService from 'src/app/Services/BusinessService';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import { CenterCardWrapper } from 'src/app/Utils/CenterCardWrapper';

@Component({
  selector: 'DashboardHistory',
  standalone: true,
  imports: [Heading, AppointmentCard],
  templateUrl: './DashboardHistory.component.html',
})
export class DashboardHistory implements AfterViewInit {
  @ViewChild('card') wrapper!: ElementRef<HTMLElement>
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
    });
    window.addEventListener('resize', () => {
      CenterCardWrapper(this.wrapper.nativeElement);
    });
  }
  
  ngAfterViewInit(): void {
    CenterCardWrapper(this.wrapper.nativeElement);
  }
}
