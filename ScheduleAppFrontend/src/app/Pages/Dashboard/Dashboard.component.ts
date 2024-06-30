import { AfterViewInit, Component, QueryList, ViewChildren, signal } from '@angular/core';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { DashboardAppointments } from './DashboardAppointments/DashboardAppointments.component';
import { DashboardMenuItem } from './DashboardMenuItem/DashboardMenuItem.component';
import { DashboardHours } from './DashboardHours/DashboardHours.component';
import { DashboardEmployees } from './DashboardEmployees/DashboardEmployees.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardServices } from './DashboardServices/DashboardServices.component';
import { DashboardHistory } from './DashboardHistory/DashboardHistory.component';

@Component({
  selector: 'Dashboard',
  standalone: true,
  imports: [Icon, Heading, DashboardAppointments, DashboardServices, DashboardHours, DashboardEmployees, DashboardMenuItem, DashboardHistory],
  templateUrl: './Dashboard.component.html',
})
export class Dashboard implements AfterViewInit {
  @ViewChildren(DashboardMenuItem) menuItems! : QueryList<DashboardMenuItem>;
  menuItem = signal('');
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      const param = (queryParams as {menuItem: string}).menuItem;
      if (param !== "appointments" && param !== "history" && param !== "services" && param !== "hours" && param !== "employees") {
        this.router.navigate(['dashboard'], {queryParams: {menuItem: "appointments"}});
        return;
      } else {
        this.menuItem.set(param);
      }
    });
  }

  ngAfterViewInit(): void {
    let firstItem = this.menuItems.first.element.nativeElement;
    let lastItem = this.menuItems.last.element.nativeElement;
    if (firstItem) {
      firstItem.style.borderTopLeftRadius = '0.25rem';
      firstItem.style.borderBottomLeftRadius = '0.25rem';
    }

    if (lastItem) {
      lastItem.style.borderTopRightRadius = '0.25rem';
      lastItem.style.borderBottomRightRadius = '0.25rem';
    }
    const itemId = this.menuItem();
    for (let i = 0; i < this.menuItems.length; i++) {
      if (this.menuItems.get(i)?.itemId === itemId) {
        this.menuItems.get(i)?.Select();
      }
    }
  }

  OnSelectionChange(selectedItem: DashboardMenuItem) {
    selectedItem.Select();
    for (let i = 0; i < this.menuItems.length; i++) {
      if (this.menuItems.get(i) === selectedItem) {
        this.router.navigate(['dashboard'], {queryParams: {menuItem: this.menuItems.get(i)?.itemId ?? "appointments"}});
      } else if (this.menuItems.get(i)?.IsSelected()) {
        this.menuItems.get(i)?.Unselect();
      }
    }
  }

  GoToBusiness() {
    this.router.navigate(['business']);
  }
}
