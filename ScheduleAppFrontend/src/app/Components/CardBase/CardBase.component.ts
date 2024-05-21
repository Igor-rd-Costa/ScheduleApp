import { Component, Input, ViewChild } from '@angular/core';
import { Icon, IconType } from '../Icon/Icon.component';

@Component({
  selector: 'CardBase',
  standalone: true,
  imports: [Icon],
  templateUrl: './CardBase.component.html',
})
export class CardBase {
  @ViewChild(Icon) icon! : Icon;
  @Input() cardIcon : IconType = 'visibility';
  @Input() heading : string = "";
  @Input() minHeight : string = "7rem";
}
