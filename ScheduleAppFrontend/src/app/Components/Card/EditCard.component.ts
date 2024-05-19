import { Component, Input } from '@angular/core';
import { Icon } from '../Icon/icon.component';

@Component({
  selector: 'EditCard',
  standalone: true,
  imports: [Icon],
  templateUrl: './EditCard.component.html',
})
export class EditCard {
  @Input() header : string = "";
  @Input() OnEdit : () => void = () => {};
}
