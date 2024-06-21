import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { Icon } from '../../Icon/Icon.component';

@Component({
  selector: 'NotificationItem',
  standalone: true,
  imports: [Icon],
  templateUrl: './NotificationItem.component.html',
  styles: '#notification-close-button, #notification-unseen-icon { transition: opacity 0.2s; }'
})
export class NotificationItem {
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
