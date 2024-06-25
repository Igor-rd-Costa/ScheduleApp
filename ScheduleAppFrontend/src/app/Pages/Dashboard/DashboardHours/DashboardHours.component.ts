import { WeekDay } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { OpeningHoursDisplay } from 'src/app/Components/OpeningHoursDisplay/OpeningHoursDisplay.component';
import { BusinessHourUpdateInfo, BusinessHoursService } from 'src/app/Services/BusinessHoursService';
import { BusinessHoursForm } from './BusinessHoursForm/BusinessHoursForm.component';
@Component({
  selector: 'DashboardHours',
  standalone: true,
  imports: [Heading, CardBase, OpeningHoursDisplay, BusinessHoursForm],
  templateUrl: './DashboardHours.component.html',
})
export class DashboardHours implements AfterViewInit {
  openingHours = new Map<WeekDay, BusinessHourUpdateInfo[]>();

  constructor(private businessHoursService: BusinessHoursService) {}

  ngAfterViewInit(): void {
    this.businessHoursService.GetBusinessHours(null).then(hours => {
      for (let day = WeekDay.Sunday; day <= WeekDay.Saturday; day++)
        this.openingHours.set(day, hours.filter(h => h.day === day).sort((a, b) => a.intervalStart - b.intervalStart));
    });  
  }
}
