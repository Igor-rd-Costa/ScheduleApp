import { Component, Input } from '@angular/core';

@Component({
  selector: 'SecondaryButton',
  standalone: true,
  imports: [],
  templateUrl: './SecondaryButton.component.html',
})
export class SecondaryButton {
  @Input() OnClick : (event : MouseEvent) => void = () => {};
}
