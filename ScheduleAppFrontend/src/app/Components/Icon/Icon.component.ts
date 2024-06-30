import { Component, ElementRef, Input, ViewChild } from '@angular/core';

export type IconType =  'visibility' | 'cut' | 'schedule' | 'person' | 'work' | 'store' |
                        'edit' | 'arrow_drop_down' | 'add' | 'delete' | 'search' | 'home' | 
                        'bedtime' | 'sunny' | 'partly_cloudy_day' | 'partly_cloudy_night' |
                        'save' | 'transition_slide' | 'keyboard_arrow_left' | 'keyboard_arrow_right' |
                        'keyboard_arrow_up' | 'keyboard_arrow_down' | 'location_on' | 'payments' |
                        'logout' | 'notifications' | 'notifications_active' | 'calendar_month' | 'event_available' |
                        'calendar_clock';

@Component({
  selector: 'Icon',
  standalone: true,
  imports: [],
  templateUrl: './Icon.component.html',
})
export class Icon {
  protected Icon = Icon;
  @ViewChild('element') element! : ElementRef<HTMLElement>;
  @Input() type : IconType = 'visibility';
  @Input() size : string = '24px';
}
