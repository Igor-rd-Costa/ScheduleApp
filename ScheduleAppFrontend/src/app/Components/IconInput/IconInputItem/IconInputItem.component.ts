import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Icon, IconType } from '../../Icon/Icon.component';

@Component({
  selector: 'IconInputItem',
  standalone: true,
  imports: [Icon],
  templateUrl: './IconInputItem.component.html',
})
export class IconInputItem {
  @Input() value: IconType|null = null;
  @Input() selected = false;
  @Output() Select = new EventEmitter<IconType|null>();

  OnClick() {
    this.Select.emit(this.value);
  }
}
