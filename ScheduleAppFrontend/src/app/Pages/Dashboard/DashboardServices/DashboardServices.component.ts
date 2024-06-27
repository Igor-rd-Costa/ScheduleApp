import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { EditableCategoryCard } from './Components/EditableCategoryCard/EditableCategoryCard.component';
import { EditableServiceCard } from './Components/EditableServiceCard/EditableServiceCard.component';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessCategory, BusinessService, CategoryDeleteInfo, ServicesService } from 'src/app/Services/ServicesService';
import CacheService from 'src/app/Services/CacheService';
import { Router } from '@angular/router';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { FormInput } from 'src/app/Components/FormInput/FormInput.component';
import { CenterCardWrapper } from 'src/app/Utils/CenterCardWrapper';

@Component({
  selector: 'DashboardServices',
  standalone: true,
  imports: [Heading, MainButton, Icon, FormInput, EditableCategoryCard, EditableServiceCard, CardBase, ReactiveFormsModule],
  templateUrl: './DashboardServices.component.html',
})
export class DashboardServices {
  @ViewChildren('card') wrappers! : QueryList<ElementRef<HTMLElement>>;
  addCategoryForm = new FormGroup({
    Name: new FormControl('', {validators: [Validators.required, ]})
  });
  addServiceForm = new FormGroup({
    Name: new FormControl('', {validators: [Validators.required]}),
    Description: new FormControl(''),
    Price: new FormControl<number|null>(null),
    Duration: new FormControl<number>(30, {validators: [Validators.required]}),
    Category: new FormControl<number|null>(null)
  });
  categories : BusinessCategory[] = [];
  services : BusinessService[] = [];

  public constructor(protected servicesService : ServicesService, private cache : CacheService, private router : Router) {
    this.servicesService.GetCategories(null).then(categories => {
      this.categories = categories;
    });
    this.servicesService.GetServices(null).then(services => {
      this.services = services;
    });

    window.addEventListener('resize', () => {
      this.wrappers.forEach(wrapper => {
        CenterCardWrapper(wrapper.nativeElement);
      })
    })
  }

  ngAfterViewInit(): void {
    this.wrappers.forEach(wrapper => {
      CenterCardWrapper(wrapper.nativeElement);
    })
  }

  AddService(event : SubmitEvent) {
    event.preventDefault();
    const name = this.addServiceForm.controls.Name.value!;
    const description = this.addServiceForm.controls.Description.value ?? "";
    let price = this.addServiceForm.controls.Price.value;
    const duration = this.addServiceForm.controls.Duration.value!;
    let category = this.addServiceForm.controls.Category.value;
    if (typeof(category) === 'string') {
      category = parseInt(category as string);
    }
    if (typeof(price) === 'string') {
      price = parseFloat((price as string).replace(',', '.'));
    }
    this.servicesService.AddService(name, description, price, duration, category).then(result =>{
      if (result.id !== -1) {
        this.services.push({
          id: result.id,
          businessId: this.cache.GetLoggedBusiness()!.id, 
          categoryId: category,
          name: name,
          description: description,
          price: price,
          duration: duration, 
          lastEditDate: result.date
        });
      }
      this.addServiceForm.reset();
    });
  }

  AddCategory(event : SubmitEvent) {
    event.preventDefault();
    if (!this.addCategoryForm.valid)
      return;
    const name = this.addCategoryForm.controls.Name.value!;
    this.servicesService.AddCategory(name).then(result => {
      if (result.id !== -1) {
        this.categories.push({
          id: result.id,
          businessId: this.cache.GetLoggedBusiness()!.id,
          name: name,
          lastEditDate: result.date
        });  
      }
      this.addCategoryForm.reset();
      
    });
  }

  async OnServiceEdited(id : number) {
    let service = await this.cache.GetService(id, this.cache.GetLoggedBusiness()?.id ?? "");
    if (service === null)
      return;
    for (let i = 0; i < this.services.length; i++) {
      if (this.services[i].id === id) {
        this.services[i] = service;
      }
    }
  }

  OnServiceDeleted(id : number) {
    for (let i = 0; i < this.services.length; i++) {
      if (this.services[i].id === id) {
        this.services.splice(i, 1);
        break;
      }
    }
  }

  async OnCategoryEdit(id : number) {
    let category = await this.cache.GetCategory(id);
    if (category === null)
      return;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id === id) {
        this.categories[i] = category;
        break;
      }
    }
  }

  OnCategoryDelete(info : CategoryDeleteInfo) {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id === info.categoryId) {
        this.categories.splice(i, 1);
        break;
      }
    }
    console.log("Services", Array.from(this.services));
    for (let i = 0; i < this.services.length; i++) {
      if (this.services[i].categoryId === info.categoryId) {
        console.log(this.services[i]);
        if (info.deleteServices) {
          this.services.splice(i, 1);
          i--;
        } else {
          this.services[i].categoryId = null;
        }
      }
    }
  }

  GoBack() {
    this.router.navigate(['business']);
  }
}
