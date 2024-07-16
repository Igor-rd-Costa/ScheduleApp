import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { DateInput } from 'src/app/Components/DateInput/DateInput.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import { CenterCardWrapper } from 'src/app/Utils/CenterCardWrapper';
import {DateParamStringToDate, DateToDateParamString, FilterAppointments, IsValidDateParamString} from 'src/app/Utils/DateFilterHelpers';

@Component({
  selector: 'History',
  standalone: true,
  imports: [Heading, Icon, AppointmentCard, DateInput, ReactiveFormsModule],
  templateUrl: './History.component.html',
})
export class History implements AfterViewInit {
  @ViewChild('card') wrapper! : ElementRef<HTMLElement>;
  pastAppointments = signal<AppointmentInfo[]>([]);
  protected filteredAppointments: AppointmentInfo[] = [];
  protected filterForm = new FormGroup({
    StartDate: new FormControl<Date>(new Date()),
    EndDate: new FormControl<Date>(new Date())
  });

  public constructor(private router : Router, private scheduleService : ScheduleService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
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
        this.router.navigate(['history'], {queryParams: {from: DateToDateParamString(from), to: DateToDateParamString(to)}});
      } else {
        const from = DateParamStringToDate(params['from']);
        let to = DateParamStringToDate(params['to']);
        if (to.getTime() < from.getTime()) {
          to = from;
          this.router.navigate(['history'], {queryParams: {from: DateToDateParamString(from), to: DateToDateParamString(to)}});
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
    this.scheduleService.GetPastAppointments().then(appointments => {
      this.scheduleService.GetAppointmentInfo(appointments).then(info => {
        this.pastAppointments.set(info);
        this.filteredAppointments = FilterAppointments(
          this.filterForm.controls.StartDate.value,
          this.filterForm.controls.EndDate.value,
          this.pastAppointments()
        );
      });
    })
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
          ['history'], 
          {queryParams: {
            from: DateToDateParamString(newVal), 
            to: DateToDateParamString(this.filterForm.controls.EndDate.value)
      }});
    });
    this.filterForm.controls.EndDate.valueChanges.subscribe(newVal => {
      if (newVal && this.filterForm.controls.StartDate.value)
        this.router.navigate(
          ['history'], 
          {queryParams: {
            from: DateToDateParamString(this.filterForm.controls.StartDate.value), 
            to: DateToDateParamString(newVal)
      }});
    });
}

  GoToProfile() {
    this.router.navigate(['profile']);
  }
}
