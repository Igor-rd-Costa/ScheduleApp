import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditCard } from 'src/app/Components/Card/EditCard.component';
import { Icon } from 'src/app/Components/Icon/icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import BusinessService, { BusinessInfo } from 'src/app/Services/BusinessService';

@Component({
  selector: 'Business',
  standalone: true,
  imports: [MainButton, ReactiveFormsModule, Icon, EditCard],
  templateUrl: './Business.component.html',
})
export class Business {
  businessInfo : BusinessInfo|null = null;

  businessSetupForm = new FormGroup({
    Name: new FormControl("", {validators: [Validators.required]}),
    Description: new FormControl("")
  });

  public constructor(private businessService : BusinessService) {
    this.businessService.GetBusinessInfo().then(info => {
      this.businessInfo = info;

    })

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
}
