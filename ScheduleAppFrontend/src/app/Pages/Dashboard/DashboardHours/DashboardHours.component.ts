import { WeekDay } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { OpeningHoursDisplay } from 'src/app/Components/OpeningHoursDisplay/OpeningHoursDisplay.component';
import { BusinessHourUpdateInfo, BusinessHoursService } from 'src/app/Services/BusinessHoursService';
@Component({
  selector: 'DashboardHours',
  standalone: true,
  imports: [Heading, CardBase, OpeningHoursDisplay],
  templateUrl: './DashboardHours.component.html',
})
export class DashboardHours implements AfterViewInit {
  @ViewChild('card') wrapper!: ElementRef<HTMLElement>
  openingHours = new Map<WeekDay, BusinessHourUpdateInfo[]>();

  constructor(private businessHoursService: BusinessHoursService) {}

  ngAfterViewInit(): void {
    this.businessHoursService.GetBusinessHours(null).then(hours => {
      for (let day = WeekDay.Sunday; day <= WeekDay.Saturday; day++)
        this.openingHours.set(day, hours.filter(h => h.day === day).sort((a, b) => a.intervalStart - b.intervalStart));
    });  

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
}
