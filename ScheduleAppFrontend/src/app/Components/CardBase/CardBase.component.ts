import { Component, Input } from '@angular/core';
import { Icon, IconType } from '../Icon/Icon.component';

@Component({
  selector: 'CardBase',
  standalone: true,
  imports: [Icon],
  templateUrl: './CardBase.component.html',
})
export class CardBase {
  @Input() cardIcon : IconType = 'visibility';
  @Input() heading : string = "";
}
