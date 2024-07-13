import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { DateInput } from 'src/app/Components/DateInput/DateInput.component';
import { Heading } from 'src/app/Components/Heading/Heading.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { AppointmentInfo, ScheduleService } from 'src/app/Services/ScheduleService';
import { CenterCardWrapper } from 'src/app/Utils/CenterCardWrapper';
import FilterAppointments from 'src/app/Utils/FilterAppointments';

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

  public constructor(private router : Router, private scheduleService : ScheduleService) {
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

  GoToProfile() {
    this.router.navigate(['profile']);
  }
}
