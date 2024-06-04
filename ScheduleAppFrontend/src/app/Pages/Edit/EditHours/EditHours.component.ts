import { AfterViewInit, Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { DaysMenuItem } from './Components/DaysMenuItem/DaysMenuItem.component';
import { WeekDay } from '@angular/common';
import { OpeningHoursInput } from './Components/OpeningHoursInput/OpeningHoursInput.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { SecondaryButton } from 'src/app/Components/SecondaryButton/SecondaryButton.component';
import { Router } from '@angular/router';
import { BusinessHours, BusinessHoursService } from 'src/app/Services/BusinessHoursService';
import { App } from 'src/app/App.component';
import CacheService from 'src/app/Services/CacheService';
import { Icon } from 'src/app/Components/Icon/Icon.component';

@Component({
  selector: 'EditHours',
  standalone: true,
  imports: [Heading, DaysMenuItem, OpeningHoursInput, SecondaryButton, MainButton, Icon],
  templateUrl: './EditHours.component.html',
})
export class EditHours implements AfterViewInit {
  @ViewChildren(DaysMenuItem) daysMenuItems! : QueryList<DaysMenuItem>;
  @ViewChild(OpeningHoursInput) input! : OpeningHoursInput;
  selectedDay : WeekDay = WeekDay.Sunday;
  openingHours : BusinessHours[] = [];

  constructor(private router : Router, private businessHoursService : BusinessHoursService, private cacheService : CacheService) {
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
          if (success) {
            const business = this.cacheService.GetLoggedBusiness();
            if (business) {
              this.openingHours = await this.cacheService.BusinessHoursWhere(bh => bh.businessId === business.id);
            }
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
