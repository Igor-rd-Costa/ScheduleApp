import { AppointmentInfo } from "../Services/ScheduleService";
import { Time } from "./Time";


export function FilterAppointments(start: Date|null, end: Date|null, appointments: AppointmentInfo[]) {
  let filteredAppointments = [];
  for (let i = 0; i < appointments.length; i++) {
    const appointment = appointments[i];
    const time = Time.DateTimeToDateTimeInfo(appointment.time);
    let shouldShow = true;
    time.month -= 1;
    if (start) {
      if (start.getFullYear() > time.year)
        shouldShow = false;
      else if (start.getFullYear() === time.year) {
          if (start.getMonth() > time.month)
              shouldShow = false;
          else if (start.getMonth() === time.month) {
              if (start.getDate() > time.day)
                  shouldShow = false;
          }
      }
    }

    if (end) {
      if (end.getFullYear() < time.year)
        shouldShow = false;
      else if (end.getFullYear() === time.year) {
        if (end.getMonth() < time.month)
          shouldShow = false;
        else if (end.getMonth() === time.month) {
          if (end.getDate() < time.day)
            shouldShow = false;
        }
      }
    }
    
    if (shouldShow)
      filteredAppointments.push(appointment)
  }
  return filteredAppointments.sort((a, b) => {
    if (a.time < b.time)
      return -1;
    else
      return 1;
  });
}

export function IsValidDateParamString(dateString: string|undefined) {
  if (!dateString || dateString.length !== 8)
    return false;

  const day = parseInt(dateString.substring(0, 2));
  const month = parseInt(dateString.substring(2, 4)) - 1;
  const year = parseInt(dateString.substring(4, 8));
  if (isNaN(day) || isNaN(month) || isNaN(year))
    return false;

  const date = new Date(year, month, day);
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year)
    return false;

  return true;
}

export function DateParamStringToDate(dateString: string) {
  const day = parseInt(dateString.substring(0, 2));
  const month = parseInt(dateString.substring(2, 4)) - 1;
  const year = parseInt(dateString.substring(4, 8));

  return new Date(year, month, day);
}

export function DateToDateParamString(date: Date) {
  return `${date.getDate() < 10 ? '0' : ''}${date.getDate()}${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}${date.getFullYear()}`;
}

