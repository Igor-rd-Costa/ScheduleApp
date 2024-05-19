import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'MainButton',
  standalone: true,
  imports: [],
  templateUrl: './MainButton.component.html',
})
export class MainButton {
  @Input() disabled : boolean = false;
  @Input() OnClick : (event : MouseEvent) => void = () => {};
}
