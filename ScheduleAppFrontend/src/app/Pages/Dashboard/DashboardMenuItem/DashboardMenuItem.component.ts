import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { Icon, IconType } from 'src/app/Components/Icon/Icon.component';

@Component({
  selector: 'DashboardMenuItem',
  standalone: true,
  imports: [Icon],
  templateUrl: './DashboardMenuItem.component.html',
})
export class DashboardMenuItem {
  @ViewChild('element') element!: ElementRef<HTMLElement>
  @Input() iconType: IconType = 'event_available';
  @Output() Selected = new EventEmitter<DashboardMenuItem>()
  protected selected = signal(false);

  IsSelected() {
    return this.selected()
  }

  Select() {
    this.selected.set(true);
  }

  Unselect() {
    this.selected.set(false);
  }

  OnClick() {
    this.Selected.emit(this)
  }
}
