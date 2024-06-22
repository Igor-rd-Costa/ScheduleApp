import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';


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
}
