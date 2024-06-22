import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';

@Component({
  selector: 'History',
  standalone: true,
  imports: [Heading, Icon, AppointmentCard],
  templateUrl: './History.component.html',
})
export class History implements AfterViewInit {
  @ViewChild('card') wrapper! : ElementRef<HTMLElement>;
  pastAppointments = signal<AppointmentInfo[]>([]);

  public constructor(private router : Router, private scheduleService : ScheduleService) {
    this.scheduleService.GetPastAppointments().then(appointments => {
      this.scheduleService.GetAppointmentInfo(appointments).then(info => {
        this.pastAppointments.set(info);
      })
    })
  } 

  ngAfterViewInit(): void {
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

  GoToProfile() {
    this.router.navigate(['profile']);
  }
}
