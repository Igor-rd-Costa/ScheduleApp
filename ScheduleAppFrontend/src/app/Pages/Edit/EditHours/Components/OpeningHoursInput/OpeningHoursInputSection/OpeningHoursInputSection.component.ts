import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'OpeningHoursInputSection',
  standalone: true,
  imports: [],
  templateUrl: './OpeningHoursInputSection.component.html',
  styles: [
    ':base {width: 100%}'
  ]
})
export class OpeningHoursInputSection {
  @ViewChild('element') element! : ElementRef<HTMLElement>;
  @ViewChild('ruler') ruler! : ElementRef<HTMLElement>;
  @Input() showMark : boolean = true;
  @Input() selected : boolean = false;
  @Input() time : string = "";
  @Output() SelectionChange = new EventEmitter<OpeningHoursInputSection>();

  Click() {
    if (this.selected) 
      this.Unselect();
    else
      this.Select();
  }

  Select() {
    this.selected = true;
    this.SelectionChange.emit(this);
  }
  
  Unselect() {
    this.selected = false;
    this.SelectionChange.emit(this);
  }

  SilentSelect() {
    this.selected = true;
  }

  SilentUnselect() {
    this.selected = false;
  }
}
