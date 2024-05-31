import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppointmentCard } from 'src/app/Components/AppointmentCard/AppointmentCard.component';
import { MinimizableCard } from 'src/app/Components/MinimizableCard/MinimizableCard.component';
import CacheService from 'src/app/Services/CacheService';

@Component({
  selector: 'Dashboard',
  standalone: true,
  imports: [MinimizableCard, AppointmentCard],
  templateUrl: './Dashboard.component.html',
})
export class Dashboard implements AfterViewInit {
  @ViewChild('card') wrapper! : ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
      const wrapper = this.wrapper.nativeElement;
      let width = parseFloat(getComputedStyle(wrapper).width);
      let count = 0;
      while(width > (5 * 16)) {
        width -= (5 * 16);
        count++;
      }
      wrapper.style.paddingLeft = width / count + "px";
      wrapper.style.paddingRight = width / count + "px";
      wrapper.style.columnGap = width / count + '';
  }
}
