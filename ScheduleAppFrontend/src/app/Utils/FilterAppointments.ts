import { AppointmentInfo } from "../Services/ScheduleService";
import { Time } from "./Time";




export default function FilterAppointments(start: Date|null, end: Date|null, appointments: AppointmentInfo[]) {
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

