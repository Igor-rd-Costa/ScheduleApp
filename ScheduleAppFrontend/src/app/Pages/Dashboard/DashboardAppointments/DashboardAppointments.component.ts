import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import AuthService from 'src/app/Services/AuthService';
import BusinessService from 'src/app/Services/BusinessService';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import {CenterCardWrapper} from 'src/app/Utils/CenterCardWrapper';

@Component({
  selector: 'DashboardAppointments',
  standalone: true,
  imports: [Heading, AppointmentCard],
  templateUrl: './DashboardAppointments.component.html',
})
export class DashboardAppointments implements AfterViewInit {
  @ViewChild('card') wrapper!: ElementRef<HTMLElement>
  appointments = signal<AppointmentInfo[]>([]);

  constructor(private authService: AuthService, private businessService: BusinessService, private scheduleService: ScheduleService, private router: Router) {
    if (this.authService.GetLoggedBusiness() === null)
      this.router.navigate(['profile']);
    window.addEventListener('resize', () => {
      CenterCardWrapper(this.wrapper.nativeElement);
    })
  }

  ngAfterViewInit(): void {
      this.businessService.GetAppointments().then(appointments => {
        this.scheduleService.GetAppointmentInfo(appointments).then(info => {
          this.appointments.set(info)
        })
      })

      CenterCardWrapper(this.wrapper.nativeElement);
  }
}
