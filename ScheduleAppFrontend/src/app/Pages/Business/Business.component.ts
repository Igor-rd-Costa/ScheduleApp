import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessServiceCard } from 'src/app/Components/BusinessServiceCard/BusinessServiceCard.component';
import { EditCard } from 'src/app/Components/EditCard/EditCard.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import BusinessService, { BusinessInfo } from 'src/app/Services/BusinessService';
import { BusinessCategory, ServicesService, BusinessService as BusinessServiceInfo } from 'src/app/Services/ServicesService';

@Component({
  selector: 'Business',
  standalone: true,
  imports: [MainButton, ReactiveFormsModule, Icon, EditCard, BusinessServiceCard],
  templateUrl: './Business.component.html',
})
export class Business implements AfterViewChecked {
  @ViewChild('servicesWrapper') servicesWrapper! : ElementRef<HTMLElement>;
  businessInfo : BusinessInfo|null = null;
  businessSetupForm = new FormGroup({
    Name: new FormControl("", {validators: [Validators.required]}),
    Description: new FormControl("")
  });

  public constructor(private businessService : BusinessService, protected servicesService : ServicesService, private router : Router) {
    this.businessService.GetBusinessInfo().then(info => {
      this.businessInfo = info;
    });
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
    this.servicesService.GetAllServices().forEach(service => {
      if (service.categoryId === id)
        servicesInCategory.push(service);
    })
    return servicesInCategory;
  }


  SetupBusiness(event : SubmitEvent) {
    event.preventDefault();
    this.businessService.SetupBusiness(
      this.businessSetupForm.controls.Name.value ?? "",
      this.businessSetupForm.controls.Description.value ?? ""
    ).then(result => {
      if (result != null) {
        this.businessInfo = result;
      }
    });
  }

  GoToEditServices() {
    this.router.navigate(['edit/services']);
  }
}
