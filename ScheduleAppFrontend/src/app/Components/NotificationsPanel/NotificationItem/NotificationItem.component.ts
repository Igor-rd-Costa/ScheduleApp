import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, signal } from '@angular/core';
import { Icon } from '../../Icon/Icon.component';

@Component({
  selector: 'NotificationItem',
  standalone: true,
  imports: [Icon],
  templateUrl: './NotificationItem.component.html',
  styles: '#notification-close-button, #notification-unseen-icon { transition: opacity 0.2s; }'
})
export class NotificationItem implements OnChanges {
  @ViewChild('notificationWrapper') notificationWrapper! : ElementRef<HTMLElement> 
  @ViewChild('notification') notification! : ElementRef<HTMLElement>
  @ViewChild('bottomBorder') bottomBorder! : ElementRef<HTMLElement>
  @ViewChild('closeButton') closeButton! : ElementRef<HTMLElement>
  @ViewChild('unseenIcon') unseenIcon! : ElementRef<HTMLElement>

  @Input() notificationId : number = 0;
  @Input() heading : string = "";
  @Input() time : Date = new Date(0)
  @Input() visualized : boolean = false;
  @Output() Close = new EventEmitter<NotificationItem>()
  protected timeDif: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['time']) {
      let time = Math.floor((Date.now() - new Date(this.time).getTime()) / 1000);
      if (time < 1) {
        this.timeDif = 'less than a second ago.';
        return;
      } else if (time < 60) {
        this.timeDif = `${time} second${time > 1 ? 's' : ''} ago.`;
        return;
      }
      time = Math.floor(time / 60);
      if (time < 60) {
        this.timeDif = `${time} minute${time > 1 ? 's' : ''} ago.`;
        return;
      }
      time = Math.floor(time / 60);
      if (time < 24) {
        this.timeDif = `${time} hour${time > 1 ? 's' : ''} ago.`;
        return;
      }
      time = Math.floor(time / 24);
      if (time < 365) {
        this.timeDif = `${time} day${time > 1 ? 's' : ''} ago.`;
        return;
      }
      time = Math.floor(time / 365);
      this.timeDif = `${time} year${time > 1 ? 's' : ''} ago.`;
    }   
  }

  MarkAsSeen() {
    this.unseenIcon.nativeElement.animate([{opacity: '1'}, {opacity: '0'}], {fill: 'forwards', duration: 200}).addEventListener('finish', () => {
      this.visualized = true;
    })
  }

  OnClick(event : MouseEvent) {
    if ((event.target as HTMLElement).id !== 'notification-close-button') {
      
    }
  }

  OnMouseEnter() {
    if (!this.visualized)
      this.MarkAsSeen()

    this.closeButton.nativeElement.style.opacity = '1';
  }

  OnMouseLeave() {
    this.closeButton.nativeElement.style.opacity = '0';
  }

  CloseNotification() {
    const n = this.notification.nativeElement;
    this.bottomBorder.nativeElement.animate([{opacity: '1'}, {opacity: '0'}], {fill: 'forwards', duration: 300})
    n.animate([{left: '0px'}, {left: '110%'}], {fill: 'forwards', duration: 300}).addEventListener('finish', () => {
      this.notificationWrapper.nativeElement.animate([{height: getComputedStyle(n).height}, {height: '0px'}], {fill: 'forwards', duration: 300})
      .addEventListener('finish', ()=>{
        this.Close.emit(this);
      })
    });
  }
}
