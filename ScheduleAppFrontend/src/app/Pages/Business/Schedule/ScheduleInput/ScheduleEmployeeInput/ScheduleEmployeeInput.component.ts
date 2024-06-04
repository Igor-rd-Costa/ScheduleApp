import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { User } from 'src/app/Services/AuthService';
import { EmployeeCard } from './EmployeeCard/EmployeeCard.component';
import BusinessService from 'src/app/Services/BusinessService';

@Component({
  selector: 'ScheduleEmployeeInput',
  standalone: true,
  imports: [Icon, EmployeeCard],
  templateUrl: './ScheduleEmployeeInput.component.html',
})
export class ScheduleEmployeeInput implements AfterViewInit {
  @ViewChild('arrowLeft') arrowLeft! : Icon;
  @ViewChild('arrowRight') arrowRight! : Icon;
  @ViewChild('employeesWrapper') employeesWrapper! : ElementRef<HTMLElement>;
  @Input() businessId : string = "";
  @Output() Selected = new EventEmitter<User>();
  businessEmployees : User[] = [];
  selectedEmployee : EmployeeCard | null = null;

  constructor(private businessService : BusinessService) {}

  ngAfterViewInit(): void {
    const left = this.arrowLeft.element.nativeElement;
    const right = this.arrowRight.element.nativeElement;

    left.style.cursor = 'pointer';
    left.addEventListener('click', this.OnArrowLeftClick.bind(this));
    
    right.style.cursor = 'pointer';
    right.addEventListener('click', this.OnArrowRightClick.bind(this));

    this.businessService.GetBusinessEmployees(this.businessId).then(employees => {
      this.businessEmployees = employees;
    })
  }

  OnClick() {

  }

  OnArrowLeftClick() {
    const w = parseFloat(getComputedStyle(this.employeesWrapper.nativeElement).width);
    const itemWidth = (4 * 16);
    const gap = (0.5 * 16);

    let total = 0;
    while (total < w) {
      total += itemWidth + gap;
    }
    this.employeesWrapper.nativeElement.scrollBy({left: -total, behavior: 'smooth'});
  }

  OnArrowRightClick() {
    const w = parseFloat(getComputedStyle(this.employeesWrapper.nativeElement).width);
    const itemWidth = (4 * 16);
    const gap = (0.5 * 16);

    let total = 0;
    while (total < w) {
      total += itemWidth + gap;
    }
    this.employeesWrapper.nativeElement.scrollBy({left: total, behavior: 'smooth'});
  }

  OnEmployeeSelect(target : EmployeeCard) {
    if (this.selectedEmployee)
      this.selectedEmployee.Unselect();
    this.selectedEmployee = target;
    this.Selected.emit(target.employee);
  }
}
