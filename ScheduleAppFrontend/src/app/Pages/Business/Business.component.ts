import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessServiceCard } from 'src/app/Components/BusinessServiceCard/BusinessServiceCard.component';
import { EditCard } from 'src/app/Components/EditCard/EditCard.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import BusinessService, { BusinessInfo } from 'src/app/Services/BusinessService';
import CacheService from 'src/app/Services/CacheService';
import { ServicesService, BusinessService as BusinessServiceInfo } from 'src/app/Services/ServicesService';

@Component({
  selector: 'Business',
  standalone: true,
  imports: [MainButton, ReactiveFormsModule, Icon, EditCard, MinimizableCard, BusinessServiceCard],
  templateUrl: './Business.component.html',
})
export class Business implements AfterViewChecked, AfterViewInit {
  @ViewChild('servicesWrapper') servicesWrapper! : ElementRef<HTMLElement>;
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

  
  public constructor(private cache : CacheService, protected businessService : BusinessService, protected servicesService : ServicesService, private router : Router) {
    
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
          }
        });
      }
  }

  ngAfterViewChecked(): void {
    if (this.servicesWrapper === undefined)
      return;
      const wrapper = this.servicesWrapper.nativeElement;
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

  GetServicesInCategory(id : number) : BusinessServiceInfo[] {
    let servicesInCategory : BusinessServiceInfo[] = [];
    if (!this.businessInfo)
      return servicesInCategory;

    this.businessInfo.services?.forEach(service => {
      if (service.categoryId === id)
        servicesInCategory.push(service);
    })
    return servicesInCategory;
  }


  SetupBusiness(event : SubmitEvent) {
    event.preventDefault();
    this.businessService.CreateBusiness(
      this.businessSetupForm.controls.Name.value ?? "",
      this.businessSetupForm.controls.Description.value ?? ""
    ).then(result => {
      if (result != null) {
        this.businessInfo = result;
        if (result.business != null)
          this.cache.SetBusiness(result.business.id, result.business);
      }
    });
  }

  GoToEditServices() {
    this.router.navigate(['edit/services']);
  }
}
