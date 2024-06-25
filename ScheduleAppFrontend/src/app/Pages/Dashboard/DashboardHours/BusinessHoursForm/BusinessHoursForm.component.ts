import { AfterViewInit, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { WeekDay } from '@angular/common';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { SecondaryButton } from 'src/app/Components/SecondaryButton/SecondaryButton.component';
import { Router } from '@angular/router';
import { BusinessHours, BusinessHoursService } from 'src/app/Services/BusinessHoursService';
import { App } from 'src/app/App.component';
import CacheService from 'src/app/Services/CacheService';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { DaysMenuItem } from './Components/DaysMenuItem/DaysMenuItem.component';
import { OpeningHoursInput } from './Components/OpeningHoursInput/OpeningHoursInput.component';

@Component({
  selector: 'BusinessHoursForm',
  standalone: true,
  imports: [Heading, DaysMenuItem, SecondaryButton, MainButton, Icon, OpeningHoursInput],
  templateUrl: './BusinessHoursForm.component.html',
})
export class BusinessHoursForm implements AfterViewInit {
  @ViewChildren(DaysMenuItem) daysMenuItems! : QueryList<DaysMenuItem>;
  @ViewChild(OpeningHoursInput) input! : OpeningHoursInput;
  selectedDay : WeekDay = WeekDay.Sunday;
  openingHours : BusinessHours[] = [];

  constructor(private router : Router, private businessHoursService : BusinessHoursService, private cacheService : CacheService) {
    const now = new Date(Date.now());
    const hour = new Date(2001, 0, 1, 13, 30, 0, 0);

    this.businessHoursService.GetBusinessHours(null).then(hours => {
      this.openingHours = hours;
    });
  }

  ngAfterViewInit(): void {
    let firstItem = this.daysMenuItems.first.element.nativeElement;
    let lastItem = this.daysMenuItems.last.element.nativeElement;
    if (firstItem) {
      firstItem.style.borderTopLeftRadius = '0.25rem';
      firstItem.style.borderBottomLeftRadius = '0.25rem';
    }

    if (lastItem) {
      lastItem.style.borderTopRightRadius = '0.25rem';
      lastItem.style.borderBottomRightRadius = '0.25rem';
    }

    this.daysMenuItems.get(this.selectedDay)?.Select();
  }

  async Save() {
    const value = this.input.value;

    App.PopUpMessageBox.BusinessHoursSave(value).then(result => {
      if (result) {
        this.businessHoursService.UpdateBusinessHours(value).then(async success => {
          console.log("HereHere", success);
          if (success) {
            console.log("Good!");
            const business = this.cacheService.GetLoggedBusiness();
            if (business) {
              this.openingHours = await this.cacheService.BusinessHoursWhere(bh => bh.businessId === business.id);
            }
            console.log("Got Here!");
            this.GoBack();
          }
        });
      }
    });
  }

  OnDaySelect(day : WeekDay) {
    if (this.selectedDay === day)
      return;

    let oldDay = this.daysMenuItems.get(this.selectedDay);
    let newDay = this.daysMenuItems.get(day);

    oldDay?.UnSelect();
    newDay?.Select();
    this.selectedDay = day;  
  }

  ClearHoursInput() {
    this.input.Clear();
  }

  GoBack() {
    this.router.navigate(['business']);
  }
}
