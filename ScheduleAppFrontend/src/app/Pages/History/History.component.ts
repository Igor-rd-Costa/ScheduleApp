import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import { CenterCardWrapper } from 'src/app/Utils/CenterCardWrapper';

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
        this.pastAppointments.set(info.sort((a, b) => {
          if (a.time < b.time)
            return -1;
          else
            return 1;
        }));
      })
    })
    window.addEventListener('resize', () => {
      CenterCardWrapper(this.wrapper.nativeElement);
    })
  } 

  ngAfterViewInit(): void {
    CenterCardWrapper(this.wrapper.nativeElement);
}

  GoToProfile() {
    this.router.navigate(['profile']);
  }
}
