import { ChangeDetectorRef, Component, computed, ElementRef, forwardRef, Input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { Icon } from '../Icon/Icon.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'DateInput',
  standalone: true,
  imports: [Icon, ReactiveFormsModule],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateInput), multi: true}],
  templateUrl: './DateInput.component.html',
})
export class DateInput implements ControlValueAccessor, OnChanges { 
  @Input() minValue: Date|null = null;
  @Input() maxValue: Date|null = null;
  @ViewChild("selector") selector! : ElementRef<HTMLElement>;
  @ViewChild("display") display! : ElementRef<HTMLElement>;
  private _value = signal(new Date());
  private canChangeValue = true;
  private onChange = signal<(newVal: Date) => void>(() => {});
  private onTouched = signal<(newVal: Date) => void>(() => {});
  private wasTouched = false;
  protected visibleYear = signal(0);
  protected visibleMonth = signal(0);
  protected showSelector = signal(false);
  protected monthDays = computed<{offset: number, days: number[]}>(() => {
    let date = new Date(this.visibleYear(), this.visibleMonth(), 1);
    let daysInfo: {offset: number, days: number[]} = {
      offset: date.getDay(),
      days: []
    };
    for (let i = 1; date.getMonth() === this.visibleMonth(); i++) {
      daysInfo.days.push(i);
      date.setDate(date.getDate() + 1);
    }
    return daysInfo;
  });
  protected disabled = signal(false);
  protected xOffset = '0px';

  constructor() {
    this.visibleYear.set(this.value.getFullYear());
    this.visibleMonth.set(this.value.getMonth());
    document.addEventListener('click', (e) => {
        if (e.target === null)
          return;
        const target = e.target as HTMLElement;
        if (this.selector && !this.selector.nativeElement.contains(target) && this.display && !this.display.nativeElement.contains(target) && this.showSelector()) {
          this.showSelector.set(false);
        }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minValue']) {
      const date = new Date((changes['minValue'].currentValue as Date).getTime());
      if (this.value.getTime() < date.getTime()) {
        date.setDate(date.getDate() + 1);
        this._value.set(date);
      }
    }
    if (changes['maxValue']) {
      const date = new Date((changes['maxValue'].currentValue as Date).getTime());
      if (this.value.getTime() > date.getTime()) {
        date.setDate(date.getDate() - 1);
        this._value.set(date);
      }
    }
  }

  writeValue(date: Date): void {
    this._value.set(date);
  }
  registerOnChange(fn: (newVal: Date) => void): void {
    this.onChange.set(fn);
  }
  registerOnTouched(fn: (newVal: Date) => void): void {
    this.onTouched.set(fn);
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  get value() {
    return this._value();
  }

  GetSelectedDateString(): string {
    const day = this.value.getDate();
    const month = this.value.getMonth() + 1;
    const year = this.value.getFullYear();
    return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
  }

  GetMonth() {
    const months = [
      'January', 'February', "March", "Abril", "May", "June", "July", "August", "Setember", "October", "November", "December"
    ];
    return months[this.visibleMonth()];
  }

  SelectDay(day : number) {
    const date = new Date(this.visibleYear(), this.visibleMonth(), day);
    this._value.set(date);
    if (!this.wasTouched) {
      this.wasTouched = true;
      this.onTouched()(this.value);
    }
    this.onChange()(this.value);
  }

  IsDaySelectable(day: number): boolean {
    let selectable = true;
    if (this.minValue) {
      if (this.minValue.getFullYear() > this.visibleYear())
        selectable = false;
      else if (this.minValue.getFullYear() === this.visibleYear()) {
        if (this.minValue.getMonth() > this.visibleMonth())
          selectable = false;
        else if (this.minValue.getMonth() === this.visibleMonth()) {
          if (this.minValue.getDate() > day)
            selectable = false;
        }
      }
    }
    if (this.maxValue) {
      if (this.maxValue.getFullYear() < this.visibleYear())
        selectable = false;
      else if (this.maxValue.getFullYear() === this.visibleYear()) {
        if (this.maxValue.getMonth() < this.visibleMonth())
          selectable = false;
        else if (this.maxValue.getMonth() === this.visibleMonth()) {
          if (this.maxValue.getDate() < day)
            selectable = false;
        }
      }
    }
    return selectable;
  }

  OnClick() {
    this.showSelector.set(!this.showSelector());
    if (this.showSelector()) {
      const UpdateSelectorPosition = () => {
        const rect = this.selector.nativeElement.firstElementChild?.getBoundingClientRect();
        if (rect) {
          const left = rect.x;
          const width = rect.width;
          const windowWidth = window.innerWidth;
          if (left + width > windowWidth) {
            const xOffset = windowWidth - width;
            (this.selector.nativeElement as HTMLElement).style.left = (xOffset - 16) + 'px';
          }
        }
      };
      if (this.selector)
        UpdateSelectorPosition();
      else {
        setTimeout(() => {
          if (this.selector)
            UpdateSelectorPosition();
        }, 10);
      }
    }
  }

  NextMonth() {
    if (this.canChangeValue) {
      this.canChangeValue = false;
      this.visibleMonth.update(val => { return val + 1;});
      if (this.visibleMonth() > 11) {
        this.visibleYear.update(val => {return val + 1});
        this.visibleMonth.set(0);
      }
      setTimeout(() => {
        this.canChangeValue = true;
      }, 50);
    }
  }

  PreviousMonth() {
    if (this.canChangeValue) {
      this.canChangeValue = false;
      this.visibleMonth.update(val => {return val - 1});
      if (this.visibleMonth() < 0) {
        this.visibleYear.update(val => {return val - 1});
        this.visibleMonth.set(11);
      }
      setTimeout(() => {
        this.canChangeValue = true;
      }, 50);
    }
  }
}
