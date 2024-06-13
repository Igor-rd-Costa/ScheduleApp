import { WeekDay } from "@angular/common";


export type Hour = number;
export type DateTime = number;

export type HourInfo = {
  hours: number,
  minutes: number
}

export class Time {
  private constructor() {}

  public static HourFromString(hourString : string) : Hour {
    if (hourString.length !== 5 || (hourString[2] && hourString[2] !== ':'))
      return 0;
    
    const ts = hourString.split(':');
    const hours = parseInt(ts[0]);
    const minutes = parseInt(ts[1]);

    return (hours << 8) + minutes;
  }

  public static HourToString(hour : Hour) : string {
    const hours = hour >> 8;
    const minutes = hour & 0b11111111;
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

  public static HourAddMinutes(hour : Hour, minutes : number) {
    let h = hour >> 8;
    let m = hour & 0b11111111;
    m += minutes;
    while (m >= 60) {
      m -= 60;
      h += 1;
      if (h == 24)
        h = 0;
    }
    console.log(h, m);
    return (h << 8) + m;
  }

  public static WeekDayToString(day : WeekDay) : string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return  days[day ?? 0];
  }

  public static HourToHourInfo(hour : Hour) : HourInfo {
    return {hours: hour >> 8, minutes: hour & 0b11111111};
  }


  public static MakeDateTime(day : number, month: number, year : number, hour : number, minutes : number) {
    let dateTime : DateTime = minutes;
    dateTime |= (hour << 6);
    dateTime |= (year << 11);
    dateTime |= (month << 23);
    dateTime |= (day << 27);
    return dateTime;
  }

  public static DateTimeToString(dateTime : DateTime) {
    const minute = dateTime & 0b111111;
    const hour = (dateTime >> 6) & 0b11111;
    const year = (dateTime >> 11) & 0b111111111111;
    const month = (dateTime >> 23) & 0b1111;
    const day = (dateTime >> 27) & 0b11111;
    return `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute} ${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
  }
}