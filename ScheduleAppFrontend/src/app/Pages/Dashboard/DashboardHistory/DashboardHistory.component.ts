import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { DateInput } from 'src/app/Components/DateInput/DateInput.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import BusinessService from 'src/app/Services/BusinessService';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import { CenterCardWrapper } from 'src/app/Utils/CenterCardWrapper';
import FilterAppointments from 'src/app/Utils/FilterAppointments';

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

  constructor(private businessService: BusinessService, private scheduleService: ScheduleService) {
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
    this.filterForm.controls.StartDate.valueChanges.subscribe(_ => {
      this.filteredAppointments = FilterAppointments(
        this.filterForm.controls.StartDate.value,
        this.filterForm.controls.EndDate.value,
        this.pastAppointments()
      );
    });
    this.filterForm.controls.EndDate.valueChanges.subscribe(_ => {
      this.filteredAppointments = FilterAppointments(
        this.filterForm.controls.StartDate.value,
        this.filterForm.controls.EndDate.value,
        this.pastAppointments()
      );
    });
  }
  
  ngAfterViewInit(): void {
    CenterCardWrapper(this.wrapper.nativeElement);
  }
}
