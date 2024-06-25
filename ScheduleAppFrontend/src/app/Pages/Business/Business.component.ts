import { WeekDay } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessServiceCard } from 'src/app/Components/BusinessServiceCard/BusinessServiceCard.component';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import { EditCard } from 'src/app/Components/EditCard/EditCard.component';
import { FormInput } from 'src/app/Components/FormInput/FormInput.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import { NotificationType, NotificationsPanel } from 'src/app/Components/NotificationsPanel/NotificationsPanel.component';
import { OpeningHoursDisplay } from 'src/app/Components/OpeningHoursDisplay/OpeningHoursDisplay.component';
import AuthService from 'src/app/Services/AuthService';
import { BusinessHourUpdateInfo, BusinessHoursService } from 'src/app/Services/BusinessHoursService';
import BusinessService, { Business as BusinessInfo } from 'src/app/Services/BusinessService';
import CacheService from 'src/app/Services/CacheService';
import { City, Country, LocationService, State } from 'src/app/Services/LocationService';
import { ServicesService, BusinessService as BusinessServiceInfo, BusinessCategory } from 'src/app/Services/ServicesService';

@Component({
  selector: 'Business',
  standalone: true,
  imports: [MainButton, ReactiveFormsModule, Icon, CardBase, EditCard, MinimizableCard, 
    BusinessServiceCard, OpeningHoursDisplay, FormInput, NotificationsPanel],
  templateUrl: './Business.component.html',
})
export class Business implements AfterViewChecked, AfterViewInit {
  NotificationType = NotificationType;
  @ViewChildren('card') wrappers! : QueryList<ElementRef<HTMLElement>>;
  @ViewChild(NotificationsPanel) notificationsPanel! : NotificationsPanel;
  allowEdit = true; 
  businessSetupForm = new FormGroup({
    Name: new FormControl("", {validators: [Validators.required]}),
    Description: new FormControl(""),
    Address: new FormControl("", {validators: Validators.required}),
    Number : new FormControl<number|''>('', {validators: Validators.required}),
    Country: new FormControl("", {validators: Validators.required}),
    State: new FormControl("", {validators: Validators.required}),
    City: new FormControl<number|''>('', {validators: Validators.required})
  });
  business = signal<undefined|null|BusinessInfo>(undefined);
  services = signal<BusinessServiceInfo[]>([]);
  categories = signal<BusinessCategory[]>([]);

  cityName = signal("");
  stateName = signal("");

  countries : Country[] = [];
  states : State[] = [];
  cities : City[] = [];
  openingHours = new Map<WeekDay, BusinessHourUpdateInfo[]>();
  
  public constructor(protected locationService : LocationService, protected businessService : BusinessService, protected authService : AuthService,
    private businessHoursService : BusinessHoursService, private cacheService : CacheService, protected servicesService : ServicesService, private router : Router) {
    this.businessSetupForm.controls.State.disable();
    this.businessSetupForm.controls.City.disable();
    this.businessSetupForm.controls.Country.valueChanges.subscribe(value => {
      this.businessSetupForm.controls.State.setValue('');
      this.businessSetupForm.controls.City.setValue('');
      if (value === "" || value === null) {
        this.states = [];
        this.businessSetupForm.controls.State.disable();
        this.businessSetupForm.controls.City.disable();
        }
      else {
        this.businessSetupForm.controls.State.enable();
        this.locationService.GetStates(value).then(states => {
          this.states = states;
        })
      }
      this.cities = [];
    });
    this.businessSetupForm.controls.State.valueChanges.subscribe(value => {
      this.businessSetupForm.controls.City.setValue('');
      if (value === "" || value === null) {
        this.cities = [];
        this.businessSetupForm.controls.City.disable();
        }
        else {
        this.businessSetupForm.controls.City.enable();
        const country = this.businessSetupForm.controls.Country.value;
        if (country === "" || country === null)
          return;
        this.locationService.GetCities(country, value).then(cities => {
          this.cities = cities;
        })
      }
    })
  }

  ngAfterViewInit(): void {
    let route = this.router.url.substring('/business'.length);
    let businessRoute : string | null = route === "" ? null : (route.startsWith('/') ? route.substring(1) : route);
    this.businessService.GetBusiness(businessRoute).then(business => {
      if (businessRoute !== null) {
        this.allowEdit = false;
        this.business.set(business);
      } else {
        this.business.set(this.authService.GetLoggedBusiness());
      }
      if (this.business()) {
        if (this.cacheService.GetLoggedBusiness()?.id === this.business()!.id) {
          this.allowEdit = true;
        }
        this.servicesService.GetCategories(this.business()!.id).then(categories => {
          this.categories.set(categories);
        });
        this.servicesService.GetServices(this.business()!.id).then(services => {
          this.services.set(services);
        });
        this.businessHoursService.GetBusinessHours(this.business()!.id).then(hours => {
          for (let day = WeekDay.Sunday; day <= WeekDay.Saturday; day++)
            this.openingHours.set(day, hours.filter(h => h.day === day).sort((a, b) => a.intervalStart - b.intervalStart));
        });
        this.locationService.GetCity(this.business()!.cityCode).then(city => {
          this.cityName.set(city?.name ?? "");
        });
        this.locationService.GetState(this.business()!.countryCode, this.business()!.stateCode).then(state => {
          this.stateName.set(state?.name ?? "");
        });
      } else {
        this.locationService.GetCountries().then(countries => {
          this.countries = countries;
        })
      }
    });
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
    if (!this.business())
      return servicesInCategory;

    this.services().forEach(service => {
      if (service.categoryId === id)
        servicesInCategory.push(service);
    });
    return servicesInCategory;
  }

  HasServiceWithNoCategory() : boolean {
    if (!this.services())
      return false;

    for (let i = 0; i < this.services().length; i++) {
      if (this.services()[i].categoryId === null)
        return true;
    }
    return false;
  }


  SetupBusiness(event : SubmitEvent) {
    event.preventDefault();
    if (this.businessSetupForm.controls.Number.value === '' || this.businessSetupForm.controls.City.value === '')
      return;
    this.businessService.CreateBusiness({
      name: this.businessSetupForm.controls.Name.value ?? "",
      description: this.businessSetupForm.controls.Description.value ?? "",
      address: this.businessSetupForm.controls.Address.value ?? "",
      addressNumber: this.businessSetupForm.controls.Number.value ?? 0,
      country: this.businessSetupForm.controls.Country.value ?? "",
      state: this.businessSetupForm.controls.State.value ?? "",
      city: this.businessSetupForm.controls.City.value ?? 0
    }).then(result => {
      if (result != null) {
        this.business.set(this.authService.GetLoggedBusiness());
        this.categories.set([]);
        this.services.set([]);
      }
    });
  }

  ToggleNotificationsDisplay() {
    this.notificationsPanel.ToggleVisibility();
    if (this.notificationsPanel.IsVisible()) {
      this.business.update(b => {
        if (b)
          b.hasUnseenNotifications = false;
        return b;
      });
    }
  }

  GoToEditServices() {
    this.router.navigate(['dashboard'], {queryParams: {menuItem: 'services'}});
  }

  GoToEditHours() {
    this.router.navigate(['dashboard'], {queryParams: {menuItem: 'hours'}});
  }

  GoToDashboard() {
    this.router.navigate(['dashboard'], {queryParams: {menuItem: 'appointments'}});
  }
}
