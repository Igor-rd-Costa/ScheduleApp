import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import BusinessService from 'src/app/Services/BusinessService';
import { Appointment, ScheduleService } from 'src/app/Services/ScheduleService';
import { ServicesService } from 'src/app/Services/ServicesService';

export type AppointmentInfo = {
  id: number,
  businessName : string,
  employeeName : string, 
  serviceName : string,
  price : number | null,
  duration : number,
  time : number
}


@Component({
  selector: 'Home',
  standalone: true,
  imports: [MinimizableCard, Icon, AppointmentCard, MainButton],
  templateUrl: './Home.component.html',
})
export class Home implements AfterViewInit {
  @ViewChild('card') wrapper! : ElementRef<HTMLElement>;

  protected appointments : AppointmentInfo[] = [];

  public constructor(private scheduleService : ScheduleService, private businessService : BusinessService, 
    private serviceService : ServicesService, private router : Router) {
    this.scheduleService.GetAppointments().then(appointments => {
      this.GetAppointmentInfo(appointments).then(info => {
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

  async GetAppointmentInfo(appointments : Appointment[]) : Promise<AppointmentInfo[]> {
    if (appointments.length === 0)
      return [];

    let info : AppointmentInfo[] = [];
    for (let i = 0; i < appointments.length; i++) {
      const a = appointments[i];

      const business = await this.businessService.GetBusinessById(a.businessId);
      if (!business)
        continue;
      const service = await this.serviceService.GetService(a.serviceId, business.id);
      const employee = await this.businessService.GetBusinessEmployee(business.id, a.employeeId);
      if (!service || !employee)
        continue;

      info.push({
        id: a.id,
        businessName: business.name,
        employeeName: employee.firstName,
        serviceName: service.name,
        price: service.price,
        duration: service.duration,
        time: a.time
      });
    }
    
    return info;
  }
}
