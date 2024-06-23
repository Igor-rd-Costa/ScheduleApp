import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { User } from 'src/app/Services/AuthService';
import BusinessService from 'src/app/Services/BusinessService';
import { EmployeeCard } from '../../Business/Schedule/ScheduleInput/ScheduleEmployeeInput/EmployeeCard/EmployeeCard.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';

@Component({
  selector: 'DashboardEmployees',
  standalone: true,
  imports: [Heading, EmployeeCard, Icon, MainButton],
  templateUrl: './DashboardEmployees.component.html',
})
export class DashboardEmployees implements AfterViewInit {
  @ViewChild('card') wrapper!: ElementRef<HTMLElement>
  protected employees = signal<User[]>([]);

  constructor(private businessService: BusinessService) {}

  ngAfterViewInit(): void {
    this.businessService.GetBusinessEmployees(null).then(employees => {
      this.employees.set(employees);
    });

    const wrapper = this.wrapper.nativeElement;
    let width = parseFloat(getComputedStyle(wrapper).width);
    let count = 0;
    while(width > (5 * 16)) {
      width -= (5 * 16);
      count++;
    }
    wrapper.style.paddingLeft = width / count + "px";
    wrapper.style.paddingRight = width / count + "px";
    wrapper.style.columnGap = width / count + '';
  }
}
