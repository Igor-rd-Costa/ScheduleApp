import { AfterViewInit, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Time } from 'src/app/Utils/Time';

@Component({
  selector: 'ScheduleDayInput',
  standalone: true,
  imports: [],
  templateUrl: './ScheduleDayInput.component.html',
})
export class ScheduleDayInput implements AfterViewInit {
  Time = Time;
  protected selected = signal(false);
  @Input() date : Date = new Date(Date.now());
  @Output() Selected  = new EventEmitter<ScheduleDayInput>();
  constructor() {
    
  }

  ngAfterViewInit(): void {
  }

  GetDate() {
    return this.date;
  }

  Select() {
    if (this.selected())
      return;
    this.selected.set(true);
    this.Selected.emit(this);
  }

  Unselect() {
    this.selected.set(false);
  }

  protected MakeDate() {
    const day = this.date.getDate();
    const month = this.date.getMonth() + 1; 
    return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}`;
  }

  protected OnClick() {
    this.Select();
  }
}
