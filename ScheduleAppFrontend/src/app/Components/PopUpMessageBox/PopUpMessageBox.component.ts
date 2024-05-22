import { Component, signal } from '@angular/core';
import { CardBase } from '../CardBase/CardBase.component';
import { MainButton } from '../MainButton/MainButton.component';
import { SecondaryButton } from '../SecondaryButton/SecondaryButton.component';
import { App } from 'src/app/App.component';

export enum MessageType {
  INFO, ERROR
}

enum MessageBoxType {
  YES_NO, OK, YES_CANCEL,
}

@Component({
  selector: 'PopUpMessageBox',
  standalone: true,
  imports: [CardBase, MainButton, SecondaryButton],
  templateUrl: './PopUpMessageBox.component.html',
})
export class PopUpMessageBox {
  MessageBoxType  = MessageBoxType;
  MessageType = MessageType;
  visible = signal(false);
  boxType = signal(MessageBoxType.YES_CANCEL);
  messageType = signal(MessageType.INFO);
  heading = signal("");
  message = signal("");
  resolveFn : ((val : boolean | PromiseLike<boolean>) => void) | null = null;

  MainButtonClick() {
    this.visible.set(false);
    App.UnBlur();
    if (this.resolveFn)
      this.resolveFn(true);
  }
  
  SecondaryButtonClick() {
    this.visible.set(false);
    App.UnBlur();
    if (this.resolveFn)
      this.resolveFn(false);
  }

  YesNo(msgType : MessageType, heading : string, message : string) {
    return this.Show(MessageBoxType.YES_NO, msgType, heading, message);
  }

  Ok(msgType : MessageType, heading : string, message : string) {
    return this.Show(MessageBoxType.OK, msgType, heading, message);
  }

  YesCancel(msgType : MessageType, heading : string, message : string) {
    return this.Show(MessageBoxType.YES_CANCEL, msgType, heading, message);
  }


  private Show(boxType : MessageBoxType, msgType : MessageType, heading : string, message : string) {
    this.boxType.set(boxType);
    this.messageType.set(msgType);
    this.heading.set(heading);
    this.message.set(message);
    this.visible.set(true);
    App.Blur();
    return new Promise<boolean>(resolve => {
      this.resolveFn = resolve;
    });
  }
}
