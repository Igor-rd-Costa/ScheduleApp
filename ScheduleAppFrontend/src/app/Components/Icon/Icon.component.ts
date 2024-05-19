import { Component, Input } from '@angular/core';

export type IconType =  'visibility' | 'cut' | 'schedule' | 'person' | 'work' | 'store' |
                        'edit' | 'arrow_drop_down';

@Component({
  selector: 'Icon',
  standalone: true,
  imports: [],
  templateUrl: './Icon.component.html',
})
export class Icon {
  protected Icon = Icon;
  @Input() type : IconType = 'visibility';
  @Input() size : string = '24px';
}
