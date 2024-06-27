import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import {CenterCardWrapper} from 'src/app/Utils/CenterCardWrapper';


@Component({
  selector: 'Home',
  standalone: true,
  imports: [MinimizableCard, Icon, AppointmentCard, MainButton],
  templateUrl: './Home.component.html',
})
export class Home implements AfterViewInit {
  @ViewChild('card') wrapper! : ElementRef<HTMLElement>;

  protected appointments : AppointmentInfo[] = [];

  public constructor(private scheduleService : ScheduleService) {
    this.scheduleService.GetAppointments().then(appointments => {
      this.scheduleService.GetAppointmentInfo(appointments).then(info => {
        this.appointments = info;
      });
    });
    window.addEventListener('resize', () => {
      CenterCardWrapper(this.wrapper.nativeElement);
    })
  }

  ngAfterViewInit(): void {
      CenterCardWrapper(this.wrapper.nativeElement);
  }
}
