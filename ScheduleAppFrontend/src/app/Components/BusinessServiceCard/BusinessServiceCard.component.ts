import { Component } from '@angular/core';
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

}
