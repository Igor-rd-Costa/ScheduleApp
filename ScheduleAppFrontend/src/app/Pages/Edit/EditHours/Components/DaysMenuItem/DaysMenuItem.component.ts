import { WeekDay } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'DaysMenuItem',
  standalone: true,
  imports: [],
  templateUrl: './DaysMenuItem.component.html',
})
export class DaysMenuItem {
  @ViewChild('element') element! : ElementRef<HTMLElement>;  
  @Input() day : WeekDay = WeekDay.Sunday;
  isSelected = signal(false);
  @Output() Selected  = new EventEmitter<WeekDay>();

  Select() {
    this.isSelected.set(true);
  }

  UnSelect() {
    this.isSelected.set(false);
  }

  Click() {
    this.Selected.emit(this.day);
  }

  protected GetDayString(day : WeekDay) {
    switch(day) {
      case WeekDay.Sunday: return 'sun';
      case WeekDay.Monday: return 'mon';
      case WeekDay.Tuesday: return 'tue';
      case WeekDay.Wednesday: return 'wed';
      case WeekDay.Thursday: return 'thu';
      case WeekDay.Friday: return 'fri';
      case WeekDay.Saturday: return 'sat';
    }
  }
}
