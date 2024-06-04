import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnChanges, QueryList, SimpleChanges, ViewChildren, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessServiceCard } from 'src/app/Components/BusinessServiceCard/BusinessServiceCard.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import BusinessService, { Business } from 'src/app/Services/BusinessService';
import { ScheduleService } from 'src/app/Services/ScheduleService';
import { BusinessService as BusinessServiceData, ServicesService } from 'src/app/Services/ServicesService';
import { ScheduleInput } from './ScheduleInput/ScheduleInput.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
type ScheduleRouteParams = {
  businessUrl : string,
  serviceId : string
}

@Component({
  selector: 'Schedule',
  standalone: true,
  imports: [Heading, BusinessServiceCard, ScheduleInput, Icon],
  templateUrl: './Schedule.component.html',
})
export class Schedule implements AfterViewChecked {
  @ViewChildren('card') wrappers! : QueryList<ElementRef<HTMLElement>>;
  service = signal<BusinessServiceData | null>(null);
  business = signal<Business | null>(null);
  selectedTime : Date | null = null;
  businessId : string = "";


  public constructor(private router : Router, private route : ActivatedRoute, private businessService : BusinessService,
    private servicesService : ServicesService, private scheduleService : ScheduleService 
  ) {
    this.route.params.subscribe(async params => {
      const businessUrl = (params as ScheduleRouteParams).businessUrl ?? "";
      const serviceId = parseInt((params as ScheduleRouteParams).serviceId ?? "-1");

      if (businessUrl === "" || serviceId === -1) {
        this.router.navigate(['profile']);
        return;
      }
      this.business.set((await this.businessService.GetBusiness(businessUrl)));
      if(this.business() === null) {
        this.router.navigate(['profile']);
        return;
      }
      this.service.set(await this.servicesService.GetService(serviceId, this.business()!.id));
      if(this.service() === null) {
        this.router.navigate(['profile']);
        return;
      }
      this.scheduleService.GetScheduleInfo(this.service()!.id, this.business()!.id).then(info => {
        this.service.set(info);
      });
    })
  }

  ngAfterViewChecked(): void {
    if (this.wrappers === undefined) {
      return;
    }
    
    for (let i = 0; i < this.wrappers.length; i++) {
      const wrapper = this.wrappers.get(i)!.nativeElement;
      let width = parseFloat(getComputedStyle(wrapper).width);
      let count = 0;
      while(width > (5 * 16)) {
        width -= (5 * 16);
        count++;
      }
      wrapper.style.paddingLeft = width / count + "px";
      wrapper.style.paddingRight = width / count + "px";
      wrapper.style.columnGap = width / count + 'px';
    }
  }

  GoBack() {
    this.route.params.subscribe(async params => {
      const businessUrl = (params as ScheduleRouteParams).businessUrl ?? null;
      if (businessUrl === null) {
        this.router.navigate(['']);
        return;
      }
      this.router.navigate(['business', businessUrl]);
    });
  }
}
