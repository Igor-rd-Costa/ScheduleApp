import { Component, EventEmitter, Input, Output, input } from '@angular/core';

@Component({
  selector: 'MainButton',
  standalone: true,
  imports: [],
  templateUrl: './MainButton.component.html',
})
export class MainButton {
  @Input() disabled : boolean = false;
  @Output() Click = new EventEmitter();

  OnClick() {
    this.Click.emit();
  }
}
