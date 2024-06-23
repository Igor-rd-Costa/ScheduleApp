import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import AuthService from 'src/app/Services/AuthService';
import BusinessService from 'src/app/Services/BusinessService';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';

@Component({
  selector: 'BusinessAppointments',
  standalone: true,
  imports: [Heading, AppointmentCard],
  templateUrl: './BusinessAppointments.component.html',
})
export class BusinessAppointments implements AfterViewInit {
  @ViewChild('card') wrapper!: ElementRef<HTMLElement>
  appointments = signal<AppointmentInfo[]>([]);

  constructor(private authService: AuthService, private businessService: BusinessService, private scheduleService: ScheduleService, private router: Router) {
    if (this.authService.GetLoggedBusiness() === null)
      this.router.navigate(['profile']);
  }

  ngAfterViewInit(): void {
      this.businessService.GetAppointments().then(appointments => {
        this.scheduleService.GetAppointmentInfo(appointments).then(info => {
          this.appointments.set(info)
        })
      })

      const wrapper = this.wrapper.nativeElement;
      let width = parseFloat(getComputedStyle(wrapper).width);
      let count = 0;
      while(width > (5 * 16)) {
        width -= (5 * 16);
        count++;
      }
      wrapper.style.paddingLeft = width / count + "px";
      wrapper.style.paddingRight = width / count + "px";
      wrapper.style.columnGap = width / count + '';
  }
}
