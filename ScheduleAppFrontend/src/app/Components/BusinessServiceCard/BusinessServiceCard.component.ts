import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { CardBase } from '../CardBase/CardBase.component';
import { Icon } from '../Icon/Icon.component';
import { MainButton } from '../MainButton/MainButton.component';
import { Router } from '@angular/router';

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
  @Input() serviceId : number = -1;
  @Input() canSchedule : boolean = true;
  @Input() showButton : boolean = true;
  @Output() Click = new EventEmitter<number>();

  public constructor(private router : Router) {}

  GetDurationString() {
    const hours = Math.floor(this.serviceDuration / 60);
    const minutes = this.serviceDuration % 60;
    return (hours < 10 ? "0"+hours : hours) + ":" + (minutes < 10 ? "0"+minutes : minutes);
  }

  protected OnClick() {
    this.Click.emit(this.serviceId);
  }
}
