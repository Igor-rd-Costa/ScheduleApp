import { WeekDay } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BusinessHourUpdateInfo, BusinessHoursService } from 'src/app/Services/BusinessHoursService';

@Component({
  selector: 'OpeningHoursDisplay',
  standalone: true,
  imports: [],
  templateUrl: './OpeningHoursDisplay.component.html',
})
export class OpeningHoursDisplay {

  @Input() hours : Map<WeekDay, BusinessHourUpdateInfo[]> = new Map<WeekDay, BusinessHourUpdateInfo[]>();

  public constructor(protected businessHoursService : BusinessHoursService) {}

  protected GetDayString(day : WeekDay) {
    switch (day) {
      case WeekDay.Sunday: return "Sunday";
      case WeekDay.Monday: return "Monday";
      case WeekDay.Tuesday: return "Tuesday";
      case WeekDay.Wednesday: return "Wednesday";
      case WeekDay.Thursday: return "Thursday";
      case WeekDay.Friday: return "Friday";
      case WeekDay.Saturday: return "Saturday";
    }
  }
}
