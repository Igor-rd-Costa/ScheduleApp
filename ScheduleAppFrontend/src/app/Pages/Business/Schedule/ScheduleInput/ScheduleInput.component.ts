import { AfterViewInit, Component, ElementRef, Input, OnChanges, QueryList, SimpleChanges, ViewChild, ViewChildren, effect, signal, viewChild } from '@angular/core';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { ScheduleDayInput } from './ScheduleDayInput/ScheduleDayInput.component';
import { ScheduleService } from 'src/app/Services/ScheduleService';
import { Time } from 'src/app/Utils/Time';
import { ScheduleHourInput } from './ScheduleHourInput/ScheduleHourInput.component';
import { ScheduleEmployeeInput } from './ScheduleEmployeeInput/ScheduleEmployeeInput.component';
import { User } from 'src/app/Services/AuthService';
import { CardBase } from 'src/app/Components/CardBase/CardBase.component';
import BusinessService, { Business } from 'src/app/Services/BusinessService';
import { BusinessService as BusinessServiceData } from 'src/app/Services/ServicesService';
import { Router } from '@angular/router';
import { MainButton } from 'src/app/Components/MainButton/MainButton.component';
import { SecondaryButton } from 'src/app/Components/SecondaryButton/SecondaryButton.component';
import { App } from 'src/app/App.component';
import { MessageType } from 'src/app/Components/PopUpMessageBox/PopUpMessageBox.component';

type AvailableTimes = {
  morning: number[],
  afternoon: number[],
  night: number[],
  dawn: number[]
}

@Component({
  selector: 'ScheduleInput',
  standalone: true,
  imports: [Icon, ScheduleDayInput, ScheduleHourInput, ScheduleEmployeeInput, CardBase, MainButton, SecondaryButton],
  templateUrl: './ScheduleInput.component.html',
})
export class ScheduleInput implements AfterViewInit {
  Time = Time;
  @ViewChild('confirmationCard') confirmationCard! : ElementRef<HTMLElement>;
  @ViewChild('arrowLeft') arrowLeft! : Icon;
  @ViewChild('arrowRight') arrowRight! : Icon;
  @ViewChild('dayWrapper') dayWrapper! : ElementRef<HTMLElement>;
  @ViewChild('hoursWrapper') hoursWrapper! : ElementRef<HTMLElement>;
  @ViewChildren(ScheduleDayInput) days! : QueryList<ScheduleDayInput>;

  //temporary
  @ViewChildren(ScheduleHourInput) hours! : QueryList<ScheduleHourInput>;

  @Input() service : BusinessServiceData | null = null;
  @Input() business : Business | null = null;
  protected dates = signal<Date[]>([]);

  private selectedDay! : ScheduleDayInput;
  protected selectedHour : ScheduleHourInput | null = null;
  protected selectedEmployee : User | null = null;

  
  private hoursWrapperHeight = '0px';
  protected availableTimes : AvailableTimes = {
    morning: [],
    afternoon: [],
    night: [],
    dawn: []
  }

  public constructor(private scheduleService : ScheduleService, private businessService : BusinessService, private router : Router) {
    let date = new Date(Date.now());
    let dates : Date[] = [];
    for (let i = 0; i < 30; i++) {
      let newDate = new Date(date.getTime() + (i * 1000 * 60 * 60 * 24));
      dates.push(newDate);
    }
    this.dates.set(dates);
  }

  ngAfterViewInit(): void {
      const left = this.arrowLeft.element.nativeElement;
      const right = this.arrowRight.element.nativeElement;

      left.style.cursor = 'pointer';
      left.addEventListener('click', this.OnArrowLeftClick.bind(this));
      
      right.style.cursor = 'pointer';
      right.addEventListener('click', this.OnArrowRightClick.bind(this));
      if (!this.selectedDay)
        this.days.get(0)?.Select();
  }

