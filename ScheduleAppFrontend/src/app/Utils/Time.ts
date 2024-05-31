import { WeekDay } from "@angular/common";


export type Hour = number;

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

  public static WeekDayToString(day : WeekDay) : string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return  days[day ?? 0];
  }
}