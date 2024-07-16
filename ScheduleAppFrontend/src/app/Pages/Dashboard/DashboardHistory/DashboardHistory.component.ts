import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { DateInput } from 'src/app/Components/DateInput/DateInput.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import BusinessService from 'src/app/Services/BusinessService';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import { CenterCardWrapper } from 'src/app/Utils/CenterCardWrapper';
import {DateParamStringToDate, DateToDateParamString, FilterAppointments, IsValidDateParamString} from 'src/app/Utils/DateFilterHelpers';

@Component({
  selector: 'DashboardHistory',
  standalone: true,
  imports: [Heading, AppointmentCard, DateInput, ReactiveFormsModule],
  templateUrl: './DashboardHistory.component.html',
})
export class DashboardHistory implements AfterViewInit {
  @ViewChild('card') wrapper!: ElementRef<HTMLElement>
  pastAppointments = signal<AppointmentInfo[]>([]);
  protected filteredAppointments: AppointmentInfo[] = [];
  protected filterForm = new FormGroup({
    StartDate: new FormControl<Date>(new Date()),
    EndDate: new FormControl<Date>(new Date())
  });

  constructor(private businessService: BusinessService, private scheduleService: ScheduleService,
    private activatedRoute: ActivatedRoute, private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['menuItem'] !== 'history')
        return;
      if (!IsValidDateParamString(params['from']) || !IsValidDateParamString(params['to'])) {
        let date = new Date();
        date.setMonth(0, 1);
        let from = new Date(date.getTime());
        date.setMonth(11, 31);
        let to = new Date(date.getTime());
        if (IsValidDateParamString(params['from']))
          from = DateParamStringToDate(params['from']);
        if (IsValidDateParamString(params['to']))
          to = DateParamStringToDate(params['to']); 
        this.router.navigate(
          ['dashboard'], 
          {queryParams: {
            menuItem: 'history', 
            from: DateToDateParamString(from), 
            to: DateToDateParamString(to)
        }});
      } else {
        const from = DateParamStringToDate(params['from']);
        let to = DateParamStringToDate(params['to']);
        if (to.getTime() < from.getTime()) {
          to = from;
          this.router.navigate(
            ['dashboard'], 
            {queryParams: {
              menuItem: 'history', 
              from: DateToDateParamString(from), 
              to: DateToDateParamString(to)
          }});
          return;
        }
        this.filterForm.controls.StartDate.setValue(from, {emitEvent: false});
        this.filterForm.controls.EndDate.setValue(to, {emitEvent: false});
        this.filteredAppointments = FilterAppointments(
          this.filterForm.controls.StartDate.value,
          this.filterForm.controls.EndDate.value,
          this.pastAppointments()
        );
      }
    });
  }
  
  ngAfterViewInit(): void {
    CenterCardWrapper(this.wrapper.nativeElement);
    this.businessService.GetPastAppointments().then(pa => {
      this.scheduleService.GetAppointmentInfo(pa).then(info => {
        this.pastAppointments.set(info);
        this.filteredAppointments = FilterAppointments(
          this.filterForm.controls.StartDate.value,
          this.filterForm.controls.EndDate.value,
          this.pastAppointments()
        );
      });
    });
    window.addEventListener('resize', () => {
      CenterCardWrapper(this.wrapper.nativeElement);
    });
    const startDate = new Date();
    const endDate = new Date();
    startDate.setMonth(0, 1);
    endDate.setMonth(11, 31);
    this.filterForm.controls.StartDate.setValue(startDate);
    this.filterForm.controls.EndDate.setValue(endDate);
    this.filterForm.controls.StartDate.valueChanges.subscribe(newVal => {
      if (newVal && this.filterForm.controls.EndDate.value)
        this.router.navigate(
          ['dashboard'], 
          {queryParams: {
            menuItem: 'history',
            from: DateToDateParamString(newVal),
            to: DateToDateParamString(this.filterForm.controls.EndDate.value)
      }});
    });
    this.filterForm.controls.EndDate.valueChanges.subscribe(newVal => {
      if (newVal && this.filterForm.controls.StartDate.value)
        this.router.navigate(
          ['dashboard'], 
          {queryParams: {
            menuItem: 'history',
            from: DateToDateParamString(this.filterForm.controls.StartDate.value),
            to: DateToDateParamString(newVal)
      }});
    });
  }
}