  async OnDaySelect(target : ScheduleDayInput) {
    if (this.selectedDay)
      this.selectedDay.Unselect();
    if (this.selectedHour)
      this.UnselectHour();

    this.selectedDay = target;
    const times = await this.scheduleService.GetAvailableTimes(this.service?.id ?? -1, this.business?.id ?? "", this.selectedDay.GetDate());
    const midnight = Time.HourFromString("00:00"); 
    const moring = Time.HourFromString("06:00");
    const lunch = Time.HourFromString("12:00");
    const evening = Time.HourFromString("18:00");
    this.availableTimes.morning = times.filter(t => t >= moring && t < lunch);
    this.availableTimes.afternoon = times.filter(t => t >= lunch && t < evening);
    this.availableTimes.night = times.filter(t => t >= evening && t < midnight);
    this.availableTimes.dawn = times.filter(t => t >= midnight && t < moring);
  }

  async OnHourSelect(target : ScheduleHourInput) {
    if (this.selectedHour)
      this.selectedHour.Unselect();

    this.hoursWrapperHeight = getComputedStyle(this.hoursWrapper.nativeElement).height;
    const animation = this.hoursWrapper.nativeElement.animate([{height: this.hoursWrapperHeight}, {height: '0px'}], {fill: 'forwards', duration: 500});
    animation.addEventListener('finish', () => {
     this.selectedHour = target;
     this.hoursWrapper.nativeElement.animate([{height: '0px'}, {height: '28.9rem'}], {fill: 'forwards', duration: 300});
    });
  }

  async OnEmployeeSelected(employee : User) {
    this.selectedEmployee = employee;
    if (this.confirmationCard === undefined)
      return;
    const wrapper = this.confirmationCard.nativeElement;
    wrapper.style.display = 'block';
    let width = parseFloat(getComputedStyle(wrapper).width);
    let count = 0;
    while(width > (5 * 16)) {
      width -= (5 * 16);
      count++;
    }
    wrapper.style.paddingLeft = width / count + "px";
    wrapper.style.paddingRight = width / count + "px";
    wrapper.style.columnGap = width / count + 'px';
  }

  UnselectHour() {
    const height = getComputedStyle(this.hoursWrapper.nativeElement).height;
    this.hoursWrapper.nativeElement.animate([{height: height}, {height: '0px'}], {fill: 'forwards', duration: 300}).addEventListener('finish', () => {
      this.selectedHour = null;
      this.hoursWrapper.nativeElement.animate([{height: '0px'}, {height: this.hoursWrapperHeight}], {fill: 'forwards', duration: 300});
    });
  }

  OnArrowLeftClick() {
    const w = parseFloat(getComputedStyle(this.dayWrapper.nativeElement).width);
    const itemWidth = (4 * 16);
    const gap = (0.5 * 16);

    let total = 0;
    while (total < w) {
      total += itemWidth + gap;
    }
    this.dayWrapper.nativeElement.scrollBy({left: -total, behavior: 'smooth'});
  }

  OnArrowRightClick() {
    const w = parseFloat(getComputedStyle(this.dayWrapper.nativeElement).width);
    const itemWidth = (4 * 16);
    const gap = (0.5 * 16);

    let total = 0;
    while (total < w) {
      total += itemWidth + gap;
    }
    this.dayWrapper.nativeElement.scrollBy({left: total, behavior: 'smooth'});
  }

  async ConfirmAppointment() {
    if (!this.service || !this.business || !this.selectedEmployee || !this.selectedHour)
      return;

    const day = this.selectedDay.GetDate();
    const time = Time.HourToHourInfo(this.selectedHour.time);

    const date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.hours, time.minutes);
    const dateInt : number = this.selectedHour.time;

    const dateTime = Time.MakeDateTime(day.getDate(), day.getMonth()+1, day.getFullYear(), time.hours, time.minutes);
    console.log("DateTime", dateTime);
    console.log("ToString:", Time.DateTimeToString(dateTime));
    let status =  await this.scheduleService.Schedule(this.service.id, this.business.id, this.selectedEmployee.id, dateTime);
    if (status) {
      App.PopDownMessageBox.Show(MessageType.SUCCESS, "Your appointment was registered successfully!", 3);
      this.router.navigate(['business', this.business.businessUrl]);
    }
  }

  Cancel() {
    this.selectedEmployee = null;
    this.selectedHour = null;
  }
}
