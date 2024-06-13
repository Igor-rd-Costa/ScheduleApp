import { AfterViewInit, Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren, signal } from '@angular/core';
import { OpeningHoursInputSection } from './OpeningHoursInputSection/OpeningHoursInputSection.component';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { BusinessHourUpdateInfo, BusinessHours, BusinessHoursService } from 'src/app/Services/BusinessHoursService';
import { WeekDay } from '@angular/common';
import { Time } from 'src/app/Utils/Time';

@Component({
  selector: 'OpeningHoursInput',
  standalone: true,
  imports: [OpeningHoursInputSection, Icon],
  templateUrl: './OpeningHoursInput.component.html',
})
export class OpeningHoursInput implements AfterViewInit, OnChanges {
  @ViewChildren(OpeningHoursInputSection) sections! : QueryList<OpeningHoursInputSection>;
  @Input() hours : BusinessHours[] = [];
  @Input() day : WeekDay = WeekDay.Sunday;
  touched = signal(false);
  protected oldHours : Map<WeekDay, BusinessHourUpdateInfo[]> = new Map<WeekDay, BusinessHourUpdateInfo[]>();
  protected newHours : Map<WeekDay, BusinessHourUpdateInfo[]> = new Map<WeekDay, BusinessHourUpdateInfo[]>();

  protected dayHours : BusinessHourUpdateInfo[] = [];
  maxTimeSectionsPerDay = 4;
  sectionsPerDayCount = 0;

  log = false;
  
  public constructor(protected businessHoursService : BusinessHoursService) {}


  ngOnChanges(changes: SimpleChanges): void {
    const dayChange = changes['day'];
    if (changes['hours']) {
      for (let day = WeekDay.Sunday; day <= WeekDay.Saturday; day++) {
        this.oldHours.set(day, this.hours.filter(h => h.day === day));
      }
      this.newHours = new Map<WeekDay, BusinessHourUpdateInfo[]>();
      this.oldHours.forEach((hours, key) => {
        let array : BusinessHourUpdateInfo[] = [];
        for (let i = 0; i < hours.length; i++) {
          array.push({
            id: hours[i].id,
            day: hours[i].day,
            intervalStart: hours[i].intervalStart,
            intervalEnd: hours[i].intervalEnd
          });
        }
        this.newHours.set(key, array);
      });
      if (changes['hours'].previousValue !== undefined) {
        this.Load(this.day, this.day);
      }
    }
    if (dayChange && dayChange.previousValue !== undefined && dayChange.currentValue !== undefined) {
      this.Load(dayChange.previousValue, dayChange.currentValue);
      this.touched.update(() => this.HasChanges());
    }
  }

  ngAfterViewInit(): void {
    const firstSection = this.sections.get(0);
    const lastSection = this.sections.get(this.sections.length - 1);

    if (firstSection) {
      firstSection.element.nativeElement.style.borderTopLeftRadius = "0.25rem"; 
      firstSection.ruler.nativeElement.style.borderBottomLeftRadius = "0.25rem"; 
    }

    if (lastSection) {
      lastSection.element.nativeElement.style.borderTopRightRadius = "0.25rem";
      lastSection.ruler.nativeElement.style.borderBottomRightRadius = "0.25rem";
    }
  }

  get value() {
    this.newHours.set(this.day, this.dayHours);
    return this.newHours;
  }

