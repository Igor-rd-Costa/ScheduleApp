import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import { SecondaryButton } from 'src/app/Components/SecondaryButton/SecondaryButton.component';
import { EditableCategoryCard } from './Components/EditableCategoryCard/EditableCategoryCard.component';
import { EditableServiceCard } from './Components/EditableServiceCard/EditableServiceCard.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { BusinessCategory, BusinessService, ServicesService } from 'src/app/Services/ServicesService';

@Component({
  selector: 'EditServices',
  standalone: true,
  imports: [Heading, MinimizableCard, CardBase, Icon, MainButton, EditableCategoryCard, EditableServiceCard, ReactiveFormsModule, SecondaryButton],
  templateUrl: './EditServices.component.html',
})
export class EditServices {
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

  public constructor(protected servicesService : ServicesService) {
  }

  AddService(event : SubmitEvent) {
    event.preventDefault();
    const name = this.addServiceForm.controls.Name.value!;
    const description = this.addServiceForm.controls.Description.value ?? "";
    const price = this.addServiceForm.controls.Price.value;
    const duration = this.addServiceForm.controls.Duration.value!;
    const category = this.addServiceForm.controls.Category.value;
    this.servicesService.AddService(name, description, price, duration, category).then(id =>{
      this.addServiceForm.reset();
    });
  }

  AddCategory(event : SubmitEvent) {
    event.preventDefault();
    if (!this.addCategoryForm.valid)
      return;
    const name = this.addCategoryForm.controls.Name.value!;
    this.servicesService.AddCategory(name).then(id => {
      this.addCategoryForm.reset();
    });
  }
}
