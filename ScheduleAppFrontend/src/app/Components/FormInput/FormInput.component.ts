import { Component, ElementRef, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type FormInputType = 'text' | 'password' | 'number' | 'price' | 'textarea' | 'select'

@Component({
  selector: 'FormInput',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FormInput), multi: true}],
  templateUrl: './FormInput.component.html',
})
export class FormInput implements ControlValueAccessor {
  @ViewChild('input') input! : ElementRef<HTMLElement>; 
  @Input() formControl : FormControl<any> | null = null;
  @Input() numberAllowDecimal = true;
  @Input() type : FormInputType = 'text';

  private _disabled = false;
  private _value : any = "";
  private OnChange = (value : any) => {};
  private OnTouched = () => {};

  get value() : any {
    return this._value;
  }

  set value(value : any) {
    this._value = value;
    this.OnChange(value);
    this.OnTouched();
  }

  get disabled() : boolean {
    return this._disabled;
  }

  set disabled(value : boolean) {
    this._disabled = value;
  }

  OnNumberkeyDown(e : KeyboardEvent) {
    const isValid = !(e.key < "0" || e.key > "9") || e.key === "Backspace" 
      || (this.numberAllowDecimal && e.key === ',' && (this.input.nativeElement as HTMLInputElement).value.indexOf(',') === -1);
    if (!isValid)
      e.preventDefault();
  }

  OnInput(event : Event) {
    this.value = (event.target as HTMLInputElement).value;
  }

  writeValue(obj: any): void {
    let val = obj;
    if (this.type === 'price' && obj !== null) {
      if (typeof val === 'number')
        val = val.toFixed(2).replace('.', ',');
    }
    this._value = val;
  }
  registerOnChange(fn: any): void {
    this.OnChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.OnTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }


  OnPriceInput(event : Event) {
    let value = (event.target as HTMLInputElement).value;
    let decimalPos = value.indexOf(',');
    if (decimalPos !== -1) {
      value = value.substring(0, decimalPos) + value.substring(decimalPos + 1);
    }
    for (let i = 0; i < value.length && decimalPos !== -1; i++) {
      if (value[i] === ',')
        break;
      if (value[i] !== '0') {
        value = value.substring(i);
        break;
      }
    }
    let l = value.length;
    if (l < 4) {
      if (l < 3) {
        value = "0" + value;
        if (l < 2)
          value = "0" + value;
      }
      value = "0" + value;
    }
    value = value.substring(0, value.length - 2) + ',' + value.substring(value.length - 2);
    this.value = value;
  }

  OnPricekeyDown(e : KeyboardEvent) {
    const isValid = !(e.key < "0" || e.key > "9") || (e.key === "Backspace" && (this.input.nativeElement as HTMLInputElement).value !== "00,00");
    if (!isValid)
      e.preventDefault();
  }
}
