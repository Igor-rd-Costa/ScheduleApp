import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { DateInput } from 'src/app/Components/DateInput/DateInput.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import {CenterCardWrapper} from 'src/app/Utils/CenterCardWrapper';
import { FilterAppointments, IsValidDateParamString, DateParamStringToDate, DateToDateParamString } from 'src/app/Utils/DateFilterHelpers';


@Component({
  selector: 'Home',
  standalone: true,
  imports: [MinimizableCard, Icon, AppointmentCard, MainButton, DateInput, ReactiveFormsModule],
  templateUrl: './Home.component.html',
})
export class Home implements AfterViewInit {
  @ViewChild('card') wrapper! : ElementRef<HTMLElement>;
  
  protected appointments : AppointmentInfo[] = [];
  protected filteredAppointments: AppointmentInfo[] = [];
  protected filterForm = new FormGroup({
    StartDate: new FormControl<Date>(new Date()),
    EndDate: new FormControl<Date>(new Date())
  });
  protected startDateMinValue = new Date();

  aaa = "";
  public constructor(private scheduleService : ScheduleService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (!IsValidDateParamString(params['from']) || !IsValidDateParamString(params['to'])) {
        let date = new Date();
        let from = new Date(date.getTime());
        date.setMonth(11, 31);
        let to = new Date(date.getTime());
        if (IsValidDateParamString(params['from']))
          from = DateParamStringToDate(params['from']);
        if (IsValidDateParamString(params['to']))
          to = DateParamStringToDate(params['to']); 
        this.router.navigate(['home'], {queryParams: {from: DateToDateParamString(from), to: DateToDateParamString(to)}});
      } else {
        const from = DateParamStringToDate(params['from']);
        let to = DateParamStringToDate(params['to']);
        if (to.getTime() < from.getTime()) {
          to = from;
          this.router.navigate(['home'], {queryParams: {from: DateToDateParamString(from), to: DateToDateParamString(to)}});
          return;
        }
        this.filterForm.controls.StartDate.setValue(from, {emitEvent: false});
        this.filterForm.controls.EndDate.setValue(to, {emitEvent: false});
        this.filteredAppointments = FilterAppointments(
          this.filterForm.controls.StartDate.value,
          this.filterForm.controls.EndDate.value,
          this.appointments
        );
      }
    });
  }
  ngAfterViewInit(): void {
    CenterCardWrapper(this.wrapper.nativeElement);
    this.scheduleService.GetAppointments().then(appointments => {
      this.scheduleService.GetAppointmentInfo(appointments).then(info => {
        this.appointments = info;
        this.filteredAppointments = FilterAppointments(
          this.filterForm.controls.StartDate.value,
          this.filterForm.controls.EndDate.value,
          this.appointments
        );
      });
    });
    window.addEventListener('resize', () => {
      CenterCardWrapper(this.wrapper.nativeElement);
    });
    this.filterForm.controls.StartDate.valueChanges.subscribe(newVal => {
      if (newVal && this.filterForm.controls.EndDate.value)
        this.router.navigate(
          ['home'], 
          {queryParams: {
            from: DateToDateParamString(newVal), 
            to: DateToDateParamString(this.filterForm.controls.EndDate.value)
      }});
    });
    this.filterForm.controls.EndDate.valueChanges.subscribe(newVal => {
      if (newVal && this.filterForm.controls.StartDate.value)
        this.router.navigate(
          ['home'], 
          {queryParams: {
            from: DateToDateParamString(this.filterForm.controls.StartDate.value), 
            to: DateToDateParamString(newVal)
      }});
    });
  }
}
