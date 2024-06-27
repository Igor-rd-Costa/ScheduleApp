import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessCard } from 'src/app/Components/BusinessCard/BusinessCard.component';
import { FormInput } from 'src/app/Components/FormInput/FormInput.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import BusinessService, { Business } from 'src/app/Services/BusinessService';
import { CenterCardWrapper } from 'src/app/Utils/CenterCardWrapper';

@Component({
  selector: 'Businesses',
  standalone: true,
  imports: [Icon, MainButton, ReactiveFormsModule, BusinessCard, FormInput],
  templateUrl: './Businesses.component.html',
})
export class Businesses implements AfterViewInit {
  @ViewChild('card') wrapper! : ElementRef<HTMLElement>;
  searchForm = new FormGroup({
    Search: new FormControl('', {validators: [Validators.required, Validators.maxLength(100)]})
  });
  searchResult : Business[] = [];
  public constructor(protected businessService : BusinessService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if ((params as any).search) {
        this.businessService.SearchBusinesses((params as any).search).then(businesses => {
           this.searchResult = businesses;
        });
      }
    });
    window.addEventListener('resize', () => {
      CenterCardWrapper(this.wrapper.nativeElement)
    })
  }

  ngAfterViewInit(): void {
    CenterCardWrapper(this.wrapper.nativeElement)
  }

  Search(event : SubmitEvent) {
    event.preventDefault();
    this.router.navigate(['businesses'], {queryParams: {search: this.searchForm.controls.Search.value!}});
  }
}
