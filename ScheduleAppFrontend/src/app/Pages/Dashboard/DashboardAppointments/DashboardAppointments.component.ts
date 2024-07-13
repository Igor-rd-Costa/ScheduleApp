import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { DateInput } from 'src/app/Components/DateInput/DateInput.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import AuthService from 'src/app/Services/AuthService';
import BusinessService from 'src/app/Services/BusinessService';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import {CenterCardWrapper} from 'src/app/Utils/CenterCardWrapper';
import FilterAppointments from 'src/app/Utils/FilterAppointments';

@Component({
  selector: 'DashboardAppointments',
  standalone: true,
  imports: [Heading, AppointmentCard, DateInput, ReactiveFormsModule],
  templateUrl: './DashboardAppointments.component.html',
})
export class DashboardAppointments implements AfterViewInit {
  @ViewChild('card') wrapper!: ElementRef<HTMLElement>
  appointments = signal<AppointmentInfo[]>([]);
  protected filteredAppointments: AppointmentInfo[] = [];
  protected filterForm = new FormGroup({
    StartDate: new FormControl<Date>(new Date()),
    EndDate: new FormControl<Date>(new Date())
  });
  protected startDateMinValue = new Date();

  constructor(private authService: AuthService, private businessService: BusinessService, private scheduleService: ScheduleService, private router: Router) {
    if (this.authService.GetLoggedBusiness() === null)
      this.router.navigate(['profile']);
    window.addEventListener('resize', () => {
      CenterCardWrapper(this.wrapper.nativeElement);
    });
    const endDate = new Date();
    endDate.setMonth(11, 31);
    this.filterForm.controls.EndDate.setValue(endDate);
    this.filterForm.controls.StartDate.valueChanges.subscribe(_ => {
      this.filteredAppointments = FilterAppointments(
        this.filterForm.controls.StartDate.value,
        this.filterForm.controls.EndDate.value,
        this.appointments()
      );
    });
    this.filterForm.controls.EndDate.valueChanges.subscribe(_ => {
      this.filteredAppointments = FilterAppointments(
        this.filterForm.controls.StartDate.value,
        this.filterForm.controls.EndDate.value,
        this.appointments()
      );
    });
  }

  ngAfterViewInit(): void {
      this.businessService.GetAppointments().then(appointments => {
        this.scheduleService.GetAppointmentInfo(appointments).then(info => {
          this.appointments.set(info)
          this.filteredAppointments = FilterAppointments(
            this.filterForm.controls.StartDate.value,
            this.filterForm.controls.EndDate.value,
            this.appointments()
          );
        });
      });
      CenterCardWrapper(this.wrapper.nativeElement);
  }
}
