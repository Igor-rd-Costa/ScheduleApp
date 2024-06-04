import { WeekDay } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessServiceCard } from 'src/app/Components/BusinessServiceCard/BusinessServiceCard.component';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import { EditCard } from 'src/app/Components/EditCard/EditCard.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import { OpeningHoursDisplay } from 'src/app/Components/OpeningHoursDisplay/OpeningHoursDisplay.component';
import { BusinessHourUpdateInfo, BusinessHoursService } from 'src/app/Services/BusinessHoursService';
import BusinessService, { BusinessInfo } from 'src/app/Services/BusinessService';
import CacheService from 'src/app/Services/CacheService';
import { ServicesService, BusinessService as BusinessServiceInfo } from 'src/app/Services/ServicesService';

@Component({
  selector: 'Business',
  standalone: true,
  imports: [MainButton, ReactiveFormsModule, Icon, CardBase, EditCard, MinimizableCard, BusinessServiceCard, OpeningHoursDisplay],
  templateUrl: './Business.component.html',
})
export class Business implements AfterViewChecked, AfterViewInit {
  @ViewChildren('card') wrappers! : QueryList<ElementRef<HTMLElement>>;
  allowEdit = true; 
  businessSetupForm = new FormGroup({
    Name: new FormControl("", {validators: [Validators.required]}),
    Description: new FormControl("")
  });
  businessInfo : BusinessInfo = {
    business: undefined,
    services: null,
    categories: null,
  };
  openingHours = new Map<WeekDay, BusinessHourUpdateInfo[]>();

  
  public constructor(private cache : CacheService, protected businessService : BusinessService,
    private businessHoursService : BusinessHoursService, 
    protected servicesService : ServicesService, private router : Router) {
    
  }
  
  ngAfterViewInit(): void {
      let route = this.router.url.substring('/business'.length);
      if (route === "") {
        this.businessService.GetBusiness(null).then(business => {
          this.allowEdit = true;
          this.businessInfo.business = business;
          if (this.businessInfo.business) {
            this.servicesService.GetCategories(null).then(categories => {
              this.businessInfo.categories = categories;
            });
            this.servicesService.GetServices(null).then(services => {
              this.businessInfo.services = services;
            });
            this.businessHoursService.GetBusinessHours(null).then(hours => {
              for (let day = WeekDay.Sunday; day <= WeekDay.Saturday; day++)
                this.openingHours.set(day, hours.filter(h => h.day === day).sort((a, b) => a.intervalStart - b.intervalStart));
            })
          }
        });
      } else {
        if (route.startsWith('/'))
          route = route.substring(1);
        this.businessService.GetBusiness(route).then(business => {
          this.businessInfo.business = business;
          this.allowEdit = false;
          if (this.businessInfo.business) {
            this.servicesService.GetCategories(this.businessInfo.business.id).then(categories => {
              this.businessInfo.categories = categories;
            })
            this.servicesService.GetServices(this.businessInfo.business.id).then(services => {
              this.businessInfo.services = services;
            })
            this.businessHoursService.GetBusinessHours(this.businessInfo.business.id).then(hours => {
              for (let day = WeekDay.Sunday; day <= WeekDay.Saturday; day++)
                this.openingHours.set(day, hours.filter(h => h.day === day).sort((a, b) => a.intervalStart - b.intervalStart));
            })
          }
        });
      }
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
        wrapper.style.columnGap = width / count + '';
      }
  }

  OnServiceClick(serviceId : number) {
    const route = this.router.url.split('/');
    this.router.navigate([...route, 'schedule', serviceId]);
  }

  GetServicesInCategory(id : number | null) : BusinessServiceInfo[] {
    let servicesInCategory : BusinessServiceInfo[] = [];
    if (!this.businessInfo)
      return servicesInCategory;

    this.businessInfo.services?.forEach(service => {
      if (service.categoryId === id)
        servicesInCategory.push(service);
    })
    return servicesInCategory;
  }

  HasServiceWithNoCategory() : boolean {
    if (!this.businessInfo.services)
      return false;

    for (let i = 0; i < this.businessInfo.services.length; i++) {
      if (this.businessInfo.services[i].categoryId === null)
        return true;
    }
    return false;
  }


  SetupBusiness(event : SubmitEvent) {
    event.preventDefault();
    this.businessService.CreateBusiness(
      this.businessSetupForm.controls.Name.value ?? "",
      this.businessSetupForm.controls.Description.value ?? ""
    ).then(result => {
      if (result != null) {
        this.businessInfo = {
          business: result,
          categories: [],
          services: []
        };
      }
    });
  }

  GoToEditServices() {
    this.router.navigate(['edit/services']);
  }

  GoToEditHours() {
    this.router.navigate(['edit/hours']);
  }
}
