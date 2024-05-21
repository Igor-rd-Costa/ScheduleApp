import { Component, Input } from '@angular/core';
import { CardBase } from '../CardBase/CardBase.component';
import { Icon } from '../Icon/Icon.component';
import { MainButton } from '../MainButton/MainButton.component';

@Component({
  selector: 'BusinessServiceCard',
  standalone: true,
  imports: [CardBase, Icon, MainButton],
  templateUrl: './BusinessServiceCard.component.html',
})
export class BusinessServiceCard {
  @Input() serviceName : string = "";
  @Input() serviceDescription : string = "";
  @Input() servicePrice : number|null = null;
  @Input() serviceDuration : number = 0;

  GetDurationString() {
    const hours = Math.floor(this.serviceDuration / 60);
    const minutes = this.serviceDuration % 60;
    return (hours < 10 ? "0"+hours : hours) + ":" + (minutes < 10 ? "0"+minutes : minutes);
  }
}
