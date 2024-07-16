import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { DateInput } from 'src/app/Components/DateInput/DateInput.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import AuthService from 'src/app/Services/AuthService';
import BusinessService from 'src/app/Services/BusinessService';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import {CenterCardWrapper} from 'src/app/Utils/CenterCardWrapper';
import { DateParamStringToDate, DateToDateParamString, FilterAppointments, IsValidDateParamString } from 'src/app/Utils/DateFilterHelpers';

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

  constructor(private authService: AuthService, private businessService: BusinessService, private scheduleService: ScheduleService, 
    private activatedRoute: ActivatedRoute, private router: Router) {
    if (this.authService.GetLoggedBusiness() === null)
      this.router.navigate(['profile']);
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['menuItem'] !== 'appointments')
        return;
      if (!IsValidDateParamString(params['from']) || !IsValidDateParamString(params['to'])) {
        let date = new Date();
        let from = new Date(date.getTime());
        date.setMonth(11, 31);
        let to = new Date(date.getTime());
        if (IsValidDateParamString(params['from']))
          from = DateParamStringToDate(params['from']);
        if (IsValidDateParamString(params['to']))
          to = DateParamStringToDate(params['to']); 
        this.router.navigate(['dashboard'], {queryParams: {menuItem: 'appointments', from: DateToDateParamString(from), to: DateToDateParamString(to)}});
      } else {
        const from = DateParamStringToDate(params['from']);
        let to = DateParamStringToDate(params['to']);
        if (to.getTime() < from.getTime()) {
          to = from;
          this.router.navigate(['dashboard'], {queryParams: {menuItem: 'appointments', from: DateToDateParamString(from), to: DateToDateParamString(to)}});
          return;
        }
        this.filterForm.controls.StartDate.setValue(from, {emitEvent: false});
        this.filterForm.controls.EndDate.setValue(to, {emitEvent: false});
        this.filteredAppointments = FilterAppointments(
          this.filterForm.controls.StartDate.value,
          this.filterForm.controls.EndDate.value,
          this.appointments()
        );
      }
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
      window.addEventListener('resize', () => {
        CenterCardWrapper(this.wrapper.nativeElement);
      });
      this.filterForm.controls.StartDate.valueChanges.subscribe(newVal => {
        if (newVal && this.filterForm.controls.EndDate.value)
          this.router.navigate(
            ['dashboard'], 
            {queryParams: {
              menuItem: 'appointments',
              from: DateToDateParamString(newVal),
              to: DateToDateParamString(this.filterForm.controls.EndDate.value)
        }});
      });
      this.filterForm.controls.EndDate.valueChanges.subscribe(newVal => {
        if (newVal && this.filterForm.controls.StartDate.value)
          this.router.navigate(
            ['dashboard'], 
            {queryParams: {
              menuItem: 'appointments',
              from: DateToDateParamString(this.filterForm.controls.StartDate.value),
              to: DateToDateParamString(newVal)
        }});
      });
  }
}
