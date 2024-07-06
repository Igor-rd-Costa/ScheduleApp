import { Component, forwardRef, Input, signal } from '@angular/core';
import { Icon, IconType } from '../Icon/Icon.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IconInputItem } from './IconInputItem/IconInputItem.component';

type IconCategory = {
  name: string,
  icons: (IconType|null)[]
}

const iconInputIcons: IconCategory[] = [
  {
    name: "Icons",
    icons: [null, 'visibility', 'logout', 'location_on', 'sunny', 'cut', 'store', 'person']
  }
];

@Component({
  selector: 'IconInput',
  standalone: true,
  imports: [Icon, IconInputItem, ReactiveFormsModule],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IconInput), multi: true}],
  templateUrl: './IconInput.component.html',
})
export class IconInput implements ControlValueAccessor {
  protected iconInputIcons = iconInputIcons;
  private _value: IconType|null = null;
  private _onChange: (newVal: IconType|null) => void = () => {};
  private _onTouched: (newVal: IconType|null) => void = () => {};
  private _touched = false;
  protected showIconList = signal(false);
  @Input() disabled = false;

  get value() : IconType|null {
    return this._value;
  }

  constructor() {
    document.addEventListener('click', (e) => {
      if (e.target === null)
        return;
      const target = e.target as HTMLElement;
      if (!target.closest('#icon-input-button') && !target.closest("#icon-input-menu")) {
        this.showIconList.set(false);
      }
    })
  }
  writeValue(obj: IconType): void {
    this._value = obj;
  }
  registerOnChange(fn: (newVal: IconType|null) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: (newVal: IconType|null) => void): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  OnSelect(value: IconType|null) {
    this._value = value;
    if (!this._touched) {
      this._touched = true;
      this._onTouched(value);
    }
    this._onChange(value);
    this.showIconList.set(false);
  }

  ToggleIconList() {
    this.showIconList.set(!this.showIconList());
  }
}
