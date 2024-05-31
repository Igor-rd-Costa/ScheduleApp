import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class Businesses implements AfterViewInit {
  @ViewChild('card') wrapper! : ElementRef<HTMLElement>;
  searchForm = new FormGroup({
    Search: new FormControl('', {validators: [Validators.required, Validators.maxLength(100)]})
  });
  searchResult : Business[] = [];
  JSON = JSON;
  public constructor(protected businessService : BusinessService) {}

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

  Search(event : SubmitEvent) {
    event.preventDefault();
    const search = this.searchForm.controls.Search.value!;
    this.businessService.SearchBusinesses(search).then(businesses => {
      this.searchResult = businesses;
    });
  }
}
