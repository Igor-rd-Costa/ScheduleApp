import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessCard } from 'src/app/Components/BusinessCard/BusinessCard.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import BusinessService, { Business } from 'src/app/Services/BusinessService';

@Component({
  selector: 'Businesses',
  standalone: true,
  imports: [Icon, MainButton, ReactiveFormsModule, BusinessCard],
  templateUrl: './Businesses.component.html',
})
export class Businesses {
  searchForm = new FormGroup({
    Search: new FormControl('', {validators: [Validators.required, Validators.maxLength(100)]})
  });
  searchResult : Business[] = [];
  JSON = JSON;
  public constructor(protected businessService : BusinessService) {}

  Search(event : SubmitEvent) {
    event.preventDefault();
    const search = this.searchForm.controls.Search.value!;
    this.businessService.SearchBusinesses(search).then(businesses => {
      this.searchResult = businesses;
    });
  }
}
