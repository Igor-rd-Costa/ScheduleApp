import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { App } from 'src/app/App.component';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import { MessageType } from 'src/app/Components/PopUpMessageBox/PopUpMessageBox.component';
import AuthService from 'src/app/Services/AuthService';
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
  time : Date
}


@Component({
  selector: 'Dashboard',
  standalone: true,
  imports: [MinimizableCard, AppointmentCard, MainButton],
  templateUrl: './Dashboard.component.html',
})
export class Dashboard implements AfterViewInit {
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

  Test() {
    App.PopDownMessageBox.Show(MessageType.SUCCESS, "This is good.", 1);
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
