import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CardBase } from '../CardBase/CardBase.component';
import { MessageType } from '../PopUpMessageBox/PopUpMessageBox.component';
import { Icon } from '../Icon/Icon.component';

@Component({
  selector: 'PopDownMessageBox',
  standalone: true,
  imports: [CardBase, Icon],
  templateUrl: './PopDownMessageBox.component.html',
})
export class PopDownMessageBox {
  @ViewChild('messageBox') box! : ElementRef<HTMLElement>;
  MessageType = MessageType;
  visible = signal(false);
  heading = signal('');
  messageType = signal(MessageType.INFO);
  message = signal('');
  isBeingManuallyHidden = signal(false);

  protected OnClick() {
    if (!this.visible() || this.isBeingManuallyHidden())
      return;
    const box = this.box.nativeElement;
    if (!box)
      return;
    this.isBeingManuallyHidden.set(true);
    const top = getComputedStyle(box).top;
    box.animate([{top: top}, {top: '-10%'}], {fill: 'forwards', duration: 300}).addEventListener('finish', () => {
      this.isBeingManuallyHidden.set(false);
      this.visible.set(false);
    });
  }

  Show(messageType : MessageType, message : string, durationSeconds : number) {
    this.messageType.set(messageType);
    this.message.set(message);
    this.visible.set(true);
    const box = this.box.nativeElement;
    if (!box) {
      this.visible.set(false);
      return;
    }

    const animation = box.animate([{top: '-10%'}, {top: '2rem'}], {fill: 'forwards', duration: 300});
    animation.addEventListener('finish', () => {
      if (this.isBeingManuallyHidden())
        return;
      setTimeout(() => {
        if (this.isBeingManuallyHidden())
          return;
        box.animate([{top: '2rem'}, {top: '-10%'}], {fill: 'forwards', duration: 300}).addEventListener('finish', () => {
          this.visible.set(false);
        });
      }, durationSeconds * 1000);
    });
  }

  protected GetTextColor() {
    const colors = ['#DDDDDD', 'rgb(190,18,18)', '#B58844'];
    const color = colors[this.messageType()];
    return color;
  }
}
