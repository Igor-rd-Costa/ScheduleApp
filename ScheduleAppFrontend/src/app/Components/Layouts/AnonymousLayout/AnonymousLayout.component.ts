import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../Icon/Icon.component';
import { AppLogo } from '../AppLogo/AppLogo.component';

@Component({
  selector: 'AnonymousLayout',
  standalone: true,
  imports: [Icon, AppLogo],
  templateUrl: './AnonymousLayout.component.html',
})
export class AnonymousLayout {

  public constructor(private router : Router) {}

  GoToLoginPage() {
    this.router.navigate(['login']);
  }

  GoToBusinesses() {
    this.router.navigate(['businesses']);
  }

  GoToHome() {
    this.router.navigate(['']);
  }

  OnMouseEnter(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target === null)
      return;

    const decorator = target.getElementsByClassName('menu-item-decorator')[0];
    if (decorator === null)
      return;

    decorator.animate([{width: getComputedStyle(decorator).width}, {width: '100%'}], {duration: 100, fill: 'forwards'});
  }

  OnMouseLeave(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target === null)
      return;

    const decorator = target.getElementsByClassName('menu-item-decorator')[0];
    if (decorator === null)
      return;

    decorator.animate([{width: getComputedStyle(decorator).width}, {width: 0}], {duration: 100, fill: 'forwards'});
  }
}