  protected OnSectionSelectionChange(section : OpeningHoursInputSection) {  
    for (let i = 0; i < this.sections.length; i++) {
      const s = this.sections.get(i);
      if (s === section) {
        let timeSections : BusinessHourUpdateInfo[] = [];
        let isInsideSelection = false;
        let currentSelection : BusinessHourUpdateInfo | null = null; 
        for (let i = 0; i < this.sections.length; i++) {
          const s = this.sections.get(i)!;
          if (s.selected && !isInsideSelection) {
            currentSelection = {id: -1, day: this.day, intervalStart: Time.HourFromString(s.time), intervalEnd: -1 };
            isInsideSelection = true;
          }
        if (!s.selected && isInsideSelection) {
          if (currentSelection) {
            currentSelection.intervalEnd = Time.HourFromString(s.time);
            timeSections.push(currentSelection);
          }
          isInsideSelection = false;
        }
      }
      if (isInsideSelection && currentSelection) {
        currentSelection.intervalEnd = Time.HourFromString(this.sections.first.time);
        timeSections.push(currentSelection);
      }
      const newSections : BusinessHourUpdateInfo[] = [];
      for (let i = 0; i < timeSections.length; i++) {
        const timeSection = timeSections[i];
        let found = false;
        for (let j = 0; j < this.dayHours.length; j++) {
          const dayHour = this.dayHours[j];
          if (dayHour.intervalStart === timeSection.intervalStart) {
            timeSection.id = dayHour.id;
            if (timeSection.intervalEnd === dayHour.intervalEnd) {
              break;
              }
              if (timeSection.id !== -1) {
                found = true;
                newSections.push(timeSection);
                break;
                }
                }
          if (dayHour.intervalEnd === timeSection.intervalEnd) {
            timeSection.id = dayHour.id;
            newSections.push(timeSection);
            found = true;
          } 
        }
        if (!found) {
          newSections.push(timeSection);
        
        }
      }
      this.dayHours = newSections;
      this.sectionsPerDayCount = this.dayHours.length;
      this.touched.update(() => this.HasChanges());
      break;
      }
    }
  }

  private HasChanges() {
    for (let i : WeekDay = WeekDay.Sunday; i < WeekDay.Saturday; i++){
      const oldHours = this.oldHours.get(i) ?? [];
      const newHours = (i === this.day ? this.dayHours : this.newHours.get(i)) ?? [];
      if (oldHours.length !== newHours.length)
        return true;
      if (oldHours.length === 0 && newHours.length === 0)
        continue;
      for (let i = 0; i < oldHours.length; i++) {
        let found = false;
        for (let j =0; j < newHours.length; j++) {
          if (newHours[j].id === -1)
            return true;
          if (oldHours[i].intervalStart === newHours[j].intervalStart && oldHours[i].intervalEnd === newHours[j].intervalEnd) {
            found = true;
            break;
          }
        }
        if (!found) {
          return true;
        }
      }
    }
    return false;
  }

  public Clear() {
    this.sections.forEach(section => {
      section.SilentUnselect();
      this.dayHours = [];
      this.sectionsPerDayCount = this.dayHours.length;
    });
    this.touched.update(() => this.HasChanges());
  }

  private Load(oldDay : WeekDay, newDay : WeekDay) {
    if (oldDay !== newDay) {
      this.newHours.set(oldDay, this.dayHours);
      this.Clear();
    }
    this.dayHours = this.newHours.get(newDay) ?? [];
    
    if (this.dayHours.length > this.maxTimeSectionsPerDay)
      this.dayHours.splice(this.maxTimeSectionsPerDay);
    this.sectionsPerDayCount = this.dayHours.length;
    this.dayHours.sort((a, b) => a.intervalStart - b.intervalStart);
    if (this.dayHours[0] && this.dayHours[0].intervalStart === this.dayHours[0].intervalEnd) {
      for (let j = 0; j < this.sections.length; j++) {
        this.sections.get(j)!.SilentSelect();
      }
      return;
    }
    for (let i = 0; i < this.dayHours.length; i++) {
      const hour = this.dayHours[i];
      let gotToEnd = false;
      for (let j = 0; !gotToEnd; j++) {
        let section = this.sections.get(j);
        if (!section) {
          continue;
        }
        let time = Time.HourFromString(section.time);
        if (time === hour.intervalStart) {
          section.SilentSelect();
          while (time !== hour.intervalEnd) {
            section.SilentSelect();
            j++;
            if (j >= this.sections.length) {
              gotToEnd = true;
              j = 0;
            }
            section = this.sections.get(j);
            if (!section)
              break;
            time = Time.HourFromString(section.time);
            if (time === hour.intervalEnd) {
              gotToEnd = true;
            }
          }
        }
      }
    }
  }
} 


