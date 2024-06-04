import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Icon } from 'src/app/Components/Icon/Icon.component';
import { User } from 'src/app/Services/AuthService';

@Component({
  selector: 'EmployeeCard',
  standalone: true,
  imports: [Icon],
  templateUrl: './EmployeeCard.component.html',
})
export class EmployeeCard {
  @Input() employee! : User;
  protected selected = signal(false);
  @Output() Selected = new EventEmitter<EmployeeCard>();
  

  Select() {
    if (this.selected())
      return;
    this.selected.set(true);
    this.Selected.emit(this);
  }

  Unselect() {
    this.selected.set(false);
  }
}
