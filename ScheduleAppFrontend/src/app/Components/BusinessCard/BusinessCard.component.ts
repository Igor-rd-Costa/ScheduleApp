import { Component, Input } from '@angular/core';
import { Icon } from '../Icon/Icon.component';
import { Router } from '@angular/router';
import { CardBase } from '../CardBase/CardBase.component';

@Component({
  selector: 'BusinessCard',
  standalone: true,
  imports: [Icon, CardBase],
  templateUrl: './BusinessCard.component.html',
})
export class BusinessCard {
  @Input() businessName : string = "";
  @Input() businessDescription : string = "";
  @Input() customUrl : string = "";

  public constructor(private router : Router) {}

  GoToBusiness() {
    this.router.navigate(['business', this.customUrl]);
  }
}
