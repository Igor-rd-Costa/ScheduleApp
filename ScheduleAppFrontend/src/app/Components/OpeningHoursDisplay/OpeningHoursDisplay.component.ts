import { WeekDay } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BusinessHourUpdateInfo, BusinessHoursService } from 'src/app/Services/BusinessHoursService';
import { Time } from 'src/app/Utils/Time';

@Component({
  selector: 'OpeningHoursDisplay',
  standalone: true,
  imports: [],
  templateUrl: './OpeningHoursDisplay.component.html',
})
export class OpeningHoursDisplay {
  Time = Time;
  @Input() hours : Map<WeekDay, BusinessHourUpdateInfo[]> = new Map<WeekDay, BusinessHourUpdateInfo[]>();

  public constructor(protected businessHoursService : BusinessHoursService) {}
}
