import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'SecondaryButton',
  standalone: true,
  imports: [],
  templateUrl: './SecondaryButton.component.html',
})
export class SecondaryButton {
  @Output() Click = new EventEmitter();

  OnClick() {
    this.Click.emit();
  }
}
