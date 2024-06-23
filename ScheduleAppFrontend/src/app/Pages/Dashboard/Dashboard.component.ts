import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChildren, signal } from '@angular/core';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { BusinessAppointments } from './BusinessAppointments/BusinessAppointments.component';
import { DashboardMenuItem } from './DashboardMenuItem/DashboardMenuItem.component';
import { DashboardHours } from './DashboardHours/DashboardHours.component';
import { DashboardEmployees } from './DashboardEmployees/DashboardEmployees.component';

@Component({
  selector: 'Dashboard',
  standalone: true,
  imports: [Icon, Heading, BusinessAppointments, DashboardHours, DashboardEmployees, DashboardMenuItem],
  templateUrl: './Dashboard.component.html',
})
export class Dashboard implements AfterViewInit {
  @ViewChildren(DashboardMenuItem) menuItems! : QueryList<DashboardMenuItem>;
  selectedIndex = signal(2);

  ngAfterViewInit(): void {
    let firstItem = this.menuItems.first.element.nativeElement;
    let lastItem = this.menuItems.last.element.nativeElement;
    if (firstItem) {
      firstItem.style.borderTopLeftRadius = '0.25rem';
      firstItem.style.borderBottomLeftRadius = '0.25rem';
      this.menuItems.last.Select();
    }

    if (lastItem) {
      lastItem.style.borderTopRightRadius = '0.25rem';
      lastItem.style.borderBottomRightRadius = '0.25rem';
    }
  }

  OnSelectionChange(selectedItem: DashboardMenuItem) {
    selectedItem.Select();
    for (let i = 0; i < this.menuItems.length; i++) {
      if (this.menuItems.get(i) === selectedItem) {
        this.selectedIndex.set(i);
      } else if (this.menuItems.get(i)?.IsSelected()) {
        this.menuItems.get(i)?.Unselect();
      }
    }
  }
}
