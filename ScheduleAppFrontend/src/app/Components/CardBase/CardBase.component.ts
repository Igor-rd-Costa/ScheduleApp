import { Component, Input, ViewChild, ViewChildren } from '@angular/core';
import { Icon, IconType } from '../Icon/Icon.component';

@Component({
  selector: 'CardBase',
  standalone: true,
  imports: [Icon],
  templateUrl: './CardBase.component.html',
})
export class CardBase {
  @ViewChildren(Icon) icons! : Icon[];
  @Input() cardIcons : IconType[] = [];
  @Input() heading : string = "";
  @Input() minHeight : string = "7rem";
}
