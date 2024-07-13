import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { DateInput } from 'src/app/Components/DateInput/DateInput.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import {CenterCardWrapper} from 'src/app/Utils/CenterCardWrapper';
import FilterAppointments from 'src/app/Utils/FilterAppointments';
import { Time } from 'src/app/Utils/Time';


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

  public constructor(private scheduleService : ScheduleService) {
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
    const date = new Date();
    date.setMonth(11, 31);
    this.filterForm.controls.EndDate.setValue(date);
    this.filterForm.controls.StartDate.valueChanges.subscribe(_ => {
      this.filteredAppointments = FilterAppointments(
        this.filterForm.controls.StartDate.value,
        this.filterForm.controls.EndDate.value,
        this.appointments
      );
    });
    this.filterForm.controls.EndDate.valueChanges.subscribe(_ => {
      this.filteredAppointments = FilterAppointments(
        this.filterForm.controls.StartDate.value,
        this.filterForm.controls.EndDate.value,
        this.appointments
      );
    });
  }

  ngAfterViewInit(): void {
      CenterCardWrapper(this.wrapper.nativeElement);
  }
}
