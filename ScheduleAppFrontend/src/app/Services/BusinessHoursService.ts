import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";
import { WeekDay } from "@angular/common";
import CacheService, { CachedDataInfo } from "./CacheService";

type BusinessHourCreateInfo = {
    day : WeekDay,
    intervalStart : number,
    intervalEnd : number,
}

export type BusinessHourUpdateInfo = {
  id : number,
  day : WeekDay,
  intervalStart : number,
  intervalEnd : number,
}

type BusinessHoursUpdateInfo = {
  createInfo : BusinessHourCreateInfo[]
  updateInfo : BusinessHourUpdateInfo[]
  deleteInfo : number[]
}

export type BusinessHours = {
    id : number,
    businessId : number,
    day : WeekDay,
    intervalStart : number,
    intervalEnd : number,
    lastEditDate : Date
}

@Injectable()
export class BusinessHoursService {
  private controllerAddress = App.backendAddress+"business-hours/"

  public constructor(private http : HttpClient, private cacheService : CacheService) {}

  async GetBusinessHours(businessId : number | null) : Promise<BusinessHours[]> {
    return new Promise<BusinessHours[]>(async resolve => {
      const bId = businessId !== null ? businessId : this.cacheService.GetLoggedBusiness()?.id ?? -1;
      const cachedHours = await this.cacheService.BusinessHoursWhere(bh => bh.businessId === bId);
      let cacheData : CachedDataInfo[] = [];
      if (bId) {
        cacheData = cachedHours.map(ch => ({id: ch.id, lastEditDate: ch.lastEditDate}));
      }
      this.http.get<BusinessHours[]>(this.controllerAddress+`?id=${businessId != null ? businessId : ''}&cache=${JSON.stringify(cacheData)}`, {withCredentials: true}).subscribe({
          next: businessHours => {
              this.cacheService.AddBusinessHours(businessHours);
              for (let i = 0; i < businessHours.length; i++) {
                let found = false;
                for (let j = 0; j < cachedHours.length; j++) {
                  if (cachedHours[j].id === businessHours[i].id) {
                    found = true;
                    cachedHours[j].day = businessHours[i].day;
                    cachedHours[j].intervalStart = businessHours[i].intervalStart;
                    cachedHours[j].intervalEnd = businessHours[i].intervalEnd;
                    cachedHours[j].lastEditDate = businessHours[i].lastEditDate;
                    break;
                  }
                }
                if (!found) {
                  cachedHours.push(businessHours[i]);  
                }
              }
              resolve(cachedHours);
          },
          error: err => {
              console.error(err);
              resolve([]);
          }
      });
    });
  }

  async UpdateBusinessHours(newHours :  Map<WeekDay, BusinessHourUpdateInfo[]>) {
    return new Promise<boolean>(async resolve => {
      const business = this.cacheService.GetLoggedBusiness();
      let updateInfo : BusinessHoursUpdateInfo = {
        createInfo: [],
        updateInfo: [],
        deleteInfo: [],
      };
      if (business) {
        const oldHours = this.SortHoursByDay(await this.cacheService.BusinessHoursWhere((bh => bh.businessId === business.id))); 
        for (let day = WeekDay.Sunday; day <= WeekDay.Saturday; day++) {
          const newDay = newHours.get(day) ?? [];
          const oldDay = oldHours.get(day) ?? [];
          for (let j = 0; j < newDay.length; j++) {
            if (newDay[j].id === -1) {
              updateInfo.createInfo.push({
                day: day,
                intervalStart: newDay[j].intervalStart,
                intervalEnd: newDay[j].intervalEnd
              });
            } 
          }
          for (let i = 0; i < oldDay.length; i++) {
            const oldHour = oldDay[i];
            let found = false;
            for (let j = 0; j < newDay.length; j++) {
              const newHour = newDay[j];
              if (newHour.id === oldHour.id) {
                found = true;
                if (oldHour.intervalStart !== newHour.intervalStart || oldHour.intervalEnd !== newHour.intervalEnd) {
                  updateInfo.updateInfo.push({
                    id: newHour.id,
                    day: day,
                    intervalStart: newHour.intervalStart,
                    intervalEnd: newHour.intervalEnd
                  });
                }
                break;
              }
            }
            if (!found) {
              updateInfo.deleteInfo.push(oldHour.id);
            }
          }
        }
      }
      console.log("After Cache:", updateInfo);
      this.http.patch<BusinessHours[]>(this.controllerAddress, {CreateInfo: updateInfo.createInfo, UpdateInfo: updateInfo.updateInfo, DeleteInfo: updateInfo.deleteInfo}, {withCredentials: true}).subscribe({
        next: async result => {
          console.log("Result:", result);
          this.cacheService.DeleteBusinessHours(updateInfo.deleteInfo);
          const toUpdate = await this.cacheService.BusinessHoursWhere(bh => {
            for (let i = 0; i < updateInfo.updateInfo.length; i++) {
              if (updateInfo.updateInfo[i].id === bh.id)
                return true;
            }
            return false;
          });
          for (let i = 0; i < updateInfo.updateInfo.length; i++) {
            for (let j = 0; j < toUpdate.length; j++) {
              if (updateInfo.updateInfo[i].id === toUpdate[j].id)
                toUpdate[j].day = updateInfo.updateInfo[i].day;
                toUpdate[j].intervalStart = updateInfo.updateInfo[i].intervalStart;
                toUpdate[j].intervalEnd = updateInfo.updateInfo[i].intervalEnd;
            }
          }
          this.cacheService.AddBusinessHours(toUpdate);
          this.cacheService.AddBusinessHours(result);
          resolve(true);
        },
        error: err => {
          console.error(err);
          resolve(false);
        }
      });
    });
  }

  private SortHoursByDay(hours : BusinessHours[]) : Map<WeekDay, BusinessHours[]> {
    const map = new Map<WeekDay, BusinessHours[]>();
    for (let day = WeekDay.Sunday; day <= WeekDay.Saturday; day++) {
      map.set(day, hours.filter(h => h.day === day));  
    }
    return map;
  }
}