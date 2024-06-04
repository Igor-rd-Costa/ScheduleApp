import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Hour, Time } from 'src/app/Utils/Time';

@Component({
  selector: 'ScheduleHourInput',
  standalone: true,
  imports: [],
  templateUrl: './ScheduleHourInput.component.html',
})
export class ScheduleHourInput {
Time = Time;
@Input() time : Hour = 0;
@Output() Selected = new EventEmitter<ScheduleHourInput>();
protected selected = signal(false);
  public constructor() {}


  Select() {
    if (this.selected())
      return;
    this.selected.set(true);
    this.Selected.emit(this);
  }

  Unselect() {
    this.selected.set(false);
  }
}
